import { Vertex, fields } from '@moon/orm'

export class Channel extends Vertex {
  static override _name = 'channel.channel'
  static override _description = 'Communication Channel'

  name = fields.Char({ required: true, size: 120, index: true })
  code = fields.Char({ size: 40, index: true })
  type = fields.Selection({
    selection: [
      ['public', 'Public'],
      ['private', 'Private'],
      ['encrypted', 'Encrypted']
    ],
    default: 'public'
  })
  description = fields.Text()
  provider = fields.Char({ size: 40 })
  providerInstanceId = fields.Char({ size: 120 })
  companyId = fields.Many2one({ comodel: 'vx.org' })
  memberIds = fields.One2many({ comodel: 'channel.member', inverse: 'channelId' })
}
