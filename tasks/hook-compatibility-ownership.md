---
type: Task
title: Make hook ownership and mutation compatibility exact
status: in_progress
priority: '1'
description: >-
  EXACT-SHA REVIEW FAIL at cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4. The
  structural lexical-envelope repair and OpenCode unmanaged-preservation receipt
  pass, but semantic Node-layout ownership remains too broad: a lexically
  canonical command pairing Node from /opt/runtime-a with an npm package entry
  under /opt/npm-b is classified current through the generic absolute-Node
  fallback even though no writer emits it. Pure and freshly built
  status/install/uninstall claim, rewrite, or delete it across Claude, Codex,
  and OpenCode. Required repair: npm-shaped entries must pass
  stableNpmRuntimePair; the generic Node branch may accept only enumerated
  local-dev/marketplace layouts. QA remains blocked. Evidence:
  context-notes/pr207-housekeeping-exact-review-cf3b8ab and
  context-notes/hook-ownership-semantic-node-pair-model-2026-08-05. Next
  dependency: builder repair with cross-prefix pure+built byte-preservation
  tests, then fresh exact-SHA review.
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T23:40:20.124Z'
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
