export type ChannelSessionStatus = 'pending' | 'qr_code' | 'connected' | 'disconnected'

export interface ChannelSession {
  sessionId: string
  providerId: string
  status: ChannelSessionStatus
  qrCode?: string
  lastError?: string
}

export namespace ChannelSessionStatus {
  export const PENDING: ChannelSessionStatus = 'pending'
  export const QR_CODE: ChannelSessionStatus = 'qr_code'
  export const CONNECTED: ChannelSessionStatus = 'connected'
  export const DISCONNECTED: ChannelSessionStatus = 'disconnected'
}
