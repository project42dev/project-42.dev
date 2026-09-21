# Project 42

The unified Project 42 public portal. The gateway, learning paths, Field Guide,
learner profile, and ecosystem pages all use same-origin routes under
`project-42.dev`. Gallery and Admin remain intentionally separate portals.

## This repository is a deployment, not the application

Branding, configuration and release records live here. The rendering
application — `app/`, `lib/`, `copy/`, `worker/`, `scripts/`, `tests/` and the
build configuration — is **product**: it lives in
[`project42dev/project42-platform`](https://github.com/project42dev/project42-platform)
under `web/`, and is installed here by `project42-portal materialise`, which
`postinstall` runs. Those paths are git-ignored build inputs.

- To change a **page, component, style or gate**: change it in the platform and
  bump the pin in `package.json`.
- To change **wording**: put the leaf you want into `project42.copy.json`.
  Anything you leave out keeps the platform's default.
- To change **appearance**: change `theme` or `layout.defaultPreset` in
  `project42.config.json`, then materialise the selected bundles, regenerate brand assets, and rebuild. See the platform theming guide for Gallery synchronization when applicable.

`REPO-BOUNDARY.md` has the full inventory. `npm run doctor` reports anything
this repository is missing.

## Develop

```bash
npm ci
npm run dev
```

`npm run app:materialise` reinstalls the application by hand after a platform
bump. It refuses to overwrite anything git tracks, so forking a product file is
a deliberate act rather than an accident.

## Verify

```bash
npm run verify
```

`npm run verify` runs the configured production dependency audit before the complete
lint, type, build, rendered-route, link, browser, GitHub Pages, and accessibility
checks. See [`docs/dependency-security.md`](docs/dependency-security.md) for the audit
policy and the reviewed transitive-dependency remediation.

The site consumes the versioned open-source learning core from
[`project42dev/project42-platform`](https://github.com/project42dev/project42-platform).
The deployed catalog supplies the current learning paths, modules, resources and
assessment totals below. Approved accounts store progress and transcripts through
the protected account service. Browser-local progress and its transfer flow are
retired. The learner-data page describes consent, export, deletion and recovery.

Diagram sources are maintained with the canonical curriculum in
`project42-content`, distributed through the platform package, and rendered into
reviewed static assets before deployment. See
[`docs/diagram-authoring.md`](docs/diagram-authoring.md).

## Current ecosystem facts

<!-- release-facts:start -->
- Site release `0.20.1`
- Platform package `0.117.6`
- Content release `0.42.0`
- 14 learning paths, 95 assessed modules, 95 evidence activities, and 546 reviewed questions
- 91 practical resources and 4 provider scopes
<!-- release-facts:end -->

These facts are generated from `package.json` and the tagged platform catalog into
[`public/release-facts.json`](public/release-facts.json). `npm run facts:check`
fails when versions, licenses, repositories, issue links, counts, or provider coverage
drift.

## Repositories

- `project-42.dev` — unified landing, Learn, Field Guide, profile, and information portal
- `learn.project-42.dev` — legacy host that redirects to canonical same-path routes
- `guide.project-42.dev` — legacy host that redirects into canonical `/guide` routes
- `gallery.project-42.dev` — public, unauthenticated theme gallery
- `admin.project-42.dev` — role-protected operational portal
- `project42-platform` — reusable Apache-2.0 platform and packaged curriculum
- `project42-content` — canonical CC BY 4.0 curriculum
- `project42dev-ops` — private planning and operations
- `project42dev.github.io` — preserved transitional archive

## Project governance

- [Contributing](CONTRIBUTING.md) — repository scope, development, tests, pull
  requests, review, accessibility, and licensing
- [Security](SECURITY.md) — private vulnerability reporting and safe evidence
- [Support](SUPPORT.md) — supported versions, compatibility boundaries, issue
  routing, and deprecation policy

## Deployment

The canonical public instance deploys from this repository to GitHub Pages and is
served at <https://project-42.dev>. Cloudflare manages DNS only.

`npm run pages:build` produces the complete static artifact in `dist/pages`. The
GitHub Pages workflow validates the application and exported artifact before deploying
the exact merged `main` commit. OpenAI Sites is not a production or custom-domain
target for this repository. Production configuration and learner secrets never belong
in git.

The platform dependency uses a reviewed release tag and the lockfile resolves that
tag to an exact commit. npm `allowScripts` permits the platform's build script
and the explicitly listed native build dependencies. The platform's `prepare`
script generates its `dist` entrypoint. Review package scripts and the lockfile
when changing the release pin; change script permissions only when needed.
