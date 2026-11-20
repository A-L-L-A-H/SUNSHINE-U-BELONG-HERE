# — MoonWitness Services Directory (Empty)

This directory previously hosted Python microservices (celestial-engine, i-agent).

**They have been removed.** The capabilities are now provided isomorphically by canonical TypeScript packages:

- **Celestial compute** (Qibla, Hilal, prayer times, moon phase, solar position) -> @moon/compute
- **AI semantic search** (Arabic normalization, BM25, hybrid search) -> pps/api/src/services/semantic-search.ts + @moon/witness

Both are wired into the API Gateway via pps/api/src/routes/polyglot-bridge.ts and exposed through @moon/protocol contracts.

No Python runtime, uv.lock, or virtualenv is required in this repository.
