---
type: Plan
title: Canonical Page live-refresh helper
actor: openai/codex
timestamp: '2026-07-12T03:09:30.067Z'
---
# Canonical Page live-refresh helper

Status: independently reviewed and implemented at `c8c6b197ff09ebb351210cb3c35c05d1f27ae00a`; draft PR #41 awaits merge.

## Decision

Add one optional method to the copyable protocol-v0 Page client:

```js
Bridge.watch(async function (events) {
  const result = await Bridge.query({ type: "Task" });
  render(result.rows);
});
```

`watch` owns live-refresh scheduling only. It does not own queries, rendering, application state, DOM safety, error UI, the wire protocol, or the shell.

## Contract

- `watch(refresh)` immediately registers a normal subscription callback and sends `subscribe`.
- It never calls `refresh` until the subscription acknowledgement succeeds.
- Its first call performs the full snapshot refresh. `events` is `[]` unless change events were buffered before acknowledgement.
- Refresh calls never overlap.
- Events arriving while a refresh is running are queued in arrival order and delivered together to exactly one follow-up call.
- Events arriving during that follow-up form the next batch. The helper does not drop event payloads or reinterpret them.
- A refresh rejection consumes only that call's batch and releases the scheduler. If events were queued while the rejected refresh ran, their follow-up batch starts automatically; later events also refresh. No rejection permanently poisons the watcher and no queued batch is discarded because the prior call failed.
- There is no automatic timer retry or infinite retry loop. A later refresh is driven only by queued/later change events.
- The returned Promise represents subscription plus the first refresh and adopts that first refresh's resolution value or rejection. Later refresh failures cannot alter an already-settled Promise; they are caught and reported with `console.error` while the watcher remains usable.
- A subscription failure rejects the returned Promise, permanently deactivates that watcher's registered callback, and no refresh runs. Raw `subscribe` has no unsubscribe, so `watch` owns an internal active flag: a callback left in the shared callback array after failure must remain inert even if another watcher later subscribes successfully and activates shell change delivery.
- Invalid/non-function `refresh` is rejected clearly before a request is sent.
- Multiple `watch` calls are permitted and independent: each owns its queue and serialization and uses the existing subscription path.
- Existing `Bridge.subscribe(callback)` remains byte- and behavior-compatible.
- No cancellation API is added in v0; iframe lifetime owns teardown.

## Why this closes the race

Bridge v0 has no replay. Subscribe-then-snapshot gives the required boundary:

- a change before shell subscription is visible in the post-ack full snapshot;
- a change after subscription is queued as an event;
- a change during snapshot loading triggers a serialized follow-up snapshot.

The helper guarantees this ordering so Page authors do not reconstruct it.

## Source authorities and distribution

Edit only PR-owned authorities:

- `examples/pages/BRIDGE.md` — canonical copyable client and contract prose;
- `examples/pages/pulse.html` — embedded client plus worked live Page;
- `examples/pages/roadmap.html` — embedded client plus worked graph Page;
- focused tests under `packages/cli/test/`;
- `packages/cli/src/skill-render.ts` and generated npm-target `packages/cli/SKILL.md` only if the front-door prose changes.

Do not edit generated plugin reference copies, the committed compiled plugin bundle, or version manifests. The main-branch bot owns those.

## Example migrations

Pulse and Roadmap invoke `Bridge.watch` immediately rather than query/hello first and subscribe later. `Bridge.hello()` may run concurrently for bundle labeling; it must not delay watcher registration.

Each Page flattens the raw `events` batch into changed document ids before calling its existing domain refresh. Pulse preserves fresh-item highlighting, selected-document refresh, and follow-live behavior. Roadmap preserves item highlighting and graph rollups. No visual or query behavior changes.

## Deterministic proof

Add a focused Node test that extracts and executes the literal emitted client JavaScript from the three source authorities rather than testing a substitute implementation. Pin that the embedded copies contain the same `watch` implementation.

Test:

1. subscribe request is posted before the first refresh;
2. no refresh occurs before acknowledgement;
3. events before acknowledgement reach the first refresh batch;
4. a deferred first refresh plus several events has maximum concurrency one and one ordered follow-up batch;
5. events during a follow-up create the next batch;
6. a deferred initial refresh rejects after an event queues; the returned Promise rejects, then the queued batch runs automatically with maximum concurrency one;
7. a deferred later refresh rejects after another event queues; the failure is caught/reported, then the queued batch runs automatically and later events still refresh;
8. a failed subscription permanently deactivates its watcher: reject watch A, acknowledge watch B, emit a change, and prove only B refreshes;
9. raw `subscribe` still acknowledges and delivers the unchanged event;
10. two successful watches schedule independently;
11. invalid refresh input sends no bridge request;
12. the shipped reference/examples remain distribution-complete.

Run the existing real Chromium Page tests after migration, especially Roadmap startup data, live updates, connection recovery, and Page navigation/history. Finish with root build, typecheck, full `npm run check`, built CLI smoke, package-install smoke, and generated-reference drift checks appropriate to PR-owned artifacts.

## Explicit non-goals

- No protocol or shell change.
- No event cursor, replay, or ordered-event commitment.
- No automatic iframe reload.
- No Page framework, renderer, Markdown helper, or component system.
- No mutation capability.
- No implicit adoption by arbitrary existing bundle Pages.
- No claim that `watch` replaces a future snapshot-plus-cursor event contract.

## Implementation record

- Pull request: https://github.com/Holaxis-ai/agentstate-lite/pull/41
- Exact reviewed/QA commit: `c8c6b197ff09ebb351210cb3c35c05d1f27ae00a`
- Literal emitted-client scheduler suite: 26/26
- Full repository check, Chromium Page tests, built CLI smoke, and standalone package-install smoke passed
- Pulse and Roadmap use the helper while retaining startup, highlighting, follow-live, rollup, recovery, and navigation behavior
- Generated plugin references, compiled bundle, and version manifests remain owned by the post-merge bot
