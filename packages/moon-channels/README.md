# ◈ @moon/channels

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/channels                                          ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    0.1.0                                                   ║
║  CLASSIFICATION: TIER 3 — MULTI-PROVIDER MESSAGING CHANNELS              ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview

`@moon/channels` provides core channel, member, and message models for the MoonWitness multi-provider messaging layer. Built on Vertex ORM with declarative view manifests for Command Center rendering.

## 📦 Public API Surface

| Model | `_name` | Description |
|-------|---------|-------------|
| `Channel` | `channel.channel` | Chat channel (public / private / encrypted) |
| `ChannelMember` | `channel.member` | Channel membership with role and status |
| `ChannelMessage` | `channel.message` | Channel message with replies and read receipts |

| Export | Description |
|--------|-------------|
| `views` | View manifests for all three models (table / form configs) |
| `loadDemoData()` | Idempotent demo data loader |

## 🚀 Usage

```typescript
import channelsAddon from '@moon/channels'

channelsAddon.name        // 'channels'
channelsAddon.depends     // ['base']
channelsAddon.models      // [Channel, ChannelMember, ChannelMessage]
```

## 🛡️ Architectural Boundaries

- Belongs to **Tier 3 (Domain Intelligence & Services)**.
- Extends `@moon/orm` (`Vertex` base class).
- Depends on `@moon/base`.

## 🧪 Verification

```bash
pnpm --filter @moon/channels build
pnpm --filter @moon/channels test
```

## View Configuration

This package exports declarative view manifests (`src/views.ts`):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center
- Supported view modes: Table, Form Modal
