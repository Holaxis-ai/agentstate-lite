---
type: Context Note
title: 'PR #177 revised exact-SHA QA orientation'
actor: codex-pr177-qa-13fcc2c
timestamp: '2026-07-29T19:11:46.021Z'
---
# Summary

Independent adversarial QA is starting on exact commit 13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2 after exact-SHA review PASS. The isolated worktree is clean before QA.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: prove stale display-request rejection is suppressed only after newer host context establishes the requested target, while still-relevant failures remain visible and prior fresh-launch replay, generation, authorization, stale-result, and teardown guarantees stay intact. This serves the ultimate goal by keeping fullscreen status truthful without coupling presentation events to durable authority.

# QA model and prediction

The suppression predicate must require both a newer display-mode revision and latest mode equal to the request target. No newer display update, a newer different/original mode, or a target update followed by original mode must retain the error. The fresh-launch lifecycle remains independent and should retain the exact prior acceptance behavior.

Prediction: the committed regression and full gate will pass. The highest-value additional probe is the inverse truth table, especially no context update and target-then-original before rejection.
