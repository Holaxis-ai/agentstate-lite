---
type: Context Note
title: Test review of orientation update implementation plan
actor: codex-orientation-test-scout
timestamp: '2026-08-05T20:49:17.856Z'
---
# Summary

**Verdict: CHANGES_REQUESTED.** The plan is well bounded and its gate ordering is directionally correct, but the lease publication/recovery algorithm and the proposed test invocation cannot yet satisfy the stated interruption, concurrency, and no-network invariants. Four actionable findings follow; the first three should be resolved before Builder starts.

Review basis:

- `plans/orientation-update-notice-implementation` at `sha256:02562d97d9f24947ddf050864fbebd0582c8fdb56293bfc27f8e18b651250ae9`
- `context-notes/orientation-update-product-architecture-2026-08-05` at `sha256:321325fd27ec0453dfd4fe9ac011b462a8cc87e05d12788d4a5524e3e62f7f51`
- normative section 3 of `designs/version-update-protocols`
- current home/session-start, U3 transport, credentials atomic writer, executable registration, and test scripts

Ultimate goal: make agentstate-lite a shared, versioned, conflict-safe Markdown memory that humans and agents can install and use without founder intervention.

Proximate goal: ensure N4's implementation plan is executable and its red tests can prove nonblocking cache/lease/process behavior deterministically. This serves the ultimate goal by preventing passive release awareness from weakening offline first use or cross-session reliability.

## Finding 1 — Blocker: fixed-path `open("wx")` can publish a permanently malformed lease

The frozen contract says acquisition uses exclusive create at the final lock path, then writes and durably closes the JSON; it also says malformed locks are never removed automatically. A process killed after `open("wx")` but before the complete write leaves an empty/partial final lock. That lock is malformed, so two-visit stale recovery never applies and passive refresh is disabled forever. The planned interruption test should expose this contradiction.

Revise the acquisition mechanic so incomplete bytes are never published at the fixed path. A concrete POSIX-safe shape is: write/fsync/close the complete lease to a unique 0600 temp created with O_EXCL in the safe directory, then use an atomic no-replace claim (for example a hard link from that complete temp to the absent fixed lock path), then unlink the temp. Competing processes race only the atomic claim, and a crash before publication leaves no malformed fixed lock. If a different primitive is chosen, the plan must still state and test the same invariant: the fixed path is absent or a complete durable lease, never partial.

Add a deterministic child fixture paused at each acquisition phase, kill it, then prove the next two eligible visits recover and exactly one later worker launches. Do not model interruption only after a valid lease already exists.

## Finding 2 — Blocker: token re-read plus `unlink(fixedPath)` has an ABA race

Two-visit cleanup currently says to re-read/token-compare an expired lease and remove it. That is not an atomic compare-and-delete. Between the final read and unlink, the stale worker can remove token S and another parent can acquire token N; the cleaner then unlinks N. A matching-token check in ordinary code does not close this pathname race.

Specify an ABA-safe stale transition and test the replacement race. One workable shape is atomically rename the fixed lock to a unique quarantine name and never unlink the fixed path afterward; then validate/delete only the quarantined inode. If the rename captured a successor during an ABA, that successor worker must revalidate its token at the fixed path before any network/write and abort, while a later parent may acquire normally. Other algorithms are acceptable, but `read → compare → unlink fixed pathname` is not.

The cross-process fixture needs a controlled barrier at the exact stale-read/replacement boundary and per-child IPC/results, not timing sleeps or a shared append log. Assert: no successor fixed lock is deleted, no worker performs U3 work after losing its token, cleanup visit launches zero workers, and the later visit has exactly one winner.

## Finding 3 — Major: the advertised focused suite does not actually suppress passive work

The plan says tests globally set `ASLITE_NO_UPDATE_CHECK`, but its literal focused command sets only `AGENTSTATE_LITE_NO_AUTOPULL`. The current CLI package `test` script also lacks `ASLITE_NO_UPDATE_CHECK`. Once N4 exists, existing `home.test.ts` and `session-start.test.ts` cases will be eligible and can create leases, spawn detached workers, and contact the public registry during ordinary local tests. That makes the battery non-hermetic and can leave children/state behind.

Add `ASLITE_NO_UPDATE_CHECK=1` to the CLI workspace test script and the documented focused command. N4-specific cases should exercise eligibility by injecting an explicit environment object or deleting the key only inside isolated child processes; avoid mutating process-global env in concurrently running tests. Add one gate that enumerates every existing spawned home/session/MCP path and proves it inherits suppression unless that case explicitly opts in.

## Finding 4 — Major: make the safe-read, 64 KiB, hidden-route, and byte-provenance proofs literal

The plan currently says `lstat` before read. A pathname can change after lstat, and a growing regular file can exceed the 65,536-byte cap after a size check. Require a no-follow/nonblocking open, fstat of that same handle, and a bounded read from the handle (with exact `65,536` accepted / `65,537` rejected cases). The same discipline applies to lease reads. If platform APIs force a residual race, name it explicitly rather than claiming hostile-link/type proof.

Split hidden-route evidence into deterministic layers: in-process worker success/failure with injected U3; built entry with absent/invalid/mismatched lease proving silent hidden routing and zero public registration. Do not make the built success probe depend on live npm or a production registry-override variable.

For exact byte parity, capture literal fixtures from the pre-change base SHA with deterministic injected identity, HOME/cwd, bundle/board/workspace/hook dependencies and fake time. Pin at least bare `home --json`, `home --json`, `session-start --json`, and default no-notice output. Record fixture provenance in the test/PR, force one expected byte red during review, and avoid comparing two projections generated by the same changed builder. Cross-SHA built output cannot be compared literally without controlling build identity, so use the pure/injected projection for that contract and use built probes only for routing/no-work.

## Gate ordering assessment

Builder → independent exact-SHA Review → adversarial QA → repository/package gate is correct for this high-risk unit. Add one explicit invalidation rule: any source/test repair after exact-SHA Review returns to exact-SHA re-review before QA; any QA or repository-gate repair likewise starts again at exact-SHA Review for the new commit. The plan critics should re-review only the amended plan; they must not be counted as the later code review.

## What already passes plan review

- One owning private orientation module and reuse of U3, atomic cache writer, exact executable identity, and pure home projection.
- Exact cache schema, successful-latest-only storage, hostile nested-check validation, recomputed command, and 64 KiB/4 KiB bounds as intended contracts.
- Presence-based suppression including empty/`0`, passive-latest-only behavior, current-as-fresh-silence, exact five-field notice, and no JSON/MCP/ordinary work.
- Exact runtime + entry detached launch, ignored stdio, no child-close wait, token revalidation, and request/privacy boundary.
- Independent exact-SHA Review before adversarial QA and Brian-owned merge.

## Confidence

High (0.94). Findings 1–3 follow directly from the plan's stated state transitions and current test script. Finding 4 is a test/proof precision requirement, not a request to expand product scope.
