---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  REVIEW + ADVERSARIAL QA PASS for PR #210 exact SHA
  5a5a6229c840992e94cf26e91bd1f82b4bf18488; no P0/P1/P2 or lifecycle
  counterexample. Review:
  https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208595913.
  QA aggregate combines 37-case Claude/Codex preservation, independent OpenCode
  6-negative/1-positive lifecycle, 12-case authority matrix, six actual
  installed-tarball hook/skill no-write refusals, stable same-prefix positive
  install/uninstall, corrected 11-form history matrix, complete installed proof,
  and unchanged plugin trees. Full local repository gate passes under Node 25
  and stable Node 22 (Node 22 exit 0 with one Playwright retry reported flaky);
  Node 26 gate is running. Status remains in_progress pending Node 26, exact
  Node 20 smoke, and final GitHub/PR evidence.
actor: codex-pr210-orchestrator
timestamp: '2026-08-06T19:54:08.903Z'
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
