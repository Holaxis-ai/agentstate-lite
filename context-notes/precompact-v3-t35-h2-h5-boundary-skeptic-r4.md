---
type: Context Note
title: Revision 4 T3.5 H2-H5 boundary skeptic review R4
actor: codex-t35-h2-h5-skeptic-r4
timestamp: '2026-08-04T18:39:01.146Z'
---
# Summary

Status: **complete**.

Verdict: **FAIL**.

Confidence: **0.99**.

`builder_task_eligible: false`

R4 correctly repairs the R3 cross-attempt baseline bug: after the first Git helper, every defect is terminal FAIL; the original P0 is retained; the authorization is consumed; and no later attempt may adopt drift without an explicit rebaseline gate. It also preserves the accepted R2/R3 same-attempt mechanics.

The new execution authorization is not yet an authority, however. The script can validate only that an exported JSON file is internally well formed and matches its supplied digest. The boundary provides no exact trusted launcher, signature/MAC, authenticated principal, task-version proof, or nonforgeable one-time capability that lets the script distinguish the exported bytes created after the authorized Task CAS from independently created bytes with the same schema. The evidence auditor can reject such a run afterward, but it cannot prevent or undo the host execution. The same missing provenance predicate leaves “human-approved rebaseline” indistinguishable from an agent-authored Decision in the local bundle, whose actor label is advisory. Those are load-bearing authority gaps, not builder-byte details.

# Exact reviewed inputs

- Task claim input: `tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:4f68781cf39e148c2a86f04255ed6ed216029a2941981e4ed1f8b317e35252f4`; claimed by exact CAS as `codex-t35-h2-h5-skeptic-r4`, producing `sha256:789423fa7df4119823edb5bf915e99ec12e72b9c03ab27cae6c21cd7e017bd08`.
- R4 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:d81f773963d65a415f3ddc6bf32caaf86e566927f14dccf61b8015122ea582f4`.
- Updated whole-system diagnostic: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:d854a7c2b77d12afdbe477a893fa7a7bf5263f6a654afed07c977996c54d252a`.
- R3 skeptic PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`.
- R3 acceptance FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`.
- Inherited decision/v5 and earlier accepted source, evidence, audit, Git, tmux, and manpage inputs are exactly those named by R4.

# Isolation

This was a fresh independent static falsification review. I did not inspect or communicate with the current R4 acceptance reviewer, execute the host probe, use tmux or Git helpers, inspect live processes, use Claude/auth/network actions, run tests, modify repository code, modify a Plan/parent task/shared handoff, or sync. The only mutations are my exact CAS task claim, this uniquely owned review note, and my terminal task update.

# Whole-system model at the fourth boundary revision

The system has four authority layers that must compose in order:

1. The bundle layer records an authorization Task, its exact reviewed boundary/script/contract inputs, campaign, root, ordinal, actor, claim transition, and terminal outcome.
2. The execution layer receives immutable exported authorization bytes, creates the exact initially absent 0700 root, records the authorization digest, captures P0, runs only preregistered Git helpers, freezes equal P1, and then performs the bounded probe.
3. The containment/evidence layer classifies every post-helper defect as terminal FAIL, retains P0 and receipts, and prevents the failed attempt from redefining its own baseline.
4. The later-attempt/audit layer accepts another ordinal only after a durable rebaseline Decision proves equality to the failed P0 or carries genuine human approval for a different baseline.

The ordering invariant is: exact reviews PASS -> one genuine authorization is created -> that exact Task is atomically claimed -> that claim authorizes exactly one root/process invocation -> every outcome consumes it -> a later authorization requires independently verifiable rebaseline authority. R4 specifies the data on both sides of the Task/export boundary, but not a trusted causal or cryptographic link across it. That missing link is the diagnostic finding.

# Adversarial traces

## Same authorization and same root replay — survived

The legitimate immutable authorization binds one exact initially absent run root. Create-only root acquisition lets at most one same-record invocation proceed; a second invocation finds the root present before any helper. Consumption and terminalization forbid retry. This closes ordinary same-file replay when callers honor the Task/export protocol.

## Same authorization with a different root — survived

The exact root is inside the immutable exported authorization. Changing only the invocation root fails the script's equality checks; changing the file changes its digest and is no longer the claimed authorization. The evidence auditor also rejects a different root/campaign tuple.

## Forged/new authorization bytes — **load-bearing failure**

A caller can copy the public boundary/script/contract digests, choose a fresh campaign and absent 0700 root, set ordinal 1 and `prior_attempt:none`, serialize the required JSON, compute its digest, and invoke the script with those mutually matching values. Every predicate available to the script passes because the script is expressly forbidden to read the bundle and R4 supplies no signature, MAC, authenticated Task receipt, pinned claimed Task version, trusted inherited channel, or exact launcher that attests provenance.

The script can therefore execute helpers and the probe even though no authorized Task was created or claimed. A later evidence auditor may reject the run as evidence, but execution has already occurred and the one-shot host-safety property has already failed. Digest validation proves byte identity, not authority or origin.

This cannot be repaired in builder bytes under the present boundary: the script has no trusted fact against which to compare the self-declared authorization. It requires an authority-bearing execution gate or an explicit weaker claim that the mechanism is post hoc evidence admission only.

## Task-claim race — partially survived, but exposes the same missing coupling

CAS permits only one actor to change the genuine Task from available to claimed. The exact-root create prevents two processes holding the same genuine export from both proceeding. But the CAS result is not causally bound to the process spawn: no claimed Task id/version or unforgeable claim receipt is mandatory input to an exact reviewed launcher, and the script cannot verify current claimed state. Thus CAS closes a race within the cooperative protocol, while a caller that bypasses that protocol remains executable via the forged-byte trace.

## Post-helper BLOCKED relabeling and missing P0 — survived

R4 makes the first Git-helper spawn the irreversible classification boundary. Helper error, timeout, survivor, unexpected child, incomplete close/EOF/absence, index drift, P0/P1 inequality, protected drift, dirty/malformed receipt, or later defect is terminal FAIL plus containment. Git helpers cannot begin until P0 is durably written and read back, and the failure record retains original P0 plus authorization/helper/receipt/P1/continuity evidence as available. A conforming controller cannot use BLOCKED after helper contact or omit P0 from a post-helper failure.

## Automatic retry and drifted-state adoption — survived for genuine authorization

Any outcome consumes the authorization and terminalizes its Task; the retained root prevents same-root reuse. A later run requires a new durable rebaseline Decision and a new exact-review dependency. Without drift, the Decision cites equality evidence and a new prerequisite. With drift or unresolved equality, an independent verifier must prove current state equal to retained failed P0 or a human must approve a different baseline. R4 forbids automatic restore/retry, silent new P0 adoption, and agent-only changed-state approval as policy.

## Agent-only rebaseline and unapproved ordinal — **load-bearing failure**

The policy says “human explicitly approves,” but it does not define an authority-bearing receipt or validation predicate for that fact. In the local bundle, an agent can create a structurally valid Decision and new authorization Task and choose an actor label that appears human; the actor label is advisory, not an authenticated principal. The auditor is told to require the exact claimed authorization and reject an unapproved ordinal/root/campaign, but is not given an exact user-origin artifact, authenticated identity, or signature to distinguish genuine human approval from agent-authored metadata.

Consequently, an agent-only changed-baseline Decision can satisfy the specified document shape, and an ordinal based on it can appear approved to the auditor. Even if the auditor consults out-of-band conversation by convention, that authority and exact matching rule are absent from the boundary. This is a missing authority contract, not a script formatting check.

# Regression attacks on accepted R2/R3

- **Top-level `-N` and disappearing target:** preserved. Exact hashed tmux behavior, closed client vectors, exact-live preconditions, failure-on-disappearance, and no recovery/default/fourth-family action remain unchanged.
- **H2 noninterference:** preserved. Sealed plans, result opacity until the stdin-only observer returns, and result-independent scheduling/input remain mandatory.
- **Controller-owned H4 scope:** preserved. The pane cannot spawn; only the controller may create and own the direct marked companion, and the nonclaim remains narrow.
- **Two fences, generation, and provenance:** preserved. Abort-latch ordering, server-B sole final tmux action, terminal action fence, passive H5, generation nonadoption, and primary-evidence latching remain intact.
- **P0/Git/P1 and protected scope:** preserved and strengthened across attempts. One exact snapshot authority surrounds the preregistered Git helpers; per-helper index guards and P0/P1 equality prevent helper-induced drift from entering the baseline.
- **Line/principal bounds:** preserved. R4 adds orchestration records rather than an unbounded runtime principal family; the 800-line fail-closed script cap remains.

# Required repair and next gate

Before static builder eligibility can be reconsidered, R4 needs an exact authority bridge, reviewed as part of the boundary:

1. Define a trusted execution-gate/launcher artifact that atomically CAS-claims the exact authorization Task, binds the resulting Task id and claimed version to the immutable export, and is the sole path that can spawn the script. If unauthorized same-user callers are in threat scope, the gate must additionally hold a nonforgeable capability or authenticated signature that those callers cannot mint; filesystem mode and a self-computed digest are insufficient.
2. Define how the script receives and validates the gate's attestation without accepting caller-supplied matching bytes as their own authority. If this cannot be enforced, narrow the claim to evidence admissibility and do not call it execution authorization.
3. Require every changed-baseline Decision to cite an exact, authenticated user-origin approval receipt (or an equivalently trusted principal/signature), and make the independent auditor validate that receipt, failed-P0 lineage, ordinal, campaign, root, and claimed Task version.
4. Specify terminalization ownership and crash/race behavior for the exact launcher so one CAS claim cannot yield multiple process spawns or contradictory outcomes.

After that repair, both independent boundary reviews must run again. Until then, no clean-room static script builder task is eligible and no execution is authorized.

[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r4.md)
