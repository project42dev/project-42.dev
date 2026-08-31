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

1. Public content contracts come from `project42-platform`; do not duplicate them here.
2. Preserve former learning/resource URLs through path-preserving legacy-host redirects.
3. Public navigation uses relative paths; only Gallery and Admin are external portals.
4. No secrets, private PMO material, or production learner data.
5. The selected public theme comes from the root `project42.config.json`; Admin uses
   its independent fixed operational theme.
6. Build, lint, and rendered-route tests must pass before release.
