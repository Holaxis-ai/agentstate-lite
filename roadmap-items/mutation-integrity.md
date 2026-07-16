---
type: Roadmap Item
title: 'Mutation integrity: one executable boundary for every state-dependent write'
status: active
description: >-
  Prove and finish the existing versioned mutation architecture without creating
  a second framework or forcing unrelated writes through mutateDoc.
sequence: >-
  Audit complete → enforce cross-process filesystem CAS → pin regenerateIndex
  adversarial proof → extract CLI-neutral document policy for trusted UI actions
  → add BoardChannel post-persist subscriber
actor: mike/codex
timestamp: '2026-07-16T02:52:08.856Z'
---
[contains](../tasks/mutation-boundary-audit.md)

[design](../designs/mutation-boundary-audit.md)

[contains](../tasks/filesystem-cross-process-cas.md)

[contains](../tasks/regenerate-index-cas-proof.md)
