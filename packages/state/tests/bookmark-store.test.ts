import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let storage: Record<string, string> = {}

vi.mock('@workspace/hooks', () => ({
  safeGetStorage: vi.fn((key: string) => storage[key] || null),
  safeSetStorage: vi.fn((key: string, value: string) => {
    storage[key] = value
  }),
}))

import { safeGetStorage, safeSetStorage } from '@workspace/hooks'
import { getBookmarks, isBookmarked, toggleBookmark } from '../src/stores/bookmark-store.js'

const mockSafeGetStorage = vi.mocked(safeGetStorage)
const mockSafeSetStorage = vi.mocked(safeSetStorage)

const mockDispatchEvent = vi.fn()

Object.defineProperty(globalThis, 'window', {
  value: {
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    dispatchEvent: mockDispatchEvent,
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  writable: true,
  configurable: true,
})

describe('@workspace/state bookmark-store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    storage = {}
    mockDispatchEvent.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getBookmarks returns empty array when storage is empty', () => {
    expect(getBookmarks()).toEqual([])
  })

  it('isBookmarked returns false for empty storage', () => {
    expect(isBookmarked('abc')).toBe(false)
  })

  it('toggleBookmark adds a new bookmark', () => {
    const item = {
      id: 'ayah-1',
      type: 'ayah' as const,
      title: 'Test',
      subtitle: 'Sub',
      href: '/test',
      timestamp: Date.now(),
    }
    const result = toggleBookmark(item)
    expect(result).toBe(true)
    expect(isBookmarked('ayah-1')).toBe(true)
  })

  it('toggleBookmark removes an existing bookmark', () => {
    const item = {
      id: 'ayah-2',
      type: 'ayah' as const,
      title: 'Test',
      subtitle: 'Sub',
      href: '/test',
      timestamp: Date.now(),
    }
    toggleBookmark(item)
    const result = toggleBookmark(item)
    expect(result).toBe(false)
    expect(isBookmarked('ayah-2')).toBe(false)
  })
})
