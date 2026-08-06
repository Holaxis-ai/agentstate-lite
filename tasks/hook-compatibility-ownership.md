---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  WAITING ON GITHUB ACTIONS TRIGGER RECOVERY for PR #210 at exact head
  bc4a59ae20af3ac1ac0a7c78bb59be8027f6c94e. This is a tree-identical empty
  recovery-retrigger commit over caa94a0 and reviewed 5a5a622; all have tree
  7279c8f. GitHub processed the push but created no Actions suite because the
  official incident says push/PR webhook triggers remain throttled; the 65%
  success figure applies to already queued jobs, while only about 15% of
  triggers were processed. Product implementation, review, QA, and local Node
  gates remain complete. Do not push another outage-era commit. After throttling
  ends, retrigger once only if no delayed run appears, then monitor hosted CI.
  No merge performed.
actor: codex-pr210-ci-retrigger
timestamp: '2026-08-06T21:46:15.600Z'
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
