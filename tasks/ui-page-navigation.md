---
type: Task
title: 'Bundle Pages: navigate to another registered Page'
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Add a narrow shell-owned open-page action so Pages compose through registered
  navigation while preserving each target Page's independent sandbox and bridge
  capability.
actor: openai/codex
timestamp: '2026-07-12T00:48:52.086Z'
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
