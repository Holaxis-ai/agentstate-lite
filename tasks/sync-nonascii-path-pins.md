---
type: Task
title: Pin non-ASCII doc ids through the name-status parsers (U3b review follow-up)
status: in_progress
priority: '2'
description: >-
  RE-SCOPED to post-carve reality (2026-07-18 verification): the original three
  name-status parsers are now ONE consolidated parser family — changesSince and
  originDocsBetween both ride diffDocsBetween (board-git diff.ts), which HAS an
  explicit non-ASCII pin (café through prefix strip, doc ids + delta rows,
  git-porcelain.test.ts:1033) — DoD(1) is two-thirds subsumed. REMAINING: (a)
  one pinned test driving a non-ASCII id through stageAndCommit's
  RECEIPT/SUBJECT path specifically (no such pin exists — verified by grep); (b)
  DoD(2) the TAB residual decision: convert the name-status framing to -z
  (immune, matching the conflict list) or record the limitation explicitly.
  Small unit now; the quotepath=off wrapper invariant continues to carry the
  behavior meanwhile.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T15:46:10.303Z'
---
From the U3b review rounds (builder finding, reviewer-confirmed): three merged
name-status parsers — stageAndCommit's staged diff (git.ts:400), changesSince's cursor
diff (git.ts:702), originDocsBetween (sync.ts:645) — tab-split human-format git output
and never unquote. Under default core.quotepath these produced garbled ids in commit
subjects, receipts, and awareness rows with silently-wrong enrichment (NOT a stuck
loop). U3b's `-c core.quotepath=off` wrapper invariant fixes all three incidentally.

DoD: (1) pinned tests driving a non-ASCII doc id explicitly through stageAndCommit's
receipt/subject, changesSince's delta rows, and originDocsBetween's incoming rows (the
café converge e2e exercises them only incidentally); (2) decide the TAB residual —
convert the three parsers to `-z` name-status framing (immune to tab-hostile names,
matching the conflict list) or record the limitation explicitly; (3) no behavior change
expected for ASCII paths (byte-identical envelopes pinned).
