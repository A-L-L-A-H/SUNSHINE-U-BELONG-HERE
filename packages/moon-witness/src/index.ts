// Astronomy (pure compute — no DB)
// Astronomy is provided isomorphically by @moon/compute (zero-network, pure math).
export { getMoonData, type MoonData } from '@moon/compute'
export { getDailyPrayerTimes, type DailyPrayerTimes } from '@moon/compute'
export { getSunPosition, type SunPositionData } from '@moon/compute'

// Routes
export { registerWitnessRoutes } from './routes.js'
export { registerWitnessEngineRoutes } from './engine-routes.js'

// Ingestion pipeline exports (#65)
export type {
  WitnessSourceAdapter,
  ImportContext,
  NormalizedArtifact,
  NormalizedRecord,
  ValidationReport,
  ValidationFinding,
  ImportResult,
  ArtifactVerification,
  SourceKind,
  AuthorityClass,
  AllowedEngineUse,
  RevelationFamily,
  SourceLineage
} from './types/ingestion.js'

export type {
  AnalysisFindingStatus,
  AnalysisFindingV1,
  EvidenceRef,
  EvidenceSummaryStatus,
  MizanProjectionV1,
  ReviewGateV1,
  ScoreResultV1,
  SemanticProviderMetadata,
  SourceGroundingV1,
  WitnessAnalyzeInputV1,
  WitnessAnalyzeResultV1,
  WitnessSemanticProvider,
  WitnessSemanticObservationV1
} from './types/analyze.js'

export {
  unavailableSemanticObservation,
  validateSemanticObservation,
  WITNESS_ANALYZE_INPUT_V1,
  WITNESS_ANALYZE_RESULT_V1,
  WITNESS_SEMANTIC_OBSERVATION_V1
} from './types/analyze.js'

export { validateAnalyzeResult } from './services/analyze-contract.js'
export { analyzeWitness } from './services/analyze.js'
export type { EmbeddingProvider } from './services/embedding-provider.js'
export { defaultEmbeddingProvider, cosineSimilarity } from './services/embedding-provider.js'

// Reusable engine kernel (#57)
export type {
  EngineAiMetadata,
  EngineEvidenceCandidate,
  EngineEvidenceExplanation,
  EngineEvidenceReference,
  EngineFinding,
  EngineFindingCandidate,
  EngineFindingStatus,
  EngineOutputAuthorityClass,
  EngineResultDraft,
  EngineResultEnvelope,
  EngineRunRecord,
  EngineRunRequest,
  EngineRunStore,
  EngineScope,
  EngineScopeInput,
  EngineSourceRevision,
  WitnessEngineModule
} from './types/engine.js'
export { WITNESS_ENGINE_RESULT_V1, WITNESS_ENGINE_RUNTIME_VERSION } from './types/engine.js'
export { resolveEngineScope, checksumEngineScope } from './services/engine-scope.js'
export { finalizeEngineResult, checksumEngineResult } from './services/engine-evidence.js'
export { SCORE_PROFILES, getScoreProfile, score, scoreEntity, scoreRelation, scoreAssertion, scoreEvidence, scoreFinding, toEngineScore, independentEvidence, type EvidenceIndependenceInput, type WitnessScoreDimension, type WitnessScoreProfile, type WitnessScoreResult } from './services/scoring.js'
export { persistScoreResult, type PersistScoreInput } from './services/score-store.js'
export { InMemoryEngineRunStore, MoonOrmEngineRunStore } from './services/engine-store.js'
export { WitnessEngineRegistry, WitnessEngineRuntime } from './services/engine-runtime.js'
export {
  REVELATION_FAMILIES,
  createRevelationQueryModule,
  resolveRevelationPassageContext,
  validateRevelationQueryInput,
  type RevelationContentWitness,
  type RevelationPassageContext,
  type RevelationQueryInput
} from './engines/revelation-query.js'
export {
  buildCrossScriptureEvidenceMatrix,
  createCrossScriptureComparisonModule,
  validateCrossScriptureComparisonInput,
  type CrossScriptureComparisonInput,
  type CrossScriptureEvidenceClass,
  type CrossScriptureEvidenceEntry,
  type CrossScriptureEvidenceMatrix
} from './engines/cross-scripture.js'
export {
  createFigureAnalysisModule,
  createTraditionTransmissionModule,
  validateFigureAnalysisInput,
  validateTraditionAnalysisInput,
  type FigureAnalysisInput,
  type TraditionAnalysisInput
} from './engines/figure-tradition.js'

// Witness graph models (#65 - apps/api imports)
export { default as WxRelationType } from './models/wx-relation-type.js'
export { default as WxReligion } from './models/wx-religion.js'
export { default as WxScripture } from './models/wx-scripture.js'
export { default as WxPassage } from './models/wx-passage.js'
export { default as WxSource } from './models/wx-source.js'
export { default as WxSourcePolicy } from './models/wx-source-policy.js'
export { default as WxFigure } from './models/wx-figure.js'
export { default as WxFigureName } from './models/wx-figure-name.js'
export { default as WxFigureRole } from './models/wx-figure-role.js'
export { default as WxTraditionCorpus } from './models/wx-tradition-corpus.js'
export { default as WxTraditionUnit } from './models/wx-tradition-unit.js'
export { default as WxTraditionReference } from './models/wx-tradition-reference.js'
export { default as WxTraditionAttribution } from './models/wx-tradition-attribution.js'
export { default as WxTransmissionChain } from './models/wx-transmission-chain.js'
export { default as WxTransmissionLink } from './models/wx-transmission-link.js'
export { default as WxTraditionAssessment } from './models/wx-tradition-assessment.js'
export { default as WxEntity } from './models/wx-entity.js'
export { default as WxEntityAlias } from './models/wx-entity-alias.js'
export { default as WxEngineResult } from './models/wx-engine-result.js'
export { default as WxProvenance } from './models/wx-provenance.js'
export { default as WxRelation } from './models/wx-relation.js'

// Additional witness models
export { default as WxAsmaulHusna } from './models/wx-asmaul-husna.js'
export { default as WxAssertion } from './models/wx-assertion.js'
export { default as WxBookmark } from './models/wx-bookmark.js'
export { default as WxCommunity } from './models/wx-community.js'
export { default as WxConcept } from './models/wx-concept.js'
export { default as WxContent } from './models/wx-content.js'
export { default as WxDevotion } from './models/wx-devotion.js'
export { default as WxDivineExpression } from './models/wx-divine-expression.js'
export { default as WxDivineExpressionOccurrence } from './models/wx-divine-expression-occurrence.js'
export { default as WxEngineRun } from './models/wx-engine-run.js'
export { default as WxEntityIdentifier } from './models/wx-entity-identifier.js'
export { default as WxEvidence } from './models/wx-evidence.js'
export { default as WxHistory } from './models/wx-history.js'
export { default as WxLegacyMapping } from './models/wx-legacy-mapping.js'
export { default as WxLexeme } from './models/wx-lexeme.js'
export { default as WxLexicalOccurrence } from './models/wx-lexical-occurrence.js'
export { default as WxRevelationEvent } from './models/wx-revelation-event.js'
export { default as WxRevelationEventPassage } from './models/wx-revelation-event-passage.js'
export { default as WxRoot } from './models/wx-root.js'
export { default as WxScoreResult } from './models/wx-score-result.js'
export { default as WxScriptureBook } from './models/wx-scripture-book.js'
export { default as WxScriptureVerse } from './models/wx-scripture-verse.js'
export { default as WxSourceArtifact } from './models/wx-source-artifact.js'
export { default as WxSourceManifest } from './models/wx-source-manifest.js'
export { default as WxSourceSnapshot } from './models/wx-source-snapshot.js'
export { default as WxTextEdition } from './models/wx-text-edition.js'
export { default as WxTradition } from './models/wx-tradition.js'
export { default as WxTraditionItem } from './models/wx-tradition-item.js'
export { default as WxResearchHypothesis } from './models/wx-research-hypothesis.js'
export { default as WxResearchRun } from './models/wx-research-run.js'

// Graph service
export { WitnessGraphService } from './graph/service.js'

// Corpus adapters and seed (#65 - apps/api imports)
export { MoonwitnessCorpusAdapter } from './adapters/moonwitness-corpus-adapter.js'
export type { CorpusReleasePayload } from './adapters/moonwitness-corpus-adapter.js'
export { importCanonicalCorpus } from './services/canonical-corpus-importer.js'
export { seedWitnessGraphCore } from './seed/graph-core.js'
export { loadDemoData } from './demo-data.js'
export { views } from './views.js'

import { registerWitnessRoutes } from './routes.js'
import { registerWitnessEngineRoutes } from './engine-routes.js'
import { seedWitnessGraphCore } from './seed/graph-core.js'
import { loadDemoData } from './demo-data.js'
import { views } from './views.js'
import WxEntity from './models/wx-entity.js'
import WxRelation from './models/wx-relation.js'
import WxRelationType from './models/wx-relation-type.js'
import WxSource from './models/wx-source.js'
import WxSourcePolicy from './models/wx-source-policy.js'
import WxProvenance from './models/wx-provenance.js'
import WxPassage from './models/wx-passage.js'
import WxTextEdition from './models/wx-text-edition.js'
import WxContent from './models/wx-content.js'
import WxScripture from './models/wx-scripture.js'
import WxReligion from './models/wx-religion.js'
import WxFigure from './models/wx-figure.js'
import WxFigureName from './models/wx-figure-name.js'
import WxFigureRole from './models/wx-figure-role.js'
import WxTraditionCorpus from './models/wx-tradition-corpus.js'
import WxTraditionUnit from './models/wx-tradition-unit.js'
import WxTraditionReference from './models/wx-tradition-reference.js'
import WxTraditionAttribution from './models/wx-tradition-attribution.js'
import WxTransmissionChain from './models/wx-transmission-chain.js'
import WxTransmissionLink from './models/wx-transmission-link.js'
import WxTraditionAssessment from './models/wx-tradition-assessment.js'
import WxEntityAlias from './models/wx-entity-alias.js'
import WxEngineResult from './models/wx-engine-result.js'
import WxAsmaulHusna from './models/wx-asmaul-husna.js'
import WxAssertion from './models/wx-assertion.js'
import WxBookmark from './models/wx-bookmark.js'
import WxCommunity from './models/wx-community.js'
import WxConcept from './models/wx-concept.js'
import WxDevotion from './models/wx-devotion.js'
import WxDivineExpression from './models/wx-divine-expression.js'
import WxDivineExpressionOccurrence from './models/wx-divine-expression-occurrence.js'
import WxEngineRun from './models/wx-engine-run.js'
import WxEntityIdentifier from './models/wx-entity-identifier.js'
import WxEvidence from './models/wx-evidence.js'
import WxHistory from './models/wx-history.js'
import WxLegacyMapping from './models/wx-legacy-mapping.js'
import WxLexeme from './models/wx-lexeme.js'
import WxLexicalOccurrence from './models/wx-lexical-occurrence.js'
import WxRevelationEvent from './models/wx-revelation-event.js'
import WxRevelationEventPassage from './models/wx-revelation-event-passage.js'
import WxRoot from './models/wx-root.js'
import WxScoreResult from './models/wx-score-result.js'
import WxScriptureBook from './models/wx-scripture-book.js'
import WxScriptureVerse from './models/wx-scripture-verse.js'
import WxSourceArtifact from './models/wx-source-artifact.js'
import WxSourceManifest from './models/wx-source-manifest.js'
import WxSourceSnapshot from './models/wx-source-snapshot.js'
import WxTradition from './models/wx-tradition.js'
import WxTraditionItem from './models/wx-tradition-item.js'
import WxResearchHypothesis from './models/wx-research-hypothesis.js'
import WxResearchRun from './models/wx-research-run.js'

export default {
  name: 'witness',
  description: 'Witness graph & corpus addon',
  depends: ['base'],
  models: [
    WxEntity,
    WxRelation,
    WxRelationType,
    WxSource,
    WxSourcePolicy,
    WxProvenance,
    WxPassage,
    WxTextEdition,
    WxContent,
    WxScripture,
    WxReligion,
    WxFigure,
    WxFigureName,
    WxFigureRole,
    WxTraditionCorpus,
    WxTraditionUnit,
    WxTraditionReference,
    WxTraditionAttribution,
    WxTransmissionChain,
    WxTransmissionLink,
    WxTraditionAssessment,
    WxEntityAlias,
    WxEngineResult,
    WxAsmaulHusna,
    WxAssertion,
    WxBookmark,
    WxCommunity,
    WxConcept,
    WxDevotion,
    WxDivineExpression,
    WxDivineExpressionOccurrence,
    WxEngineRun,
    WxEntityIdentifier,
    WxEvidence,
    WxHistory,
    WxLegacyMapping,
    WxLexeme,
    WxLexicalOccurrence,
    WxRevelationEvent,
    WxRevelationEventPassage,
    WxRoot,
    WxScoreResult,
    WxScriptureBook,
    WxScriptureVerse,
    WxSourceArtifact,
    WxSourceManifest,
    WxSourceSnapshot,
    WxTradition,
    WxTraditionItem,
    WxResearchHypothesis,
    WxResearchRun
  ],
  views,
  registerWitnessRoutes,
  registerWitnessEngineRoutes,
  seedWitnessGraphCore,
  loadDemoData,
}
