---
type: Task
title: >-
  Generated MCP views: model cannot discover bundle types/fields; no-match
  errors should name them
status: in_progress
priority: '2'
actor: claude-main
description: >-
  PR #179 review round ADDRESSED at 6eae227 (branch
  feat/mcp-empty-selection-self-description: 23a4c86 mechanic, 546bff6 + 6eae227
  review rounds). Codex reviewer's three findings all fixed: P1 field evidence
  now bounded to the launch's frozen envelope (limit threaded from server;
  'values in the first N matched document(s)' label) — the reviewer's 25-row
  probe reproduced over real stdio, row-25-only value no longer disclosed, pin
  red-verified; P2 empty type+prefix INTERSECTION reported as a conjunction,
  type axis asserted only when the whole-bundle type list settles it, prefix
  axis never claimed empty on intersection evidence; P3 only retry-representable
  values advertised (isRepresentableFilterValue mirrors the
  comma-split/trim/non-empty grammar against matchesFilter's exact comparison) —
  empty/padded/comma-bearing/over-long values counted not shown, clipping
  removed since clipped values cannot round-trip, all-unusable branch says so.
  Gates green at 6eae227 (build/typecheck/full npm test); three stdio probes
  reproduce the reviewer's cases. Earlier subagent review round (APPROVE 3xP3)
  is superseded on the value-list logic by this round. Open question for Brian:
  whether the PR reviewer re-reviews 6eae227 before merge.
timestamp: '2026-07-29T14:10:29.950Z'
---
# Field evidence (Brian, Claude Desktop chat, 2026-07-27 evening)

Asked for 'a view of tasks grouped by priority', the Desktop model: (1) queried type 'task' —
zero matches, since the bundle type is 'Task' and nothing on the MCP surface lets the model
discover a bundle's types, prefixes, field names, or enum values (Desktop chats have no CLI/skill;
show_view is the only model-visible tool); (2) correctly self-diagnosed that positional
declarative binding means the model cannot group by values it never sees, and proposed the right
pattern (one field-filtered query per group) — strong input for tasks/mcp-view-authoring-guidance.
The no-match error surfaced honestly (post-fix isError path) but named no alternatives, so the
model dead-ended on a capitalization difference.

# Fix directions

1. AXI error translation: the query-matched-nothing envelope should enumerate the bundle's
   available types (cheap: queryHeads distinct types, capped) and nearest-match hint
   ('task' -> 'Task') — same family as tasks/not-found-did-you-mean.
2. And/or a bounded model-visible kinds catalog (loadKinds already carries fields + enums +
   typed links per kind) — natural sibling of the list_views catalog in
   tasks/mcp-durable-view-catalog; respect that unit's two-model-visible-tools acceptance pin
   when deciding surface placement.
3. Authoring guidance should teach: exact type casing, field filters per group, positional
   binding limits.

[catalog unit whose tool-split this must respect](mcp-durable-view-catalog.md)
[authoring guidance this transcript feeds](mcp-view-authoring-guidance.md)
[the not-found suggestion pattern](cli-dir-error-steers-to-divergent-bundle.md)
