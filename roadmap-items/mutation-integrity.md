---
type: Roadmap Item
title: 'Mutation integrity: one executable boundary for every state-dependent write'
status: done
description: >-
  COMPLETE (verified 2026-07-18): every step of the sequence shipped and every
  contained task is done. Audit (tasks/mutation-boundary-audit, done) ->
  cross-process filesystem CAS enforced (#77, tasks/filesystem-cross-process-cas
  done) -> regenerateIndex adversarial proof pinned (#84,
  tasks/regenerate-index-cas-proof done) -> CLI-neutral document policy
  extracted for trusted actions (#85, mutateDocument in core) -> post-persist
  subscriber shipped (#80's onPersisted/board-attribution hook, preserved
  through the #85 adapter and #97 carve). The mutation-integrity story now also
  carries standing measurement: mutation testing covers core (67.4 baseline +
  201 pinned kills), the curated cli modules (73.6 baseline), and board-git
  (first run in flight). Closed by mike/claude on child-status evidence; the
  item's own actor line (mike/codex) can reopen if the sequence's intent
  extended beyond the shipped subscriber.
sequence: >-
  Audit complete → enforce cross-process filesystem CAS → pin regenerateIndex
  adversarial proof → extract CLI-neutral document policy for trusted UI actions
  → add BoardChannel post-persist subscriber
actor: mike/claude
timestamp: '2026-07-18T15:42:49.522Z'
---
[contains](../tasks/mutation-boundary-audit.md)

[design](../designs/mutation-boundary-audit.md)

[contains](../tasks/filesystem-cross-process-cas.md)

[contains](../tasks/regenerate-index-cas-proof.md)
