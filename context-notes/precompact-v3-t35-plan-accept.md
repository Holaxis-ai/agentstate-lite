---
type: Context Note
title: Revision 3 T3.5 product and acceptance plan review
actor: codex-precompact-v3-t35-acceptance
timestamp: '2026-08-03T21:20:17.863Z'
---
# Summary

**FAIL** — product/acceptance review of `context-notes/precompact-v3-g0-readiness` at exact version `sha256:164c7868f43ae268184a6f4714c7236d7b3bc5cc997e2de6d57229d1acafd68e`. Confidence: 0.99.

The T3.5 prescription is a strong candidate-integrity plan: it can freeze one clean package/helper/harness identity, prove that later installs consume those bytes without rebuilding, and halt on manifest/artifact/host drift. It does not yet define an executable acceptance rail that actually invokes real Claude, produces the claimed event provenance, or mechanically decides R0/Q0/L0-L3. Freezing after implementing it literally would replace artifact drift with operator convention at the load-bearing live boundary.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether T3.5 makes one immutable candidate mechanically traceable through every review, QA, and live-host gate; this serves the ultimate goal by preventing a human-operated acceptance ceremony from being mistaken for evidence that the compaction rail works.

Reviewed inputs and evidence:

- readiness proposal at the exact version above;
- accepted design `designs/pre-compact-multi-session` at `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`;
- accepted plan `plans/pre-compact-multi-session-v3` at `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`;
- task, final plan gate, installed-host probe/identity, current orientation, and T4 builder note;
- current read-only skeleton at worktree HEAD `0546667` on `feat/precompact-handoff-v3`.

No repository file was changed and no live Claude process was run.

# What survives review

These T3.5 requirements should remain:

- strict unknown-key-rejecting candidate manifest, candidate-relative non-symlink artifact paths, and an out-of-band expected manifest digest;
- one `freeze` authority that alone may perform exactly one `npm-package` build and one `npm pack --ignore-scripts`;
- a structurally separate `verify-existing` authority that can only read, hash, install, and invoke already-frozen bytes;
- byte/mode/host substitution attacks before launch;
- clean offline installation into a fresh prefix, both aliases resolving inside that prefix, installed executable/helper byte equality, and exact `version --json` agreement;
- candidate, lane, outside-canary, and foreign-settings inventories with content-free receipts;
- repository ownership of schemas, hashing/path policy, no-rebuild enforcement, install verification, and deterministic tests; private ownership of the temporary root, auth secret injection, one authorized freeze, immutable modes, and out-of-band digest handoff.

Those measures close the G0 artifact-provenance gap. The blockers below concern the unowned transition from a verified candidate to an accepted live result.

# Blocking findings and required repairs

## 1. No repository-owned real-Claude invocation contract

The prescription says the harness verifies bytes “before Claude launch” and that every L0-L3 invocation requires a candidate root, digest, and lane id. It never names the command that launches Claude, its exact argv/stdin/PTY protocol, or whether the harness or private orchestration owns the interaction. The private side is assigned PTY/auth preflight but no bounded machine-readable dialogue. An operator can therefore verify one prefix and then launch another executable, use a different environment, omit a hook-install step, mistime a fault, or drive a different journey while still producing a digest-bearing receipt.

The current harness confirms the gap empirically: `packages/cli/test/fixtures/handoff/live-harness.mjs` remains `agentstate-lite-handoff-live-harness/v2`, phase `T0-isolation-only`, with only `prepare`, `verify`, `probe-launch`, and `preflight`; its source explicitly leaves candidate invocation downstream. `scripts/handoff-candidate.mjs` does not yet exist, as expected before T3.5, so there is no other owning runner to inherit.

Repair: define and test a versioned repository-owned lane execution protocol, for example `lane prepare`, `lane run`, and `lane finalize` (the names are not important). It must bind and validate the exact Claude realpath/argv, candidate-prefix executable and PATH, cwd, isolated config/project/bundle/journal, timeout/context-pressure controls, hook installation/status, lane id, and expected manifest digest. Prefer that authority actually spawn/supervise Claude through a PTY. If private orchestration must own the PTY, its only discretion may be secret injection and execution of a complete machine-emitted interaction script; the harness must reject command/environment/dialogue drift and receive the captured evidence back for verification. No human semantic step may exist between candidate verification and the recorded launch.

## 2. Lane ids and digest-bearing receipts are not outcome oracles

The proposed T3.5 tests require one fixture per L0/L1/L2/L3 proving that launch input and final receipt carry the same manifest digest. That proves provenance, not acceptance. It does not mechanically decide any of the accepted plan's load-bearing claims: real manual/automatic PreCompact blocking; compact SessionStart `continue:false` suppressing the first response; missing/non-executable/timed-out helper truth; first-response recovery of pre-only values; execution of the exact next action; disclosed truncation; two-generation retention; automatic event order; or sub-agent identity/canary isolation.

Repair: the repository must own a strict lane-spec and final-verdict schema with an exhaustive case table, not merely four broad lane names. At minimum it needs every L0 fault case, L1 first and second manual compactions including the oversized case, L2 automatic compaction, and L3 real sub-agent compaction. `finalize` must return `PASS`, `FAIL`, or `BLOCKED_PENDING_VERIFICATION` plus a closed reason enum. A missing event, unmet trigger within a fixed bound, unverifiable host behavior, or absent evidence can never become PASS.

For L1-L3, the harness must generate or register lane-unique exact canary tokens and the exact next action before launch, hash the raw lane specification, and mechanically prove:

- required canaries occur only in pre-compaction transcript evidence;
- they are absent from the compaction-driving prompt and PostCompact summary;
- the first visible assistant response after the compact SessionStart contains the required exact tokens;
- the exact next action is followed by a structurally checkable transcript/tool-use outcome, not a reviewer judgment;
- forbidden sibling/main canaries are absent; and
- the oversized case remains below 8,000 characters while preserving current prompt and next action.

Raw transcript/event evidence may remain 0600 inside the isolated lane. Sanitized receipts should expose only digests, counts, booleans, ids, and reasons.

## 3. Event provenance has no defined producer

The proposal requires “event-sequence receipt ids,” but neither it nor the current skeleton defines who emits those ids or what bytes they attest. The production `hook run` path intentionally maps authority decisions to event-valid Claude JSON and drops internal receipts; `AGENTSTATE_LITE_HANDOFF_MANIFEST_DIR` is currently only a harness launch variable and is not an event audit channel. A digest-bearing final receipt cannot prove `PreCompact -> SessionStart(compact) -> PostCompact -> first response -> Stop/SubagentStop` unless the source and ordering of those observations are fixed.

Repair: specify one reviewed, passive evidence producer. A viable design can use separately managed observer hooks plus transcript/PTY capture and exact before/after authority diagnosis, or a strictly content-free acceptance receipt side channel in the candidate helper; either choice must be explicit and independently reviewed. Each event record needs a unique id, monotonic sequence, event name/source/trigger, full session id, nullable full agent id, transcript-path digest/checkpoint, candidate manifest digest, lane id, producer identity/digest, and raw-record digest. The final oracle must reject gaps, duplicates, cross-lane records, inconsistent session/agent identity, wrong order, or an event record not rooted in the captured host run. If adding a helper-side channel changes the frozen T3 mechanics, it requires the appropriate renewed exact-SHA implementation review; calling it test infrastructure does not waive that gate.

## 4. R0 and Q0 are only conventionally tied to the candidate

`verify-existing` gives R0/Q0 a correct starting installation, but the proposal defines digest-bound “lane receipts” only for the live lanes and does not define an R0/Q0 invocation or attestation schema. It also does not prevent a reviewer or QA agent from running source-importing or rebuilding tests after preflight and then attributing those results to the installed candidate. L0 has no machine-checkable proof that the immediately preceding Q0 verdict concerned the same manifest and installed bytes.

Repair: add repository-owned, content-free stage attestations outside the immutable candidate. R0 and Q0 must begin through named candidate-facing entry points that run `verify-existing`, resolve the tested executable only from the fresh prefix, and emit stage id, manifest/source/package/helper/harness/host digests, install-prefix inventory digest, start/end evidence digests, and verdict/reason. Candidate-behavior attacks in R0/Q0 must invoke that installed prefix, never TypeScript source or a rebuilt dist. The source review remains read-only at the manifest SHA. Each later stage must require the exact preceding PASS attestation digest (R0 -> Q0 -> L0 -> L1 -> L2 -> L3), while repairs or artifact/host drift invalidate the chain. Private orchestration may store and hand off those attestations, but repository code must validate their schema and continuity.

## 5. The repository/private boundary leaves fault timing and dialogue semantics unowned

The readiness note correctly gives private orchestration secrets and machine-local actions, but it implicitly leaves live prompts, `/compact` timing, automatic pressure generation, sub-agent spawning/pressure, and fault activation to that private operator. The existing `allowed_fault_ids` are names only; they do not define when or how each fault is applied, restored, and observed. This is precisely the hidden convention the accepted plan was meant to eliminate.

Repair: repository-owned lane specs must contain bounded state machines for prompts/actions, fault setup and activation boundaries, automatic-compaction controls, timeouts, expected/forbidden events, cleanup, and evidence capture. Private orchestration supplies only the PTY and auth values and executes those states verbatim. Every fault mutation must be lane-local, inventoried, reversible for cleanup, and reflected in the final receipt. The contract must pin that inability to force L2/L3 within the bound is `BLOCKED_PENDING_VERIFICATION`, never a softened PASS.

# Acceptance gate for a repaired T3.5 plan

The plan may pass after it names one executable authority for each row below and gives each a strict input, output, and red test:

| Boundary | Owning executable authority | Minimum proof |
|---|---|---|
| G0 freeze | candidate `freeze` | exactly one build/pack; immutable manifest and bytes |
| R0/Q0 start and close | candidate stage runner | fresh installed prefix; same digest; evidence/verdict attestation chain; zero candidate rebuild |
| L0-L3 preparation/launch | lane runner | exact Claude argv/env/PTY dialogue/fault state machine bound before launch |
| Host-event provenance | passive reviewed recorder | ordered full session/agent/event identities rooted in the exact run |
| L0-L3 outcome | lane finalizer | deterministic PASS/FAIL/BLOCKED oracle over raw lane-local evidence |
| Cross-stage continuity | attestation verifier | every stage consumes the preceding PASS digest and the same candidate/host tuple |

Required red probes should include: verify then substitute launch argv/env; omit or reorder one PTY action; reuse a lane receipt; mix event rows across runs; omit/duplicate/reorder an event; put a canary in the driving prompt or PostCompact summary; return canaries only in a later response; mention but do not execute the next action; swap session/agent ids; run a source helper after candidate preflight; reuse a Q0 attestation for another manifest; and time out L2/L3. Each must halt or produce FAIL/BLOCKED before a later gate begins.

# Verdict and progress

Do not freeze G0 from this T3.5 plan as written. Preserve its manifest/no-rebuild work, add the real-Claude invocation, provenance, oracle, and stage-attestation contracts above, then re-run this product/acceptance plan gate before implementation. Progress: the artifact-identity problem is well specified; the live acceptance authority is still missing.
