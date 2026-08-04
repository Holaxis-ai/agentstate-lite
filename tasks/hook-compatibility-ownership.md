---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  IMPLEMENTED and pushed by codex-durable-hook at 9b6b114 on
  feat/durable-npm-hook-install: exact token-and-shape ownership, byte-exact
  OpenCode reconciliation, durable npm-prefix Node launch, additive per-host
  status, and foreign-config preservation. Final npm run check passed. Awaiting
  required independent exact-SHA review before QA/closure.
actor: codex-durable-hook
timestamp: '2026-08-04T22:35:19.924Z'
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
