---
type: Context Note
title: Official Claude hook contract constraints for R0 rail
description: >-
  Primary-source constraints and installed-version caveat for the inert proof
  rail.
actor: codex-takeover-main
timestamp: '2026-08-04T17:33:03.157Z'
---
# Summary

Current official Claude Code documentation materially constrains the inert proof rail, but it is not a substitute for validation on the pinned installed executable.

# Primary sources checked 2026-08-04

- Hooks reference: https://code.claude.com/docs/en/hooks
- CLI reference: https://code.claude.com/docs/en/cli-usage

# Contract observations

- `PreCompact` matchers are `manual` and `auto`; its input includes `trigger` and `custom_instructions`.
- Allowing PreCompact requires omitting `decision` or exiting 0 with no JSON. Blocking may use exit 2 with stderr or exit 0 with top-level `{"decision":"block","reason":"..."}`. Therefore a positive PreCompact must never emit SessionStart `hookSpecificOutput`.
- `SessionStart` with matcher/source `compact` accepts context via `hookSpecificOutput.hookEventName="SessionStart"` plus `additionalContext`. It has no event-specific blocking decision, but the universal `continue:false`/`stopReason` fields stop processing entirely.
- Hook stdout must contain only the protocol JSON when structured output is used. Evidence capture cannot add tee/debug bytes to stdout.
- Current print-mode CLI supports `--output-format stream-json --verbose --include-hook-events`; SessionStart events are always included. This may provide host-level lifecycle observations, but the rail must test what fields the pinned installed version actually emits and must not assume the stream contains raw hook stdin/stdout.
- `PostCompact` now exists in current docs and receives `trigger` plus `compact_summary`; it has no decision control. The prerequisite rail should decide explicitly whether PostCompact is evidence-only or out of scope.

# Version caveat

The reviewed worktree names installed Claude 2.1.220. Current documentation can be newer than that binary. Every response schema and CLI flag used for PASS must be probed against the exact executable/version/digest in isolated configuration after static review, and unsupported features must fail closed rather than be inferred from current docs.

# Planning implications

1. Positive PreCompact output should be an explicit empty-success protocol choice verified on the installed host, not a SessionStart-shaped JSON object.
2. Negative PreCompact should pick one structured signaling mode per case and test host effect; do not mix exit 2 with JSON.
3. SessionStart sentinel delivery and `continue:false` suppression remain separate cases with separate effects.
4. Raw hook receipts and Claude stream lifecycle events are complementary evidence channels, not interchangeable.
