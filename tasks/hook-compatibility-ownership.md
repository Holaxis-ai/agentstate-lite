---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  REVIEW FAILED at repair SHA e2a337bd3e0992df5655dc916df08c7425989910.
  Unicode-escape ownership and unmanaged OpenCode receipt are fixed, but
  exact-SHA review proved unquoted POSIX glob paths (*, ?, bracket forms,
  including Node variants) still classify owned and are destructively removed by
  uninstall after shell expansion. Repair is back with the housekeeping Builder;
  fresh exact-SHA Review remains mandatory.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T21:00:56.776Z'
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
