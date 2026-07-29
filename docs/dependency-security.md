# Dependency security

Project 42 treats both production and development dependencies as part of the
release security boundary. Build, lint, test, browser, and documentation tooling
process repository-controlled input and can influence the published static
artifact even when a package is not shipped to a browser.

## Required audits

Run the same security and quality gate used by continuous integration:

```bash
npm ci
npm run verify
```

The audit commands are intentionally separate so their scope remains visible:

- `npm run audit:production` audits packages required at runtime with
  `npm audit --omit=dev --audit-level=low`.
- `npm run audit:full` audits the complete locked dependency graph with
  `npm audit --audit-level=low`.
- `npm run audit` requires both commands to pass.

The policy is zero known advisories at every severity in both views. Continuous
integration runs `npm run verify`, which performs both audits before preserving
the complete lint, type, build, rendered-route, link, browser, exported-pages,
and accessibility checks.

An advisory is not waived by moving a dependency to development scope. If the
registry is temporarily unavailable, the audit fails; retry the job rather than
treating a missing audit result as approval.

## Remediation policy

Use the smallest compatible supported upgrade. Review the dependency path, package
engine requirements, release notes, lockfile diff, and complete quality gate.
Do not use `npm audit fix --force`: it may install unsupported major versions or
downgrade framework packages without validating the application.

If no compatible direct upgrade exists, a reviewed npm override may temporarily
select a patched transitive version when all of these conditions hold:

1. the patched package supports the repository's Node versions;
2. install, dependency-tree, lint, type, build, browser, and accessibility gates pass;
3. the override and its removal condition are documented; and
4. both audits report zero advisories after the change.

## ESLint glob dependency decision

The ESLint 9 and Next lint-plugin graph requested vulnerable `minimatch` release
lines. The repository therefore pins `minimatch` 10.2.5 through npm `overrides`;
that release uses patched `brace-expansion` 5.0.8 and supports Node 22 and later.
This removes the vulnerable transitive copies without changing the configured lint
rules.

ESLint 10 is not yet a compatible replacement for this repository. The current
Next-provided React, import, and JSX accessibility plugins declare ESLint 9 peer
ranges, and the React plugin fails while loading under ESLint 10. Remove the
override and upgrade ESLint only after the complete Next lint-plugin graph declares
support for the new major and `npm run verify` passes without the override.

## Review evidence

Dependency pull requests must include:

- full and production audit totals before and after remediation;
- the affected dependency paths from `npm ls`;
- direct and transitive version changes;
- confirmation that no forced audit fix was used; and
- results from `npm run verify`.

Commit only reviewed `package.json` and lockfile changes. Never commit registry
credentials, private package tokens, audit caches, or local npm configuration.
