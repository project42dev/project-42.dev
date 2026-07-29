# Security policy

## Report a vulnerability privately

Do not open a public issue or pull request for a suspected vulnerability. Use
[GitHub private vulnerability reporting](https://github.com/project42dev/project-42.dev/security/advisories/new).

Include:

- the affected deployed version, route, or commit;
- the security impact and required preconditions;
- minimal sanitized reproduction steps;
- whether the issue is already being exploited; and
- a suggested mitigation when one is known.

Never include real credentials, session values, signed URLs, tenant or resource
identifiers, learner records, personal information, private logs, or production
data. Use clearly synthetic placeholders and remove response bodies that could
contain user information.

## Supported boundary

Security fixes target the current production deployment and the latest commit on
`main`. Older commits, forks, and modified deployments may need to update before
a fix can be applied. See [SUPPORT.md](SUPPORT.md) for compatibility and
deprecation policy.

The gateway is a static GitHub Pages application with Cloudflare DNS. Identity,
accounts, and durable learner records are separate protected services; a report
that affects those services should still begin through private vulnerability
reporting so it can be routed without public disclosure.

## Dependency and disclosure handling

The complete locked dependency graph is part of the release security boundary.
The required audit and remediation policy is documented in
[docs/dependency-security.md](docs/dependency-security.md).

Maintainers will validate the report, coordinate remediation across affected
repositories, and publish an advisory when disclosure is safe. Project 42 does
not promise a fixed response time, but reports involving active exploitation or
learner data receive the highest priority.
