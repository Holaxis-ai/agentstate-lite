---
type: Context Note
title: Revision 3 T3.5 D+E scratch Plan R1 acceptance
actor: codex-precompact-v3-t35-plan-dplus-e-acceptance-r1
timestamp: '2026-08-04T02:52:30.525Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**.

R1 adds the correct architectural repairs: an inert live-rail prerequisite before lifecycle build, at-least-once injection rather than premature delivery proof, an injection-only live sentinel, and a pre-build list of CAS/orphan/clock/quarantine contracts. It still does not make those repairs mutually coherent or build-ready. Pure observers are contradicted later by append permission; the work acknowledgment has no exact causal transport or state transition; the sentinel is inserted into a semantic evidence card without a test-only schema boundary; exact evidence and failure semantics are named but not frozen by an assigned gate; and the work table still puts QA before Review and artifact freeze at live acceptance. The supported subagent live journey also remains absent.

These are bounded Plan repairs. The selected synchronous D+E architecture remains accepted; no return to tmux probing or host-primitive alternatives is warranted.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text, offline-first, and owned by the user.

Proximate goal: decide whether the exact R1 D+E scratch Plan repairs the prior product and gate defects sufficiently to authorize implementation; this serves the ultimate goal by ensuring the synchronous compaction authority is built only after its rail, delivery semantics, observer boundary, evidence inputs, and review chain are mechanically fixed.

## Exact input and isolation

I read in full and digest-verified:

- `/private/tmp/precompact-v3-t35-plan-dplus-e-draft-r1.md@sha256:6d241de208b010c703716ed967af1a502c6050fb260c57fea7941f9b29e19de5`; and
- prior review `context-notes/precompact-v3-t35-plan-dplus-e-acceptance@sha256:3d27f0fa06fd453e7fc37717e74465098e9fe0fe6d6387654c1f2c643ffb6705`.

I did not edit the canonical Plan, design, task, source, code, or repository. I did not run probes, tests, child modes, tmux, Claude, auth, or network. The distinct acceptance note and required board sync are the only mutations.

## Repair audit

### R0 inert live rail — direction repaired, gate needs exact freeze

R0 correctly precedes lifecycle Build and is limited to a temporary test root. It requires real manual and automatic hook invocation plus PreCompact block behavior, raw event receipts, and proof that blocking prevents compaction/model response. This closes the previous “build before proving the rail can invoke the authority” error.

Before R0 may run, the Plan must freeze its exact inert helper/harness bytes, isolated settings/project roots, installed Claude tuple, allowed temporary writes, expected legal hook outputs, timeout, cleanup owner, and independent R0 review receipt. R0 PASS authorizes lifecycle Build only; it never counts as lifecycle QA or proves SessionStart handoff content.

### At-least-once injection and separate work acknowledgment — incomplete

The Plan correctly stops claiming that SessionStart can mark a generation delivered before Claude accepts the hook result. Retrying the same immutable generation is the right at-least-once direction.

However, “a subsequent accepted event/receipt” does not identify an acknowledgment transport. Stop/SubagentStop do not return the delivery nonce, and the Plan explicitly disclaims PostCompact causal acknowledgment. No transition states which exact event or command supplies generation, nonce, execution identity, work key, and expected version. “Nonce lineage” and “resume/work transition” are also undefined. A builder must therefore decide whether a response, Stop, resume, or explicit command means work was accepted—the central duplicate-work policy.

Minimum repair: freeze two separate transitions before Build:

1. `recordInjectionAttempt`: exact current project/execution/generation, fresh attempt nonce, transcript checkpoint, expected generation version, and immutable payload hash; it never makes the generation ineligible and never claims Claude receipt.
2. `ackWork`: one explicitly named authenticated-by-local-context command/event carrying exact project/execution/generation, attempt nonce, idempotency/work key, and expected version. It may CAS-mark only that work key acknowledged. Native Stop/PostCompact or first-response observation cannot imply it. Until `ackWork` succeeds, retries may inject again and duplicate work remains an honest at-least-once possibility.

Specify attempt-nonce uniqueness/retry lineage, concurrent ack/refresh behavior, stale/displaced rejection, resume selection after ack, and fake/filesystem tests. If no causal ack surface is desired, remove duplicate-work-prevention claims and retain pure at-least-once delivery.

### Injection-only sentinel — proof idea repaired, schema boundary missing

Making the live sentinel absent from the pre-compaction transcript and native Claude summary correctly rules out transcript/PostCompact leakage. The sentinel can then prove that the first response received SessionStart additional context.

But the Plan places a fresh random value “into the handoff decision card.” The production card is evidence-derived and deterministic; an invented random semantic card value violates that discipline unless the schema distinguishes test instrumentation.

Minimum repair: define a manifest-bound, isolated-test-only `rail_probe` envelope outside the semantic decision card, or an explicitly nonsemantic optional schema field. It is enabled only for the frozen test root/settings/harness, never generated in ordinary production, excluded from card evidence/next-action semantics, length-bounded and privacy-scanned, and included in exact payload/input/output digests. Production validation rejects the field without the test capability. The live response must reproduce the marker while required evidence-backed card values and exact next action also survive.

### Pure observers — not repaired

Lifecycle/CAS says observers are pure zero-write by default, but the failure section still says “Observers may read/append bounded informational metadata.” Step 2 also calls Stop “observation-only” while permitting a separately named acknowledgment mutation. These statements authorize incompatible implementations.

Minimum repair:

- `status`, `diagnose`, and health are pure: zero journal writes or directory creation, GC/recovery, settings changes, service/process starts, fallback selection, or content exposure. Missing/corrupt state stays unmodified. Tests assert an empty effect ledger.
- Stop/SubagentStop response evidence, if retained, is named `response_audit`, not observer. It is a separate optional expected-version CAS append to the exact current generation and cannot affect head, injection eligibility, work acknowledgment, expiry, GC, recovery, or restore. Conflict/ambiguity is a no-op.
- Replace every generic “observer may append” sentence and taxonomy use with these two exact categories.

### Frozen evidence/CAS/clock/quarantine semantics — named, not yet governed

The final freeze paragraph now names the right missing artifacts: exact v5 evidence, loser/orphan lifecycle, interprocess CAS, clock rollback, expected-versus-legitimate-missing state, and unsafe-root quarantine. Naming them in one sentence does not define who produces them, which reviewer gates them, or their acceptance rows.

The evidence layer still contains the placeholder `accepted-host-evidence-v5` without an OKF id or SHA-256, and says its digests need exist only before Review, conflicting with the “before implementation” freeze. The acceptance/traceability tables contain no orphan, clock, missing-state, or unsafe-root cases.

Minimum repair: add a pre-Build `D0 contract freeze` task, independently product- and skeptic-reviewed, that emits exact versioned artifacts for:

- v5 source/evidence ids, SHA-256 values, installed host/tool tuple, enumerated predicates, and explicit nonclaims;
- interprocess CAS protocol and every create/head/generation interruption boundary;
- `orphan_unreferenced`: never restorable/promotable, fixed prepare expiry, sole-owner expected-version bounded GC;
- wall-clock forward/rollback/equality behavior, persistent versus invocation-monotonic time, and fail-closed expiry decisions;
- the event-by-event expected/legitimate-missing/error matrix, including no-bundle no-op versus active compact missing-handoff `continue:false`;
- unsafe-root behavior: no write/quarantine inside a symlinked, wrongly owned, or permissive root; content-free diagnosis only until an exact safe recovery precondition is restored; and
- quarantine address, permissions, schema, version guard, collision behavior, fixed expiry, bounded owner, and no restore/promote path.

Each artifact needs fake/filesystem test authority and a traceability row. A placeholder name or later builder choice is not a freeze.

### Dependency ordering — not repaired

The final paragraph says `R0 -> Build -> Review -> QA -> live`, but the work table still assigns QA to steps 3 and 4 before independent Review, and step 8 still freezes artifacts during live acceptance. This directly contradicts “no pre-Review QA” and leaves Review, QA, and live gates free to use different bytes.

Minimum repair: use one dependency graph and remove the conflicting table text:

`Plan product+skeptic PASS -> frozen/reviewed R0 -> R0 live PASS -> D0 contract freeze product+skeptic PASS -> Builder authority/adapters/tests -> G0 full checks + candidate manifest -> exact-manifest independent Review PASS -> exact-manifest QA PASS -> exact-manifest negative host rails PASS -> manual main PASS -> automatic main PASS -> subagent PASS`.

Builder may construct tests before Review; QA may design acceptance cases during planning but does not execute/adjudicate the candidate until Reviewer PASS. G0 freezes source/tree, package/tarball/version, helper, schemas/contracts, adapters, fixtures/harness, v5 evidence, and exact Claude host tuple. Any drift returns to G0 and exact source Review before QA/live.

### Supported subagent rail — still missing

Exact `agent_id` and main/subagent derivation remain product requirements, but R1 live acceptance still includes only manual and automatic journeys. Add a separate real subagent PreCompact → SessionStart(source=compact) → first response → optional PostCompact/response audit → SubagentStop gate with stable exact session/agent identities, sibling/main nonselection, injection-only marker, evidence-backed card values, and exact next action. Inability to exercise it is `BLOCKED-PENDING-VERIFICATION`.

## Requirements that survive

- The objective remains cognitive durability, not computation surviving hook exit.
- No detached worker, resident supervisor, launchd, tmux production authority, or fresh negative tmux query is introduced.
- `SessionStart(source=compact)` is the sole load-bearing injection channel; PostCompact is non-authoritative.
- Full canonical project/execution identity, byte comparison, full hashes, no fallback, create-only generations, mutable head, expected-version CAS, resume freshness, fixed logical expiry, sole event-driven GC, version-guarded recovery, 0700/0600 privacy, and process-level-only durability remain correct.
- Fake, filesystem, exact-host, historical-v5, and real-Claude evidence layers remain distinct.
- R0 before lifecycle Build and Review before QA are the correct intended gates once the contradictory work table is replaced.

Remove `lease` from `lease/expiry` or define it solely as fixed non-renewable logical expiry; the selected production architecture has no heartbeat/ownership lease.

## Decision

**FAIL. Build authorization: NO.** R1 cannot authorize R0 or lifecycle implementation until the exact Plan is made internally consistent and the D0/R0/G0 artifacts and dependencies are explicit. Revise only this D+E Plan; do not reopen the alternatives decision or tmux-probe loop.

[tracked by](../tasks/pre-compact-multi-session.md)
