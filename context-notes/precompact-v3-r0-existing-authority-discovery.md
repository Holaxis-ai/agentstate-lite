---
type: Context Note
title: 'R0 discovery: existing T0 live-harness authority'
description: Existing isolation/launch authority changes the repair decomposition.
actor: codex-takeover-main
timestamp: '2026-08-04T17:34:26.627Z'
---
# Summary

The r7 repair diagnosis must account for an existing T0 live-harness authority that the newly staged R0 scripts duplicate.

# Discovery

`packages/cli/test/fixtures/handoff/live-harness.mjs` already owns:

- opt-in live gating;
- fresh private `/private/tmp/aslite-handoff-live.*` roots;
- isolated HOME, `CLAUDE_CONFIG_DIR`, project, bundle, journal, and manifest layout;
- a pinned launch environment with secret-name handling and no-autopull;
- immutable launch bytes and digest;
- outside-path canary inventory/hash verification;
- PTY/auth/absolute `CLAUDE_BIN` preflight and executable digest; and
- the later L0 fault-id vocabulary.

`packages/cli/test/handoff-harness.test.ts` already tests these isolation and drift contracts. The staged `scripts/r0-prepare.mjs`, one-line settings fixture, and runbook create a second preparer/settings/path authority without reusing these primitives.

# Implication

The next plan must first decide which executable owns the prerequisite rail. The default recommendation is to extend or replace the existing T0 harness in one reviewed unit and delete the staged duplicate paths, rather than repair both. If the prerequisite proof is intentionally separate, the plan must state a non-overlapping ownership boundary and prove agreement mechanically.

# Confidence

High. This is grounded in current branch bytes at `36c741a8173832d75d61a7ab138b5219c4415c66`; no code or tests were changed.
