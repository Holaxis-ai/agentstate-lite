---
type: Design
title: 'Shared change observation boundary: consolidation versus semantic drift'
actor: openai/codex-design-review
timestamp: '2026-07-20T00:15:40.973Z'
---
# Shared change observation boundary

**Status:** Design review only. This document does not ratify the event backbone, create an implementation task, or sequence work.

## Executive verdict

Do **not** create a repository-wide `BundleChangeBatch` or `ChangeSource` abstraction now.

The apparent duplication is mostly three different contracts that happen to contain the word “change”:

1. the UI watcher emits an **ephemeral current-state invalidation** (`id/key + resulting version`, with a separate removed list);
2. board-git derives an **enriched historical document activity row** (`added/updated/deleted + actor/kind/title`) between git refs;
3. sync and home deliberately project that git row into two **consumer-owned boundary shapes**: a stable persisted awareness-cache row and a CLI receipt row.

Those contracts do not have the same information, recovery guarantees, source semantics, or compatibility obligations. A common optional-field object would make the type system weaker. A generic wrapper would add vocabulary without removing detection or projection code. Neither would give ordering, replay, atomic state-plus-event writes, or reconnect recovery—the properties that make the proposed event backbone valuable.

There is one exact duplication worth correcting if the team wants a very small cleanup: `packages/ui-server/src/watch.ts` owns the SSE event type and `packages/ui/src/pages/pageEvents.ts` repeats it byte-for-byte. The browser can consume a type-only contract exported by the already-existing `@agentstate-lite/ui-server` workspace dependency, or a small pure subpath can own both its type and runtime parser. That is an **UI wire-contract ownership cleanup**, not a shared event backbone. It should be a separate, narrow PR and should ship only if it deletes the duplicate interface (and preferably the unchecked JSON cast) without introducing a new package or altering emitted bytes.

The broad proposal is therefore **NO-GO now**. Reconsider a cross-source observation boundary only when one real consumer must switch between two producers, or when the durable journal is approved and needs explicit projectors into the existing UI and awareness contracts.

## Current-state inventory

| Location | Shape / function | What it actually means | Consumers | Guarantees and compatibility |
| --- | --- | --- | --- | --- |
| `packages/ui-server/src/watch.ts` | `Snapshot` | Current `doc id -> version` and View blob `key -> version` maps at one scan | `diffSnapshots`, watcher driver | Point-in-time observation only; local docs + View blobs, remote docs only; no cursor, attribution, or historical verb |
| `packages/ui-server/src/watch.ts` | `ChangeEvent`, `diffSnapshots` | Current-state invalidation: keys new or with moved versions are `changed`; absent keys are `removed` | UI server `SseHub`, browser shell | Version tokens identify resulting bytes; added and updated are intentionally collapsed; ordering is only serialized scan order; missing frames require full refresh |
| `packages/ui/src/pages/pageEvents.ts` | duplicate `ChangeEvent` | Browser’s compile-time assertion about JSON received from `/events` | launcher and each `PageFrame` subscriber | Textually identical to the server type, but independently declared and parsed with `JSON.parse(...) as ChangeEvent`; no runtime shape validation |
| `packages/ui/src/pages/bridge.ts` | `changeMessage` | Projection of only the document half of the shell event into View bridge v0 `{event:{changes,removed}}` | subscribed sandboxed Views through `PageFrame.tsx` | Public-ish bundle View authoring contract; intentionally omits blobs; bridge field names and bytes must remain stable |
| `packages/board-git/src/porcelain.ts` | `DocVerb`, `DocChange`, `enrichDocChange` | One concept document’s enriched git change between snapshots | commit summaries, ref diffs, sync orchestration | Strict `added/updated/deleted`; actor/kind/title read from document frontmatter at the correct endpoint; deletion enrichment reads the old ref; no version token or blob support |
| `packages/board-git/src/diff.ts` | `diffDocsBetween` | The existing one-owner git name-status parse/filter/enrich pipeline | `changesSince`, `originDocsBetween` | Already consolidated; prefix-aware; excludes reserved files; supports strict vs tolerated git-diff failure by caller policy |
| `packages/board-git/src/diff.ts` | `changesSince` | Pull-style git cursor query from a commit token to `HEAD` | sync awareness and autopull | Durable only to the extent git retains the commit; a missing token returns explicit `dangling`; this is not a subscription and not the live UI transport |
| `packages/board-git/src/cursor.ts` | `AwarenessDeltaRow` | Persisted, forward-compatible cache record rendered by home | sync state-store serializer/validator, CLI home | On-disk compatibility surface; accepts string verbs and preserves extra fields for future producers; malformed rows poison the cache rather than showing a partial delta |
| `packages/board-git/src/engine.ts` | `toDeltaRows` | Explicit projection from strict `DocChange` to the loose persisted awareness schema | sync, autopull, in-tree awareness | The rebuild is intentional: fixed `DocChange` is not assignable to the index-signature-bearing persisted row; changing it risks lying about the persistence contract |
| `packages/cli/src/commands/sync/converge.ts` | `toIncomingRows` | CLI receipt projection (`docId` becomes user-facing `id`) | success and partial sync envelopes | AXI/user-output compatibility surface; separate naming is deliberate and test-pinned |

## Problem statement

The motivating concern is sound: as more consumers need freshness, each can independently invent polling, snapshot diffing, reconnect behavior, cache invalidation, and “what changed” payloads. That is the failure class identified in [real-time event backbone](../research/real-time-event-backbone.md).

The current tree, however, does not yet contain multiple implementations of one source-neutral change primitive:

- the UI computes invalidations from storage snapshots because it needs to refetch current state;
- board-git computes activity from git history because it needs human-readable “since this checkout last synced” awareness;
- View bridge and CLI receipt functions marshal those internal results across two different user-visible boundaries.

Collapsing these today would centralize spelling, not behavior. The dangerous duplication—ordering, replay, snapshot-plus-cursor handoff, retention, atomic event emission—does not exist as an implemented primitive anywhere, so a shared type cannot enforce it.

## Goals for any near-term change

- Give an exact shared contract one owner when two packages truly exchange the same bytes.
- Delete a duplicate type or mapper in the same PR that introduces its owner.
- Preserve source-specific guarantees instead of hiding them behind optional fields.
- Keep existing SSE bytes, sync receipts, home rendering, View bridge messages, and awareness-cache files unchanged.
- Leave a clean adapter point for a future durable journal without claiming that the adapter is the journal.
- Use tests to prove byte/shape parity and to red-probe the new ownership boundary.

## Non-goals

The first PR must not add:

- a durable journal, monotonic cursor allocation, replay, retention, or `Last-Event-ID`;
- atomic state-plus-event writes or an outbox;
- a new backend capability or wire-protocol endpoint;
- a persistent awareness-cache schema migration;
- a new workspace package;
- a source-neutral API that implies filesystem scans and git diffs have the same semantics;
- a public wire-format change;
- a second change detector beside `diffSnapshots` or `diffDocsBetween`.

## Semantic comparison

### UI invalidation versus git activity

The UI watcher knows resulting versions but not whether a changed document was added or updated, who changed it, what kind it is, or what its title was. Board-git knows the historical verb and endpoint metadata but does not return a resulting content version. It also excludes blobs and reserved files. A deletion in board-git still has old frontmatter metadata; a UI removal is only an id/key.

No lossless conversion exists in either direction:

- UI `changed` -> `DocChange` would have to guess `added` versus `updated` and synthesize actor/kind/title.
- `DocChange` -> UI `changed` would have to retrieve a version and separately classify deletions.

That is decisive evidence that they are not one canonical event type.

### Git producer versus its two projections

`DocChange` is the correct strict producer shape. `AwarenessDeltaRow` is deliberately looser because it is deserialized persisted data and preserves future fields. `toIncomingRows` changes `docId` to the CLI’s `id` convention. These two mappers do not re-detect changes; they make compatibility boundaries explicit. Removing them by widening `DocChange` or making one mega-row would weaken the producer and blur persisted versus rendered contracts.

### Server SSE versus browser SSE

These are the same contract. The server exports `ChangeEvent`; the browser repeats it exactly. This is the one present ownership defect.

## Candidate designs

### Candidate A — repository-wide optional-field event (reject)

Example of what not to build:

```ts
interface BundleChange {
  id?: string;
  key?: string;
  version?: string;
  verb?: "added" | "updated" | "deleted";
  actor?: string;
  kind?: string;
  title?: string;
}
```

Every consumer would need runtime combinations such as “version required unless deleted” and “actor may be absent only for snapshot sources.” Illegal states become representable, while existing mappers remain. This is strictly worse than today.

### Candidate B — generic `ChangeSet<TChanged, TRemoved>` wrapper (reject for now)

```ts
interface ChangeSet<TChanged, TRemoved> {
  changed: readonly TChanged[];
  removed: readonly TRemoved[];
}
```

This can factor the UI event’s repeated `{changed, removed}` spelling. It does not model board-git’s enriched verb rows without first projecting them, and it owns no ordering or recovery invariant. The abstraction saves only a few type lines and adds generic vocabulary. It fails the deletion-positive bar.

### Candidate C — discriminated source union (reject for now)

```ts
type BundleObservation =
  | { source: "snapshot"; value: SnapshotInvalidation }
  | { source: "git"; value: readonly DocChange[]; cursor: SyncCursor };
```

This truthfully preserves source differences, but no current consumer accepts both branches. It would be a registry of unrelated shapes rather than a useful boundary. Add it only when a real consumer needs polymorphism.

### Candidate D — one UI SSE contract owner (recommended optional cleanup)

Smallest form:

```ts
// ui-server remains the owner because it emits the bytes.
export interface ChangeEvent {
  docs: { changed: { id: string; version: string }[]; removed: string[] };
  blobs: { changed: { key: string; version: string }[]; removed: string[] };
}

// pageEvents.ts
import type { ChangeEvent } from "@agentstate-lite/ui-server";
```

Stronger form, still narrow: put the contract plus `parseChangeEvent(unknown): ChangeEvent | null` in a pure exported `@agentstate-lite/ui-server/change-event` subpath. `watch.ts` imports the type; `pageEvents.ts` imports the parser; semantically malformed JSON is ignored like syntactically malformed JSON. This removes the unchecked type assertion and makes the wire owner executable. It does not alter the JSON format.

The stronger form is worthwhile only if Vite’s exact production build proves that the pure subpath does not pull Node server modules into the browser artifact. Otherwise use the type-only import and leave runtime validation for a separately justified hardening unit.

### Candidate E — durable ordered journal (future, separate decision)

The journal described in the existing research document would be a genuinely shared source. It should define durable event semantics first, then supply explicit projectors:

```ts
projectJournalToUiInvalidation(events): ChangeEvent
projectJournalToAwareness(events): AwarenessDeltaRow[]
```

Those projectors are supposed to remain distinct because the consumers need different information. The shared authority is the ordered/replayable journal, not a lowest-common-denominator payload.

## What should consolidate

If Candidate D is chosen:

1. The server-emitted UI SSE shape has one owner.
2. The browser’s duplicate `ChangeEvent` declaration is deleted.
3. Optionally, the browser’s unchecked `JSON.parse(...) as ChangeEvent` is replaced by the owner’s pure parser.
4. UI server and browser tests share representative valid/invalid fixtures or an agreement table.

## What must remain separate

- `snapshotBundle` and `snapshotRemote`: same output shape, different acquisition capabilities; remote intentionally lacks blob hot reload.
- `diffSnapshots`: current-state invalidation logic.
- `diffDocsBetween` / `changesSince`: historical git diff and cursor logic.
- `DocChange`: strict producer-enriched activity row.
- `AwarenessDeltaRow` and its validator: persisted, forward-compatible cache schema.
- `toDeltaRows`: boundary into the persisted cache unless a separately reviewed schema design proves it unnecessary.
- `toIncomingRows`: CLI receipt projection.
- `changeMessage`: View bridge v0 projection; Views are intentionally scoped to document invalidation and do not receive blobs.
- SSE serialization in `SseHub`: transport framing, not the domain contract.
- reconnect/full-refresh behavior in `pageEvents.ts`: recovery policy while the stream is non-replayable.

## File-level migration outline

### Recommended optional UI-only PR

1. `packages/ui-server/src/watch.ts`
   - keep `Snapshot`, `diffSnapshots`, and watcher behavior unchanged;
   - either remain the `ChangeEvent` owner or import it from a new pure sibling contract file.
2. `packages/ui-server/src/index.ts` and `packages/ui-server/package.json`
   - only if using the pure subpath: export that subpath explicitly;
   - do not add a package.
3. `packages/ui/src/pages/pageEvents.ts`
   - delete the duplicate interface;
   - import the owner type, or import the pure parser and use it instead of a cast.
4. `packages/ui/src/pages/pageEvents.test.ts`
   - prove valid events still reach listeners byte-for-byte;
   - red-probe a structurally malformed JSON object so contract drift is caught if using the parser.
5. Existing UI/server parity tests
   - preserve all `diffSnapshots` expectations and server SSE output.

Expected production deletion: one duplicate interface and, in the stronger version, one unchecked cast. If the pure parser/export scaffolding is substantially larger than the deleted duplication and does not close a demonstrated failure, choose the type-only form or do nothing.

### Files explicitly not touched

- `packages/board-git/src/porcelain.ts`
- `packages/board-git/src/diff.ts`
- `packages/board-git/src/cursor.ts`
- `packages/board-git/src/engine.ts`
- `packages/cli/src/commands/sync/converge.ts`
- wire-protocol documentation

Their shapes are not duplicates of the UI contract, and changing them would enlarge the unit without strengthening one invariant owner.

## Compatibility risks

### Persisted awareness cache

`AwarenessDeltaRow` is read from per-clone JSON. Its string verb and extra-field preservation are intentional forward-compatibility behavior. Tightening it to `DocChange`, renaming `docId`, or deleting its validator would be a schema/behavior change and violates this design’s non-goals.

### SSE wire bytes

The `/events` JSON must remain exactly `{docs:{changed:[{id,version}],removed:[]},blobs:{changed:[{key,version}],removed:[]}}`. A type move is safe only if a real-server test compares the emitted payload before and after. A parser must accept every shape the current server can emit.

### View bridge v0

`changeMessage` must continue to emit `{bridge:"v0",type:"change",event:{changes,removed}}`, documents only. Reusing the SSE object directly would leak blob invalidations and break the authoring contract.

### CLI receipts and home output

`incoming` rows keep `id`; persisted/home rows keep `docId`. Actor, verb, kind, title ordering/content and caps remain unchanged. These are user-visible projections, not redundant domain models.

### Package graph and browser build

`packages/ui` already declares `@agentstate-lite/ui-server` as a dev dependency. A type-only import erases at build time. A runtime parser import requires a deliberately pure subpath and must be checked in the built browser assets so Node modules are not pulled into the SPA.

## Alternatives

| Alternative | Pros | Cons | Verdict |
| --- | --- | --- | --- |
| Do nothing | Zero churn; preserves honest boundaries; future journal design starts unconstrained | Exact server/browser type duplication remains; drift is possible and JSON parsing remains unchecked | Acceptable |
| UI-only contract cleanup | One owner for bytes actually crossing a package boundary; small; deletion-positive; no product behavior change in type-only form | Limited payoff; not an event backbone; runtime parser may add more code than it removes | Recommended only as a tiny standalone unit |
| Repository-wide shared observation boundary | Appealing vocabulary; might look like future optionality | Conflates invalidation and activity; illegal optional states or generic indirection; no current polymorphic consumer; does not solve recovery | Reject now |
| Full durable event backbone | Actually centralizes ordering/replay and enables multiple consumers; direct answer to reconnect gaps | Foundational storage/wire/backend work; open atomicity and retention decisions; explicitly not small | Candidate pending founder decision |

## Pros and cons of broad consolidation

### Potential benefits

- A future consumer could be written against one source-neutral interface if multiple producers really satisfy it.
- Naming and documentation could make source capabilities explicit.
- Shared fixtures could expose accidental wire drift.
- A journal adapter could have a known landing seam.

### Present costs and risks

- **False equivalence:** an ephemeral snapshot invalidation and a git activity row are not substitutable.
- **Weaker types:** optional fields or broad strings move guarantees from compile time into caller conventions.
- **Abstraction tax:** new interfaces, adapters, tests, exports, and prose without deleting the existing detectors or boundary projections.
- **Compatibility risk:** the easiest apparent deletions (`toDeltaRows`, `toIncomingRows`) are exactly where persisted and user-facing names diverge intentionally.
- **Future constraint:** a premature lowest-common-denominator batch may be removed when the journal’s true cursor/event semantics are designed.
- **Misleading progress:** shared TypeScript spelling does not provide ordering, replay, retention, or snapshot/cursor race closure.

## Testing and parity strategy

### For the optional UI-only PR

1. Capture representative pre-change server payloads from `diffSnapshots` and the real SSE hub path.
2. Keep those expected JSON objects/bytes unchanged after moving the type.
3. In the browser stream test, feed the same valid payload and assert the listener sees the same object.
4. If adding a parser, add invalid cases for missing `docs`, non-string versions, non-array `removed`, and malformed blob entries; assert they are ignored without terminating future valid events.
5. Red-probe ownership: temporarily rename or remove one required field in the owner contract/fixture and demonstrate either typecheck or the agreement test fails.
6. Run the normal root build, typecheck, UI/UI-server tests, and exact browser production build. No new e2e flow is necessary for a type-only move; parser behavior deserves its focused browser stream test.

### If a future cross-source boundary is reconsidered

Before implementation, write an agreement table with a row per producer and columns for:

- observation scope (current state vs interval history);
- cursor/recovery behavior;
- add/update distinction;
- resulting version availability;
- deletion metadata availability;
- actor/kind/title availability;
- docs/blobs/reserved-file coverage;
- failure/fallback semantics.

The proposal passes only if at least one current consumer can use every row without source branching and at least one existing mapper or detector is deleted. A test that merely constructs both union variants is not evidence of consolidation.

## PR size and sequence

### Optional cleanup

One small PR, roughly 3–5 source/test files:

1. establish the UI SSE owner (or use the existing export);
2. delete the browser duplicate;
3. optionally add a pure parser only if it remains a compact hardening change;
4. prove bytes and browser behavior unchanged.

Do not mix board-git types, awareness persistence, CLI receipts, or roadmap activation into that PR.

### Event backbone later

If the candidate roadmap is ratified, sequence separately:

1. decision document resolving ordering scope, retention, backend atomicity, and snapshot-plus-cursor semantics;
2. journal contract and one backend proof;
3. wire replay/subscribe contract;
4. UI adapter and reconnect migration;
5. awareness/notification consumers where the journal is actually the right source;
6. direct-filesystem invalidation fallback.

The current UI-only contract can remain the projection target during that migration.

## Relationship to the future durable journal

The future common primitive should be the **ordered, recoverable record of mutation**, not the current presentation shapes. A journal event can contain cursor, event type, target, prior/resulting version, actor, and timestamp under explicit atomicity rules. Consumers then derive their own fit-for-purpose views:

- UI: coalesced doc/blob invalidation with resulting versions;
- awareness: enriched human activity since a cursor;
- notifications: policy-filtered attributed events;
- direct filesystem edits: coarse reset/invalidation when exact history is unknowable.

This preserves one source of truth for change history while keeping boundary projections honest. It also means the present git awareness feed may remain a separate offline/async tier; the existing research explicitly says git is not the live event transport.

## Go / no-go criteria

### GO for the optional UI-only cleanup when all are true

- the duplicate browser `ChangeEvent` is deleted;
- one existing package owns the exact SSE contract;
- no runtime package or public wire shape is added;
- emitted SSE bytes and View bridge messages are unchanged;
- the browser build stays Node-free;
- tests red-probe drift at the owner boundary;
- the PR does not claim to deliver ordering or replay.

### GO for a future cross-source boundary only when all are true

- at least one real consumer must accept more than one producer;
- the producers satisfy a named minimum guarantee without optional-field guessing;
- the change deletes at least one existing detection or mapping path, not only type declarations;
- persisted cache and user-facing projections remain explicit;
- recovery semantics are part of the interface rather than comments;
- the design does not pre-decide the durable journal’s still-open questions.

### NO-GO when any are true

- the proposed type needs optional `version`, `verb`, actor, or target fields to fit both UI and git;
- every consumer immediately switches on `source`;
- `toDeltaRows` or `toIncomingRows` is deleted only by widening a producer type;
- line count and concepts increase while all existing detectors/mappers remain;
- “event backbone” is used to describe a type alias without ordering, replay, or recovery.

## Recommendation

Do not create an implementation task for a broad shared change-observation boundary from this review. The current board-git path has already consolidated its actual duplicate detector in `diffDocsBetween`, and its remaining mappers are legitimate boundaries.

If the exact UI type duplication is causing concern, create a narrowly named task such as **“Own the UI SSE change contract in ui-server”** and link it to this design. Otherwise, leave the code alone and use this document as the decision record until either a second producer serves the same consumer or the durable event-backbone candidate is ratified.

[informed by](../research/real-time-event-backbone.md)

[supports](../roadmap-items/real-time-event-backbone.md)
