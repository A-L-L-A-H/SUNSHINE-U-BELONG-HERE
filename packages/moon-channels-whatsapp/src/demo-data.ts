export async function loadDemoData() {
  const sessions = [
    { sessionId: 'whatsapp-default', providerId: 'whatsapp', status: 'pending' }
  ]

  if (sessions.length === 0) {
    throw new Error('[moon-channels-whatsapp] loadDemoData produced empty dataset')
  }

  console.log(`[moon-channels-whatsapp] Demo data enriched: ${sessions.length} WhatsApp sessions`)
  return sessions
}
