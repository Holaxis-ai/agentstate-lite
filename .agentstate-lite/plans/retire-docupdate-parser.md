---
type: Plan
title: >-
  Plan — Retire `doc update`'s hand-rolled parser (`parseDocUpdateArgs`) onto
  `node:util` `parseArgs`
timestamp: '2026-07-06T16:48:26.798Z'
---
# Plan — Retire `doc update`'s hand-rolled parser (`parseDocUpdateArgs`) onto `node:util` `parseArgs`

Status: **BINDING.** Grounded in the real code as of this branch (`M packages/server/src/router.ts` only;
this unit does **not** touch server/worker/core). Retires the SECOND and LAST hand-rolled command arg
parser — `parseDocUpdateArgs` in `packages/cli/src/commands/doc/update.ts` — the way Unit 1 retired `new`'s
`parseNewArgs` (commit 5c5dd31, `plans/retire-new-parser.md`). CLI-only, one file of product changes
(`update.ts`), plus test additions. **`new.ts` is left untouched** (Fork 2, resolved below).

The design crux is real and is why this is NOT a copy of the `new` retire: `new`'s `Kind` is a POSITIONAL known
BEFORE parsing, so Unit 1 could do a two-phase **kind-aware STRICT** parse (peek Kind → `loadKinds` → build a
strict `parseArgs` options config from the kind's declared fields). `doc update` **cannot**: its dynamic kind
fields (`--status`, `--priority`, …) are validated against the EXISTING doc's `type`, read at MUTATE time inside
`mutateDoc`'s versioned-read/CAS-retry loop (and possibly overridden by `--type`). Building a kind-field parse
config up front would require an EXTRA pre-parse read AND be UNSOUND under concurrency (a concurrent writer could
change the type between the pre-parse read and the CAS write, so the parse config would not match the type
actually written). So the kind fields MUST stay dynamically collected at parse time and validated LATE (inside
`buildCandidate`), exactly as today. The plan retires the CHARACTER-level hand-roll while keeping that
irreducible late-validation domain logic.

---

## 0. Ground-truth confirmations (verified against the real code, with line numbers)

### `packages/cli/src/commands/doc/update.ts` (the only product file that changes)

- **Imports** = lines **3–10** (`node:fs`, core `loadKinds`/`Frontmatter`, `../../bundle.js`, `../../errors.js`,
  `../../output.js`, `../../invocation.js`, `../../mutate.js`, `./common.js`). It imports **neither** `parseArgs`
  **nor** `parseOrUsage` today — both must be added.
- `DOC_UPDATE_FIELD_FLAGS` = line **13** (`title/description/tag/type/body/body-file`) — used ONLY to build the
  "at least one field to patch" USAGE message (line **246**). **KEEP verbatim.**
- `DOC_UPDATE_VALUE_FLAGS` = lines **16–26** (`title, description, type, body, body-file, dir, remote,
  expected-version, actor` — note **NOT** `tag`). `DOC_UPDATE_BOOLEAN_FLAGS` = line **28**
  (`keep-timestamp, strict, json`). **KEEP both** — the token-walk uses them to bucket standard-vs-dynamic and to
  reject a boolean given a value.
- `ParsedDocUpdateArgs` interface = lines **30–51**. **KEEP verbatim** — it stays the exact return shape
  `docUpdate` consumes, so `docUpdate` (lines **178–358**) needs ZERO changes. Its `body?: string` comment
  (line **41**) — "`undefined` = not given; `""` = explicit empty (same distinction `values.body !== undefined`
  made)" — stays accurate under `parseArgs` (`--body ""` → `values.body === ""`; absent → `undefined`).
- **The hand-rolled character parser** `parseDocUpdateArgs` = lines **65–176**, with its JSDoc header at lines
  **53–64**. The header at line **58** contains the STALE reference `` `new.ts::parseNewArgs` `` (Unit 1 DELETED
  `parseNewArgs`) plus a now-false claim that "`node:util parseArgs({strict:false})` cannot cleanly do this". Both
  are fixed here (§6). The body distinguishes: value flags (`takeValue()` consumes next token or `=value`),
  boolean flags (reject `=value`), `--tag` (repeatable → array), and EVERYTHING ELSE → dynamic `kindFields`
  candidate (repeatable). It rejects `--` (line **95**) and `--=` (line **103**), accepts both `--field=value` and
  `--field value`, and collects positionals. **REWRITE** (§4/§6).
- `docUpdate` (lines **178–358**) enforces, all UNCHANGED:
  - `p.help` → print `DOC_USAGE`, return (**183–186**).
  - `id = p.positionals[0]?.trim()`, empty → USAGE (**188–193**).
  - `>1` positional guard (**197–203**).
  - present-but-blank `--expected-version` → USAGE (**208–214**) and present-but-blank `--actor` → USAGE
    (**215–219**).
  - body source precedence — `--body` (even `""`) wins, then `--body-file`, then non-empty piped stdin; stdin read
    ONCE before the CAS loop (**221–229**).
  - "at least one field to patch" (`anyFieldGiven`, incl. `p.kindFields.size > 0`) → USAGE (**234–250**).
  - `strict = p.strict || p.kindFields.size > 0` (**264**).
  - LATE kind-field validation inside `buildCandidate` (**299–328**): ungoverned result type → USAGE
    (`no kind governs type 'X'`); unknown declared field → USAGE (`unknown field(s) for kind 'X'`); else write.

### Reference / reuse (no change to these)

- `packages/cli/src/args.ts` — `parseOrUsage(parse, command)` (**59–69**) runs a thunk, PASSES THROUGH a thrown
  `CliError` unchanged (**63**), and translates any other parse error via `translateParseArgsError` (**37–56**).
  **REUSE** to wrap the `parseArgs` call for a house-consistent USAGE shape; **args.ts needs NO change.**
- `packages/cli/src/commands/doc/write.ts` — the house pattern is
  `parseOrUsage(() => parseArgs({ args, options, allowPositionals: true }), "doc write")` (lines **18–41**),
  reading typed values off a STATIC options literal (no casts). `doc write` uses the DEFAULT `strict: true`
  (rejects unknown flags). `doc update` is the one verb that cannot (dynamic kind fields), which is the
  documented reason it alone runs `strict: false` + `tokens: true` + a walk.
- `packages/cli/src/commands/doc/common.ts` — `DOC_USAGE` (**9–120**), `DocCliDeps`, `defaultReadStdin`. `doc
  update`'s help block is **44–76**. **Unchanged** — this unit adds no flag and changes no wording, so help text
  does NOT change (→ no SKILL/bundle regen; see §8).
- `packages/cli/src/mutate.ts`, `packages/core/**` — untouched.
- `../doc.ts` (i.e. `packages/cli/src/commands/doc.ts`) referenced by update.ts's line-1 top comment STILL EXISTS
  — that reference is valid; leave it. The ONLY stale reference is `new.ts::parseNewArgs` (line 58).

### CONFIRMED parseArgs tokenization (empirically probed — the Fork-1 crux)

Probed with `parseArgs({ tokens: true, strict: false, allowPositionals: true, options: <all standard flags> })`:

| input | `values` | `positionals` | tokens (relevant) |
|---|---|---|---|
| `--status done` (unknown value-flag) | `{status:true}` | `["id","done"]` | `option{name:status, NO value}` then `positional{value:done, index=optIdx+1}` |
| `--status=done` (unknown, =form) | `{status:"done"}` | `["id"]` | `option{name:status, value:"done", inlineValue:true}` |
| `--status todo` (shell-glued, ONE argv elem) | `{"status todo":true}` | `["id"]` | `option{name:"status todo", NO value}` (no `=`, whole tail is the NAME) |
| `--title New Title` (known value-flag) | `{title:"New"}` | `["id","Title"]` | `option{name:title, value:"New"}` then `positional{value:Title}` |
| `--title=Equals Form` | `{title:"Equals Form"}` | — | `option{name:title, value:"Equals Form", inlineValue:true}` |
| `--keep-timestamp=x` (boolean +value) | `{"keep-timestamp":"x"}` | — | `option{name:keep-timestamp, value:"x", inlineValue:true}` — **NOT thrown under strict:false** |
| `--` | `{}` | trailing args positional | `option-terminator` then positionals |
| `--title` at end (known value-flag, no value) | `{title:true}` | `["id"]` | `option{name:title, NO value}` |

**Decisive facts this establishes:**
1. Under `strict:false`, an UNKNOWN option is tokenized as a **valueless** option and its intended value LEAKS
   into `positionals` — so `values`/`positionals` alone are useless for dynamic kind fields (`{status:true}` loses
   the value; `"done"` pollutes positionals and would wrongly trip the `>1`-positional guard). A **token walk** is
   mandatory.
2. A CONFIGURED value flag reliably carries its value on the token when present (`value:"New"`), and is valueless
   ONLY when genuinely at end. So configured flags are read straight from `values`; only UNKNOWN options need
   manual value reconstruction.
3. The value of an unknown option is the **next token IF it is a `positional` whose argv `index === option.index +
   1`** — this is SOUND (respects parseArgs's own consumption), unlike a raw `argv[i+1]` peek, which double-counts
   when the next argv element is itself a configured flag parseArgs already consumed.
4. A boolean flag given `=value` does NOT throw under `strict:false`; it must be rejected manually off the token's
   `value` (present → throw), preserving today's `--flag does not take a value` message.
5. `parseArgs` OWNS all character-level tokenization now: `--x=y` splitting, quoting, `--` terminator, short `-h`,
   and NAMING a shell-glued token (`"status todo"`). The hand-roll's `startsWith("--")` / `slice(2)` /
   `indexOf("=")` / manual `=` splitting all disappear.

---

## 1. Full preserved-behavior test matrix (every asserted `doc update` parse behavior)

All live in `packages/cli/test/doc.test.ts` (no `doc/update`-specific file). The kind-field cases live there too
(NOT in `kinds.test.ts`, whose `doc update` mentions are incidental — its parser-migration block at **321+** is
`new`-only). Every row below is a hard invariant; the migrated parser is validated to reproduce each (all
confirmed against the token-walk prototype).

| doc.test.ts | argv shape | Invariant the migrated parser MUST keep |
|---|---|---|
| **334** | `["update","concepts/a","--title","New Title","--dir",dir]` | `--field value`; `"New Title"` is ONE argv element → `values.title="New Title"`, `positionals=[id]` (a space INSIDE argv is fine; only an unquoted `--title New Title` as TWO elements would split, which no test does) |
| **373** | `["update","concepts/a","--tag","z","--dir",dir]` | `--tag` REPLACES the whole set → `tags=["z"]` (from `values.tag`) |
| **388** | `["update","concepts/a","--body","New body.","--dir",dir]` | `--body` value flag; `values.body="New body."` |
| **404** | `--dir dir --json` + `readStdin→"Piped patch body."` | no `--body`/`--body-file` → stdin body wins (parser leaves `p.body===undefined`, `p.bodyFile===undefined`) |
| **426** | `--dir dir --json` + `readStdin→""` | empty stdin ≠ patch field; NO other field → `anyFieldGiven=false` → USAGE (exit 2) |
| **445/477** | `--title T2` / `--title New --keep-timestamp` | idempotency + `--keep-timestamp` boolean; `values["keep-timestamp"]===true` |
| **494** | `["update","concepts/nope","--title","X","--dir",dir,"--json"]` | parser accepts; absent doc → NOT_FOUND (exit 6), parser-independent |
| **511** | `--dir dir --json` (no field) AND `--keep-timestamp --dir dir --json` | both → USAGE (exit 2): control flags alone are not a patch |
| **538/560** | `--type "Context Note" [--strict]` | `--type` value flag drives result-type validation (warn-by-default / `--strict` reject) |
| **589/611** | `["update","tasks/x","--status","done", …]` | dynamic kind field `--status done` → `kindFields={status:[done]}`, LATE-validated; works over `--dir` AND `--remote` |
| **649** | `--status blocked --priority low` | TWO kind fields → `{status:[blocked], priority:[low]}` |
| **669** | `--title "New title" --status done` | standard + kind field together; strict-by-kind-field still writes when valid |
| **688** | repeated `--status done` | no-op kind-field patch → `changed:false`, no timestamp bump |
| **712** | `--status frobnicate --json` | out-of-enum kind-field value → STRICT-by-default reject (exit 2): `/does not satisfy the 'Task' kind/` + `/frobnicate/` (LATE, inside mutate validate) |
| **739** | `--sttatus done --json` | unknown/typo kind field → USAGE (exit 2): `/unknown field\(s\) for kind 'Task'/` + `/sttatus/` + `/status/` (LATE, `buildCandidate`) → requires `"sttatus"` collected as a `kindFields` KEY with value `["done"]` |
| **767** | `--status done` on ungoverned `Concept` | USAGE (exit 2): `/no kind governs type 'Concept'/` (LATE, `buildCandidate`) |
| **793** | `--description X` on a kind-violating doc | STANDARD-only patch stays warn-by-default (kind-field strictness NOT triggered) — parser must leave `kindFields.size===0` |
| **813** | `["update","concepts/a","--body","","--dir",dir]` | `--body ""` explicit-empty → `values.body===""` (present) → body blanked, `changed:true` |
| **838** | N concurrent `--title <w> --remote` | CAS retry unaffected (parser-independent) |
| **866/881** | `--status done --expected-version <v>` / stale `<v1>` | `--expected-version` value flag threads the CAS token; happy → write, stale → STALE_HEAD (exit 5) |
| **909** | `--status done --expected-version "" --json` | present-but-blank `--expected-version` → `values["expected-version"]===""` → USAGE (exit 2) `/empty value/` |
| **931** | `--status done --actor "" --json` | present-but-blank `--actor` → `values.actor===""` → USAGE (exit 2) `/empty value/` |
| **962/974** | `--status todo --keep-timestamp --expected-version <v>` | no-op-shaped CAS patch; premise checked before idempotency |
| **1001/1025/1037** | `--status done --actor alice` (`--dir` / `--remote` / MemoryBackend) | `--actor` value flag threads through; parser passes `values.actor="alice"` |

Prototype verification (ran the exact walk against T589/649/669/712/739/767/354/373/388/813/484/909/931/871/`=`-form/repeated/511/526/`--json=x`/`>1`-pos/glued/`--title`-at-end/help): **all match**. Every kind-field case
produces the correct `kindFields` map; every standard case reads clean off `values`; `>1`-positional and
"no-field" both fall through to their existing `docUpdate` guards unchanged.

**No test asserts a flag appearing BEFORE the `<id>` positional** (every case is `<id>` first, then flags),
so the migration introduces no ordering hazard.

---

## 2. Fork 1 — HOW to parse the hybrid grammar on parseArgs (RESOLVED)

**Decision: single-phase `parseArgs({ tokens: true, strict: false, allowPositionals: true, options: <all
standard flags> })` + a TOKEN WALK that buckets each token, keeping the LATE kind-field validation exactly
as-is.** This is the brief's leading candidate, and it is the ONLY sound option given the kind-at-mutate-time
constraint (a strict, kind-aware config à la `new` is impossible here — the kind isn't known until mutate time,
and pre-reading it would be an extra read AND unsound under concurrency).

### 2.1 Why not the other candidates
- **Strict kind-aware config (the `new` shape):** rejected — needs the kind at parse time; see the crux. Also
  would push required/enum enforcement into the parser, whereas `doc update`'s tests assert LATE (mutate-time)
  validation messages (`does not satisfy the 'Task' kind`, `no kind governs type 'Concept'`).
- **`strict: false` WITHOUT tokens (read `values`/`positionals`):** rejected — an unknown option's value LEAKS
  into `positionals` (`--status done` → `positionals=["id","done"]`), which would wrongly trip the
  `>1`-positional guard, and `values` records the unknown as `true`, LOSING its value. Proven above.

### 2.2 The exact `parseArgs` call
```ts
const { values, tokens } = parseOrUsage(
  () =>
    parseArgs({
      args: argv,
      tokens: true,
      strict: false,          // dynamic kind fields are unconfigured — strict:true would reject them
      allowPositionals: true,
      options: {
        title: { type: "string" },
        description: { type: "string" },
        type: { type: "string" },
        body: { type: "string" },
        "body-file": { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        "expected-version": { type: "string" },
        actor: { type: "string" },
        tag: { type: "string", multiple: true },
        "keep-timestamp": { type: "boolean" },
        strict: { type: "boolean" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
    }),
  "doc update",
);
```
`parseOrUsage` wraps it for defense + house-consistency; under `strict:false` `parseArgs` won't itself throw
`ERR_PARSE_ARGS_*`, so in practice every USAGE comes from the walk's own `CliError`s (which `parseOrUsage`
passes through unchanged, args.ts line 63).

### 2.3 The token walk (SOUND value reconstruction; verified)
Standard flags are read straight off the STATICALLY-TYPED `values` (no casts — unlike `new`, whose config is
runtime-built). The walk exists ONLY to (a) reject a boolean given a value, (b) separate REAL positionals from an
unknown option's leaked value, and (c) collect dynamic `kindFields`.
```ts
const positionals: string[] = [];
const kindFields = new Map<string, string[]>();
const consumed = new Set<number>();   // argv indices consumed as an unknown option's value

for (let t = 0; t < tokens.length; t++) {
  const tok = tokens[t]!;
  if (tok.kind === "option-terminator") continue;               // bare `--`: trailing args already positional
  if (tok.kind === "positional") {
    if (consumed.has(tok.index)) continue;                      // was an unknown option's value
    positionals.push(tok.value);
    continue;
  }
  // tok.kind === "option"
  const name = tok.name;
  if (name === "help") continue;                                // -h/--help → read from values.help
  if (DOC_UPDATE_BOOLEAN_FLAGS.has(name)) {
    if (tok.value !== undefined)                                // strict:false won't reject; do it here
      throw new CliError("USAGE", `--${name} does not take a value (got --${name}=${tok.value})`, {
        help: `${cliInvocation()} doc update --help`,
      });
    continue;                                                   // value read from values.<name>
  }
  if (DOC_UPDATE_VALUE_FLAGS.has(name) || name === "tag") continue; // parseArgs already associated it → values

  // UNKNOWN option → a dynamic kind-field candidate (validated LATE in buildCandidate).
  let value: string | undefined;
  if (tok.value !== undefined) {
    value = tok.value;                                          // --status=done (=form)
  } else {
    const next = tokens[t + 1];
    if (next && next.kind === "positional" && next.index === tok.index + 1) {
      value = next.value;                                       // --status done (adjacent positional)
      consumed.add(next.index);
    }
  }
  if (value === undefined)                                      // no value available (glued token, or field at end)
    throw new CliError("USAGE", `--${name} requires a value`, {
      help: `${cliInvocation()} doc update --help`,
    });
  const arr = kindFields.get(name) ?? [];
  arr.push(value);
  kindFields.set(name, arr);
}
```
Then assemble and return the SAME `ParsedDocUpdateArgs` shape:
```ts
return {
  help: Boolean(values.help),
  json: Boolean(values.json),
  dir: values.dir,
  remote: values.remote,
  keepTimestamp: Boolean(values["keep-timestamp"]),
  strict: Boolean(values.strict),
  title: values.title,
  description: values.description,
  tags: values.tag,                    // string[] | undefined (multiple:true)
  type: values.type,
  body: values.body,                   // "" preserved vs undefined — the F1 distinction
  bodyFile: values["body-file"],
  expectedVersion: values["expected-version"],
  actor: values.actor,
  positionals,
  kindFields,
};
```

### 2.4 Confirmation against the tokenizer (the brief's explicit ask)
- **Unknown value-flag `--status done`** tokenizes as `option{name:status, NO value}` + `positional{value:done,
  index=optIdx+1}`. The walk associates `done` via the adjacent-positional rule → `kindFields={status:[done]}`,
  `positionals=[id]`. (Proven; not the naive-`argv[i+1]` trap, which would double-count a following configured
  flag.)
- **`--status=done`** → `option{value:"done", inlineValue:true}` → `value=tok.value`, no positional consumed.
- **Repeated `--label a --label b`** → two adjacent-positional associations → `kindFields={label:[a,b]}`
  (dynamic repeatable preserved without a `multiple` config, since kind fields are unconfigured).
- **Shell-glued `--status todo`** → `option{name:"status todo", NO value}`; at end → `requires a value` NAMING
  the token; before a flag → the next token is an option (not an adjacent positional) → also `requires a value`
  NAMING the token. Both are token-NAMING parseArgs-style errors — strictly better than today's raw-`argv[i+1]`
  path, which fed `"--title"` into a kindField and then tripped a MISDIRECTING `>1`-positional error. Matches the
  spirit of `new`'s glued-token fix. **Untested; a pure improvement; noted in §5.**

---

## 3. Fork 2 — shared helper vs separate (RESOLVED: SEPARATE; do NOT touch `new`)

**Decision: keep `doc update`'s parser LOCAL in `update.ts`; leave `new.ts` byte-for-byte untouched. No shared
hybrid-parse helper is extracted.**

Rationale (honoring the HARD RULE "do NOT downgrade `new`'s superior kind-aware two-phase parse", default: leave
`new` alone):
- The two commands resolve "dynamic kind fields" by **opposite** mechanisms with **near-zero mechanical overlap**:
  - `new`: Kind known at parse time → **two-phase, `strict:true`, kind-derived options config**; unknown field is
    a PARSE-time `ERR_PARSE_ARGS_UNKNOWN_OPTION` (best possible error, because the declared set is known).
  - `doc update`: type known only at MUTATE time → **single-phase, `strict:false`, `tokens`+walk**; unknown field
    is a LATE `buildCandidate` rejection (the only sound option under concurrency).
- A shared helper would have to abstract over "strict config vs lenient tokens-walk" and "parse-time vs
  mutate-time validation" — a leaky, parameter-heavy seam that simplifies NEITHER call site and would tempt a
  regression of `new`'s strict path down to a generic tokens-walk (explicitly forbidden). The genuine shared
  helper ALREADY EXISTS and is REUSED by both: `parseOrUsage` (args.ts). No new file, no `new.ts` edit,
  args.ts unchanged.

---

## 4. Per-file edits (exact)

### 4.1 `packages/cli/src/commands/doc/update.ts` — the only product change
1. **Imports (lines 3–10):** add `import { parseArgs } from "node:util";` and
   `import { parseOrUsage } from "../../args.js";`. Keep every existing import.
2. **KEEP unchanged:** `DOC_UPDATE_FIELD_FLAGS` (13), `DOC_UPDATE_VALUE_FLAGS` (16–26), `DOC_UPDATE_BOOLEAN_FLAGS`
   (28), the `ParsedDocUpdateArgs` interface (30–51), and ALL of `docUpdate` (178–358). The return shape is
   identical, so `docUpdate`'s body needs no edit.
3. **REWRITE the JSDoc header (53–64)** — see §6 (stale-comment fix).
4. **REWRITE `parseDocUpdateArgs` body (65–176)** to the §2.2 `parseArgs` call + §2.3 token walk + return
   assembly. Net: the character-level scanner (`startsWith("--")`, `slice(2)`, `indexOf("=")`, manual `=`
   splitting, `takeValue`, the bespoke `--`/`--=` rejects) is DELETED; `parseArgs` owns tokenization.

### 4.2 `packages/cli/test/doc.test.ts` — ADD improved-error coverage (migrate NOTHING)
Every existing `doc update` assertion (§1) passes UNCHANGED — do not edit them. ADD, using the existing
`runDoc`/`doc`/`makeTaskBundle` helpers:
- **`doc update: a shell-glued kind-field token names the token, not a positional-count error`** — over a Task
  bundle with a seeded `tasks/x`, run `["update","tasks/x","--status todo","--dir",dir,"--json"]` (space-glued
  `--status todo` as ONE argv element). Assert `err.code === "USAGE"`, `err.exitCode === 2`,
  `assert.match(err.message, /status todo/)` AND `assert.doesNotMatch(err.message, /positionals/)`. Justification:
  locks the exact misdirection this migration removes (parity with `kinds.test.ts`'s `new` glued-token test at
  353); NEW coverage, not a migrated assertion.
- **(optional) `doc update: a repeated kind-declared --<field> becomes an array`** — construct a purpose-built
  kind declaring an optional repeatable field, then `--label a --label b`; read back and assert the field
  deep-equals `["a","b"]`. Justification: explicit lock on the dynamic-repeatable behavior the adjacent-positional
  walk preserves (the standard `--status done`/`--priority low` tests already cover single-value dynamic fields;
  the multi-kind-field test at 649 covers two DISTINCT fields, not a repeated one).

### 4.3 `packages/cli/test/doc.test.ts` line 813 — cosmetic name touch-up (NOT a behavior change)
Its test NAME says "…still works as a body source alongside the **hand-rolled parser**". The assertion is
unchanged and must stay. Reword the trailing clause to "…alongside the parseArgs token-walk" so the suite carries
no stale reference to the retired implementation. Optional-but-recommended; assertion body untouched.

---

## 5. Behavior deltas this migration introduces (all UNTESTED, all acceptable / improvements)
- **Shell-glued flag token** (`--status todo` as one argv element) → now a token-NAMING `requires a value` /
  late `unknown field(s) … status todo` USAGE error instead of a misdirecting `>1`-positional error. The point.
- **Bare `--`** → the standard `parseArgs` option-terminator (trailing args become positionals, tripping the
  existing `>1`-positional guard if any) instead of the bespoke `'--' is not a valid flag`. Standard-clean.
- **`--=…`** → a standard `parseArgs` unknown-option name (`=foo`) routed through the kind-field/`requires a
  value` path instead of the bespoke `'--=…' is not a valid flag`. Standard-clean.
- **Boolean given `=value`** (`--json=x`) → still `--json does not take a value (got --json=x)` (manually
  re-created from the token; message unchanged).

Exit-code taxonomy (0/1/2/4/5/6) is UNCHANGED — every parser rejection is `CliError("USAGE", …)` → exit 2, same
as today. No test asserts any of the three deltas above; no assertion is migrated.

---

## 6. Stale-comment fix (mandatory)
The `parseDocUpdateArgs` JSDoc (lines **53–64**) references the DELETED `` `new.ts::parseNewArgs` `` and falsely
claims `parseArgs({strict:false})` "cannot cleanly do this". Replace the whole block with an accurate header, e.g.:

> Parse `doc update`'s HYBRID grammar via `node:util` `parseArgs` (retiring the last hand-rolled command
> tokenizer). Standard flags are declared in the `parseArgs` options and read straight off `values`
> (`--tag`'s repeatable "replace-the-whole-set" array and `--body`'s "even `''` counts as explicit" distinction
> come for free). Because a doc's kind fields aren't known until the doc's `type` is read at MUTATE time (and may
> be `--type`-overridden), they CANNOT be configured up front — so the parse runs `strict:false, tokens:true` and
> a token walk buckets each option: a KNOWN value/boolean flag is handled with its typed semantics; any OTHER
> `--<field>`/`--<field>=<value>` is captured as a dynamic kind-field candidate (its value taken from the
> adjacent leaked-positional token that `strict:false` produces) and validated LATE in `buildCandidate` (unknown
> field / ungoverned type → USAGE, exit 2 — the taxonomy is unchanged; only some malformed-flag messages improve).
> `parseArgs` owns all character-level tokenization (`--x=y`, quoting, `--`, short `-h`, and NAMING a shell-glued
> token). Unlike `new` — whose Kind positional is known before parsing, licensing a strict kind-aware config —
> pre-reading this doc's type for a strict config would be an extra read AND unsound under concurrency.

No reference to any deleted symbol.

---

## 7. Confirmed NO-CHANGE files
- **`packages/cli/src/commands/new.ts`** — Fork 2: left byte-for-byte untouched. Its two-phase strict kind-aware
  parse is superior for its known-at-parse Kind and must NOT be downgraded; no shared extraction is taken.
- **`packages/cli/src/args.ts`** — `parseOrUsage`'s CliError-passthrough (63) is exactly the reused seam; no new
  export.
- **`packages/cli/src/commands/doc/common.ts`** — `DOC_USAGE`/`DocCliDeps`/`defaultReadStdin` unchanged (no flag
  added, no wording changed).
- **`packages/cli/src/commands/doc/update.ts` `docUpdate` (178–358)** — consumes the identical
  `ParsedDocUpdateArgs`; body unchanged.
- **`packages/cli/src/mutate.ts`, `packages/core/**` (incl. `kinds.ts`), `packages/server/**`,
  `packages/worker/**`, `packages/viewer/**`** — out of scope; the kind-field late-validation path is unchanged.
- **`packages/cli/src/reference.ts` + both generated `SKILL.md` + the bundle** — help text and command reference
  are UNCHANGED, so NO regeneration and the drift gates stay green (see §8).

---

## 8. Build / verify / gate steps (each must exit 0)
1. `npm run build` — bundles the CLI to `packages/cli/dist/agentstate-lite.mjs` (esbuild).
2. `npm run typecheck` — the STATIC options literal types `values` cleanly (no casts); narrow `tokens` by
   `tok.kind` before accessing `name`/`value`/`index`.
3. `npm test --workspaces --if-present` — core + cli + viewer. `doc.test.ts` (incl. every §1 row) and
   `kinds.test.ts` must pass; the two additions (§4.2) are green.
4. `npm run check` — build + typecheck + all suites + SKILL/bundle DRIFT gates. Because §7 changes NO help text or
   `reference.ts`, the drift gates (`check:skill`, `check:skill:bundle`, `check:bundle`) must PASS with NO
   regeneration. If any drift gate trips, an unintended help/reference change slipped in — investigate, do not
   regenerate to paper over it.
5. **AXI pre-ship (gate 1):** load the `axi` skill; re-check `doc update` — USAGE on stdout as structured TOON,
   capped exit taxonomy (USAGE=2), idempotency and the `changed:false` no-op unaffected, help still prints
   `DOC_USAGE`. The parser swap keeps all ten AXI principles.
6. **Smoke-test the BUILT dist** (`node packages/cli/dist/agentstate-lite.mjs …`) in a scratch bundle declaring a
   `Task` kind (`init`, then a `conventions/task.md` `Convention`: `governs: Task`, required `[title,status]`,
   `values.status: [todo,doing,done]`, optional `[priority,tag]`), seeding `tasks/x` via `new`/`doc write`:
   - `doc update tasks/x --status doing` → updated (`type: Task`, `status: doing`).
   - `doc update tasks/x --status bad` → USAGE exit 2 (enum reject, LATE).
   - `doc update tasks/x --status doing --priority high` → updated, `priority: high`.
   - `doc update tasks/x --status=doing --title=T2` → updated (`=` form).
   - `doc update tasks/x --sttatus done` → USAGE exit 2 naming `sttatus`, listing declared fields.
   - `doc update tasks/x --title New Title` (`"New Title"` one arg) → updated, `title: New Title`.
   - `doc update tasks/x` (no field) → USAGE exit 2 ("at least one field to patch").
   - `doc update tasks/x "--status doing" --title T` (space-glued) → USAGE naming the token, NOT a
     positional-count error.
   - `doc update tasks/x --status doing --expected-version ""` → USAGE exit 2 (`/empty value/`).
   - `agentstate-lite view examples/sample-bundle` → writes `viz.html`, prints its path, **4 nodes / 7 edges**.
7. **Publishability (per CLAUDE.md):** `npm pack -w agentstate-lite`; run the tarball bin in a temp dir outside
   the monorepo — `node_modules` must contain ONLY `agentstate-lite`.

---

## 9. Commit
One reviewed unit: retire `parseDocUpdateArgs` onto `parseArgs` + fix the stale `parseNewArgs` header reference +
the two improved-error tests. CLI-only; no help/reference/SKILL change. Local only — no PR until the human asks.
End the commit body with the `Co-Authored-By` / `Claude-Session` trailers from CLAUDE.md's git conventions.
