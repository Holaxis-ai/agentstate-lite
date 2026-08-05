---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  REPAIR UPDATED at exact SHA c0c2b26f19827750f54a320bd6796df641ee7353 on
  fix/pr207-hook-ownership-housekeeping. Unquoted *, ?, [, ] direct and
  absolute-Node variants now fail closed; quoted historical literals remain
  recognized. Focused 71/71 and full npm run check pass. Gate returned to fresh
  independent exact-SHA Review before adversarial QA.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T21:09:00.582Z'
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
