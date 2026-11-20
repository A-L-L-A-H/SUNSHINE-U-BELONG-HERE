import makeWASocket, { useMultiFileAuthState, DisconnectReason, WASocket } from '@adiwajshing/baileys'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { ChannelProvider, ChannelProviderEvent, ChannelProviderSendResult } from './types.js'
import type { ChannelSession } from './types.js'

export class WhatsAppProvider implements ChannelProvider {
  readonly providerId = 'whatsapp'
  readonly providerName = 'WhatsApp (Baileys)'
  private sock: WASocket | null = null
  private sessionDir: string
  private sessions: Map<string, ChannelSession> = new Map()

  constructor(sessionDir?: string) {
    this.sessionDir = sessionDir ?? join(process.cwd(), '.baileys-auth')
    if (!existsSync(this.sessionDir)) mkdirSync(this.sessionDir, { recursive: true })
  }

  async connect(sessionId: string): Promise<void> {
    const statePath = join(this.sessionDir, sessionId)
    const { state, saveCreds } = await useMultiFileAuthState(statePath)

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    })

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update
      const session = this.sessions.get(sessionId)
      if (!session) return

      if (qr) {
        session.status = 'qr_code'
        session.qrCode = qr
      }

      if (connection === 'open') {
        session.status = 'connected'
        session.qrCode = undefined
      }

      if (connection === 'close') {
        session.status = 'disconnected'
        const reason = lastDisconnect?.error
        session.lastError = reason ? String(reason.message) : String(DisconnectReason[lastDisconnect?.error?.name ?? 0] ?? '')
      }
    })

    this.sock.ev.on('creds.update', saveCreds)
  }

  async disconnect(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return
    await this.sock!.end({ reason: 'disconnect' })
    this.sock = null
    session.status = 'disconnected'
  }

  async sendMessage(sessionId: string, to: string, body: string): Promise<ChannelProviderSendResult> {
    if (!this.sock) throw new Error('WhatsApp socket not connected')
    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`
    const res = await this.sock.sendMessage(jid, { text: body })
    return { messageId: res.key.id ?? '', provider: 'whatsapp', timestamp: new Date().toISOString() }
  }

  async registerSession(sessionId: string): Promise<ChannelSession> {
    const session: ChannelSession = {
      sessionId,
      providerId: 'whatsapp',
      status: 'pending',
    }
    this.sessions.set(sessionId, session)
    return session
  }

  getSession(sessionId: string): ChannelSession | undefined {
    return this.sessions.get(sessionId)
  }

  on(event: ChannelProviderEvent, handler: (payload: unknown) => void): void {
    if (!this.sock) return
    this.sock.ev.on(event as unknown as keyof import('@adiwajshing/baileys').BaileysEventMap, handler as unknown as Parameters<WASocket['ev']['on']>[1])
  }
}
