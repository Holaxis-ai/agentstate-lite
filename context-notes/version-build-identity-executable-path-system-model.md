---
type: Context Note
title: Executable-path identity system model after QA rejection
actor: openai/codex
timestamp: '2026-07-31T22:16:14.657Z'
---
# Summary

The CLI has one production entry but two execution shapes: one-file bundled and multi-module source. The durable correction is explicit entry registration from `src/index.ts`, consumed by the existing shared invocation resolver, rather than another path heuristic.

# Purpose

This model is required before a third identity-path intervention. It describes the whole executable-resolution system, not only the rejected symptom.

# Components and interactions

1. `src/index.ts` is the sole production CLI entry. In an esbuild artifact it and every imported module become one `.mjs`; in a loader-driven source run it remains a distinct `src/index.ts` module.
2. `src/invocation.ts` owns executable path, PATH-bin matching, emitted invocation, home `bin`, and persistent hook command selection. Its current `import.meta.url` is the whole `.mjs` only after bundling; in source it is merely `src/invocation.ts`.
3. `src/build-identity.ts` consumes invocation path truth to hash actual executing bytes, report runtime path/evidence, and inspect only the adjacent manifest for drift. It must not independently guess a different executable.
4. `skill install`, home/session-start, hook install, version output, and PATH evidence all consume the same invocation resolver. A correction must preserve their one-path agreement.
5. `scripts/build-bundle.mjs` bundles `src/index.ts`; source tests launch `src/index.ts` through the TypeScript loader; ordinary unit tests import helpers without launching the production entry.

# Ordering and external state

The production entry is evaluated before `main()` dispatches any command. That gives it a safe moment to explicitly register its own `import.meta.url` as the execution entry. Bundled registration resolves to the emitted `.mjs`; source registration resolves to `src/index.ts`. Helper-only unit tests never evaluate the entry and retain the helper-module fallback they deliberately fixture. PATH and argv are mutable process evidence evaluated after registration; symlinks are canonicalized with realpath.

# Invariants

- One explicit production-entry registration is the highest-authority executable path.
- Bundled identity hashes the complete emitted `.mjs`; source identity hashes the launched `src/index.ts`, never an imported helper or the test runner.
- PATH aliases compare canonical targets to that same registered entry.
- Missing registration/path degrades to the existing helper/argv fallback without inventing certainty.
- Concrete npm/PATH/direct evidence outranks directory-name hints. A `.ts` suffix or `/src/` layout may select source mode only with `inferred` confidence.
- Home, hook, skill, and build identity may not fork into separate path authorities.
- Ordinary tests that import `invocation.ts` without `index.ts` must remain hermetic; production integration tests must exercise the real registered entry.

# Corrective design and proof

Add an idempotent internal entry-registration function to `invocation.ts`; call it synchronously from `index.ts` with `fileURLToPath(import.meta.url)` before `main`. Resolve the registered canonical path first. Add a real loader-driven source integration test that compares reported path and SHA-256 with `src/index.ts`, plus retain built copied/PATH/npx tests. Re-review the new exact SHA, then rerun adversarial QA and only afterward the repository/package gates.

# Goal link

Proximate goal: make executable identity name and hash the true launched entry in both bundle and source modes. This serves the ultimate goal by making every diagnostic and integration projection traceable to the bytes that actually entered the CLI.
