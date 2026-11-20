''
/**
 * RagPipeline - Deterministic RAG pipeline for @moon/witness.
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
import type { EngineRunRecord, EngineResultEnvelope } from '../types/engine.js'

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
  ): Promise<EngineRunRecord | undefined> {
    this.engineRegistry.register(createRevelationQueryModule())
    const mockStore: EngineRunStore = {
      persistent: false,
      create: async (_ctx: unknown, record: Omit<EngineRunRecord, 'id'>): Promise<EngineRunRecord> => {
        return { ...record, id: 'rag-run-' + Date.now() }
      },
      complete: async (_ctx: unknown, _runId: string, _result: EngineResultEnvelope, _outputChecksum: string) => {},
      fail: async (_ctx: unknown, _runId: string, _code: string, _diagnostics: string) => {},
      getRun: async (_ctx: unknown, _runId: string) => null,
      getResult: async (_ctx: unknown, _runId: string) => null,
    }
    const runtime = new WitnessEngineRuntime(mockStore, {})
    try {
      const result = await runtime.runModule(this.ctx, {
        moduleCode: 'revelation.query',
        moduleVersion: '1.0.0',
        input: { query, sources },
      })
      // The store.create is called internally and returns the run record
      // We need to get the run ID from the store
      const runs = await mockStore.getRun(this.ctx, 'rag-run-')
      return runs ?? undefined
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