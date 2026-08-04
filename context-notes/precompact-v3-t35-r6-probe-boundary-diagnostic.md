---
type: Context Note
title: Revision 3 T3.5 R6 probe boundary diagnostic
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T00:28:37.218Z'
---
# Summary

The first R6 repair-probe script candidate is **FAIL / NOT RUN**. The builder stopped before freeze or execution because the precommitted acceptance and skeptic rubrics expanded a bounded host-primitives probe into a second lifecycle implementation. The exact unfinished draft is `/private/tmp/aslite-t35-r6-repair-probe.builder/repair-probe.mjs@sha256:7399f09b59294477b5104def9c5c568a2b94b190b34fc52055565718efa5a40b`, 1,566 lines, mode 0644. `node --check` passed, but the file has no dispatcher/orchestrator, manifest, validator, final audit, failure cleanup, or contract; executing it would run zero cases. It was not frozen or executed and produced no evidence.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: redraw the pre-Plan verification boundary so exact-host primitives are empirically proven once while pure state-machine/CAS policy remains a post-Plan red-first implementation obligation; this serves the ultimate goal by avoiding both unsupported host assumptions and a convention-split duplicate acceptance authority.

## Whole-system diagnosis

The R6 repair has three distinct proof layers:

1. **Host primitives:** what exact Darwin/Node/tmux/Claude actually do—explicit-argv0 exec, commandless foreground server, exact `-N` query/control behavior, process-group topology, detached/new-PGID survival, server/pane termination behavior, stale sockets, and synchronous hook join. These require real host evidence before they become Plan premises.
2. **Authority policy:** reservation/identity/release states, exclusive lease/CAS, result-loss reconciliation, nonholder rejection, takeover, stopped-actor fencing, verdict algebra, evidence schemas, and cleanup ordering. These are software semantics. They must be specified in the exact Plan, implemented once in `scripts/handoff-candidate.mjs`, and exhaustively tested through a fake scheduler plus exact implementation smoke. A scratch probe cannot prove the future implementation's policy.
3. **Immutable-candidate/live product proof:** exact helper effects, manual/automatic/real-subagent compaction, first response/action, auth/protected-state continuity, and real known-principal cleanup. These remain post-G0 R0/Q0/L0-L3 gates and cannot be substituted by either a scratch probe or fake scheduler.

The failed probe collapsed layers 1 and 2. Its rubrics required a scratch script to implement the full lease ledger, state machine, negative parser/frame/socket matrices, takeover scheduler, strict evidence authority, and terminal cleanup. That duplicates the future one executable authority and makes the probe itself an unreviewed second rail. This is the same class of architecture smell revision 3 is meant to eliminate.

## What the failed draft established

Nothing empirical. Static code fragments partially model closed cleanup argv, a gate identity, missing `KILL_SERVER` receipt, detacher positive/missing/late/conflict/duplicate cases, and ordering traces, but no case is executable and no validator/oracle is complete. No mandatory case receives credit. The exact script-review failure is retained; the draft must not be repaired incrementally into the acceptance implementation or executed.

## Proposed corrected boundary

A replacement pre-Plan probe should be small, host-only, and construction-independent. It should reuse the already audited v5 gate and strict raw `ps`/group/socket machinery rather than reproduce campaign policy. Mandatory fresh empirical questions are limited to:

1. Does an exact no-auth gated Node principal successfully exec each closed cleanup `tmux -N` action—server PID query, session query, pane query, `kill-server`, and final absent-server read-only query—with explicit argv0, strict output/effect, no autostart, and exact client/group absence?
2. If a released `kill-server` client result is deliberately discarded, can a later observer distinguish server-live from server-absent using only fresh exact PID/group/socket observations after the client/group is absent? This proves the host information needed for conservative reconciliation, not the CAS policy.
3. Can two independent no-auth requester processes be observed while only a designated owner invokes control, and can takeover after exact owner absence execute a later action? This proves the needed OS identities/action surface, not the future lease implementation.
4. Does a declared public-marker detached/new-PGID child survive pane-group or server assumptions, remain exactly observable from its create-only record, and require separate group reaping? Does descendant-first cleanup leave the server live until the child/pane groups are absent, while a server-first demonstration leaves the child live and therefore makes that order empirically unsafe?
5. Do all exact processes/groups/sockets disappear, protected real-user/worktree state remain byte-identical, and final no-autostart/process audit pass?

The probe may use a simple single-process test controller and controller-only safe teardown. It must keep raw primary observations separate from fallback/controller cleanup and may not claim to have proven CAS, one-lease policy, scheduler interleavings, evidence schema implementation, live Claude rail, or arbitrary unmarked escape detection. Those explicit non-claims are part of PASS.

Prior exact hook-join evidence `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb` may supply the generic aggregate join primitive with its overall FAIL/global-drift limitations. A fresh no-auth Claude repetition is optional and must not trigger normal/global auth fallback. Candidate-specific direct-helper effects remain a later immutable-candidate gate.

## Required policy after the boundary correction

The exact replacement Plan must still require the entire rejected rubric's state/CAS/fault matrix in the real one executable authority before G0. Exact Plan review must verify that those requirements are measurable. The implementation's fake scheduler and no-auth exact implementation smoke—not the pre-Plan scratch probe—must prove every reservation/self-record/release/takeover/result-loss/stopped-actor/parser/frame/socket interleaving. Exact-SHA Review must mutate one scheduler/reaper oracle red. Later frozen-candidate lanes retain the full live delivery and known-principal cleanup gates.

## Next decision

Architecture, product/acceptance, and skeptic roles must independently decide whether this smaller host-only boundary is sufficient to draft the repaired Plan without repeating the earlier calibration error. If they agree, a new small script is authored against a short frozen rubric, dual-reviewed, run no-auth, and independently audited. If they reject it, the precise missing host fact—not a full software policy matrix—must be named.

[tracked by](../tasks/pre-compact-multi-session.md)
