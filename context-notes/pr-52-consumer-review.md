---
type: Context Note
title: 'PR #52 consumer contract review'
actor: claude-consumer-reviewer
timestamp: '2026-07-13T17:11:09.826Z'
---
# PR #52 Consumer & Product-Contract Review

## Review target

- Repository: Holaxis-ai/agentstate-lite
- Base: `c92497ae9d9761752a34f9dad9966666f73b5d93` (`origin/main`)
- Head: `6e4c7bf07b6f918aae4cae48c585d71782ad98b8` (verified exact SHA)
- Role: Consumer and product-contract reviewer (read-only source review)

## status

`reviewed`

## verdict

`issues-found` — one real, evidenced finding on the public/package API
compatibility boundary; no other consumer-boundary regressions found. All
other invariants (parser, serializer, recipe round-trip, CLI `kinds`/`new
--help`, UI Kinds transport) hold and are well tested.

## issues

### Issue 1 — `KindFields.valueDescriptions` added as a required field, breaking the project's own additive-extension precedent for this exact class of change

- **file:line**: `packages/core/src/kinds.ts:44`
- **severity**: medium
- **confidence**: high (directly evidenced by the diff and by the repo's own
  external-consumer compatibility proof needing a source edit)

**What's wrong.** The new field is declared non-optional:

```ts
export interface KindFields {
  ...
  values: Record<string, string[]>;
  /** Human guidance for allowed enum values: `fieldName -> value -> description`. */
  valueDescriptions: Record<string, Record<string, string>>;   // <-- no `?`
  ...
}
```

Compare this to the immediately preceding PR (#51, "Add Kind relationship
descriptions"), which added an analogous guidance field to the sibling
`KindConvention` interface and correctly made it **optional**:

```ts
/** Human guidance for declared outbound relationships: `link type name -> description`. */
linkDescriptions?: Record<string, string>;
```

Every consumer of `linkDescriptions` uses optional chaining
(`kind.linkDescriptions?.[t]`, `packages/cli/src/commands/new.ts:282,288`) and
existing `KindConvention` literals across the codebase never had to be touched
to add it — the additive/optional shape is what makes it non-breaking.

`valueDescriptions`, by contrast, requires every hand-authored `KindFields`
object literal to add the new key or fail to typecheck (`strict: true`
missing-property error on an object-literal assignment). This is not
hypothetical — this very PR had to edit **four** separate hand-authored
`KindFields`/`KindConvention` literals purely to keep them compiling, with
**zero** behavioral change at each site:

- `scripts/package-core-external-proof.test.mjs:112` — this is the repo's own
  dedicated proof that `@agentstate-lite/core`'s published types can be
  consumed by a real external TypeScript project (`npm pack` + install into a
  scratch dir + `tsc --strict`). The PR added `valueDescriptions: {}` to the
  proof's `consumer.ts` fixture. This is the concrete demonstration that any
  external consumer constructing a `KindConvention`/`KindFields` literal
  against the published `.d.ts` (not just one obtained by parsing a document)
  will fail to compile after this change until they add the new field.
- `packages/ui/src/pages/bridge.test.ts:25` — the UI bridge's own test fixture.
- `packages/cli/test/recipes.test.ts` (new test "applyRecipe carries
  serialized Claim lifecycle descriptions…") — had to include
  `valueDescriptions: {...}` in a freshly authored `KindConvention` literal.
- `packages/core/test/kinds.test.ts:57` (`NOTE_KIND_FIXTURE`).

Compounding the inconsistency: the three actual runtime consumers of the field
all treat it as though it *can* be absent, contradicting the type's own
guarantee:

- `packages/cli/src/commands/new.ts` — `kind.fields.valueDescriptions ?? {}`
  (inside `renderKindHelp`'s local `hasOwn` check) and again via
  `hasOwn(kind.fields.valueDescriptions ?? {}, field)`.
- `packages/cli/src/commands/kinds.ts:89` —
  `Object.keys(kind.fields.valueDescriptions ?? {}).length > 0`.
- `packages/core/src/kinds.ts:756` (the `kindConventionDoc` serializer) —
  `Object.entries(kind.fields.valueDescriptions ?? {})`.

If the type truly guarantees the field is always present (as `required`
implies), these three `?? {}` guards are unreachable dead code. If the type
does *not* actually guarantee it (e.g. a `KindConvention` built by hand, cast
through `as`, deserialized from an untyped JSON cache, or constructed by a
future external consumer who upgrades past a version that had the field
optional), then the interface is asserting a stronger contract than the
codebase itself trusts — exactly the situation `linkDescriptions?:` was
designed to avoid one PR earlier.

**Why this matters for this PR's own claim.** The PR's claim is "optional
machine-readable descriptions for enum values, with no change to enum
validation or workflow semantics." At the bundle/serialization layer that
claim is true and well tested (see Pass section below). But at the **type**
layer — the actual public surface `packages/core` exports
(`@agentstate-lite/core` / `@agentstate-lite/core/kinds`, proven externally
consumable by `scripts/package-core-external-proof.test.mjs`) — the field is
not optional, so it is not "additive" in the sense the rest of gate 3's engine
API work insists on ("all ADDITIVE, so plain writeDoc/readDoc returns are
unchanged"). This is the concrete, evidenced deviation from that standing
norm.

**Blast radius today.** Low but non-zero: `packages/core`'s `package.json` is
`"private": true`, so it is not on the npm registry today, and the actively
published package is `packages/cli` (bundled/inlined). No real external
consumer can hit this today through npm. However: (a) the repo maintains a
dedicated test whose entire purpose is to simulate this exact scenario
(pack+install+strict-typecheck outside the monorepo) and that test had to be
edited to keep passing — i.e., the project already treats this surface as
load-bearing enough to guard with a real compatibility gate; and (b) any
future publication of `packages/core`, or any internal/plugin code that
constructs `KindFields` literals by hand (which the diff shows happens
routinely in this very codebase's tests), inherits the break.

**Suggested fix.** Make the field optional (`valueDescriptions?:
Record<string, Record<string, string>>;`) to match the `linkDescriptions?:`
precedent. This requires **no other code change** — every consumer already
guards with `?? {}` or `hasOwn(... ?? {})`, and `parseConventionDoc` already
always sets it to `{}` at minimum, so runtime behavior is identical either
way. The only effect is restoring the additive/non-breaking type contract,
and it would let the four touched-only-for-the-compiler test fixtures above
revert to omitting the field entirely (as most existing fixtures already omit
`linkDescriptions`, `links`, `expectsInbound`, etc.).

## Pass / no-issue areas (verified, not just read)

- **`kinds` output** (`packages/cli/src/commands/kinds.ts` `toRow`): correctly
  projects `value_descriptions` only when non-empty, matching the existing
  pattern for `values`/`terminal`/`link_descriptions`. Verified via
  `packages/cli/test/kinds.test.ts` ("kinds: conditionally projects kind,
  field, and enum-value descriptions") — passes.
- **`new <Kind> --help`** (`packages/cli/src/commands/new.ts`
  `renderKindHelp`): backward compatible — a field with no per-value
  descriptions renders in the exact legacy compact form (`; allowed: a | b |
  c`); a field with partial value descriptions renders each value as a row,
  with undescribed values still listed but without a description line
  (verified: "Claim" test — `challenged`/`deprecated` render bare, `active`/
  `locked` render with description). Value/description text is rendered via
  `JSON.stringify`, so embedded quotes/pipes/newlines are unambiguous; a
  local `oneLine()` whitespace-normalizer is applied only to the rendered
  help string, never mutating `kind.fields.descriptions`/`valueDescriptions`
  themselves (confirmed: the `kinds` JSON output for the same convention
  still carries the raw multi-line string, per the "Claim" test's second
  assertion block).
- **Own-key / prototype-chain hardening**: both the parser
  (`KIND_CONVENTION_UNDECLARED_VALUE_DESCRIPTION_FIELD` /
  `..._VALUE` warnings, `setOwn` avoiding the `__proto__` legacy setter) and
  the CLI help path (`hasOwn` + `Array.isArray` guards, replacing a bare
  `kind.fields.values[field]` lookup that could previously resolve through
  the prototype chain for a field literally named `constructor` and crash on
  `.join`) are exercised by dedicated adversarial tests
  (`packages/core/test/kinds.test.ts` "value descriptions use own
  declarations for prototype-looking fields…", `packages/cli/test/kinds.test.ts`
  "new help treats prototype-looking field names as enums/descriptions only
  when explicitly own"). This is a net hardening versus main, not a
  regression.
- **Recipe boundary**: `applyRecipe` round-trips `valueDescriptions` through
  the ordinary canonical `kindConventionDoc` → `parseConventionDoc` path with
  no hand-special-casing (`packages/cli/test/recipes.test.ts`, new test
  passes). The three built-in recipes (`CONTEXT_NOTE_KIND`, `TASK_KIND`,
  `ROADMAP_ITEM_KIND`, `ROADMAP_KIND`) were updated to carry an explicit empty
  `valueDescriptions: {}` — required only because of Issue 1's non-optional
  type; harmless, but is itself evidence for Issue 1 (four more sites touched
  for the compiler, no behavior change).
- **UI Kinds transport**: `packages/cli/src/ui/server.ts` `kindsResponse`
  does a full `JSON.stringify` passthrough of `loadKinds(...).kinds` with no
  hand-maintained field allowlist, so `valueDescriptions` crosses the
  transport automatically; confirmed end-to-end by the new assertions in
  `packages/cli/test/ui-pages.test.ts` ("kinds endpoint: session-gated, serves
  core's loadKinds registry"). The UI bridge (`packages/ui/src/pages/bridge.ts`)
  remains read-only and unmodified in behavior — only its test fixture needed
  the new required field (Issue 1 again).
- **Validation semantics unchanged**: grepped every occurrence of
  `valueDescriptions` in `packages/core/src/kinds.ts` — it appears only in the
  interface, the parser, and the serializer. `validateAgainstKind` (the
  actual enum-membership check) never references it; allowed-value validation
  is still sourced exclusively from `fields.values`, matching invariant 2.
- **Scope containment**: `packages/server`, `packages/worker`,
  `packages/viewer` have zero references to `KindConvention`/`KindFields`/
  `valueDescriptions` — the registry stays the one place this lives, no
  schema fork introduced. The schema-authoring CLI (`packages/cli/src/commands/kind.ts`,
  `kind field add/remove`) is untouched by this PR and correctly out of scope
  per the domain model's invariant 8; it also already preserves unknown
  `fields.*` sibling keys verbatim via a raw object spread
  (`{ ...(fm.fields as Record<string, unknown>) }`), so an existing
  `value_descriptions` block on a convention survives a `kind field` edit
  unmodified (pre-existing behavior, not touched or regressed by this PR).

## Empirical verification performed

- `npm run typecheck` (root, all workspaces): **exit 0**.
- `npm test -w @agentstate-lite/core`: **255/255 pass**.
- `node --test` over `packages/cli/test/kinds.test.ts`: **37/37 pass**.
- `node --test` over `packages/cli/test/recipes.test.ts`: **36/36 pass**
  (includes the new value-descriptions recipe round-trip test).
- `node --test` over `packages/cli/test/ui-pages.test.ts`: **25/25 pass**
  (includes the new Kinds-transport value-descriptions assertion).
- `npm run test:scripts`: **17/17 pass**, including "packed core installs,
  typechecks, and runs outside the monorepo" (the external-proof test whose
  fixture had to be edited per Issue 1).

All runs were performed against the exact head commit
`6e4c7bf07b6f918aae4cae48c585d71782ad98b8` after the worktree's node_modules
isolation was corrected and confirmed by the requester; results above are
trusted per that confirmation (local HTTP listener tests were not singled out
for sandbox exclusion in this run — all suites above completed, including
`serve()` real-socket tests inside the core suite).

## notes

- No ambiguous representations, no accidental scope growth, and no untested
  cross-boundary loss were found beyond Issue 1. Test coverage for the new
  feature is unusually thorough (malformed shapes, prototype-looking keys,
  partial description maps, whitespace-only help normalization, recipe
  round-trip, UI transport, CLI help legacy-format preservation) and every
  scenario I spot-checked by hand matched the asserted behavior.
- Issue 1 is a type-surface (compile-time) compatibility concern, not a
  runtime/serialization one — the acceptance criterion "existing bundles with
  no `value_descriptions` behave and serialize as before" is satisfied. The
  finding is about the public TypeScript contract in `packages/core`, which
  the repo itself proves out via `scripts/package-core-external-proof.test.mjs`
  as a real (if not yet registry-published) external-consumption surface.
- Recommend fixing Issue 1 before/alongside any future decision to publish
  `packages/core` externally (see CLAUDE.md's parked-npm-channel note); it is
  a one-line, zero-risk change (add `?`) with no other required edits.
