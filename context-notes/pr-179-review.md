---
type: Context Note
title: 'PR #179 exact-SHA code and design review'
description: 'Review goal and risk frame for PR #179 empty-selection diagnostics.'
tags:
  - review
  - mcp-apps
  - diagnostics
actor: codex-pr179-review
timestamp: '2026-07-28T21:31:29.930Z'
---
# Summary

Ultimate goal: keep agentstate-lite a minimal, offline-first, user-owned knowledge bundle plus an agent-oriented CLI, with operational discipline encoded at the actual write/read boundaries rather than dependent on model memory.

Proximate goal: independently review PR #179 at exact head `546bff619e96a4bf1fe266dc3a8ebb9ab4fed229`, verifying that empty generated-view selections teach a chat-hosted model truthful, bounded, retryable bundle vocabulary without adding a second discovery subsystem, widening the model's authority, or duplicating query/filter semantics. This serves the ultimate goal by making the existing experimental MCP adapter self-correcting at its current failure boundary instead of adding new product surface.

Review focus: diagnostic truth under type, prefix, field, and `open:true` misses; exact agreement with core filter coercion; bounds on scan work and rendered disclosure; nearest-match behavior; error compatibility; and whether the implementation remains the smallest intervention supported by the Claude Desktop field evidence.

# Outcome

Review verdict: changes requested at exact head `546bff619e96a4bf1fe266dc3a8ebb9ab4fed229`.

The type suggestion is the right small intervention for the observed Claude Desktop failure: it uses the existing model-visible error surface, is bounded, and avoids adding a second discovery tool. Three correctness/design defects remain:

1. When both `type` and `prefix` are present and their intersection is empty, the diagnostic falsely states that no documents exist on either axis. A probe with global types `Design` and `Task` produced: `no documents of type 'Task'; no documents under prefix 'archive/'`; the global type list in the same message included `Task`. Report the empty conjunction, or independently establish each axis before making axis-specific claims.
2. Field diagnostics derive raw values from every pre-filter row, while a normal generated launch is capped at `MAX_VIEW_OBJECTS = 20`. A 25-row probe placed `AAA-ROW-25` only in row 25; the error exposed it because observed values are globally sorted before the eight-value display cap. This moves arbitrary frontmatter through the model-visible text error channel outside the generated View's bounded/frozen selection envelope. Restrict diagnostic evidence to the same bounded prefix of rows (and say so), or avoid emitting raw document values and use declared kind vocabulary/counts instead.
3. The displayed field values are not always retryable through the actual field grammar. Probes showed the diagnostic advertising `''`, `' high '`, and `'a,b'`; retry filters `status=`, `status= high `, and `status=a,b` matched none because the parser rejects/filters empties, trims members, and treats commas as OR delimiters. Clipped values are likewise not exact. Only advertise values representable by the grammar, or introduce a shared lossless encoder/parser.

Verification: exact-head CI run `30399509381` is green for repository gates on Node 22 and 26 plus the built-CLI Node 20 smoke. Locally, `npm ci`, `npm run build`, `git diff --check`, and the focused MCP tests (`19/19`) passed in isolated worktree `/private/tmp/aslite-pr179-review.URWPFU`. The direct red probes above reproduce behavior not covered by the PR tests.
