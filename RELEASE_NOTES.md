# Project 42 public site 0.19.0

This release packages the public Project 42 site as a versioned static archive
with a strict artifact manifest, checksums, and build provenance.

## Breaking changes

None. Existing public routes and GitHub Pages deployment behavior are preserved.

## Migrations

No data or configuration migration is required.

## Known limitations

The release archive contains the public static site only. Hosted account and
learner-record services are versioned and operated separately.

## Rollback

Redeploy the preceding known-good GitHub Pages artifact or restore the prior
tagged static archive. No learner data is modified by this release.
