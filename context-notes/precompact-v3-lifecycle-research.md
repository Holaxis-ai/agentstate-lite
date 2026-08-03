---
type: Context Note
title: 'Revision 3 lifecycle research: Claude Code 2.1.220 compaction rail'
actor: codex-precompact-v3-lifecycle
timestamp: '2026-08-03T17:33:28.527Z'
---
# Summary

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets, in plain text and owned by the user.

Proximate goal: determine a supported, testable Claude Code 2.1.220 lifecycle rail and isolated live-compaction acceptance harness; this serves the ultimate goal by making compaction handoffs durable, observable, and fail-closed at the session boundary.

Status: orientation complete; official-runtime and installed-runtime research in progress. No repository code, hooks, settings, task state, active sessions, or global files will be changed.

## Current system model

- Revision 2 is rejected because PreCompact/PostCompact `hookSpecificOutput.additionalContext` is unsupported and was rejected in a real transcript.
- The supported model-visible post-compaction boundary is SessionStart with `source: compact`.
- Revision 3 requires one executable lifecycle authority, full canonical execution identity, validated handoff generations, durable write/read receipts, explicit restore acknowledgement, version-guarded consume, and named GC behavior.
- Exact live installed-version evidence is required for both manual and automatic compaction; isolated command/component tests alone do not accept the rail.

## Research questions

- Which hook event can write a sufficiently rich handoff before the old context is discarded?
- What are the exact inputs, supported outputs, ordering, timeout, and exit/block semantics for PreCompact, PostCompact, and SessionStart source=compact?
- What can `compact_summary` provide, and does transcript timing make PostCompact safer or weaker than PreCompact?
- How do ordinary resume, fork, subagent events, and repeated compactions affect canonical identity and generation handling?
- How can manual and automatic compaction be tested under an isolated `CLAUDE_CONFIG_DIR` without touching active sessions?

## Evidence read

- `docs/core`
- `context-notes/precompact-v3-orientation`
- `reviews/pre-compact-multi-session-team-2026-08-03`
- `designs/pre-compact-multi-session`
- `context-notes/review-precompact-codex-concurrency`
- `context-notes/review-precompact-codex-ecosystem`
- `context-notes/review-precompact-codex-skeptic`

## Unverified assumptions

- Whether the installed noninteractive CLI can trigger `/compact` directly.
- Whether automatic compaction can be forced with configuration alone or requires filling the context window through model/API usage.
- Whether `compact_summary` contains a faithful decision card or only a model-authored summary that must be treated as lossy input.
- The precise transcript visibility point for PreCompact and PostCompact in 2.1.220.

Progress: official documentation and installed artifact/configuration inspection are next.
