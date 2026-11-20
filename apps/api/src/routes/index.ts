import type { NativeServer } from "@moon/server"
import { registerExternalProxies } from "./external-proxies.js"
import { registerPolyglotBridge } from "./polyglot-bridge.js"
import { registerSystemRoutes } from "./system.js"
import { registerPublicCorpusRoutes } from "./public-corpus.js"
import { registerAuthRoutes } from "./auth.js"

export function registerAllRoutes(server: NativeServer): void {
  registerAuthRoutes(server)
  registerExternalProxies(server)
  registerPolyglotBridge(server)
  registerSystemRoutes(server)
  registerPublicCorpusRoutes(server)
}
