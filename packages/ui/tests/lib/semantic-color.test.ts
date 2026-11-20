import { describe, it, expect } from 'vitest'
import {
  resolveSemanticColor,
  resolveVisualizationColor,
  isSemanticColorToken,
  SEMANTIC_COLOR_TOKENS,
} from '../../src/lib/semantic-color.js'

describe('@workspace/ui lib/semantic-color', () => {
  it('resolves semantic color tokens to CSS variables', () => {
    expect(resolveSemanticColor('primary')).toBe('var(--primary)')
    expect(resolveSemanticColor('foreground')).toBe('var(--foreground)')
    expect(resolveSemanticColor('destructive')).toBe('var(--destructive)')
  })

  it('resolves tajweed tokens', () => {
    expect(resolveSemanticColor('tajweed.madda')).toBe('var(--tajweed-madda)')
    expect(resolveSemanticColor('tajweed.qalaqah')).toBe('var(--tajweed-qalaqah)')
  })

  it('resolves visualization colors from legacy map', () => {
    expect(resolveVisualizationColor('#00F0FF')).toBe('var(--info)')
    expect(resolveVisualizationColor('#10B981')).toBe('var(--success)')
    expect(resolveVisualizationColor('#F59E0B')).toBe('var(--warning)')
  })

  it('passes through unknown visualization values', () => {
    expect(resolveVisualizationColor('#FFFFFF')).toBe('#FFFFFF')
  })

  it('identifies semantic color tokens', () => {
    expect(isSemanticColorToken('primary')).toBe(true)
    expect(isSemanticColorToken('invalid')).toBe(false)
  })

  it('exposes all semantic color tokens', () => {
    expect(SEMANTIC_COLOR_TOKENS.primary).toBe('var(--primary)')
    expect(SEMANTIC_COLOR_TOKENS.destructive).toBe('var(--destructive)')
  })
})
