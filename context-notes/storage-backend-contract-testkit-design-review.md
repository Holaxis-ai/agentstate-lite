---
type: Context Note
title: StorageBackend contract testkit design review
actor: codex
timestamp: '2026-07-25T02:52:00.478Z'
---
# Summary

## Verdict

Approve the internal-first and public-later direction, but revise the design before implementation. The current proposal has a sound scope boundary around production code and publication, yet its capability-driven conditional model is not implementable from the present interface without silent skips. The first internal unit should be a narrow mandatory base contract plus explicitly registered extension contracts. `RemoteBackend` should be an immediate third consumer.

This review is grounded in `packages/core/src/types.ts`, the current dual/backend, blob, query-heads, wire-protocol, and capability suites, and the package manifests and external-pack proof.

## Required changes

1. **Replace hidden capability branches with named contract modules.** `StorageBackend.capabilities()` is optional. Today only `FilesystemBackend` implements it; `MemoryBackend` and `RemoteBackend` do not. Router-side `instanceof` inference is a wire compatibility mechanism and cannot be used by an external test kit. Use visible registrations such as `storageBackendBaseContract`, `storageBackendBlobContract`, `storageBackendAtomicCasContract`, `storageBackendHistoryContract`, and `storageBackendQueryHeadsContract`. The base contract must always test sequential version/CAS/create-if-absent semantics. An adapter cannot escape those required interface semantics by omitting or understating capabilities.

2. **Define a capability truth table, separately from conformance.** `enforced_cas: true` may require the multi-peer exactly-one-winner race; `false` still must pass sequential stale-CAS rejection. `history: true` requires retained newest-first attribution; `false` requires an honest current-only result. Absence supports only the mandatory `versions()` baseline. `queryHeads` must be gated by method presence, not `projections`: current router capability reporting defaults projections to true even for Filesystem and Memory, which do not implement backend `queryHeads`. `blobs: false` has no typed unsupported behavior in `StorageBackend`, so the kit cannot infer or verify a blob skip from the interface. Keep blob conformance as an explicit extension registration until that contract is clarified. Cross-check a declaration when present, but do not let the declaration choose which mandatory tests run.

3. **Register `RemoteBackend` against the universal suite now.** It is already the third backend and the CLI is a real consumer. `wire-protocol.test.ts` and `query-heads.test.ts` already repeat document, CAS, create-if-absent, delete, readMany, blob, and head parity cases through an in-process router. Run the base and applicable extension contracts against that fixture, while retaining raw HTTP status/envelope/header, request-shape, pagination, thinness, retry, and auth tests as wire-specific coverage. Without Remote, the first extraction mostly repackages the existing two-adapter loops and does not demonstrate reuse.

4. **Require a before/after ownership matrix, not only test counts.** The current `RUNNERS` loops already define each assertion body once for Filesystem and Memory. Moving those bodies into a registration function does not itself remove assertion duplication. Map every moved case to one of: direct seam contract, engine/backend agreement, adapter mechanic, or wire mechanic. Record which old assertion is deleted or retained and why. The extraction is meaningful if it removes the duplicated Remote semantic cases, consolidates fixture lifecycle, and leaves one clear owner per invariant. Test counts alone are weak because parameterized registration changes reporting without proving assertion parity.

5. **Tighten the universal versus adapter boundary.** A backend contract should directly exercise seam methods. Engine `writeDoc`/`deleteDoc`, reserved-id policy, `query`, malformed Markdown resilience, and pushdown re-filtering are engine or agreement tests and should not be absorbed into the base kit. Conversely, blob key namespace safety is described as guarded at every operation and is already asserted across adapters; it needs an explicit contract owner rather than being swept into the filesystem path-traversal exclusion. Make an explicit decision for unsafe concept ids and reserved dirs as well, since current dual-backend and wire security tests treat them as parity/security behavior even though the interface prose assigns id safety to the engine.

6. **Make database concurrency multi-client by construction.** A fresh unique bundle id per test gives isolation but does not prove concurrent database connections. The atomic-CAS fixture must be able to create at least two independent backend instances or clients targeting the same namespace, and the race must assert that the operations used distinct checked-out connections. Keep migration, RLS, tenancy, and failure-recovery tests private, but require the reusable CAS race to run on a real disposable Postgres instance with separate clients and no mock. A single backend object over a pool is insufficient evidence because it may serialize internally or reuse one client.

7. **Correct the future package coordinate.** The repository currently has a private, packable `@agentstate-lite/core` package with explicit exports and an external scratch-install proof. `@holaxis/aslite` is the bundled CLI and exposes bins, not core subpaths. The future example should follow the decision in `tasks/publish-core-package`, such as `@agentstate-lite/core` plus an intentional testing subpath or companion package, unless that publication task explicitly changes the coordinate. The current `@holaxis/aslite/core` and `@holaxis/aslite/testing` example conflicts with the code and linked board task.

## Sequencing assessment

Internal first and public later is correct. The core package remains `private: true`, version `0.0.0`, and its `files` allowlist contains only `dist`; publishing a test helper now would create semver and test-runner support obligations before the public core surface is decided. The existing pack proof lowers packaging risk but does not make the surface supported. Public promotion should remain coupled to `tasks/publish-core-package` and a real external adapter.

The internal unit is worthwhile before Postgres only if RemoteBackend is included or the ownership matrix shows comparable consolidation. Otherwise the existing runner loops are already a reasonable single-definition mechanism and the new helper would mainly add indirection.

## Optional refinements

- Use fresh fixture cleanup in `finally` as proposed, and add a failed-setup/cleanup test for the harness itself before publication.
- Preserve adapter-qualified subtest names and keep one small deliberately failing fake-adapter test to prove diagnostics point at the violated invariant.
- Compare moved assertions against relevant mutation survivors, but treat survivor parity as stronger evidence than raw test-count parity.

[reviews](../designs/storage-backend-contract-testkit.md)
