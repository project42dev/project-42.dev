# Repo intent — project-42.dev

**One deployment of the Project 42 platform.**

## What this repo is

The owner's own front end. It holds branding, configuration and release records,
and the rendering application is installed into it from `@project42/platform` at
`npm install` time by `project42-portal materialise`. Everything a visitor sees
is served from this single origin: the gateway, `/learn/*`, `/guide/*`,
`/ondemand/*`, `/diagrams/*`, `/profile` and `/account`, plus permanent
redirects for every route the earlier subdomain topology published.

## Shape

- Tracked: `project42.config.json`, `project42.copy.json`, `config/`,
  `public/brand/`, the synced Gallery bundles and their lock, generated brand
  and diagram artifacts, `.github/`, and this repository's governance and
  release records.
- Git-ignored and installed: `app/`, `lib/`, `copy/`, `worker/`, `scripts/`
  (except `mint-github-app-token.mjs`), `tests/` (except `production/`), and the
  build configuration.
- `npm run verify` — production audit plus the full `check` chain: theme
  boundary, token completeness, surface isolation, PWA, diagrams, workflow and
  documentation governance, release governance, lint, typecheck, build,
  performance budget, rendered HTML, link integrity, the Playwright browser
  suite, and the static-export artifact.

## How it relates to other repos

- **`project42dev/project42-platform`** — the product. The application, the
  learning-record and identity contracts, and the `project42-portal` CLI. Pinned
  by tag in `package.json`.
- **`project42dev/project42-content`** — the curriculum, consumed by the
  platform and hash-locked there.
- **`project42dev/project42-gallery`** — themes and layouts, synced into
  `public/` and hash-locked in `config/theme-bundles.lock.json`.
- **`admin.project-42.dev`** — owner administration, deliberately a separate
  origin.

## What this repo is not

Not the product. A change to a route, a component, the design system or a gate
belongs in `project42-platform/web`; see `REPO-BOUNDARY.md`.

## Status

Active — the owner's production deployment, and the reference instance the
scaffolder emits a template of.
