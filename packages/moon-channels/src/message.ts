import { Vertex, fields } from '@moon/orm'

export class ChannelMessage extends Vertex {
  static override _name = 'channel.message'
  static override _description = 'Channel Message'

  channelId = fields.Many2one({ comodel: 'channel.channel', required: true, index: true })
  authorId = fields.Many2one({ comodel: 'vx.user', required: true })
  body = fields.Text({ required: true })
  messageType = fields.Selection({
    selection: [
      ['text', 'Text'],
      ['image', 'Image'],
      ['file', 'File'],
      ['system', 'System'],
      ['audio', 'Audio'],
      ['video', 'Video']
    ],
    default: 'text'
  })
  externalId = fields.Char({ size: 120, index: true })
  providerMessageId = fields.Char({ size: 120 })
  repliedToId = fields.Many2one({ comodel: 'channel.message' })
  readByIds = fields.Many2many({ comodel: 'vx.user', relation: 'channel_message_read_rel' })
  createdAt = fields.DateTime({ autoNowAdd: true })
}
