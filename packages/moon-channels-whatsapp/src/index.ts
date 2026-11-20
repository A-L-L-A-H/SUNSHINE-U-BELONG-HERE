import { WhatsAppProvider } from './provider.js'
import type { ChannelProvider } from './types.js'
import { loadDemoData } from './demo-data.js'

export { WhatsAppProvider }
export type { ChannelProvider }
export { loadDemoData }

export default {
  name: 'channels-whatsapp',
  description: 'WhatsApp messaging provider for @moon/channels using Baileys',
  depends: ['channels', 'base'],
  providers: [
    WhatsAppProvider
  ]
}
