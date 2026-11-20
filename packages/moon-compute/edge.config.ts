/**
 * Edge deployment configuration for @moon/compute.
 *
 * @moon/compute is zero-network, zero-database pure math. It can be deployed
 * to Vercel Edge Functions / Cloudflare Workers for sub-50ms celestial
 * compute (Qibla, prayer times, moon phase, hilal) at the edge.
 */
export interface EdgeComputeConfig {
  runtime: 'edge' | 'node'
  region?: string
  cacheControl?: string
}

export const edgeConfig: EdgeComputeConfig = {
  runtime: 'edge',
  cacheControl: 'public, s-maxage=86400, stale-while-revalidate=604800',
}

export type {
  QiblaResult,
  PrayerTimesResult,
  MoonPhaseResult,
  SunPositionResult,
  HilalVisibilityResult,
} from './src/qibla.js'
export type {
  PrayerTimesResult as DailyPrayerTimesResult,
} from './src/prayer-times.js'
export type { MoonPhaseResult as MoonDataResult } from './src/moon-phase.js'
export type { SunPositionResult as SunDataResult } from './src/sun-position.js'
