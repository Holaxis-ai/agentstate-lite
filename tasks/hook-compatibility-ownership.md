---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  WAITING ON GITHUB ACTIONS RECOVERY for PR #210 at exact head
  caa94a061c0ecd60715ed886d4063a86b29675c3, a tree-identical empty commit over
  reviewed 5a5a622 (tree 7279c8f). A read-only monitor from 20:19:45Z through
  20:50:04Z found the official Actions component in major_outage throughout and
  no hosted run. PR remains OPEN, MERGEABLE, CLEAN, and unmerged; local/origin
  branch is exact and clean. Product implementation, independent review,
  aggregate QA, and local Node 20/22/25/26 gates are complete. On continuation
  inspect the official incident and exact-SHA run list first; after recovery,
  retrigger once only if the queued event was not processed, then monitor hosted
  CI to completion.
actor: codex-pr210-ci-retrigger
timestamp: '2026-08-06T20:50:54.094Z'
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
