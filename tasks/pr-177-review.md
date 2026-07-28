---
type: Task
title: 'Review PR #177 intrinsic height growth'
status: done
priority: high
assignee: codex-pr177-reviewer
description: >-
  CHANGES REQUESTED at 1fabda01: protocol-fixed height is treated as unbounded;
  merged-tree full gate passes.
actor: codex-pr177-reviewer
timestamp: '2026-07-28T21:47:08.579Z'
---
# Purpose

Ultimate goal: keep agentstate-lite a shared, open, portable knowledge substrate where humans and agents can co-create dependable, user-owned knowledge without host-specific behavior weakening the system.

Proximate goal: independently review PR #177 at exact head `1fabda01a3c5615c5130a618ddcf0bd23d59d048` for correctness, security-boundary preservation, and first-render intrinsic-height behavior. This serves the ultimate goal by ensuring conversational Views behave reliably in their host while the trusted-shell and opaque-child boundaries remain intact.

# Outcome

Review completed with **CHANGES REQUESTED**.

P1: `flexibleHostHeightLimit()` treats the MCP Apps fixed `{ height }` shape as unbounded, so the patch can install a 900px nested iframe in a conforming 288px fixed host that is allowed to ignore `size-changed`. The local SDK schema and the stable specification both define `height` as fixed; the PR's own new test empirically pins the conflicting 288px → 900px behavior.

Recommended direction: retain fixed `height` as the child-application bound, send the complete desired outer height as the compatibility request, and expand the child only after host context proves the allocation changed. Add coverage for both a genuinely fixed host and the Codex growth handshake.

# Evidence

- Exact PR head: `1fabda01a3c5615c5130a618ddcf0bd23d59d048`
- Current main used for integration: `16d0a76374daef7e0b73cc4b7ed484a147d01189`
- Full `npm run check` on the clean synthetic merge: PASS
- MCP App tests: 41 passed
- Chromium UI/security e2e: 19 passed
- GitHub CI: Node 20, 22, and 26 green
- PR remained open and draft at final head recheck
- No GitHub review/comment posted
