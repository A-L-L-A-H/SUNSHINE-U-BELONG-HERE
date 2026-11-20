import { describe, it, expect } from 'vitest'
import whatsappAddon from '../src/index.js'

describe('@moon/channels-whatsapp Addon', () => {
  it('exports addon manifest with channels dependency', () => {
    expect(whatsappAddon.name).toBe('channels-whatsapp')
    expect(whatsappAddon.depends).toContain('channels')
    expect(whatsappAddon.providers.length).toBe(1)
  })

  it('registers WhatsAppProvider with correct id', () => {
    expect(whatsappAddon.providers[0].providerId).toBe('whatsapp')
  })
})
