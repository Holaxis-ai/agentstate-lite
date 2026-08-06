---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  HOSTED CI pending for PR #210 at exact head
  caa94a061c0ecd60715ed886d4063a86b29675c3. This is a tree-identical empty
  retrigger commit over reviewed SHA 5a5a622; both have tree 7279c8f. GitHub
  processed the push but Actions created no run because the official Actions
  component is in a major outage (critical incident qcvjkzcs7j74). Product
  implementation, independent review, aggregate QA, and local Node 20/22/25/26
  gates remain complete. Monitor recovery, then retrigger only if the
  synchronization is not processed. No merge performed.
actor: codex-pr210-ci-retrigger
timestamp: '2026-08-06T20:19:09.389Z'
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
