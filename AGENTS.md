# AGENTS.md

## Purpose

This repository is the branded public Project 42 gateway at `project-42.dev`.
Structured learning belongs in `learn.project-42.dev`; practical references belong
in `guide.project-42.dev`.

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
2. Preserve former learning/resource URLs through generated redirects.
3. The progress-transfer bridge must use exact origins, one storage key, and explicit
   learner approval; never imply cloud persistence.
4. No secrets, private PMO material, or production learner data.
5. Learn and Field Guide application features do not belong in this repository.
6. Build, lint, and rendered-route tests must pass before release.
