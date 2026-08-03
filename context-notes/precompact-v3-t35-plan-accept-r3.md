---
type: Context Note
title: Revision 3 T3.5 product and acceptance plan re-review R3
actor: codex-precompact-v3-t35-acceptance
timestamp: '2026-08-03T22:10:03.983Z'
---
# Summary

**FAIL** — product/acceptance re-review of `plans/precompact-v3-t35-candidate-acceptance` at exact version `sha256:45c9862ba1e4a1686bb68d326530fc6f3ae51efa529caa6a3a29b59965c73b0d`. Confidence: **0.96**.

R3 closes most of the R2 failures. The sequential PreCompact wrapper removes the impossible sibling-ordering dependency; the plan no longer relies on opaque hook identity or invented debug rows; the campaign ledger provides CAS-backed attempt/predecessor consumption; R0/Q0 assertions are mandatory, rubric- and challenge-bound, and make an honest human-trust claim; freeze owns absent-target creation; the npm claim is narrowed to an observable top-level boundary; and tmux/fault cleanup finally has a named executable owner.

Three load-bearing contracts remain incomplete, plus one npm claim still exceeds its observable boundary:

1. the wrapper proves that *some* successful `hook run` completed, but does not yet machine-bind that call to a newly selected generation caused by this exact PreCompact event before corrupting it;
2. the stated API-key possession boundary is not executable because Claude-spawned managed, observer, and wrapper hook processes may inherit Claude's environment, and the accepted host fixture did not test secret-environment propagation;
3. the six-way L0 fan-out has no terminalization protocol for already-open sibling attempts when one attempt closes the campaign; and
4. `--offline` plus an unreachable registry proves the install does not need the network, not literally that no network attempt occurred.

These are acceptance-rail contracts, not implementation polish. P35/F0 should remain blocked until the exact Plan repairs them and is re-reviewed.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether R3 supplies a replay-resistant and privacy-honest executable chain from one reviewed artifact through real compaction; this serves the ultimate goal by preventing the acceptance authority from certifying causation, isolation, or cleanup that its evidence cannot establish.

# Exact evidence reviewed

- R3 Plan in full at `sha256:45c9862ba1e4a1686bb68d326530fc6f3ae51efa529caa6a3a29b59965c73b0d`.
- Both R2 FAILs in full: `context-notes/precompact-v3-t35-plan-accept-r2@sha256:0efd106cd1ffcbea3c8596bda056abe413a5e7807704f86760b0aec3cf349fb3` and `context-notes/precompact-v3-t35-plan-skeptic-r2@sha256:07c8d03f48a4a620a65fc53e3ecd5f75c8f9b57f579eac2ccb708a3747171a4d`.
- Installed-host note and addendum in full at `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`, including sanitized fixture digest `dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`.
- Current repository read-only at clean feature HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`; `origin/main` is an ancestor and package version is `0.1.0-pre.3`. `scripts/handoff-candidate.mjs` is not implemented yet; the existing live harness is still the T0 isolation skeleton.
- Current production `hook run`, lifecycle adapter, authority prepare/read-back order, `hook status`, `hook diagnose`, journal addressing, installed-hook grammar, verifier, and tests.

No repository file was edited and no Claude/tmux/live lifecycle call was made.

# R2 blocker disposition

## Closed

- **Opaque/debug completion identity:** R3 explicitly forbids mapping a silent response through opaque hook id, output length, or settings order. The exact-host fixture/parser is evidence-limited, and the SessionStart corruption case does not use it for sibling synchronization.
- **R0/Q0 assertion semantics:** strict create-only authority-written assertions bind campaign, attempt, challenge, manifest, source, installed-prefix inventory, actor/declaration, closed rubric rows, evidence digests, empirical red action, and verdict. The attestation says only `reviewer_asserted_pass` or `qa_asserted_pass`; independence and truth remain an explicit orchestration trust boundary.
- **Replay authority:** one private campaign ledger owns ids, revisions, history, one-use predecessor slots, challenges, lanes, and terminal state under lock plus digest/revision CAS. Caller-selected ids, fresh-root replay, cross-campaign reuse, duplicate L0 cases, stale predecessors, and skipped stages cannot advance.
- **Absent target freeze:** the candidate leaf must be absent and is atomically created by `freeze`; an existing path rejects before build. The former impossible “previously used empty directory” claim is gone.
- **Tmux and per-fault recovery primitives:** the plan names a reserved socket/server record, PID/start/uid/binary identity, idempotent exact-socket reaper, crash killpoints, settings CAS restoration, tainted journal disposition, and cleanup-gated finalization.
- **Honest live auth result:** only isolated `ANTHROPIC_API_KEY` is allowed; real/global auth fallback is banned; unknown auth UI, billing/auth failure, or no real response maps to `BLOCKED_AUTH` and stops shipping.

## Partially closed

- **Sequential PreCompact causation:** process exit and exact output do solve the final-read-back ordering race, but the selected-generation premise is under-specified (finding 1).
- **Auth/tmux privacy:** transport into runner -> tmux -> Claude is now honest, but downstream host-spawned hook inheritance is neither allowed nor disproved (finding 2).
- **Campaign fan-out cleanup:** ledger consumption is safe, but terminal handling of other already-open/live L0 attempts is not specified (finding 3).
- **Npm boundary:** the observable top-level/no-script/no-dependency/offline boundary is valid, but literal network-attempt language remains too strong (finding 4).

# Blocking findings and actionable repairs

## 1. The wrapper has an ordering edge, but not a complete causation/selection oracle

The current production helper does perform generation write/read-back, head write/read-back, and only then returns from `hook run`. The CLI subsequently emits exactly `{}\n` for a successful PreCompact and exits. R3's predicate `exit 0 + zero stderr + exact {}\n` therefore gives the needed **completion** edge. Corrupting only after process exit is deterministic and does not rely on host debug identity.

But `{}\n` intentionally carries no generation receipt or outcome. It is also emitted for every non-blocking PreCompact result, including refresh/no-op shapes. Current `hook diagnose --json` can expose `projectKey`, `executionKey`, selected `generation`, `headVersion`, and `generationVersion`; it does not emit a physical path, byte hash, or proof that this child invocation created the selected generation. R3 says the wrapper will “locate” the generation and verify an “expected identity/hash” without defining where that expectation comes from. A permissive implementation can accept a pre-existing current generation, a no-op child, or an independently changed head, then corrupt whichever generation diagnose names. That would prove a later corrupt SessionStart halt without proving this exact PreCompact successfully prepared the record under test.

The substitution also needs exact unchanged-production contracts pinned. At this HEAD the normal managed entry is the shell-string grammar `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1 <helper> hook run`; replacing PreCompact with exec-form makes `hook status` report `events.PreCompact:false`, `rail_ready:false`, and the generic reason `HOOK_HELPER_UNHEALTHY`. There is no more specific managed-entry reason. The wrapper child must explicitly reproduce the production marker/environment premise or state and test the deliberate difference. The physical journal key is independently derived from the lane handoff root plus diagnose's project/execution keys and generation; that derivation must belong to the executable and its red tests, not prose.

Repair:

- Require and attest a pre-child `hook diagnose --json` result of exactly `HANDOFF_NOT_FOUND` for this fresh lane/identity, plus an exact pre-inventory with no head or generations.
- After child exit/output success, invoke the exact installed helper's `hook diagnose --json`; require exact `OK`, one new head, exactly one selected generation, matching project/execution/generation identities, returned versions equal byte-derived versions, and no unexpected journal objects. Pin the exact physical-key derivation and generation schema/hash validation in the Plan/red tests.
- Pin the wrapper entry's exact command, args, timeout, cwd, stdin, environment (including the current managed marker decision), and expected current status object. Do not require a reason the unchanged CLI does not expose.
- Perform the corrupt-temp `O_EXCL` creation and replacement only under an expected before-digest/version premise, fsync/read back, then emit the captured bytes unchanged. Add stale-head, pre-existing-generation, child-no-op, post-child head race, wrong-path, and generic-status red tests.
- Keep the attestation wording honest: this is an acceptance wrapper delegating the exact installed helper, while other L0/L1-L3 cases prove the direct installed PreCompact registration.

## 2. The stated API-key possession boundary omits Claude-spawned hook processes

R3 allows the secret only in the operator, acceptance runner, dedicated tmux server, and Claude process environments/memory. Yet the actual live journey requires Claude to spawn the managed `hook run`, foreign observer, sequential wrapper, and wrapper child. Child processes normally inherit the parent's environment unless the host removes or rewrites it. The accepted exact-2.1.220 fixture proves exec-form, stdin, parallel/join, output, and failure behavior; it records no hook-environment inventory and does not establish that `ANTHROPIC_API_KEY` is stripped before hook launch.

The plan therefore cannot currently prove its own four-holder claim. In the SessionStart fault lane, the wrapper itself receives the host environment before it can sanitize the child. In normal lanes, unchanged production managed entries provide no acceptance-owned environment-scrubbing boundary. File/log scanning detects serialization after the fact but does not prove the value was absent from transient helper/observer process memory.

There is a second timing contradiction: `stage prepare` opens and consumes the attempt, but the auth value is supplied only to `stage run`; “before an attempt opens” cannot reject zero/multiple auth variables under that command split. Honest `BLOCKED_AUTH` after prepare is acceptable, but the Plan must say so.

Repair:

- Either obtain exact-host evidence that 2.1.220 strips the API key from all hook child environments, or broaden the permitted in-memory possession set to the exact host-spawned managed/observer/wrapper process tree while continuing to prohibit argv/disk/settings/log/receipt/attestation serialization. Do not claim a narrower boundary than the host exposes.
- Give every acceptance-owned spawn a strict environment allowlist; explicitly state whether the wrapper child includes the managed marker and excludes auth. Add a non-secret inheritance canary in P35H/R35 plus process-tree tests. Any real secret serialization remains FAIL.
- Move the zero/multiple/unsupported auth check to `stage run` before tmux creation and say that the already-open attempt becomes `BLOCKED_AUTH` and closes the campaign, or require auth presence at prepare without persisting it. Keep real/global fallback forbidden.

## 3. Campaign closure does not terminalize already-open L0 fan-out attempts

The one-use Q0 fan-out slots correctly allow six distinct L0 cases. The ledger also says any FAIL or BLOCKED closes the whole campaign. It does not define what happens when multiple L0 attempts have already been prepared or are running and one terminal CAS closes the campaign.

Without a closed rule, a sibling runner may continue sending PTY actions, mutating its fault lane, or retaining an auth-bearing tmux server after the campaign is terminal. Its later PASS must not be recordable, but replay rejection alone is not cleanup. The named reaper can inspect campaign-reserved sockets, yet R3 never says the terminal transition marks all other open attempts aborted, causes their runners to stop at machine predicates, and reaps every reserved sibling server before campaign cleanup is considered complete.

Repair with one of two explicit policies:

- **Serialize live cases:** allow all six slots but permit at most one `OPEN/RUNNING` attempt at a time; a case must finalize and clean before the next slot opens.
- **Define cancellation:** the first FAIL/BLOCKED CAS atomically marks every other open attempt `ABORT_REQUIRED`; runners re-read revision/terminal state before each PTY/fault action; `stage cleanup` reaps every exact reserved sibling server and records per-attempt cleanup proofs; no terminal campaign receipt exists until all are absent.

Add races for concurrent prepare, one lane closing while another is pre-tmux/post-tmux/in-PTY/in-fault/finalizing, stale runner action after terminal revision, two cleanup callers, and campaign retry while old servers exist. A retry must create a new campaign only after the old campaign's exact reserved process/socket set is absent.

# Remaining enforceability repair

## 4. Narrow the npm network wording to what is observed

The important R2 repair is sound: exact top-level Node+npm argv/environment, an existing local tarball, `--offline --ignore-scripts`, empty lane cache/npmrc, no runtime/optional/peer dependencies or lifecycle scripts, hostile script canary absence, no source resolution, and unchanged build outputs. R3 also correctly disclaims observation of every real npm descendant.

However, an unreachable registry plus successful `--offline` install proves that the install **does not depend on network access**. It does not by itself prove the stronger sentence “a real install that attempts network fails” or that a network attempt was absent; an ignored failed lookup/request is not observable without a listener/interposition seam.

Repair: attest only “the local-tarball install succeeded offline with an empty cache and no network dependency,” or add an unprivileged, named configured-registry request observer and limit the claim to no request to that observer. Do not reintroduce a complete descendant/network graph claim.

# What survives and should not be redesigned

- Static candidate identity, strict tree/modes/nlink/owner checks, non-circular manifest, sidecar-last sealing, one build/pack, and pre/post source/host/toolchain verification remain strong.
- The exact-host fixture is used with the right epistemic limits; its overall FAIL and `BLOCKED_AUTH` are preserved, and silent-handler identity is explicitly NOT PROVEN.
- The sequential wrapper is the correct architecture for the SessionStart corruption case once its fresh-generation causation and exact production seams are pinned.
- Campaign CAS/history and one-use predecessor slots are the correct replay architecture; only terminal handling of concurrent fan-out remains.
- Mandatory authority-written R0/Q0 assertions make human judgment explicit rather than pretending to automate semantic review.
- Real tmux identity and the idempotent exact-socket reaper are the correct crash-recovery architecture.
- The fault cleanup table's restore-or-taint disposition and cleanup-gated sidecar are acceptance-grade once campaign-wide terminal cleanup is closed.

# Verdict

Do not start F0 from this exact R3 Plan. Preserve the architecture and make a narrow R4 repair: bind the wrapper to a freshly caused selected generation using exact current diagnose/layout/status contracts; correct and test the auth process boundary and prepare/run timing; define fail-stop/reap semantics for open L0 fan-out attempts; and narrow the remaining npm network wording. Then repeat both independent exact-version Plan reviews.
