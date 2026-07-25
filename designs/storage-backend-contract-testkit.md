---
type: Design
title: >-
  StorageBackend contract suite: internal first, external only with a real
  adapter
actor: codex
timestamp: '2026-07-25T02:54:00.210Z'
---
# StorageBackend contract suite: internal first, externally reusable only with a real adapter

## Decision summary

Consolidate the universal `StorageBackend` behavior that is already exercised across
`FilesystemBackend`, `MemoryBackend`, and `RemoteBackend` into internal, explicitly registered
Node contract suites.
The first unit is test-only and private to the core workspace: it changes no production code,
adds no npm export, and makes no promise to third-party adapter authors.

Promote that suite to a supported package export only when a real external adapter—expected to
be the private hosted Postgres adapter—needs to consume it and
[the core package publication task](../tasks/publish-core-package.md) has established a supported
external library surface.

This is not a prerequisite for exploring hosted storage. It is a bounded executable-contract
improvement that is independently worthwhile only if it produces clearer invariant ownership
and meaningful consolidation without reducing diagnostic coverage.

## Problem

`StorageBackend` is intentionally the provider-neutral persistence seam. Its TypeScript interface
describes a hard contract: content-addressed versions, create-if-absent semantics, stale-CAS
rejection, ordered batch reads, idempotent deletion, version history, reserved-file behavior,
blob behavior, projections, and capability reporting.

The contract is already tested against multiple adapters, primarily through repeated runner loops
in:

- `packages/core/test/dual-backend.test.ts`
- `packages/core/test/blob.test.ts`
- selected parity cases in `packages/core/test/query-heads.test.ts`

Those tests prove important behavior today, but the universal contract is embedded inside files
that also contain filesystem-specific, wire-specific, and adversarial implementation tests. A
future adapter cannot run the contract without copying and reinterpreting it. Copying would create
two manually coordinated definitions of what `StorageBackend` means.

## Goals

1. Give the existing storage contract one executable home.
2. Keep Filesystem, Memory, and Remote as active consumers of that contract.
3. Preserve or improve failure diagnostics and coverage.
4. Keep adapter-specific guarantees in adapter-specific suites.
5. Make eventual Postgres conformance cheap without designing around Postgres prematurely.
6. Allow the suite to become a supported external test kit later without requiring that
   commitment now.

## Non-goals

- No production behavior change.
- No new storage interface or capability.
- No Postgres adapter.
- No npm export in the first unit.
- No broad reorganization of the core test directory.
- No attempt to make every existing storage-related test generic.
- No replacement for wire-protocol, filesystem-safety, mutation-policy, or engine-level tests.
- No requirement that all adapters provide optional capabilities they do not claim.

## Proposed internal API

Add an internal test module:

```text
packages/core/test/storage-backend-contract.ts
```

It exports named Node-test registration functions and fixture types. Required behavior and
optional/stronger extensions are visible at the registration site; `capabilities()` never
silently chooses which tests run:

```ts
export interface StorageBackendFixture {
  backend: StorageBackend;
  cleanup(): Promise<void>;
}

export interface StorageBackendContractOptions {
  name: string;
  create(): Promise<StorageBackendFixture>;
}

export interface MultiPeerStorageBackendFixture {
  /** Independent logical clients targeting the same storage namespace. */
  peers: [StorageBackend, StorageBackend, ...StorageBackend[]];
  /** Adapter-specific proof that the peers do not share one serialized client/connection. */
  assertIndependent(): Promise<void>;
  cleanup(): Promise<void>;
}

export function storageBackendBaseContract(options: StorageBackendContractOptions): void;
export function storageBackendBlobContract(options: StorageBackendContractOptions): void;
export function storageBackendAtomicCasContract(options: {
  name: string;
  createPeers(): Promise<MultiPeerStorageBackendFixture>;
}): void;
export function storageBackendHistoryContract(options: {
  name: string;
  create(): Promise<StorageBackendFixture>;
  expectation: "current-only" | "retained";
}): void;
export function storageBackendQueryHeadsContract(options: StorageBackendContractOptions): void;
```

Every individual contract test creates a fresh fixture and always calls `cleanup` in `finally`.
Fresh-per-test isolation is required because a future database implementation must be able to use
a unique `bundle_id` and exercise real concurrent connections without shared-state leakage.

The current suites register the base contract for all three adapters:

```ts
storageBackendBaseContract({
  name: "FilesystemBackend",
  create: createFilesystemFixture,
});

storageBackendBaseContract({
  name: "MemoryBackend",
  create: createMemoryFixture,
});

storageBackendBaseContract({
  name: "RemoteBackend",
  create: createInProcessRemoteFixture,
});
```

Each adapter explicitly registers the extension contracts it claims. Remote uses an in-process
reference router for semantic conformance; its HTTP status/envelope/header and request-shape tests
remain in the wire suite.

The test kit uses Node's built-in test runner because that is the repository's existing authority.
Framework neutrality is not a goal.

## Mandatory base contract

The base suite directly exercises `StorageBackend` methods and every adapter runs it. It includes:

- document write/read round trip;
- content-addressed version stability;
- unconditional overwrite returns the final version;
- `expectedVersion: null` means create only when absent;
- sequential stale expected versions throw the typed `VersionConflict` and do not mutate;
- `readMany` preserves input order and has the documented missing-document behavior;
- `list` is sorted and honors prefix filtering;
- delete is idempotent and honors its CAS contract;
- `versions` is newest-first and reports at least the current version;
- reserved-file read/write and CAS semantics;
- honest current-version history behavior.

Required semantics cannot be skipped through harness flags or an omitted capability declaration.

## Explicit extension contracts and capability truth table

The following behavior is registered by name, never selected by an internal conditional:

| Extension | Registration proves | Capability relationship |
|---|---|---|
| Blob | raw-byte fidelity, blob versions, create-if-absent, deletion, sorted/prefix listing, blob-key namespace safety | A present `blobs: true` declaration must agree. `blobs: false` has no typed unsupported contract today, so declaration alone cannot define a skip. |
| Atomic CAS | multiple contenders against one version produce exactly one winner | A present `enforced_cas: true` declaration requires this contract. `false` still runs the base sequential stale-CAS cases. |
| History | either honest current-only history or retained newest-first attributed history | A present `history` declaration must match the explicitly registered expectation. Absence still runs the base `versions()` behavior. |
| Query heads | direct backend head projection agrees with the canonical filter semantics and versions | Register only when the backend implements `queryHeads`; do not infer this from `projections`, whose current router default is broader than method presence. |

If `capabilities()` exists, a separate truth-table test cross-checks the declaration against the
extensions registered for that adapter. Because the method is optional and only
`FilesystemBackend` currently self-declares, it is corroborating evidence, not the source of test
selection.

The atomic fixture must create independent logical clients over the same namespace. For a future
Postgres adapter that means at least two backend/client instances using distinct checked-out
connections. A single backend object over a pool is insufficient evidence because it may
serialize internally or reuse one connection.

## Contract ownership boundaries

Before moving assertions, implementation must produce a before/after ownership matrix. Every case
is assigned to exactly one primary owner:

- **Direct seam contract:** direct `StorageBackend` calls and the base/extension suites above.
- **Engine/backend agreement:** `writeDoc`, `deleteDoc`, reserved-id policy, query re-filtering,
  malformed-document handling, and other semantics owned above the seam.
- **Adapter mechanic:** filesystem locking/path mechanics, in-memory implementation details, or
  future Postgres schema/transaction behavior.
- **Wire mechanic:** raw HTTP status, envelope, header, request shape, pagination, retry, auth, and
  transfer-thinness assertions.

Blob-key namespace safety belongs to the explicit blob contract because the current interface
describes it as guarded at every operation. Unsafe concept IDs and reserved-directory traversal
have mixed evidence today: interface prose assigns concept-id safety to the engine, while current
backend and wire security tests also defend it. Do not silently absorb or discard those assertions;
record them in the ownership matrix and retain the existing agreement/security owner unless the
public `StorageBackend` contract is deliberately clarified in a separate production change.

## Tests that remain separate

The following are deliberately not universal backend-contract cases:

- filesystem path traversal, symlink, owner/mode, atomic-rename, and cross-process lock tests;
- MemoryBackend implementation details;
- RemoteBackend request shapes, retry policy, pagination, transfer thinness, and HTTP envelopes;
- wire router behavior;
- engine validation, kind conformance, links/backlinks, and mutation-policy behavior;
- malformed on-disk Markdown behavior that cannot arise in a structured database backend;
- Postgres migrations, tenant scoping, transaction plans, connection-pool behavior, RLS, and
  database failure recovery.

This boundary prevents “generic” from becoming “lowest common denominator” and keeps failures
close to the mechanism responsible for them.

## Extraction sequence

1. Inventory the repeated adapter-runner and Remote semantic cases in `dual-backend.test.ts`,
   `blob.test.ts`, `wire-protocol.test.ts`, and `query-heads.test.ts`.
2. Produce the before/after ownership matrix: direct seam, engine agreement, adapter mechanic, or
   wire mechanic.
3. Move only direct mandatory behavior into the base contract and stronger/optional behavior into
   named extension contracts.
4. Register Filesystem, Memory, and Remote against the base and their applicable extensions.
5. Leave the existing specialized tests in place and remove only semantic assertions whose
   authority moved intact.
6. Compare the ownership matrix, assertion bodies, diagnostics, and relevant mutation survivors
   before and after. Raw test counts are not sufficient evidence.
7. Run core typecheck, core tests, mutation survivors relevant to the moved code, and the full
   repository gate appropriate for a test-only refactor.

The first PR should make one behavioral claim: the same direct storage contract is now declared
once and run against Filesystem, Memory, and Remote, while wire and adapter mechanics retain their
existing owners. It should not publish a package or alter production exports.

## Acceptance criteria for the internal unit

- Filesystem, Memory, and Remote consume the same mandatory base contract.
- Optional/stronger behavior is registered through named extension contracts, not hidden skips.
- No production source or npm export changes.
- Existing adapter-specific tests remain explicit.
- Universal assertion coverage does not decrease.
- Test names identify both adapter and failed contract.
- There is meaningful consolidation or clearer invariant ownership; a wrapper that merely hides
  the existing loops without reducing drift is not sufficient.
- A before/after ownership matrix accounts for every moved or deleted assertion.
- The full relevant test gate remains green.
- Capability truth-table review confirms declarations cannot silently waive required semantics.

If these criteria cannot be met without a large or opaque rewrite, do not perform the extraction.
The current duplicated runner structure is preferable to a worse abstraction.

## Future external promotion

When an actual Postgres adapter exists, its private repository should initially supply fresh
fixtures backed by a disposable real Postgres database and unique bundle ID. It must not use a
mock database for CAS or concurrency claims. Its atomic fixture supplies independent backend/client
instances over that same bundle namespace, proves that they use distinct connections, and races
them against one expected version.

Only then should the stable internal suite be considered for a supported export, for example:

```ts
import type { StorageBackend } from "@agentstate-lite/core";
import { storageBackendBaseContract } from "@agentstate-lite/core/testing";
```

External promotion is governed by `tasks/publish-core-package`. It requires:

- a publishable, versioned core library surface;
- a versioned test-kit surface compatible with the core contract;
- an external scratch-install proof;
- semver ownership for contract changes;
- proof against the Postgres adapter as the first non-repository consumer.

The OSS repository remains the authority for the interface and its conformance suite. The private
adapter remains the authority for its schema, migrations, tenant isolation, and operational tests.

## Risks and mitigations

### Indirection weakens diagnostics

Mitigation: preserve adapter-qualified test names, keep fixture construction simple, and leave
mechanism-specific failures in their original suites.

### Capability flags become escape hatches

Mitigation: the mandatory base always runs; stronger behavior uses visible named extension
registrations. A separate truth table checks declarations when present. Never add a generic
“skip this invariant” option.

### The extraction creates churn without deletion

Mitigation: require meaningful consolidation or clearer single ownership. Abort if the result is
larger, more opaque, or coverage-reducing.

### A premature public API freezes the wrong shape

Mitigation: keep the first implementation under `packages/core/test/`; do not include it in build
outputs or package exports. Promotion waits for the Postgres consumer and core publication work.

### Database-specific realities distort the universal contract

Mitigation: discover those realities in the private adapter. Promote only semantics already
required by `StorageBackend`; keep database lifecycle and tenancy tests private.

## Recommendation

Approve the revised internal design as a valid, low-commitment quality improvement, but do not
prioritize implementation solely as speculative hosted preparation. Execute it when either:

1. current test duplication is selected as a bounded simplification unit, or
2. the Postgres adapter begins and supplies the external pressure needed to validate promotion.

Do not create a separate roadmap item merely for a test helper. Link the design to the existing
core-publication/hosted-boundary work and treat implementation as one narrowly scoped task if it
is scheduled.

The independent review is recorded at
[the StorageBackend contract testkit design review](../context-notes/storage-backend-contract-testkit-design-review.md).

[informs](../tasks/publish-core-package.md)

[supports](../roadmap-items/radical-simplification.md)
