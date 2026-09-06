# Repository boundary

This file states what this repository is for, what must never be added to it,
and where to look instead.

It has been rewritten. The previous version described a topology that no longer
exists: separate `learn.`, `guide.` and `account.` surfaces, and canonical
content living in `project42-platform`. All three subdomains were folded into
this single origin and archived, the curriculum moved to `project42-content`,
and — as of platform v0.103.0 — the rendering application itself moved to
`project42-platform`.

## What this is

**One deployment of the Project 42 platform: `project-42.dev`.**

Branding, configuration, and release records. Nothing else.

- Visibility: **public**
- The application is **not** source here. `app/`, `lib/`, `copy/`, `worker/`,
  `scripts/`, `tests/` and the build configuration are installed from
  `@project42/platform` by `project42-portal materialise`, which this
  repository's `postinstall` runs. They are git-ignored build inputs.

## What is actually tracked here

| Path | What it is |
|---|---|
| `project42.config.json` | Theme, layout, origins, organisation, branding paths |
| `project42.copy.json` | This deployment's wording, overriding the platform's defaults |
| `config/` | Roadmap, release notes, link-check exceptions, performance budget, retired paths, the Gallery bundle lock |
| `public/brand/` | This deployment's brand source artwork |
| `public/themes/`, `public/layouts/` | Gallery bundles, hash-locked in `config/theme-bundles.lock.json` |
| `public/diagrams/`, the generated icon set, `public/release-facts.json` | Generated artifacts, committed so the build works air-gapped |
| `scripts/mint-github-app-token.mjs` | This owner's GitHub App tooling |
| `tests/production/` | Acceptance tests that drive this live deployment |
| `CHANGELOG.md`, `RELEASE_NOTES.md`, `.github/`, the governance documents | This repository's own records |

## What must never go here

| Do not add | Because | Where it belongs |
|---|---|---|
| **A route, a component, a stylesheet, a gate** | It is product. Adding it here forks it away from every other adopter, and the materialiser refuses to install over a tracked file. | `project42-platform`, under `web/` |
| **Curriculum** | Presentation consumes released content; it never produces it. | `project42-content` |
| **Content authoring tooling** | The content lifecycle sits upstream of the content drop. | `orchard`, private |
| **Anything derived from learner data** | This repository is public. | The account API and its record store |
| **Owner administration UI** | Admin is a separate origin with a fixed operational theme. | `admin.project-42.dev` |

If you need to change a page, change it in `project42-platform/web` and bump the
platform pin here. If you only need different words, put them in
`project42.copy.json`.

## Looking for something else?

| Looking for | It lives in |
|---|---|
| The rendering application, the platform contracts, the adopter CLI | `project42-platform` |
| The curriculum, the content model, and its schemas | `project42-content` |
| Themes, layouts, tokens, marks, hero artwork, badges | `project42-gallery` |
| The content lifecycle: discovery, authoring, currency | `orchard`, private |
| Owner administration | `admin.project-42.dev` |
| Planning, sprints, ADRs, board records | `project42dev-ops`, private |

## The rule in one line

**This repository decides how Project 42 looks and what it says. It does not
decide how it works.**
