---
type: Context Note
title: Revision 3 T4 documentation builder
actor: codex-precompact-v3-docs-builder
timestamp: '2026-08-03T21:25:08.427Z'
---
# Summary

T4 documentation and its exact review-blocker repair are complete at commit `36c741a8173832d75d61a7ab138b5219c4415c66` on `feat/precompact-handoff-v3`. No production mechanics changed; one focused documentation-truthfulness regression test was added.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal achieved: make the exact-host compaction-handoff pilot understandable and operable from source-owned documentation without changing the frozen T3 mechanics; this serves the ultimate goal by making the session-boundary scaffold legible, bounded, and testable.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, and agentstate-lite.

# Delivered

Source-owned files updated:

- `packages/cli/src/commands/hook.ts`: operator help and source comments for five lifecycle roles, exact-host/readiness states, full identity, private journal, fixed expiry/event GC, process-level durability, content-free diagnosis/recovery, and structural foreign-hook preservation.
- `packages/cli/src/reference.ts`: honest top-level command reference including health/diagnosis/recovery.
- `packages/cli/src/distribution-resources.ts`: matching command-resource key.
- `packages/cli/src/skill-render.ts`: one shared detailed operating contract rendered into both distribution channels.
- `README.md`, `packages/cli/README.md`, and `CLAUDE.md`: concise front-door and maintainer projections, including Claude-versus-Codex/OpenCode support boundaries.

Generated file updated:

- `packages/cli/SKILL.md`, generated with `npm run gen:skill -w @holaxis/aslite`. The plugin-channel SKILL and compiled plugin bundle remain untouched because repository policy assigns them to the merge bot.

The generated skill names the pinned Claude `2.1.220` Darwin/arm64 realpath/digest tuple, PreCompact prepare, compact SessionStart load-bearing restore, PostCompact audit, Stop/SubagentStop informational observation, canonical bundle plus complete execution identity, private 0700 journal, seven-day logical expiry with event-driven physical GC, no-fsync durability boundary, content-free exact-version recovery, readiness failure states, structural hook ownership, unsupported runtimes, and the one-manifest Review -> QA -> negative -> manual -> automatic -> sub-agent rail.

# Verification

- `npm run typecheck -w @holaxis/aslite`: PASS.
- `npm run check:skill -w @holaxis/aslite`: PASS; npm SKILL current.
- root `npm run build`: PASS.
- focused reference, skill-distribution, hook-lifecycle, and help-index tests with `--test-concurrency=1`: 65 passed, 0 failed.
- exact helper-readiness test isolated: PASS.
- built `aslite hook --help` and top-level `aslite --help`: expected exact-host, lifecycle, readiness, durability, recovery, and expanded command reference present.
- `git diff --check`: PASS. Diff privacy scan found no auth/API token, raw lifecycle payload field, transcript-path, compact-summary, assistant-message, or temporary-root content. Worktree clean after commit.

A first parallel focused run passed 64 tests and timed out only the timing-sensitive healthy-helper probe at its exact 1.5-second boundary; the same test passed in isolation and the whole focused set passed serially. This is recorded as suite contention, not hidden.

# Review-blocker repair

Exact T4 review `context-notes/precompact-v3-t4-review@sha256:9e5ce16360380d70cd76c10dd16a3150019c2fdd1babf05f705116e1c230d605` correctly found that the late universal Notes bullet still said all three runtimes installed direct `session-start`, contradicting the accurate detailed section and implemented Claude adapter.

Commit `36c741a8173832d75d61a7ab138b5219c4415c66` repairs the one source authority in `packages/cli/src/skill-render.ts`: Claude's five events use managed `hook run`; startup/clear and resume without an eligible handoff delegate to board-oriented `session-start`; compact and eligible-resume return only handoff output or halt with no board/network/home work; Codex/OpenCode retain direct `session-start` board hooks. `packages/cli/SKILL.md` was regenerated through the repository generator.

`packages/cli/test/skill-distribution.test.ts` now renders both skill channels and rejects the retired universal sentence while requiring every runtime-specific branch above. This test would fail on the reviewed stale prose.

Repair verification:

- CLI typecheck and root build: PASS.
- npm skill drift check: PASS.
- focused reference, skill-distribution, and built-help lane: PASS with deterministic serial execution.
- `hook-authority-integration.test.ts` bridge: PASS.
- built top-level and hook help smoke: PASS.
- `git diff --check` and repair-diff privacy scan: PASS; no auth/token, raw lifecycle payload, transcript path, compact summary, assistant message, or temporary-root data appeared.

# Caveat and next action

The branch now contains current `origin/main` and is 14 commits ahead. The next action is independent exact-SHA T4 re-review at `36c741a8173832d75d61a7ab138b5219c4415c66`; downstream candidate freeze remains blocked until it passes.

No live Claude acceptance or global configuration mutation occurred in T4.
