---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  STRUCTURAL REPAIR BUILT at exact SHA f3beae6dad93de9acbee3bfcfdae54ab150c6a86.
  Writer and recognizer now share one closed unquoted alphabet; 26
  shell-syntax/expansion cases, exhaustive printable-ASCII round-trips,
  Node-pair properties, built Claude/Codex byte preservation, Unicode, and
  OpenCode receipt regressions pass. Focused 75/75 and full npm run check pass.
  Gate is fresh whole-language exact-SHA Review.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T21:27:48.307Z'
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
