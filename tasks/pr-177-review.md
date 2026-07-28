---
type: Task
title: 'Review PR #177 intrinsic height growth'
status: in_progress
priority: high
assignee: codex-pr177-reviewer
description: >-
  Independent exact-SHA review of the MCP nested-frame sizing repair; read-only,
  with security-boundary and timing probes.
actor: codex-pr177-reviewer
timestamp: '2026-07-28T21:24:11.417Z'
---
# Purpose

Ultimate goal: keep agentstate-lite a shared, open, portable knowledge substrate where humans and agents can co-create dependable, user-owned knowledge without host-specific behavior weakening the system.

Proximate goal: independently review PR #177 at exact head `1fabda01a3c5615c5130a618ddcf0bd23d59d048` for correctness, security-boundary preservation, and first-render intrinsic-height behavior. This serves the ultimate goal by ensuring conversational Views behave reliably in their host while the trusted-shell and opaque-child boundaries remain intact.

# Scope

Read-only review of the three changed files in PR #177, the affected sizing contracts, relevant tests, and CI evidence. Do not modify or post to the PR branch. Record empirical and reasoned findings separately.

# Progress

Claimed after reading the North Star, the reopened implementation task, and the MCP App sizing research. Exact PR head and base are pinned; isolated worktree audit and adversarial verification remain.
