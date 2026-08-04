---
type: Context Note
title: 'R0 discovery: positive rail already proved; negative rail belongs to L0'
description: Prior evidence challenges whether the staged R0 fixture is load-bearing.
actor: codex-takeover-main
timestamp: '2026-08-04T17:35:15.478Z'
---
# Summary

The staged R0 fixture may not have a distinct prerequisite purpose: the bundle already records a successful isolated installed-host positive rail, while the accepted plan assigns negative rails to later L0.

# Existing proof

`context-notes/precompact-v3-live-rail-probe` records Claude Code 2.1.220 in a fresh temporary `CLAUDE_CONFIG_DIR` and scratch project. It observed, for the same full session identity:

- manual `PreCompact(trigger=manual) -> SessionStart(source=compact) -> PostCompact(trigger=manual)`;
- automatic `PreCompact(trigger=auto) -> SessionStart(source=compact) -> PostCompact(trigger=auto) -> first response -> Stop`;
- accepted SessionStart `hookSpecificOutput.additionalContext` on startup/resume/compact;
- sequential timing and the fact that PreCompact may fire when compaction is later declined; and
- native compact-summary insufficiency, establishing why preparation must finish before PreCompact returns and restoration belongs in compact SessionStart.

The note explicitly says the automatic rail is proven invocable before component implementation and retains full candidate acceptance for later Review/QA/live gates.

# Existing later ownership

`plans/pre-compact-multi-session-v3` assigns manual+auto PreCompact block, SessionStart halt, helper absence/non-executable/timeout to L0 after candidate freeze, exact-artifact Review, and adversarial QA. The more detailed T3.5 plan likewise treats those negative host cases as L0.

# Decision required before another repair

The product/plan gate must identify a unique knowledge gap that the staged prerequisite R0 fixture closes. Replaying positive rail behavior with a second safety/settings authority is not sufficient. If the only remaining gaps are negative candidate behavior or artifact-bound acceptance, retire the staged untracked R0 scripts and keep those checks at L0. If the installed version change from 2.1.220 to 2.1.221 creates a compatibility concern, use a narrowly reviewed version-compatibility probe built on the existing T0 harness rather than a parallel end-to-end authority.

# Confidence

High on the prior evidence and stage ownership; medium on whether a new 2.1.221 compatibility probe is necessary until product review decides what version boundary the project promises.
