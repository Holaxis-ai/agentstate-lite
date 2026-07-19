---
type: Task
title: link add reports a missing target in its own receipt (probe finding 1)
description: >-
  From the 2026-07-19 cold-start usability probe, its top-ranked finding
  (empirical, exact transcript in the probe report): link add to a TYPO'D target
  returns the identical success envelope (changed:true, exit 0) as a deliberate
  forward-declaration — the mistake surfaces only in a LATER status sweep
  (unresolved_links), and the probe's recovery cost 6 invocations total for a
  1-command intent. Dangling links stay ALLOWED (forward-declaration is by
  design, per link --help); the fix is envelope HONESTY: link add's receipt
  carries target_exists:false (or a warnings entry) when the target doc is
  absent at link time — the same immediate-signal pattern new --link already
  uses for a bad type match, and the same silent→signal move as PR #117's stdin
  note. DoD: the field appears exactly when the target is absent (both
  directions pinned: absent → flagged, present → byte-identical receipt to
  today), idempotent re-add unchanged, remote parity considered (does
  RemoteBackend's link path know target existence in one round trip? — if not,
  state the divergence honestly rather than adding a read).
actor: mike/claude
status: todo
timestamp: '2026-07-19T15:30:31.655Z'
---

