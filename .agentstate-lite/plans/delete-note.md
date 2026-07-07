---
type: Plan
title: Plan — Delete the `note` command + the Context-Note-specific core module
timestamp: '2026-07-06T16:48:15.389Z'
---
# Plan — Delete the `note` command + the Context-Note-specific core module

Human decision 2026-07-03. Follows Recipes Unit A (757536e): Context Note *seeding* is
already a generic CLI recipe; core no longer seeds. This unit removes the last two pieces of
Context-Note privilege: (1) the bespoke `note write|read` CLI command, and (2) the
Context-Note codec in `packages/core` (`note.ts` + `writeNote`/`readNote` + the
`ContextNote`/`NotePointer` types). After this, `context-notes` is a *default adopted recipe*
with ZERO special code path — a plain OKF convention authored through the GENERIC tooling
(`new "Context Note"` + `doc read`/`doc update`/`doc write`). We ACCEPT the ergonomic
regression deliberately (see "Accepted regressions"); typed sections are the DEFERRED-CONDITIONAL
replacement, not built here.

The one generic survivor from `note.ts` is `splitSections` — THE single heading splitter,
reused by kind section-linting and exported as public API. It must survive with no rename and
no behavior change.

One focused, reviewable commit.

---

## Design forks — resolved

### Fork 1 — `splitSections` rehoming → into `packages/core/src/kinds.ts`

`splitSections` (and only it, plus its `H1_RE` constant) moves out of the deleted `note.ts`
into `kinds.ts`, and is re-exported from `index.ts` unchanged.

Rationale: after this unit `kinds.ts` (`validateAgainstKind`, kinds.ts:398) is the **sole
remaining consumer**, and `splitSections` is already public API re-exported from `index.ts`, so
its physical location is a code-org detail, not a contract change. Co-locating it with its one
consumer avoids a new single-function module for 12 lines and keeps "ONE heading splitter"
literally next to the one thing that splits headings. Alternative rejected: a new `sections.ts`
— it would isolate the "generic markdown helper" from "kind logic", but adds a module for one
tiny pure function whose only caller and only export path both already run through
kinds.ts/index.ts. The `BULLET_RE`/`POINTER_RE`/`collectBulletBlocks`/`parseBullets`/
`parsePointers`/`pointerTarget` helpers in `note.ts` are note-codec-only and are DELETED with
the module (verified: no consumer outside `note.ts`).

Confirmed no other `note.ts` survivor is needed generically: `firstSentence`, `pointerHref`,
`hrefToTarget`, `noteId`, `splitNoteId`, `renderNoteBody`, `parseNoteBody`, `noteToDoc`,
`docToNote` have NO consumer outside `note.ts`, the deleted `note` command, and the migrated
tests (grep over `packages/**/*.ts` excluding `note.ts` and `dist/` — viewer does not import
any of them).

### Fork 2 — `CONTEXT_NOTE_TYPE` relocation → a plain string in `packages/cli/src/recipes.ts`

After the command and `noteToDoc` are deleted, the ONLY remaining consumer of
`CONTEXT_NOTE_TYPE` is `cli/src/recipes.ts` (lines 61,62 — the recipe's `title`/`governs`). The
recipe is exactly the thing that *defines* the type it governs, so the identifier belongs there.
Define `const CONTEXT_NOTE_TYPE = "Context Note";` locally in `recipes.ts`; drop the core export
(`index.ts:142`) and the const itself (goes away with `note.ts`).

Confirmed core has ZERO remaining reference to `"Context Note"` / `CONTEXT_NOTE` / `noteToDoc` /
`docToNote` / `ContextNote` after the edits below (including doc-comment scrubs in `types.ts`,
`bundle.ts`, `index.ts`, `kinds.ts`). This is the hard gate; a `grep -R` of `packages/core/src`
for those five tokens must return nothing.

### Fork 3 — full test migration

Enumerated file-by-file in "Test migration" below. Summary: the note-command tests and the
note-codec test cases are DELETED (their subject is gone); the seam-parity fixtures
(`scenario.ts`, `parity.test.ts`) MIGRATE from `writeNote`/`readNote` to `writeDoc`/`readDoc`
of an equivalent `type: Context Note` doc (preserving the cross-backend byte-identical-version
and backlink coverage — the note codec was incidental to what those tests prove); the
recipe-coupling tests MIGRATE from `note read`'s per-doc freshness verdict to `status`'s
horizon-fed staleness sweep (the surviving generic surface for the same coupling);
`splitSections` + kind section-linting coverage survives untouched in `core/test/kinds.test.ts`
and `cli/test/kinds.test.ts` (both exercise `validateAgainstKind`'s `KIND_SECTION_MISSING` path,
which is `splitSections`). No genuinely-generic behavior loses coverage.

### Fork 4 — generic-path parity proof

"How do I create/read/update a context note now?" → `new "Context Note" <id> --title <t>`
(the applied recipe's convention scaffolds the declared `# Summary` section under the `path`
prefix `context-notes/`), `doc read <id>` to view, `doc update <id>`/`doc write <id>` to edit.
New tests (added to `cli/test/recipes.test.ts`) prove: (A) a pre-existing `type: Context Note`
doc still reads via `doc read` and patches via `doc update` AFTER deletion (existing notes stay
usable), and (B) `new "Context Note" <id>` creates one that satisfies the applied kind. The
migrated `remote.test.ts` test proves the same over `--remote`.

---

## Per-file edits

### A. `packages/core` — make core fully convention-agnostic

**A1. `packages/core/src/note.ts` — DELETE the whole file.**
First lift `splitSections` + `H1_RE` into `kinds.ts` (A2). Everything else in the file is
Context-Note-specific and has no external generic consumer.

**A2. `packages/core/src/kinds.ts` — receive `splitSections`; scrub comments.**
- Remove `import { splitSections } from "./note.js";` (line 23).
- Add, near the other module-local helpers, the moved splitter (verbatim behavior):
  ```ts
  // Level-1 headings only: `# Foo` (not `## Foo`). The ONE heading splitter, reused by
  // validateAgainstKind's section lint below and re-exported as public API from index.ts.
  const H1_RE = /^#\s+(.+?)\s*$/gm;

  /** Split a body into `{ headingText: sectionContent }` by its level-1 headings. */
  export function splitSections(body: string): Record<string, string> { /* body verbatim from note.ts:102-113 */ }
  ```
- `validateAgainstKind` (line 398 `splitSections(doc.body ?? "")`) now calls the local
  `splitSections` — no code change at the call site.
- Comment scrubs (no behavior change): line 11 `kinds`/`new`/`doc write`/`note read` →
  `kinds`/`new`/`doc write`; line 15 drop `readNote` from the engine-path example list; line 45
  change the example id `conventions/context-note` → `conventions/roadmap-item` (keep it kind-
  neutral).

**A3. `packages/core/src/bundle.ts` — delete `writeNote`/`readNote`; drop orphaned imports.**
- Line 6 doc comment: remove the phrase "the\n note<->doc mapping" (reword the parenthetical to
  end at "link/backlink derivation").
- Line 18: delete `import { docToNote, noteToDoc } from "./note.js";`.
- Line 30: remove `ContextNote,` from the type import.
- Lines 32-33: remove `FreshnessOptions,` and `FreshnessResult,` from the type import
  (verified: used ONLY by `readNote` in this file).
- Line 16: remove `import { freshness } from "./freshness.js";` (verified: used ONLY by
  `readNote` in this file; `freshness` is still re-exported to the world from `index.ts:83`,
  which imports it directly from `./freshness.js`).
- Lines 314-341: delete the entire `── context notes ──` section (`writeNote` + `readNote` +
  their doc comments).

**A4. `packages/core/src/types.ts` — delete the note types; scrub comments.**
- Delete `interface NotePointer` (lines 388-396) and `interface ContextNote` (lines 398-420).
- Comment-only scrubs to reach ZERO "Context Note" hits: line 39 change the `type` example
  `` `"Context Note"`, `"BigQuery Table"` `` → `` `"BigQuery Table"`, `"Spec"` ``; line 45 drop
  "such as a context note" (reword to "for abstract concepts"); line 184 drop "the\n note<->doc
  mapping" from the `StorageBackend` doc comment (reword to "link/backlink derivation,
  freshness").

**A5. `packages/core/src/index.ts` — prune exports; move `splitSections`; scrub comment.**
- Type block (26-47): remove `NotePointer,` and `ContextNote,`.
- Function block (50-59): remove `writeNote,` and `readNote,`.
- DELETE the entire note.js re-export block (lines 141-153).
- Kinds export block (163-170): add `splitSections,` alongside `loadKinds`, `validateAgainstKind`,
  etc. (now sourced from `./kinds.js`).
- Line 13 header comment: remove "the context-note <-> OKF\n mapping," (reword to
  "derived backlinks, freshness derived from `timestamp`, and reserved-file … handling").

Post-edit gate: `grep -RnE "Context Note|CONTEXT_NOTE|noteToDoc|docToNote|ContextNote"
packages/core/src` → empty.

### B. `packages/cli` — delete the command; relocate the type; fix the seed text

**B1. `packages/cli/src/commands/note.ts` — DELETE the whole file.**

**B2. `packages/cli/src/cli.ts` — deregister `note`.**
- Line 20: delete `import { note } from "./commands/note.js";`.
- Line 50: remove `"note",` from `KNOWN_COMMANDS`.
- Line 156: remove `note: wrap(note),` from the `commands:` map.

**B3. `packages/cli/src/reference.ts` — remove the note rows; fix `DESCRIPTION`.**
- Lines 55-63: delete the two `note write` / `note read` command entries from the "Notes & Docs"
  group (leave the doc/list/link entries). Keep the group name "Notes & Docs" (context notes
  still exist as a recipe; the doc entries remain) — no dangling `note write`/`note read` text
  survives.
- Line 16 `DESCRIPTION`: "read and write a local OKF knowledge bundle (context notes, docs,
  cross-links, static-HTML view)" is fine to keep ("context notes" as a concept still ships via
  the recipe); no `note` command verb appears in it, so leave unchanged. (No edit required.)

**B4. `packages/cli/src/recipes.ts` — localize `CONTEXT_NOTE_TYPE`; rewrite the stale seed text.**
- Line 21: remove `CONTEXT_NOTE_TYPE,` from the `@agentstate-lite/core` import.
- Add a local `const CONTEXT_NOTE_TYPE = "Context Note";` (with a short comment: "the type the
  context-notes recipe governs; formerly a core export, localized when the note command was
  deleted"). Lines 61-62 keep using it unchanged.
- Doc-comment scrub on `CONTEXT_NOTE_KIND` (lines 44-57): reword the references to
  `note.ts`'s `noteToDoc`/`renderNoteBody`/"the CLI note command reads back off the loaded
  registry" to the generic reality — the type is authored via `new "Context Note"` /
  `doc write`, the `# Summary` section is the one the recipe scaffolds and every instance
  carries, and `status` surfaces the horizon.
- **Seed body text change (INTENTIONAL) — `CONTEXT_NOTE_SEED_BODY` lines 82-85 and 98-101:**
  Replace the false sentence
  > "Written by `note write` / read by `note read`, which applies this kind's 24h freshness
  > horizon by default."
  with the generic reality, e.g.:
  > "Create one with `new \"Context Note\" <id>` (scaffolds the `# Summary` section under
  > `context-notes/`), read it with `doc read`, and edit it with `doc update` / `doc write`.
  > `status` surfaces this kind's 24h freshness horizon across the bundle."
  And in the `sections` bullet (lines 98-101) replace "the one heading `note write` always
  renders" → "the one section `new \"Context Note\"` scaffolds and every instance carries". This
  changes the on-disk `conventions/context-note.md` body for NEWLY-init'd bundles only
  (idempotent apply never overwrites an existing convention). Update the golden test (D3).

**B5. `packages/cli/src/commands/init.ts` — fix the help hint.**
- Line 104: `${cliInvocation()} note write --scope <s> --workspace <w> --cycle <c> --summary <text>`
  → `${cliInvocation()} new "Context Note" <id> --title <title>` (the generic create path; this
  is the "you just made an empty bundle, here's how to add your first doc" hint).

**B6. `packages/cli/src/commands/home.ts` — fix the empty-bundle hint.**
- Line 210: `${deps.invocation()} note write … | ${deps.invocation()} new … — create the first doc`
  → `${deps.invocation()} new "Context Note" <id> … | ${deps.invocation()} doc write … — create the first doc`.

**B7. `packages/cli/src/commands/list.ts` — fix a comment.**
- Line 6: "available via `agentstate-lite doc read <id>` / `agentstate-lite note read <id>`" →
  drop the `note read` alternative, leaving `doc read <id>`.

**B8. `packages/cli/src/mutate.ts` — scrub `note write` from the pipeline comments.**
- Lines 2, 14, 17, 19, 90, 99 reference `note write` as a consumer of the shared mutation
  pipeline. It no longer is. Reword each to name only the surviving consumers (`doc update`,
  `new`, `doc write`). E.g. line 2 "…`new`, `note write`) composes down to" → "…`new`)
  composes down to"; line 17 `onAbsent: "create"` (`note write`) → `onAbsent: "create"`
  (`new`). These are the last in-tree `note write` strings outside docs/skill.

**B9. `packages/cli/src/commands/new.ts` — optional comment hygiene.**
- Lines 20, 216 reference `seedContextNoteKind` (a core function removed back in Unit A; already
  stale). Reword to "the same expect-absent CAS create the recipe machinery (`applyRecipe`)
  uses". Not required by any gate; do it while here to avoid a misleading dangling name.

### C. SKILL / reference regeneration

`SKILL.md` is generated from `src/reference.ts` COMMAND_GROUPS PLUS a hardcoded example block in
`scripts/gen-skill.mjs`. The command rows regenerate automatically once B3 lands, but the
hardcoded examples must be hand-edited:

**C1. `packages/cli/scripts/gen-skill.mjs` — rewrite the `note` examples.**
- `renderTypicalFlow` (lines 86-91): replace the `note write` / `note read` block with the
  generic path, e.g.:
  ```
  # Create a context note (an OKF concept) for the next session
  <prefix> new "Context Note" cycle-1 --title "cycle-1"
  <prefix> doc update context-notes/cycle-1 --body "What this session did and what's next"
  # Read it back
  <prefix> doc read context-notes/cycle-1
  ```
  Adjust line 95's `link add specs/auth context-notes/my-app/orchestrator/cycle-1` to the new id
  `context-notes/cycle-1` (or whatever id the create example uses) so the example is internally
  consistent.
- Descriptions (renderNpm lines 136,142; and the mirrored renderSkill description block below
  line 175): "agent context notes" / "persist a context note across sessions" phrasing is fine
  to keep (context notes remain a shipped concept) — but verify no `note write`/`note read` verb
  string remains in either renderer.

**C2. Regenerate + drift-check.**
- `npm run build:skill -w agentstate-lite` (rebuilds the bundle + writes
  `skills/agentstate-lite/SKILL.md`), then `npm run gen:skill -w agentstate-lite` (writes
  `packages/cli/SKILL.md`). `npm run check` then runs `check:skill`, `check:skill:bundle`, and
  `check:bundle` drift gates. `grep -Rn "note write\|note read" packages/cli/SKILL.md
  skills/agentstate-lite/SKILL.md` → empty.

### D. Test migration (file-by-file)

| File | Action | Justification |
|---|---|---|
| `packages/cli/test/note-merge.test.ts` | **DELETE** | Tests the `note write` merge/idempotency semantics of a command that no longer exists. Its subject (merge, dedup-append, pointer upsert, frontmatter-preservation on merge) is deleted, not moved — the generic `doc update` merge is separately covered by `doc.test.ts`. |
| `packages/core/test/pure.test.ts` | **DELETE the 5 note-codec cases** (lines 183-275: "note: pointerHref…", "note: id <-> split", "note: render/parse and doc round-trip", "note: wrapped bullets…", "note: docToNote recovers…"); remove the `./note.js` import block (28-39) and `ContextNote` from the `types.js` import (line 43; keep `OkfDocument`). | Every deleted case targets a deleted codec symbol. No generic coverage lost: `splitSections` is not directly tested here (its coverage lives in the kind section-lint tests). Keep all other cases (paths, links, freshness, content-type). |
| `packages/cli/test/kinds.test.ts` | **KEEP**; optional comment scrub (lines 31,577 mention `renderNoteBody`). | No `note.ts` import. Exercises `validateAgainstKind`'s `KIND_SECTION_MISSING` path = `splitSections`. This is surviving splitSections coverage. |
| `packages/core/test/kinds.test.ts` | **KEEP**; optional comment scrub (lines 392-397 mention `noteToDoc`/`renderNoteBody`). | `NOTE_KIND_FIXTURE` is a plain local object (no `note.ts` import); the test drives `validateAgainstKind` including the `# Summary` section lint = `splitSections` coverage. |
| `packages/core/test/scenario.ts` | **MIGRATE**: drop `writeNote`/`readNote`/`ContextNote` imports (20,21,23); replace the `writeNote(bundle, note)` block (52-68) with a `writeDoc(bundle, { id: NOTE_ID, frontmatter: { type: "Context Note", title: "cycle-dual", timestamp: T_NOTE, tags: [...] }, body: "# Summary\n\nProving the seam over two backends.\n\nSee [Alpha](/concepts/alpha.md)." })`; replace `readNote(...)` (68) with `readDoc(bundle, NOTE_ID)` + `freshness(doc, { now: NOW })`; change the returned `note:` field (79) to a backend-stable reduction of the read-back doc (e.g. `{ id, frontmatter, body: body.replace(/\s+$/,'') }`) and `freshness:` to `freshness(doc,{now:NOW}).verdict`. | The tri-backend contract test proves *identical results + byte-identical version tokens across backends* — the note codec was incidental. `writeDoc` preserves that. The absolute link `/concepts/alpha.md` keeps the `alphaBacklinks == [NOTE_ID, "tables/users"]` edge that `dual-backend.test.ts` asserts (core resolves absolute `/…md`). `freshness` stays `"fresh"`. |
| `packages/core/test/dual-backend.test.ts` | **KEEP unchanged** | Imports `scenario`/`NOTE_ID` (not the codec); cross-compares `memResult deepEqual fsResult` and asserts `alphaBacklinks`/`freshness`, all preserved by the scenario migration. |
| `packages/core/test/wire-protocol.test.ts` | **KEEP unchanged** | Imports `scenario` only; runs it over `RemoteBackend`. Migrated scenario flows through transparently. |
| `packages/worker/test/parity.test.ts` | **MIGRATE** identically to scenario.ts: drop `writeNote`/`readNote`/`ContextNote` imports (26,27,31); replace the `note`/`writeNote`/`readNote` block (59-75) with the same `writeDoc(NOTE_ID …, body with /concepts/alpha.md link)` + `readDoc` + `freshness` shape; adjust the reduction (83). | Quad-backend parity proves the same invariant for `D1R2Backend`; the assertions at 99-104 (`alphaBacklinks == [NOTE_ID, "tables/users"]`, `freshness "fresh"`) are preserved. |
| `packages/cli/test/remote.test.ts` | **MIGRATE**: remove `import { note }` (29); rewrite the "note write/read --remote parity" test (68-96) as a `new "Context Note"` create + `doc read` --remote-vs-local parity test (create the same doc via `new "Context Note" c1 --title c1` over `--dir` and `--remote`, assert `id`/`timestamp` parity; `doc read` both, delete volatile fields, `deepEqual`). | Preserves the "a mutation over the wire matches the same mutation local" coverage the note test provided, and doubles as the remote half of the Fork-4 generic-path proof. |
| `packages/cli/test/recipes.test.ts` | **MIGRATE** (details in D3). Remove `import { note }` (28); update the byte-identical golden body (69) to the new seed text; rewrite the two "note command coupling WITH/WITHOUT the recipe" tests (218-253) to drive `status` instead of `note read`. Add the Fork-4 parity-proof tests (D4). | The golden must track the intentional seed-text change. The coupling tests prove `freshnessHorizonMs` feeds staleness — `status` is the surviving generic surface for that (status.ts:185-199 feeds the horizon into `freshness()`). |

**D3. `recipes.test.ts` golden update (line 63-77 test).** `EXPECTED_CONTEXT_NOTE_FRONTMATTER`
(lines 53-61) is UNCHANGED (frontmatter is identical — only the prose body changed). Update the
imported `CONTEXT_NOTE_SEED_BODY` assertion target automatically by the fact the test compares
`body === CONTEXT_NOTE_SEED_BODY` (line 69) against the same exported constant it imports — so
editing the constant in `recipes.ts` (B4) keeps this assertion GREEN with the new text, proving
the new body is what `init` writes. No literal string is duplicated in the test; confirm the
test still reads the constant (it does, line 31/69). The idempotency + hand-edit + `--remote`
recipe tests (79-131, 255-283) are UNCHANGED and continue to prove expect-absent CAS never
overwrites an existing (old-text) convention.

**D4. `recipes.test.ts` — new Fork-4 parity-proof tests (add near the coupling tests):**
- *"existing type:Context Note doc still reads and edits via the generic path after the note
  command is gone"*: `init`; `writeDoc(bundle, { id: "context-notes/w/s/legacy", frontmatter:
  { type: "Context Note", title: "legacy", timestamp: T, tags:[...] }, body: "# Summary\n\nOld
  note.\n" })`; assert `doc read context-notes/w/s/legacy` returns it (title/body intact); run
  `doc update context-notes/w/s/legacy --title "legacy-2"` and assert `changed:true` and the
  `# Summary` body survives. Proves deletion does NOT make existing context notes
  unreadable/uneditable.
- *"new \"Context Note\" creates a governed instance"*: `init`; run `new ["Context Note",
  "cycle-x", "--title", "cycle-x"]`; assert it lands at `context-notes/cycle-x` (the recipe's
  `path` prefix), `type: "Context Note"`, and carries a `# Summary` section (the scaffolded
  declared section); assert `list --type "Context Note"` finds it. **Verify-point:** the kind
  requires `title` + `timestamp`; `timestamp` is auto-stamped by the mutation pipeline, so only
  `--title` is user-supplied — confirm via the smoke test (F) that no `--timestamp` is needed; if
  strict validation rejects, add `--timestamp <iso>`.

### E. `STATUS.md` — changelog row + accepted regressions

Add a changelog item (next number in sequence) recording:
- Deleted the bespoke `note write|read` command and the Context-Note codec (`core/src/note.ts`,
  `writeNote`/`readNote`, `ContextNote`/`NotePointer` types). Core is now fully
  convention-agnostic (zero "Context Note" reference); `context-notes` is a default *adopted*
  recipe with no privileged code path, authored via the generic path (`new "Context Note"` +
  `doc read`/`doc update`/`doc write`).
- `splitSections` rehomed to `kinds.ts`, still the ONE heading splitter, still public API.
- **Accepted regressions (intentional, replacements DEFERRED-CONDITIONAL):** no per-note
  freshness verdict on read (`status` still surfaces freshness bundle-wide via the kind horizon);
  no scope/workspace/cycle addressing sugar; no `--summary`/`--decision`/`--question`/`--pointer`
  merge sugar or pointer-upsert. Typed generic section-authoring is the deferred-conditional
  replacement — prove the need via dogfooding before building it.

Update any STATUS row/table that lists `note write/read` among wired CLI commands to drop it.

### F. DOC updates (the four docs)

**F1. `README.md`** — Quickstart (lines 42-53) currently uses `note write`/`note read`. Replace
with the generic path:
```sh
# 2. Create a context note (an OKF concept doc with a # Summary section)
$AXI new "Context Note" cycle-today --dir ./my-knowledge --title "cycle-today"
$AXI doc update context-notes/cycle-today --dir ./my-knowledge --body "Kicked off the OKF store."
# 3. Read it back
$AXI doc read context-notes/cycle-today --dir ./my-knowledge
```
Line 26 core-purpose cell "note↔doc mapping" → drop (core no longer maps); reword to
"bundle I/O, links, backlinks, freshness, pluggable storage seam". Lines 4/3 "context notes" as
a feature word may stay.

**F2. `packages/cli/README.md`** — line 12 `npx -y agentstate-lite note write --scope … ` →
`npx -y agentstate-lite new "Context Note" cycle-1 --title "cycle-1"` (and, if a body is wanted,
a following `doc update context-notes/cycle-1 --body "…"`). Lines 3-5 "Context notes, docs,
cross-links" may stay.

**F3. `docs/VISION.md`** — reword the Context-Note mapping so it reads as a *recipe convention +
generic tooling*, not a core feature:
- Line 109/112 mapping-table rows: keep the "a concept document with `type: Context Note`"
  description but note it is authored via the `context-notes` recipe + generic `new`/`doc`
  commands (not a bespoke codec). "Written on every note write" (112) → "written on every
  `doc write`/`doc update`".
- Line 234 §4 command list "(`init`, `write`, `read`, `list`, `status`, `note`)" → drop `note`.
- Line 281 core description "the context-note↔concept-doc mapping" → remove that clause (core no
  longer owns it).
- Line 282 CLI description "`note write/read`, `doc write/read`" → drop `note write/read`, keep
  `doc write/read`; mention `new "Context Note"` as the context-note create path.
- Lines 97/117/131/154/261 mention "Context Note" as a `type` value / directory example — these
  are fine to keep (the type still exists); no command verb involved.

**F4. `docs/WIRE-PROTOCOL.md`** — line 480 example command list
"(most commands — `list`, `note`, `view`, `new`, `status`, `kinds`)" → drop `note`. (The other
"note" occurrences at 129/204/416/511 are the English word, not the command — leave them.) There
is NO context-note<->doc mapping section in this doc, so nothing else to reword.

---

## Confirmed NO-CHANGE files

- `packages/core/src/links.ts` — `relativeHref`/`resolveConceptId`/`isExternalHref` stay
  (used across the engine; `note.ts` was only one consumer).
- `packages/core/src/freshness.ts` — unchanged; `freshness` is still re-exported from
  `index.ts` directly.
- `packages/core/src/kinds.ts` `validateAgainstKind` / `freshnessHorizonMs` /
  `kindConventionDoc` — logic unchanged (only the `splitSections` source moves in-file).
- `packages/cli/src/commands/status.ts` — unchanged; already the generic freshness-horizon
  surface the coupling tests migrate onto.
- `packages/cli/src/commands/doc.ts`, `new.ts` (beyond the optional comment scrub), `mutate.ts`
  logic (only comments change).
- `packages/core/test/dual-backend.test.ts`, `wire-protocol.test.ts` — consume the migrated
  `scenario.ts` transparently; assertions preserved.
- `examples/sample-bundle` — conventions-free; never touched the note codec; `view` still 4
  nodes / 7 edges.
- The `Frontmatter.type` field and the `"Context Note"` string as a runtime `type` VALUE persist
  everywhere as data (in the recipe, in test fixtures, in docs) — only the *code that privileges*
  it is removed. The zero-hit grep gate is scoped to `packages/core/src` (where it must be a
  pure engine with no kind knowledge), NOT to `packages/cli` (the recipe legitimately names the
  type it governs) nor tests/docs.

---

## Verification / gates

1. `grep -RnE "Context Note|CONTEXT_NOTE|noteToDoc|docToNote|ContextNote" packages/core/src`
   → empty (core fully convention-agnostic — hard gate).
2. `grep -Rn "note write\|note read" packages docs README.md skills` → empty (no dangling
   command refs in help/hints/reference/SKILL/docs).
3. `npm run check` green (build + typecheck + all workspace tests + `check:skill` +
   `check:skill:bundle` + `check:bundle` drift gates). Removing `writeNote`/`readNote` +
   the three orphaned imports must leave a clean typecheck.
4. `splitSections` still exported from `@agentstate-lite/core` and both kind section-lint tests
   (`core/test/kinds.test.ts`, `cli/test/kinds.test.ts`) pass unchanged.
5. Fork-4 tests green: existing `type: Context Note` doc reads/edits via `doc read`/`doc update`;
   `new "Context Note"` creates a governed instance.
6. Golden: `recipes.test.ts` byte-identical test passes against the NEW seed body; idempotent
   re-apply on an existing (old-text) bundle stays `changed:false` (expect-absent CAS).
7. Smoke the BUILT CLI on a temp dir:
   `node packages/cli/dist/agentstate-lite.mjs init --dir <tmp>`;
   `… new "Context Note" foo --dir <tmp> --title foo`;
   `… doc read context-notes/foo --dir <tmp>`;
   `… doc update context-notes/foo --dir <tmp> --title foo2` (changed:true);
   `… list --type "Context Note" --dir <tmp>` (finds it);
   `… view --dir examples/sample-bundle` → 4 nodes / 7 edges.
   Confirm `… note --help` now errors as an unknown command (exit 2, taxonomy preserved).

One focused commit.
