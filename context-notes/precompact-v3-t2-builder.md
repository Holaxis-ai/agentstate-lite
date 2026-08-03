---
type: Context Note
title: Revision 3 T2 Claude adapter and installer builder
actor: codex-precompact-v3-t2-builder
timestamp: '2026-08-03T20:01:54.597Z'
---
# Summary

Revision 3 T2 independent-review repair is complete at exact commit `417cf04c19f7f6505631e7baa547532f51af64ad`.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: repair the event-isolation, raw-input refusal, operator-target, receipt-schema, and host-readiness boundaries identified by independent review; this serves the ultimate goal by ensuring the compaction rail fails closed without leaking content or overstating runtime readiness. Status: complete and ready for independent exact-SHA re-review.

## Exact evidence and boundary

- Rejected T2 commit: `5e02a8eeb39753f53f71d2cb0a2b35f811c74862`.
- Independent review: `context-notes/precompact-v3-t2-review@sha256:7e97372ceeb42ccb8209e0e579ebf076be4f1e1f8bf74f3487269e4e7934ae31`, verdict FAIL, confidence 0.99.
- Repair commit: `417cf04c19f7f6505631e7baa547532f51af64ad` on `feat/precompact-v3-t2` in `/private/tmp/aslite-precompact-v3-t2.By2PrC/repo`.
- Retained boundaries: start-anchored managed grammar, exact foreign subtree preservation, five Claude lifecycle events, board-only Codex/OpenCode behavior, and no T1 identity/CAS/selection/recovery/GC policy in T2.

## Repaired blockers

1. An eligible resume whose authority context is empty or at least 8,000 characters now returns `continue:false` with `HANDOFF_SCHEMA_INVALID`; regression tests prove board orientation is never invoked.
2. Truncated JSON, JSON null, and unknown JSON objects on `hook run` now return the universal event-safe `continue:false` refusal instead of `{}` success.
3. Diagnosis requires exact `cwd`, session id, and agent id. Recovery requires and forwards those same identities plus exact expected head and generation versions. Missing or empty required options are usage errors before authority invocation.
4. Health, diagnose, and recover responses now pass strict runtime schemas with exact allowed fields, bounded token/hash/version types, and a closed reason-code set. Unknown or nested fields such as `note`, `secret`, and `payload` are rejected without echoing their values.
5. Verified-host classification now includes the pinned resolved realpath `/Users/brian/.local/share/claude/versions/2.1.220` as well as digest, version, platform, and architecture. A path-spoofed matching tuple is `installed_unverified`; status reports `INSTALLED_HOST_UNVERIFIED` and `rail_ready:false`.
6. Exact-helper health parsing now rejects unknown outer/hook keys, wrong ready/reason types, unknown reasons, schema-invalid receipts, and content-bearing success payloads.

## Test-first and final verification

- The new adversarial tests were run against `5e02a8e` before production changes: 7 test groups failed for the intended six blocker classes.
- `hook-lifecycle.test.ts`: 13 pass, 0 fail.
- Normal focused/process/session/autopull lane: 105 pass, 0 fail, 14 intentionally skipped T1 red contracts.
- Sequential opt-in frozen oracle: 28 pass, exactly 10 expected T1-only failures (`id8-collision`, `no-project-namespace`, `repeated-create-only`, `impossible-self-version`, `single-slot-retention-loss`, `stale-response-observation`, `stale-deletion`, `no-id-fallback`, `unvalidated-schema`, `no-gc`). All T2/shared rows pass.
- A concurrent opt-in run also retained those ten expected failures but starved one healthy helper process to the real 1.5-second timeout; the immediate sequential rerun passed that helper test. This was scheduler contention, not a product-code retry or timeout relaxation.
- `npm run typecheck -w @holaxis/aslite`: PASS.
- `npm run build`: PASS after the final source edit.
- `git diff --check`: PASS.
- User-global nonmutation audit: `~/.claude/settings.json` SHA-256 remained `1d0b7b85ee477312a1bfcc2999ded9678f02e5b00df1d7b1c96edf6f388459e5`; `~/.codex/config.toml` remained `9eceda823acad96291f7e1cf45af59a236f0ac586970469d9160885be5875063`; absent `~/.codex/hooks.json` and the OpenCode managed plugin remained absent.

## Coordination and next action

No task document was edited and no `aslite sync` was run. Next action: independent exact-SHA re-review of `417cf04c19f7f6505631e7baa547532f51af64ad`; only after PASS should T3 integrate the T1 authority behind `HandoffAuthorityPort`.
