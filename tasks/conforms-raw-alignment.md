---
type: Task
title: >-
  Align the ratchet's conforms() with raw validation (close the status/ratchet
  disagreement)
description: >-
  Follow-up demanded by the PR #119 review (finding 1, MEDIUM, empirical): the
  ratchet's existing-side conforms() validates a write-normalized clone
  (timestamp defaulted per kinds.ts's one-validator rule) while status's
  conformance_debt (#116) validates the RAW frontmatter — so an
  externally-authored doc missing a kind-required timestamp counts as DEBT to
  status yet CONFORMING-and-protected to the ratchet, and gets an over-strict
  (though loud, lossless, self-healing) refusal where staging leniency should
  apply. DECIDED (orchestrator, 2026-07-19, Mike can veto): option (a) — align
  conforms() with the raw validator by SKIPPING the timestamp-defaulting on the
  EXISTING side only. Rationale: the existing doc IS its raw bytes (nothing
  normalizes it unless written), so judging 'did this doc conform as it exists'
  raw is the semantically honest reading AND restores cross-surface agreement
  with status; the CANDIDATE side keeps write-normalized validation (it WILL be
  persisted normalized). Engine-written docs are unaffected (every one has a
  persisted timestamp); the edge reverts to spec-letter staging leniency. Option
  (b) (record write-normalization as the deliberate rule + note the
  disagreement) REJECTED: it leaves two surfaces permanently disagreeing about
  the same bytes. DoD: the one-line-ish conforms() change; the reviewer's exact
  probe as a pin (external doc missing required timestamp + dropping overwrite →
  writes with warnings, NOT refused); a status-agreement pin (the same fixture
  counts in conformance_debt AND gets leniency); existing ratchet pins
  byte-unmodified. Small, Sonnet-safe.
actor: mike/claude
status: todo
timestamp: '2026-07-19T13:20:25.244Z'
---

