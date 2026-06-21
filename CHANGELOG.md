# Changelog

All notable changes are documented here.

## [Unreleased]

### Added
- Phase 2: Multi-tenant browser context
  - `dashboard/src/lib/tenant.ts` + `talk/src/lib/tenant.ts` — in-memory tenant context, `hasFlag`, `tenantHeaders`
  - `dashboard/tests/tenant.test.ts` — vitest unit tests
  - `docs/01-ARCHITECTURE.md` updated with multi-tenant model note

## [0.1.0] - 2026-06-21

### Added
- pnpm workspace with `dashboard/` and `talk/` packages
- React 19 + Vite + Tailwind v4 scaffolds for both apps
- Vitest + Testing Library smoke tests
- 8-doc CTO navigation under `docs/`
- CI gating (prettier + tsc + vitest)
- Dependabot, PR/issue templates, SECURITY.md

### Notes
- Live components migrate from `MUNENE1212/ardalink-ai` in Phase 3.
- Generated API hooks land in v0.2.0.