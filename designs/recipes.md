---
type: Design
title: 'Recipes: kind-composition + plugin-selection'
timestamp: '2026-07-03T18:52:32.000Z'
---
# Recipes: kind-composition as capability, plugin/marketplace as selection

**Status: design, directional (2026-07-03).** Emerged from dogfooding — after composing a working
task system purely from lite primitives (Task kind + links-as-deps + CAS-as-claim), the question
became: name and package these compositions so they are selectable and shareable. **Altitude
(human-endorsed 2026-07-03): recipes can still be a lite feature, but think of them in terms of
STANDARDS — design a recipe as an OKF-layer standard with lite as the reference implementation. See
"Altitude" below.**

## The concept

A RECIPE is a curated composition of the existing primitives — kind conventions (+ the derived
queries/sugar they lean on + teaching prose) — packaged under a name. It is a
PACKAGING / DISCOVERY / SELECTION layer OVER kinds, **NOT a new engine primitive.** Under the hood,
`recipe add work-tracking` just drops `conventions/task.md` (+roadmap +status) into a bundle.
Recipes are conventions all the way down; "recipe" is the curation. This preserves the
one-mechanism / kinds-as-the-extension-point purity (CLAUDE.md gate 3) — the engine special-cases
NOTHING about recipes.

Name rationale: "recipe" = a proven way to COMBINE the ingredients (docs, kinds, links, CAS) into a
capability. Truer than "template/preset" because these are compositions, not new things.

## Altitude: recipes are an OKF *profile*; lite is the reference implementation

**Recipes can STILL be a lite feature — but lite is the REFERENCE IMPLEMENTATION of an OKF-layer
recipe standard, not its owner.** "Recipe = a portable artifact" (below) only means something if
portability doesn't depend on lite; so the artifact AND its apply semantics are defined in terms of
the FORMAT (OKF), and lite is one tool that implements them — the same spec↔reference relationship
the project already has with OKF itself and the wire protocol (a spec + a reference implementation).

**Resolved fork: an OKF *profile*, NOT folded into OKF core.** OKF core stays ignorant of recipes. A
recipe is a *profile* of OKF — a companion spec expressed entirely in OKF terms. Keeping OKF minimal
is precisely why OKF is portable; recipes are a composition concern, not a format primitive.

**The substrate already exists.** Kind conventions are ALREADY OKF-native (`type: Convention` docs
under `conventions/`, prefix-scoped discovery via `loadKinds`). A recipe doesn't invent a primitive
— it names and composes things OKF already carries. The gap from "kinds are OKF-native" to "recipes
are an OKF standard" is small.

**What the standard specifies (small but real).** The pure-OKF part is nearly free: a `type: Recipe`
MANIFEST doc (id / title / version + the set of conventions it composes + optional seed docs & link
scaffolds). What earns the word "standard" is what makes it more than "copy these files":

- **Composition / conflict semantics** — what happens when two recipes both `governs: Task`. The
  "duplicate `governs` keeps first-by-id" rule (kinds today) graduates from an implementation detail
  to a spec clause.
- **Versioning & dependencies** between recipes.
- **Idempotent, CAS-guarded apply** — merge the recipe's `conventions/*` into the target bundle
  under the `conventions/` prefix: exactly the `loadKinds` discovery contract, exactly the
  `init --recipe` / `recipe add` surface below. The apply mechanics ride on primitives that already
  exist — no new engine primitive at the STANDARD level either.

**The litmus (graceful degradation).** A recipe handed to a tool that has never heard the word
"recipe" must degrade to *a bundle of convention docs it can already read*. That is the
conventions-free-bundle invariant (gate 5, standards-clean) lifted one level: a recipe-IGNORANT OKF
tool sees valid OKF; a recipe-AWARE tool additionally sees the manifest and can compose / version /
apply. If a recipe ever REQUIRES recipe-awareness just to be readable, the abstraction has leaked
BELOW OKF and it is no longer a clean layer.

**The clean seam (reconciles "Two flavors" below).** The STANDARD covers only the pure-OKF core
(conventions + seeds + manifest). BEHAVIOR — CLI sugar, a plugin, a skill — is explicitly OUT of the
standard, layered on by a specific tool. So a behavior-carrying recipe = a portable standard core +
a tool-specific enhancement, and the two never entangle (pure-convention recipe = 100% the standard;
behavior-carrying recipe = standard core + lite/plugin behavior).

**Build implication.** Ship lite-first, but shape the artifact SPEC-first from day one: a manifest
doc type, documented apply/conflict semantics, a `version` field reserved even where v1 ignores
dependency RESOLUTION. Defer the machinery (see Cautions), not the seams — so we never paint
ourselves out of portability.

## Cookbooks: composed recipes (the layer above)

A RECIPE composes conventions; a COOKBOOK composes RECIPES. The ladder: **kind (ingredient) ->
recipe (dish) -> cookbook (the collection).**

What makes a cookbook more than "install two recipes" is the **cross-recipe glue that cannot live in
either recipe without breaking its independence.** Example: a "tasks" recipe and a "roadmap" recipe
are each independently useful — a task can exist with no roadmap item; a roadmap item is valid with
ZERO tasks (a commitment, not yet decomposed). So the roadmap<->task LINK convention, and a "roadmap
item with its task rollup" query, belong to NEITHER recipe. They belong to the composition. That
orphaned glue is what earns the third layer its name.

- **The glue is pure OKF.** "Tasks underneath a roadmap item" = cross-links (backlinks derived); the
  rollup = a derived query (behavior-carrying, so it trails the kind-aware query layer). A cookbook's
  glue = a link convention + a spanning query. No new primitive, one composition up.
- **Standards nesting.** If a recipe is a `type: Recipe` manifest referencing conventions, a cookbook
  is a `type: Cookbook` manifest referencing recipes by id/version — the SAME OKF profile, one level
  up, degrading the same way (a cookbook-ignorant tool sees the recipes, or the conventions those
  install).
- **Cap the regress at TWO levels.** conventions -> recipes -> cookbooks, stop. No
  cookbook-of-cookbooks — that road ends at a package manager we do not want to become.
- **The "is it a list?" test.** A "cookbook" with no cross-links and no spanning query is a LIST of
  recipes, not a cookbook — do not reify a list. The glue is the whole point.
- **Discipline (same as "ship one real recipe first").** NAME the layer and shape the manifest so a
  cookbook is EXPRESSIBLE, but do not build cookbook machinery until a recipe or two has shipped.

Worked example (answers "do we have a roadmap?"): the roadmap is not a doc — it is a KIND
(roadmap-items-as-docs = a "roadmap" recipe); "roadmap + tasks + their linkage" is the
work-management COOKBOOK. An interim consolidated `roadmap` doc is the spine until that kind exists.

## Three distinct layers — do not collapse them

1. **Recipe = a portable artifact** — a folder of convention docs + a manifest + prose.
   Harness-agnostic. The source of truth.
2. **Plugin = the delivery vehicle** — brings a recipe (usually wrapped in a skill) to your
   machine/agent via the marketplace; this is the "select from" UX, on rails that ALREADY exist
   (the Claude Code plugin/marketplace system; the internal plugin marketplace; the `marketplace-registration`
   tooling).
3. **Bundle = the application target** — `recipe add <name>` / `init --recipe <name>` applies the
   recipe INTO a knowledge bundle.

Subtlety: a plugin installs into the AGENT ENVIRONMENT (~/.claude/plugins), but a recipe's EFFECT
is on a BUNDLE. So it is a two-step: plugin delivers + makes selectable; `recipe add` applies to a
specific bundle. Two selection moments: which recipe-plugins you have (marketplace) and which
recipes a given bundle uses (bundle-level).

## Multi-channel distribution (mirrors the CLI's own npm/skill/plain-files philosophy)

1. **Built-in** — a few ship with the CLI (a base recipe = today's seeded Context Note kind
   generalized; work-tracking).
2. **Plugin / marketplace** — the selectable browse-and-pick channel (the plugin idea). BEST for
   discovery. NOT the definition — one channel only.
3. **Plain files / git URL** — `recipe add ./my-recipe` for sovereignty / air-gapped.

GUARDRAIL: a recipe must NEVER be defined solely as a Claude Code plugin — that would couple a core
capability to one harness, contradicting the works-in-any-agent/offline promise. Keep the recipe
portable; let the plugin be the convenient front door.

## Recipe x skill (complementary, not competing)

Skill = TEACHES an agent a pattern (prose, discovery, maybe a CLI). Recipe = INSTALLS conventions
into a bundle. A "work-tracking" skill teaches AND invokes `recipe add work-tracking`. They stack.
`holaxis-claims` is already a "provenance recipe" implemented as a skill — the pattern is emergent
across the ecosystem; "recipe" just formalizes/names it. NOTE: this largely SUBSUMES the earlier
`task-system-skill` task — the skill is how a recipe teaches + is delivered.

## Two flavors of recipe (a clean sequencing)

- **Pure-convention recipes** (just kind declarations) work TODAY, zero new code — the
  work-tracking recipe minus fancy queries is shippable now.
- **Behavior-carrying recipes** (a "runnable"/deps-satisfied query, `claim-next`, kind-aware list
  columns) DEPEND on the additive kind-aware query layer — the gaps filed as `tasks/task-ergonomics`.

So: pure-convention recipes first; behavior arrives as the query layer lands.

## Proposed CLI surface (v1, minimal)

- `agentstate-lite recipes` — list available recipes (built-in + installed), like `kinds` lists
  declared kinds.
- `agentstate-lite recipe add <name>` — apply a recipe's conventions into the current bundle.
- `agentstate-lite init --recipe <name>` — seed a bundle with a recipe at creation (generalizes the
  current single-built-in-Context-Note seed).

## Implementation shape: context-note is recipe zero (Unit A)

The machinery to generalize ALREADY EXISTS — it is the Context Note seed, and it lives in CORE today:
- `CONTEXT_NOTE_KIND` (the convention definition) — `core/src/kinds.ts`
- `CONTEXT_NOTE_SEED_BODY` (its body) — `core/src/bundle.ts`
- `seedContextNoteKind` + the `initBundle({ seedKinds })` trigger — `core/src/bundle.ts`; the CLI's
  `init` just flips the flag (`initBundle(root, { seedKinds: true })`).

`seedContextNoteKind` is ALREADY `recipe add` for ONE convention:
`writeDocVersioned(bundle, doc, { expectedVersion: null })` — expect-absent CAS, `VersionConflict`
swallowed = already-present = idempotent no-op. A recipe with N conventions is that loop, N times.

**Unit A is therefore NOT "add work-tracking beside the special-cased context-note seed" — it is
"pull context-note THROUGH the new machinery."** Move the content UP a layer (core -> the CLI recipe
registry) as the FIRST built-in recipe, `context-notes`. Core keeps ONLY the generic apply primitive
(`writeDocVersioned` expect-absent CAS); `init` applies the default recipe via the generalized
`recipe add` path instead of a bespoke `seedKinds` flag. This does two things at once:

1. **De-special-cases the engine.** Today core bakes in one specific kind (Context Note) — a mild
   tension with gate 3 ("the engine special-cases nothing; the registry is built in the command
   layer"). Moving the seed up makes core genuinely convention-agnostic; `initBundle`'s `seedKinds`
   retires.
2. **Is the spec-test for the manifest.** `CONTEXT_NOTE_SEED_BODY` is real body content, so expressing
   context-note as a recipe FORCES the manifest to model a convention-doc-WITH-A-BODY, not just a
   field list. If the machinery can round-trip the thing we already ship, it is proven general; if it
   cannot, the gap is found concretely, not in the abstract. Recipe zero defines what a manifest must
   carry.

**Wrinkles (so it does not look free):**
- The `note` command has Context-Note-specific semantics (`note.ts` does
  `registry.kinds.get(CONTEXT_NOTE_TYPE)`). That is fine and clean: it reads the convention from the
  LOADED registry (it just needs the recipe to have been applied), and the shared identifier
  `CONTEXT_NOTE_TYPE = "Context Note"` STAYS as the name both the recipe and the command agree on.
  Only the convention DEFINITION/seed moves; the type NAME does not.
- Removing `seedKinds` from core touches core call-sites/tests — anything seeding via
  `initBundle({ seedKinds: true })` migrates to the generic apply or to CLI-layer coverage. Modest,
  but real.

**Guardrail:** the seeded convention doc must come out BYTE-IDENTICAL. `examples/sample-bundle`'s
round-trip is the canary — if the refactor changes what `init` writes, it is wrong.

**Consequence:** work-tracking becomes the SECOND built-in recipe, on a path that is already
load-bearing — and the manifest already knows how to carry a seed body because recipe zero demanded
it.

**Update (2026-07-03): Unit A SHIPPED (`757536e`) — core is now fully convention-agnostic (no
seeding, no hardcoded kind). And a conviction decision followed, REJECTING the "behavior-carrying
recipe" escape for context-notes:** rather than bundle the bespoke `note` command as context-notes'
"behavior", we DELETE `note` entirely (next unit) and author context-notes via the GENERIC `new
"Context Note"` + `doc update` path — accepting an ergonomic regression on purpose. Context-notes
ends with ZERO privilege: a default *adopted* recipe, nothing more. The generic replacement (TYPED
sections — kind-declared prose/list/link sections with generic authoring/merge, so a plain
convention delivers `note`-quality UX with no bespoke code) is DEFERRED and CONDITIONAL: build it
only if living without `note` proves the need. This is the sharpest test of the whole thesis — if a
plain convention + generic tooling can't carry our flagship type, THAT is the evidence a generic
capability is missing, and we let dogfooding find it rather than build on spec. "If ergonomics
require per-kind CLI code, the recipe idea has a hole" — so we remove the per-kind code and see.

## Cautions (v1 discipline)

- Don't let recipes drift into a parallel mechanism: a recipe IS conventions + a manifest, nothing
  the engine special-cases.
- Don't fragment: one "agentstate-lite recipes" plugin can bundle several recipes.
- Resist the marketplace-of-recipes / versioning / inter-recipe-dependency rabbit hole for v1.
- Standards-first ≠ build-it-all-now: RESERVE the spec seams (a `version` field on the manifest, a
  documented home for deps / conflict rules) but DEFER their resolution machinery. The manifest
  SHAPE is the portability contract; v1 simply doesn't act on all of it yet.
- Ship ONE real recipe first (work-tracking — the one we hand-built) and feel the whole loop
  (author -> marketplace -> `recipe add` -> use) before abstracting.

## Sequencing

delete-operation (DONE, fccb067) -> kind-aware doc surface (DONE, e0349b9) -> axi-experience-pass
(in flight) -> then recipes:
- **Unit A — recipe zero.** Pull context-note THROUGH the generalized machinery: the recipe registry
  + `recipes`/`recipe add`/`init --recipe` verbs, proven by re-hosting the Context Note seed as the
  first built-in recipe. De-special-cases core AND ships the pure-convention path in one move.
- **Unit B — the standard shaping.** The `type: Recipe` manifest doc type, a plain-files/folder
  loader (the portability channel), conflict semantics (duplicate `governs` -> first-by-id, surfaced
  not silent), and a provenance record (which recipe@version a bundle uses; reserve the `version`
  field).
- **Then** — work-tracking as the SECOND built-in recipe; a Roadmap kind as a third recipe; the
  work-management COOKBOOK composing tasks+roadmap (link convention + task rollup, once the
  kind-aware query layer lands); then packaging as recipe-plugins for distribution. Behavior-carrying
  recipes trail the kind-aware query layer (task-ergonomics).

## Decisions log — pruning the "reserved" list (2026-07-04)

As units shipped, "reserved" items get interrogated for REAL vs. speculative need — so "reserved"
does not become a hiding place for complexity.

- **Provenance-of-record — NOT BUILDING** (was Unit B / pluggable-recipes plan §B.7 "defer"). A stored
  `recipe@version` record on disk (a `type: Recipe` doc under `conventions/recipes/`) creates value
  ONLY for recipe UPGRADES that respect user customization (distinguish "the recipe's default, safe to
  bump" from "the user hand-edited, don't clobber"). Every other supposed value collapses: USING a flow
  needs `kinds` (conventions are self-describing); idempotency already rides expect-absent CAS; "which
  recipes are applied" is a cosmetic summary vs. the actionable `kinds`; reproducibility is FREE because
  conventions are DURABLE OKF data (unlike npm's disposable `node_modules` — there is no build artifact
  to reconstruct from a lockfile). So provenance is a prerequisite for a feature (upgrades) we have not
  justified. TRIGGER TO BUILD: "we want to ship recipe X@2 and bump existing workspaces without
  clobbering customizations." Until that sentence is true, do not build it.

- **Generic kind capabilities (`task-ergonomics`) — OKF-alignment splits into two tiers.** These are
  GENERIC (a recipe LEANS ON them; a bespoke `task` verb is an ANTI-GOAL):
  - **Tier 1 — build with confidence (perfectly OKF-aligned, ONE minimal shape):** make declared
    frontmatter fields first-class in READ (`list`/`query` project a kind's declared fields as columns;
    a generic `--field <key>=<value>` predicate) and WRITE (expose the seam's CAS + actor on `doc
    update` — `--expected-version`/`--actor`, so "claim" is just an optimistic field transition, no new
    verb). No new schema; driven by the `fields` a convention ALREADY declares; supports any kind/field;
    degrades trivially (any OKF tool reads frontmatter).
  - **Tier 2 — DEFER (OKF-alignment UNRESOLVED):** runnable/blocked/rollup need a DEPENDENCY edge, but
    OKF links are DELIBERATELY untyped (gate 2: body markdown links, backlinks derived, no typed edges).
    The generic shape is a real fork — untyped out-links (simple, OKF-pure, but conflates deps with
    references) vs. named reference-fields (precise, but must reconcile with the ONE-body-link-graph
    model or fork it). This is the cookbook cross-recipe glue. Try untyped first; reach for typed refs
    ONLY if the conflation actually hurts. Do NOT lock a shape until the need AND the minimal form are
    proven.
