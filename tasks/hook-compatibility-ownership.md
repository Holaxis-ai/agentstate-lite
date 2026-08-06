---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  BUILDER REPAIR PUSHED for PR #210 at exact SHA
  5a5a6229c840992e94cf26e91bd1f82b4bf18488. Canonical absolute-path admission
  now rejects dot-segment and duplicate-separator near-matches across npm,
  local-dev, and marketplace layouts; installed local-dev npm-layout authority
  now emits a proven stable same-prefix Node launch without any generic npm
  fallback. Evidence: focused source 22/22, freshly built lifecycle 3/3,
  poisoned-lifecycle proof 1/1, complete npm package proof exit 0, full npm run
  check exit 0 with loopback permission, diff check clean. Status remains
  in_progress pending fresh independent exact-SHA review, then adversarial QA
  and GitHub CI. Original review:
  https://github.com/Holaxis-ai/agentstate-lite/pull/210#issuecomment-5208268039
actor: codex-pr210-repair-builder
timestamp: '2026-08-06T19:18:45.421Z'
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
