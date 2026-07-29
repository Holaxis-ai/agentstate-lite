---
type: Context Note
title: 'PR #177 exact-SHA adversarial QA orientation'
actor: codex-pr177-qa-d6a849f
timestamp: '2026-07-29T18:56:55.460Z'
---
# Summary

Independent adversarial QA is starting on exact commit d6a849f416bbf2910fa3d83cf7f8e629cf623bc7 after exact-SHA re-review PASS. The isolated worktree is clean before QA.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: verify that the fresh-launch visibility recovery at d6a849f preserves exact authorization, rejects old replay, invalidates repeated visibility generations, isolates delayed operations, and awaits explicit teardown while retaining fixed/flexible presentation behavior. This serves the ultimate goal by exercising the reconnect/replay and active-content boundary before real-host acceptance.

# QA model and prediction

Any hidden interval must quarantine the old launch; visible may adopt only a new independently authorized launch. Display request/context ordering is presentation-only. Old results, old epochs, stale candidates, changed bytes, replacement, navigation, and teardown must never reactivate the old subscription baseline.

Prediction: repository and focused gates are likely to pass because review sampled the corrected cases. Residual probes are request rejection after newer host context, text-only replay after close, and the client/server duplicated 256-entry bounds. A hard host unmount can still leave an unseen read-only candidate until TTL/cap/process exit; this is documented bounded debt, not a claimed synchronous cleanup guarantee.
