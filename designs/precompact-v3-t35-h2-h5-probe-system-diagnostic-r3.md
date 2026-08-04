---
type: Design
title: T3.5 H2-H5 probe whole-system diagnostic through R5
description: >-
  Whole-system model with cooperative one-shot evidence admission and explicit
  non-cryptographic threat boundary.
actor: codex-t35-option1-orchestrator
timestamp: '2026-08-04T18:41:09.818Z'
---
# Whole-system diagnostic

Revision-3 T3.5 has an accepted T0-T4 compaction-handoff implementation and an unimplemented candidate/live-acceptance layer. The current R6 unit does not implement product policy; it gathers four pinned-host facts (H2-H5) for a later replacement Plan while binding audited v5 H1/no-autostart provenance. Its safety requirement is stricter than an ordinary test: every possible creator must have a containment owner before it can create a process/socket, primary facts must be independent of action results and fallback cleanup, and the run must leave protected user state and the exact feature worktree unchanged.

## Components and interactions

1. **Immutable prerequisites:** the selected v5 source/evidence/audit, pinned tmux binary/manpage, exact Node/ps/Git tools, exact protected-path policy, and exact feature worktree identity.
2. **In-process controller:** preregisters resources, writes the retained manifest/events, owns direct handles, seals H2 observation plans, controls abort/action fences, and computes the closed verdict.
3. **Preflight observers:** an in-process protected-tree walker plus spawned pinned-Git helpers establish whether observing the worktree itself causes drift. They are evidence-producing principals but never probe/action principals.
4. **Probe principals:** two foreground server gates, fixture/requester/kill clients carrying top-level `-N`, two harmless panes, and two pane-requested but controller-spawned direct marked companions.
5. **Pure H2 observer:** a separate stdin/stdout-only child classifies presealed raw post-action facts before the controller parses the withheld action result.
6. **Teardown/continuity:** abort latch closes creators; the final server action precedes the terminal action fence; bounded passive inventories, socket disposition, protected snapshots, and worktree re-observation prove terminal continuity.

## Timing and ordering dependencies

The accepted order must be explicit:

1. verify immutable source/tool identities in process;
2. take protected snapshot `P0` without spawning;
3. run only preregistered preflight Git helpers, each with exact direct-handle close/EOF/absence and index-before/index-after guards;
4. take protected snapshot `P1` in process and require `P0 == P1`, exact clean worktree receipts, and no Git-index drift;
5. freeze `P1` plus the Git receipts as baseline `B0`;
6. only then spawn any server, client, pane, companion, H2 observer, or ordinary observation helper;
7. execute H2/H3, server-first H4-A, abort latch, descendant-first H4-B, final server action, and action fence in that order;
8. after the action fence, use passive bounded observers only and compare protected/worktree terminal state to `B0`.

Preflight helpers are inside the run/evidence/containment envelope but outside the probe-primary phase. Their potential mutation is measured by the P0/P1 sandwich and cannot be hidden inside the accepted baseline.

## Cross-attempt governance and evidence admission

Same-attempt P0/P1 equality is insufficient if a failed helper mutation can become the next attempt's P0. Under the cooperative orchestration threat model, the accepted workflow is therefore a one-shot campaign, not a retry loop:

1. after exact script dual PASS, the orchestrator creates one bundle Task/admission record binding the exact boundary, script/contract hashes, 128-bit campaign id, exact initially absent run root, and attempt ordinal 1;
2. a compliant runner atomically claims that Task before invoking the script and supplies an immutable exported admission file whose digest is retained by the run manifest;
3. any invocation outcome consumes the admission; the task becomes terminal and the exact root/evidence remains retained;
4. before the first preflight-helper spawn, missing/unsafe immutable input is BLOCKED; once any Git helper spawns, helper error, survivor, unexpected child, index drift, P0/P1 inequality, or protected/worktree drift is terminal FAIL plus containment;
5. neither BLOCKED nor FAIL may be retried under the same admission or a fresh random root by a conforming orchestrator;
6. a later execution admission requires a separate durable rebaseline Decision. If any helper/protected/worktree drift occurred, that Decision must either prove current protected/worktree state equals the retained failed-attempt P0 or record actual live user direction approving a different baseline. Automatic restoration and silent rebaseline are forbidden.

The script does not write the bundle. It validates and binds the exported admission bytes for lineage, while the orchestration Task/Decision and independent evidence audit govern which run may advance. This is cooperative coordination and evidence admission, not a cryptographic launcher or claim that arbitrary local execution is impossible.

## Threat model and explicit nonclaims

In scope: accidental concurrent claims, stale/mismatched exports, duplicate/replayed conforming invocations, process crashes, observer mutation, retry pressure, evidence substitution, and a compliant agent mistakenly attempting to advance without the required durable gate. The bundle CAS plus exact auditor linkage close those workflow failures.

Out of scope: a malicious or compromised same-UID user/agent forging bundle documents/actor labels/admission JSON, bypassing the runner, or directly invoking tmux/Node. The same local principal can already execute the pinned tools and mutate its own files; neither a digest nor this bundle is a security boundary against it. R5 makes no claim of a trusted launcher, authenticated actor, signature/MAC, nonforgeable capability, or cryptographically authenticated human approval.

“Human approval” is a governance predicate: a compliant orchestrator may record a changed-baseline Decision only in response to actual live user direction and must cite that direction in the handoff. A bundle actor label alone never satisfies it. Cryptographic user-origin verification would require a separately scoped security system and is not inferred here.

## External state and invariants

- Real home is read only and used only for the enumerated metadata/digest snapshots; child HOME/config/cache roots are relocated and auth-free.
- Feature authority is canonical `/private/tmp/aslite-precompact-v3.RLDTIZ/repo` at clean `36c741a8173832d75d61a7ab138b5219c4415c66` on `feat/precompact-handoff-v3`.
- The run may mutate only one initially absent private `/private/tmp` leaf and its named processes/sockets.
- Top-level `tmux -N` is an explicitly reviewed pinned-binary architecture premise, not fresh empirical proof for every vector.
- Every probe creator has a direct controller handle before release; the pane cannot create the marked companion.
- H2 plans/dataflow are sealed before action and action bytes remain opaque until the pure observer returns.
- `abort-latch` forbids new creators; `action-fence` forbids every later tmux process. They are different transitions.
- Cleanup can make a failed run safe but can never promote a failed/ambiguous primary fact.
- Any survivor, observer error, socket generation drift, protected/worktree drift, missing receipt, or stronger claim is FAIL; pre-spawn prerequisite failure is BLOCKED.
- Every execution admission is one-shot. After a preflight helper has spawned, no outcome is BLOCKED and no later attempt may adopt a new P0 without the durable rebaseline rule above.
- Admission governs acceptance under cooperative orchestration; it does not physically prevent a malicious same-UID caller from running the script or tools.

## Failure history and current model update

- R1 failed because one fence had two incompatible meanings, sampled liveness was mistaken for causal liveness, H2 dataflow was undersealed, the detacher lacked a pre-existing owner, and continuity scope was implicit.
- R2 repaired those system-model defects. Product/acceptance passed it. The skeptic found one remaining ordering contradiction: a Git-backed baseline cannot be complete before the first process spawn if Git itself is a spawned helper.
- The updated model distinguishes **preflight observation principals** from **probe principals** and sandwiches the former between P0/P1. This is the only R3 architecture change. All R2 accepted scope judgments and nonclaims remain unchanged.
- R3's same-attempt sandwich passed skeptic review, but acceptance found that its BLOCKED classification permitted helper-caused drift to become a later attempt's baseline. R4 adds the one-shot execution authorization and rebaseline Decision boundary; it does not change H2-H5 mechanics.
- R4's one-shot mechanics passed acceptance, but the skeptic correctly rejected calling self-digested local metadata a nonforgeable execution authority. R5 narrows the claim to cooperative governance/evidence admission under the already accepted non-malicious same-UID model; cryptographic launch/approval enforcement is an explicit separate security architecture.

## Assumptions still requiring byte-level verification

The future builder must demonstrate exact Git binary/digest/vector pinning, P0/P1 canonical equality, index guards, preflight-helper preregistration and reaping, absence of any other pre-baseline spawn, no code path that treats P1 as valid when P0/P1 or index equality fails, exact admission-file lineage validation, and one-shot campaign/root binding. Those are implementation checks after the R5 boundary is dual-approved; execution is not allowed to resolve them.

# Goals

Ultimate goal: agentstate-lite is durable, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: close the preflight observer-causality gap without reopening the accepted H2-H5 architecture; this serves the ultimate goal by ensuring the baseline itself cannot hide state mutation caused by its observer.

[tracked by](../tasks/pre-compact-multi-session.md)
