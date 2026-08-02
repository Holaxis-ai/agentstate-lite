---
type: Task
title: >-
  Generated MCP views: model cannot discover bundle types/fields; no-match
  errors should name them
status: done
priority: '2'
actor: openai/codex
description: >-
  Shipped in PR #179 (merge beea568): bounded launch-envelope type/field
  evidence, conjunction-accurate no-match diagnostics, and only
  retry-representable suggested values. Review findings were addressed and the
  full gate passed.
timestamp: '2026-08-02T03:11:29.478Z'
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
