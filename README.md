<div align="center">

# ArdaLink Web

### Operator dashboard and public Talk voice app

ArdaLink Web hosts the two user-facing surfaces: an operator dashboard for
monitoring drought status and herder ground truth, and a public Talk app
that lets anyone converse with ArdaLink in their browser.

[![Node](https://img.shields.io/badge/Node-24-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![License](https://img.shields.io/badge/license-Proprietary-lightgrey)](#license)

</div>

---

## Quickstart

```bash
# Requires Node 24 and pnpm 9
pnpm install
cp .env.example .env          # edit
pnpm --filter dashboard run dev    # http://localhost:5173
pnpm --filter talk run dev         # http://localhost:5174
```

Both apps read their OpenAPI hooks from
[`MUNENE1212/ardalink-api/lib/api-spec/openapi.yaml`](https://github.com/MUNENE1212/ardalink-api/blob/main/lib/api-spec/openapi.yaml).

---

## What's in here

| App | Path | Audience |
|---|---|---|
| **Operator dashboard** | `dashboard/` | Internal — drought status, ground truth, call controls |
| **Public Talk** | `talk/` | Anyone — browser voice + chat, no phone required |

## Repository layout

```
ardalink-web/
├── dashboard/                  React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── components/         WardMapLive, CallModal, CostRailsCard
│   │   ├── pages/              dashboard, call-receiver
│   │   └── lib/                browserVoice bridge
│   └── vite.config.ts
├── talk/                       React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── vite.config.ts
├── pnpm-workspace.yaml
├── package.json
└── docs/                       8-doc CTO navigation
```

---

## Documentation

Start with [`docs/00-EXECUTIVE-INDEX.md`](docs/00-EXECUTIVE-INDEX.md) (5 min).

---

## Sister repos

- [`MUNENE1212/ardalink-api`](https://github.com/MUNENE1212/ardalink-api) — backend + voice bridge
- [`MUNENE1212/ardalink-engine`](https://github.com/MUNENE1212/ardalink-engine) — biophysical brain

---

## License

Proprietary — all rights reserved. Contact the maintainer before any reuse or distribution.