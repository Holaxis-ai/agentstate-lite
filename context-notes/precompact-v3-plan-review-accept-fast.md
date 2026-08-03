---
type: Context Note
title: Revision 3 product and acceptance plan-gate review
actor: codex-precompact-v3-plan-accept-fast
timestamp: '2026-08-03T18:10:58.958Z'
---
# Summary

FAIL — plan gate. Confidence: 0.91.

Reviewed exact bundle versions:

- `designs/pre-compact-multi-session` — `sha256:8c661dcc49138c854db3dff875a46c4d69794167b8e18993047ae9dc72f6cd1c`
- `plans/pre-compact-multi-session-v3` — `sha256:367bb958ae6dd13581ec11789311338e4b58c41cf2b4792b034093ab1a74d3a1`
- `context-notes/precompact-v3-live-rail-probe` — `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets. Proximate goal: make revision 3's acceptance path prove a useful, private handoff reaches the model on the exact reviewed artifact; this serves the ultimate goal by preventing a mechanically green but cognitively failed session boundary.

# Blocking findings

1. **The repository gate is out of order.** Design acceptance requires repository/package gates before exact-SHA Review, but the plan defers full `npm run check` to S0 after both live journeys. Move the full gate into G0 before R0. Any source or packaged-artifact change after G0 must restart R0 -> Q0 -> L0 -> L1.

2. **The live oracle does not yet require proof that the model consumed the restored context.** “Card canary restored” can be satisfied by inspecting a hook payload, journal, or receipt. In each manual and automatic journey, place unique values only in the pre-compaction transcript, ensure they are absent from the compaction-driving prompt and PostCompact summary, and require the first post-compaction assistant response to reproduce them. Then require the later Stop/SubagentStop acknowledgement. This is the load-bearing rail oracle.

3. **Exact-artifact continuity is asserted but not mechanically pinned.** G0 must freeze a candidate manifest containing source commit, packed CLI/tarball SHA-256, CLI version identity, harness revision, and installed Claude version/commit. R0, Q0, L0, and L1 must record and compare that same digest; rebuilding or changing bytes restarts the chain.

4. **Support status is broader than the evidence.** The real probe establishes Claude Code `2.1.220` commit `4073f59596e2`, while the design says Claude is simply supported/installed. Status and install receipts need to distinguish `verified host artifact`, `installed but unverified`, and unsupported runtimes. An unverified Claude artifact must not be reported as proven compaction support.

5. **Fail-closed operator recovery is not actionable.** `HANDOFF_IN_FLIGHT` can block later compaction; corrupt/malformed records are retained, while public handoff commands are a non-goal and status must not reveal content. Define a content-free diagnostic and a safe exact-identity/version-guarded recovery action, or explicitly bound automatic recovery and its worst-case wait. “Inspectable and local” is not sufficient without an operator entry point.

6. **Decision-card usefulness needs a stronger acceptance row.** Automated and live fixtures should require at least goal/task reference, one constraint, one evidence-backed decision, one deliberately unknown slot, and one exact next command; prove current prompt and next action survive truncation, truncation is disclosed, output stays below 8,000 characters, and the first post-compaction response uses the card. A single undifferentiated canary does not validate the eight-slot product claim.

# What survived

- The dependency graph correctly requires independent exact-SHA Review before adversarial QA, and QA before both live gates.
- Privacy placement is appropriately local-only and the live probe used an isolated `CLAUDE_CONFIG_DIR`; acceptance also checks project/global diffs, permissions, redaction, and unsupported-runtime truth.
- The decision card is deterministic, evidence-labelled, bounded, and allows `unknown`; this is a useful representation once the live oracle above is tightened.
- Manual and automatic host rails were exercised before implementation, including the critical PreCompact -> SessionStart(compact) -> PostCompact ordering and declined-compaction retry case.

# Progress / next action

Plan review complete. Revise the plan/design to close findings 1-6, then rerun the independent plan gate before T0 or production code.
