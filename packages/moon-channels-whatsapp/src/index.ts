import { WhatsAppProvider } from './provider.js'
import type { ChannelProvider } from './types.js'

export { WhatsAppProvider }
export type { ChannelProvider }

export default {
  name: 'channels-whatsapp',
  description: 'WhatsApp messaging provider for @moon/channels using Baileys',
  depends: ['channels', 'base'],
  providers: [
    WhatsAppProvider
  ]
}
