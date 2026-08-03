---
type: Context Note
title: Revision 3 T2 Claude adapter and installer builder
actor: codex-precompact-v3-t2-builder
timestamp: '2026-08-03T19:53:35.652Z'
---
# Summary

Revision 3 T2 repair orientation after independent FAIL of exact commit `5e02a8eeb39753f53f71d2cb0a2b35f811c74862`.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: repair the event-isolation, raw-input refusal, operator-target, receipt-schema, and host-readiness boundaries identified by independent review; this serves the ultimate goal by ensuring the compaction rail fails closed without leaking content or overstating runtime readiness.

## Exact evidence and boundary

- Independent review: `context-notes/precompact-v3-t2-review@sha256:7e97372ceeb42ccb8209e0e579ebf076be4f1e1f8bf74f3487269e4e7934ae31`, verdict FAIL, confidence 0.99.
- Repair worktree remains `/private/tmp/aslite-precompact-v3-t2.By2PrC/repo` on `feat/precompact-v3-t2`.
- Retain the accepted anchored hook grammar, exact foreign settings preservation, five Claude events, board-only Codex/OpenCode behavior, and the narrow T1 port. Do not add T1 policy.

## Confirmed blockers to encode as regression tests first

1. Eligible resume context that is empty, invalid, or at least 8,000 characters must halt without invoking board work.
2. Malformed raw stdin/JSON on `hook run` must return a universal event-safe fail-closed result rather than `{}` success.
3. Diagnose/recover must require and forward exact project/session/agent identity and exact head/generation versions where applicable.
4. Health/diagnose/recover receipts need recursive strict schemas/allowlists; unknown content fields such as `note`, `secret`, or `payload` must be rejected.
5. Verified-host classification must match exact resolved executable realpath as well as digest/version/platform/architecture; status reason must truthfully track unverified-host rail failure.
6. Helper health output must reject unknown keys, wrong types, non-string or unrecognized reasons, and content-bearing data.

## Next action

Add direct regression tests reproducing all six failures against commit `5e02a8e`, verify they fail for the intended reasons, then make the smallest production repair and run the requested focused/process/session/T0/opt-in/typecheck/build and global-config nonmutation gates.
