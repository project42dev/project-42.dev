# Contributing to the Project 42 gateway

Project 42 welcomes fixes and improvements to the public gateway at
`project-42.dev`. This repository owns the landing experience, About and Legal
pages, public navigation, release facts, and redirects. Learning paths belong in
`learn.project-42.dev`, practical references belong in `guide.project-42.dev`,
and reusable contracts or curriculum belong in `project42-platform`.

## Before opening a change

1. Search the repository's GitHub issues and pull requests for related work.
2. Open an issue before adding a public route, changing a compatibility boundary,
   removing a redirect, or introducing a new dependency.
3. Keep the change in this repository's ownership boundary. Link a related issue
   or explain the user-visible need in the pull request.
4. Use primary sources for factual claims that can change and identify the date
   they were checked.
5. Do not include credentials, tenant or resource identifiers, private planning,
   learner records, personal information, or proprietary training material.

Project maintainers link internal work through commit metadata when applicable.
Public pull-request descriptions must not contain private tracker links.

## Develop and verify

Use Node.js 22.13.0 or later and the locked npm dependency graph:

```bash
npm ci
npm run dev
```

Run the complete gate before requesting review:

```bash
npm run verify
```

The gate audits production and development dependencies, then validates generated
facts and assets, lint and type safety, the production build, links, rendered
routes, browser behavior, GitHub Pages output, accessibility, workflows, and
repository governance documents.

## Pull requests

- Keep a pull request focused and explain the user impact, root cause, and
  validation performed.
- Include tests for behavior changes and update documentation with the code.
- Preserve keyboard, screen-reader, reduced-motion, forced-color, mobile, and
  zoom behavior.
- Preserve former public routes through the redirect inventory unless a reviewed
  compatibility decision explicitly replaces them.
- Use the repository's conventional commit style. Project maintainers include the
  applicable `AB#` reference in commits; external contributors may use the linked
  GitHub issue.
- Disclose material AI assistance and remain accountable for sources, licensing,
  security, accessibility, and correctness.

At least one qualified reviewer must approve the change. Security, legal,
identity, learner-data, dependency, and compatibility changes require a reviewer
who owns that boundary.

## Content and licensing

Application code is Apache-2.0. Reusable curriculum is maintained in
`project42-platform` under CC BY 4.0 and should not be duplicated here. By
submitting a contribution, you confirm that you have the right to contribute it
under the applicable repository license.

Report vulnerabilities through the private process in [SECURITY.md](SECURITY.md),
not in a public issue. Supported versions and deprecation expectations are in
[SUPPORT.md](SUPPORT.md).
