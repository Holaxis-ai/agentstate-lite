---
type: Design
title: 'Mutation integrity: audit and completion design'
actor: mike/codex
timestamp: '2026-07-16T00:38:03.354Z'
---
# Mutation integrity: audit and completion design

**Status:** Proposed. This narrows the mutation recommendation in [Invariant ownership and change contracts](invariant-ownership-and-change-contracts.md) to the architecture that exists now.

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

[extends](invariant-ownership-and-change-contracts.md)

[coordinates with](../plans/board-git-package.md)
