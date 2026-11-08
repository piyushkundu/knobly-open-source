# Security reporting and deployment scope

Maintainers must configure GitHub private vulnerability reporting or publish a
private contact channel before public release. No private contact address from
the original project has been copied into this package. If no channel is
available, ask the maintainer for a private reporting channel without posting
credentials, real records or exploit details in a public issue.

Use dummy accounts and loopback emulators to reproduce issues. Never test
against the original hosted site's users or infrastructure without authorization.

The included rules template and server checks are code, not evidence of a live
deployment. The default root rules deny access. Before hosting, review your own
UID allowlist, token verification, rules, recovery, active legacy attempts,
resource quotas and retention/account-erasure policy. Historical scores are not
retroactively certified; short answers still need human grading. Client-side
proctoring is not a guarantee against answer sharing or additional accounts.
