# Dependency security

Reviewed 2026-09-18 against this repository's package scripts and CI.

## Required gate

```bash
npm ci
npm run verify
```

The current `audit` script invokes `audit:production`, which runs
`npm audit --omit=dev --audit-level=critical`. There is no `audit:full`
script. The required gate therefore does not certify zero advisories at every
severity or audit all development dependencies.

Development tooling can still affect the published artifact. For a complete
dependency review, additionally run `npm audit` and record all findings,
including those below the configured CI threshold. Do not describe a passing
threshold check as a clean full dependency audit.

The rest of `verify` checks generated assets and facts, lint/types, builds,
rendered routes, links, browser behavior, exported pages and governance.

## Remediation

Prefer the smallest compatible supported upgrade. Review affected dependency
paths, engine requirements, lockfile changes and release notes. Avoid
`npm audit fix --force`, which can change major versions or downgrade packages.

The current package includes overrides for transitive dependencies, including
`minimatch`. Treat the lockfile and package scripts as the source of current
versions. Remove an override only after the direct dependency graph supports
the replacement and the complete gate passes.

Include production and full audit results, affected paths, exact changes and
verification evidence in dependency pull requests. Do not commit registry
credentials, private tokens or local audit caches.
