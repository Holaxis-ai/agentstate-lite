---
type: Finding
title: Core/server test-dependency investigation
actor: openai/codex
timestamp: '2026-08-08T13:33:22.407Z'
---
# Hypothesis

Core's test/dev dependency on `@agentstate-lite/server` is a harmful layering inversion, and the
dependent tests should move to `packages/server` or a new contract-test workspace.

# Verdict

**OBSERVE/DEFER.** The test-scope cycle and isolated-test inconvenience are real. The claim that
moving the tests is currently a clear simplification is not established: the dependency is an
intentional integration-test fixture, the supported repository gate already builds siblings in
order, and several dependent cases belong semantically to core's cross-backend contract. Do not
create an implementation task without a stronger trigger and a case-by-case ownership matrix.

# Evidence boundary

- Evidence commit: `5806ece2c393f1c277f4a17a9006c1ba75eca86b` (`origin/main`, 2026-08-08).
- Scope inspected: core/server manifests and test suites, root build/test scripts, mutation CI,
  history for the dependency and contract suite, `CLAUDE.md`, the reviewed StorageBackend test-kit
  design and completion record, and the package external proofs.
- Empirical probes ran in a fresh detached worktree after `npm ci`; full output was redirected to
  `/tmp/core-audit-*.log`.

# Facts

1. `packages/core/package.json` has dev-depended on `@agentstate-lite/server` since the initial
   public commit (`deb0761`). `packages/server` runtime-depends on core. The all-scope workspace
   graph therefore has a dev/test cycle even though the production `src` graph is acyclic.
2. Five core test modules import the server:
   `wire-protocol.test.ts`, `storage-backend-contract.test.ts`, `query-heads.test.ts`,
   `kinds.test.ts`, and `okf-v0-2-read-compat.test.ts`.
3. Fresh-worktree probe: after `npm ci` and `npm run build -w @agentstate-lite/core`,
   `npm test -w @agentstate-lite/core` failed because `@agentstate-lite/server/dist/index.js` did
   not exist. Exactly those five test modules failed to load; 267 other tests passed. Building
   server and rerunning the same core test command passed.
4. This operational dependency is already explicit, not hidden. Root `npm run build` orders core
   before server, and root `npm run check` builds all siblings before workspace tests. `CLAUDE.md`
   requires root builds because sibling-dist imports otherwise manufacture confusing failures.
   `.github/workflows/mutation-tests.yml` specifically records that core mutation runs require the
   sibling server dist and performs a full root build first.
5. Test ownership is mixed rather than uniformly misplaced:
   - The 694-line `wire-protocol.test.ts` is predominantly raw router security, HTTP shape,
     headers/status/envelopes, and socket behavior—strongly server/wire-owned.
   - `storage-backend-contract.test.ts` deliberately registers Filesystem, Memory, and Remote
     against one core-owned contract. Remote uses the reference router as an in-process transport.
   - `query-heads.test.ts` combines core fallback/pushdown agreement with wire request-shape and
     pagination evidence.
   - `kinds.test.ts` contains one remote agreement case among a large core kinds suite.
   - `okf-v0-2-read-compat.test.ts` proves local/reference-wire projection agreement over an
     external fixture.
6. The reviewed StorageBackend test-kit design explicitly chose an internal core test helper and
   required RemoteBackend as the immediate third consumer. PR #160 then consolidated the suite,
   removed 150 lines, and kept wire mechanics separate. Moving the Remote registration away now
   would revisit that deliberate, independently reviewed ownership decision.
7. The packed-core external proof builds/packages core without server and rejects workspace imports
   in emitted production artifacts. Therefore the test dev-dependency does not leak into the core
   runtime/package surface.

# Inference

The concrete cost is developer/test ergonomics: a clean checkout cannot run the advertised core
workspace test script after building core alone, and mutation work must build more than the target
package. That is measurable. It is not presently a product, runtime, packaging, or CI-correctness
defect because every supported gate already establishes the required build order.

The tempting remedy—move all five files to server—would make server own core engine and storage
semantics. A new `contract-tests` workspace would restore graph direction but add a tenth workspace,
new scripts/build ordering, and another test-distribution authority. A correct split is possible,
but it is not a small file move and has no demonstrated net deletion today.

# Refutations and limits

- The phrase “core cannot be tested in isolation” is true for the package's current test script on
  a clean build, but false for production compilation/packaging: core builds and packs independently.
- The dependency has not created a production package cycle; `packages/core/src` remains free of
  server imports.
- No board record, recurring defect, or merge-conflict history was found showing that the required
  root build is currently blocking development. The source report supplied no timing/cost data.
- The empirical probe used the repository's current Node runtime; the failure is deterministic
  module resolution, not Node-version-specific.
- It remains plausible that moving the wire-only portion would clarify ownership, but that alone
  would not remove the dev dependency while the Remote contract registration remains in core.

# Promotion triggers

Reconsider as a task only if at least one occurs:

1. Core becomes a supported independently developed/published library whose documented workflow
   promises `npm test -w @agentstate-lite/core` after only a core build.
2. Repeated developer/CI failures or material mutation-run time are attributable to the sibling
   build requirement.
3. A real external adapter requires promoting the contract test kit, naturally creating a
   cross-package integration-test authority.
4. A before/after ownership matrix demonstrates that splitting wire mechanics and cross-backend
   agreement yields one clear owner per assertion plus meaningful deletion.

# Smallest coherent future unit if triggered

Do not start with a bulk move. First inventory every server-dependent test and classify each
assertion as core engine, storage contract, Remote adapter, or wire/server mechanic. Then choose one
of two explicit outcomes:

- keep the internal contract suite in core and accept/document the server test fixture, while moving
  only wire-owned assertions for clarity; or
- establish one intentionally named integration/contract-test workspace that depends downward on
  core and server, move only cross-package agreement there, and leave package-local mechanics in
  their owning suites.

Acceptance would require removal of core's server devDependency, a clean-worktree core-only
build+test proof, unchanged assertion ownership/diagnostics, and no duplicated contract helper.
That is a medium test-architecture unit, not a cheap manifest cleanup.

# Reproduction commands

```bash
git show -s --format='%H %cs %s' 5806ece2c393f1c277f4a17a9006c1ba75eca86b
rg -n '@agentstate-lite/server' packages/core
git log -S'"@agentstate-lite/server": "*"' -- packages/core/package.json
npm ci
npm run build -w @agentstate-lite/core
npm test -w @agentstate-lite/core        # fails: five modules cannot resolve server/dist
npm run build -w @agentstate-lite/server
npm test -w @agentstate-lite/core        # passes
rg -n 'sibling dists|npm run build' CLAUDE.md .github/workflows/mutation-tests.yml
```

# Relationship to existing work

This Finding preserves the decision in
[StorageBackend contract testkit](../designs/storage-backend-contract-testkit.md) and informs the
[simplification audit](../tasks/simplification-audit.md). It invalidates the report's implication
that the cycle is automatically a P1 relocation, while keeping the isolated-test cost visible for
future evidence-based promotion.
