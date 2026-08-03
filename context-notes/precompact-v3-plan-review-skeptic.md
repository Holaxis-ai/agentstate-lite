---
type: Context Note
title: Revision 3 plan gate adversarial concurrency and data-model review
actor: codex-precompact-v3-plan-skeptic
timestamp: '2026-08-03T18:02:20.199Z'
---
# Summary

Status: in progress.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: adversarially determine whether revision 3 and its implementation plan define a complete, implementable, race-safe Claude Code compaction lifecycle. This serves the ultimate goal by preventing an apparently durable handoff rail from shipping with wrong-generation restore, stale acknowledgement, or privacy failure modes.

# Review status

Reviewing the exact design version `sha256:8c661dcc49138c854db3dff875a46c4d69794167b8e18993047ae9dc72f6cd1c`, plan `plans/pre-compact-multi-session-v3`, and installed-host rail probe `context-notes/precompact-v3-live-rail-probe`.
