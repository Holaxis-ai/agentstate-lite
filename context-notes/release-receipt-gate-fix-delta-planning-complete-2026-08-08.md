---
type: Context Note
title: P5A receipt-gate fix-delta planning complete
actor: openai/codex-plan-receipt-gate
timestamp: '2026-08-08T16:40:32.046Z'
---
# Summary

Planning and domain modelling for the P5A receipt-gate fix delta are complete. No code, git state, branch, commit, test result, network state, or allowed-signers file was changed. Bundle sync is intentionally left to the orchestrator.

Ultimate goal: safe protected npm distribution with human-controlled publication. Proximate goal progress: the fix delta is now specified well enough for Build; the next action is to integrate current main and implement the code+test unit described in `plans/release-receipt-gate-fix-delta`.

# Durable outputs

- `context-notes/release-receipt-gate-domain-model-2026-08-08`: candidate/stage/actor/asset taxonomy, state invariants, workflow timing, trust boundaries, policy matrix, and final publication inventory rule.
- `plans/release-receipt-gate-fix-delta`: acceptance criteria, exact file/test targets, Build -> independent Review -> targeted adversarial QA -> repository gate -> Brian-owned PR dependency chain, and bounded parallelism.

# Assumptions and builder checks

1. A sibling auxiliary suffix should satisfy the same live npm stage-ID grammar used by the retained chain; arbitrary tokens must not gain auxiliary status. Dry-run never mutates or publishes, so its synthetic stage token does not require sibling cleanup.
2. Recognized sibling evidence is tolerated only while the release is a mutable draft. The final published allowlist excludes it. If preserving rejected-stage evidence becomes a product requirement, it needs a separate explicitly trusted archive surface; leaving it on the published release contradicts M1.
3. The final status-byte proof should compare the uploaded asset's digest with the generated file. Existing code already relies on GitHub asset `digest` for retained assets. The builder must verify that the post-upload release API supplies the new asset digest; if it does not, download that exact asset ID and hash its bytes before publication rather than weakening the gate to name-only.
4. A final re-query/check narrows but cannot eliminate a race by another simultaneously authorized `contents:write` principal. The workflow's version-scoped concurrency plus P5S environment/branch/tag protection remains part of the trust boundary.
5. The lower-priority tag-versus-release-ID upload observation remains outside this delta unless exact retry-safe normalization cannot be implemented without addressing it.

# Human-only gate

Brian must verify at PR review that the three committed `.github/release-allowed-signers` lines are the intended current keys for Brian and Mike. Machine tests may prove syntax/principal shape but must not mark that human identity judgment complete.

# Status

Planning status: complete; confidence high. No planning blocker remains.

[hands off plan](../plans/release-receipt-gate-fix-delta.md)

[updates task](../tasks/p5a-pre-live-hardening.md)

[continues handoff](receipt-gate-codex-handoff.md)
