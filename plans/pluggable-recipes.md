---
type: Plan
title: Pluggable Recipes — Binding Architecture + Implementation Plan
status: >-
  DESIGN — awaiting human sign-off (do NOT implement until the KEY DECISIONS in
  §B are answered)
scope: >-
  Stage-1, recipe-pattern clean-up. The clean PLUGGABLE recipe pattern ONLY —
  re-host recipe zero, prove external load. NO domain recipes, NO cookbooks, NO
  plugin/URL channel.
grounded_in: >-
  packages/cli/src/recipes.ts, commands/{recipe,recipes,init}.ts;
  packages/core/src/{kinds,paths,bundle,memory-backend,frontmatter,types}.ts
  (all read, not trusted from the proposals)
timestamp: '2026-07-06T16:49:22.396Z'
---

# Pluggable Recipes — Binding Architecture + Implementation Plan

The human directive: **"Make the pattern super clean before adding recipes. Recipes should be
PLUGGABLE, and our architecture should cleanly support that."** One recipe exists today
(`context-notes`, recipe zero), shipped as in-code data. Before domain recipes land, built-in
AND external recipes must plug in through **one path**, and a recipe must be portable **DATA**,
not hardcoded CLI code.

This document (a) adversarially critiques the two proposals against the real code, (b) picks a
recommended architecture (a MERGE, biased to Proposal B's seam), (c) lists the yes/no decisions a
human signs off, (d) gives a binding per-file plan + test matrix + gate steps, (e) carries forward
explicit non-goals.

---

## 0. Adversarial critique of the two proposals (grounded in the real code)

Both proposals agree on the non-negotiable spine and both are correct about it:

- `applyRecipe` stays the ONE apply verb; its input widens from `{kind, body}` to `OkfDocument[]`
  so an external recipe (raw markdown, no typed `KindConvention`) flows through unchanged. Verified
  against `recipes.ts:158` — the loop is already `writeDocVersioned(bundle, doc, {expectedVersion:
  null})`; only how `doc` is produced changes.
- **Zero core changes.** Every primitive the loader needs is already exported: `parseMarkdown`,
  `stringifyDoc`, `kindConventionDoc`, `conceptIdFromPath`, `assertSafeConceptId`, `isReservedFile`,
  `writeDocVersioned`, `VersionConflict`, `query`, `loadKinds`, `CONVENTIONS_PREFIX`,
  `FilesystemBackend`, `MemoryBackend`. Gate 3 holds by construction.
- **Reference, not inline.** Conventions are sibling `.md` files, never YAML-inlined into the
  manifest — decided by the degradation litmus, not taste. Both proposals reach this; it is correct.
- **Lean required `type: Recipe` manifest** (`id/title/version/summary`), a stable id + version
  independent of a rename-able folder name.
- **Name-vs-path disambiguation** lives in the resolver (npm-style: a separator/`./`/`~` means path,
  else a name).
- **Reserved-but-not-built:** `version` (no dependency resolution v1), a `type: Cookbook` layer,
  the plugin/URL channel as a third source. None precluded, none built.

The proposals diverge on exactly **one thing: the shape of the source seam** — and that divergence
is the whole decision.

### Proposal A — "a recipe source resolves to a read-only `Bundle` backed by a `StorageBackend`"

**(1) Pluggability — real?** Yes, genuinely single-path: both built-in and external flow through
`loadRecipe(source)` → `source.open(): Bundle`. No special-case branch past source selection. ✔

**(2) Cleanliness / minimalism — the failure.** A reuses the **storage seam as the source seam**.
That is over-engineered for what a recipe source is:
- A recipe source is a **read-only byte bag**. `StorageBackend` is a read/write/CAS/versions/blobs/
  delete concurrency contract. Binding the former to the latter drags in ~10 methods a source never
  needs.
- Verified cost: **`MemoryBackend` has no seed constructor** (`memory-backend.ts:91` — it starts
  empty; docs enter only through `write`). So A's "`EmbeddedSource` seeds a `MemoryBackend` from the
  embedded file map" is not free — it is: parse each embedded file → `write` it into a fresh backend
  at `conceptIdFromPath(relPath)` → then `query` it back → then `loadKinds` over it. That is a full
  backend + query round-trip + registry load **per recipe load**, to obtain bytes already in hand.
- It **conflates two seams** (storage vs. sourcing). "One clean thing" is the goal; this is two
  things wearing one interface.

**(3) OKF-profile + degradation litmus.** ✔ Reference-not-inline; a recipe folder degrades to a
mini-bundle of `Convention` docs + an ignorable `Recipe` doc.

**(4) Safety.** ✔ Enumerated (path root, manifest validation, `loadKinds` skip-with-warning, engine
id/reserved guards on apply, expect-absent CAS, no execution). Sound.

**(5) Gate 3.** ✔ Zero core changes; all in `packages/cli/src/recipes/`.

**(6) Future channels / cookbooks.** ✔ A third `RecipeSource` is the extension point; cookbook
reserved. But A **adds two moving parts the brief did not earn**:
- a **`gen-builtins` codegen + drift gate + an authored `packages/cli/recipes/**` folder**, because
  on-disk built-in files do not survive the single-file esbuild bundle (real constraint — verified:
  `packages/cli/package.json` bin is one `dist/agentstate-lite.mjs`; `npm pack` invariant is
  "node_modules contains ONLY agentstate-lite"). This **duplicates built-in bytes** (authored folder
  + generated module) behind a new CI gate.
- a **provenance `type: Recipe` doc written under `conventions/recipes/<id>.md` on every apply**,
  changing `init`'s on-disk output and adding a second data source to the `recipes` command.

A's provenance-doc idea is genuinely clever (a `type: Recipe` doc is invisible to `loadKinds`, which
queries `type: Convention` — verified `kinds.ts:300` — so it does not pollute the registry, yet
degrades cleanly). It is worth **reserving**, but building it in v1 is scope the "super-clean minimal
seam" brief explicitly warns against.

### Proposal B — "a recipe source resolves a ref to `RecipeFile[]`, one pure `parseRecipeFiles`"

**(1) Pluggability — real?** Yes, and the seam abstracts **exactly** the one thing that legitimately
differs: byte acquisition. `builtinRecipeSource.resolve` → `BUILTIN_FILES[ref]`;
`filesRecipeSource.resolve` → `readRecipeDir(realpath)`. **Both call the identical
`parseRecipeFiles(files, source)`.** There is no `if builtin` anywhere downstream. ✔✔

**(2) Cleanliness / minimalism — the win.** The seam is a one-method provider plus one pure function.
No `StorageBackend`, no `MemoryBackend` seeding, no `query` round-trip to load a recipe. Built-in
bytes are **in-code constants built at module load from `kindConventionDoc(...) → stringifyDoc(...)`**
— so **no codegen, no drift gate, no authored on-disk folder, the single-file bundle and `npm pack`
invariant are untouched.** This is decisively the lower-ceremony seam and directly honors the
cleanliness bar.

**(3) OKF-profile + litmus.** ✔ Same reference-not-inline decision; same clean degradation.

**(4) Safety.** ✔ Enumerated and thorough: `realpath` + `isDirectory`, bounded read (only `recipe.md`
+ `conventions/**/*.md`), `conceptIdFromPath` + `assertSafeConceptId` + must-start-with `conventions/`,
`isReservedFile` reject, expect-absent CAS defense-in-depth, structured `RecipeError` taxonomy
(`NOT_FOUND/MALFORMED/EMPTY/UNSAFE_PATH`) mapped to `CliError("USAGE")` — no raw stack to the user.

**(5) Gate 3.** ✔ Entirely command-layer; zero core changes.

**(6) Future channels / cookbooks.** ✔ A third `RecipeSource` appends to `DEFAULT_SOURCES`; cookbook
= N `applyRecipe` calls, not precluded. Applied-state stays **derived** (`appliedDocIds`, existing) —
provenance-of-record is reserved, not built, so `init`'s on-disk output is unchanged.

**B's honest costs** (accepted): built-in is a folder-shaped `RecipeFile[]` in memory rather than
loose `.md` on disk (an `eject` affordance is the reserved fix); byte-identity of recipe zero rides
on the timestamp-key-replaced-in-place trick (guarded by a test); `recipes` lists only built-ins
(external recipes are path-addressed, not enumerable — a reserved `recipes --path` inspect).

### Verdict

**Adopt Proposal B's seam wholesale.** It is the minimal, purpose-built source seam; A's
"source = a storage backend" is elegant-sounding over-abstraction that the brief's cleanliness
priority rules against, and A's codegen + in-bundle provenance-doc are scope the brief did not earn.
**Import three things from A** (all as framing/reserved decisions, not new v1 machinery): the crisp
degradation-litmus argument (both agree), the pre-decision that IF provenance-of-record is ever
built it takes A's `type: Recipe`-doc form (invisible to `loadKinds`), and A's explicit statement
that duplicate-`governs` against the **target** bundle is surfaced post-apply via `loadKinds(bundle)`
in the receipt — which B already does.

---

## A. Recommended architecture

A recipe is portable OKF **data**: a folder that is itself a minimal OKF sub-tree —

```
<recipe>/
  recipe.md                 # REQUIRED manifest — type: Recipe, lean: id / title / version / summary
  conventions/
    <kind>.md               # type: Convention — a real kind-convention doc (one or more)
```

Loading a recipe is: **acquire its files as bytes → parse+validate → materialize a common
in-memory `LoadedRecipe` → hand it to the existing `applyRecipe` (expect-absent CAS).** The source
seam abstracts *only* byte acquisition.

### The seam (one interface + one pure pipeline)

```ts
// packages/cli/src/recipe-source.ts   (NEW — command layer)

/** A recipe file: path relative to the recipe root (posix), bytes = raw markdown. */
interface RecipeFile { path: string; bytes: string; }

/** The common shape every source produces and applyRecipe consumes. */
interface LoadedRecipe {
  id: string; title: string; version: string; summary: string;
  source: string;               // "builtin:context-notes" | absolute dir — for receipts (+ future provenance)
  docs: OkfDocument[];          // convention docs, ids under conventions/, timestamp stamped at APPLY
  governs: string[];            // types the recipe's conventions govern (derived at parse, for the receipt)
  warnings: ValidationWarning[];// non-fatal (skipped-malformed / reserved-key / self-duplicate-governs)
}

interface RecipeError { code: "RECIPE_NOT_FOUND"|"RECIPE_MALFORMED"|"RECIPE_EMPTY"|"RECIPE_UNSAFE_PATH"; message: string; }
type LoadResult = { ok: true; recipe: LoadedRecipe } | { ok: false; error: RecipeError };

/** A named- or path-addressed source. `null` = "this ref is not addressed to me." */
interface RecipeSource { readonly kind: "builtin" | "files"; resolve(ref: string): Promise<LoadResult | null>; }

/** THE one parse+validate+materialize path. Pure — no fs, no network. BOTH sources call this. */
function parseRecipeFiles(files: RecipeFile[], source: string): LoadResult;
```

Two sources, differing only in how they obtain `RecipeFile[]`:

```ts
function builtinRecipeSource(): RecipeSource {
  return { kind: "builtin", async resolve(ref) {
    if (looksLikePath(ref)) return null;            // a path is never a builtin name
    const files = BUILTIN_FILES[ref];               // in-code Record<id, RecipeFile[]>
    if (!files) return null;                        // unknown name → resolver reports
    return parseRecipeFiles(files, `builtin:${ref}`);
  }};
}
function filesRecipeSource(): RecipeSource {
  return { kind: "files", async resolve(ref) {
    if (!looksLikePath(ref)) return null;           // a bare name is never a path
    const real = await fs.realpath(path.resolve(expandTilde(ref))).catch(() => null);
    if (!real) return { ok:false, error:{ code:"RECIPE_NOT_FOUND", message:`no recipe folder at '${ref}'` } };
    if (!(await fs.stat(real)).isDirectory())
      return { ok:false, error:{ code:"RECIPE_UNSAFE_PATH", message:`'${ref}' is not a directory` } };
    return parseRecipeFiles(await readRecipeDir(real), real);   // reads ONLY recipe.md + conventions/**.md
  }};
}

const DEFAULT_SOURCES = [builtinRecipeSource(), filesRecipeSource()];
async function resolveRecipe(ref: string, sources = DEFAULT_SOURCES): Promise<LoadResult> {
  for (const s of sources) { const r = await s.resolve(ref); if (r) return r; }
  return { ok:false, error:{ code:"RECIPE_NOT_FOUND",
    message:`unknown recipe '${ref}' (built-ins: ${builtinNames().join(", ")}; or a path to a recipe folder)` } };
}
```

### The built-in produced through the SAME pipe (no special-case downstream)

The built-in's bytes are produced by the **existing serializer** — so there is no hand-authored
YAML and byte-parity with today's on-disk `conventions/context-note.md` is preserved:

```ts
const BUILTIN_FILES: Record<string, RecipeFile[]> = { "context-notes": buildContextNotesFiles() };
function buildContextNotesFiles(): RecipeFile[] {
  const conv = kindConventionDoc(CONTEXT_NOTE_KIND, CONTEXT_NOTE_SEED_BODY, PLACEHOLDER_TS);
  return [
    { path: "recipe.md",
      bytes: stringifyDoc({ type:"Recipe", id:"context-notes", title:"Context Notes", version:"1", summary: CONTEXT_NOTES_SUMMARY }, RECIPE_DESC_BODY) },
    { path: "conventions/context-note.md", bytes: stringifyDoc(conv.frontmatter, conv.body) },
  ];
}
```

`CONTEXT_NOTE_KIND` / `CONTEXT_NOTE_SEED_BODY` stay exactly where they live in `recipes.ts` and
become the *content* of the built-in source, consumed through the same pipe as external bytes.

### Proof that pluggability is real (built-in + external, one path, NO domain recipe added)

```
recipe add context-notes    ─► builtinRecipeSource.resolve("context-notes")
                                └─ BUILTIN_FILES["context-notes"]      (bytes from a constant)  ─┐
                                                                                                 ├─► parseRecipeFiles(files, source)
recipe add ./example-recipe ─► filesRecipeSource.resolve("./…")                                  │        └─► LoadedRecipe
                                └─ readRecipeDir(realpath)             (bytes from the fs)  ──────┘
                                                                                        ▼
                                                       applyRecipe(bundle, recipe)   ← the ONE apply verb (unchanged spirit)
                                                       └─ writeDocVersioned(bundle, doc, {expectedVersion:null})  per doc
```

`parseRecipeFiles`, `applyRecipe`, and the engine write are **byte-for-byte the same code** for
both. The only branch is *which source claims the ref*, and a source's sole job is producing
`RecipeFile[]`. That — and nothing else — is the definition of a `RecipeSource`. The built-in is a
**pre-shipped recipe whose bytes come from a constant**, not a special path. Proven without shipping
any domain recipe: recipe zero is re-hosted, and a throwaway `test/fixtures/example-recipe/` exercises
the external arm.

### apply (unchanged path; input widened; timestamp rule made explicit)

```ts
async function applyRecipe(bundle: Bundle, recipe: LoadedRecipe, now = new Date().toISOString()) {
  const docs = [];
  for (const d of recipe.docs) {
    const doc = { ...d, frontmatter: { ...d.frontmatter, timestamp: now } };  // key already present → replaced IN PLACE
    let changed = true;
    try { await writeDocVersioned(bundle, doc, { expectedVersion: null }); }  // expect-absent CAS — unchanged
    catch (err) { if (err instanceof VersionConflict) changed = false; else throw err; }
    docs.push({ id: doc.id, changed });
  }
  return { id: recipe.id, version: recipe.version, source: recipe.source,
           docs, changed: docs.some(d => d.changed), warnings: recipe.warnings };
}
```

**Timestamp rule (decisive):** the installer always stamps `timestamp = now` at apply — a
convention doc's timestamp means "installed into THIS bundle," which is genuinely the apply instant.
`kindConventionDoc` emits `timestamp` as a fixed, always-present frontmatter key (verified
`kinds.ts:441`), so the spread **replaces the value in place** and preserves key order →
`stringifyDoc` re-emits `conventions/context-note.md` **byte-identical modulo timestamp** to today.
On `VersionConflict` the freshly-stamped in-memory doc is discarded, so an existing on-disk doc is
never rewritten or re-stamped — idempotency intact, hand-edits never clobbered.

### Rationale, crisply

- **Smallest seam that is genuinely pluggable.** Abstracts exactly byte-acquisition; nothing else.
  No storage/versioning/CAS surface dragged into a read-only sourcing concern.
- **One code path, provably.** Built-in and external converge at `parseRecipeFiles`; no `if builtin`
  downstream. The built-in = a pre-shipped recipe, not a special case.
- **Portable OKF data, litmus-clean.** A recipe folder degrades to convention docs + an ignorable
  `type: Recipe` doc; applying it lands "a bundle of convention docs a recipe-ignorant tool reads."
- **Gate 3 by construction.** Command-layer only; core exposes only the generic apply primitive +
  `kindConventionDoc`. `grep -ri recipe packages/core/src` must stay 0.
- **No new build/packaging surface.** Built-ins are in-code (from `kindConventionDoc`), so the
  single-file esbuild bundle and the `npm pack` invariant are untouched — no `gen-builtins` codegen,
  no drift gate, no byte-duplication.
- **Clean extension points, nothing over-built.** Third source (plugin/URL), `composes:`/`seeds:`,
  `type: Cookbook`, and provenance-of-record are all reachable additions, none precluded, none built.

---

## B. KEY DECISIONS a human must sign off (the checkpoint)

Each is phrased for a yes/no or A/B answer. The recommended answer is in **bold**.

1. **Seam shape.** (A) Proposal A: a recipe source resolves to a read-only `Bundle`/`StorageBackend`.
   (B) Proposal B: a source resolves a ref to `RecipeFile[]` funneled into one pure
   `parseRecipeFiles`. → **Recommend B.**

2. **Built-in packaging.** Ship built-in recipe bytes as **(A) in-code constants built from
   `kindConventionDoc` at module load** (no codegen, single-file bundle untouched), or (B) authored
   `.md` files under `packages/cli/recipes/**` + a `gen-builtins` codegen + drift gate? →
   **Recommend A (in-code).** (An on-disk `eject` affordance is reserved for later.)

3. **Manifest required?** Require a lean `recipe.md` (`type: Recipe`, `id/title/version/summary`) on
   every recipe — **yes** — or derive `id` from the folder name (zero-ceremony, but provenance rides
   a rename-able path)? → **Recommend yes, required + lean.**

4. **Convention selection.** v1 installs **every `conventions/**/*.md` in the folder** (folder
   location IS the selection, matching `loadKinds`' own prefix contract), rather than an explicit
   manifest `conventions:`/`composes:` list. Agree? → **Recommend yes** (reserve `composes:` for when
   ordering/subsetting is needed).

5. **Name-vs-path disambiguation.** Adopt the npm-style rule: a ref containing a separator or
   starting `./ ../ / ~` is a PATH; otherwise a NAME (a local folder literally named `X` is reachable
   only as `./X`). Agree? → **Recommend yes.**

6. **Timestamp-at-apply.** The installer always stamps `timestamp = now` (semantics: "installed into
   this bundle"), keeping recipe zero byte-identical-modulo-timestamp via in-place key replacement.
   Agree this is correct (not a hack)? → **Recommend yes.**

7. **Provenance-of-record — build now or defer?** v1 keeps applied-state **derived** from convention-doc
   presence (`appliedDocIds`, existing) and does NOT record `recipe@version` on disk. Defer a
   provenance record to a reserved clause? → **Recommend DEFER.** *If/when built, pre-decision:* it
   takes Proposal A's form — a `type: Recipe` doc under a reserved `conventions/recipes/` prefix,
   invisible to `loadKinds` (which queries `type: Convention`) — chosen over a `log.md` append because
   it is queryable and yields `applied@version` directly. (Answer the deferral yes/no now; the form is
   pre-decided for later.)

8. **Duplicate-`governs` surfacing.** Surface conflicts via the EXISTING `loadKinds` machinery — (i)
   within a recipe: `parseRecipeFiles` rejects a self-duplicate as `RECIPE_MALFORMED`; (ii) against the
   target bundle: `recipe add`/`init` run `loadKinds(bundle)` post-apply and include any
   `KIND_DUPLICATE_GOVERNS` in the receipt `warnings`. No new conflict machinery. Agree? →
   **Recommend yes.**

9. **`recipes` scope.** `recipes` lists built-ins only (external recipes are path-addressed, not
   enumerable); a `recipes --path <dir>` inspect is reserved. Acceptable for v1? → **Recommend yes.**

10. **Throwaway external fixture.** Prove the external arm with a throwaway
    `packages/cli/test/fixtures/example-recipe/` (a trivial non-domain convention, e.g. `type: Term`)
    — explicitly NOT work-tracking/roadmap. Agree no domain recipe ships in this unit? →
    **Recommend yes.**

---

## C. Binding per-file implementation plan (for a later IMPLEMENT unit)

> Design only. The implement unit builds exactly this; deviations require re-sign-off.

### C.1 New / changed files

**NEW `packages/cli/src/recipe-source.ts`** — the seam + loader:
- Types: `RecipeFile`, `LoadedRecipe`, `RecipeError`, `LoadResult`, `RecipeSource`.
- `parseRecipeFiles(files, source): LoadResult` — the ONE pure pipeline:
  1. locate `recipe.md`; `parseMarkdown` it; require `frontmatter.type === "Recipe"` and non-empty
     `id` (+ default `title`←`id`, `version`←`"0"`? — **no**: require `version`, else `RECIPE_MALFORMED`),
     `title`, `version`, `summary` present/string → else `RECIPE_MALFORMED`.
  2. for every other file under `conventions/`: `id = conceptIdFromPath(path)`; `assertSafeConceptId(id)`
     (catch → `RECIPE_UNSAFE_PATH`); require `id` starts with `conventions/`; reject `isReservedFile`;
     `parseMarkdown` bytes → `OkfDocument{ id, frontmatter, body }`.
  3. mirror `loadKinds` validation semantics on those docs WITHOUT seeding a backend: a doc that is
     not `type: Convention` or has empty `governs` is **skipped with a collected `ValidationWarning`**
     (reuse `parseConventionDoc` if cleanly importable, else the same checks); a **self-duplicate
     `governs` within the folder → `RECIPE_MALFORMED`**; collect `governs[]`.
  4. zero valid convention docs → `RECIPE_EMPTY`.
  5. return `LoadedRecipe { id,title,version,summary,source, docs, governs, warnings }`.
- `BUILTIN_FILES`, `buildContextNotesFiles()`, `builtinNames()`, `builtinRecipeSource()`.
- `filesRecipeSource()` + `readRecipeDir(root)` (reads ONLY `recipe.md` + `conventions/**/*.md`;
  reject a `conventions/` entry whose `realpath` escapes `root` — symlink-out guard).
- `resolveRecipe(ref, sources?)`, `DEFAULT_SOURCES`, `looksLikePath()`, `expandTilde()`,
  `DEFAULT_RECIPE_REF = "context-notes"`.

**CHANGED `packages/cli/src/recipes.ts`** — shrinks to apply + built-in content:
- KEEP `CONTEXT_NOTE_TYPE`, `CONTEXT_NOTE_KIND`, `CONTEXT_NOTE_SEED_BODY` (imported by
  `recipe-source.ts` to build the built-in bytes); add `CONTEXT_NOTES_SUMMARY`, `RECIPE_DESC_BODY`.
- DELETE `interface Recipe`, `interface RecipeConventionDoc`, `CONTEXT_NOTES_RECIPE`,
  `BUILTIN_RECIPES`, `RECIPES_BY_NAME`, `DEFAULT_RECIPE_NAME`.
- `applyRecipe(bundle, recipe: LoadedRecipe, now?)` per §A (iterate `recipe.docs: OkfDocument[]`,
  restamp `timestamp`, expect-absent CAS, `VersionConflict`→`changed:false`). `ApplyRecipeResult`
  gains `id/version/source/warnings` (replaces `name`).
- KEEP `appliedDocIds(bundle)`; `isRecipeApplied(recipe: LoadedRecipe, appliedIds)` →
  `recipe.docs.every(d => appliedIds.has(d.id))`.

**CHANGED `packages/cli/src/commands/recipe.ts`** — `recipe add <name-or-path>`:
- Replace `RECIPES_BY_NAME.get` with `const res = await resolveRecipe(ref)`; on `!res.ok` →
  `throw new CliError("USAGE", res.error.message, { help: \`${cliInvocation()} recipes\` })`.
- `const result = await applyRecipe(bundle, res.recipe)`; run `loadKinds(bundle)` post-apply and
  fold its `KIND_DUPLICATE_GOVERNS` into the receipt `warnings`.
- Receipt: `{ recipe:"added", id, version, source, changed, docs, warnings, help:[recipes, kinds] }`.
- Usage text: `recipe add <name-or-path>` — "a built-in name, or a path to a recipe folder."

**CHANGED `packages/cli/src/commands/recipes.ts`** — list via `builtinNames()` → `resolveRecipe(name)`
→ row `{ name:id, version, applied: isRecipeApplied(recipe, appliedIds), summary, docs: recipe.docs.map(d=>d.id) }`.
Read-only, `--dir`/`--remote`, TOON, a `count`, unchanged in spirit.

**CHANGED `packages/cli/src/commands/init.ts`** — `--recipe <name-or-path>` (default `context-notes`,
`none` = bare). Replace `RECIPES_BY_NAME.get` with `resolveRecipe(ref)`; on `!ok` the same structured
`CliError`. `init --recipe ./my-recipe` works with no extra code. The `--remote` rejection stays.

**NEW `packages/cli/test/fixtures/example-recipe/`** — throwaway: `recipe.md` (`type: Recipe`,
id `example`) + `conventions/example-term.md` (a trivial `type: Convention`, e.g. governs `Term`).
NOT a domain recipe.

No other command changes. **No `@agentstate-lite/core` change** (`grep -ri recipe packages/core/src`
stays 0). No new build script, no codegen, no `package.json` scripts added.

### C.2 Test matrix (every row required to pass)

| # | Row | Asserts |
|---|-----|---------|
| 1 | **Built-in re-hosted** | `init` (default) writes `conventions/context-note.md` **byte-identical modulo `timestamp`** vs the pre-change fixture; `recipes` lists `context-notes` with `applied:true` after init; `recipe add context-notes` on a fresh bundle applies it. |
| 2 | **External loads+applies through the SAME path** | `recipe add ./test/fixtures/example-recipe` loads via `filesRecipeSource` → `parseRecipeFiles` → `applyRecipe` (same functions as the built-in), writes `conventions/example-term.md`; `kinds` then reports the new `governs`. |
| 3 | **Idempotency** | Re-run `recipe add` (built-in AND external) → overall `changed:false`, per-doc `changed:false`; a hand-edited convention doc is NOT clobbered (expect-absent CAS `VersionConflict` path). |
| 4 | **Conflict surfaced** | A recipe whose convention governs a type the bundle already governs from a DIFFERENT doc id → CAS never overwrites; `loadKinds(bundle)` post-apply yields `KIND_DUPLICATE_GOVERNS`, surfaced in the receipt `warnings` (not swallowed, not thrown). |
| 5 | **Malformed manifest → structured error** | Missing `recipe.md` / wrong `type` / missing `id`/`version` → `RECIPE_MALFORMED`; zero valid conventions → `RECIPE_EMPTY`; each maps to `CliError("USAGE")` (exit 2), TOON on stdout, **no stack**. |
| 6 | **Path-safety** | `recipe add ./nope` → `RECIPE_NOT_FOUND`; a path to a file (not dir) → `RECIPE_UNSAFE_PATH`; a convention id with `..`/absolute/outside-`conventions/` → rejected at load; a `conventions/` symlink escaping root → rejected (`realpath`); apply-time `assertSafeConceptId` + `isReservedFile` reject a reserved/traversing id as defense-in-depth. |
| 7 | **Conventions-free / gate-3 unaffected** | `grep -ri recipe packages/core/src` = 0; `examples/sample-bundle` round-trip unchanged (**4 nodes / 7 edges**); a bundle inited with `--recipe none` is bare (no `conventions/`). |
| 8 | **`parseRecipeFiles` unit (pure, no fs)** | Over in-memory `RecipeFile[]`: valid; malformed-manifest; empty; self-duplicate-`governs`→`RECIPE_MALFORMED`; unsafe id; a non-`Convention` doc under `conventions/` skipped-with-warning. |

### C.3 Regeneration / gate steps (the ship gate)

1. `npm run build` — esbuild bundles the CLI to one `dist/agentstate-lite.mjs`; **no new asset**
   (built-ins are in-code). `npm run typecheck`. `npm test --workspaces --if-present` (core + cli +
   viewer).
2. `npm run gen:skill` then `npm run check:skill` (and `gen/check:skill:bundle`) — the `recipe` /
   `recipes` / `init` **usage text changed**, so the SKILL command reference must be regenerated and
   pass the drift gate. `npm run check:bundle`. (`npm run check` runs the whole set.)
3. Built-CLI smoke on `examples/sample-bundle` via `node packages/cli/dist/agentstate-lite.mjs`:
   `init`, `note`/`doc` round-trip, `list`, `link add`/`show`, `view` (**4 nodes / 7 edges**).
4. Built-CLI recipe smoke on a temp bundle outside the monorepo: `init` (default recipe applied) →
   `recipes` (shows `context-notes` applied) → `recipe add ./<copied example-recipe>` (external arm) →
   `kinds` (sees both governs). Idempotent re-run.
5. `npm pack -w agentstate-lite`; run the tarball bin in a temp dir; assert `node_modules` contains
   ONLY `agentstate-lite` (built-ins survive because they are bundled in-code).
6. One reviewed commit per unit (seam+pipeline; re-host built-in; wire files-source+commands+fixture),
   local only — no remote/PR until the human asks.

---

## D. Explicit NON-GOALS (carried forward)

- **No domain recipes** — work-tracking, roadmap, or any content recipe. Recipe zero is re-hosted; a
  throwaway `example-recipe` proves the external arm. Nothing else ships.
- **No cookbooks** — the `type: Cookbook` composed-recipes layer is reserved (a cookbook = N
  `applyRecipe` calls; two-level cap conventions→recipes→cookbooks, no cookbook-of-cookbooks). Not
  built; not precluded.
- **No plugin-marketplace / URL / git channel** — a third `RecipeSource` appended to
  `DEFAULT_SOURCES` (fetch bytes → `parseRecipeFiles`) is the reserved extension point. No fetch, no
  execution, no registry client v1.
- **No provenance-of-record on disk (v1)** — applied-state stays derived. IF built later: a
  `type: Recipe` doc under `conventions/recipes/`, invisible to `loadKinds`, yielding `applied@version`.
- **No dependency/version resolution** — `version` is recorded, never resolved (`recipe add` of a
  newer version onto an applied bundle is a `changed:false` no-op v1).
- **No manifest composition surface (v1)** — `composes:` / `seeds:` / `requires:` are reserved; a
  recipe declaring them gets a surfaced "declared but not applied in this version" warning, never a
  silent ignore. Selection is folder-location.
- **No kind ergonomics** — kind-aware columns/filter/claim are a separate concern, out of scope.
- **No `recipes` enumeration of external recipes** — path-addressed; a `recipes --path <dir>` inspect
  is reserved.
- **No `eject`** — materializing in-code built-ins to a loose on-disk folder is a reserved affordance.
- **No core change** — the engine keeps zero recipe concept (gate 3).
