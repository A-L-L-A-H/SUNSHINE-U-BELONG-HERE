import { Channel } from './channel.js'
import { ChannelMember } from './channel-member.js'
import { ChannelMessage } from './message.js'
import { views } from './views.js'

export { views }
export { Channel, ChannelMember, ChannelMessage }

export default {
  name: 'channels',
  description: 'Multi-provider messaging channels and message relay',
  depends: ['base'],
  models: [
    Channel,
    ChannelMember,
    ChannelMessage
  ]
}
