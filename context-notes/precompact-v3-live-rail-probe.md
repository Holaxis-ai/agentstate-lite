---
type: Context Note
title: Revision 3 installed-host compaction rail probe
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T17:58:29.155Z'
---
# Summary

Installed-host rail probe against Claude Code `2.1.220` (commit `4073f59596e2`) in a fresh temporary `CLAUDE_CONFIG_DIR` and scratch project. The probe used only temporary hook settings and files; it did not modify the user-global Claude/Codex configuration, the project bundle, or the code worktree.

## Proved behavior

- A SessionStart hook returning `hookSpecificOutput.additionalContext` with `hookEventName: SessionStart` was accepted on real `startup`, `resume`, and `compact` events without schema errors.
- Manual compaction produced `PreCompact(trigger=manual) -> SessionStart(source=compact) -> PostCompact(trigger=manual)` for the same full session id.
- Automatic compaction, forced cheaply with `CLAUDE_CODE_AUTO_COMPACT_WINDOW=5000` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=10`, produced the same order with `trigger=auto`, followed by `Stop` after the first post-compaction model response.
- A two-second delay inside the SessionStart(compact) hook delayed PostCompact by the same two seconds. PostCompact began 57 ms after SessionStart completed. The events are therefore sequential on this artifact; SessionStart cannot wait for PostCompact without delaying it.
- PreCompact fired even when Claude later refused manual compaction as `Not enough messages to compact`. A prepared record must therefore support retry/refresh rather than becoming a permanent in-flight blocker.
- For both the short manual and automatic journeys, `PostCompact.compact_summary` contained only the last assistant message (`FOUR` / `AUTO-END`), not a structured decision card. The real compacted continuation consequently lost earlier canary values (`EMBER-942`, `report-EMBER-942`). PostCompact summary is useful audit evidence but is not an immediate or sufficient restoration source on this installed version.

## Architecture consequences

The load-bearing record must be complete before PreCompact returns. PreCompact must extract a validated, bounded evidence card from the pre-compaction transcript and durably read it back before allowing compaction. SessionStart(compact) restores that prepared generation through the supported context channel. PostCompact may append audit evidence afterward without invalidating the delivery. The first later Stop/SubagentStop is the executable acknowledgement. A repeated PreCompact while a record is still merely prepared is an idempotent refresh because the prior host compaction may have been declined; a delivered-but-unacknowledged record remains protected.

The automatic rail is proven invocable before component implementation. Full live manual and automatic acceptance against the eventual exact candidate artifact remains mandatory after Review and QA.

Official contract: https://code.claude.com/docs/en/hooks
