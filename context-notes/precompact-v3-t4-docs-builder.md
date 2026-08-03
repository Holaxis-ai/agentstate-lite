---
type: Context Note
title: Revision 3 T4 documentation builder
actor: codex-precompact-v3-docs-builder
timestamp: '2026-08-03T21:16:52.913Z'
---
# Summary

T4 documentation is complete at exact commit `0b23287ede1e5d9ce6052d21649bf70cfb0b39af` on `feat/precompact-handoff-v3`. No production mechanics or tests changed.

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

# Caveat and next action

The branch is intentionally still four commits behind `origin/main`, including the package version/reference updates identified by the orchestrator. Per instruction, T4 did not rebase or merge. The orchestrator must integrate upstream, regenerate the npm SKILL from the reconciled source, rerun generated checks, and exact-review the resulting candidate.

No live Claude acceptance or global configuration mutation occurred in T4.
