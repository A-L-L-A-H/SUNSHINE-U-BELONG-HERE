import { defineRoute, type NativeServer } from "@moon/server"

/**
 * Native Services Bridge (@moon/compute & @moon/witness)
 *
 * No service endpoints needed - frontend uses proper domain API endpoints
 * @moon/compute: /api/prayer-times, /api/sun-position, /api/qibla, etc.
 * @moon/witness: /api/witness/search, /api/scriptures, etc.
 */
export function registerPolyglotBridge(_server?: NativeServer): void {
  // Intentionally empty - services are consumed directly via domain API routes
}

