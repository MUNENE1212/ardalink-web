# 01 — Architecture

[← Executive Index](00-EXECUTIVE-INDEX.md) · [Next: API →](02-API.md)

## At a glance

```
ardalink-api (REST + WS, JWT) ──► ardalink-web (browser)
                                       │
                                       ├── dashboard/ (operator UI)
                                       └── talk/ (public voice + chat)
```

- Both apps use **TanStack Query** for server state, **Wouter** for routing,
  **Tailwind v4** for styling, and **Framer Motion** for animation.
- API hooks are **generated from ardalink-api OpenAPI** (Phase 3).
- The Realtime API for browser voice is reached through `ardalink-api`'s
  `/api/browser-voice-stream` WebSocket.

## Multi-tenant context (v0.2.0)

Both apps read tenant context from a short-lived JWT held in memory only
(via `src/lib/tenant.ts`). The context exposes `tenantId`, `displayName`,
`region`, and feature flags. UI guards call `hasFlag('voice_outbound')` etc.
to show or hide tenant-inappropriate affordances.

**Browser-side context is advisory only** — server-side enforcement is in
`ardalink-api` (JWT verification) and `ardalink-engine` (Postgres RLS). Never
trust the browser alone.