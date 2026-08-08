---
type: Task
title: Preserve YAML date-only scalar shape across mutations
status: done
priority: '2'
actor: openai/codex
description: >-
  Merged in PR #225 as e76e10d. The one frontmatter parser now preserves YAML
  date-only and datetime scalar shape at every depth while retaining legacy
  top-level timestamp normalization; filesystem mutation proof, full Node
  20/22/26 CI, and exact-SHA independent review passed.
timestamp: '2026-08-08T13:15:39.495Z'
---
# Objective

Preserve YAML date-only scalar shape across AgentState's generic parse/mutate/stringify path so an
unquoted value such as `stale_after: 2026-08-07` remains a date rather than being widened to a UTC
datetime. Cover nested values such as `sources[].last_modified` as well as top-level fields.

# Scope

- Keep `frontmatter.ts` as the one YAML authority.
- Preserve date-only scalar semantics across parse and stringify without adding v0.2 write policy.
- Retain the existing unquoted `timestamp` normalization contract.
- Preserve current handling of ordinary datetimes and unknown nested mappings/lists.
- Add focused parse/stringify and real mutation round-trip fixtures.

# Proof

- A hand-authored unquoted top-level date-only value survives parse/stringify as `YYYY-MM-DD`.
- A nested `sources[].last_modified` date-only value survives a document mutation without becoming
  a datetime.
- Existing timestamp and datetime normalization tests remain green.
- The repository check passes.

# Non-goals

- No OKF v0.2 authoring claim, edition dispatch, provenance policy, verification policy, or status
  mapping.
- No promise of byte-identical YAML formatting after a semantic mutation; this unit protects scalar
  shape.

This is independently useful data-preservation work and a prerequisite for the later
[v0.2 write contract](./okf-v0-2-write-contract.md).

[depends on](okf-v0-2-read-transport-fixtures.md)
