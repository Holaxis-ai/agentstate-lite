---
type: Task
title: Kind-conformance refusals emit a ready-to-run completing command
description: >-
  DONE — PR #115 merged (2026-07-19), one review round, APPROVE.
  Kind-conformance refusals now carry a literal completing doc update argv (enum
  fields show <a|b|c>); the DoD test EXECUTES the emitted bytes through the real
  built CLI and asserts convergence — the emitted-command-chain discipline,
  review-verified as genuine. Builder's self-caught edge shipped in-unit: a doc
  write --strict refusal on a NEVER-PERSISTED doc falls back to the kinds
  pointer instead of emitting a doc update that would 404 (existence decided
  free in patch/create-only modes; conservative best-effort read in overwrite).
  Review confirmed the sync-to-async translateMutationError conversion swallows
  nothing (single caller, return-awaited). This unlocks
  tasks/overwrite-monotone-ratchet's sequencing gate.
actor: mike/claude
status: done
timestamp: '2026-07-19T03:53:34.117Z'
---

