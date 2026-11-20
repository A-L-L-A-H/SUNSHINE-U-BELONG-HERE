import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useInsightStore } from '../src/stores/insight-store.js'

const mockFetch = vi.fn()

describe('@workspace/state insight-store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch as any)
    useInsightStore.setState({ insights: {} })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with empty insights', () => {
    const state = useInsightStore.getState()
    expect(state.insights).toEqual({})
  })

  it('returns cached insight within TTL', async () => {
    const now = Date.now()
    useInsightStore.setState({
      insights: {
        'surah-1': { text: 'cached insight', timestamp: now },
      },
    })
    const result = await useInsightStore.getState().getInsight('surah-1', 'text', 'translation')
    expect(result).toBe('cached insight')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('fetches insight when cache is expired or missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ insight: 'fetched insight' }),
    })
    const result = await useInsightStore.getState().getInsight('surah-2', 'arabic', 'translation')
    expect(result).toBe('fetched insight')
    expect(mockFetch).toHaveBeenCalledWith('/api/ai/insight', expect.objectContaining({ method: 'POST' }))
  })

  it('returns fallback message on fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'))
    const result = await useInsightStore.getState().getInsight('surah-3', 'arabic', 'translation')
    expect(result).toContain('Prophetic Intel')
  })
})
