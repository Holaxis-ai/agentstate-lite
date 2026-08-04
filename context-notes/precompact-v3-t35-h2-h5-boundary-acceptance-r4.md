---
type: Context Note
title: T3.5 H2-H5 boundary R4 acceptance — PASS
description: Fresh exact static acceptance review of one-shot R4 cross-attempt authority.
actor: codex-t35-h2-h5-acceptance-r4
timestamp: '2026-08-04T18:38:03.671Z'
---
# Summary

Status: **complete**.

Verdict: **PASS**.

Confidence: **0.98**.

`builder_task_eligible: true`

R4 closes the R3 cross-attempt baseline-authority defect without weakening the accepted R2 architecture or R3 same-attempt causality. The execution authorization is a one-shot durable Task that binds the exact reviewed script/contract, campaign, ordinal, actor, and initially absent root; the runner must CAS-claim it before invocation, and every outcome consumes and terminalizes it. `BLOCKED_PENDING_VERIFICATION` ends at the first Git-helper spawn. From that spawn onward, helper error, incomplete reaping/EOF, index drift, `P0 != P1`, dirty/malformed worktree evidence, protected-state drift, or any later defect is terminal FAIL plus containment, with the original P0 and causal receipts retained.

The acceptance-critical cross-run traces are closed. Same-root replay encounters the create-only retained root and a consumed authorization. A fresh-root or fresh-campaign replay does not match the exact claimed authorization and is rejected by independent audit. A later authorized attempt is not a retry path: it requires a separate durable rebaseline Decision and fresh exact-review dependency. Where drift occurred or cannot be disproved, that Decision requires either independent canonical proof that current state equals the failed attempt's retained P0 or explicit human approval to adopt a different baseline. Agent-only changed-state approval, automatic restoration, silent P0 replacement, and unreviewed new-root execution are expressly forbidden.

## Exact inputs and isolation

- Exact R4 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:d81f773963d65a415f3ddc6bf32caaf86e566927f14dccf61b8015122ea582f4`.
- Updated whole-system diagnostic: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:d854a7c2b77d12afdbe477a893fa7a7bf5263f6a654afed07c977996c54d252a`.
- R3 skeptic PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`.
- R3 acceptance FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`.
- Decision/v5 and earlier accepted inputs are inherited exactly as named by R4.

I acted only as the fresh R4 product/acceptance reviewer. I did not inspect the current R4 skeptic output and did not communicate with that reviewer. I performed a static document review only. I did not execute host/tmux/Git-helper/Claude/auth/network/tests, mutate source/Plan/parent/handoff, or sync the bundle.

## Counterexample attacks

1. **Helper mutates the index and exits nonzero.** Because the first Git helper has spawned, R4 requires terminal FAIL, retains original P0 plus the manifest/completed receipts/P1 when available/final continuity attempt, consumes the authorization, and forbids treating the mutated state as a new baseline. This repairs the exact R3 failure.
2. **Runner retries after a pre-helper BLOCKED result.** The result still consumes and terminalizes the Task. The same root is create-only and retained; no automatic retry is available.
3. **Runner retries after FAIL using the same root.** The authorization is consumed and the root already exists, so the invocation fails before helper spawn and cannot produce accepted campaign evidence.
4. **Runner chooses a new random root or campaign.** The authorization binds the exact root, campaign id, ordinal, and script/contract digests. Evidence from a mismatch is outside the campaign and the independent auditor must reject it.
5. **A later agent silently chooses the failed run's changed state as P0.** No later authorization may be created without the separate reviewed rebaseline Decision. Drift or inability to disprove drift activates the canonical-equality proof or explicit-human-approval gate; agent-only adoption is forbidden.
6. **Cleanup hides helper-caused drift.** R4 says drift is recorded and never restored, forbids automatic restoration, retains the failed root/original P0/causal receipts, and makes cleanup incapable of promoting a failed primary fact.
7. **Authorization is presented but was never claimed.** The execution gate requires pre-invocation CAS claim, while evidence audit requires the exact claimed authorization and rejects unapproved ordinals, roots, and campaigns. A merely self-consistent exported JSON file is not sufficient accepted evidence.

## Regression review

- The accepted exact-binary top-level `-N` premise and its nonclaim remain unchanged.
- H2 still seals the observation plan and withholds action-result bytes from the pure stdin/stdout observer until it returns.
- H4 remains limited to pane-requested, controller-created direct marked companions; it makes no arbitrary-descendant or pane-owned-containment claim.
- `abort-latch` and terminal `action-fence` remain separate, with server-B kill as the final authorized tmux action between them.
- P0 -> preregistered sequential Git helpers with direct-handle/index guards -> P1 equality -> frozen baseline remains the only route to probe-principal spawn.
- H5 remains passive after the action fence and compares terminal state to the frozen baseline.

## Builder and later-orchestration boundary

The clean-room script builder has no material authority choice left: it must implement the exact one-shot authorization validation/binding, phase machine, P0/Git/P1 gates, post-helper FAIL algebra, retained failure evidence, and accepted H2-H5 mechanics. The runner/auditor must retain auditable Task claim and terminal-consumption receipts; neither may substitute structural JSON validity for the exact claimed authorization. If another attempt ever becomes necessary, its rebaseline proof protocol, Decision, and authorization are separate reviewed orchestration artifacts—not discretion delegated to this builder.

[reviews](../designs/precompact-v3-t35-h2-h5-host-probe-boundary.md)
[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-acceptance-r4.md)
