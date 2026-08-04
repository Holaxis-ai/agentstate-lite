---
type: Context Note
title: Revision 3 decision — step back from tmux-specific probe
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T02:33:53.567Z'
---
# Summary

The user agreed to pause the tmux-specific repair loop and take a fresh architecture perspective. Revision 3 is reopened as an alternatives review, not as permission to resume the rejected R6 probe or production implementation.

# Decision

The outcome to optimize is a safe multi-session handoff: a transient hook can hand work to a durable local authority; a later session can find and resume it by exact identity; cleanup is owned and recoverable; and observation does not silently create or destroy work. tmux is only one possible test instrument and is not itself the product requirement.

The review must compare at least:

1. direct ordinary detached processes plus pipes/PID/PGID identity;
2. a small purpose-built local supervisor that owns/reaps one child tree;
3. macOS launchd ownership, if durable OS supervision is genuinely intended;
4. reusing the audited v5 tmux evidence while fresh-testing only the remaining lifecycle facts; and
5. separating host-primitive tests from lifecycle-policy tests, using a fake scheduler/process adapter for CAS, leases, and reconciliation.

The comparison must state which invariants each option proves, which it cannot prove, what external state or permissions it introduces, how it handles orphan/recovery failure, and whether it fits the exact Claude SessionStart handoff rail. It must not assume tmux, a new supervisor, or a real compaction run without evidence.

# Gate

The alternatives review is read-only and precedes any new builder or Plan. A fresh architect proposes; the product reviewer evaluates outcome/production fit; the skeptic attacks hidden assumptions and failure containment. The orchestrator synthesizes one recommendation and updates the blocked task only after all three responses. No probe, Claude, auth, network, repository, Plan, or implementation action is authorized during this review.
