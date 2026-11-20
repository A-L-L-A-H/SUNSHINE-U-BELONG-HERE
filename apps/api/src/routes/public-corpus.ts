/**
 * Public Corpus API routes.
 *
 * Exposes versioned corpus releases from moonwitness-corpus via @moon/witness
 * ingestion (WxSourceManifest, WxSourceArtifact, WxPassage). Public endpoints
 * require no authentication; all data is read-only and traceable to source.
 */
import type { NativeServer } from '@moon/server'
import { defineRoute } from '@moon/server'
import { MoonwitnessCorpusAdapter } from '@moon/witness'
import type { ImportContext, NormalizedArtifact, CorpusReleasePayload } from '@moon/witness'
import { importCanonicalCorpus } from '@moon/witness'

export function registerPublicCorpusRoutes(server: NativeServer): void {
  defineRoute({
    method: 'GET',
    path: '/api/public/corpus/releases',
    auth: 'none',
    tags: ['Public Corpus'],
    summary: 'List available canonical corpus releases',
    handler: async () => ({
      releases: [],
      source: 'moonwitness-corpus',
      note: 'Corpus releases are managed via moonwitness-corpus and ingested through @moon/witness',
    }),
  })

  defineRoute({
    method: 'GET',
    path: '/api/public/corpus/releases/:releaseId/passages',
    auth: 'none',
    tags: ['Public Corpus'],
    summary: 'List passages from a specific corpus release',
    handler: async (ctx) => {
      const releaseId = String(ctx.params?.releaseId ?? '')
      return {
        release_id: releaseId,
        passages: [],
        total: 0,
        source: 'moonwitness-corpus',
      }
    },
  })

  defineRoute({
    method: 'POST',
    path: '/api/public/corpus/sync',
    auth: 'admin',
    tags: ['Public Corpus'],
    summary: 'Trigger canonical corpus sync (admin only)',
    handler: async (ctx) => {
      const manifest = String(ctx.body?.manifest ?? '')
      const dryRun = Boolean(ctx.body?.dry_run ?? true)
      if (!manifest) {
        return { error: 'manifest is required', status: 400 }
      }
      const adapter = new MoonwitnessCorpusAdapter()

      const importCtx: ImportContext = {
        env: {} as any,
        manifestId: 0,
        snapshotId: 0,
        manifestCode: 'api-sync',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0.0',
      }
      const parsed = await adapter.parse(Buffer.from(manifest, 'utf8'), importCtx)
      const normalized = await adapter.normalize(parsed, importCtx)
      const result = await importCanonicalCorpus(normalized, importCtx)
      return { synced: result, dry_run: dryRun }
    },
  })
}
