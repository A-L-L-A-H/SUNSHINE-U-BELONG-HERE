# ◈ @moon/channels-whatsapp

WhatsApp messaging provider for `@moon/channels` using [Baileys](https://github.com/adiwajshing/Baileys).

## Provider

| Provider | ID | Description |
|---|---|---|
| `WhatsAppProvider` | `whatsapp` | WhatsApp multi-device socket adapter |

## Usage

```typescript
import { WhatsAppProvider } from '@moon/channels-whatsapp'

const wa = new WhatsAppProvider('./.baileys-auth')
await wa.connect('session-1')
await wa.sendMessage('session-1', '6281234567890', 'Hello from MoonWitness')
```

## Verification

```bash
pnpm --filter @moon/channels-whatsapp test
```
