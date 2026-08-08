---
type: Finding
title: Core import-direction gate investigation
actor: openai/codex
timestamp: '2026-08-08T13:33:22.250Z'
---
# Hypothesis

`packages/core` lacks an import-direction gate, and adding a source-level gate would be a cheap,
certain protection of the repository's bottom-layer invariant.

# Verdict

**PROMOTE TO TASK.** The measured dependency graph is healthy at the evidence commit, but the
strongest package-direction invariant is protected only indirectly. A focused production-source
gate would close a real executable gap without changing behavior.

# Evidence boundary

- Evidence commit: `5806ece2c393f1c277f4a17a9006c1ba75eca86b` (`origin/main`, 2026-08-08).
- Scope inspected: `packages/core/src`, `packages/core/package.json`, existing package import gates,
  `scripts/package-core-external-proof.test.mjs`, root scripts/CI, `CLAUDE.md`, and the current
  simplification/architecture board records.
- Analysis was read-only in a detached worktree. No application source was changed.

# Facts

1. `packages/core/src` contains 26 TypeScript modules. At the evidence commit its only non-relative,
   non-builtin runtime imports are `gray-matter` and `js-yaml`, exactly matching its two runtime
   dependencies. There is no `@agentstate-lite/*` source import and no runtime package-level cycle.
2. `CLAUDE.md` describes `core` as the engine/bottom layer and the current package graph depends on
   that direction: server and every other semantic consumer point toward core, never the reverse.
3. No `packages/core/test/import-direction.test.*` exists. AST import-direction gates exist for
   `board-git`, `ui-server`, and `view-runtime`; those gates reject static/re-export, dynamic,
   `require`/`createRequire`, path-escape, and manifest drift cases.
4. `scripts/package-core-external-proof.test.mjs` is valuable but protects a different boundary. It
   builds and packs core, installs it externally, then scans emitted `.js`/`.d.ts` for workspace and
   source-path imports. It does not prove the source graph itself, does not reject an erased
   type-only workspace dependency, and its regex does not cover every channel covered by the AST
   gates. It also does not require every non-workspace emitted import to be a declared dependency.
5. The root gate runs the external package proof only after a full build. A core-local source gate
   would fail earlier and name the exact source edge.
6. The challenged architectural-smell Claim already classifies this candidate as a plausible cheap
   guard requiring confirmation of the allowed contract. The current contract is now concrete:
   production core may reach Node builtins, its declared runtime dependencies (`gray-matter`,
   `js-yaml`), and relative modules that resolve inside `packages/core/src`—nothing else.

# Inference

An accidental type-only import from server/CLI would preserve runtime acyclicity and could survive
the external pack proof, yet it would still make the engine's types depend upward. An accidental
new runtime edge is likelier to be caught later by build/package proof, but only after more work and
with weaker localization. Turning the direction into a source-level test therefore provides distinct
protection rather than duplicating the packaging proof.

# Refutations and limits

- The code is **not currently violating** the production direction; this is preventive enforcement,
  not remediation of a present dependency defect.
- “About 30 lines” is optimistic if the robust existing AST pattern is copied faithfully. Expect a
  small test file closer to the other gates' size, not a one-regex check.
- This unit will add test LOC rather than reduce production LOC. Its value is executable invariant
  ownership, not code-size reduction.
- The test must not scan `packages/core/test` under the production rule: those tests intentionally
  participate in cross-package integration today, adjudicated separately in
  `findings/core-server-test-dependency-investigation`.

# Smallest coherent implementation unit

Add one core test that:

1. AST-walks only `packages/core/src/**/*.{ts,mts,cts,js,mjs,cjs}`.
2. Allows Node builtins, relative specifiers resolving inside `core/src`, and the manifest's declared
   runtime dependencies; rejects workspace imports, escaping relative paths, non-literal dynamic
   imports, import-equals, and `require`/`createRequire` channels.
3. Pins the runtime manifest to the intentional dependency set and rejects peer/optional dependency
   edges unless deliberately changed in the same reviewed unit.
4. Proves red with a temporary type-only upward import (or a synthetic scanner fixture), then green
   on the real tree.

Do not add `madge`, `jscpd`, a generic repository architecture framework, or test-scope restrictions
in this unit.

# Acceptance evidence

- Gate passes on exact current production source.
- A deliberate type-only `@agentstate-lite/server` edge fails with the source file/specifier named.
- A relative path escaping `core/src` and a non-literal dynamic import fail.
- A normal relative import and the two declared external dependencies pass.
- Core typecheck/tests and the repository gate remain green.

# Risk and likely net effect

Runtime risk is negligible because this is test-only. Maintenance risk is low and intentional: a
future legitimate core dependency must update the executable contract in the same PR. Net LOC is
positive, but the architectural rule moves from prose/reviewer memory into one machine-enforced
owner.

# Reproduction commands

```bash
git show -s --format='%H %cs %s' 5806ece2c393f1c277f4a17a9006c1ba75eca86b
find packages/core/src -type f -name '*.ts' | wc -l
rg -n '^import|^export .* from' packages/core/src
rg -n --glob '*import-direction*.test*' '' packages
rg -n 'importPattern|@agentstate-lite|src' scripts/package-core-external-proof.test.mjs
node -e 'const p=require("./packages/core/package.json"); console.log(p.dependencies, p.peerDependencies, p.optionalDependencies)'
```

# Relationship to existing work

This Finding informs the existing
[simplification audit](../tasks/simplification-audit.md) and
[change-surface simplification](../roadmap-items/change-surface-simplification.md). It does not
validate the architectural-smell report as a backlog; it promotes one independently verified,
narrow invariant guard.
