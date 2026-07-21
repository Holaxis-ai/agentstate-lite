---
type: Context Note
title: Home truth post-merge fix plan review
actor: codex-plan-reviewer-home-truth
timestamp: '2026-07-21T22:01:09.510Z'
---
# Summary

Final verdict: **PASS. No blockers.**

Reviewed base: `a6a3b2724e1cd01a4bd50c475d326cbc30b693a8` in the detached isolated review worktree.

Final reviewed plan: `plans/home-truth-postmerge-fixes` version `sha256:ea59790fe406fe72d0e67d83a08ffac81747b24ba7b68b03a13ba72d138cd518`.

Confidence: high. This was a read-only planning review; no code was changed and no test suite was run.

## Review result

The final plan safely and completely covers the three PR 137 post-merge truth bugs:

- Remote orientation is gated by runtime mode plus local root, and its test uses the actual contradictory remote shape with a non-null root.
- Sharing freshness is driven by a server-owned optional `refresh_after_ms`, not by document SSE alone or an unrelated hard-coded browser cadence.
- The scheduler is total and bounded: invalid or nonpositive intervals disable polling; valid intervals cap at five minutes; invalid and future evidence times, expired responses, remaining TTL, and a 250ms retry floor are specified.
- Dynamic config polling composes `getInterceptorStatus() === ok` as a hard stop and pins unauthorized, session_expired, and rate_limited terminal states.
- Hosted summaries omit the interval and do not poll.
- Git failure truth uses a new detailed board-git probe with repo, not_repo, and unavailable results. Legacy `repoTopLevel` null behavior remains unchanged for its heterogeneous sync, repair, autopull, home, and session callers.
- Malformed-repository unavailable and genuine non-repository private rows are deterministically red-pinned.
- Package ownership remains correct: ui-server owns the plain summary shape, CLI owns classification and TTL, and the SPA owns words and scheduling.
- Builder to independent exact-SHA Review to QA is explicit; behavior-changing corrections require a new review before QA.

## Revision trail

First-pass plan version `sha256:6d13e05916afc7ac50d5b8ffde61a9e34ce432369625e630dbe34600d9371fb2` required two changes: avoid globally strengthening `repoTopLevel`, and fully specify scheduler safety. Intermediate version `sha256:cae87f1b59fafb67ea21aa2ac99652d7160f25b2d89a4bda87d009bac96b7cad` resolved both except the global terminal interceptor gate. The final version above adds that hard stop and deterministic terminal-state coverage. No remaining blocker or scope expansion was found.
