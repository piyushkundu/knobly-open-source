# Knobly Community Source

A Next.js learning app with HTML/C/Python workspaces, study pages, typing
practice, a Firebase dashboard and server-graded practice exams.

This is a separate source package with dummy configuration and a fresh Git
history. It contains no production accounts, database exports, credentials,
original Git history or deployment connection. It does not establish that any
existing hosted website has deployed these security changes.

## Run the free local demo

Use Node.js 24.x, npm and Java 21 or later. The local emulator workflow does not
require a Firebase login, credit card, billing upgrade or hosted database.
Its first run downloads the pinned Firebase emulator tools. On Windows the test
setup can obtain a checksum-verified portable Java runtime if Java is missing.

```sh
npm ci
```

Copy `.env.example` to `.env.local` using your editor or operating system.
Keep the supplied `demo-knobly-local` and loopback hosts for this workflow.

In terminal 1:

```sh
npm run demo:emulators
```

Wait for the emulator-ready message. In terminal 2:

```sh
npm run demo:seed
npm run dev
```

Open `http://localhost:3000`. The sample accounts use only local emulators:

| Account | Email | Password |
| --- | --- | --- |
| Learner | learner@example.test | DemoOnly123! |
| Demo administrator | admin@example.test | DemoOnly123! |

The seed command refuses non-demo projects and non-loopback emulator hosts.
Stop the emulator process after development; its dummy data is not a backup.
Do not expose emulator ports to a public network.

## What works without API keys

The local demo supplies dummy authentication, profile/progress records, a
sample exam and server-side grading. The seed data has no relationship to
the original site's users. HTML, browser-based C/Python workspaces, typing
practice and text study pages are included. Python, fonts and icons
may load external CDN resources and require internet access. The editor itself
is bundled from the locked npm package with its patched sanitizer dependency;
it does not use the React wrapper's older default Monaco CDN build.

AI, live news and SMTP email are optional and unconfigured. Email additionally
requires `KNOBLY_ENABLE_EMAIL=true`; no real email is sent by default. Hosted AI
requests remain denied until their shared limiter and provider configuration
are supplied. Providers and hosting have their own terms/quotas; this package
does not provision any service or promise unlimited free hosted use.

## Assets and content

Original course PDFs, screenshots, illustrations, photos, branding images and
private Drive download links are excluded pending rights review. Generic local
placeholders replace illustrations. Download-only course pages explain that
optional content is not bundled. See `ASSETS.md` before adding any material.

Code is MIT licensed. That does not grant rights to third-party media, trademarks
or separately licensed dependencies. See `LICENSE` and `THIRD_PARTY_NOTICES.md`.
Review ownership/attribution of educational text before a public release.

## Verification

```sh
npm test
npm run typecheck
npm run test:firebase
npm run build
npm run test:app
```

`npm test` mocks external services. `test:firebase` starts its own loopback
emulators and uses dummy data, so stop any already-running demo emulators first.
The retained integration suite verifies owner isolation, trusted admin checks,
server grading, first-completion XP, retries and legacy compatibility. Tests
and HTTP checks do not substitute for visual/browser, real OAuth/mail or load
testing. The legacy repository-wide lint backlog is not claimed to be clean.
`test:app` requires the build first and tests the actual built package server,
demo login, score/XP persistence and default-denied AI configuration. Stop your
development emulators before running it because it starts its own dummy session.

## Before using a hosted Firebase project

Use a new project that you own. Do not point this copy at the original site's
database or reuse its credentials. Configure its own admin UID in both the
server allowlist and a reviewed rules file derived from
`security/firestore.stage3.rules.template`. The root `firestore.rules` denies
all client access by default. No deploy command runs during setup or tests.

The normal client cannot write exam scores/XP or shared content. Admin SDK
operations verify the caller and project-specific admin allowlist. A previous
client build is not compatible with tightened score/key permissions. Review
active legacy attempts, retention/account-erasure, recovery and quotas before
any coordinated API/client/rules deployment. Code rollback cannot undo database
writes; do not restore broad grants as a workaround for a failing API.

## Release status

This folder is prepared for review, not automatically published. Before making
a new repository public: review source/content rights and third-party notices,
configure private security reporting, verify the intended deployment separately,
and run checks in your own environment. Never change the original private
repository's visibility as a substitute for publishing this clean copy.
