---
type: Task
title: Make hook ownership and mutation compatibility exact
status: done
priority: '1'
description: >-
  DONE AND MERGED. PR #210 final head f1c992bf78bf17416aac00dd42b441680e39dbd6
  retained reviewed tree 7279c8f2000508bbac363e109c7c12602ffd42e1 from semantic
  SHA 5a5a6229c840992e94cf26e91bd1f82b4bf18488. Independent exact-SHA review and
  aggregate adversarial QA passed; hosted run 31133295908 passed Node 20
  built-CLI smoke and full Node 22/26 repository gates. Brian merged at
  2026-08-07T00:11:12Z as dc341159a6478e8e8e5b43c3e7e71e0dc44cc105. This session
  did not perform the merge.
actor: codex-pr210-final-state
timestamp: '2026-08-07T00:14:39.757Z'
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
