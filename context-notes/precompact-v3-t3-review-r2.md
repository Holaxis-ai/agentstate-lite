---
type: Context Note
title: Revision 3 T3 cross-boundary repair review
actor: codex-precompact-v3-t3-reviewer-r2
timestamp: '2026-08-03T21:08:29.214Z'
---
# Summary

PASS for T3 at exact SHA `579de4df5076f042282d0292db6ead0839f97ef3`, confidence 0.99. The prior root-health blocker is closed: the in-process authority, built helper, PreCompact decision path, installer, and status command now agree on healthy and unsafe journal roots. No new T3 blocker was found.

Ultimate goal: make revision 3's pre-compaction handoff rail safe, testable, and shippable without relying on convention-split lifecycle behavior.

Proximate goal: independently verify that the repaired T3 helper rail proves the same journal-root invariant at health-check and event-execution boundaries, serving the ultimate goal by preventing a false-ready installation.

# Prior blocker result

- Closed. `CompactionHandoffAuthority.health()` delegates root validation to the same `HandoffStore.initialize()` used by valid lifecycle events (`packages/cli/src/handoff/authority.ts:364`), so health does not duplicate or weaken the authority's safety policy.
- The command port delegates to authority health and maps failure to top-level `HOOK_HELPER_UNHEALTHY` while preserving the content-free authority receipt and its machine reason (`packages/cli/src/commands/hook-authority.ts:149`).
- An independent in-process attack covered four real filesystem states: a healthy realpath root, a symlink root, a permissive `0755` root, and an uncreatable root below a regular file. Health was ready only for the healthy root; each unsafe root returned `HOOK_HELPER_UNHEALTHY` with receipt reason `HANDOFF_STORE_UNSAFE`, and the corresponding valid PreCompact call halted with `HANDOFF_STORE_UNSAFE`. Health and event execution agreed in all four cases.
- The built-helper integration test independently covers those same four root states and passed. This closes the former cross-process discrepancy rather than only the in-memory case.
- Install and status exercised the real built helper. Both reported matching `rail_ready` and `rail_reason` values for healthy and unsafe roots.

# Single root override

- Source, tests, the live harness, and the built artifact contain only `AGENTSTATE_LITE_HANDOFF_ROOT` as the journal-root override. No occurrence of obsolete `AGENTSTATE_LITE_HANDOFF_TEST_ROOT` remains.
- The authority reads the exported `HANDOFF_ROOT_ENV` constant (`packages/cli/src/handoff/authority.ts:50`, `:269`), and the minimal helper environment forwards that same constant (`packages/cli/src/commands/hook.ts:852`).
- The built artifact contains the same single override, confirming the repair is present beyond TypeScript source.

# Cross-boundary regression review

The combined bridge/oracle lane remained green. The five-event mapping, project/main/subagent/agent transcript isolation, no-bundle and stale/fresh resume behavior, fail-closed construction, nullable diagnose/recover behavior, privacy/content-free receipts, manifest/helper bridging, strict append behavior, and foreign-record preservation all survived unchanged. No new blocker surfaced.

# Verification

- Worktree was clean at exact reviewed SHA; `git diff --check` passed.
- Focused authority integration: 8 passed, 0 failed.
- Frozen opt-in contracts and harness: 26 passed, 0 failed.
- Combined relevant lane: 147 total, 133 passed, 0 failed, 14 intentionally skipped.
- A first manual probe used macOS `/var`, which itself resolves through a symlink and was correctly rejected; the probe was corrected to use the `realpath` of the temporary directory before recording the four-case evidence above. This was reviewer setup, not a product defect.

# Verdict scope and progress

T3 is accepted only for exact SHA `579de4df5076f042282d0292db6ead0839f97ef3`. This verdict does not accept T4, G0, or live manual/automatic compaction. Progress: the repaired helper rail has cleared its independent cross-boundary review; the next downstream gate remains T4.
