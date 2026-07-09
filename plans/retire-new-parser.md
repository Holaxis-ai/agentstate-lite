---
type: Plan
title: >-
  Plan — Retire `new`'s hand-rolled parser onto `node:util` `parseArgs`, add
  `--actor` to `doc write` + `new`
timestamp: '2026-07-06T16:48:28.444Z'
---
# Plan — Retire `new`'s hand-rolled parser onto `node:util` `parseArgs`, add `--actor` to `doc write` + `new`

Status: BINDING. Grounded in the real code as of this branch (`M packages/server/src/router.ts` only; this
unit does NOT touch server/worker). Two cohesive asks over the same files:

- **(A)** Retire `parseNewArgs` (the lone hand-rolled command parser) in `packages/cli/src/commands/new.ts`
  in favor of `parseArgs`, matching every other command. The current parser emits a MISDIRECTING error on a
  glued/malformed flag token (a real agent hit `"... got 3 positionals"` when the real fault was a
  space-glued `--flag value` argv element).
- **(B)** Add `--actor` to `doc write` and `new` for API consistency with `doc update`/`doc delete`, threaded
  end-to-end into `WriteOptions.actor` via `mutateDoc`, with the SAME present-but-blank USAGE guard.

Scope guardrails honored: CLI-ONLY. No change to `packages/worker`, `packages/server`, or `packages/core`.
`--actor` help mirrors `doc update` verbatim — NO remote-override / pinned-identity wording (that model is
being redesigned in a separate unit; any note here would be wrong).

---

## 0. Ground-truth confirmations (verified, with line numbers)

- `packages/cli/src/commands/new.ts`
  - `parseNewArgs` = lines **82–143**; `ParsedNewArgs` interface = **66–73**; file header rationale
    ("parses argv by hand") = **26–28**.
  - It supports: `--<field> <value>` AND `--<field>=<value>` (**108–122**); repeated field → `Map<string,string[]>`
    collapsed to scalar-or-array in the frontmatter loop (**134–137**, **202–207**); control flags `-h/--help`
    (**92–95**), `--json` (**96–99**), `--dir`/`--remote` intercepted BEFORE the field bucket (**126–133**);
    bespoke `'--'`/`'--=…'` rejects (**102–104**, **123–125**); `> 2` positionals guard (**169–175**);
    unknown-field error AFTER `loadKinds` (**191–200**); strict create-only `mutateDoc` (**221–241**);
    `resolveInstanceId` path-prefixing (**146–150**, **214**).
  - `NEW_USAGE` = **36–60** (Options block **54–59**, NO `--actor`).
- `packages/cli/src/commands/doc.ts`
  - `docWrite` = **253–410**; its `parseArgs` options block = **259–277** (has type/title/description/resource/
    tag/timestamp/body/body-file/blank-body/strict/dir/remote/json/help — **NO actor**); it builds the
    receipt at **397–409** and calls `mutateDoc` mode `"overwrite"` at **384–394** (does NOT pass `actor`).
  - `docUpdate` blank-`--actor` guard = **615–619** (message `"--actor was given an empty value …"`, exit 2);
    it threads `actor: p.actor?.trim()` at **679**.
  - `docDelete` = **988–1071**; parses `--expected-version` via `parseArgs` + present-but-blank guard **1036–1043**
    (it does NOT have `--actor`; `deleteDoc` takes no actor — leave unchanged).
  - `DOC_USAGE` = **71–176**; `doc write options` block = **83–101**; `doc update`'s `--actor` help = **130–132**
    (the wording to mirror).
- `packages/cli/src/args.ts`: `parseOrUsage(parse, command)` (**59–69**) runs a thunk, PASSES THROUGH a thrown
  `CliError` unchanged (**63**), and TRANSLATES any other parse error via `translateParseArgsError` (**37–56**).
  This passthrough is what lets `new` throw its OWN kind-specific `CliError` from inside the thunk — so **args.ts
  needs NO change**.
- `packages/cli/src/mutate.ts`: `mutateDoc` already threads `opts.actor` on EVERY mode —
  create-only (**205**: `{ expectedVersion: null, actor: opts.actor }`), overwrite (**219**:
  `opts.actor ? { actor: opts.actor } : undefined`), patch (**269**). So `new` (create-only) and `doc write`
  (overwrite) only need to PASS `actor` in. **mutate.ts needs NO change.**
- `packages/core/src/kinds.ts`: `RESERVED_FIELD_NAMES = new Set(["type", "dir", "remote", "json", "help"])`
  (**135**); `loadKinds` STRIPS those from `fields.required`/`fields.optional` (**222–232**, filter helper
  `dropReserved`). Consequence: `declaredFields` (`[...required, ...optional]`) can NEVER contain
  `type/dir/remote/json/help` — the ONLY control-name collision still possible in `declaredFields` is **`actor`**
  (not reserved by core). Handled in the CLI layer (§1.4). **core needs NO change.**
- `packages/cli/src/reference.ts`: `COMMAND_GROUPS` — `doc write` usage line = **56**, `doc update` line
  (already shows `[--actor <n>]`) = **60–62**, `new` line = **108**. This is the SINGLE SOURCE the two
  `SKILL.md` files are generated from (see §5).
- Tests: there is **no `new.test.ts`** — the `new` parser assertions live in
  `packages/cli/test/kinds.test.ts` (**lines 109–319**, plus remote parity at **496–497**). `doc write` actor
  test pattern to mirror lives in `packages/cli/test/doc.test.ts` (`doc update --actor ''` = **879–898**;
  filesystem-accepts test **973–983**; remote test **985–1000**; MemoryBackend persistence **949–971**).

### Exactly which `new` parsing behaviors `kinds.test.ts` asserts (so the migration cannot regress them)

| Test (kinds.test.ts) | argv shape exercised | Assertion the new parser must keep |
|---|---|---|
| unknown kind (109) | `["Bogus Kind","x","--dir",dir,"--json"]` | Kind positional may contain a SPACE (single argv element); `/unknown kind 'Bogus Kind'/`, enumerates declared |
| missing required (128) | `["Context Note","missing-title","--dir",dir,"--json"]` | parser accepts; VALIDATION (not parser) rejects: `/does not satisfy the 'Context Note' kind/` + `/title/` |
| conforming + prefix (148) | `["Context Note","my-note","--title","Hello",...]` and prefixed-id | `--field value` form; `resolveInstanceId` prefixing unchanged |
| create-only (176) | second `new` at same id | ALREADY_EXISTS exit 5 (unchanged — parser-independent) |
| unknown field (203) | `[...,"--title","T","--bogus-field","v",...]` | `/unknown field\(s\).*bogus-field/` |
| stray positional (220) | `["Context Note","x","extra-positional","--title","T",...]` | `>2` guard: `/positionals/` |
| `=` form (237) | `["Context Note","eq-form","--title=Equals Form",...]` | `--field=value` incl. spaces in the value |
| reserved `type` field (250) | Kind "Hijack" declaring field `type`; `--type "Something Else"` | `type` stripped by `loadKinds` → `--type` is UNKNOWN: `/unknown field\(s\).*type/` |
| sections + enum (280) | `["Roadmap Item","r1","--title","R1","--status","planned",...]` | declared field captured; disallowed enum → validation reject `/cancelled/` |
| remote parity (496) | `["Context Note","n1","--title","N1","--remote",url]` | `--remote` selects the remote backend |

**No test relies on flags appearing BEFORE the `Kind`/`id` positionals** (every case puts `Kind` then `id` — and,
for the stray-positional case, the extra positional — contiguously first, then `--flags`). This licenses the
documented "Kind and id are the leading positionals" constraint used by the two-phase parse (§1.2).

---

## 1. The design fork — RESOLVED

`parseArgs` needs KNOWN options, but `new` accepts DYNAMIC kind fields not known until the Kind is loaded.

**Decision: Candidate 1 — kind-aware, two-phase, STRICT `parseArgs` (the brief's recommended path).**
Phase 1 discovers the `Kind` + bundle-selection flags leniently; Phase 2 re-parses STRICTLY against a config
built from the loaded kind's declared fields. Rationale:

1. **Consistency (the human's stated reason).** Phase 2 is a bog-standard strict `parseArgs({options, allowPositionals:true})`
   run through the shared `parseOrUsage` — byte-for-byte the shape `doc read`/`doc history`/`doc delete`/`doc write`
   use. Candidate 2 (a `tokens:true` walk) would KEEP hand-rolled value-association and the boolean/value
   distinction — i.e. it retires the tokenizer but not the domain hand-logic, which is exactly what the human
   wants gone. Candidate 1 maximally retires the hand roll.
2. **Errors as-good-or-better.** Strict `parseArgs` gives standard `ERR_PARSE_ARGS_*` errors (missing value,
   takes-no-value) already translated by `parseOrUsage`. The one place we want a RICHER message than the generic
   "unknown option 'x'" — the unknown-kind-field case — we intercept `ERR_PARSE_ARGS_UNKNOWN_OPTION` and throw the
   existing `"unknown field(s) for kind 'X' (declared: …)"` message. The GLUED token
   (`"--status todo"` as one argv element) tokenizes to option-name `"status todo"` (no `=`, so the whole tail is
   the name), which is unknown → the SAME rich "unknown field(s) … status todo" error that NAMES the offending
   token — replacing the misdirecting "got N positionals".
3. **No parser enforcement drift.** Required-field / enum enforcement stays where it is today: in `mutateDoc`'s
   strict validate step, NOT the parser (the "missing required" test asserts a validation message, not a parse
   error). The parser only VALIDATES FLAG SHAPE.

### 1.1 One shared control-options constant (both phases)

```ts
// Bundle-selection + output control flags for `new`. NOT `strict` (new is ALWAYS strict — a `--strict`
// token must remain an "unknown field", matching today's behavior where it falls into the field bucket
// and is rejected as undeclared). `actor` is a control flag here, mirroring `doc update`, so a kind field
// literally named `actor` is unreachable via `new` — see §1.4.
const NEW_CONTROL_OPTIONS = {
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
} as const;
```

### 1.2 Phase 1 — lenient discovery (Kind + bundle-selection + help)

```ts
const pre = parseOrUsage(
  () => parseArgs({ args: argv, strict: false, allowPositionals: true, options: NEW_CONTROL_OPTIONS }),
  "new",
);
if (pre.values.help) { stdout(NEW_USAGE); return; }              // help works offline, before openBundle
const kindName = (pre.positionals[0] as string | undefined)?.trim();
if (!kindName) {
  throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
    help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`,
  });
}
```

Why `pre.positionals[0]` is reliably the Kind: with `strict:false`, unconfigured kind-field flags become
booleans and their space-separated values LEAK into `positionals` — but a leak can only appear AFTER its flag,
so it can only precede the Kind if a flag precedes the Kind. Control flags ARE configured here, so `--dir x Task`
consumes `x` and leaves `positionals[0] === "Task"`. The only way `positionals[0]` is not the Kind is a
kind-field flag placed before the Kind — which no test does and which is documented-unsupported ("Kind and id
come first"). We read ONLY `positionals[0]` from Phase 1; the AUTHORITATIVE positionals come from Phase 2.

Then open the bundle and load kinds (unchanged from today, lines 177–189):

```ts
const bundle = await openBundle(pre.values.dir as string | undefined,
  resolveRemoteFlag(pre.values.remote as string | undefined, pre.values.dir as string | undefined));
const registry = await loadKinds(bundle);
const kind = registry.kinds.get(kindName);
if (!kind) { /* unchanged unknown-kind USAGE error, lines 180–189 */ }
```

### 1.3 Phase 2 — strict, kind-aware, AUTHORITATIVE parse

```ts
const declaredFields = [...kind.fields.required, ...kind.fields.optional]; // `type` etc. already stripped by loadKinds
// A declared field colliding with a control-flag name is shadowed by control (see §1.4). Only `actor`
// can collide (core already strips type/dir/remote/json/help). Exclude it from the field config + build loop;
// still list it in `declaredFields` for the "declared: …" hint text.
const fieldNames = declaredFields.filter((f) => f !== "actor");
const fieldOptions = Object.fromEntries(
  fieldNames.map((f) => [f, { type: "string", multiple: true } as const]),
);

const { values, positionals } = parseOrUsage(() => {
  try {
    return parseArgs({
      args: argv,
      allowPositionals: true,
      strict: true,
      options: { ...fieldOptions, ...NEW_CONTROL_OPTIONS }, // control wins on name collision
    });
  } catch (err) {
    // Preserve the helpful unknown-field UX: re-throw the kind-specific message. `parseOrUsage`
    // passes a thrown CliError through unchanged, and translates any OTHER parse error normally.
    if ((err as { code?: unknown } | null)?.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
      const raw = /'([^']+)'/.exec((err as Error).message)?.[1] ?? "";
      const field = raw.replace(/^--?/, ""); // node quotes the raw '--name'; strip the dashes
      throw new CliError(
        "USAGE",
        `unknown field(s) for kind '${kind.governs}': ${field}` +
          (declaredFields.length > 0
            ? ` (declared: ${declaredFields.join(", ")})`
            : " (this kind declares no fields)"),
        { help: `${cliInvocation()} kinds` },
      );
    }
    throw err; // parseOrUsage → translated USAGE (missing value, takes-no-value, …)
  }
}, "new");
```

Then the AUTHORITATIVE positional checks (id + `>2` guard), unchanged wording:

```ts
const id = (positionals[1] as string | undefined)?.trim();
if (!id) {
  throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
    help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`,
  });
}
if (positionals.length > 2) {
  throw new CliError(
    "USAGE",
    `new takes exactly "<Kind>" and <id>, got ${positionals.length} positionals: ${positionals.join(", ")}`,
    { help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>` },
  );
}
```

`--field value`, `--field=value`, and repeated `--field a --field b` are all handled natively by `parseArgs`
because every field option is `{ type: "string", multiple: true }` → `values[field]` is always `string[] |
undefined`.

### 1.4 The `actor`-vs-dynamic-field collision (explicit resolution)

Core's `RESERVED_FIELD_NAMES` does NOT include `actor`, so a kind COULD declare a field named `actor`, which
survives `loadKinds` into `declaredFields`. Adding `--actor` as a `new` control flag shadows it. This is the
SAME shadowing `doc update` already applies (its `DOC_UPDATE_VALUE_FLAGS` set includes `"actor"`, doc.ts
**416–426**, so `--actor` there is control, never a kind field). So the CLI already treats `actor` as a
reserved control name on its mutation surface; `new` matching that is CONSISTENT, not a regression, and it is NOT
worth a core `RESERVED_FIELD_NAMES` change (out of this unit's CLI-only scope and a broader semantic change to
kind conventions). Mechanically: exclude `actor` from BOTH `fieldOptions` and the frontmatter build loop
(`fieldNames = declaredFields.filter(f => f !== "actor")`); keep it in `declaredFields` only for the
"declared: …" hint. Documented as a one-line note in the rewritten header.

### 1.5 Behavior deltas this migration introduces (all acceptable, none tested against)

- **Glued/malformed flag token** → now an "unknown field(s) for kind 'X': <token> (declared: …)" USAGE error
  that NAMES the token, instead of a misdirecting "got N positionals". (The whole point.)
- **Unknown fields reported one-at-a-time** (strict `parseArgs` throws on the first) instead of all-collected.
  Tests only assert a single unknown; UX is as-good (you fix them one at a time). Noted in the header.
- **Bare `--`** is now the standard `parseArgs` option-terminator (everything after is positional) instead of
  the bespoke `"'--' is not a valid flag"` reject; **`--=…`** yields a standard `parseArgs` USAGE error. Neither
  is tested; both are standard-clean improvements.
- **Ordering:** unknown-kind (Phase 1) now precedes the `>2`-positionals guard (Phase 2). For a valid kind the
  guard still fires; for `new "Bogus" x extra` you now get "unknown kind" instead of "got 3 positionals" — both
  USAGE (exit 2), neither tested. Noted.

---

## 2. Per-file edits

### 2.1 `packages/cli/src/commands/new.ts` — CHANGE (parser + `--actor` + docs)

1. **Imports:** add `import { parseArgs } from "node:util";` and `import { parseOrUsage } from "../args.js";`
   Keep existing imports. (`args.ts` itself unchanged — see §1.)
2. **Delete** the `ParsedNewArgs` interface (**66–73**) and the whole `parseNewArgs` function (**82–143**).
   Keep `resolveInstanceId` (**146–150**) verbatim.
3. **Rewrite the file header** (**26–28** region and the `parseNewArgs` JSDoc **75–81**): replace the
   "parses argv by hand" rationale with the two-phase `parseArgs` rationale — Phase 1 lenient discovery of the
   Kind + bundle flags, Phase 2 strict kind-aware re-parse; note (a) `--actor` is a control flag shadowing any
   like-named kind field (§1.4), (b) unknown kind fields surface via the intercepted
   `ERR_PARSE_ARGS_UNKNOWN_OPTION`. Do NOT keep any claim that a static option spec "does not fit".
4. **Rewrite `newCommand`'s parse section** (currently **152–200**) to the Phase 1 / Phase 2 flow of §1.2–§1.3.
   Everything from the frontmatter build onward (currently **202–259**) stays, with two adjustments:
   - Build the frontmatter loop over `fieldNames` (not `declaredFields`), reading `values[field] as string[] |
     undefined`:
     ```ts
     const frontmatter: Frontmatter = { type: kind.governs };
     for (const field of fieldNames) {
       const vals = values[field] as string[] | undefined;
       if (vals === undefined || vals.length === 0) continue;
       frontmatter[field] = vals.length === 1 ? vals[0]! : vals;
     }
     ```
   - **Add the present-but-blank `--actor` guard** (mirror doc.ts **615–619**), placed after Phase 2 parse and
     before `mutateDoc`:
     ```ts
     const actor = values.actor as string | undefined;
     if (actor !== undefined && actor.trim() === "") {
       throw new CliError("USAGE", "--actor was given an empty value — pass an actor identity or omit the flag.", {
         help: `${cliInvocation()} new "<Kind>" <id> --actor <name>`,
       });
     }
     ```
   - **Thread actor into `mutateDoc`:** add `actor: actor?.trim(),` to the `mutateDoc({...})` options object
     (create-only mode already forwards `opts.actor`, mutate.ts **205**).
   - Replace `resolveMode({ json: parsed.json })` with `resolveMode({ json: Boolean(values.json) })`.
   - `resolveRemoteFlag`/`openBundle` now use `pre.values.remote`/`pre.values.dir` (Phase 1); the `mutateDoc`
     `remoteUrl` field takes `pre.values.remote as string | undefined`.
5. **`NEW_USAGE`** (**36–60**): add an `--actor` line to the Options block, mirroring `doc update` (doc.ts
   **130–132**), NO remote wording:
   ```
     --actor <name>        Attribute this write (recorded in version history by a persisting backend; the
                            local filesystem backend accepts but does not store it). A present-but-blank
                            value is a USAGE error (exit 2).
   ```
   Place it after `--json`, before `-h, --help`.

TS note: with a runtime-built `options` object, `parseArgs` widens `values` to
`{ [k: string]: undefined | string | boolean | (string|boolean)[] }`. Access with the casts shown
(`as string[] | undefined`, `as string | undefined`, `Boolean(values.json)`). This compiles clean under the
package's `tsc --noEmit`.

### 2.2 `packages/cli/src/commands/doc.ts` — CHANGE (`docWrite` `--actor` + help)

1. **`docWrite` `parseArgs` options** (**259–277**): add `actor: { type: "string" },` (e.g. after `remote`).
2. **Blank-`--actor` guard** in `docWrite`, after the `--type` check (~**297**) and before body resolution,
   mirroring doc.ts **615–619**:
   ```ts
   if (values.actor !== undefined && values.actor.trim() === "") {
     throw new CliError("USAGE", "--actor was given an empty value — pass an actor identity or omit the flag.", {
       help: `${cliInvocation()} doc write ${id} --actor <name>`,
     });
   }
   ```
3. **Thread actor** into the `docWrite` `mutateDoc({...})` call (**384–394**): add
   `actor: values.actor?.trim(),`. Overwrite mode already forwards it (mutate.ts **219**).
4. **`DOC_USAGE`** `doc write options` block (**83–101**): add an `--actor` line mirroring the `doc update`
   entry (**130–132**), placed after `--strict`:
   ```
     --actor <name>       Attribute this write (recorded in version history by a persisting backend; the
                          local filesystem backend accepts but does not store it). A present-but-blank
                          value is a USAGE error (exit 2).
   ```
   Do NOT touch `docUpdate`/`docDelete`/`docRead`/`docHistory` or their help.

### 2.3 `packages/cli/src/reference.ts` — CHANGE (COMMAND_GROUPS usage lines)

For discoverability + parity with the existing `doc update` line (which already shows `[--actor <n>]`):

- `doc write` usage (**56**): append `[--actor <n>]` before `[--remote <url>]`:
  `doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [--actor <n>] [--remote <url>]`
- `new` usage (**108**): append `[--actor <n>]` before `[--remote <url>]`:
  `new "<Kind>" <id> --<field> <value> [...] [--actor <n>] [--remote <url>]`

This is the ONLY change that touches the SKILL single-source → both `SKILL.md` files MUST be regenerated (§5).

### 2.4 `packages/cli/test/kinds.test.ts` — CHANGE (add `new` tests; migrate none)

All ten existing `new` assertions (§0 table) pass UNCHANGED — do not edit them. ADD:

- **`new --actor '' (blank): USAGE (exit 2)`** — mirror doc update **879–898**. Seeded bundle, valid conforming
  args plus `--actor ""`; assert `err.code === "USAGE"`, `err.exitCode === 2`, `/empty value/`.
- **`new --actor <name>: accepted over a filesystem bundle (no crash, writes)`** — run
  `["Context Note","actor-note","--title","T","--actor","alice","--dir",dir]`; assert `result.new === "written"`
  and the doc is readable (filesystem accepts-but-does-not-persist; do NOT assert stored actor over `--dir`).
- **`new: a glued flag token names the token, not "N positionals" (parser-migration regression)`** — run
  `["Context Note","x","--title todo","--dir",dir,"--json"]` (space-glued `--title todo` as one element);
  assert `err.code === "USAGE"` AND that the message NAMES the token and is NOT the positionals-count error:
  `assert.match(err.message, /title todo/); assert.doesNotMatch(err.message, /positionals/);`
  Justification: this is the exact misdirection the migration fixes; it is new coverage, not a migrated assertion.
- **`new: a repeated --<field> becomes an array`** — construct a purpose-built kind (same `initBundle` +
  `writeDoc` a `Convention` doc pattern as the sections test **280–298**) declaring an OPTIONAL repeatable field
  (e.g. `fields: { required: ["title"], optional: ["tag"] }`); run `["Kindname","x","--title","T","--tag","a",
  "--tag","b","--dir",dir]`; read the doc; assert `frontmatter.tag` deep-equals `["a","b"]`. Justification:
  explicit lock on the repeated→array behavior the `multiple:true` option preserves.

No assertion is MIGRATED (the improved-error tests are ADDITIONS; every legacy assertion still holds verbatim).

### 2.5 `packages/cli/test/doc.test.ts` — CHANGE (add `doc write` actor tests)

Mirror the `doc update` actor trio, using the existing `runDoc`/`makeTaskBundle`/`bootServerOverBundle`
helpers:

- **`doc write --actor '' (blank): USAGE (exit 2)`** — `["write","tasks/x","--type","Task","--body","b",
  "--actor","","--dir",dir,"--json"]`; assert USAGE, exit 2, `/empty value/`.
- **`doc write --actor: accepted over a filesystem bundle (no crash)`** — `runDoc(["write","tasks/y","--type",
  "Note","--actor","alice","--dir",dir])`; assert `result.doc === "written"`.
- **(recommended) `doc write --actor: recorded in version history on a persisting backend`** — MemoryBackend
  bundle (as doc.test.ts **949–971**), call `doc(["write","tasks/z","--type","Note","--actor","alice", …])`
  through the CLI against the MemoryBackend-backed bundle (or drive `mutateDoc` overwrite directly with
  `actor:"alice"`), then `docVersions` and assert newest `.actor === "alice"`. Proves the overwrite-mode
  thread-through end-to-end. Skip only if wiring a MemoryBackend bundle through the `doc` CLI dep surface is
  awkward; the mutate-level proof already exists for update and overwrite shares the same `opts.actor` path.

### 2.6 `skills/agentstate-lite/SKILL.md` + `packages/cli/SKILL.md` — REGENERATED (not hand-edited)

Because §2.3 changes `COMMAND_GROUPS`, both generated `SKILL.md` files change. Regenerate via the scripts
(§5), never by hand — both carry the "GENERATED … do not edit by hand" banner and are guarded by the drift
gate.

---

## 3. Confirmed NO-CHANGE files

- `packages/cli/src/mutate.ts` — already threads `opts.actor` on create-only (**205**) and overwrite (**219**).
- `packages/cli/src/args.ts` — `parseOrUsage`'s CliError-passthrough (**63**) is exactly the seam `new` uses to
  inject its kind-specific unknown-field error; no new export needed.
- `packages/cli/src/commands/doc.ts` `docUpdate`/`docDelete`/`docRead`/`docHistory` — untouched (`docDelete` has
  no actor by design; `deleteDoc` takes none).
- `packages/core/**` (incl. `kinds.ts` `RESERVED_FIELD_NAMES`, `writeDocVersioned`) — the `actor` collision is
  resolved in the CLI layer (§1.4).
- `packages/worker/**`, `packages/server/**`, `packages/viewer/**` — out of scope.
- `CLAUDE.md`, `docs/**` — no gate/vision change.

---

## 4. Full test matrix

Existing (must stay green, unchanged):

- `kinds.test.ts` `new` block (lines 109–319) — all 10 assertions in the §0 table.
- `kinds.test.ts` remote parity (496–497).
- `doc.test.ts` full `docWrite`/`docUpdate`/`docDelete` suites (adding an option is backward-compatible).
- CLI integration suites that exercise `new`/`doc write` (`doc-cli-integration.test.ts`, `remote.test.ts`,
  `recipes.test.ts`, `recipe-source.test.ts`).

Added (this unit):

| File | Case | Expect |
|---|---|---|
| kinds.test.ts | `new --actor ''` | USAGE, exit 2, `/empty value/` |
| kinds.test.ts | `new --actor alice` (fs) | `new === "written"`, doc readable |
| kinds.test.ts | glued `--title todo` | USAGE, `/title todo/`, `doesNotMatch /positionals/` |
| kinds.test.ts | repeated `--tag a --tag b` | `frontmatter.tag` = `["a","b"]` |
| doc.test.ts | `doc write --actor ''` | USAGE, exit 2, `/empty value/` |
| doc.test.ts | `doc write --actor alice` (fs) | `doc === "written"` |
| doc.test.ts | `doc write --actor` (MemoryBackend, recommended) | `docVersions[0].actor === "alice"` |

Regression sweep to eyeball while running: `new "<Kind>=…"` / `--field=value` with spaces, `--field value`,
missing-value (`new K x --title` → USAGE "requires a value"), unknown kind still enumerates, prefix
resolution and create-only ALREADY_EXISTS unaffected.

---

## 5. Build / verify / SKILL + drift gates

Run in order; each must exit 0.

1. `npm run build` (bundles the CLI to `packages/cli/dist/agentstate-lite.mjs`).
2. `npm run typecheck`.
3. `npm test --workspaces --if-present` (core + cli + viewer).
4. **Regenerate SKILL (COMMAND_GROUPS changed):** `npm run build:skill -w agentstate-lite`
   (runs `build.mjs` + `gen-skill.mjs --target skill`) AND `npm run gen:skill -w agentstate-lite`
   (the npm-target `packages/cli/SKILL.md`). Commit both regenerated files.
5. **Full gate:** `npm run check` — this re-runs build + typecheck + all suites + the SKILL drift gates
   (`check:skill`, `check:skill:bundle`, `check:bundle`). It will FAIL if step 4's regeneration was skipped.
6. **AXI pre-ship (gate 1):** load the `axi` skill and re-check the touched surface — errors on stdout as
   structured TOON with the capped exit taxonomy (USAGE=2), idempotency unaffected, help writes/points
   correctly. The `--actor` addition and the parser swap keep all ten AXI principles.

### Smoke-test the BUILT dist (`node packages/cli/dist/agentstate-lite.mjs …`)

In a scratch bundle that declares a `Task` kind (init, then write a `conventions/task.md` `Convention` doc:
`type: Convention`, `governs: Task`, `fields.required: [title, status]`, `fields.values.status: [todo, doing,
done]`, `fields.optional: [priority, tag]`):

- `new "Task" x --status todo --title T` → written (`type: Task`, `status: todo`).
- `new "Task" x2 --status bad --title T` → USAGE exit 2 (enum validation rejects `bad`).
- `new "Task" x3 --status todo --priority high --title T` → written, `priority: high`.
- `new "Task" x4 --status=todo --title=T2` → written (`=` form).
- `new "Task" x5 --status todo --tag a --tag b --title T` → written, `tag: [a, b]` (repeated → array).
- `new "Task" x6 --status todo --title T` again → ALREADY_EXISTS exit 5 (create-only unchanged).
- `new "Task" x7 "--status todo" --title T` (space-glued one arg) → USAGE naming the token
  ("unknown field(s) … status todo"), NOT "got N positionals".
- `doc write y --type Note --actor me` → written (any bundle).
- `agentstate-lite view examples/sample-bundle` → writes `viz.html`, prints its path, **4 nodes / 7 edges**.

### Publishability (unchanged, per CLAUDE.md)

`npm pack -w agentstate-lite`, run the tarball bin in a temp dir outside the monorepo; `node_modules` must
contain ONLY `agentstate-lite`.

---

## 6. Commit

One reviewed unit: the parser retirement + `--actor` on `doc write`/`new` are cohesive (same files, same
receipts). Regenerated `SKILL.md` files ride along. Message describes both (A) and (B) and notes the
CLI-only scope. Local only — no PR until the human asks. End the commit body with the required
`Co-Authored-By` / `Claude-Session` trailers from CLAUDE.md's git conventions.
