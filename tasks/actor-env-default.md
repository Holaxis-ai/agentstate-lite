---
type: Task
title: 'AGENTSTATE_LITE_ACTOR: env default for --actor (flag > env > absent)'
status: in_progress
priority: '2'
description: >-
  Implement one CLI actor-resolution boundary and route the document mutation
  surfaces through it.


  Contract:

  - Resolve actor with precedence `--actor <name>` > `AGENTSTATE_LITE_ACTOR` >
  absent.

  - Attribution is advisory metadata, not authentication.

  - Keep core/storage environment-agnostic: resolve ambient configuration at the
  CLI boundary and pass the resolved value downward.

  - A present-but-blank explicit flag remains a USAGE error. Pin and document
  the chosen behavior for a present-but-blank environment value.


  Initial consumers:

  - `new`, `doc write`, and `doc update` use the shared resolver instead of
  duplicating flag validation and trimming.

  - `link add` accepts `--actor` and carries the resolved actor through the
  exported `addLink` path.

  - `new --link` passes its already-resolved actor into that same `addLink`
  path.


  Attribution invariants:

  - A substantive document mutation persists the resolved actor in
  `frontmatter.actor`, which sync awareness and receipts consume.

  - The same mutation passes the resolved actor through `WriteOptions.actor` for
  attributed backend version history.

  - `link add` overwrites the source document's actor only when it actually adds
  a link.

  - Re-adding an existing link remains a true no-op: no actor, timestamp, body,
  or history rewrite.

  - An ambient actor does not turn an otherwise empty/no-op `doc update` into a
  write; actor attributes a mutation rather than manufacturing one.


  Required evidence:

  - Deterministic tests for flag-over-env precedence, env fallback, neither
  source, blank-input policy, both attribution channels, `link add` idempotency,
  and consistent `new --link` attribution.

  - Local and remote behavior remain aligned.

  - Update CLI help, generated reference/skill guidance, and any stale prose
  claiming no actor default.

  - Run the repository's required build/typecheck/test gates, then independent
  code review and QA before merge.


  Scope note: this unit covers actor-aware document mutations and the missing
  link mutation. Delete, recipe, initialization, promotion, blob, and
  reserved-file attribution have distinct semantics and are not implicitly
  broadened by the phrase “all writes.”
actor: codex
assignee: codex
timestamp: '2026-07-12T18:31:12.794Z'
---

