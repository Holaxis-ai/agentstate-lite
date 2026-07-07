---
type: Plan
title: RECIPES UNIT A — "recipe zero" — binding per-file implementation plan
timestamp: '2026-07-06T16:48:25.193Z'
---
# RECIPES UNIT A — "recipe zero" — binding per-file implementation plan

Status: BINDING. Grounded in the tree at HEAD `9b23abf` (verified by reading every file named
in the brief; line numbers below are from that read). One focused, reviewable commit.

## Goal (one paragraph)

Pull the Context Note *seeding* out of `packages/core` and re-home it as GENERIC recipe
machinery in `packages/cli`, with `context-notes` as the first built-in recipe ("recipe
zero"). Core keeps ONLY the generic apply primitive it already has —
`writeDocVersioned(bundle, doc, { expectedVersion: null })` (expect-absent CAS) — plus the
generic `kindConventionDoc` serializer and the `KindConvention` type. The engine special-cases
NOTHING about conventions (gate 3): no `seedKinds`, no `seedContextNoteKind`, no hardcoded
kind installation. `context-notes` is the spec-test that a recipe must model a
convention-doc-WITH-A-BODY. The on-disk `conventions/context-note.md` an `init` produces stays
BYTE-IDENTICAL (modulo the always-dynamic timestamp).

---

## Design forks — resolved, with rationale grounded in the code

### Fork 1 — WHAT MOVES vs STAYS → clean MOVE (not the fallback)

MOVE, verbatim, into the CLI recipe registry (`packages/cli/src/recipes.ts`):
- `CONTEXT_NOTE_KIND` (`core/src/kinds.ts:447-455`) — the `KindConvention` that governs
  `"Context Note"`. It is a specific kind's *installation content*, not generic machinery.
- `CONTEXT_NOTE_SEED_BODY` (`core/src/bundle.ts:96-133`) — the seed prose body. Its only
  consumer is `seedContextNoteKind`; it is recipe CONTENT.

KEEP in core (all generic):
- `kindConventionDoc(kind, prose, timestamp)` (`kinds.ts:420-431`) — the generic
  `KindConvention → OkfDocument` serializer. The CLI recipe machinery REUSES it, which is
  exactly what guarantees the byte-identical seed (same serializer, same inputs).
- `KindConvention` / `KindFields` types, `loadKinds`, `validateAgainstKind`,
  `freshnessHorizonMs`, `CONVENTIONS_PREFIX`, `CONVENTION_TYPE` — the registry mechanism
  (gate 3: mechanism is core, non-negotiable).
- `CONTEXT_NOTE_TYPE = "Context Note"` (`note.ts:25`) — the type NAME, a shared identifier
  stamped by `noteToDoc` (`note.ts:197`) and read by the CLI note command
  (`note.ts:44,418`). `note.ts` is inherently about Context Notes; this is not the
  convention, it is the governed type's name. The moved `CONTEXT_NOTE_KIND` in the CLI
  imports `CONTEXT_NOTE_TYPE` from core for its `title`/`governs`, so the identifier keeps a
  single source.

Core's `kinds.test.ts` fixture usages of `CONTEXT_NOTE_KIND` (freshnessHorizonMs /
validateAgainstKind / kindConventionDoc round-trip) are re-homed onto a GENERIC local
synthetic `KindConvention` fixture inside the test file — those tests exercise the generic
derivation helpers and do not need the real context-note kind (see Test Migration).

Why NOT the fallback ("keep `CONTEXT_NOTE_KIND` exported from core as a generic example
constant, CLI imports it"): it would leave a specific-kind artifact in the engine's PUBLIC
API with no engine consumer — dead weight that re-invites the special-casing gate 3 forbids.
The move is proportionate: exactly ONE core file (a test) references the constant, and every
reference there is generic. `CONTEXT_NOTE_KIND` has NO importer outside `core/src` and that
one test (`grep` confirmed: `core/src/bundle.ts:143`, `core/src/index.ts:166`,
`core/src/kinds.ts:447`, `core/test/kinds.test.ts`; `dist/*` are regenerated build
artifacts).

### Fork 2 — REMOVE `seedKinds` vs keep a generic hook → REMOVE entirely

DELETE from core:
- `seedContextNoteKind` (`bundle.ts:135-149`) and `CONTEXT_NOTE_SEED_BODY`
  (`bundle.ts:88-133`).
- The `if (options.seedKinds) { … }` trigger (`bundle.ts:82-84`).
- The `InitBundleOptions.seedKinds` option + its doc comment (`types.ts:341-351`).
- The now-unused `import { CONTEXT_NOTE_KIND, kindConventionDoc } from "./kinds.js";`
  (`bundle.ts:17`). (`VersionConflict` import STAYS — still used by
  `appendLog`/`regenerateIndex`.)

Core stops seeding entirely. `initBundle(dir)` yields a bare OKF bundle; a conventions-free /
external bundle behaves byte-for-byte as before — strictly MORE standards-clean. The generic
apply primitive (`writeDocVersioned` expect-absent CAS) is already in core; no recipe concept
leaks in.

Every `seedKinds` call-site is migrated (full enumeration in Test Migration): the three core
seeding tests are deleted (one is kept, trimmed, as a "core never seeds" assertion); the CLI
test helpers switch to `initBundle(dir)` + `applyRecipe(...)`.

### Fork 3 — the VERB surface → `recipes` (list) + `recipe add <name>` (apply); `init` applies via the generic path

Final set:
- Internal (not a verb): `packages/cli/src/recipes.ts` — the in-code recipe registry, the
  `Recipe` type, and `applyRecipe(bundle, recipe)` (loops the recipe's convention docs through
  `writeDocVersioned` expect-absent CAS; idempotent; returns per-doc `changed`).
- `init` APPLIES the default `context-notes` recipe via `applyRecipe`, replacing
  `seedKinds: true`. New `--recipe <name>` flag (default `context-notes`; `--recipe none`
  opts out to a bare bundle). Omitting the flag reproduces today's behavior EXACTLY
  (byte-identical seed).
- `recipes` verb — list built-in recipes and, per recipe, whether it is already applied to
  the current bundle. Mirrors `kinds` (read-only, `--dir`/`--remote`, TOON, `count`).
- `recipe add <name>` verb — apply a named recipe to an EXISTING bundle, idempotent
  (`changed:false` receipt on a no-op). Mirrors `new` (create-only, expect-absent CAS).

This is the exact `kinds`(list)/`new`(create) precedent: `recipes` lists built-ins,
`recipe add` installs one. `init --recipe` proves the machinery is the SAME generic path
whether creating or extending a bundle. Each verb gets full AXI treatment (TOON, counts,
structured USAGE errors with the resolved invocation, idempotent `changed:false` receipts,
next-step hints) and `KNOWN_COMMANDS`/`cli.ts`/`reference.ts` registration.

OUT (Unit B / later — do NOT build): the `type: Recipe` manifest doc, a plain-files/folder
recipe loader, conflict/provenance semantics, the work-tracking recipe, cookbooks,
behavior-carrying recipe queries.

### Fork 4 — in-code recipe representation → convention docs WITH BODIES, as in-code data

```ts
// packages/cli/src/recipes.ts
export interface RecipeConventionDoc {
  kind: KindConvention;   // core type; serialized via core kindConventionDoc
  body: string;           // the convention doc's prose BODY (recipe zero's spec-test)
}
export interface Recipe {
  name: string;           // e.g. "context-notes"
  summary: string;        // one-line, for `recipes` + reference
  docs: RecipeConventionDoc[];
}
```

Recipe zero carries the full convention-with-a-body (`CONTEXT_NOTE_KIND` +
`CONTEXT_NOTE_SEED_BODY`), which is the whole point: a recipe must model a convention doc that
has a real body. In-code data only — no manifest doc type, no files loader (Unit B).

---

## Per-file edits

### CORE removals

**`packages/core/src/bundle.ts`**
- Delete line 17: `import { CONTEXT_NOTE_KIND, kindConventionDoc } from "./kinds.js";`.
- Delete the `seedKinds` trigger, lines 82-84:
  ```
  if (options.seedKinds) {
    await seedContextNoteKind({ root: resolved, backend });
  }
  ```
  (Leave the `backend`/`index.md` create above it intact; `initBundle` still returns
  `{ root: resolved }`.)
- Delete `CONTEXT_NOTE_SEED_BODY` + its doc comment (lines 88-133).
- Delete `seedContextNoteKind` + its doc comment (lines 135-149).
- Confirm `kindConventionDoc`/`CONTEXT_NOTE_KIND` have no other use in the file (grep: only
  17 and 143 — both removed). `VersionConflict`, `WriteResult`, `writeDocVersioned` stay.

**`packages/core/src/kinds.ts`**
- Line 23: `import { CONTEXT_NOTE_TYPE, splitSections } from "./note.js";` →
  `import { splitSections } from "./note.js";` (`CONTEXT_NOTE_TYPE` was used ONLY by
  `CONTEXT_NOTE_KIND` at 449-450; `splitSections` still used at 398).
- Delete `CONTEXT_NOTE_KIND` const + its doc comment (lines 433-455).
- Line 416 (inside `kindConventionDoc`'s doc comment): reword
  `"used to seed {@link CONTEXT_NOTE_KIND} and reusable for any future seeded/authored kind"`
  → `"used to serialize any KindConvention to its on-disk Convention-doc form (e.g. by the
  CLI's recipe machinery)"`. No behavior change.

**`packages/core/src/types.ts`**
- Delete `InitBundleOptions.seedKinds` + its doc comment (lines 341-351). `InitBundleOptions`
  keeps only `okfVersion?`.

**`packages/core/src/index.ts`**
- In the kinds.js export block (lines 163-172), delete `CONTEXT_NOTE_KIND,` (line 166). Keep
  `CONVENTIONS_PREFIX, CONVENTION_TYPE, loadKinds, validateAgainstKind, freshnessHorizonMs,
  kindConventionDoc`.

### CLI additions

**NEW `packages/cli/src/recipes.ts`** — the in-code recipe registry + generic apply.
- Imports: `writeDocVersioned`, `query`, `kindConventionDoc`, `CONVENTIONS_PREFIX`,
  `CONTEXT_NOTE_TYPE`, `VersionConflict`, and types `Bundle`, `KindConvention`, `ConceptId`
  from `@agentstate-lite/core`.
- Export `RecipeConventionDoc` / `Recipe` (Fork 4 shapes).
- Move `CONTEXT_NOTE_KIND` here VERBATIM (governs/title = `CONTEXT_NOTE_TYPE`, `path:
  "context-notes/"`, required `["title","timestamp"]`, optional `["description","tags"]`,
  `values:{}`, `sections:["Summary"]`, `freshnessHorizon:"24h"`). Export it (tests reference
  it).
- Move `CONTEXT_NOTE_SEED_BODY` here VERBATIM (the exact string from `bundle.ts:96-133`).
  Export it (the byte-identical test references it).
- `export const CONTEXT_NOTES_RECIPE: Recipe = { name: "context-notes", summary: "…", docs:
  [{ kind: CONTEXT_NOTE_KIND, body: CONTEXT_NOTE_SEED_BODY }] };`
- `export const BUILTIN_RECIPES: Recipe[] = [CONTEXT_NOTES_RECIPE];`
- `export const RECIPES_BY_NAME = new Map(BUILTIN_RECIPES.map(r => [r.name, r]));`
- `export const DEFAULT_RECIPE_NAME = "context-notes";`
- Generic apply (behavior-identical to the deleted `seedContextNoteKind`, now generalized +
  receipt-bearing):
  ```ts
  export interface RecipeDocResult { id: ConceptId; changed: boolean; }
  export interface ApplyRecipeResult { name: string; docs: RecipeDocResult[]; changed: boolean; }

  export async function applyRecipe(
    bundle: Bundle, recipe: Recipe, now: string = new Date().toISOString(),
  ): Promise<ApplyRecipeResult> {
    const docs: RecipeDocResult[] = [];
    for (const entry of recipe.docs) {
      const doc = kindConventionDoc(entry.kind, entry.body, now);
      let changed = true;
      try {
        await writeDocVersioned(bundle, doc, { expectedVersion: null }); // expect-absent CAS
      } catch (err) {
        if (err instanceof VersionConflict) changed = false; // already present → no-op (idempotent)
        else throw err;
      }
      docs.push({ id: doc.id, changed });
    }
    return { name: recipe.name, docs, changed: docs.some(d => d.changed) };
  }
  ```
- `appliedDocIds(bundle)` helper (ONE round-trip, backend-agnostic, works over `--remote`):
  `const ids = new Set((await query(bundle, { prefix: CONVENTIONS_PREFIX })).map(d => d.id));`
  A recipe is "applied" when `recipe.docs.every(e => ids.has(e.kind.id))`.

**NEW `packages/cli/src/commands/recipes.ts`** — `recipes` list verb (model: `kinds.ts`).
- Parse `dir`/`remote`/`json`/`help` (identical option block to `kinds.ts:73-82`).
- `openBundle(values.dir, resolveRemoteFlag(values.remote, values.dir))`; compute
  `appliedDocIds(bundle)` once; project each `BUILTIN_RECIPES` entry to a row `{ name,
  applied: boolean, docs: [kind ids], summary }`.
- Output `{ count: rows.length, recipes: rows }`; help hint
  `[`${cliInvocation()} recipe add <name>`]`. Full AXI (TOON, count).
- `RECIPES_USAGE` help string in the same shape as `KINDS_USAGE`.

**NEW `packages/cli/src/commands/recipe.ts`** — `recipe add <name>` apply verb (model:
`note.ts` sub-dispatch + `new.ts` expect-absent receipt).
- `const sub = argv[0]; const rest = argv.slice(1);` → `add` routes to `recipeAdd`; bare /
  `-h`/`--help`/`undefined` prints `RECIPE_USAGE`; anything else → `CliError("USAGE",
  "unknown recipe subcommand: … (expected add)", { help: `${cliInvocation()} recipe --help` })`.
- `recipeAdd(argv, stdout)`: parse positionals (`name = positionals[0]`) + `dir`/`remote`/
  `json`/`help`. If `name` missing or not in `RECIPES_BY_NAME` → `CliError("USAGE",
  "unknown recipe '<name>' (known: context-notes)", { help: `${cliInvocation()} recipes` })`.
- `openBundle(…)`; `const result = await applyRecipe(bundle, recipe);`
- Receipt: `{ recipe: "added", name: result.name, changed: result.changed, docs:
  result.docs, help: [`${cliInvocation()} recipes`, `${cliInvocation()} kinds`] }`. AXI:
  idempotent `changed:false`, structured errors, next-step hints. Works over `--remote` (goes
  through `writeDocVersioned` → `RemoteBackend.write` expect-absent CAS, the same path `new`
  uses over the wire).

**`packages/cli/src/commands/init.ts`** — apply the recipe via the generic path.
- Imports: `import { applyRecipe, RECIPES_BY_NAME, DEFAULT_RECIPE_NAME } from "../recipes.js";`
- Add `recipe: { type: "string" }` to the parseArgs option block (near `remote`, line 46).
- Replace lines 70-75:
  ```ts
  const root = resolveTargetDir(values.dir);
  const okfVersion = values["okf-version"]?.trim();
  const bundle = await initBundle(root, okfVersion ? { okfVersion } : {}); // core never seeds now
  const recipeName = values.recipe?.trim() || DEFAULT_RECIPE_NAME;
  let recipeApplied = "none";
  if (recipeName !== "none") {
    const recipe = RECIPES_BY_NAME.get(recipeName);
    if (!recipe) {
      throw new CliError("USAGE", `unknown recipe '${recipeName}' (known: ${[...RECIPES_BY_NAME.keys()].join(", ")}, or 'none')`,
        { help: `${cliInvocation()} recipes` });
    }
    await applyRecipe(bundle, recipe); // idempotent (expect-absent CAS) — same behavior as old seedContextNoteKind
    recipeApplied = recipeName;
  }
  ```
- Add `recipe: recipeApplied` to the receipt object (line 79-84). The DEFAULT (no `--recipe`)
  path applies `context-notes` exactly as `seedKinds:true` did → the on-disk convention doc is
  byte-identical. init's stdout is not byte-asserted anywhere (no init test file; only
  `remote.test.ts:337` exercises the `--remote` rejection), so the new `recipe` field is safe.
- Update `INIT_USAGE` (lines 16-26): add `[--recipe <name>]` to the usage line and an option
  line: `--recipe <name>   Apply a built-in recipe on create (default: context-notes; 'none'
  for a bare bundle)`. Update the comment at 72-74 to reference the recipe path, not
  `seedKinds`.

**`packages/cli/src/cli.ts`**
- `KNOWN_COMMANDS` (lines 46-69): add `"recipes",` and `"recipe",` (after `"kinds"`).
- Imports: `import { recipes } from "./commands/recipes.js";` and `import { recipe } from
  "./commands/recipe.js";` (after the `kinds` import, line 28).
- `commands` map (lines 150-184): add `recipes: wrap(recipes),` and `recipe: wrap(recipe),`
  (after `kinds: wrap(kinds),`).

**`packages/cli/src/reference.ts`**
- In `COMMAND_GROUPS`, the "Kinds" group (lines 109-121), append two `CommandRef`s:
  ```ts
  { usage: "recipes [--remote <url>]",
    summary: "List built-in recipes and whether each is already applied to this bundle" },
  { usage: "recipe add <name> [--remote <url>]",
    summary: "Apply a built-in recipe's convention docs to the bundle (idempotent: changed:false on a no-op)" },
  ```
  (Kept in the "Kinds" group — recipes install kind conventions; keeps the group set stable.)
  This single edit feeds `--help`, the home view, and both regenerated `SKILL.md` files.

### note-command coupling — CONFIRMED, no change

`packages/cli/src/commands/note.ts:44` imports `CONTEXT_NOTE_TYPE` (stays in core);
`note.ts:416-422` does `registry.kinds.get(CONTEXT_NOTE_TYPE)` on the LOADED registry. Two
paths, both unchanged:
- CLI-init'd bundle → `context-notes` recipe applied → `conventions/context-note.md` present →
  `loadKinds` finds the `"Context Note"` kind → 24h horizon fed into `maxAgeMs`.
- Bundle WITHOUT the recipe (external / conventions-free / `init --recipe none`) → `loadKinds`
  returns an empty registry → `get` returns `undefined` → no horizon applied (graceful,
  identical to an unseeded bundle today).

No edit to `note.ts`. A `recipes.test.ts` pair pins both paths explicitly (see Test Migration).

---

## Test migration — file by file

Every `seedKinds` call-site and every core `CONTEXT_NOTE_KIND` fixture usage, and what each
becomes.

### `packages/core/test/kinds.test.ts` (the heavy one)

- Header comment (lines 8-11): drop the `"seeding (engine default false, seedKinds: true
  idempotent via expect-absent)"` clause.
- Import (line 27): remove `CONTEXT_NOTE_KIND` from the `../src/kinds.js` import; ADD
  `type KindConvention` to that import (for the local fixture).
- Add ONE local generic fixture near the top (verbatim shape of the old `CONTEXT_NOTE_KIND`,
  so every downstream assertion is unchanged):
  ```ts
  const NOTE_KIND_FIXTURE: KindConvention = {
    id: "conventions/context-note", title: "Context Note", governs: "Context Note",
    path: "context-notes/",
    fields: { required: ["title", "timestamp"], optional: ["description", "tags"], values: {} },
    sections: ["Summary"], freshnessHorizon: "24h",
  };
  ```
- `freshnessHorizonMs` test (lines 339-346): swap the 6 `{ ...CONTEXT_NOTE_KIND, … }` →
  `{ ...NOTE_KIND_FIXTURE, … }`. Assertions unchanged.
- `validateAgainstKind` test (lines 348-399): rename to drop `CONTEXT_NOTE_KIND` from the
  title (e.g. `"…incl. the optional-empty-description + summary-only-section case"`); swap the
  two `CONTEXT_NOTE_KIND` uses (386, 395) → `NOTE_KIND_FIXTURE`. Assertions unchanged
  (`validateAgainstKind` never compares `doc.type` to `kind.governs`; the `type:"Context
  Note"` docs still validate against the fixture).
- `kindConventionDoc` round-trip test (lines 421-435): swap `CONTEXT_NOTE_KIND` (423) →
  `NOTE_KIND_FIXTURE`. Assertions (id `conventions/context-note`, path `context-notes/`,
  required/optional, horizon `24h`) unchanged because the fixture is shape-identical.
- Seeding tests (lines 437-494): 
  - KEEP + trim lines 439-448: rename to `"initBundle: core never seeds — a bare init carries
    no conventions/ doc"`; body already calls `initBundle(root)` then asserts
    `registry.kinds.size === 0`. This becomes the gate-3 "engine special-cases nothing"
    assertion. Update the section comment at 437 accordingly.
  - DELETE lines 450-469 (`seedKinds: true seeds … idempotent`) — `seedKinds` no longer
    exists in core. Coverage moves to CLI `recipes.test.ts` (byte-identical apply + recipe
    add idempotency).
  - DELETE lines 471-494 (`seedKinds: true does not disturb a hand-edited doc`) — coverage
    moves to CLI `recipes.test.ts` (does-not-disturb-hand-edited).

### `packages/cli/test/kinds.test.ts`

- Add import: `import { applyRecipe, CONTEXT_NOTES_RECIPE } from "../src/recipes.js";`
  (`initBundle` already imported from core).
- `makeSeededBundle` (lines 45-49): change body to
  `await initBundle(dir); await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);` and update
  the doc comment (`mirrors init's context-notes recipe`). This one helper edit keeps all 14
  dependent tests green (usages at 78, 109, 128, 148, 176, 203, 220, 237, 321, 349, 407, 442,
  464) — they now assert the RECIPE path produces the seeded convention.
- Line 98 (`initBundle(dir)` — conventions-free) and line 494 (`initBundle(dir)` — no
  seedKinds): UNCHANGED (already the bare path).
- `--remote` parity test (lines 544-545): change each `initBundle(x, { seedKinds: true })` to
  `await initBundle(x); await applyRecipe({ root: x }, CONTEXT_NOTES_RECIPE);` (apply to both
  `localDir` and `remoteDir` before `serve()`). Parity assertions unchanged.
- Seed round-trip test (line 569): `initBundle(dir, { seedKinds: true })` → `await
  initBundle(dir); await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);`. Rest unchanged.

### `packages/cli/test/doc.test.ts`

- Add import `import { applyRecipe, CONTEXT_NOTES_RECIPE } from "../src/recipes.js";`.
- `makeSeededBundle` (line 85): `initBundle(dir, { seedKinds: true })` → `await
  initBundle(dir); await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);`. `makeBundle`
  (bare) and `makeTaskBundle` unchanged.

### `packages/cli/test/promote-pull.test.ts`

- Add import `import { applyRecipe, CONTEXT_NOTES_RECIPE } from "../src/recipes.js";`.
- `makeSeededBundle` (line 44): same swap as above. `makeBundle` (bare) unchanged.

### NEW `packages/cli/test/recipes.test.ts` — the Unit-A test matrix

In-process command runs against a real temp fs bundle (mirrors `kinds.test.ts`); the
`--remote` case boots a real `serve()` (mirrors `remote.test.ts`). Covers:

1. **init applies context-notes BYTE-IDENTICALLY.** Run the `init` COMMAND in a fresh dir;
   read `conventions/context-note.md`; parse frontmatter/body. Assert `body ===
   CONTEXT_NOTE_SEED_BODY` (imported from `../src/recipes.js`) VERBATIM — the body is
   timestamp-free, so this is a full byte match of the largest, most fragile part. Assert the
   frontmatter minus `timestamp` deep-equals the expected map (type/title/governs/path/fields/
   sections/freshness_horizon) and that `timestamp` is a valid ISO string. (See Byte-Identical
   Verification below.)
2. **recipe add idempotency.** Bare `initBundle(dir)`; `recipe add context-notes` → receipt
   `changed:true`, doc `conventions/context-note` present; second `recipe add context-notes` →
   `changed:false`, on-disk bytes unchanged (read-compare before/after).
3. **recipe add does-not-disturb-hand-edited.** Bare init; `writeDoc` a hand-edited
   `conventions/context-note.md` (custom body, no horizon/path — as core's old test at 478-482
   did); `recipe add context-notes` → `changed:false`; re-read: the author's body + absent
   horizon/path SURVIVE (CAS lost the race, never clobbered).
4. **recipes list.** On a bare bundle: `recipes` → `count:1`, row `{ name:"context-notes",
   applied:false, … }`. After `recipe add context-notes`: `applied:true`.
5. **conventions-free bundle unaffected.** `init --recipe none` (or bare `initBundle`) →
   `kinds` `count:0`; `loadKinds` empty; behaves byte-for-byte as an external bundle.
6. **note command with / without the recipe.** WITH: seeded bundle, write an OLD note
   (>24h), `note read` → `stale` (the recipe's 24h horizon fired via `note.ts:418`). WITHOUT:
   `init --recipe none`, same old note → `fresh` (no horizon). Pins the coupling both ways.
7. **--remote parity for recipe add.** Bare `remoteDir`; `serve({ bundle:{root:remoteDir},
   port:0 })`; `recipe add context-notes --remote <url>` → doc lands over the wire
   (`changed:true`); second add → `changed:false`; compare the resulting receipt/kind shape to
   the same ops run locally.

### Byte-identical seed verification (the hard constraint)

Three layers, most-binding first:

- **In-suite golden (automated, primary):** `recipes.test.ts` test 1 asserts the on-disk body
  `=== CONTEXT_NOTE_SEED_BODY` verbatim and the frontmatter-minus-timestamp deep-equals the
  golden map. Because `applyRecipe` reuses the SAME core `kindConventionDoc` serializer with
  the SAME moved-verbatim inputs, and `writeDocVersioned`'s type-leads/timestamp-trails
  normalization is untouched, the produced key order (type, title, governs, path, fields,
  sections, freshness_horizon, timestamp) and body are byte-stable modulo timestamp.
- **Structural canary (migrated):** the old `"seeds conventions/context-note.md"` assertion
  now runs through the recipe path (via `makeSeededBundle` → `applyRecipe`) in
  `cli/test/kinds.test.ts` (id/required/optional/path/horizon).
- **One-time pre/post diff (manual smoke, recorded here):** BEFORE applying the refactor,
  build the CLI and run `init` in a temp dir; save `conventions/context-note.md`. AFTER the
  refactor, rebuild and run `init` again; `diff` the two files after masking the single
  `timestamp:` line — the diff MUST be empty. Command sketch:
  `diff <(grep -v '^timestamp:' before.md) <(grep -v '^timestamp:' after.md)`.
- **sample-bundle canary:** `examples/sample-bundle` is conventions-free and never re-init'd;
  `view` on it must still report 4 nodes / 7 edges (CLAUDE.md interop gate). If a change breaks
  its round-trip, the change is wrong.

---

## Docs / SKILL / reference regeneration

1. `packages/cli/src/reference.ts` COMMAND_GROUPS edit (above) is the single source. Then:
   - `npm run build:skill -w agentstate-lite` → regenerates `skills/agentstate-lite/SKILL.md`
     (bundles the CLI + `gen-skill --target skill`).
   - `npm run gen:skill -w agentstate-lite` → regenerates `packages/cli/SKILL.md`
     (`--target npm`).
   - Commit both regenerated `SKILL.md` files. `npm run check` runs `check:skill`,
     `check:skill:bundle`, `check:bundle` drift gates — all must pass (byte-compare of the
     committed bundle + generated SKILL).
2. Prose docs:
   - `docs/VISION.md:282`: `"init (seeds the Context Note kind)"` → `"init (applies the
     built-in context-notes recipe)"`.
   - `docs/NORTH-STAR.md:116`: `"agentstate-lite init seeds the built-in Context Note kind
     unconditionally"` → `"agentstate-lite init applies the built-in context-notes recipe
     (recipe zero) by default"`; line 125 `"under the seeded convention"` → `"under the
     applied context-notes recipe's convention"`.
   - `STATUS.md`: update lines 24, 187-188, 211, 216, 343 (each frames seeding as an
     `initBundle`/`seedKinds` engine behavior) to describe the recipe machinery: core no
     longer seeds; `init`/`recipe add` apply recipe zero via the CLI registry; the engine
     keeps only the generic `writeDocVersioned` expect-absent primitive.
   - `packages/core/src/kinds.ts:416` doc-comment reword (already listed under core edits).
   - `KINDS_USAGE` (`commands/kinds.ts:35-36`) still accurate (`init` still produces
     `conventions/context-note`); OPTIONAL: add a one-line cross-reference to `recipes`. Not
     required for green.
3. STATUS changelog: add a numbered row under `## What this pass changed (per item)`
   (after the current last item), e.g.:
   > **N. Recipe zero (Recipes Unit A).** Pulled Context Note seeding out of core: deleted
   > `seedContextNoteKind`, `CONTEXT_NOTE_SEED_BODY`, the `InitBundleOptions.seedKinds` option
   > + trigger, and the `CONTEXT_NOTE_KIND` export. The engine now special-cases nothing about
   > conventions (gate 3) — it keeps only the generic `writeDocVersioned` expect-absent CAS
   > primitive and the generic `kindConventionDoc` serializer. New CLI recipe registry
   > (`src/recipes.ts`): a `Recipe` (convention docs WITH bodies), `applyRecipe` (loops
   > expect-absent CAS, idempotent), `context-notes` as recipe zero (moved `CONTEXT_NOTE_KIND`
   > + seed body verbatim → byte-identical `conventions/context-note.md`). `init` applies the
   > default recipe via that generic path (`--recipe <name>`, `--recipe none` for a bare
   > bundle); new `recipes` (list + applied?) and `recipe add <name>` (idempotent) verbs.
   > Conventions-free/external bundles are byte-for-byte unaffected — strictly more
   > standards-clean.

---

## Confirmed NO-CHANGE files

- `packages/core/src/note.ts` — `CONTEXT_NOTE_TYPE` stays; `noteToDoc`/`docToNote` untouched.
- `packages/cli/src/commands/note.ts` — coupling reads the loaded registry; both paths work.
- `packages/core/src/kinds.ts` `kindConventionDoc` / `KindConvention` / `loadKinds` /
  `validateAgainstKind` / `freshnessHorizonMs` — behavior unchanged (only the
  `CONTEXT_NOTE_KIND` const + one import + one doc-comment change).
- `packages/cli/src/commands/kinds.ts` / `new.ts` — unchanged (recipes are adjacent, not a
  rewrite).
- `mutate.ts`, `bundle.ts` (CLI helper), `backend.ts`, `memory-backend.ts`,
  `remote-backend.ts`, `packages/server/*`, `packages/worker/*`, `packages/viewer/*` — no
  change.
- `examples/sample-bundle/*` — untouched; interop round-trip + `view` 4 nodes / 7 edges must
  still hold.
- Pre-existing uncommitted `M packages/server/src/router.ts` in the working tree is unrelated
  to this unit (`git diff --stat` shows it clean at read time) — do NOT fold it into this
  commit.

---

## Build / verify gate (must exit 0 before commit)

1. `npm run build` (bundles the CLI to `packages/cli/dist/agentstate-lite.mjs`) + `npm run
   typecheck`.
2. `npm test --workspaces --if-present` (core + cli + viewer). All migrated + new tests green.
3. Regenerate SKILL: `npm run build:skill -w agentstate-lite` + `npm run gen:skill -w
   agentstate-lite`; then `npm run check` (build + typecheck + tests + `check:skill` +
   `check:skill:bundle` + `check:bundle` drift gates) exits 0.
4. Smoke the BUILT CLI (`node packages/cli/dist/agentstate-lite.mjs …`):
   - `init` in a fresh temp dir → `conventions/context-note.md` present, and
     diff-identical to a pre-refactor `init`'s modulo the `timestamp:` line (one-time smoke).
   - `recipes` → lists `context-notes` (`applied:true` on the just-init'd bundle).
   - `recipe add context-notes` on the same bundle → `changed:false` (idempotent).
   - `note write` / `note read` still work; `list`, `link add`/`show`.
   - `view` on `examples/sample-bundle` → 4 nodes / 7 edges.
5. Publishability spot-check (optional, only if the bundle set changed materially): `npm pack
   -w agentstate-lite`, run the tarball bin in a temp dir; `node_modules` contains ONLY
   `agentstate-lite`.

Commit: one focused unit — "recipes: recipe zero — generic recipe machinery in the CLI,
context-notes as the first built-in; core stops seeding (gate 3)".
