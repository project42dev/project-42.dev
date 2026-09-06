# AGENTS.md

## Purpose

This repository is the unified public Project 42 portal at `project-42.dev`.
Learning, Field Guide, profile, and ecosystem information are same-origin routes.

## Stack

- TypeScript, React, Next-compatible app router through vinext
- GitHub Pages static deployment; Cloudflare manages DNS only
- Reusable ecosystem facts and redirect inventory from `@project42/platform`

## Commands

```bash
npm ci
npm run dev
npm run lint
npm test
```

## Rules

0. **The application is not source in this repository.** `app/`, `lib/`, `copy/`,
   `worker/`, `scripts/` (except `mint-github-app-token.mjs`), `tests/` (except
   `production/`) and the build configuration are installed from
   `@project42/platform` by `project42-portal materialise` and are git-ignored.
   Editing one of them here edits a build output: it is overwritten on the next
   install, and `git add`ing one makes the materialiser refuse to run at all.
   Change them in `project42-platform/web` and bump the pin. Change wording in
   `project42.copy.json` and appearance in `project42.config.json`.
1. Public content contracts come from `project42-platform`; do not duplicate them here.
2. Preserve former learning/resource URLs through path-preserving legacy-host redirects.
3. Public navigation uses relative paths; only Gallery and Admin are external portals.
4. No secrets, private PMO material, or production learner data.
5. The selected public theme comes from the root `project42.config.json`; Admin uses
   its independent fixed operational theme.
6. Build, lint, and rendered-route tests must pass before release.
