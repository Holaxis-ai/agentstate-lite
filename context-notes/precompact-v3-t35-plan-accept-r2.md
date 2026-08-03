---
type: Context Note
title: Revision 3 T3.5 product and acceptance plan re-review
actor: codex-precompact-v3-t35-acceptance
timestamp: '2026-08-03T21:40:22.960Z'
---
# Summary

**FAIL** — product/acceptance re-review of `plans/precompact-v3-t35-candidate-acceptance` at exact version `sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0`. Confidence: 0.98.

The revision materially closes the first review: it names one copied executable authority, owns real tmux/Claude actions, defines deterministic canary/action and fault oracles, names a passive event producer, binds R0/Q0/live stages to installed candidate bytes, chains predecessor attestations, and limits private operation to auth plus machine-emitted commands. The manifest/freeze/verifier work remains strong.

Four load-bearing contracts are still not executable as written. Most importantly, the `L0_SESSIONSTART_CONTINUE_FALSE` fault relies on an ordering edge that parallel hooks do not provide. G0 must remain blocked until the plan is repaired and re-reviewed.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: verify that the revised T3.5 plan can produce a trustworthy, replay-resistant acceptance chain without hidden operator timing or judgment; this serves the ultimate goal by keeping exact-artifact evidence attached to the real managed lifecycle effect.

Reviewed:

- exact Plan version above, in full;
- both prior FAIL reviews: `context-notes/precompact-v3-t35-plan-accept@sha256:e0bcd0091f6cc39b412b20a8cf4ea94bf4a20d2b822aea450997eed6316c7278` and `context-notes/precompact-v3-t35-plan-skeptic@sha256:552830be73f9e9a9cec0b949874e9c211efe248d7ebecbb7442860c0b4524dcd`;
- accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`, accepted implementation plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`, and current orientation `sha256:27a888993183defc49e11990b9e0a96b6a4979300ec21f23aeae102f51ced151`;
- current clean implementation worktree at `36c741a8173832d75d61a7ab138b5219c4415c66`, with `origin/main` an ancestor, package `0.1.0-pre.3`, no candidate script yet, and the existing live harness still T0-isolation-only.

No repository file was changed and no live Claude session was run. Read-only exact-host checks were limited to `2.1.220 --help`, `doctor` against temporary settings, and binary/schema inspection.

# Prior-blocker disposition

## Closed

- **One authority:** `scripts/handoff-candidate.mjs` owns freeze, verification, stages, observer, actions, schemas, and writes; the T0 skeleton is removed rather than retained as a second authority.
- **Real invocation:** the copied authority owns the pinned Claude argv, tmux socket/server, environment, dialogue, `/compact`, pressure, sub-agent instructions, timeouts, capture, and cleanup. The operator supplies one auth variable and invokes emitted commands.
- **Outcome oracles:** the closed case table, exact first-response token checks, exact Bash tool-use/action result, oversized-card checks, negative cases, identity continuity, and PASS/FAIL/BLOCKED mapping are actionable and measurable.
- **Event producer:** lane-local synchronous foreign observer hooks have a strict raw/event schema, content-free aggregate, failure rule, and cross-lane/gap/duplicate/order attacks.
- **Candidate identity:** freeze/verify, exact source SHA pre/post checks, tarball contract, isolated offline installs, both aliases, helper equality, host/toolchain pre/post checks, exact modes/allowlist, and no-rebuild descendant graph close the artifact drift findings.
- **Stage shape:** R0/Q0 are now explicit stage/case values, use the installed candidate, and feed a predecessor chain rather than prose-only digest handoff.

## Exact-host support facts that survive

The exact installed binary reports `2.1.220 (Claude Code)` and exposes all four proposed launch flags: `--session-id`, `--debug-file`, `--ax-screen-reader`, and `--dangerously-skip-permissions`. Its embedded settings validator explicitly documents command-hook exec form as `command` plus `args`, and `doctor` accepted a temporary project configuration with two distinct exec-form SessionStart handlers. The official hook reference also states that all matching synchronous handlers run in parallel and the host waits for them before merging results. These facts support the observer's **event-occurrence** role. They do not create an ordering edge between sibling handlers.

# Blocking findings and required repairs

## 1. The SessionStart fault races PreCompact's final read-back

The Plan's `L0_SESSIONSTART_CONTINUE_FALSE` fault handler starts in parallel with the candidate-managed PreCompact hook, waits for the generation to appear, corrupts/removes it, then returns. But generation/head visibility occurs before the managed authority's final read-back and validation can complete. The foreign handler can therefore corrupt the record between publication and final read-back, causing the real PreCompact itself to block. In that execution, Claude never reaches SessionStart and the intended acceptance case is not exercised.

“The host waits for all sibling handlers” is only a join after both finish. It neither orders the fault after the managed sibling nor proves that an observed generation has passed the managed helper's final read-back. A fake-host test can accidentally encode the desired ordering and conceal this exact-host race.

Repair: name a real synchronization fact that is emitted only after the candidate-managed PreCompact has completed successfully and is observable while the sibling fault handler still keeps the host at the PreCompact barrier. One acceptable option is an exact-host-proven, flushed debug completion record that binds the managed command, matching hook input/session, exit 0, and exact output; the fault handler waits for that record before mutating. Another is a strict content-free prepare-complete acceptance marker emitted after final read-back, but that changes T3 production mechanics and therefore requires the renewed T3 tests/review already required by the Plan. Add a scheduler test that exposes head/generation bytes before final read-back and proves the fault cannot mutate at that point. The final exact-host capability probe must show successful real PreCompact, then corruption, then real compact SessionStart halt.

## 2. Managed-effect provenance depends on an unspecified debug-log contract

The passive observer correctly proves only that Claude emitted an event. The Plan says the candidate-managed effect is “independently corroborated” by Claude debug hook output, transcript checkpoints, status/diagnosis, and journal bytes. That is plausible for successful card delivery, where unique first-response canaries plus the private generation provide strong triangulation. It is not yet a strict oracle for L0 block/halt/launch-boundary cases.

No exact debug record schema is named: the Plan does not state which `2.1.220` fields bind a debug row to the managed handler and observer event id/input digest, or how it extracts exact stdout JSON, exit status, timeout, start/completion, and merge result. The repository carries no accepted exact-host debug fixture. A fake Claude debug format proves only the parser the team invents, not that the pinned host emits the evidence or flushes it in time for finding 1. `hook diagnose` and journal bytes do not prove which sibling output the host merged or that `continue:false` was the candidate output.

Repair: before H0/H1 implementation, capture and freeze a sanitized exact-2.1.220 fixture/probe for command+args parsing, two synchronous parallel handlers, managed handler completion/output, debug flush timing while the sibling remains open, and host merge/advance behavior. Define the strict parser/oracle fields in this Plan or a new exact-version input. The fake host must reproduce those observed bytes, not author a convenient format. If the exact host cannot provide handler-bound completion/output evidence, select a reviewed evidence seam rather than weakening the finalizer to textual debug matching.

## 3. R0/Q0 attestations hash a verdict but do not yet constrain the semantic assertion

The Plan says R0's structured reviewer finding file “may carry” file/line evidence and PASS/FAIL, then the runner owns its digest and attestation. That allows a content-free or arbitrarily authored `PASS` file to become a machine-valid R0 PASS. Q0 likewise has one aggregate stage name but no mandatory structured assertion mapping the accepted Q0 attack rubric to candidate-facing evidence. Hashing a human assertion proves its bytes and candidate binding; it does not prove independence, coverage, or truth.

Human review judgment is an explicit necessary trust boundary, not something the runner can automate away. It must, however, be a strict named input rather than a private convention.

Repair: make R0 and Q0 finding/assertion schemas mandatory, create-only, and written only through the candidate authority. `stage prepare` must issue their challenge and exact rubric. Each assertion must bind manifest, attempt, challenge, reviewer/QA actor and declared non-builder role, every required rubric row, per-row outcome and evidence digest, the installed-candidate empirical action log, required red sample/attack evidence, and overall verdict. `stage finalize` may attest `reviewer_asserted_pass` or `qa_asserted_pass`; it must not claim the executable independently proved semantic correctness. The orchestration gate remains responsible for selecting an actually independent reviewer, but no empty/unstructured PASS can advance.

## 4. Claimed replay resistance has no cross-lane state authority

The Plan states that a finalized or previously opened attempt id cannot be reused, including from another fresh lane, but `stage prepare` receives only a fresh lane root plus predecessor files/digests. The immutable candidate cannot hold mutable attempt state, and no campaign ledger/registry is named. A create-only file inside one lane prevents reuse only in that lane. The same caller-generated attempt id can be opened under another fresh root; an old valid same-candidate predecessor attestation can also be handed to a later stage with no freshness authority beyond operator choice.

This also conflicts with “private operation is limited to auth and machine-emitted stage commands”: `stage prepare` currently requires a **caller-generated** UUIDv4 attempt id, leaving the operator to generate and select protocol state.

Repair: either add one private, repository-owned acceptance-campaign ledger outside the candidate, created at R0 and protected/inventoried thereafter, with locked create-only attempt registration, consumed-predecessor state, campaign id, and CAS/read-back; or narrow the replay claim to uniqueness within the supplied chain and remove the impossible global-reuse promise. The executable, not the caller, must generate attempt ids and emit every subsequent command. Add concurrent prepare and fresh-root same-attempt attacks. If old same-candidate stage evidence is intentionally reusable, state that policy explicitly and stop calling it a rejected stale replay.

# Required exact repair gate

Re-review a revised Plan only after it supplies executable answers to these four questions:

1. What exact byte/record proves managed PreCompact finished final read-back before the parallel fault mutates the generation?
2. What exact pinned-host evidence schema binds each managed handler's input, completion, output, and host merge to the passive observer event?
3. What mandatory structured human assertion lets R0/Q0 advance, and what does the attestation honestly claim about it?
4. Where is attempt/predecessor consumption state kept, or what narrower replay property is actually enforceable?

Add red probes for the PreCompact publication/read-back race, invented-versus-real debug format, empty/arbitrary R0/Q0 PASS assertions, concurrent same-attempt fresh-lane prepare, stale same-candidate predecessor reuse, and caller-selected attempt drift.

# Non-blocking strictness repair

The protected-snapshot section says a >500,000-entry or >10-GiB snapshot becomes BLOCKED before launch, but the closed BLOCKED enum contains no snapshot-limit reason. Add a closed reason or make this a content-free prepare rejection with no attestation. The current complete real npm-cache snapshot may exceed the cap even though all candidate npm work uses a lane-local cache; reconsider whether a bounded real-cache sentinel/metadata proof is the more proportional protected boundary.

# Verdict

Do not start T3.5 implementation from this exact Plan. The revision is close and preserves nearly all required repairs, but its load-bearing SessionStart negative lane is still race-shaped, its managed-output evidence is not pinned to the exact host, and R0/Q0/replay attestations overclaim what their inputs can prove. Repair these contracts and re-run both independent plan reviewers before code or G0.
