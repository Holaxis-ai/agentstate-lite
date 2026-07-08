---
type: Task
title: 'Declare terminal statuses on kind conventions: THREE consumers now waiting'
status: in_progress
priority: '2'
description: >-
  The evidence-gated refinement from the expects_inbound design has its trigger
  — three independent demand signals: (1) missing_expected_links reports
  historical done/canceled tasks as noise (the original gate, 2026-07-07); (2) a
  foreign-harness agent needed OPEN = non-terminal and could not express it
  (2026-07-08); (3) the status sweep sort hardcodes the string done. Design: the
  kind convention status enum gains a terminal marker (shape TBD at build: e.g.
  fields.values.status plus terminal: [done, canceled] — mirror the
  links/expects_inbound lenient-parse pattern). Consumers: the lint
  skips-or-groups terminal instances; list gains an open semantic (with
  tasks/list-field-sets); the sweep sort reads the declaration. One small
  declaration, three existing consumers — consumer-pull satisfied for real.
actor: brian-claude
assignee: mike/claude
timestamp: '2026-07-08T23:45:00.000Z'
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
