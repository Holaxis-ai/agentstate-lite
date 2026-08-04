---
type: Context Note
title: T3.5 H2-H5 boundary R3 acceptance — FAIL
actor: codex-t35-h2-h5-acceptance-r3
timestamp: '2026-08-04T18:31:26.213Z'
---
# Summary

Status: **complete**.

Verdict: **FAIL**.

Confidence: **0.99**.

`builder_task_eligible: false`

R3 repairs the same-attempt P0 -> preregistered Git helpers -> P1 -> baseline ordering and preserves the accepted R2 architecture. It is not build-eligible because its failure algebra contradicts the governing R3 diagnostic and permits helper-caused drift to become a later attempt's accepted baseline. The diagnostic says protected/worktree drift or observer error is FAIL and only a pre-spawn prerequisite failure is BLOCKED. The boundary instead classifies every P0/P1 difference, helper/index drift, helper error, or unexpected child as `BLOCKED_PENDING_VERIFICATION` merely because no probe principal has spawned—even though Git observation principals have spawned and may already have mutated protected state.

## Isolation and exact inputs

I acted only as the fresh R3 product/acceptance reviewer. I read the frozen R2 acceptance PASS and R2 skeptic FAIL because they are mandatory R3 inputs. I did not inspect any current R3 skeptic output or communicate with the skeptic. Review was static and read-only apart from my uniquely owned task/note writes: no host probe or tmux process/action, Claude/API/auth/network action, test, repository code or Plan mutation, parent-task/shared-handoff mutation, or board sync.

Exact inputs reviewed:

- R3 boundary `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903`
- R3 system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:5b2324df8c7af32856a55b183c1edfd605f44481b5cf4380fc05b343c5ae4305`
- R2 acceptance PASS `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`
- R2 skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`
- inherited decision `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`
- inherited Research `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`
- inherited audit `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`

Static hash checks matched R3's pins for `/usr/bin/git@sha256:179301dcb41ea78accc3fa0048a7e6f6710d891945a751a34addd622020c1818`, `/bin/ps@sha256:472992c470606d28f577590decfecd7f4a20f832fd92c671bebc6d44790b5d02`, the exact tmux binary/manpage, and retained v5 source/evidence/summary.

Task claim: CAS from `sha256:2e41c11d7bc450d74b73d0edd9e6e10c7f1d8a68b3c7b10ad391512428a39ec3` to in-progress `sha256:11ded4d7707758cc4b1ff777b6d7b188fa5120ba2f9a2cd1a5ef22e391fab2fb` as `codex-t35-h2-h5-acceptance-r3`.

## P0/Git/P1 causality adjudication

### Mechanics — PASS

The new ordering is non-circular within one attempt:

1. immutable identities and every Git vector are validated/preregistered in process before a child exists;
2. in-process P0 is written/read back;
3. only fixed direct Git helpers run sequentially, with bounds, original-handle close, both EOFs, process/group absence, and per-helper index-before/index-after equality;
4. in-process P1 is written/read back and must canonically equal P0 while Git receipts prove the exact clean branch/SHA/tree/worktree;
5. only then is `baseline.json` frozen/read back and the first probe principal permitted.

This closes the R2 construction contradiction. A Git mutation cannot be silently incorporated into P1 **during the same attempt**, because inequality prevents `BASELINE_FROZEN`. Exact Git and ps paths/digests are pinned, preflight Git helpers are a distinct non-primary principal class, no other child is legal between P0/P1, and post-baseline drift is explicitly FAIL.

### Verdict and retry causality — FAIL

The governing diagnostic states: "Any survivor, observer error, socket generation drift, protected/worktree drift, missing receipt, or stronger claim is FAIL; pre-spawn prerequisite failure is BLOCKED." Git helpers are spawned evidence-producing observation principals. R3's boundary instead says any P0/P1 difference, helper/index drift, helper error, unexpected child, or incomplete receipt is BLOCKED because no **probe** principal has spawned, and its verdict section repeats that everything before `BASELINE_FROZEN` is BLOCKED.

Those rules are incompatible and the boundary rule is unsafe across attempts.

Minimal counterexample:

1. Attempt 1 records clean protected/worktree P0.
2. A preregistered Git helper anomalously changes the index or another P0-covered path, closes, and is reaped.
3. P1 differs from P0. The boundary correctly refuses to freeze P1, but labels the outcome BLOCKED and never restores the changed state.
4. Attempt 2 starts from that already changed state. Its P0' contains the mutation. If the helper is now stable, P1' equals P0' and the clean Git receipts can allow `BASELINE_FROZEN`.
5. The exact observer-caused mutation that attempt 1 detected has become attempt 2's accepted baseline. Failed-root retention makes the history inspectable but does not mechanically prevent this promotion.

The same semantic conflict exists for an observer error or unexpected child after a Git helper spawn: it is not a pre-spawn missing prerequisite under the diagnostic's closed algebra.

Minimal repair:

- Permit `BLOCKED_PENDING_VERIFICATION` only before the first preflight helper spawn for missing/unsafe immutable inputs or inability to complete P0.
- Once any preflight observation helper spawns, helper error, survivor, unexpected child, index drift, or P0/P1 inequality is terminal FAIL plus bounded containment, with the original P0 retained as the non-adoptable attempt origin.
- Prevent automatic retry from treating drifted state as a new origin: a later attempt after preflight protected/worktree drift must either prove exact equality to the failed attempt's P0 or require an explicit separately recorded rebaseline decision. Automatic restoration remains forbidden.

This is an exact-boundary repair, not a script-style detail, because it defines when state may become authority across attempts.

## Accepted R2 judgments reconfirmed unchanged

- **Option-level `-N`: PASS unchanged.** It remains an explicit pinned-binary/manpage architecture premise, corroborated but not empirically generalized by v5. A target-disappearance race is primary FAIL and cannot create a replacement server under the accepted premise.
- **H2 noninterference: PASS unchanged.** Plans are sealed before action, action bytes remain opaque until a separate stdin-only pure observer returns, and result-conditioned schedule/input or capability leakage is FAIL.
- **Controller-owned H4 scope: PASS unchanged.** Panes only request; the controller directly spawns/owns marked companions. H4 proves only controller-owned declared-principal ordering and cannot be generalized to pane-owned detachers, arbitrary descendants, hooks/subagents, or real Claude containment.
- **Abort/action fences: PASS unchanged.** Abort closes creators; server-B kill is the final authorized tmux action; action fence begins only after its terminal receipts and forbids every later tmux process.
- **Protected scope and pins: PASS apart from the verdict defect.** Exact targets, bounds, npm metadata-only claim, canonical feature path/branch/SHA, Git/ps identities, raw receipts, index guards, and non-restoration are pinned.
- **Primary/fallback algebra and gates: PASS unchanged outside preflight classification.** Cleanup cannot promote primary FAIL; H5 remains passive; v5 limitations and lease/CAS/scheduler/schema/auth/Claude/compaction nonclaims remain binding; builder, script review, execution audit, Plan review, and implementation gates remain separated.

## Outcome

Closed **FAIL** on exact R3 `sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903`. The P0/Git/P1 mechanism is mechanically sound for one attempt, but its post-helper verdict and retry baseline rules must be repaired and re-reviewed before a builder task is eligible.
