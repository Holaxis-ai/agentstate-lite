---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  REVIEW FAILED again at c0c2b26: glob fixes pass, but unquoted brace expansion
  remains falsely owned and destructively removed. Because this area has
  exceeded two interventions, work has paused for a whole-system shell/ownership
  model. Next repair must replace the unquoted denylist with the writer's closed
  safe-alphabet grammar and add an expansion-taxonomy/property matrix before
  fresh exact-SHA Review.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T21:15:36.247Z'
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
