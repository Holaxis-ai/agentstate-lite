---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  REMEDIATED on PR 207 exact head 68e5c91. The tokenizer rejects control
  characters and non-generated spacing; Node commands require an absolute
  runtime plus an enumerated npm/local-dev/plugin-cache entry layout; and
  mutation ownership requires the exact historical SessionStart/session_start
  matcher, type, and ten-second timeout shapes. Unknown variants are
  byte-preserved. Focused 68/68 and full npm run check pass. Task remains
  in_progress pending independent exact-SHA re-review.
actor: codex-durable-hook
timestamp: '2026-08-05T00:03:24.861Z'
---
# Goal

Replace substring hook ownership with one tokenized semantic classifier shared by status, install, deduplication, and uninstall. This is C2H and protects foreign host configuration from accidental mutation.

# Acceptance

- Existing public booleans/command remain; compatibility evidence is additive.
- Every enumerated historical/current generated-compatible form is classified; foreign near-matches survive byte-identically.
- `durable_global` proof refuses real npm-exec/npx cache persistence without writes.
- Install and uninstall converge owned forms across all hosts/scopes and preserve unrelated/malformed/symlinked state per protocol.

# Gate

Builder → independent exact-SHA Review → adversarial install+uninstall byte-preservation QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
