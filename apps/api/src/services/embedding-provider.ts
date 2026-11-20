/**
 * EmbeddingProvider - deterministic, zero-network embedding for dev / offline.
 *
 * Projects text into a fixed-dimensional vector using token frequency over a
 * stable concept vocabulary. Production can swap in an external model (ONNX,
 * OpenAI embeddings, etc.) by implementing the same interface.
 */

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
  dimension: number
}

// Concept vocabulary for stable deterministic embeddings (Arabic/Indonesian/English)
const CONCEPT_VOCABULARY: Record<string, string[]> = {
  LUNAR_CALENDAR: ['hilal', 'crescent', 'bulan', 'sabit', 'manzilah', 'ahillah', 'orbit', 'fase', 'urjun', 'lunar', 'moon'],
  CELESTIAL_COSMOLOGY: ['matahari', 'bulan', 'bintang', 'astronomi', 'falak', 'shams', 'qamar', 'celestial', 'sun', 'syams', 'kosmos'],
  FASTING_RAMADHAN: ['puasa', 'ramadhan', 'shaum', 'sawm', 'iftar', 'sahur', 'syawal', 'rukyah', 'berpuasa', 'fasting'],
  PRAYER_DEVOTION: ['salat', 'sholat', 'prayer', 'qibla', 'kiblat', 'sujud', 'ruku', 'fajr', 'maghrib', 'dhuhr', 'asr', 'isha', 'ibadah'],
  PILGRIMAGE_HAJJ: ['haji', 'hajj', 'umrah', 'makkah', 'kaaba', 'tawaf', 'arafah', 'ihram', 'pilgrimage'],
  TIME_CALCULATION: ['waktu', 'tahun', 'hisab', 'perhitungan', 'bilangan', 'time', 'calendar', 'calculation', 'years'],
}

const CONCEPT_KEYS = Object.keys(CONCEPT_VOCABULARY) as (keyof typeof CONCEPT_VOCABULARY)[]
const CONCEPT_DIMENSIONS = CONCEPT_KEYS.length

function tokenize(text: string): string[] {
  if (!text) return []
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
  return words.filter((w) => w.length > 1)
}

export class DeterministicEmbeddingProvider implements EmbeddingProvider {
  readonly dimension = CONCEPT_DIMENSIONS

  async embed(text: string): Promise<number[]> {
    const safeText = text ?? ''
    const tokens = new Set(tokenize(safeText))
    const vector: number[] = []
    for (const key of CONCEPT_KEYS) {
      const dim = CONCEPT_VOCABULARY[key]!
      const overlap = tokens.size > 0
        ? [...tokens].filter((t) => dim.includes(t)).length / dim.length
        : 0
      vector.push(Math.round(overlap * 1000) / 1000)
    }
    return vector
  }
}

export const defaultEmbeddingProvider: EmbeddingProvider = new DeterministicEmbeddingProvider()

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    const ai = a[i]
    const bi = b[i]
    if (ai !== undefined && bi !== undefined) {
      dot += ai * bi
      na += ai * ai
      nb += bi * bi
    }
  }
  const norm = Math.sqrt(na) * Math.sqrt(nb)
  return norm === 0 ? 0 : Math.max(0, Math.min(1, dot / norm))
}
