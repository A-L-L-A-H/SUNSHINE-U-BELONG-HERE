import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Channel = getModel('channel.channel')
  const ChannelMember = getModel('channel.member')
  const ChannelMessage = getModel('channel.message')
  const User = getModel('vx.user')

  if (!Channel || !ChannelMember || !ChannelMessage) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    channels?: { name: string; code: string; type: string; description?: string }[]
    members?: { channelName: string; userLogin: string; role: string }[]
    messages?: { channelName: string; authorLogin: string; body: string; messageType?: string }[]
  }>('channels')

  let adminUserId: number | undefined
  if (User) {
    const uRows = await User.fetch(User, env, [['login', '=', 'admin@moonwitness.org']])
    if (uRows.length) adminUserId = uRows[0].id as number
  }

  if (!adminUserId) throw new Error('[moon-channels] loadDemoData: admin user not found')

  // ── Channels ──
  const channelSeeds = jsonSeed?.channels || [
    { name: 'Observatory General', code: 'obs-general', type: 'public', description: 'General observatory coordination channel' },
    { name: 'Crescent Sighting Council', code: 'hilal-council', type: 'private', description: 'Restricted hilal observation committee' },
    { name: 'Encrypted Scripture Review', code: 'cripto-uthmani', type: 'encrypted', description: 'End-to-end encrypted Uthmani orthography review' }
  ]
  const channelIds: Record<string, number> = {}
  for (const c of channelSeeds) {
    const rows = await Channel.fetch(Channel, env, [['code', '=', c.code]])
    let row: { id: number }
    if (!rows.length) {
      row = await Channel.spawn(Channel, env, {
        name: c.name,
        code: c.code,
        type: c.type,
        description: c.description ?? '',
        companyId: undefined
      }) as { id: number }
    } else {
      row = rows[0] as { id: number }
    }
    channelIds[c.code] = row.id
  }

  // ── Members ──
  const memberSeeds = jsonSeed?.members || [
    { channelName: 'Observatory General', userLogin: 'admin@moonwitness.org', role: 'owner' },
    { channelName: 'Crescent Sighting Council', userLogin: 'admin@moonwitness.org', role: 'owner' },
    { channelName: 'Encrypted Scripture Review', userLogin: 'admin@moonwitness.org', role: 'owner' }
  ]
  for (const m of memberSeeds) {
    const channelRow = await Channel.fetch(Channel, env, [['name', '=', m.channelName]])
    if (!channelRow.length) continue
    const channelId = channelRow[0].id as number
    const existing = await ChannelMember.fetch(ChannelMember, env, [
      ['channelId', '=', channelId],
      ['userId', '=', adminUserId]
    ])
    if (!existing.length) {
      await ChannelMember.spawn(ChannelMember, env, {
        channelId,
        userId: adminUserId,
        role: m.role,
        isActive: true
      })
    }
  }

  // ── Messages ──
  const messageSeeds = jsonSeed?.messages || [
    { channelName: 'Observatory General', authorLogin: 'admin@moonwitness.org', body: 'Observatory network synchronized with JPL Horizons VSOP87 ephemeris.', messageType: 'system' },
    { channelName: 'Crescent Sighting Council', authorLogin: 'admin@moonwitness.org', body: 'Hilal committee meeting scheduled for next crescent cycle.', messageType: 'text' },
    { channelName: 'Encrypted Scripture Review', authorLogin: 'admin@moonwitness.org', body: 'Surah Al-Mulk ayat 1-30 Uthmani orthography verified.', messageType: 'text' }
  ]
  for (const msg of messageSeeds) {
    const channelRow = await Channel.fetch(Channel, env, [['name', '=', msg.channelName]])
    if (!channelRow.length) continue
    const channelId = channelRow[0].id as number
    const existing = await ChannelMessage.fetch(ChannelMessage, env, [
      ['channelId', '=', channelId],
      ['body', '=', msg.body]
    ])
    if (!existing.length) {
      await ChannelMessage.spawn(ChannelMessage, env, {
        channelId,
        authorId: adminUserId,
        body: msg.body,
        messageType: msg.messageType ?? 'text'
      })
    }
  }

  const result = {
    channels: channelSeeds.length,
    members: memberSeeds.length,
    messages: messageSeeds.length
  }

  if (result.channels === 0 || result.members === 0 || result.messages === 0) {
    throw new Error(`[moon-channels] loadDemoData produced empty dataset: ${JSON.stringify(result)}`)
  }

  console.log(`[moon-channels] Demo data enriched: ${result.channels} channels, ${result.members} members, ${result.messages} messages`)
  return result
}
