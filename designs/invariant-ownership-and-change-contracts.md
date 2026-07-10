---
type: Design
title: Invariant ownership and change contracts
description: >-
  Design review and minimal buildlist for assigning each load-bearing invariant
  one authority, its consumers, and an executable fire moment.
actor: openai/codex
timestamp: '2026-07-10T02:29:40.687Z'
---
# Invariant ownership and change contracts

**Status:** Proposed for founder review. This is a design recommendation, not a ratified framework or an instruction to pause current product work.

## Conclusion

The codebase is not uniformly poor. Its strongest areas already have clear authorities: core owns OKF parsing and graph semantics, storage sits behind one backend seam, and CLI command descriptions have a generator source. The recurring serious review findings occur where one product promise crosses code, generated artifacts, prose, board state, and runtime modes without one named owner and one executable moment that proves the promise still holds.

The proposed rule is deliberately small:

> Every load-bearing invariant has one authority, an enumerated set of consumers, and an operational gate that fires when the authority or a consumer changes.

An authority is the place where the rule is defined. A consumer may expose or transport it, but must not independently reinterpret it. An operational gate is a test or workflow that runs at the moment the invariant is at risk; prose saying that a check should happen is not itself a gate.

This proposal complements the scope discipline in [docs/core](../docs/core.md), the implementation-duplication work in [coherence drift](../tasks/coherence-drift.md), and the event design in [real-time event backbone](../research/real-time-event-backbone.md).

## Why this review is warranted

Three recent review classes point to the same systems problem:

1. A mutation made a decision from a read that was not coupled to its compare-and-swap write. The local code looked reasonable, but the concurrency invariant lived partly in the caller and partly in the storage seam.
2. The real-time UI path accumulated security, reconnect, snapshot, and staleness concerns across the server shell, iframe bridge, event stream, and client cache. Each component could pass its own tests while the end-to-end session contract remained vulnerable.
3. Board migration and first-contact guidance changed in different surfaces at different times. A fixture could prove a parser contract while being described as proof of live-board parity, and generated skills, README guidance, workspace instructions, and actual git topology could disagree.

These are seam failures. They are made more likely by a fast-moving, multi-agent workflow because agents naturally optimize the files placed in their immediate context. Comments help, but comments are not an executable ownership model.

## Non-goals

- Do not introduce a new invariant database, document kind, or policy engine.
- Do not rewrite core or remove useful local, git, remote, or UI modes.
- Do not generate every piece of prose from code.
- Do not make every pull request run every backend and distribution path.
- Do not event-source the whole application.
- Do not resume paused UI views or frozen hosted collaboration scope through this design.

## Invariant ownership map

| Invariant family | Authority | Consumers | Gate that must fire | Present gap |
| --- | --- | --- | --- | --- |
| Document and graph semantics | Core parser, link resolver, kind registry, and graph operations | CLI, reference server, worker adapter, viewer/UI | Primitive contract tests over filesystem and memory backends; consumer tests use core rather than reimplement semantics | Some callers still reason about link identity or document shape outside the authoritative operation |
| Mutation safety and concurrency | Versioned engine mutation boundary: versioned read, decision, CAS write, bounded retry | `doc write/update`, `link add`, recipes, reserved-file writers, promote/pull paths | Deterministic concurrent-writer test for every read-dependent guard; conflicts must retry or fail without overwriting | Retry and guard logic is distributed; a guard can be correct in isolation but stale by write time |
| Product truth and discovery | `docs/core` for scope; command reference source for CLI behavior; board tasks for live unit state; actual git topology for board setup | README, workspace agent guidance, generated skills, help, PR descriptions | Generated drift checks plus a clean-clone first-contact journey whenever setup or topology changes | Manual copies can remain internally plausible while contradicting the current product |
| Recipes and conventions | One explicitly chosen canonical source for each convention: shipped recipe contract or bundle-owned convention | Built-in recipe, live project board, fixtures, kind-aware UI | Hermetic recipe contract test; separate board-branch workflow test only when live parity is an actual promise | A code fixture can be mistaken for evidence that the mutable live board is in parity |
| Runtime freshness and events | One freshness primitive per tier: git sync cursor for board sharing, ordered recoverable event cursor for remote/live use, coarse invalidation for direct filesystem changes | UI query cache, session-start, awareness, future notifications/pages | Cursor replay, reconnect, snapshot-plus-cursor race, and no-overlapping-refresh tests | Polling, snapshot diffing, reconnect, and cache invalidation can be independently rebuilt by each consumer |
| Distribution and exposed surface | Declared product scope plus build/command registry | CLI bundle, plugin bundle and skill, npm artifact, private hosted adapter | Artifact inspection and smoke tests prove what is included and surfaced; private hosted compatibility is checked separately | Dormant hosted control-plane code and generated copies can remain coupled to the default surface |

## Minimal change contract

Add a short section to the pull-request template with four prompts:

- Which invariant families does this change touch?
- What file or primitive is the authority for each?
- Which consumers can drift?
- Which targeted gates were executed or added?

This is not an approval checklist for every file. Most pull requests should name one family and one or two gates. If a change cannot identify the authority, that is design feedback before implementation. If it introduces a new consumer, its test must prove conformance to the authority rather than restating the rule in the consumer.

The durable ownership map should ultimately be a compact repository-tracked engineering document, because reviewers and CI need it in the same revision as the code. This board document is the proposal and decision record; it should not become a second implementation manual.

## Buildlist

### 1. Close the currently observed truth gap

Finish the board-migration first-contact and parity work already tracked in [board parity test post migration](../tasks/board-parity-test-post-migration.md). Test from a clean clone with no local board worktree or cache. The expected journey is that discovery directs the agent to `sync`, not `init`, and the resulting board passes the declared convention check.

Operational moment: pull-request CI for any setup, migration, recipe, generated-skill, or first-contact guidance change.

### 2. Add one repository ownership map and the PR prompts

After founder approval, add a small `INVARIANTS.md` (name is negotiable) containing only the ratified table above, with links to authority files and test commands. Add the four prompts to the pull-request template. Do not create an `Invariant` kind or mirror the table into workspace instructions.

Operational moment: independent review begins by checking the declared families against the diff.

### 3. Consolidate read-dependent mutations

Route document mutations whose validity depends on current state through one versioned mutation helper. Make the helper own reread, decision, CAS, retry limit, and typed conflict outcome. Keep specialized domain decisions in callbacks; do not create a second engine.

Operational moment: any new read-decision-write flow must include a deterministic intervening-writer test in the same unit.

### 4. Make parity claims precise

Decide whether a built-in convention is code-owned or board-owned:

- If code-owned, the recipe fixture is canonical and the board is an applied instance that may intentionally diverge.
- If board-owned, CI must check the actual board branch in an isolated checkout and report drift.

Do not use a committed snapshot of the board as evidence of current board parity unless the workflow also proves the snapshot's provenance and freshness.

Operational moment: recipe/convention changes and board migration changes.

### 5. Ratify the event backbone before adding more live consumers

Adopt the proposal in [real-time event backbone](../research/real-time-event-backbone.md) as the remote/live freshness authority before notifications, collaborative cursors, or more generative UI consumers are added. The UI may still apply snapshots, but it should not invent its own durable ordering, replay, or reconnect semantics.

Operational moment: a reconnect test starts from a saved cursor, crosses a disconnect and concurrent writes, then proves ordered catch-up or an explicit full refresh.

### 6. Remove hosted control-plane code from the default surface without deleting it

Keep the private Cloudflare worker and deployment compatibility in the repository, but make the build graph and help surface prove it is not part of the default CLI/plugin artifact. Test the hosted adapter independently against the same protocol contract. This preserves optionality without making dormant hosted operations a default product promise.

Operational moment: CLI bundle inspection on distribution changes; private worker compatibility on worker/protocol changes.

## Operational fire moments

| When this changes | The required proof fires |
| --- | --- |
| Parser, graph, or kind behavior | Core primitive and dual-backend contract tests |
| A guard depends on current document state | Deterministic concurrent-writer test at the mutation boundary |
| Setup, migration, board topology, or onboarding prose | Clean-clone first-contact journey |
| Command reference or generated distribution content | Generator drift check and packed-artifact smoke test |
| Recipe or convention ownership | Hermetic recipe test; live board check only if parity is promised |
| Reconnect, event ordering, or cache invalidation | Cursor replay and snapshot race test |
| Default versus hosted product surface | Bundle/help inspection plus separate protocol compatibility test |

## Stopping rule

Stop after the ownership map, PR prompts, and targeted gates cover the three recurring failure classes: truth drift, stale-state mutation, and real-time recovery. Do not generalize this into a universal governance layer unless a fourth recurring invariant class survives the same review process.

Success means agents can answer “what owns this rule, who consumes it, and what proves it?” from one repository map, and CI fires the relevant proof at the moment a change puts the rule at risk.

## Founder decisions requested

1. Is each shipped convention code-owned or live-board-owned? If neither is canonical, remove parity language.
2. Should the ordered, recoverable event backbone be ratified as the remote/live freshness primitive?
3. Should the Cloudflare worker remain a private compatibility target while its control plane is removed from the default CLI/plugin surface?
4. Is a single repository `INVARIANTS.md` plus four PR prompts the right amount of explicit coordination, or is even that too heavy?

