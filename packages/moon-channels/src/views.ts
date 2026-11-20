import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'channel.channel': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'Hash',
    table: {
      columns: ['name', 'code', 'type', 'provider', 'companyId'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['name', 'code']
    },
    form: {
      title: 'CHANNEL',
      sections: [
        { title: 'Channel', columns: 2, fields: ['name', 'code', 'type', 'provider'] },
        { title: 'Provider', columns: 2, fields: ['providerInstanceId', 'companyId'] },
        { title: 'Description', columns: 1, fields: ['description'] }
      ],
    },
  },

  'channel.member': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'Users',
    table: {
      columns: ['channelId', 'userId', 'role', 'joinedAt', 'isActive'],
      defaultSort: { field: 'joinedAt', direction: 'desc' },
      searchKeys: ['userId']
    },
    form: {
      title: 'CHANNEL MEMBER',
      sections: [
        { title: 'Membership', columns: 2, fields: ['channelId', 'userId', 'role', 'isActive'] },
      ],
    },
  },

  'channel.message': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'MessageCircle',
    table: {
      columns: ['channelId', 'authorId', 'messageType', 'body', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['body', 'authorId']
    },
    form: {
      title: 'CHANNEL MESSAGE',
      sections: [
        { title: 'Message', columns: 2, fields: ['channelId', 'authorId', 'messageType'] },
        { title: 'Content', columns: 1, fields: ['body'] },
      ],
    },
  },
}
