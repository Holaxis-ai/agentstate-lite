---
type: Task
title: >-
  Generated MCP views: model cannot discover bundle types/fields; no-match
  errors should name them
status: in_progress
priority: '2'
actor: claude-main
description: >-
  CLAIMED claude-main 2026-07-28 (Brian's go). Building the error-enrichment
  slice as this unit's coherent claim: the generated-path no-match error becomes
  self-describing — a type miss names the bundle's actual types (bounded list)
  with a nearest-match hint ('task' -> 'Task'); a field-filter miss reports how
  many documents the type matched and the observed values of the filtered field
  (bounded), so 'priority 1-4' style facts surface exactly when needed. The
  model-visible kinds-CATALOG idea stays OUT of this unit — it needs the
  tool-placement call that tasks/mcp-durable-view-catalog's
  two-model-visible-tools pin owns; flagged there rather than built here.
  Ordinary tier: unit+server tests in-diff, repo gates, independent review at
  exact SHA before PR.
timestamp: '2026-07-28T16:27:07.733Z'
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
