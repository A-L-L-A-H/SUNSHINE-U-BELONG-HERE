path = 'z:/repo/A-L-L-A-H/moonwitness-main/packages/moon-witness/src/index.ts'
content = open(path, 'r', encoding='latin-1').read()
addition = '''
// Witness graph models (#65 - apps/api imports)
export type {
  WxRelationType,
  WxReligion,
  WxScripture,
  WxPassage,
  WxSource,
  WxSourcePolicy,
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
} from './models/wx-relation-type.js'
export type { WxReligion } from './models/wx-religion.js'
export type { WxScripture } from './models/wx-scripture.js'
export type { WxPassage } from './models/wx-passage.js'
export type { WxSource } from './models/wx-source.js'
export type { WxSourcePolicy } from './models/wx-source-policy.js'
export type { WxFigure } from './models/wx-figure.js'
export type { WxFigureName } from './models/wx-figure-name.js'
export type { WxFigureRole } from './models/wx-figure-role.js'
export type { WxTraditionCorpus } from './models/wx-tradition-corpus.js'
export type { WxTraditionUnit } from './models/wx-tradition-unit.js'
export type { WxTraditionReference } from './models/wx-tradition-reference.js'
export type { WxTraditionAttribution } from './models/wx-tradition-attribution.js'
export type { WxTransmissionChain } from './models/wx-transmission-chain.js'
export type { WxTransmissionLink } from './models/wx-transmission-link.js'
export type { WxTraditionAssessment } from './models/wx-tradition-assessment.js'

// Corpus adapters and seed (#65 - apps/api imports)
export { MoonwitnessCorpusAdapter, CorpusReleasePayload, importCanonicalCorpus } from './adapters/moonwitness-corpus-adapter.js'
export { seedWitnessGraphCore } from './seed/graph-core.js'
'''
content = content.replace("type FigureAnalysisInput,\r\n  type TraditionAnalysisInput\r\n} from './engines/figure-tradition.js'\r\n", "type FigureAnalysisInput,\r\n  type TraditionAnalysisInput\r\n} from './engines/figure-tradition.js'\r\n" + addition)
open(path, 'w', encoding='utf-8').write(content)
print('Done')
