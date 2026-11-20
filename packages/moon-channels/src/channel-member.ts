import { Vertex, fields } from '@moon/orm'

export class ChannelMember extends Vertex {
  static override _name = 'channel.member'
  static override _description = 'Channel Member'

  channelId = fields.Many2one({ comodel: 'channel.channel', required: true, index: true })
  userId = fields.Many2one({ comodel: 'vx.user', required: true, index: true })
  role = fields.Selection({
    selection: [
      ['owner', 'Owner'],
      ['admin', 'Admin'],
      ['moderator', 'Moderator'],
      ['member', 'Member']
    ],
    default: 'member'
  })
  joinedAt = fields.DateTime({ autoNowAdd: true })
  isActive = fields.Boolean({ default: true })
}
