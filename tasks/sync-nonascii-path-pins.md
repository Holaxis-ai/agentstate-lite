---
type: Task
title: Pin non-ASCII doc ids through the name-status parsers (U3b review follow-up)
status: done
priority: '2'
description: >-
  DONE via the residue-sweep unit — PR #104 (head e3c54a6, merge 43ab16a,
  2026-07-18). Shipped: (a) the stageAndCommit receipt/subject non-ASCII pin
  (two-clone e2e, unmangled tasks/café through doc rows, count, and commit
  body); (b) DoD(2) resolved by CONVERSION, not documentation: all three
  --name-status invocations (diffDocsBetween, stageAndCommit,
  snapshotBundleCommit) now use -z NUL framing with a rewritten nameStatusRows —
  immune to tab-hostile names; the TAB red-proof showed the old parser silently
  DROPPED a raw-TAB doc (git C-quotes control bytes even under quotepath=off).
  All three carry --no-renames (three-field -z rename records would corrupt a
  pair parser — reviewer byte-verified the hazard). Every pre-existing pin
  byte-unmodified; insertion-only tests. CAVEAT (record-level, from review): the
  PR narrative's item-A red-proof ('stripped the quotepath wrapper → café
  vanished') is stale post-conversion — -z protects the parse independently of
  quoting; the café pin guards the output class jointly with the TAB pin, and
  quotepath=off remains load-bearing for other consumers (status --porcelain
  paths).
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T16:35:07.955Z'
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
