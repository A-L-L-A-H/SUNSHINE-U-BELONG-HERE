import { describe, it, expect } from 'vitest'
import {
  useAchievementStore as achievementStore,
  useGraphStore as graphStore,
  useGuildStore as guildStore,
  useInsightStore as insightStore,
  useNotificationStore as notificationStore,
  useOSStore as osStore,
  useQuestStore as questStore,
} from '../src/stores/index.js'
import { isBookmarked } from '../src/stores/bookmark-store.js'

describe('@workspace/state', () => {
  it('exports all centralized zustand stores', () => {
    expect(achievementStore).toBeDefined()
    expect(graphStore).toBeDefined()
    expect(guildStore).toBeDefined()
    expect(insightStore).toBeDefined()
    expect(notificationStore).toBeDefined()
    expect(osStore).toBeDefined()
    expect(questStore).toBeDefined()
  })

  it('bookmark store exports isBookmarked function', () => {
    expect(isBookmarked).toBeDefined()
  })

  it('cross-portal bus exports event types', async () => {
    const bus = await import('../src/bus/cross-portal-bus.js')
    const types = await import('../src/bus/event-types.js')
    expect(bus).toBeDefined()
    expect(types).toBeDefined()
  })

  it('providers module exports index', async () => {
    const providers = await import('../src/providers/index.js')
    expect(providers).toBeDefined()
  })
})
