/**
 * RagPipeline — Deterministic RAG pipeline for @moon/witness.
 *
 * Combines pgvector semantic search (HNSW index on WxPassage/WxContent)
 * with Witness engine runtime for reproducible, citation-traceable answers.
 * Every output is traceable to its source passage + provenance; nothing is
 * represented as source text.
 */
import type { EmbeddingProvider } from './embedding-provider.js'
import type { EngineRunStore } from '../types/engine.js'
import type { RbacContext } from '@moon/orm'
import { WitnessEngineRuntime, WitnessEngineRegistry } from './engine-runtime.js'
import { createRevelationQueryModule } from '../engines/revelation-query.js'

export interface RagSource {
  id: string
  type: 'scripture' | 'hadith' | 'translation' | 'commentary' | 'analysis'
  reference: string
  text_ar?: string
  text_en?: string
  similarity_score: number
  provenance?: string
}

export interface RagResult {
  query: string
  answer: string
  sources: RagSource[]
  engine_run_id?: string
  confidence: number
  traceable: boolean
}

export interface RagPipelineOptions {
  topK?: number
  alpha?: number
  minSimilarity?: number
  requireProvenance?: boolean
}

export class RagPipeline {
  private provider: EmbeddingProvider
  private engineRegistry: WitnessEngineRegistry
  private ctx: RbacContext
  private options: Required<RagPipelineOptions>

  constructor(
    provider: EmbeddingProvider,
    engineRegistry: WitnessEngineRegistry,
    ctx: RbacContext,
    options: RagPipelineOptions = {}
  ) {
    this.provider = provider
    this.engineRegistry = engineRegistry
    this.ctx = ctx
    this.options = {
      topK: options.topK ?? 5,
      alpha: options.alpha ?? 0.5,
      minSimilarity: options.minSimilarity ?? 0.3,
      requireProvenance: options.requireProvenance ?? true,
    }
  }

  async run(query: string): Promise<RagResult> {
    const queryEmbedding = await this.provider.embed(query)

    // 1. Semantic retrieval over pgvector HNSW-indexed passages
    const passages = await this.retrievePassages(queryEmbedding)

    // 2. Filter by minimum similarity
    const filtered = passages.filter((p) => p.similarity_score >= this.options.minSimilarity)

    // 3. Require provenance if configured
    const provFiltered = this.options.requireProvenance
      ? filtered.filter((p) => p.provenance)
      : filtered

    // 4. Build answer from sources (extractive, not generative)
    const answer = this.buildExtractiveAnswer(query, provFiltered)

    // 5. Run through Witness engine runtime for determinism + checksum
    const engineRun = await this.runEngine(query, provFiltered)

    return {
      query,
      answer,
      sources: provFiltered,
      engine_run_id: engineRun?.id,
      confidence: this.computeConfidence(provFiltered),
      traceable: provFiltered.length > 0 && this.options.requireProvenance,
    }
  }

  private async retrievePassages(queryEmbedding: number[]): Promise<RagSource[]> {
    // This is a placeholder that delegates to pgvector via @moon/orm.
    // Production implementation queries WxPassage/WxContent with vector_cosine_ops
    // HNSW index, returning top-K by cosine similarity.
    return []
  }

  private buildExtractiveAnswer(query: string, sources: RagSource[]): string {
    if (sources.length === 0) {
      return 'Tidak ada sumber yang relevan ditemukan untuk kueri ini.'
    }
    const top = sources[0]!
    return `Berdasarkan ${top.reference}: ${top.text_en ?? top.text_ar ?? ''}`
  }

  private async runEngine(
    query: string,
    sources: RagSource[]
  ): Promise<{ id: string } | undefined> {
    this.engineRegistry.register(createRevelationQueryModule())
    const store: EngineRunStore = {
      create: async () => ({ id: 'rag-run-store' }),
      complete: async () => ({}),
      fail: async () => ({}),
      getRun: async () => undefined,
      getResult: async () => undefined,
    }
    const runtime = new WitnessEngineRuntime(store, {})
    try {
      const run = await runtime.runModule(this.ctx, {
        moduleCode: 'revelation.query',
        moduleVersion: '1.0.0',
        input: { query, sources },
      })
      return { id: (run as any).id }
    } catch {
      return undefined
    }
  }

  private computeConfidence(sources: RagSource[]): number {
    if (sources.length === 0) return 0
    const avgScore =
      sources.reduce((sum, s) => sum + s.similarity_score, 0) / sources.length
    return Math.round(avgScore * 100) / 100
  }
}

export function createRagPipeline(
  provider: EmbeddingProvider,
  engineRegistry: WitnessEngineRegistry,
  ctx: RbacContext,
  options?: RagPipelineOptions
): RagPipeline {
  return new RagPipeline(provider, engineRegistry, ctx, options)
}
