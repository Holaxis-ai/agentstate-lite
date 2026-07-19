---
type: Task
title: 'Coherence-audit drift themes 2-5 (theme 1, CLAUDE.md truth, fixed 2026-07-04)'
status: todo
priority: '2'
description: >-
  [RE-SCOPED 2026-07-19] Re-verified each remaining item against the current
  tree (2+ weeks of core-shape/engine-surface/document-mutation-extraction work
  since filing on 2026-07-05): (2b) STILL OPEN — grepped
  core+cli+server+ui-server+board-git for real callers of
  regenerateIndex/appendLog/readLog/readIndex (core/src/bundle.ts): none outside
  their own definitions/exports and comments referencing the pattern
  conceptually; 'doc history' uses docVersions (the per-backend version chain),
  not log.md. log.md provenance remains unconsumed — still a DECISION-Mike item
  (wire to roadmap, or prune). (3) PARTIALLY RESOLVED — the flagship example
  (CAS retry loops, link add vs mutateDoc) is now consolidated into ONE shared
  primitive, core/src/mutation.ts's versionedMutation, whose own doc comment
  states it replaces 'five prior hand-rolled copies (bundle.ts's
  appendLog/regenerateIndex, the CLI's mutateDoc overwrite+patch modes, link
  add)'. The other three named duplications (pagination comparator x4, CAS
  headers x5, row projection x6) were NOT re-surveyed in this pass (a quick grep
  found no obvious remaining hand-rolled pagination/row-projection duplication
  under those old names, but naming has clearly shifted since 2026-07-05 and
  this needs a fresh targeted survey, not a carried 2-week-old claim). (4) doc
  history CONFIRMED STILL uncapped — packages/cli/src/commands/doc/history.ts's
  docHistory returns the full versions array with no --limit; 'member list raw
  camelCase' and 'link show shown field' were not re-verified (terminology may
  be stale — 'member' in the current CLI refers to --field set-membership, not a
  list command) and need a fresh look. (5) STILL OPEN —
  packages/cli/src/commands/doc/read.ts:269 ('doc read --out') still does a raw
  fs.readFile(path.join(bundle.root, rel)) for local bundles, with no backend
  seam method for raw doc bytes; matches the noted docs/WIRE-PROTOCOL.md
  divergence that --remote doc read re-serializes via stringifyDoc instead of
  crossing raw bytes. REMAINING SCOPE going forward: keep 2b (DECISION-Mike) and
  5 (raw-bytes seam gap) as-is; re-survey 3's non-CAS-retry duplications and 4's
  list-output convergence fresh against current names rather than trusting this
  record further. Original text preserved: From the 6-hunter coherence audit.
  DONE: theme 1 (CLAUDE.md truth pass, 73fe17c) + theme 2's legacy bearer-token
  store (PRUNED, aa34a5b/fed7440, STATUS item 42). REMAINING: (2b) reserved-file
  provenance (regenerateIndex zero callers, log.md unconsumed) — wire to roadmap
  or prune. (3) Duplicated invariant blocks: CAS retry loops (link add vs
  mutateDoc), pagination comparator x4, CAS headers x5, row projection x6. (4)
  List-output convergence: member list raw camelCase, link show shown field, doc
  history uncapped. (5) Seam gap: doc read --out raw-bytes via node:fs (no
  raw-doc-bytes seam method) + auth-wire/content-type parked in core.
actor: mike/claude
timestamp: '2026-07-19T13:12:15.197Z'
---

