import { describe, expect, it } from 'vitest'
import { calculateQiblaBearing, degreesToCompass } from '../src/qibla.js'
import { calculateLunarPhaseCycle } from '../src/moon-phase.js'
import { calculateDetailedPrayerTimes, type PrayerConvention } from '../src/prayer-times.js'

describe('@moon/compute', () => {
  it('calculates a stable Qibla result for Jakarta', () => {
    const result = calculateQiblaBearing(-6.2088, 106.8456)

    expect(result.qibla_bearing_deg).toBeGreaterThan(290)
    expect(result.qibla_bearing_deg).toBeLessThan(300)
    expect(result.distance_to_kabah_km).toBeGreaterThan(7_000)
    expect(result.cardinal_direction).toBe(degreesToCompass(result.qibla_bearing_deg))
  })

  it('normalizes compass angles across the zero-degree boundary', () => {
    expect(degreesToCompass(-1)).toBe('N')
    expect(degreesToCompass(360)).toBe('N')
    expect(degreesToCompass(180)).toBe('S')
  })

  it('keeps lunar phase output bounded and deterministic', () => {
    const result = calculateLunarPhaseCycle(0)

    expect(result.phase_name).toBe('New Moon')
    expect(result.illumination_fraction).toBeGreaterThanOrEqual(0)
    expect(result.illumination_fraction).toBeLessThanOrEqual(1)
    expect(result.age_days).toBe(0)
  })

  it('calculates prayer times for all supported conventions', () => {
    const conventions: PrayerConvention[] = [
      'MUSLIM_WORLD_LEAGUE',
      'EGYPTIAN',
      'KARACHI',
      'UMM_AL_QURA',
      'DUBAI',
      'MOONSIGHTING_COMMITTEE',
      'NORTH_AMERICA',
      'KUWAIT',
      'QATAR',
      'SINGAPORE',
      'TEHRAN',
      'TURKEY',
      'KEMENAG',
    ]

    for (const convention of conventions) {
      const result = calculateDetailedPrayerTimes(-6.2, 106.8, '2026-01-15', 7, convention)
      expect(result.convention).toBe(convention)
      expect(result.fajr).toMatch(/^\d{2}:\d{2}$/)
      expect(result.dhuhr).toMatch(/^\d{2}:\d{2}$/)
      expect(result.asr).toMatch(/^\d{2}:\d{2}$/)
      expect(result.maghrib).toMatch(/^\d{2}:\d{2}$/)
      expect(result.isha).toMatch(/^\d{2}:\d{2}$/)
      expect(result.qibla_bearing).toBeGreaterThan(290)
      expect(result.qibla_bearing).toBeLessThan(300)
    }
  })

  it('calculates prayer times with custom angles for OTHER convention', () => {
    const result = calculateDetailedPrayerTimes(
      -6.2, 106.8, '2026-01-15', 7, 'OTHER', 18.0, 17.0
    )
    expect(result.convention).toBe('OTHER')
    expect(result.fajr).toMatch(/^\d{2}:\d{2}$/)
    expect(result.isha).toMatch(/^\d{2}:\d{2}$/)
  })
})
