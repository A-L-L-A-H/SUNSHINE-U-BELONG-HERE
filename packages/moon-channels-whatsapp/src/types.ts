export interface ChannelProviderSendResult {
  messageId: string
  provider: string
  timestamp: string
}

export type ChannelProviderEvent = 'connection.update' | 'creds.update' | 'message'

export interface ChannelSession {
  sessionId: string
  providerId: string
  status: string
  qrCode?: string
  lastError?: string
}

export interface ChannelProvider {
  readonly providerId: string
  readonly providerName: string
  connect(sessionId: string): Promise<void>
  disconnect(sessionId: string): Promise<void>
  sendMessage(sessionId: string, to: string, body: string): Promise<ChannelProviderSendResult>
  registerSession(sessionId: string): Promise<ChannelSession>
  getSession(sessionId: string): ChannelSession | undefined
  on(event: ChannelProviderEvent, handler: (payload: unknown) => void): void
}
