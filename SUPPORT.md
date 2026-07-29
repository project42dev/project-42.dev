# Support, compatibility, and deprecation

## Supported surface

The supported public gateway is the current deployment at
<https://project-42.dev> and the latest commit on `main`. Local development uses
Node.js 22.13.0 or later and the committed npm lockfile.

Open a [GitHub issue](https://github.com/project42dev/project-42.dev/issues) for a
reproducible public-site defect, accessibility problem, broken redirect, or
documentation correction. Include the affected route, browser or assistive
technology, expected behavior, observed behavior, and sanitized reproduction
steps. Use the private process in [SECURITY.md](SECURITY.md) for vulnerabilities.

## Compatibility boundary

- This repository is the public gateway. Learn, Field Guide, reusable platform,
  and self-host distribution support belong in their respective repositories.
- The gateway consumes a reviewed `project42-platform` release tag resolved to an
  exact commit by the lockfile.
- Production output is a static GitHub Pages artifact. Cloudflare provides DNS;
  it is not an application runtime for this repository.
- Current Chrome, Edge, Firefox, and Safari releases are the browser target.
  Keyboard-only, screen-reader, reduced-motion, forced-color, 200% zoom, and
  narrow-viewport behavior are release gates.
- Public routes listed in the redirect inventory are compatibility commitments.
  Redirect removal requires an explicit migration decision and link validation.

The public release-facts file reports the deployed site, platform, and content
versions. A fork must validate its own platform dependency, domains, redirects,
branding, accessibility, and deployment configuration.

## Deprecation policy

Project 42 favors additive changes and redirects. A planned breaking change must:

1. document the affected route, integration, or supported environment;
2. provide a replacement or migration path;
3. state the first release that warns and the release that removes support;
4. update release notes, compatibility facts, tests, and rollback guidance; and
5. preserve a redirect when a stable public destination exists.

Emergency security removals may use a shorter notice period. The reason, affected
surface, mitigation, and recovery path must still be documented.

Project 42 is community-supported and provides no uptime or response-time service
level agreement. The issue tracker records support requests and their disposition
publicly unless security or personal information requires private handling.
