---
type: Task
title: 'Declare terminal statuses on kind conventions: THREE consumers now waiting'
status: done
priority: '2'
description: >-
  SHIPPED in PR #20 (merge e7a1531, plugin 1.0.22). fields.terminal on kind
  conventions + exported isTerminal (any-member semantics for array values);
  kinds projects it; three consumers: list --open (declaration-driven, help-line
  no-op on undeclared bundles), status sweep exclusion (terminal_skipped
  reported top-level, counting INSTANCES), work-tracking TASK_KIND seed. Live
  board task convention declares done/canceled — rode the PR deliberately so the
  declaration landed atomically with the parser (pre-merge main warned on the
  unknown key). Post-review polish by briand fleet during their #20 rebase:
  doc-comment honesty on any-member arrays + terminal_skipped disambiguation
  (d13242f), and Brian ruled Roadmap Item done is terminal (seeded in the
  roadmap recipe). Payoff on this board: list --type Task --open, 46 tasks to 19
  open in one query.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-08T23:17:55.537Z'
---


## Ruling (Brian, 2026-07-08): Roadmap Item declares terminal too

From the PR #20 cross-review's merge-order finding: when rebasing over merged #21, the
roadmap recipe's two kinds need the now-required `terminal` property. Brian's call:
Roadmap Item declares `terminal: {status: [done]}` (done roadmap items hide from
`list --open`, consistent with Task); the Roadmap spine kind takes `terminal: {}`
(no status field to declare). Update the recipe seed AND the live board's
conventions/roadmap-item.md atomically in the same pass, mirroring how this PR
already handles the Task convention.

## Known limitation (recorded at the PR #20 fix round, 2026-07-08)

Terminal exclusion covers exactly what the spec above scoped: the lint skip, `list
--open`, and the `status` sweep SORT — not the freshness sweep itself. A terminal
(done/canceled) doc whose `timestamp` ages past the kind's freshness horizon still
appears in `status`'s `stale_docs`. This is deliberate spec scope, not an oversight:
staleness is a property of the record, not of the work's openness. Revisit only if
terminal-doc stale noise materializes on the live board (~30d observation window).
