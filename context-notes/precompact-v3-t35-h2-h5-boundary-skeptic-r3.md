---
type: Context Note
title: Revision 3 T3.5 H2-H5 boundary skeptic review R3
actor: codex-t35-h2-h5-skeptic-r3
timestamp: '2026-08-04T18:31:14.668Z'
---
# Summary

Status: **complete**.

Verdict: **PASS**.

Confidence: **0.97**.

`builder_task_eligible: true`

Exact R3 closes the sole R2 skeptic blocker without reopening any accepted R2 architecture. The P0/preregistered-Git-helper/P1 sandwich now places preflight observers inside the evidence and containment envelope but before every probe principal; helper/index/protected drift cannot be absorbed into the accepted baseline; and all later continuity checks bind to frozen P1 plus semantic worktree/Git receipt digests. I found no load-bearing conforming counterexample. This PASS authorizes only clean-room static script authoring. It does not authorize execution or any later Plan/product/candidate gate.

# Exact reviewed inputs

- Task claim input: `tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:7e6416add0a338f17974cadb20ec4baaceda9d7c1a2b8c1fe1130ece4cccc30b`; claimed by exact CAS as `codex-t35-h2-h5-skeptic-r3`.
- R3 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903`.
- R3 whole-system diagnostic: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:5b2324df8c7af32856a55b183c1edfd605f44481b5cf4380fc05b343c5ae4305`.
- R2 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`.
- R2 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`.
- Decision: `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`.
- Retained Research/audit: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf` and `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.
- Retained source/evidence/summary: `c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`, `063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`, and `39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Pinned tmux binary/manpage: `e0c40b227b8d7283c4ace45056c70cf0fe371bd00b62e52b6e14fadae5d69f70` and `6903664073d73ae13d764216917932a4d5a212ce6b8e836297a58b3bf58c78ca`.
- R3-pinned Git: `/usr/bin/git@sha256:179301dcb41ea78accc3fa0048a7e6f6710d891945a751a34addd622020c1818`, version `2.39.5 (Apple Git-154)`.

# Isolation

This was a fresh independent static falsification review. I did not inspect or communicate with the current R3 acceptance reviewer, execute a host probe or tmux action, inspect live processes, use Claude/auth/network actions, run tests, modify repository code, modify a Plan/parent task/shared handoff, or sync. The only mutations are my exact CAS task claim, this uniquely owned review note, and my terminal task update.

# P0/helper/P1 adversarial traces

## Pre-P0 spawn — survived

Source, tool, path, hash, and helper-vector validation is explicitly in-process. The helper manifest is complete before P0, and no child may exist yet. Git version identity does not require an unregistered `git --version` escape: the exact path/digest/version is normative, and any runtime Git invocation, including a version receipt if the builder retains one, must already be one of the preregistered P0/P1 helpers.

Byte review must verify mode dispatch and initialization have no top-level spawn, subprocess-backed realpath/hash shortcut, shell, hook, or implicit helper before P0. That is an exact-source check against an already closed ordering rule.

## Helper-induced or unregistered child — survived

Only immutable pinned-Git vectors may execute between P0/P1. Helpers are sequential, bounded, direct-handle owned, and must satisfy close, both EOFs, exact PID/group absence, and per-helper index equality before the next transition. Fsmonitor, untracked cache, submodule recursion, external diff, and textconv are disabled; arbitrary executable/shell use is forbidden. An extra helper, pager, filter, submodule process, detached survivor, missing group proof, or incomplete close/EOF receipt prevents baseline freeze.

Byte review must make each helper's isolated process-group construction and sampled group-absence mechanism explicit, suppress pager/global-config extension points in the exact environment, and prove no external-command-capable Git option is reachable. Those are implementation mechanisms for R3's normative no-child/absence predicate, not missing policy.

## P0/P1 scope mismatch — survived

P0 and P1 use the same exact protected/worktree physical-snapshot authority, row schema, raw-byte ordering, bounds, symlink/owner/special-file rules, npm metadata-only sentinel, resolved-index tuple, and canonical comparison. Both are written and read back. A builder cannot compare only a subset or silently omit an unreadable/over-limit target: those conditions are pre-baseline BLOCKED.

Byte review must verify both snapshots call one owning implementation with identical arguments and that its worktree physical/index rows do not depend on Git output. This is a parity check, not a new scope decision.

## Git/index mutation hidden in P1 — survived

Every helper has an immediate index-before/index-after metadata+digest guard, and the complete helper interval is additionally enclosed by P0/P1 canonical equality. Persistent helper mutation of a protected path, tracked/untracked worktree byte, directory metadata, or resolved index therefore prevents `BASELINE_FROZEN`; P1 cannot redefine the changed state as clean. Git receipts must independently prove exact branch/SHA/tree and empty porcelain/diffs.

The boundary intentionally does not restore drift to manufacture PASS. A contained preflight-helper failure is `BLOCKED_PENDING_VERIFICATION` because no probe principal has spawned; a baseline can exist only after equality and clean receipts. After baseline freeze, any analogous drift is FAIL. This state split is closed and non-promotional.

## Incomplete helper termination or dirty receipts — survived

Receipt production alone is insufficient: each helper must close, reach both EOFs, prove its registered PID/group absent, remain within bounds, preserve the index, and yield the exact clean predicates. Missing/truncated/ambiguous output, nonzero/error termination, dirty porcelain/diff, wrong branch/HEAD/tree, or a survivor blocks the phase. The controller cannot freeze digest labels over an unvalidated receipt because the transition algebra makes every predicate conjunctive.

## Terminal comparison to the wrong baseline — survived

`baseline.json` is frozen only from P1 digest, validated Git receipt digests, semantic worktree digest, and helper-manifest digest. Post-branch and terminal snapshots compare back to that frozen authority, not P0, a fresh current state, or helper process metadata that naturally changes per invocation. Per-observation Git index guards remain mandatory. Any missing baseline readback, digest mismatch, or comparison against a newly synthesized baseline is exact-contract FAIL.

# Regression attacks on accepted R2

## Option-level `-N` and target disappearance — survived

R3 retains the explicitly adjudicated architecture premise: top-level `-N` is command-independent no-autostart behavior of the exact hashed tmux binary, supported by its pinned manpage and narrow v5 observations. Every new client family has top-level `-N`, a preregistered closed vector, and a sampled exact-live precondition. Disappearance before contact yields primary FAIL plus passive generation/process checks, not a new server or an H1 promotion. No deliberately absent, recovery, default, fourth-family, or post-fence tmux action exists.

## H2 noninterference — survived

Observation plans are sealed/read back before action; helper order/arguments are fixed; action status/bytes remain opaque until the separate stdin-only observer returns; and the observer is forbidden filesystem, spawn, network, receipt, global, and closure capabilities. Early action parsing, result-conditioned scheduling/input, mode-import leakage, or output-overflow short-circuiting is script FAIL. Those are byte-level dataflow checks under a complete architecture.

## Controller-owned H4 scope — survived

The pane performs no spawn. A validated request allows only the controller to create the direct marked companion, retain its handle before self-record, and validate the new PGID. Record failure remains directly containable. The nonclaim is still exact: H4 applies only when a later lifecycle authority itself creates/retains the marked principal; it says nothing about pane-owned detachers, arbitrary descendants, hooks, subagents, or real Claude containment.

Script review must require tmux's documented multi-argument direct pane command form, forbid extra pane-query/action vectors, prove the pane's hard lifetime/no-spawn behavior, and verify direct companion handle/group teardown. These implement the accepted scope.

## Two fences, socket generation, and provenance — survived

The abort latch rejects new creators/requests, then descendants drain while server B remains live; server-B kill is the sole final tmux action; only its terminal receipts create the action fence. H5 is passive thereafter. Changed socket generation is never adopted or unlinked as owned. Helper/observer error cannot become absence. Primary H4/H2 evidence is latched before containment, fallback cannot overwrite it, and passive H5 cannot freshly prove no-autostart or upgrade any v5 limitation.

## Feasibility and line/principal bounds — survived

R3 adds one finite preflight phase and reuses the pinned snapshot/helper authorities; it does not add an unbounded principal class. The 800-line cap remains fail-closed. If exact source cannot implement the required helper isolation, canonical P0/P1 parity, H2 child mode, principal ownership, receipt algebra, and terminal comparison within the cap, the builder returns FAIL rather than omitting policy.

# Outcome and next gate

Closed **PASS** on exact R3 `sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903` for static builder authoring only. The next eligible action after the independent R3 product result is a clean-room builder task that writes but does not execute immutable script bytes. Those bytes need fresh independent product and skeptic PASS before any host execution.

[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r3.md)
