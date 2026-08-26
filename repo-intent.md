# Repo intent — project-42.dev

**The public Project 42 gateway.**

## What this repo is

Introduces the Project 42 project and routes visitors to the separate Learn and
Field Guide experiences, while preserving legacy route redirects and a
consent-based browser progress transfer. The Project 42 ecosystem includes a
twelve-module Reliable Agent Workflows path and a sixteen-module AI Foundations
path, with a practical capstone (calibration packages, required operating
artifacts, evidence mapping, a 100-point rubric, and the Reliable Agent Operator
badge).

## Shape

- Next.js app (`app/`, `next.config.ts`, `worker/` for edge deployment)
- `npm run verify` — full/production dependency audits, lint, type, build,
  rendered-route, link, browser, GitHub Pages, and accessibility checks (see
  `docs/dependency-security.md`)

## How it relates to other repos

- Consumes the versioned open-source learning core from
  **`project42dev/project42-platform`** — this repo is presentation/routing, not
  the content source
- Routes to **`learn.project-42.dev`** and **`guide.project-42.dev`**

## What this repo is not

- Per `REPO-BOUNDARY.md`: not the platform core, not the PMO/ops repo (`project42dev-ops`)

## Status

Active — the public entry point for the whole Project 42 site family.
