# ◈ @moon/channels

Multi-provider messaging channel layer for MoonWitness. Provides core channel, membership, and message models extensible by provider adapters.

## Models

| Model | Description |
|---|---|
| `channel.channel` | Communication channel (public/private/encrypted) |
| `channel.member` | Channel membership with role |
| `channel.message` | Channel message with provider tracking |

## Usage

```typescript
import channelsAddon from '@moon/channels'
// models registered via ORM registry
```

## Verification

```bash
pnpm --filter @moon/channels test
```
