---
type: Context Note
title: T3.5 H2-H5 boundary R5 acceptance — PASS
description: >-
  Static acceptance review of R5 cooperative evidence-admission boundary and
  threat model.
actor: codex-t35-r5-acceptance
timestamp: '2026-08-04T18:46:12.246Z'
---
# Summary

Status: **complete**.

Verdict: **PASS**.

Confidence: **0.99**.

`builder_task_eligible: true`

R5 is an acceptable pre-build boundary for the selected option-1 H2-H5 host probe. It resolves R4's remaining defect by narrowing the claim to what the mechanism can actually support: cooperative orchestration, exact evidence lineage, and post-run evidence admission under a non-malicious same-UID model. It does not present self-digested JSON, advisory bundle actor labels, or live-user citations as cryptographic execution authority. The boundary repeatedly and expressly disclaims a trusted launcher, authenticated principal, signature/MAC, nonforgeable capability, cryptographic human approval, and physical prevention of arbitrary local execution.

That calibration is appropriate for this no-auth fact-gathering probe. A same-UID principal can already invoke the pinned local tools and mutate the same local files; preventing a malicious or compromised local principal would require a separate security architecture and is not necessary to determine whether a conforming run's H2-H5 evidence may enter the durable acceptance chain. The exact builder remains responsible for lineage binding and fail-closed evidence production, not for inventing an authentication system.

# Exact inputs and claim

- Review Task creation version: `tasks/precompact-v3-t35-h2-h5-boundary-acceptance-r5@sha256:d8c4f105dc80cc4e9b3482c0ab78f6eb2c74ed45c65dfbf28874974040109ecd`.
- Exact CAS claim by `codex-t35-r5-acceptance`: `tasks/precompact-v3-t35-h2-h5-boundary-acceptance-r5@sha256:8b30fbd251ae9ba97f3f32ffb0bc8c2afffa3179c93c5929c448d008cb5f2bc3`.
- Boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:33db32b3d9088052481301ee5829170c0ddee4f333eabf6b06907818bc951852`.
- Whole-system diagnostic/threat model: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c`.
- R4 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4@sha256:85cce4a5b61f15713f5ea8a95e481e084cd99729a75ef5abee07ea212fe69023`.
- R4 skeptic FAIL repaired by R5: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:ac378402e60ad29f377aecbca0345f5c61a85a0f7c798601d2bea94c51a55cfd`.

# Isolation

I acted only as the fresh R5 product/acceptance reviewer. No current R5 skeptic output existed, and I did not coordinate conclusions with a skeptic. This was static review only. I did not execute tmux, Git helpers, a host probe, tests, sync, Claude, API, auth, network, or feature code. I did not mutate repository code, the Plan, parent task, or shared handoff. My only writes are the required exact Task claim, this uniquely owned review note, and the terminal Task update.

# Load-bearing acceptance reasons

1. **The claim now matches the mechanism.** The export is exact lineage metadata, not proof of origin. Bundle CAS, root acquisition, terminal task state, and independent audit govern which result may advance; they do not claim to make arbitrary local execution impossible.
2. **The threat boundary is explicit and consistent.** Accidental concurrent claims, stale/mismatched exports, duplicate/replayed conforming invocations, crashes, observer mutation, retry pressure, evidence substitution, and mistaken advancement by a compliant agent are in scope. Malicious same-UID forgery/bypass is explicitly out of scope, consistent with the already accepted sampled non-malicious-same-UID process-identity bound.
3. **Human approval is honestly governance-level.** A changed-baseline Decision requires actual live user direction recorded in the handoff. An actor label alone never satisfies the predicate. R5 does not claim that this direction is cryptographically authenticated against a malicious local actor.
4. **The evidence gate remains fail closed.** Only evidence with exact claimed admission lineage, matching ordinal/root/campaign, terminal workflow state, and all H2-H5 predicates may advance. A forged or mismatched run may physically occur outside the model, but it is not accepted campaign evidence.
5. **The builder has no hidden security choice.** The script must validate and bind exact admission lineage, but it must not claim the export authenticates its creator. Authentication or physical launch prevention is explicitly a separate architecture, so the builder is neither required nor permitted to improvise it.

# Counterexample attacks

## Forged admission JSON

A same-UID caller can create structurally valid JSON, choose a fresh root, and invoke the script. R5 now acknowledges this directly. The trace does not falsify the stated product claim: arbitrary local invocation is out of scope, while the independent auditor rejects the result because it lacks the exact cooperatively claimed admission lineage. R5 promises evidence admission, not launch prevention.

## Forged human-looking actor label

An advisory actor label cannot satisfy the changed-baseline predicate. Within the cooperative model, the orchestrator may create the Decision only after actual live user direction and must cite that direction in the handoff. A malicious agent forging both the record and the claimed direction is expressly outside scope and is not described as cryptographically preventable.

## Duplicate conforming runners

Only one runner can CAS-claim the admission Task. Exact create-only root acquisition prevents two invocations carrying the same genuine export from both proceeding. A stale/mismatched export cannot produce admissible evidence. A crash leaving a claimed or incomplete record fails closed: it cannot be silently treated as a reusable admission or accepted result, and later execution remains behind the separately reviewed Decision/admission path.

## Helper-caused drift and retry pressure

After the first Git-helper spawn, error, timeout, survivor, unexpected child, incomplete close/EOF/absence, index drift, `P0 != P1`, dirty/malformed receipts, protected/worktree drift, or any later defect is terminal FAIL plus bounded containment. The original P0 and causal receipts remain retained; the state is not accepted into P1 and is never restored by the probe. The admission is consumed.

## Silent new-root rebaseline

A conforming later run cannot select a new root and silently adopt a new P0. It requires a separate durable rebaseline Decision and fresh exact-review dependency. If drift occurred or cannot be disproved, the Decision needs independent canonical equality to the failed P0 or actual live user direction approving a different baseline. Automatic restoration, agent-only adoption, and unreviewed retry remain forbidden.

# Regression review

- R4's one-shot admission consumption, retained root/evidence, post-helper terminal FAIL boundary, retained original P0, and separate rebaseline Decision remain intact.
- R3's in-process P0 -> preregistered sequential Git helpers with per-helper index guards and direct-handle/EOF/absence checks -> equal P1 -> frozen baseline order remains intact.
- The accepted exact-binary top-level `-N` premise and explicit nonclaim remain unchanged.
- H2 retains presealed result-independent plans and the pure stdin/stdout observer with withheld action-result bytes.
- H4 remains limited to pane-requested, controller-created direct marked companions; no arbitrary-descendant or pane-owned-containment claim was added.
- The abort latch and action fence remain distinct, with server-B kill as the sole final authorized tmux action between them; H5 remains passive after the fence.

# Residual risks and later gates

- A malicious or compromised same-UID principal can forge bundle/admission records, claim fake human approval, bypass the runner, or directly execute the tools. R5 deliberately does not mitigate this; such mitigation would require a separately chosen authenticated launcher/security system.
- Live-user approval remains a cooperative governance fact, not cryptographic provenance. The later auditor depends on the orchestrator's compliance and the cited handoff direction.
- Runner crash recovery and terminalization must be statically checked at the future execution-admission gate. A stale claimed Task must remain non-reusable and non-admissible; recovery may not silently create another run.
- The top-level `-N` behavior is an explicit inference from the pinned binary/manpage and retained v5 observations, not fresh empirical coverage of every R5 vector.
- PID/start/uid/PGID signaling remains sampled rather than atomic and assumes a non-malicious same-UID environment.
- This PASS authorizes only a clean-room script builder task after both boundary reviewers PASS. The exact script still needs independent acceptance and skeptic review; execution and replacement-Plan synthesis remain separately gated.

[reviews](../designs/precompact-v3-t35-h2-h5-host-probe-boundary.md)
[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-acceptance-r5.md)
