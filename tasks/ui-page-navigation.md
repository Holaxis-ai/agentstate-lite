---
type: Task
title: 'Bundle Pages: navigate to another registered Page'
status: done
priority: '2'
assignee: openai/codex
description: >-
  Add a narrow shell-owned open-page action so Pages compose through registered
  navigation while preserving each target Page's independent sandbox and bridge
  capability.
actor: openai/codex
timestamp: '2026-07-12T01:39:54.848Z'
---
# Objective

Let any bundle Page ask the trusted UI shell to navigate to another registered Page by document id. This makes Pages composable without exposing raw HTML, nonce minting, arbitrary URLs, or nested execution.

# Scope

- Add one `open-page` shell request carrying `pageId`.
- Accept only a bundle-relative Page registry id; never accept a URL or blob key.
- The trusted shell performs navigation through the existing router, so the target Page is independently resolved, nonce-minted, sandboxed, and governed by its own `bridge` capability.
- Navigation is available to both `bridge: none` and `bridge: bundle-read` Pages because it grants no bundle read access.
- Add the helper to the shipped copyable Page client and update `BRIDGE.md`.
- Preserve browser/back navigation behavior where the existing router supports it.

# Non-goals

- Page-in-Page embedding.
- Reading another Page's raw HTML through the bridge.
- Arbitrary URL navigation.
- Mutation or approval actions.
- Building the Review Request Kind or review Pages in this code unit.

# Required workflow

1. Write and independently review the design.
2. Implement as one behavioral claim from current `origin/main`.
3. Independently review the exact implementation SHA with adversarial navigation cases.
4. Address findings and re-review any changed SHA.
5. Run QA only after review: root build, typecheck, focused tests, full `npm run check`, and a built-artifact smoke where useful.
6. Push and open a PR with the exact executed evidence.

# Acceptance

- A Page can request navigation to `pages-registry/<id>` and the shell opens it through the existing Page route.
- The request never returns Page bytes, a nonce, or bundle data.
- Missing/malformed ids, URLs, path traversal, blob keys, and non-Page targets fail safely without navigation.
- A `bridge: none` Page can navigate but remains unable to use data requests.
- Existing bridge request behavior and Page capability enforcement are unchanged.
- Shipped examples/contracts demonstrate the generic pattern.

# Implementation status

- Design: independently reviewed and approved.
- Implementation: complete on `codex/ui-page-navigation` at `5c05de1d92faffab2d31c76bb14224dcb24bcf4c`.
- Code review: independently approved after three review-driven boundary fixes covering one-shot consumption, stale-frame requests, and startup message ordering.
- QA: passed on the exact reviewed SHA. Full `npm run check` passed, including 1,246 package/script tests and 14 Chromium E2E tests; built-CLI and standalone-package smoke tests also passed.
- Manual acceptance: a fresh disposable local bundle with two newly authored `bridge: none` Pages was opened in the real local UI; Source → Target navigation rendered the independently registered target and browser Back restored Source.
- Pull request: https://github.com/Holaxis-ai/agentstate-lite/pull/40 merged into `main` as `53cac48ffdbec8a7726d07d0b8a4418d3b11f501` on 2026-07-12.

Shipped.
