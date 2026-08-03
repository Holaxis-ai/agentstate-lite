---
type: Context Note
title: Revision 3 adversarial plan-gate re-review
actor: codex-precompact-v3-plan-skeptic-r2
timestamp: '2026-08-03T18:22:15.533Z'
---
# Summary

**FAIL** — confidence **0.96**.

Exact artifacts reviewed:

- design `sha256:7d9c8643c701d346ca672336798ab1a769d739ec3dadb113e7093c4c9369ab6f`;
- plan `sha256:36fcaba4a3f9ce5156d58edcd873c302d7c41b62309866dd7404076f128b79d1`;
- orientation `sha256:6a5a02140842cc24730814c620c74d73fa36fe590d3212cfbc56970828e1932b`;
- live probe `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`;
- prior skeptic FAIL `sha256:288bf97778aeefa1762b0e16b275e26b5ce454c07d3aff69c8ef0b024aaba1de`.

The revision closes all six prior findings, and its create-generation-then-CAS-head publication is coherent under the enumerated interruption races. Four blockers remain.

## Blocking findings

1. **Current heads make secret-bearing state immortal.** The design says a generation selected by any head is never collected, while GC and automatic retirement apply only to non-current generations. A session that compacts once and never compacts again retains its final head plus transcript-bearing generation forever; prepared state left by a declined compaction does the same. Manual `hook recover` is restricted to corrupt/unsafe/expired state and does not make ordinary completed sessions self-cleaning. Add an authority-owned, version-guarded head-retirement transition: after the retention horizon, exact-read and CAS-detach an unchanged current `response_observed` generation (and an expired prepared/delivered generation), then let non-current GC delete it. Test races with resume, delivery, new publication, and GC.

2. **`source:resume` cannot safely treat every prepared generation as a compaction handoff.** PreCompact is proven to run when Claude subsequently declines compaction. If the session then continues, exits, and resumes, the current plan redelivers that old prepared card even though later transcript work exists and no compaction occurred. Require transcript evidence that a compaction boundary followed the prepare checkpoint, or deterministically refresh/suppress a prepared record when the transcript advanced without such a boundary. Add a declined-compact → more work → exit → resume acceptance case.

3. **Non-causal response observation still changes recovery semantics.** A Stop from an older concurrent resume can satisfy path/checkpoint/first-appended-response checks for a newer delivery and mark it `response_observed`, even though that model response did not consume the newer card. The design correctly makes this state non-destructive for replacement and GC, but `source:resume` only redelivers prepared/delivered generations, so the false observation can suppress later recovery. Either bind observation to a host/process attempt, keep `response_observed` eligible for safe redelivery until stronger evidence exists, or explicitly narrow concurrent same-session resume support and make status/acceptance truthful. Test the stale-Stop/new-resume ordering.

4. **The single SessionStart process does not isolate handoff delivery from board latency or output size.** The helper only returns hook JSON when the process exits. Performing the existing best-effort board pull/home render after authority delivery still delays that return and can consume the remaining host timeout; appending home output can also exceed the final hook output budget even when the card alone is under 8,000 characters. Thus board failure/latency can invalidate the load-bearing restore despite the prose claiming it cannot. Define one absolute helper deadline below the host timeout, make board work cancellable/droppable within the remaining budget, and cap the final composed `additionalContext`—not only the card. Add slow-board and oversized-home tests plus a live delayed-board case.

## Exact-artifact inconsistency to correct with the blockers

The orientation calls a generation “immutable,” while the design and plan CAS-refresh and transition generation bytes through `prepared`, `delivered`, `response_observed`, and PostCompact audit updates. Because builders are required to read that exact orientation as frozen input, revise it to “generation-addressed mutable state record,” or split immutable payload from mutable lifecycle state explicitly.

## Survived attacks

- Full project and execution identity now determine the physical namespace and are rechecked byte-for-byte.
- Content-addressed versions are correctly external metadata rather than self-persisted fields.
- Generation-addressed history plus a CAS head resolves the prior overwrite/retention contradiction and handles losing publishers with bounded orphans.
- Delivery rechecks the head after generation CAS, so a concurrent publication cannot inject a displaced generation.
- Stop is honestly observational and cannot authorize replacement or physical deletion.
- Real negative-rail and real sub-agent compaction gates are mandatory on one digest-pinned artifact after Review and QA.

## Required next action

Revise the design, plan, and orientation for findings 1–4, add the named T0/QA/live cases, and rerun the independent plan gate before T1/T2 implementation.

Ultimate goal: preserve agentstate-lite as shared, versioned, conflict-safe memory. Proximate review goal: ensure the compaction authority is bounded, recoverable, and load-bearing at the actual host boundary. Progress: second adversarial plan review complete; implementation remains blocked on the four findings above.
