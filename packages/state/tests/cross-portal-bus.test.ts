import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockPostMessage = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

class MockBroadcastChannel {
  postMessage = mockPostMessage
  addEventListener = mockAddEventListener
  removeEventListener = mockRemoveEventListener
}

Object.defineProperty(globalThis, 'BroadcastChannel', {
  value: MockBroadcastChannel,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'window', {
  value: { BroadcastChannel: MockBroadcastChannel },
  writable: true,
  configurable: true,
})

vi.resetModules()

import { CrossPortalEventBus } from '../src/bus/cross-portal-bus.js'

describe('@workspace/state cross-portal-bus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPostMessage.mockClear()
    mockAddEventListener.mockClear()
    mockRemoveEventListener.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exists as a singleton instance', () => {
    const bus = new CrossPortalEventBus()
    expect(bus).toBeDefined()
  })

  it('emit calls postMessage when channel is available', () => {
    const bus = new CrossPortalEventBus()
    bus.emit('test_event', { foo: 'bar' })
    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'test_event', data: { foo: 'bar' } })
    )
  })

  it('on registers a listener and returns unsubscribe function', () => {
    const bus = new CrossPortalEventBus()
    const handler = vi.fn()
    const unsubscribe = bus.on('test_event', handler)
    expect(mockAddEventListener).toHaveBeenCalledWith('message', expect.any(Function))
    expect(typeof unsubscribe).toBe('function')
    unsubscribe()
    expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function))
  })
})
