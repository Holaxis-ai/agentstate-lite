---
type: Task
title: >-
  Generated MCP views: model cannot discover bundle types/fields; no-match
  errors should name them
status: in_progress
priority: '2'
actor: claude-main
description: >-
  BUILT + REVIEWED, awaiting Brian's PR. Branch
  feat/mcp-empty-selection-self-description (23a4c86 mechanic+tests, 546bff6
  review fixes). Generated show_view empty selections are now self-describing:
  type/prefix miss names the bundle's types (bounded 12) with case/plural
  nearest-match hint ('task' -> did you mean 'Task'?); filter miss reports
  pre-filter count + observed field values (bounded 8, clipped 80 chars/value,
  arrays flattened per element to match filter semantics); absent fields and
  open:true named. Full head scan only on the miss path. Independent review at
  exact SHA 23a4c86: APPROVE, 3x P3 — 2 taken in 546bff6, 1 recorded
  (pre-existing three-way field-key-parse duplication; core parseFieldSelection
  consolidation follow-up). Disclosure analysis clean: the hint reveals nothing
  the model's existing show_view authority could not already read. Reviewer's
  stdio session reproduced both hint shapes; probes red-capable incl. the wiring
  pin. Kinds-CATALOG tool deliberately excluded — placement belongs to
  tasks/mcp-durable-view-catalog. Merge is Brian's; post-merge, the Desktop
  simple-prompt flow self-corrects without human answers.
timestamp: '2026-07-28T16:44:01.309Z'
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
