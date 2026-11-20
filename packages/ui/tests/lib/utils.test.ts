import { describe, it, expect } from 'vitest'
import { cn } from '../../src/lib/utils.js'

describe('@workspace/ui lib/utils', () => {
  it('merges class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })

  it('resolves tailwind merge conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})
