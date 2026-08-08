---
type: Finding
title: CLI source cycles are type-only and do not justify a standalone cleanup task
actor: openai/codex
timestamp: '2026-08-08T13:31:40.996Z'
---
# Scope

Investigate the two CLI dependency cycles reported by the quantitative architectural-smell survey against exact `origin/main` commit `5806ece2c393f1c277f4a17a9006c1ba75eca86b`. Distinguish runtime imports from erased type-only imports, then look for current runtime risk, build/tool friction, demonstrated change friction, or a false architectural claim.

# Verdict

**OBSERVE / DEFER. Do not create an implementation task.**

Both strongly connected components are real only in a source-level graph that counts type-only imports as runtime dependencies. The runtime module graph is acyclic. Neither component has produced a runtime initialization failure, TypeScript/esbuild failure, ownership ambiguity, or demonstrated maintenance defect. Removing them would be tiny, but the demonstrated benefit today is only making a type-insensitive cycle counter display zero. That is not enough reason to schedule a PR.

If a future unit adds a cycle gate, prefer a graph that understands TypeScript type erasure. If the selected gate cannot do that, these imports can be cleaned up opportunistically in the same gate-enablement unit rather than tracked as product work.

# Exact graph evidence

A TypeScript-AST pass over all 86 files under `packages/cli/src` classified each relative import/export as runtime or type-only, resolved `.js` specifiers to their `.ts` sources, and ran Tarjan SCC twice.

All-source graph:

- `recipe-source.ts -> recipe-resolver.ts -> recipe-source-builtin.ts -> recipes.ts -> recipe-source.ts`
- `commands/sync/establish.ts -> commands/sync/establish-committed.ts -> commands/sync/establish.ts`

Runtime-only graph: **zero strongly connected components**.

The closing edges are exactly:

- `recipes.ts:46`: `import type { LoadedRecipe } from "./recipe-source.js"`
- `commands/sync/establish-committed.ts:50`: `import type { EstablishOutcome } from "./establish.js"`

With this repository's `verbatimModuleSyntax: true`, TypeScript emission removes both closing edges. A `transpileModule` probe of both files emitted no corresponding import. Therefore there is no ESM initialization order or temporal-dead-zone risk in the current executable graph.

The report's `madge@8` command was reproduced. It exits 1 and reports two cycles because it includes type-only edges:

```text
1) recipe-source.ts > recipe-resolver.ts > recipe-source-builtin.ts > recipes.ts
2) commands/sync/establish.ts > commands/sync/establish-committed.ts
```

That establishes a limitation of the proposed gate, not a runtime defect.

# Relocation claim and current ownership

The report's recipe recommendation is partly stale. `LoadedRecipe`, `RecipeSource`, and `RecipeFile` already live in the leaf `recipe-parser.ts`; commit `e46a356` moved them there during the reviewed recipe-source responsibility refactor. `recipe-source.ts` is now the documented stable public facade and only re-exports those types. Eliminating the source-only cycle would be a one-line internal-import change in `recipes.ts`, not a type relocation.

`EstablishOutcome` still lives in `establish.ts` and is used by both establishment case modules. Moving it into `sync-outcomes.ts` would mix an internal control-flow return type into the authority for rendered refusal/guidance rows. A new leaf module would eliminate the source-level cycle but add a file for a two-variant type. Neither has a demonstrated ownership benefit. If touched opportunistically, the smallest solution is either a dedicated leaf type or moving the shared type to the already-imported committed-case module; choose based on the next real change, not the metric.

# Change-friction check

- The recipe facade import has existed since the initial public release; the July 15 source-responsibility refactor moved the type authority without any attributed defect from the remaining facade import.
- The establish type edge was introduced by the July 18 behavior-frozen phase carve. No defect or subsequent change in its history is attributable to the type-only edge.
- Current TypeScript builds intentionally require explicit `type` syntax, making an accidental conversion to a value dependency visible in the diff.
- No current CI, build, or repository rule invokes a source-level zero-cycle gate.

# Promotion threshold

Promote only if one of these becomes true:

1. A real runtime/value cycle appears.
2. TypeScript, esbuild, test isolation, or editor/tooling produces a reproducible failure caused by either component.
3. A justified import-direction/cycle gate is selected and cannot correctly exclude type-only edges.
4. A real change to one of these clusters makes the one-line or leaf-type cleanup effectively free and clarifies ownership.

At that point, executable proof should compare both graphs before and after: runtime SCC count remains zero, all-source SCC count drops for the touched component, TypeScript emission remains unchanged, and the focused recipe or sync-establish tests pass.

# Reproduction commands

Evidence commit:

```text
5806ece2c393f1c277f4a17a9006c1ba75eca86b
```

Type-insensitive survey command:

```bash
npx -y madge@8 --extensions ts,tsx --ts-config tsconfig.json --circular packages/cli/src
```

History/ownership probes:

```bash
git blame -L 40,50 -- packages/cli/src/recipes.ts
git blame -L 45,55 -- packages/cli/src/commands/sync/establish-committed.ts
git show --stat e46a356
git log -S'LoadedRecipe' --oneline -- packages/cli/src/recipe-parser.ts packages/cli/src/recipe-source.ts packages/cli/src/recipes.ts
git log -S'EstablishOutcome' --oneline -- packages/cli/src/commands/sync/establish.ts packages/cli/src/commands/sync/establish-committed.ts
```

[investigates claim](../claims/architectural-smell-report-remediation.md)

[informs task](../tasks/simplification-audit.md)
