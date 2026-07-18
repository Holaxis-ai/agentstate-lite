---
type: Task
title: Fallback git identity for sync-family commits (receipt-polish item 3)
description: >-
  CLAIMED 2026-07-18 (mike/claude line, Sonnet builder). Spec DECIDED by Mike
  2026-07-18 (recorded on tasks/sync-receipt-edge-polish): when git identity
  resolution FAILS (fresh CI/container, empty gitconfig — today the flow dies
  with raw 'Please tell me who you are'), sync-family commits apply a
  per-invocation fallback via -c flags: user.name = the resolved ACTOR (fallback
  'agentstate-lite'), user.email = <actor-slug>@agentstate-lite.invalid (RFC
  2606; repo precedent test-suite@example.invalid). ONLY when resolution fails —
  users with real identities are untouched (pinned); never writes config. Safety
  basis: commit authorship is provably non-load-bearing in-product (no consumer
  parses authors/subjects; frontmatter is the attribution channel). Accepted
  judgment point: the committed-case cleanup commit carries the synthetic
  identity into code-repo history via the human-opened PR — accepted as honest
  (machine-authored) vs the flow dying. DoD: guarded flag-set + a
  fresh-container (empty gitconfig, env-isolated) test through a REAL sync
  commit + the cleanup-commit path + an identity-configured no-override pin.
actor: mike/claude
status: in_progress
timestamp: '2026-07-18T18:13:23.061Z'
---
Parent: tasks/sync-receipt-edge-polish item 3. Was blocked on PR #104 (same porcelain files); unblocked 2026-07-18.
