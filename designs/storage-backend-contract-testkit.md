---
type: Design
title: >-
  StorageBackend contract suite: internal first, external only with a real
  adapter
actor: codex
timestamp: '2026-07-25T02:47:08.780Z'
---
# StorageBackend contract suite: internal first, externally reusable only with a real adapter

## Decision summary

Consolidate the universal `StorageBackend` behavior that is already exercised across
`FilesystemBackend` and `MemoryBackend` into one internal, parameterized Node test suite.
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
2. Keep Filesystem and Memory as active consumers of that contract.
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

It exports a Node-test registration function and fixture types:

```ts
export interface StorageBackendFixture {
  backend: StorageBackend;
  cleanup(): Promise<void>;
}

export interface StorageBackendContractOptions {
  name: string;
  create(): Promise<StorageBackendFixture>;
}

export function storageBackendContract(
  options: StorageBackendContractOptions,
): void;
```

Every individual contract test creates a fresh fixture and always calls `cleanup` in `finally`.
Fresh-per-test isolation is required because a future database implementation must be able to use
a unique `bundle_id` and exercise real concurrent connections without shared-state leakage.

The current suites register at least:

```ts
storageBackendContract({
  name: "FilesystemBackend",
  create: createFilesystemFixture,
});

storageBackendContract({
  name: "MemoryBackend",
  create: createMemoryFixture,
});
```

The test kit uses Node's built-in test runner because that is the repository's existing authority.
Framework neutrality is not a goal.

## Universal contract coverage

The internal suite should include behavior that every conforming backend is required to share:

- document write/read round trip;
- content-addressed version stability;
- unconditional overwrite returns the final version;
- `expectedVersion: null` means create only when absent;
- stale expected versions throw the typed `VersionConflict` and do not mutate;
- concurrent CAS writers against one version produce exactly one winner when
  `capabilities().enforced_cas` is true;
- `readMany` preserves input order and has the documented missing-document behavior;
- `list` is sorted and honors prefix filtering;
- delete is idempotent and honors its CAS contract;
- `versions` is newest-first and reports at least the current version;
- actor/history behavior agrees with the adapter's declared capability;
- reserved-file read/write and CAS semantics;
- blob byte preservation, content-addressed versions, create-if-absent, deletion, and listing
  when the adapter declares real blob support;
- `queryHeads` results agree with engine query semantics when the adapter implements projection
  pushdown;
- declared capabilities accurately describe the behavior the contract observes.

Required semantics may not be skipped through arbitrary harness flags. Conditional cases are
driven only by capabilities already modeled on `StorageBackend`, and the suite must verify those
claims rather than merely trust them.

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

1. Inventory the repeated adapter-runner cases in `dual-backend.test.ts` and `blob.test.ts`.
2. Classify each as universal, capability-conditional, or adapter-specific.
3. Move only universal and capability-conditional cases into the internal contract module.
4. Register Filesystem and Memory against the new module.
5. Leave the existing specialized tests in place.
6. Compare test counts/names before and after and prove no contract assertion disappeared.
7. Run core typecheck, core tests, mutation survivors relevant to the moved code, and the full
   repository gate appropriate for a test-only refactor.

The first PR should make one behavioral claim: the same storage contract is now declared once and
run against both existing in-process adapters. It should not publish a package or alter production
exports.

## Acceptance criteria for the internal unit

- Filesystem and Memory both consume the same internal contract function.
- No production source or npm export changes.
- Existing adapter-specific tests remain explicit.
- Universal assertion coverage does not decrease.
- Test names identify both adapter and failed contract.
- There is meaningful consolidation or clearer invariant ownership; a wrapper that merely hides
  the existing loops without reducing drift is not sufficient.
- The full relevant test gate remains green.
- Review confirms optional capability branching cannot silently waive required semantics.

If these criteria cannot be met without a large or opaque rewrite, do not perform the extraction.
The current duplicated runner structure is preferable to a worse abstraction.

## Future external promotion

When an actual Postgres adapter exists, its private repository should initially supply a fresh
fixture backed by a disposable real Postgres database and unique bundle ID. It must not use a
mock database for CAS or concurrency claims.

Only then should the stable internal suite be considered for a supported export, for example:

```ts
import type { StorageBackend } from "@holaxis/aslite/core";
import { storageBackendContract } from "@holaxis/aslite/testing";
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

Mitigation: branch only on the existing capability declaration, assert the declaration itself,
and never add a generic “skip this invariant” option.

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

Approve the internal design as a valid, low-commitment quality improvement, but do not prioritize
implementation solely as speculative hosted preparation. Execute it when either:

1. current test duplication is selected as a bounded simplification unit, or
2. the Postgres adapter begins and supplies the external pressure needed to validate promotion.

Do not create a separate roadmap item merely for a test helper. Link the design to the existing
core-publication/hosted-boundary work and treat implementation as one narrowly scoped task if it
is scheduled.

[informs](../tasks/publish-core-package.md)

[supports](../roadmap-items/radical-simplification.md)
