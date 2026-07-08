---
type: Task
title: Pin non-ASCII doc ids through the name-status parsers (U3b review follow-up)
status: todo
priority: '2'
description: >-
  The quotepath wrapper invariant (U3b) incidentally fixed latent garbled-id
  bugs in stageAndCommit receipts, changesSince deltas, and originDocsBetween
  incoming rows — but those paths have no pinned non-ASCII tests, and a literal
  TAB in a filename would still break their tab-split parsing (the -z conflict
  list is immune).
actor: brian-claude
timestamp: '2026-07-08T16:16:00.371Z'
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
