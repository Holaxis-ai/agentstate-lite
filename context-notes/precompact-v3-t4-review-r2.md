---
type: Context Note
title: Revision 3 T4 repair review
actor: codex-precompact-v3-t4-reviewer
timestamp: '2026-08-03T21:27:53.471Z'
---
# Summary

PASS for the repaired T4/rebase-only review at exact SHA `36c741a8173832d75d61a7ab138b5219c4415c66`, confidence 0.99. The prior stale universal SessionStart claim is removed from the owning skill renderer and regenerated npm skill, and a focused regression now pins both the absence of that claim and the runtime-accurate per-host branches. No production lifecycle mechanics changed.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal achieved: independently determine whether the repaired T4 source, generated npm skill, and regression now describe the Claude `hook run` versus direct `session-start` boundary exactly without changing runtime mechanics; this serves the ultimate goal by making the session-boundary scaffold reliable to future agents and operators.

Scope: T4 repair and rebase only. This is not T3.5, G0, exact-artifact Review, QA, or live acceptance.

# Prior blocker result

Closed empirically.

- `packages/cli/src/skill-render.ts:501-513` now states that Claude Code installs five managed lifecycle events on `hook run`; startup, clear, and resume without an eligible handoff delegate to `session-start`; compact and eligible-resume return only the handoff result or halt; Codex/OpenCode install direct board-only `session-start` hooks.
- Regenerated `packages/cli/SKILL.md:485-491` carries the same wording. The retired universal claim is absent.
- `packages/cli/test/skill-distribution.test.ts` adds `rendered skills distinguish Claude hook run from direct board-only SessionStart hooks`. It checks both generated channels, rejects the exact stale universal wording, and requires the Claude delegation, isolated compact/eligible-resume, and direct Codex/OpenCode branches.
- Runtime comparison agrees: `claudeLifecycleHookCommand` composes managed `hook run`; the SessionStart adapter returns validated context or `continue:false` before its board fallback; authority integration proves fresh resume bypasses board work while stale resume falls back.

# Independent evidence

- Refreshed `origin/main`; it is an ancestor of the exact reviewed SHA. Detached review worktree was clean before and after verification.
- Repair commit `36c741a` changes only `packages/cli/src/skill-render.ts`, generated `packages/cli/SKILL.md`, and `packages/cli/test/skill-distribution.test.ts`. Inspection found no lifecycle transition, identity, storage, readiness, recovery, GC, install, or command-dispatch change.
- No file under `plugins/` differs from `origin/main...HEAD`; the bot-owned plugin SKILL/bundle projection remains intentionally untouched per repository policy.
- Root `npm run build`: PASS.
- `npm run check:skill -w @holaxis/aslite`: PASS; the npm skill is byte-current with the renderer.
- Focused reference, help, generated-skill, lifecycle, and new truthfulness regression suite: 66 passed, 0 failed.
- Relevant implementation bridge `hook-authority-integration.test.ts`: 8 passed, 0 failed, including fresh/stale resume board isolation, main/subagent identity separation, helper/root-health agreement, and install/status readiness agreement.
- `git diff --check origin/main...HEAD`: PASS.

# Survived review boundary

The T4 documentation continues to state the accepted exact-host, lifecycle, privacy, durability, content-free recovery, unsupported-runtime, and immutable live-acceptance boundaries. This verdict certifies only source documentation, generated npm projection, the repair regression, and behavior-preserving rebase integration. The separately identified T3.5 candidate-freeze and real-Claude attestation work remains a prerequisite before G0 and live acceptance; this PASS does not weaken or pre-approve that gate.

# Verdict

PASS. T4 may advance on exact SHA `36c741a8173832d75d61a7ab138b5219c4415c66`. Any further source, generated-skill, or regression change requires a new exact-SHA review.
