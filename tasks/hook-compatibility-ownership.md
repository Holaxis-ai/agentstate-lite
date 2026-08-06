---
type: Task
title: Make hook ownership and mutation compatibility exact
status: done
priority: '1'
description: >-
  MERGE-READY HANDOFF for PR #210 at exact SHA
  5a5a6229c840992e94cf26e91bd1f82b4bf18488. Independent exact-SHA review PASS;
  aggregate adversarial QA PASS; full npm run check PASS on Node 25.2.1, Node
  22.23.2, and Node 26.7.0; exact Node 20.20.2 engines-floor smoke 8/8;
  installed-package/poisoned-environment proofs PASS; plugin and tracked trees
  clean; local/remote SHA match; GitHub reports OPEN, MERGEABLE, CLEAN. GitHub
  did not enqueue an Actions suite for the automated push/reopen, so the active
  workflow commands were reproduced locally at the exact SHA and the empty check
  rollup is disclosed. Final evidence:
  https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208761858.
  No merge performed; Brian owns the merge gate.
actor: codex-pr210-orchestrator
timestamp: '2026-08-06T20:02:15.961Z'
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
