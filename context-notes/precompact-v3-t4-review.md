---
type: Context Note
title: Revision 3 T4 and rebase review
actor: codex-precompact-v3-t4-reviewer
timestamp: '2026-08-03T21:22:35.639Z'
---
# Summary

FAIL for the T4/rebase-only review at exact SHA `05466678ea25c3d4d43043c20969aaad3f52dd6b`, confidence 0.99. The rebase is mechanically faithful and the intended documentation/help changes do not alter the reviewed T3 mechanics, but the generated npm skill still emits a late legacy note that contradicts the new Claude lifecycle rail. T4 therefore has not met its source-documentation truthfulness gate.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently verify the exact rebased T3+T4 SHA preserves the reviewed implementation while making the Claude compaction-handoff lifecycle, support, privacy, durability, recovery, and acceptance boundaries accurate and legible; this serves the ultimate goal by preventing stale or misleading operational scaffolding from becoming the next candidate premise.

Scope: T4 and rebase only. This is not T3.5, G0, exact-artifact Review, QA, or live acceptance.

# Blocking finding

## Generated skill contradicts the installed Claude command and branch behavior

Empirical. `packages/cli/src/skill-render.ts:501-512` still teaches that `hook install` registers a SessionStart hook for Claude Code, Codex, and OpenCode "that runs `session-start`" and that the render always appears. The regenerated npm artifact repeats this at `packages/cli/SKILL.md:485-489`, after the new accurate compaction-handoff section.

That universal statement is false for the implemented Claude rail:

- `packages/cli/src/commands/hook.ts:211-221` composes Claude's installed command as the managed `<bin> hook run` adapter, not `<bin> session-start`;
- `packages/cli/src/commands/hook-lifecycle.ts:246-259` returns the handoff alone for compact or eligible resume, returns `continue:false` for a blocked compact, and delegates to board orientation only when no handoff output wins;
- `packages/cli/src/commands/hook-authority.ts:109-122` distinguishes compact/resume handoff selection from the ordinary startup/clear path.

The result is one generated skill with mutually inconsistent instructions: the detailed section correctly says Claude uses a five-event adapter and compact/eligible-resume paths exclude board work, while the later Notes section reasserts the retired direct-`session-start` model and an unconditional render. This violates the accepted T4 requirement that source-owned help/reference/skill text accurately state the lifecycle and support boundary. It also weakens progressive disclosure at the exact session-boundary scaffold this change is meant to make reliable.

Required repair: replace the legacy shared note in `renderNotesSection` with runtime-accurate guidance: Claude installs `hook run`, which delegates startup/clear and no-eligible-handoff resume to `session-start`; compact and eligible-resume return only handoff output. Codex/OpenCode install direct `session-start`. Regenerate `packages/cli/SKILL.md` and add a truthfulness regression that rejects the old universal wording. The repair creates a new SHA and requires this T4/rebase review again.

# Evidence that survived review

- `origin/main` is an ancestor of the reviewed SHA.
- `git range-diff 138a3c7c756e5fdb883a84b3c10611f92253033e..0b23287ede1e5d9ce6052d21649bf70cfb0b39af origin/main..05466678ea25c3d4d43043c20969aaad3f52dd6b` reports all 13 commits patch-equivalent. The rebase only transposed the reviewed implementation plus T4 over the current `0.1.0-pre.3` upstream.
- The T4 commit touches source docs/help, the skill generator/resource index, and generated `packages/cli/SKILL.md`. Inspection found no production lifecycle transition, identity, persistence, readiness, recovery, or GC change. The bot-owned plugin SKILL/bundle is untouched.
- The new detailed source documentation otherwise matches the accepted design on the sole compact SessionStart restore rail, PostCompact audit role, informational Stop/SubagentStop evidence, exact verified-host tuple, unsupported Codex/OpenCode compaction, full project/execution identity, private journal, fixed seven-day logical expiry with invocation-driven GC, process-level CAS/read-back without fsync durability, content-free exact-version recovery, and digest-pinned live acceptance.
- Root build passed.
- `npm run check:skill -w @holaxis/aslite` passed and reported the npm skill current. That byte-drift gate does not detect the semantic contradiction above.
- Focused reference/help/skill-distribution tests passed: 49/49.
- Relevant built-helper/in-process integration bridge passed: 8/8.
- `git diff --check` passed and the detached review worktree remained clean.

# Reviewer calibration

The green generator and focused tests prove projection consistency, not prose truth. The blocker was found by comparing the final rendered skill against the actual installed command and source-dependent adapter branches. Shipping the contradictory late note would make the load-bearing session-boundary scaffold less legible, so this is FAIL rather than PASS-with-caveats.
