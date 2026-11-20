import { describe, it, expect } from 'vitest'
import channelsAddon from '../src/index.js'
import { Channel, ChannelMember, ChannelMessage } from '../src/index.js'

describe('@moon/channels Addon', () => {
  it('exports addon manifest with base dependency', () => {
    expect(channelsAddon.name).toBe('channels')
    expect(channelsAddon.depends).toContain('base')
    expect(channelsAddon.models.length).toBe(3)
  })

  it('defines channel models with correct metadata', () => {
    expect(Channel._name).toBe('channel.channel')
    expect(ChannelMember._name).toBe('channel.member')
    expect(ChannelMessage._name).toBe('channel.message')
  })
})
