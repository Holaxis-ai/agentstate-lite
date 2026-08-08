# Architectural-smell report — `agentstate-lite`

Analysis-only quantitative survey of the monorepo at commit `31921ce` (`main`). No application
code was changed. Every number below is reproducible with the commands in
[Appendix A](#appendix-a--how-to-reproduce).

Scope: the nine workspaces under `packages/` (`core`, `cli`, `board-git`, `server`, `ui`,
`ui-server`, `view-runtime`, `mcp-app`, `markdown-renderer`). Unless stated otherwise, figures
cover **production sources only** (`packages/*/src/**`, excluding `*.test.ts(x)`, `dist/`, and
generated files).

## 0. Executive summary

| Question | Answer |
| --- | --- |
| Circular dependencies between packages? | **None.** The package graph is a DAG in `src`. |
| Circular dependencies inside `core/src`? | **None** (26 modules, 0 cycles). |
| Circular dependencies inside `cli/src`? | **2 cycles**, both inside `packages/cli/src` (§1). |
| God files? | **28 files > 500 LOC**, top is 1 834 LOC (§2). |
| Overly complex functions? | **64 functions with cyclomatic complexity > 20**; max 102 (§2). |
| Duplication? | **1.62 % of lines / 2.32 % of tokens** (82 clones) — low overall, but **125 of 164 clone endpoints are in `packages/cli`** (§3). |
| Layering violated? | **Not in `src`** — `core` has zero outbound intra-repo imports. **Yes in test/dev scope**: `core` dev-depends on `server` (§4). |
| Do the CLAUDE.md "ONE X" claims hold? | ONE parser ✅, ONE link resolver ✅, ONE heading splitter ✅, ONE View *semantics* authority ✅ (but the launch sequence is written twice, §4.3), **ONE mutation policy ⚠️ — 4 surfaces bypass `mutateDocument`** (§3.2). |

The codebase is **not** structurally rotten: the dependency direction the guide claims is real and
mostly machine-enforced, and duplication is well below typical thresholds. The concentrated risk is
**size and branch density in `packages/cli`** (53 % of all production LOC, 61 % of all functions
with complexity > 20) plus a handful of **policy-bypass write paths** that erode the "one mutation
policy" invariant.

### Repository size baseline

| Package | Prod files | Prod LOC | Σ file complexity | Functions cx > 20 |
| --- | ---: | ---: | ---: | ---: |
| `cli` | 86 | 23 429 | 3 045 | 39 |
| `core` | 26 | 5 871 | 713 | 3 |
| `board-git` | 10 | 4 027 | 513 | 4 |
| `ui` | 19 | 2 827 | 395 | 5 |
| `mcp-app` | 9 | 2 618 | 380 | 3 |
| `view-runtime` | 6 | 2 257 | 397 | 4 |
| `ui-server` | 9 | 1 655 | 299 | 3 |
| `server` | 3 | 749 | 130 | 2 |
| `markdown-renderer` | 2 | 459 | 70 | 1 |
| **Total** | **170** | **43 892** | **5 942** | **64** |

`packages/cli/src/commands/` alone is **40 files / 13 180 LOC** — 30 % of the repository.

---

## 1. Circular dependencies

`madge --circular` over `packages/*/src` reports **2 cycles, both inside `packages/cli`**; an
independent Tarjan SCC pass over a graph that *also* resolves cross-package
`@agentstate-lite/*` specifiers (including subpath exports, which `madge` skips — it reported
16 skipped specifiers) finds exactly the same two, and **no package-level cycle**.

### 1.1 Recipe-source cycle (4 modules)

```
packages/cli/src/recipe-source.ts:16      -> ./recipe-resolver.js      (value)
packages/cli/src/recipe-resolver.ts:1     -> ./recipe-source-builtin.js (value)
packages/cli/src/recipe-source-builtin.ts:6 -> ./recipes.js            (value)
packages/cli/src/recipes.ts:46            -> ./recipe-source.js        (type-only)
```

The cycle only closes through a `import type { LoadedRecipe } from "./recipe-source.js"` in
`packages/cli/src/recipes.ts:46`. It is erased at compile time, so there is **no runtime TDZ
hazard today** — but the shape is fragile: `recipe-source.ts` is a barrel
(`packages/cli/src/recipe-source.ts:13-16` re-exports the parser, the builtin source, the
filesystem source and the resolver), so any future *value* import of that barrel from `recipes.ts`
turns this into a real initialization-order bug.

**Fix (low effort, no behavior change):** move `LoadedRecipe`/`RecipeSource`/`RecipeFile` into the
existing leaf `packages/cli/src/recipe-parser.ts` (which the whole cluster already imports) or a
new `recipe-types.ts`, and have `recipes.ts` import from there. Cycle count drops to 1.

### 1.2 Sync-establish cycle (2 modules)

```
packages/cli/src/commands/sync/establish.ts:51            -> ./establish-committed.js (value)
packages/cli/src/commands/sync/establish-committed.ts:50  -> ./establish.js           (type-only, `EstablishOutcome`)
```

Same pattern, same remedy: `EstablishOutcome` belongs in a shared types module (or in
`packages/cli/src/sync-outcomes.ts`, which both files already import).

### 1.3 What is clean

* `packages/core/src` — 26 modules, **0 cycles**.
* `packages/board-git/src`, `packages/server/src`, `packages/ui-server/src`,
  `packages/view-runtime/src`, `packages/mcp-app/src`, `packages/ui/src` — **0 cycles**.
* Package-to-package graph — **0 cycles** in `src` (see §4).

> `dpdm` was attempted as a second opinion but is broken on Node 20 in this environment
> (`ERR_REQUIRE_ESM` from its bundled `chalk`); the custom ts-morph + Tarjan pass in
> `scripts/`-equivalent form (Appendix A) was used instead and agrees with `madge`.

---

## 2. God files and overly complex functions

Cyclomatic complexity is counted per function as `1 + #{if, for, for-in, for-of, while, do,
case, catch, ?:, &&, ||, ??, ?.}` over the function's full subtree (standard McCabe with the
boolean-operator extension). "Nesting" is the maximum block-statement depth.

### 2.1 Largest files

| File | LOC | Σ complexity | cx / 100 LOC |
| --- | ---: | ---: | ---: |
| `packages/board-git/src/porcelain.ts` | 1834 | 244 | 13.3 |
| `packages/cli/src/bundle.ts` | 1194 | 163 | 13.7 |
| `packages/cli/src/commands/hook.ts` | 1086 | 168 | 15.5 |
| `packages/mcp-app/src/server.ts` | 1081 | 79 | 7.3 |
| `packages/mcp-app/src/view.ts` | 1051 | 204 | 19.4 |
| `packages/cli/src/commands/home.ts` | 984 | 129 | 13.1 |
| `packages/ui-server/src/server.ts` | 976 | 213 | **21.8** |
| `packages/cli/src/skill-render.ts` | 971 | 4 | 0.4 (template text — benign) |
| `packages/cli/src/update-orientation.ts` | 960 | 212 | **22.1** |
| `packages/view-runtime/src/index.ts` | 933 | 125 | 13.4 |
| `packages/core/src/kinds.ts` | 853 | 159 | 18.6 |
| `packages/cli/src/commands/link.ts` | 852 | 103 | 12.1 |
| `packages/cli/src/commands/skill.ts` | 790 | 123 | 15.6 |

28 production files exceed 500 LOC; 47 exceed 300 LOC.

Highest **complexity density** among files > 200 LOC (the "every line is a branch" set):
`packages/cli/src/hook-compatibility.ts` (33.4), `packages/cli/src/skill-compatibility.ts` (26.4),
`packages/cli/src/install-authority.ts` (23.1), `packages/view-runtime/src/bridge.ts` (22.7),
`packages/cli/src/update-check.ts` (22.5). These are exactly the security/ownership-classification
modules — high density there is *defensible* (they are decision tables) but it makes them the
highest-value targets for table-driven refactoring and property tests.

### 2.2 Most complex functions (top 20)

| Location | Function | Cyclomatic | Lines | Max nesting |
| --- | --- | ---: | ---: | ---: |
| `packages/ui/src/views/PageFrame.tsx:54-540` | `PageFrame` | **102** | 487 | 3 |
| `packages/server/src/router.ts:204-561` | `buildRouter` | **88** | 358 | 3 |
| `packages/core/src/kinds.ts:233-632` | `parseConventionDoc` | **85** | 400 | 5 |
| `packages/cli/src/commands/kind.ts:83-361` | `kind` | **79** | 279 | 6 |
| `packages/cli/src/commands/status.ts:197-589` | `status` | **78** | 393 | 4 |
| `packages/cli/src/commands/list.ts:92-379` | `list` | **71** | 288 | 4 |
| `packages/mcp-app/src/server.ts:386-1076` | `createMcpAppServer` | 65 | **691** | 2 |
| `packages/ui/src/views/Launcher.tsx:143-552` | `Launcher` | 65 | 410 | 2 |
| `packages/cli/src/commands/new.ts:349-707` | `newCommand` | 61 | 359 | 3 |
| `packages/board-git/src/porcelain.ts:740-927` | `provisionBoardWorktree` | 54 | 188 | 5 |
| `packages/cli/src/commands/hook.ts:826-1085` | `hook` | 53 | 260 | 5 |
| `packages/cli/src/commands/doc/update.ts:210-439` | `docUpdate` | 49 | 230 | 3 |
| `packages/cli/src/recipe-parser.ts:281-576` | `parseRecipeFiles` | 48 | 296 | 3 |
| `packages/view-runtime/src/transient-save.ts:126-321` | `persistTransientView` | 46 | 196 | 5 |
| `packages/cli/src/commands/doc/read.ts:45-301` | `docReadInner` | 45 | 257 | 3 |
| `packages/cli/src/commands/kind.ts:209-334` | `buildCandidate` | 44 | 126 | **6** |
| `packages/cli/src/commands/doc/write.ts:25-267` | `docWrite` | 43 | 243 | 2 |
| `packages/cli/src/commands/sync/show-incoming.ts:72-257` | `showIncoming` | 43 | 186 | 4 |
| `packages/ui-server/src/server.ts:718-830` | `handleRequest` | 41 | 113 | **12** |
| `packages/ui-server/src/server.ts:289-396` | `handleMint` | 40 | 108 | 4 |

Distribution over 1 167 production functions: mean complexity 6.7; **176 functions > 10**,
**64 > 20**, **50 functions longer than 100 lines**.

### 2.3 The two suspected hotspots — verdict

**`packages/core/src/document-mutation.ts` / `mutateDocument` — suspicion partly confirmed, but
it is the *good* kind of complexity.**

* File: 268 LOC, Σ complexity 41, 7 exported declarations.
* `mutateDocument` (`packages/core/src/document-mutation.ts:166-267`): **cyclomatic 23, 102 lines,
  max nesting 2** — well above the ≤10 rule of thumb, but *below* 39 other functions in the repo.
* The real smell is **mode-switch shape, not size**: one function implements three distinct
  algorithms selected by `opts.mode` — `create-only` (`:172-180`), `overwrite` (`:192-227`), and
  the patch/CAS path (`:229-266`). Only the last two share the `readExisting` closure
  (`:182-190`). `MutateDocumentOptions` correspondingly carries fields that are meaningless in
  some modes (`expectedVersion`, `compareTimestamp`, `onAbsent`, `maxAttempts` are inert for
  `create-only`).
* Secondary: `valuesEqual` (`:96-110`) is cyclomatic **12 in 15 lines** — the densest code in
  `core`.

  **Recommendation:** split into `createDocument` / `overwriteDocument` / `patchDocument`, keep
  `mutateDocument` as a thin dispatcher over a discriminated-union options type. This is a pure
  refactor with no behavioral claim, and it makes each mode's option set unrepresentable-if-wrong.
  Priority: medium — the function is well-commented, single-nesting, and heavily tested
  (`packages/core/test/document-mutation.test.ts`, `mutation-pins.test.ts`).

**`packages/cli/src/cli.ts` — suspicion NOT confirmed.**

* 318 LOC, Σ complexity 17. `main` (`packages/cli/src/cli.ts:197-317`) is cyclomatic **12** over
  121 lines; `hoistLeadingGlobalFlags` (`:169-195`) is 6.
* What it *does* have is the repo's **second-highest fan-out: 34 outbound module edges**
  (28 command modules imported eagerly at `:20-47`). That is a registry, not a God object — but it
  is a hard dependency on every command's module-init cost at CLI startup.

  **The actual God files in the CLI are elsewhere:** `packages/cli/src/bundle.ts` (1 194 LOC,
  fan-in 31), `packages/cli/src/commands/hook.ts` (1 086 LOC), `packages/cli/src/commands/home.ts`
  (984 LOC), `packages/cli/src/update-orientation.ts` (960 LOC, density 22.1).

---

## 3. Duplication (`jscpd`)

Production sources (`--min-lines 5 --min-tokens 50`, tests/generated excluded):

| Format | Files | Lines | Clones | Duplicated lines | Duplicated tokens |
| --- | ---: | ---: | ---: | ---: | ---: |
| TypeScript | 149 | 41 273 | 82 | 707 (1.71 %) | 5 125 (2.49 %) |
| TSX | 11 | 2 346 | 0 | 0 | 0 |
| **Total** | **160** | **43 619** | **82** | **707 (1.62 %)** | **5 125 (2.32 %)** |

Including tests at `--min-lines 8 --min-tokens 60`: 37 clones, 399 lines (0.86 %) over 176 files —
test duplication is concentrated in `packages/ui/src/views/*.test.tsx` (11 clones, 2.71 % of TSX).

**1.6 % is low** (jscpd's own default failure threshold is typically 5–10 %). The distribution is
what matters:

| Package | Clone endpoints | Duplicated lines |
| --- | ---: | ---: |
| `cli` | 125 | 1 152 |
| `mcp-app` | 10 | 136 |
| `core` | 9 | 77 |
| `board-git` | 6 | 60 |
| `view-runtime` | 7 | 60 |
| `ui-server` | 4 | 52 |
| `server` | 2 | 34 |
| `ui` | 1 | 7 |

### 3.1 The dominant clone family: CLI command preamble (≈54 of 82 clones)

Nearly every command repeats the same 8–15-line opening: `parseOrUsage(() => parseArgs({...}))` →
`if (values.help)` → bundle/remote resolution → output-mode selection. Representative pairs:

```
cli/src/commands/blobs.ts:40-47   <-> cli/src/commands/init.ts:69-76
cli/src/commands/blobs.ts:40-48   <-> cli/src/commands/kinds.ts:116-124
cli/src/commands/blobs.ts:40-47   <-> cli/src/commands/list.ts:92-99
cli/src/commands/blobs.ts:40-48   <-> cli/src/commands/session-start.ts:264-272
cli/src/commands/blobs.ts:40-47   <-> cli/src/commands/status.ts:197-204
cli/src/commands/blobs.ts:49-56   <-> cli/src/commands/{delete,doc/history,doc/read,doc/write,link,pull}.ts
cli/src/commands/delete.ts:67-79  <-> cli/src/commands/skill.ts:631-644   (13L / 94T)
cli/src/commands/doc/read.ts:45-54<-> cli/src/commands/pull.ts:158-167    (10L / 104T — largest)
cli/src/commands/doc/history.ts:23-37 <-> cli/src/commands/view.ts:32-44  (15L / 78T)
cli/src/commands/serve.ts:{64-72,99-104,138-150} <-> cli/src/commands/ui.ts:{67-75,148-153,102-110}
```

This is the *quantitative* explanation for `commands/` being 13 180 LOC. It is also a correctness
surface: the AXI gates (structured stdout errors, `--json`, exit-code taxonomy, `--remote`
handling) are re-implemented per command rather than provided once.

**Recommendation (highest ROI in the report):** introduce one `defineCommand({ name, usage,
options, needsBundle, run })` helper in `packages/cli/src` that owns arg parsing, help,
bundle/remote resolution, output mode, and error-envelope rendering. Migrate commands
incrementally. Expected effect: −1 000 LOC in `commands/`, and the AXI gates become structurally
enforced instead of per-command conventions.

Intra-file clones worth folding independently:
`packages/cli/src/commands/skill.ts:720-733 ↔ :767-780` (14L / **105T**, largest single clone),
`packages/cli/src/commands/hook.ts:189-200 ↔ :262-273`,
`packages/cli/src/update-orientation.ts:597-612 ↔ :772-787`,
`packages/mcp-app/src/server.ts:280-296 ↔ :304-320` and `:596-608 ↔ :880-892`,
`packages/core/src/remote-backend.ts:355-361 ↔ :472-478`,
`packages/board-git/src/porcelain.ts:1102-1110 ↔ :1277-1284`.

### 3.2 Validating the CLAUDE.md "ONE X" claims

| Claim (CLAUDE.md §3) | Verdict | Evidence |
| --- | --- | --- |
| **ONE frontmatter parser** | ✅ Holds | `matter()` from `gray-matter` is imported in exactly one module, `packages/core/src/frontmatter.ts:10`. All 6 out-of-core parse sites go through core's `parseMarkdown`: `board-git/src/porcelain.ts:{1026,1489}`, `cli/src/commands/sync/converge.ts:{179,211}`, `cli/src/commands/sync/show-incoming.ts:219`, `cli/src/commands/promote.ts:180`, `cli/src/recipe-source-filesystem.ts:23`, `cli/src/recipe-parser.ts:{290,390,487,543}`. No second YAML/frontmatter reader exists. |
| **ONE link resolver** | ✅ Holds | The only markdown-link regex in the repo is `MD_LINK_RE` at `packages/core/src/links.ts:80`, consumed by `parseLinksFromDoc` (`:165`); `core/src/bundle.ts:383` `parseLinks` is a thin delegate. No other module matches `[text](href)`. |
| **ONE heading splitter** | ✅ Holds | `splitSections` is defined once (`packages/core/src/kinds.ts:219`, regex `H1_RE` at `:216`), used at `:724` and re-exported at `core/src/index.ts:230`. |
| **ONE View semantics / action authority** | ✅ Semantics hold, ⚠️ launch sequence duplicated | Registration semantics are single-sourced: `packages/ui/src/pages/registry.ts:50` delegates entirely to core's `parseRegistration` (`packages/core/src/page.ts:170`) and `resolveDeclaredAccess`, and `packages/ui/src/api/pages.ts:79` builds on that. But the registered-View **launch** sequence is written twice — `packages/ui-server/src/server.ts:351-372` re-implements `packages/view-runtime/src/index.ts:326-345` (largest cross-package clone, 13L / 98T); see §4.3. |
| **ONE bundle walk** | ⚠️ Mostly | The OKF document walk is single-sourced (`walkMarkdown`, `packages/core/src/backend.ts:138`). But `walkBlobs` (`:163-171`) is a **near-verbatim clone** of it (jscpd: `backend.ts:138-146 ↔ :163-171`, 9L / 104T) differing only in the extension/dot-file rule — collapse into one parameterized walk. Separate filesystem walks exist for non-OKF purposes (`board-git/src/porcelain.ts:1129` git-snapshot walk, `cli/src/commands/skill.ts:{134,484}`, `cli/src/recipe-source-filesystem.ts:{45,75}`); these are legitimately different concerns, not parser forks. |
| **ONE mutation policy** (`mutateDocument` below the CLI) | ⚠️ **Weakest claim — 4 bypasses** | See below. |

**Mutation-policy bypasses.** Only 3 call sites use the policy service — `cli/src/mutate.ts:119`,
`view-runtime/src/index.ts:845`, `view-runtime/src/transient-save.ts:243`. Four other write
surfaces call the raw engine primitive `writeDocVersioned` directly, thereby skipping
kind validation, semantic no-op detection, the monotone conformance ratchet, actor propagation
and receipt shaping:

| Bypass | Documented? | Risk |
| --- | --- | --- |
| `packages/server/src/router.ts:255` (`handleWriteDoc`, `PUT /docs/{id}`) | No | **Highest.** CLAUDE.md §3 explicitly says "Do not duplicate this policy in a future UI or **server action path**". The wire protocol's write endpoint applies none of the policy — a `--remote` CLI write gets policy client-side, a direct HTTP write gets none. Any future non-CLI client diverges silently. |
| `packages/cli/src/commands/promote.ts:219` | Yes (`:213-217`) | Deliberate scope carve-out; the ratchet is knowingly not applied. It re-implements the timestamp/kind step via a *second* helper, `packages/cli/src/kind-write.ts:99` `defaultTimestampAndValidateKind` (`promote.ts:205`) — a parallel mini-policy that exists only for this path. |
| `packages/cli/src/recipes.ts:{511,587,612}` | Yes (`:453`) | Expect-absent CAS creates; equivalent to `mode: "create-only"` and could route through it. |
| `packages/cli/src/commands/link.ts:441` | Yes | Hand-rolled `versionedMutation` read-decide-CAS loop that duplicates `mutateDocument`'s patch branch (`document-mutation.ts:229-266`), including the timestamp refresh at `link.ts:429-431`. |

Also outside the policy: `writeReserved` (`index.md`/`log.md`) is called directly from
`packages/server/src/router.ts:390`, `packages/core/src/index-projection.ts:335` and
`packages/core/src/bundle.ts:104`. Those are core-internal or reserved-file paths and are
consistent with the guide.

**Recommendation:** (a) route `server`'s `handleWriteDoc` through `mutateDocument` (it already
depends only on core, so there is no layering cost) or state explicitly in CLAUDE.md that the
reference server is a policy-free byte channel; (b) fold `recipes.ts`'s three creates into
`mode: "create-only"`; (c) fold `link add` into the patch mode it mirrors; (d) if `promote` must
stay outside, make `kind-write.ts` the *only* remaining exception and say so in one place.

---

## 4. Cross-package coupling and layering

### 4.1 Import graph (production `src`, edge weight = number of import statements)

```
core            (no outbound intra-repo imports — 0 edges)
  ^ board-git 1        ^ server 2        ^ markdown-renderer 1
  ^ view-runtime 10    ^ ui-server 4     ^ mcp-app 3     ^ ui 8     ^ cli 41

server        -> core 2
view-runtime  -> core 10
board-git     -> core 1
markdown-rend.-> core 1
ui-server     -> core 4, server 1, view-runtime 2
mcp-app       -> core 3, view-runtime 3, markdown-renderer 1
ui            -> core 8, ui-server 1, view-runtime 2, markdown-renderer 2
cli           -> core 41, board-git 15, ui-server 4, mcp-app 1, view-runtime 2, server 2,
                 markdown-renderer 1
```

Package fan-in: `core` 70, `board-git` 15, `view-runtime` 9, `ui-server` 5,
`markdown-renderer` 4, `server` 3, `mcp-app` 1, `ui` 0, `cli` 0.

**The intended unidirectional layering holds in `src`:**

* `packages/core/src` has **zero** imports of any other workspace package — the strongest form of
  the claim, verified directly rather than by convention.
* **Nothing** imports `cli` or `ui`; both have fan-in 0, i.e. no dependency reaches back into the
  CLI or the SPA.
* **Zero cross-package deep-relative imports** (`../../other-package/src/...`): every cross-package
  edge goes through a declared package name or a declared subpath export
  (`@agentstate-lite/core/{kinds,links,page,meaningful-change-time,query-filter,query-selection}`).
* No package-level cycle exists in `src`.

### 4.2 Violations and gaps

**V1 — `core` dev-depends on `server` (test-scope layering inversion).**
`packages/core/package.json:54` declares `"@agentstate-lite/server": "*"` as a devDependency, and
7 core test modules import it: `packages/core/test/{wire-protocol,storage-backend-contract,
query-heads,kinds,okf-v0-2-read-compat}.test.ts`. Since `server → core` is a production edge, the
workspace graph contains a **`core ↔ server` cycle in dev scope**. Consequences: `npm test -w
@agentstate-lite/core` requires `server/dist` to exist first (the root `build` script's ordering is
load-bearing and undocumented as such), and the bottom layer's test suite can no longer be run in
isolation. The tests themselves are legitimate (they pin the wire-protocol contract) — they are
simply in the wrong package.

**Recommendation:** move the router-backed contract tests into `packages/server/test/` (importing
core downward), or extract them into a small `packages/contract-tests` workspace. Then delete the
devDependency. `packages/board-git` has the same, smaller instance (1 test-scope reference to
`@agentstate-lite/server`), despite its own gate declaring "imports ONLY node + core".

**V2 — import-direction gates cover only 3 of 9 packages.**
Machine-enforced gates exist for `board-git` (`packages/board-git/test/import-direction.test.ts`,
including a manifest-dependency assertion at `:161`), `ui-server`
(`packages/ui-server/test/import-direction.test.ts`) and `view-runtime`
(`packages/view-runtime/test/import-direction.test.mjs`). There is **no gate for `core`,
`server`, `markdown-renderer`, `mcp-app`, `ui` or `cli`.** `core`'s zero-outbound-import property —
the single most important structural invariant in the repo — is currently unprotected: a
`import { something } from "@agentstate-lite/server"` in `core/src` would be caught by nothing
except review (and `core` already has that package in its devDependencies, so it would even
resolve).

**Recommendation (highest structural ROI):** add `packages/core/test/import-direction.test.ts`
asserting `core/src` reaches only `node:*` + `gray-matter` + its own sources — 30 lines, copied
from the board-git gate. Then extend the pattern to `markdown-renderer` (node-free / browser-safe)
and `mcp-app`.

**V3 — no CI gate on cycles, size, or duplication.**
`.github/workflows/{ci-tests,ci-version-bundle,mutation-tests,release-*}.yml` contain no `madge`,
`jscpd`, eslint or complexity step, and no `lint` script exists in any workspace manifest
(TypeScript `--noEmit` is the only static gate). The two cycles in §1 are therefore free to
multiply.

**Recommendation:** add `npx madge --circular --extensions ts,tsx packages/*/src` and
`npx jscpd packages --threshold 3` to `ci-tests.yml` after fixing §1. Both are seconds-fast
(madge 1.9 s for 189 files; jscpd 62 ms).

**V4 — barrel-file fan-in concentration (informational).**
`packages/core/src/index.ts` re-exports **136 declarations** and has fan-in 49 / fan-out 39, making
it the single most-connected module in the repo. It carries no logic (complexity 1), so this is not
a correctness smell, but it means every core consumer takes a compile-time dependency on all of
core. The subpath exports (`core/kinds`, `core/page`, …) already exist as the mitigation and are
used correctly by `ui` (which must stay browser-safe) — worth extending to `cli`'s 41 edges if
CLI cold-start time ever becomes a concern.

**V5 — duplicated prototype-safety helpers across the layer boundary.**
`isPlainObject`/`isRecord`, `hasOwn`, `setOwn` are re-declared in at least 8 modules spanning 5
packages: `packages/core/src/kinds.ts:{110,117,122}`, `packages/cli/src/commands/kind.ts:{59,65,69}`
(jscpd: 11L / 89T clone of the core trio), `packages/cli/src/commands/new.ts:{128,133}`,
`packages/cli/src/commands/hook.ts:434`, `packages/cli/src/recipe-parser.ts:96`,
`packages/cli/src/skill-compatibility.ts:42`, `packages/board-git/src/cursor.ts:194`,
`packages/mcp-app/src/{view.ts:102,result-recovery.ts:17,frame-sizing.ts:15}`,
`packages/view-runtime/src/index.ts:227`. These guard `__proto__` injection from user-authored
YAML — a **security-relevant** invariant that is currently maintained in ~10 independent copies
(3 of the 5 cross-package clones jscpd found are exactly this family). Export them once from
`@agentstate-lite/core` (a browser-safe subpath, e.g. `core/record`) and delete the copies.

### 4.3 Other cross-package clones (all 5)

```
13L/98T  ui-server/src/server.ts:357-369     <-> view-runtime/src/index.ts:327-342
11L/89T  cli/src/commands/kind.ts:59-69      <-> core/src/kinds.ts:110-122          (V5)
 8L/52T  cli/src/commands/kind.ts:66-73      <-> view-runtime/src/index.ts:224-231  (V5)
 7L/59T  cli/src/commands/kind.ts:59-65      <-> view-runtime/src/action-bridge.ts:18-24 (V5)
 7L/53T  ui-server/src/watch.ts:24-30        <-> ui/src/pages/pageEvents.ts:22-27   (`ChangeEvent` re-declared)
```

The `ui-server ↔ view-runtime` pair (98 tokens, the largest cross-package clone) is the **whole
registered-View launch sequence** — `admitActiveView` → `launches.mint({sourceKind:"registered",
…, capability: resolveDeclaredAccess(...)})` → `launchIsCurrent` re-check → `revoke` on drift —
written twice: `packages/ui-server/src/server.ts:351-372` and
`packages/view-runtime/src/index.ts:326-345`. CLAUDE.md §4 makes `view-runtime` the sole
launch/trusted-action authority, so the host's copy is a second implementation of a security
sequence; the two differ only in error transport (HTTP 403 vs `throw`). Collapse the host onto the
`view-runtime` entry point and let the host map the thrown failure to a response.

---

## 5. Prioritized recommendations

**P0 — cheap, protects the strongest invariant**

1. Add an import-direction gate for `packages/core` (V2). ~30 lines, mirrors
   `packages/board-git/test/import-direction.test.ts`.
2. Add `madge --circular` + `jscpd --threshold 3` to `.github/workflows/ci-tests.yml` (V3).
3. Break both cycles by relocating two type-only exports (§1.1, §1.2). Pure moves.

**P1 — invariant erosion with user-visible consequences**

4. Decide and enforce the mutation-policy boundary for `packages/server`'s `PUT /docs/{id}`
   (`router.ts:255`) — route it through `mutateDocument` or document it as policy-free (§3.2).
5. Move `core`'s router-backed tests out of `packages/core` and drop the `@agentstate-lite/server`
   devDependency (V1). Restores an acyclic workspace graph in all scopes.
6. Centralize the prototype-safe record helpers in core (V5) — one security invariant, one
   implementation.
7. Collapse `ui-server`'s duplicated registered-View launch sequence onto `view-runtime`'s
   (§4.3) so the trusted-launch authority is literally one code path.

**P2 — the size problem, in ROI order**

8. Introduce `defineCommand(...)` for the CLI (§3.1). This is the single largest LOC and
   consistency win available (~54 clones, 13 180 LOC of `commands/`).
9. Split `mutateDocument` into three mode-specific functions behind a dispatcher, with a
   discriminated-union options type (§2.3).
10. Decompose the top complexity offenders, in this order (highest cx × reach first):
   `server/src/router.ts:204` `buildRouter` (88) → one handler-table module;
   `core/src/kinds.ts:233` `parseConventionDoc` (85, nesting 5) → per-field parsers;
   `ui/src/views/PageFrame.tsx:54` `PageFrame` (102, 487 lines) → extract the bridge
   `onMessage` reducer (`:211-323`, cx 36) into a testable pure function;
   `ui-server/src/server.ts:718` `handleRequest` (**nesting 12**) → route table;
    `cli/src/commands/{kind,status,list,new}.ts` (79/78/71/61) — largely absorbed by (8).
11. Fold `walkBlobs` into `walkMarkdown` (`core/src/backend.ts:138-171`) so "ONE bundle walk" is
    literally true (§3.2).

**P3 — hygiene**

12. Fold the intra-file clones listed at the end of §3.1.
13. Consider subpath imports from `cli` into `core` to reduce barrel fan-in (V4).

---

## Appendix A — how to reproduce

```bash
npm install                       # workspace install at repo root

# 1. cycles
npx madge@8 --extensions ts,tsx --ts-config tsconfig.json --circular packages/core/src
npx madge@8 --extensions ts,tsx --ts-config tsconfig.json --circular packages/cli/src
npx madge@8 --extensions ts,tsx --ts-config tsconfig.json --circular --warning packages/*/src

# 3. duplication (production sources)
npx jscpd@5 packages \
  --pattern "**/src/**/*.{ts,tsx}" \
  --ignore "**/node_modules/**,**/dist/**,**/*.generated.*,**/*.test.ts,**/*.test.tsx" \
  --min-lines 5 --min-tokens 50 --reporters json,console --output /tmp/jscpd

# including tests
npx jscpd@5 packages --pattern "**/src/**/*.{ts,tsx}" \
  --ignore "**/node_modules/**,**/dist/**,**/*.generated.*" \
  --min-lines 8 --min-tokens 60
```

Sections 2 and 4 (per-file LOC, per-function McCabe complexity and nesting, the cross-package
import graph including subpath exports, and the Tarjan SCC pass) were produced by an ad-hoc
`ts-morph` script over `packages/*/src/**/*.{ts,tsx}`; `madge` cannot resolve the workspace's
`@agentstate-lite/*` subpath exports (it reported 16 skipped specifiers) so the package graph in
§4.1 comes from that script rather than from `madge`. `dpdm` was also attempted and fails on
Node 20 here (`ERR_REQUIRE_ESM` in its bundled `chalk`).

Tool versions: Node 20.18.1, npm 10.8.2, madge 8.0.0, jscpd 5.0.14, ts-morph 28.

### Complexity metric definition

`cyclomatic = 1 + count(IfStatement, For/ForIn/ForOf/While/Do, CaseClause, CatchClause,
ConditionalExpression, BinaryExpression with && || ??, optional-chaining ?.)` within the function's
subtree, including nested arrow functions. File-level Σ complexity uses the same counters over the
whole file and excludes the `?.` term. Thresholds used for flagging: file > 500 LOC ("God file"),
function cyclomatic > 20 or > 100 lines or nesting > 4.
