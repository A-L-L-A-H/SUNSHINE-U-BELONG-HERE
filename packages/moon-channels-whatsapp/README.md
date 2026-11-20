# ◈ @moon/channels-whatsapp

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/channels-whatsapp                                 ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    0.1.0                                                   ║
║  CLASSIFICATION: TIER 3 — WHATSAPP MESSAGING PROVIDER (BAILEYS V5)       ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview

`@moon/channels-whatsapp` provides a WhatsApp messaging provider for `@moon/channels` using Baileys v5 (`makeWASocket`). Implements the `ChannelProvider` interface for multi-session WhatsApp connectivity with QR code pairing, credential persistence, and message dispatch.

## 📦 Public API Surface

| Provider | `providerId` | Description |
|----------|--------------|-------------|
| `WhatsAppProvider` | `whatsapp` | WhatsApp via Baileys v5 (`makeWASocket`) |

| Export | Description |
|--------|-------------|
| `WhatsAppProvider` | WhatsApp provider class implementing `ChannelProvider` |
| `ChannelProvider` | Provider interface type (exported as type) |
| `loadDemoData()` | Idempotent demo data loader |

## 🚀 Usage

```typescript
import whatsappAddon from '@moon/channels-whatsapp'

whatsappAddon.name        // 'channels-whatsapp'
whatsappAddon.depends     // ['channels', 'base']
whatsappAddon.providers   // [WhatsAppProvider]
```

## 🛡️ Architectural Boundaries

- Belongs to **Tier 3 (Domain Intelligence & Services)**.
- Depends on `@moon/channels`, `@moon/base`, `@moon/orm`.
- Uses `@adiwajshing/baileys@^5.0.0` for WhatsApp connectivity.

## 🧪 Verification

```bash
pnpm --filter @moon/channels-whatsapp build
pnpm --filter @moon/channels-whatsapp test
```
