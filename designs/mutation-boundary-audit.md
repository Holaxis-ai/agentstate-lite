---
type: Design
title: 'Mutation integrity: audit and completion design'
actor: mike/codex
timestamp: '2026-07-16T02:51:08.000Z'
---
# Mutation integrity: audit and completion design

**Status:** Audited 2026-07-16. This narrows the mutation recommendation in [Invariant ownership and change contracts](invariant-ownership-and-change-contracts.md) to the architecture that exists now.

## Conclusion

AgentState Lite already has most of the intended architecture. Core owns a generic `versionedMutation` read-decide-CAS-retry primitive. The CLI's `mutateDoc` composes `new`, `doc write`, and `doc update` over that primitive with kind validation, no-op handling, actor propagation, hard-CAS support, and final version results. Link mutation and reserved-file writers use the core primitive directly where their domain operation differs from document authoring.

The next unit should therefore be an audit and gap-closing pass—not a replacement helper and not a requirement that every write call `mutateDoc`.

## Architectural ownership

| Concern | Authority | Rule |
| --- | --- | --- |
| Read → decision → CAS → bounded retry | `packages/core` `versionedMutation` | Any decision that depends on current persisted state is recomputed against the version used by the write. |
| CLI document authoring | `packages/cli/src/mutate.ts` `mutateDoc` | `new`, `doc write`, and `doc update` share candidate construction, kind validation, CAS posture, idempotency, attribution, and final-version results. |
| Domain-specific read/modify/write | Core operation using `versionedMutation` | Links, reserved files, and similar domain operations may own their decision callback without being forced through the CLI document-authoring helper. |
| Explicit hard CAS or expect-absent create | Storage/engine versioned write APIs | A direct write is valid when there is no hidden read-dependent decision to recompute. |
| Actor attribution | Resolved once at the command boundary, carried in write options | Attribution accompanies a substantive persisted mutation and cannot manufacture a no-op. |
| Post-success notification/self-filtering | Injected orchestration hook outside generic mutation code | Runs only after persistence, is best-effort, bundle-specific, non-networked, and optional for non-Git consumers. |
| Mutation receipt | Command result | Reports `changed`/`deleted` honestly and returns the final resulting version when a versioned target exists. Multi-step commands return the version after the final materialized change. |

## Audit inventory

Classify every state-changing surface into one of four legitimate postures:

1. **Read-dependent mutation:** must use `mutateDoc` or core `versionedMutation`; include a deterministic intervening-writer test.
2. **Hard CAS:** caller provides an expected version; conflict is terminal and never silently retried.
3. **Expect-absent create:** writes with `expectedVersion: null`; a race cannot overwrite an existing value.
4. **Unconditional replacement:** allowed only when replacement is the explicit product contract and no guard or decision depends on prior state.

Inventory at minimum:

- `new`, `doc write`, `doc update`, and `link add`;
- document/blob `promote`, document/blob delete, and recipe installation;
- `appendLog`, `regenerateIndex`, and other reserved-file writers;
- multi-step authoring such as `new --link`;
- catalog and credential/state-file mutations where atomic local-file replacement, locking, and no-op behavior are the relevant contract;
- Git-channel bookkeeping only as a consumer of post-success outcomes, not as an owner of document mutation.

For each surface, record: posture, authority, retry behavior, no-op definition, actor behavior, returned version/receipt, post-success effects, and the adversarial test that proves the dangerous edge.

## Gap-closing rules

- Do not route blobs, deletes, recipes, or reserved files through `mutateDoc` merely for uniformity. Consolidate only genuinely duplicated read-dependent decisions.
- A retry must rerun the decision callback against the fresh state; never retry a candidate computed from a stale read.
- A failed write, rejected guard, or no-op must not emit attribution or post-success effects.
- Actor recording in document content and backend history remains part of the persisted write. Git awareness/self-filter recording is a separate best-effort subscriber.
- A command that performs several writes must define which resource its receipt describes and return that resource's final version, not an intermediate token.
- Do not introduce an event journal in this unit. The post-success hook may later feed one, but this audit only establishes the truthful mutation outcome it would consume.

## Parallel-work boundary with board-git extraction

The read-only audit, matrix, and tests outside the Git tier are safe while `tasks/board-git-a0-seam-prep` is active. The current A0 work owns `git.ts`, `cursor.ts`, Git error mapping, diff consolidation, and related neutral seams.

Avoid concurrent implementation in:

- cursor/self-actor storage;
- Git discovery or `BoardChannel` selection;
- the injected post-persist hook needed by in-tree self-filtering;
- command orchestration files actively moved or rewritten by A0/A1.

Sequence the work:

1. **Now, parallel-safe:** produce the mutation inventory and identify evidence gaps without changing runtime code.
2. **After A0 merges:** rebase the inventory on the new seams; close isolated mutation/test gaps in small PRs.
3. **With BoardChannel B/C:** implement the post-persist subscriber once, with the Git agent owning or explicitly coordinating that integration.

## Acceptance criteria

- Every state-changing command is present in the inventory and assigned one legitimate posture.
- Every read-dependent guard has a deterministic intervening-writer test proving recomputation or safe failure.
- No-op and failure paths are proven not to create actor-only writes or post-success effects.
- Receipts report the final state and final version for versioned mutations, including multi-step commands.
- Direct versioned writes remain where their simpler hard-CAS/expect-absent contract is correct; no ceremonial funnel is created.
- Any discovered defect becomes its own small task/PR, linked here, rather than expanding the audit into a sweeping refactor.

## Stopping rule

Stop when the inventory has no unclassified mutation and the missing executable proofs are closed. Do not generalize this into transactions across arbitrary documents, an event-sourcing framework, or a second mutation API without a demonstrated product requirement.

## Audit result — 2026-07-16

### Executive finding

The recurring document-mutation bug class has already been structurally consolidated. The CLI does not contain several competing read/decide/write implementations for document authoring: `new`, `doc write`, and `doc update` share `mutateDoc`; its read-dependent modes compose the core `versionedMutation` primitive. `link add`, `appendLog`, and `regenerateIndex` use that same core primitive with domain-specific decisions. Direct writes remain only where create-only, caller-supplied hard CAS, idempotent delete, raw wire replacement, or additive recipe installation is the actual contract.

The highest-value remaining integrity gap is one layer lower: `FilesystemBackend` serializes check-then-write only inside one Node process. Two direct CLI processes, or a direct CLI process racing a `serve` process, can both pass the same CAS premise and report success even though only the last atomic rename survives. This is documented honestly, but it is increasingly load-bearing for the product's local multi-agent workflow. It is now tracked as a separate architecture task rather than disguised as another CLI helper refactor.

### Semantic bundle mutation matrix

| Surface | Posture and authority | No-op / actor / receipt | Executable evidence |
| --- | --- | --- | --- |
| `init` root index | Expect-absent reserved-file create in core; losing create race is accepted as already initialized | Existing bundle is preserved; system-authored; init receipt describes the bundle/recipe | Core reserved-file expect-absent tests; CLI init/recipe tests |
| `new` | `mutateDoc` create-only (`expectedVersion: null`) | Existing id conflicts; resolved actor reaches content/history; receipt returns created head | `kinds.test.ts`, `new-link.test.ts` |
| `doc write` | `mutateDoc` read-dependent overwrite; every guard is rebuilt from the version paired to its CAS write | Full replacement; actor on substantive write; receipt returns written head | `doc.test.ts` intervening link/schema/body/dropped-field writers |
| `doc update` | `mutateDoc` patch; bounded retry, or single-shot hard CAS with `--expected-version` | Structural no-op ignores an auto-refreshed timestamp; actor cannot manufacture a write; receipt returns current/final head | `doc.test.ts` concurrent updates, stale premise, no-op, actor cases |
| `kind field add/remove` | `mutateDoc` patch with a fresh `governs` check on every attempt | Exact re-add/remove is `changed:false`; actor supported; final convention head returned | `kind.test.ts` competing field/title/governs mutations |
| `link add` | Core `versionedMutation`; parses and re-materializes the source body on each attempt | Exact typed edge is a no-op; actor only on a newly materialized edge; final source head returned | `link.test.ts` same-edge and unrelated-writer races |
| `new --link` | Create-only document followed by the exact `link add` operation for each requested edge | Explicitly non-transactional; partial-failure receipt names the created doc and failed link; success returns the head after the final link | `new-link.test.ts` final-head, actor, advisory-failure, and partial-failure cases |
| `promote` document/blob | Expect-absent create when no token is supplied; single-shot hard CAS when a token is supplied | Content-addressed identical bytes can retain a version; import route has no separate actor flag; receipt returns stored head | `promote-pull.test.ts` local/remote create, stale token, and edit/iterate loop |
| Document/blob delete | Idempotent unconditional delete, or single-shot hard CAS with `--expected-version` | Absent is `deleted:false`; no tombstone/version remains and no actor revision is invented | Core dual-backend/blob tests; CLI `delete.test.ts` and `doc.test.ts` |
| Recipe application | Preflight plus per-target expect-absent creates; never overwrites installed docs, Page blobs, registries, or References | Aggregate/per-target `changed`; definitions are system-installed and not actor-attributed; no single final version exists for a multi-resource package | `recipes.test.ts` idempotency, conflicts, portable preflight, and remote parity |
| `appendLog` | Core `versionedMutation`; re-splices the entry into fresh reserved bytes on every retry | Append has no semantic no-op and returns no public version; reserved-file attribution is not modeled | `dual-backend.test.ts` intervening append and first-create races; wire test |
| `regenerateIndex` | One concept scan, then core `versionedMutation` over the reserved index bytes | Deterministic replacement; concept changes during the one scan may be absent until the next self-healing regeneration by explicit policy | Policy is documented in `bundle.ts`; a deterministic index-file conflict/create-race proof is still missing and now separately tracked |
| Wire `PUT` document/reserved/blob | Direct explicit replacement, expect-absent, or hard CAS according to headers; engine/storage authority | Raw transport does not claim CLI kind/body-guard/no-op policy; final version is returned in body and headers | `wire-protocol.test.ts` CAS, versions, attribution, reserved files, and blobs |
| Wire `DELETE` document/blob | Direct idempotent delete or hard CAS | Returns honest `deleted`; no final version after hard delete | `wire-protocol.test.ts` delete parity and conflicts |

### Auxiliary mutation matrix

| Surface | Classification | Result |
| --- | --- | --- |
| Workspace catalog | Cross-process locked read/decide/atomic-replace boundary in `catalog.ts` | Complete: uniqueness, no-op, stale-lock refusal, in-process and built-CLI cross-process races are pinned. This is a useful implementation precedent for filesystem CAS, not a second semantic mutation framework. |
| Sync cursor/cache/marker/self-actors | Atomic whole-file read/merge/replace; cross-process last-writer-wins is explicitly accepted because the state is re-derivable from Git | Classified, not changed during board-git A0/A1. The limitation is recorded on `tasks/sync-cursor-store`; BoardChannel work owns any future policy change. |
| Per-origin credentials | Atomic whole-file replacement, but the merge is not cross-process locked | A concurrent provisioning integration could lose a different origin's key. The hosted provisioning path is parked and has no default CLI writer, so this is recorded as dormant risk rather than promoted into current OSS work. |
| Hook install/uninstall | Read/transform/replace of third-party JSON/TOML/plugin files | Idempotent transforms are tested, but concurrent external edits are not serialized and writes are not uniformly atomic. This is an infrequent configuration tool, not bundle mutation; improve only with demonstrated collisions. |
| UI URL pointer | Best-effort atomic replacement; conditional best-effort cleanup | Convenience credential pointer only. A narrow read-then-unlink race can remove a newer pointer, but never bundle data or the running UI; no current architecture task. |
| `pull`, `doc read --out`, conflict exports | Explicit caller-named file replacement | Legitimate replacement posture with byte channels/path guards; not semantic bundle mutation. |
| Git sync/establish/migrate | Git/worktree transaction and recovery domain | Deliberately outside the document mutation helper. Board-git A0/A1 owns this surface; the audit only requires it to consume truthful persisted outcomes later. |

### Adapter and proof conclusion

- `MemoryBackend` is the enforced-CAS reference, including version history and attribution.
- `RemoteBackend` preserves the wire's CAS/version contract; the reference server's behavior is pinned by wire tests.
- `FilesystemBackend` has atomic full-file replacement and a process-wide per-path mutex, so concurrent callers inside one process converge. It does **not** provide cross-process conditional writes. That is the only broad mutation-integrity limitation found that can still produce silent lost updates in the flagship local workflow.
- The targeted audit suite passed: 94 core mutation/backend tests and 302 CLI document/link/kind/promote/delete/recipe/catalog/credential/cursor tests.

### Decisions and follow-ups

1. Do not build another generic mutation framework. Keep core `versionedMutation`, and keep CLI-neutral document policy as the destination for the already-linked shared-service extraction.
2. Treat cross-process filesystem CAS as the next integrity architecture problem. Solve it below semantic consumers so `doc update`, `link add`, reserved files, and blobs benefit together.
3. Add the missing deterministic `regenerateIndex` conflict/create-race proof without changing its deliberate one-scan/self-healing policy.
4. Defer the post-persist Git subscriber to the BoardChannel sequence. It is absent today, but adding it while A0/A1 owns Git seams would violate this design's coordination boundary.
5. `doc write` is content-idempotent when the supplied frontmatter (including timestamp) and body are identical: the backend returns the same content-addressed version and does not grow history. Repeating a write that omits `--timestamp` intentionally generates a new timestamp and therefore new content. This is a help/expectation nuance, not a CAS defect.

[extends](invariant-ownership-and-change-contracts.md)

[coordinates with](../plans/board-git-package.md)
