---
type: Context Note
title: Revision 5 T3.5 H2-H5 boundary skeptic review R5
actor: codex-t35-r5-skeptic
timestamp: '2026-08-04T18:47:38.780Z'
---
# Summary

Status: **complete**.

Verdict: **PASS**.

Confidence: **0.97**.

`builder_task_eligible: true`

R5 makes the necessary model correction instead of pretending local same-UID metadata is a security boundary. It explicitly limits admission, CAS, lineage, and rebaseline records to cooperative orchestration and evidence admission; it disclaims a trusted launcher, authenticated actors, cryptographic human approval, and physical prevention of arbitrary local execution. Under that stated threat model, the R4 forged-authorization and forged-human-approval traces are no longer counterexamples to a claim R5 makes.

I found no load-bearing scoped counterexample. The exact-root acquisition, one-shot Task consumption, independent admission-lineage audit, terminal post-helper FAIL rule, retained P0, and reviewed rebaseline Decision close accidental/conforming-workflow replay and baseline adoption. Accepted R2-R4 H2-H5 mechanics remain intact. This PASS authorizes only clean-room static script construction followed by fresh exact-byte dual review; it does not authorize execution, evidence acceptance, Plan synthesis, or product/feature mutation.

# Exact reviewed inputs

- Task creation and claim input: `tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r5@sha256:6291f00bc2b3d8f5dcb073f97236d31e594f683e164415827e04b1c045618f37`; exact CAS claim by `codex-t35-r5-skeptic` produced `sha256:1a770bf6b3de07598247022a63086b328a3a7b7a4f2d8cdb1fae27d74b6501c0`.
- R5 boundary: `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:33db32b3d9088052481301ee5829170c0ddee4f333eabf6b06907818bc951852`.
- R5 whole-system diagnostic/threat model: `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:2bcba5fdbf2b8b5b775ce4d0143b0d37265e2653910c28f789fe73cad5b8583c`.
- R4 acceptance PASS: `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4@sha256:85cce4a5b61f15713f5ea8a95e481e084cd99729a75ef5abee07ea212fe69023`.
- R4 skeptic FAIL: `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4@sha256:ac378402e60ad29f377aecbca0345f5c61a85a0f7c798601d2bea94c51a55cfd`.
- Decision/v5 and all earlier accepted source, evidence, audit, Git, tmux, manpage, protected-scope, and worktree inputs are inherited exactly as pinned by R5.

# Isolation

This was a fresh isolated static adversarial review. No current R5 acceptance output existed, and I did not coordinate conclusions with an acceptance reviewer. I did not execute tmux, a Git helper, the host probe, Claude/API/auth/network actions, or tests; inspect live processes; modify feature code, a Plan, a parent task, or a shared handoff; or sync the bundle. Mutations are limited to the exact CAS claim, this uniquely owned Context Note, and my terminal update to the owned review Task.

# System and threat-model judgment

The probe has three distinct forms of authority, and R5 now labels them accurately:

1. The script owns process containment and evidence causality inside one admitted run: preregistered direct handles, P0/Git/P1, H2 result opacity, H4 ordering, fences, and terminal continuity.
2. The bundle Task/Decision plus exported lineage govern which result a conforming multi-agent workflow may submit and which exact campaign an independent auditor may admit.
3. The operating-system user remains able to run or forge local files and tools. R5 does not claim the bundle or digest revokes that ambient same-UID power.

That boundary is materially compatible with the product need here. This is a no-auth, local, fact-gathering probe for later Plan synthesis, not a hostile-code sandbox or privilege-separation system. A malicious or compromised same-UID principal can already mutate the workspace, bundle, evidence, and protected files and invoke Node/tmux directly; adding self-signed local metadata would not change that. Requiring a separate authenticated launcher/security principal would be appropriate only if hostile same-UID behavior becomes a product requirement. It is not necessary to make cooperative agent mistakes fail closed.

The narrowing is also stated consistently. Terms such as “execution gate,” “admission,” “only after dual PASS,” and “one-shot” are explicitly governance predicates for conforming runners/auditors, not physical-execution claims. R5 repeatedly disclaims authenticated provenance and direct-execution prevention, and it forbids treating an actor label as human approval.

# Adversarial traces

## Forged admission or direct local invocation — outside the claim, honestly disclosed

A same-UID caller can still manufacture self-consistent JSON or bypass the runner. R5 says exactly that and does not describe digest validation as origin authentication. The resulting bytes may execute if the caller directly invokes them, but they cannot advance the conforming workflow because the independent auditor requires the exact claimed admission lineage. This is a residual security nonclaim, not a falsification of cooperative evidence admission.

## Accidental stale or mismatched export — survived

The exact admission binds the reviewed boundary/script/contract, campaign, ordinal, root, actor, and prior-attempt lineage. The script binds those immutable bytes/digest into the first create-only root record. A mismatched export cannot satisfy the script's exact lineage check; an unclaimed or wrong Task/campaign/root cannot satisfy independent audit. Structural JSON validity alone is expressly insufficient.

At byte review, “exact claimed admission lineage” must be implemented literally: the durable evidence must retain the Task id, preclaim/claimed CAS versions or equivalent claim receipt, export digest, and terminal-consumption receipt. A builder that checks only final Task shape or self-consistent JSON fails R5. This is a mechanism check under an already closed governance rule, not permission for the builder to choose a stronger authority claim.

## Concurrent claim and duplicate invocation — survived

CAS permits only one conforming claim. The admission binds one unpredictable initially absent root, and create-only root acquisition lets only one same-export invocation enter preflight. Every outcome consumes the admission; a second conforming invocation encounters the retained root and cannot spawn a helper. A different campaign/root requires a different reviewed admission and is not evidence for the first campaign.

## Runner or script crash — fail-safe, with a liveness residual

Once claimed, the admission cannot be reused. If the root exists, its retained first record/evidence identifies the attempt; if a crash occurs before root creation, the claimed admission is still consumed and may not be retried. The independent auditor cannot advance an incomplete or nonterminal lineage. This can leave orchestration requiring a recovery finalizer to move a claimed Task to its terminal failure state, but it cannot promote incomplete evidence or authorize automatic retry.

The exact runner/auditor design must therefore retain claim and terminalization receipts and specify idempotent crash recovery. That is a required byte/orchestration review item. It is a liveness risk, not a surviving unsafe-acceptance trace under R5's rule that every outcome consumes the admission and no incomplete lineage advances.

## Post-helper failure relabeled BLOCKED — survived

`BLOCKED_PENDING_VERIFICATION` ends before the first Git-helper spawn. From that spawn onward, helper error, timeout, survivor, unexpected child, incomplete close/EOF/absence, index drift, P0/P1 inequality, protected/worktree drift, dirty or malformed receipt, and every later ambiguity are terminal FAIL plus containment. The retained failure evidence includes original P0, admission digest, helper manifest, completed receipts, P1 when available, and a final continuity attempt. A conforming implementation cannot use BLOCKED to retry after observer contact.

## Helper mutation adopted by a later attempt — survived

The failed root and original P0 remain retained; restoration cannot promote the attempt. Another admission requires a separate durable rebaseline Decision and fresh exact-review dependency. If drift occurred or cannot be disproved, an independent verifier must prove current state canonically equals retained P0 or the compliant orchestrator must receive actual live user direction approving a different baseline. Automatic restoration, random-root retry, silent P0 replacement, and agent-only changed-state approval are forbidden.

## Agent-only “human approval” — survived within the declared model

R5 defines human approval as live user direction observed by a compliant orchestrator, requires that direction to be recorded in the handoff, and explicitly says an actor label alone never satisfies the predicate. A compliant agent cannot substitute its own Decision or an advisory actor string. A malicious same-UID forgery remains possible but is expressly outside scope and is not represented as authenticated provenance.

## Unapproved later ordinal accepted by auditor — survived

The auditor must reject every ordinal/root/campaign outside the exact claimed lineage. A later ordinal additionally depends on the exact reviewed rebaseline Decision tied to the failed attempt and its retained P0. Missing Decision, missing equality proof/live direction, or merely agent-authored actor metadata cannot advance under the conforming audit contract.

# Regression review of accepted mechanics

- **Pinned top-level `-N` premise and disappearance race:** unchanged. Every client vector retains top-level `-N`, exact-live sampled preconditions, and FAIL-on-disappearance without fallback or fresh absent-target probing.
- **H2 noninterference:** unchanged. Plans are sealed before action; action status/output remains opaque until the pure stdin/stdout observer returns; scheduling and observer input cannot depend on the action result.
- **H3 identities:** unchanged. Requesters are distinct, simultaneous direct gate-closed principals; B releases only after A's handle, streams, identity, and group are terminal.
- **H4 scope and ownership:** unchanged. The pane cannot spawn. Only the controller creates the direct marked companion and holds its handle before self-record validation. H4 remains limited to that declared controller-owned topology.
- **Abort and action fences:** unchanged. The abort latch rejects new creators before descendant drain; server-B kill is the sole final tmux action; the terminal action fence exists only after kill-control and server absence.
- **P0/Git/P1 causality:** unchanged. No child exists before P0; only preregistered sequential Git helpers run before P1; every helper has close/EOF/group-absence and index guards; `P0 == P1` plus clean receipts is the only route to baseline freeze.
- **Protected scope and provenance:** unchanged. Exact bounded physical snapshots, npm metadata-only nonclaim, pinned clean worktree, raw evidence, and no restoration remain mandatory.
- **H5 and line/principal bounds:** unchanged. H5 is passive after the action fence, and the finite named-principal model plus 800-line fail-closed cap remains intact.

# Residual risks and next gate

The following are deliberately not closed by boundary R5 and must not be overstated later:

- malicious or compromised same-UID forgery/bypass is not prevented;
- live user direction is a cooperative governance fact, not cryptographically authenticated identity;
- PID/start/group identity and absence are sampled, not pidfd-like atomic authority;
- H4 applies only to controller-created marked companions, not arbitrary or pane-owned descendants;
- E1 H1/no-autostart remains a reviewed exact-binary premise with its retained audit limitations, not new exhaustive empirical proof;
- crash terminalization may require an idempotent runner/auditor recovery path, and local Task state alone must not substitute for retained exact claim/terminal receipts.

The next eligible step is a clean-room builder that authors but does not execute one immutable script under exact R5. Separate product/acceptance and skeptic reviewers must both PASS those exact bytes. Any omission of durable claim lineage, terminal receipt handling, P0/Git/P1 parity, H2 opacity, direct-handle containment, or fence ordering is script FAIL. No execution is authorized by this boundary review.

[reviews](../designs/precompact-v3-t35-h2-h5-host-probe-boundary.md)

[tracked by](../tasks/precompact-v3-t35-h2-h5-boundary-skeptic-r5.md)
