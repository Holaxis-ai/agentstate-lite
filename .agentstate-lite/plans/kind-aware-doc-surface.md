---
type: Plan
title: BINDING plan — Kind-aware `doc` surface
timestamp: '2026-07-06T16:48:20.378Z'
---
# BINDING plan — Kind-aware `doc` surface

Make the CLI's `doc` surface kind-aware in two facets that dogfooding proved are the load-bearing
blocker for a usable task recipe:

- **FACET 1 (READ)** — `doc read <id>` (no `--out`) shows a doc's kind-declared frontmatter fields
  (e.g. `status`, `priority`, `assignee`) instead of dropping every key outside a hardcoded allowlist.
- **FACET 2 (MUTATE)** — `doc update <id> --<field> <value>` can PATCH a kind-declared field (e.g.
  `--status done`), so there is finally a CLI path to transition a task's status.

One commit, additive, `npm run check` stays green. Below, every claim is grounded in the code read on
2026-07-02; line numbers verified against the current tree.

---

## Design forks — resolved

### Fork 1 (MUTATE grammar): EXTEND `doc update` with a hybrid parser. NO new verb.

**Decision.** Keep ONE verb (`doc update`) and replace its static `parseArgs` spec (doc.ts
`docUpdate`, lines 375–396) with a hand-rolled parser that (a) recognizes the KNOWN standard flags
with their exact current semantics, and (b) captures every OTHER `--<field>` / `--<field>=<value>`
token as a kind-field candidate — the SAME dynamic-flag grammar `new` already proves
(`new.ts::parseNewArgs`, lines 81–142, incl. `--field=value` support).

**Why extend, not add `doc set`.** `docUpdate` ALREADY does everything a mutate verb needs that a new
verb would have to duplicate: it loads the registry ONCE (`loadKinds`, line 443), and it drives the
canonical versioned-read → build-candidate → validate → CAS-write-with-bounded-retry loop through the
ONE `mutateDoc` pipeline in patch mode (lines 449–484), including idempotency and the `changed:false`
contract. A separate `doc set` would fork all of that or wrap it — a second patch code path for the
exact same operation, against the project's "one mutation pipeline" ethos (mutate.ts header). The
only thing blocking dynamic fields is the parser, so the surgical fix is the parser.

**Why the parser goes fully hand-rolled (not `parseArgs` with `strict:false`).** `node:util`
`parseArgs({strict:false})` does NOT cleanly capture an unknown `--status done`: an unconfigured
option is treated as a boolean, so `done` falls out as a stray positional — it would silently split
`--status done` into `--status`(=true) + positional `done`. A hand-rolled scan (like `new`'s) is the
only clean way to bind `--<unknown> <value>`.

**Typo / unknown-flag behavior (made explicit).** With the hand-rolled parser:
- A typo of a STANDARD flag (`--titel Foo`) is captured as a kind-field candidate `titel`, then
  rejected by the unknown-field check (below) as a structured `CliError("USAGE", …)`, exit 2 — the
  SAME taxonomy the old static `parseArgs` produced via `parseOrUsage` (ERR_PARSE_ARGS_UNKNOWN_OPTION
  → USAGE/exit 2). The wording changes (from "Unknown option '--titel'" to "unknown field(s) for
  kind …" / "no kind governs type …"), never the exit code, and never a raw `parseArgs` leak. To
  keep typo guidance strong, the unknown-field error message lists BOTH the standard patch flags AND
  the kind's declared fields (see Facet 2 edits).
- A dynamic `--<field>` is accepted ONLY when a kind governs the doc's RESULT type AND declares that
  field. On an ungoverned type (or conventions-free bundle) any dynamic field is a USAGE error. This
  matches `new`'s strictness and the whole CLI surface: no command has ever let a flag write an
  arbitrary, undeclared frontmatter key (`doc write` accepts only type/title/description/resource/
  tags/timestamp). Kind fields remain the ONLY dynamic-field mechanism.

**No change to `new.ts`.** We reuse its PATTERN, not its code. Extracting a shared dynamic-flag
scanner is tempting but would touch `new`'s proven, live-verified path and enlarge the commit; the
two arg shapes differ enough (doc update has a large static standard-flag set; `new` has two
positionals + a kind name) that a local scanner is lower-risk. Noted as a future refactor, explicitly
out of scope here.

### Fork 2 (MUTATE validation): kind-field patches are STRICT-by-default. Standard-only patches stay warn-by-default.

**Decision.** Compute `strict = Boolean(values.strict) || kindFieldsPresent` and pass it as
`mutateDoc`'s existing `strict` option. When the patch touches ANY dynamic kind field, the result is
validated strictly (a non-empty warning set — incl. an out-of-enum `--status frobnicate` —
throws USAGE/exit 2 and does NOT write). A patch touching ONLY standard fields keeps today's
warn-by-default behavior (`--strict` still opts in). This is a ONE-LINE change to the value already
passed into `mutateDoc`; it does NOT fork validation — `mutateDoc` → `defaultTimestampAndValidateKind`
→ `validateAgainstKind` remains the ONE validation locus (kind-write.ts / kinds.ts), which already
enforces enum membership via `fields.values` (kinds.ts lines 380–395).

**Why (a) over a surgical enum-only pre-check (rejected alt (b)).** A surgical variant would validate
ONLY the patched enum field and leave other kind violations warn-by-default. It is more faithful to
the literal words "strict for enum membership" but it requires a SECOND `validateAgainstKind` call in
the command layer plus per-field warning filtering — a partial duplication of the validation decision
`mutateDoc` already owns, and more moving parts in a one-commit unit. Decision (a) is simpler, adds no
new validation call, and is consistent with `new` (fully strict): touching a kind's declared fields
means you have opted into kind-aware authoring, so full kind conformance is enforced. The cost —
`--status done` also rejects if the SAME doc has an unrelated pre-existing kind violation — is benign
for the target recipe: tasks are created via `new` (strict), so they are well-formed by construction;
the over-reject only bites hand-edited / `doc write`-created malformed docs, which arguably SHOULD be
fixed before a status transition. The deliberate out-of-enum escape hatch still exists: `doc write`
(warn-by-default) can rewrite the whole doc. No flag opts a kind-field patch DOWN to warn, by design —
a silently-persisted garbage enum value is exactly the class this unit closes.

**Idempotency interaction (verified, no change needed).** In `mutateDoc` patch mode the no-op check
(lines 226–228) returns `changed:false` BEFORE `validate` (line 230). So a no-op `--status done` on
an already-`done` doc converges to `changed:false` with NO write, NO timestamp bump, and (correctly)
NO validation — the value was already on disk. A pre-existing garbage value re-patched to itself is
likewise a no-op; that is the pipeline's documented idempotency-before-validation contract, not a
regression. Documented in the test matrix.

### Fork 3 (READ): show ALL frontmatter keys, stable-ordered. No `--fields` hatch.

**Decision.** `doc read <id>` (no `--out`) emits `id`, then every frontmatter key in a stable order:
the known prefix `type, title, description, resource, tags, timestamp` first (exactly today's order),
then any REMAINING frontmatter keys in the parsed doc's own insertion order (so kind fields like
`status`/`priority` and any custom keys appear deterministically after the standard ones). Body
handling is PRESERVED EXACTLY: the `BODY_PREVIEW_LIMIT` truncation + `body_truncated`/`body_chars` +
the `doc read … --out <file>` byte-channel pointer (doc.ts lines 548–558), and the whole `--out` /
`--out -` path (lines 563–634), are untouched.

**Why full detail, not kind-only or a `--fields` hatch.** `doc read <id>` is a DETAIL view — AXI §3
(a detail/view shows full state, incl. backlink counts inline). The minimal-schema rule (AXI §2) is a
LIST affordance (`list`/`query` default to a 3–4 field row with a `--fields` hatch) and does NOT
govern a single-doc detail view — confirmed reading. Dropping `status`/`priority` from a detail view
is the bug. Showing ALL keys (not just kind-declared ones) also means the render needs NO registry
load on the read path — keeping `doc read` a pure engine read with ZERO kind machinery, honoring "no
engine path loads kinds; the registry is built ONCE in the command layer" (CLAUDE.md gate 3). A
`--fields` projection is a list tool; adding it to a detail view is scope creep and is NOT built here.

**Defensive key collision.** When appending remaining frontmatter keys, skip any key already emitted
(`id`/`type`/`title`/`description`/`resource`/`tags`/`timestamp`) AND any that would clobber the
structural output keys the body branch adds (`body`, `body_truncated`, `body_chars`, `help`). A doc
whose frontmatter literally carries e.g. a `body` key is pathological, but the guard keeps the body
preview authoritative.

---

## Per-file edits

### 1. `packages/cli/src/commands/doc.ts` — FACET 1 (read)

Replace the hardcoded allowlist in `docRead`'s no-`--out` branch (current lines 541–547):

```ts
    const fm = parsed.frontmatter;
    const rec: Record<string, unknown> = { id: parsed.id, type: fm.type };
    if (typeof fm.title === "string") rec.title = fm.title;
    if (typeof fm.description === "string") rec.description = fm.description;
    if (typeof fm.resource === "string") rec.resource = fm.resource;
    if (Array.isArray(fm.tags)) rec.tags = fm.tags;
    if (typeof fm.timestamp === "string") rec.timestamp = fm.timestamp;
```

with a full-frontmatter, stable-ordered projection:

```ts
    const fm = parsed.frontmatter as Record<string, unknown>;
    // AXI §3 detail view: show EVERY frontmatter field (kind-declared ones like `status`/`priority`
    // included), not a hardcoded allowlist. Stable order: `id`, then the known standard keys in
    // canonical order, then any remaining frontmatter keys in the doc's own insertion order. No
    // registry load — a detail render stays a pure engine read (CLAUDE.md gate 3: kinds load ONLY in
    // a command's mutate path, never on a read). Reserved OUTPUT keys are skipped so a pathological
    // frontmatter key can never clobber the body preview the branch below writes.
    const rec: Record<string, unknown> = { id: parsed.id };
    const KNOWN_ORDER = ["type", "title", "description", "resource", "tags", "timestamp"];
    const RESERVED_OUTPUT = new Set(["id", "body", "body_truncated", "body_chars", "help"]);
    for (const key of KNOWN_ORDER) {
      if (fm[key] !== undefined && fm[key] !== null) rec[key] = fm[key];
    }
    for (const key of Object.keys(fm)) {
      if (KNOWN_ORDER.includes(key) || RESERVED_OUTPUT.has(key)) continue;
      if (fm[key] === undefined || fm[key] === null) continue;
      rec[key] = fm[key];
    }
```

The body branch that follows (`const body = parsed.body; if (body.length > BODY_PREVIEW_LIMIT) …`,
current lines 550–558) is unchanged. `type` is guaranteed present by the engine, so `rec.type` is
always set. Note `rec` no longer force-includes `type` when absent — it can never be absent, so this
is behavior-identical for all valid docs.

### 2. `packages/cli/src/commands/doc.ts` — FACET 2 (mutate)

**2a. New hand-rolled parser** — add a `parseDocUpdateArgs(argv)` helper (near `DOC_UPDATE_FIELD_FLAGS`,
line 369), mirroring `new.ts::parseNewArgs`. It recognizes:

- **value flags** (consume next token OR `=value`): `title`, `description`, `type`, `body`,
  `body-file`, `dir`, `remote`. `tag` is a value flag but REPEATABLE (array).
- **boolean flags** (no value): `keep-timestamp`, `strict`, `json`, `help` (+ short `-h`). A `=value`
  on a boolean is a USAGE error.
- **dynamic**: any other `--<field>` / `--<field>=<value>` → a `Map<string, string[]>`
  `kindFields` (repeatable → array), exactly as `parseNewArgs` collects `fields`.
- **positionals**: collected; exactly one (`<id>`) expected — >1 is a USAGE error mirroring
  `new.ts` lines 168–174 ("almost always a mistyped flag").

Returns a typed struct `{ help, json, dir?, remote?, keepTimestamp, strict, title?, description?,
tags?, type?, body?, bodyFile?, positionals, kindFields }`. Track `body` presence as `string |
undefined` so `--body ""` (explicit empty) is distinguishable from "not given" (matches today's
`values.body !== undefined`). Wrap nothing in `parseOrUsage` (it is not a `parseArgs` thunk); throw
`CliError("USAGE", …, { help: \`${cliInvocation()} doc update --help\` })` directly on malformed
tokens (mirrors `parseNewArgs`).

**2b. Rewrite `docUpdate`'s body** (lines 371–496) to consume the new parser:

- Replace the `parseArgs`/`parseOrUsage` block (375–396) with `const p = parseDocUpdateArgs(argv);`
  and `if (p.help) { stdout(DOC_USAGE); return; }`.
- `id` from `p.positionals[0]` (same USAGE guard, lines 402–407).
- Stdin body read ONCE before the loop (lines 409–417), gated on `p.body === undefined && !p.bodyFile`
  — unchanged logic, new field names.
- **`anyFieldGiven`** (lines 422–436): ADD `|| p.kindFields.size > 0` to the disjunction. Update the
  "nothing to patch" message to mention kind fields:
  `doc update requires at least one field to patch (--title/--description/--tag/--type/--body/--body-file
  or a kind-declared --<field>, e.g. --status)`.
- `loadKinds` (line 443) unchanged — the registry is already loaded here ONCE.
- **strict** (Fork 2): `const strict = p.strict || p.kindFields.size > 0;` and pass `strict` (instead
  of `Boolean(values.strict)`) into `mutateDoc` (line 456).
- **`buildCandidate`** (lines 458–477): starts from `{ ...existing.frontmatter }`; apply standard
  flags via `p.title`/`p.description`/`p.tags`/`p.type` (same shape as today). Then, when
  `p.kindFields.size > 0`, resolve the governing kind and validate the DYNAMIC field NAMES (values are
  validated downstream by `mutateDoc`'s strict `validateAgainstKind`):

  ```ts
  if (p.kindFields.size > 0) {
    const resultType = (p.type !== undefined ? p.type.trim() : String(existing.frontmatter.type));
    const kind = registry.kinds.get(resultType);
    if (!kind) {
      throw new CliError(
        "USAGE",
        `no kind governs type '${resultType}', so kind field(s) ${[...p.kindFields.keys()].map((f) => `--${f}`).join(", ")} `
          + `cannot be patched here — only the standard fields (--title/--description/--tag/--type/--body/--body-file) `
          + `are patchable on an ungoverned doc.`,
        { help: `${cliInvocation()} kinds` },
      );
    }
    const declared = [...kind.fields.required, ...kind.fields.optional];
    const unknown = [...p.kindFields.keys()].filter((f) => !declared.includes(f));
    if (unknown.length > 0) {
      throw new CliError(
        "USAGE",
        `unknown field(s) for kind '${kind.governs}': ${unknown.join(", ")} `
          + `(declared: ${declared.length > 0 ? declared.join(", ") : "none"}; standard patch flags: `
          + `title, description, tag, type, body, body-file)`,
        { help: `${cliInvocation()} kinds` },
      );
    }
    for (const [field, vals] of p.kindFields) {
      nextFrontmatter[field] = vals.length === 1 ? vals[0] : vals;
    }
  }
  ```

  The throw inside `buildCandidate` is sanctioned — `mutateDoc`'s contract (mutate.ts lines 84–88)
  states a `CliError` thrown by `buildCandidate` propagates out unchanged, and in `onAbsent:"fail"`
  patch mode `existing` is guaranteed defined (NOT_FOUND is thrown before `buildCandidate` runs). The
  timestamp/body handling (lines 469–474) is unchanged and runs before the kind-field block returns
  the candidate; ordering between them is irrelevant (disjoint keys). Set the dynamic fields AFTER
  the standard-flag assignments so a kind field never shadows a standard one (they are disjoint field
  names anyway — `title`/`description` are standard flags, `status`/`priority`/`assignee` dynamic).
- Receipt (lines 486–495) unchanged.

**2c. `DOC_UPDATE_FIELD_FLAGS`** (line 369) stays as the standard-flag list for the "nothing to patch"
message; no change to the constant itself.

### 3. `packages/cli/src/commands/doc.ts` — DOC_USAGE text (lines 67–150)

- In the `doc update options` block (lines 101–119): REMOVE the now-false caveat (lines 116–118,
  "arbitrary kind-declared fields are not yet patchable here …"). ADD a kind-field entry:

  ```
    --<field> <value>     Set a kind-declared field of the doc's type (e.g. --status done). The field
                          MUST be declared by the kind governing the doc's type — run 'agentstate-lite
                          kinds' to see them. An unknown field, or (STRICT for kind fields, even
                          without --strict) an out-of-enum value, is rejected (exit 2, no write). Use
                          'doc write' to rewrite the whole doc if you must set a not-yet-declared value.
  ```

  Keep the `--tag` "can't CLEAR to empty" caveat (still true).
- In the `doc read options` block (lines 121–131): append one line to the default-render description:
  `The default (no --out) render shows EVERY frontmatter field — the standard keys plus any
  kind-declared fields like status/priority — and truncates a large body (pointing at --out).`

### 4. `packages/cli/src/reference.ts` — command reference (single source of truth)

Update the `doc update` entry (lines 68–71):

```ts
      {
        usage:
          "doc update <id> [--<field> <value> ...] [--title <t>] [--tag <t>] [--type <t>] [--body <s> | --body-file <p>] [--remote <url>]",
        summary: "Patch given fields (incl. kind-declared fields like --status) of an existing doc, preserving the rest",
      },
```

This is the ONLY hand-edit needed for help/home/SKILL — every consumer derives from `COMMAND_GROUPS`.

### 5. `packages/cli/scripts/gen-skill.mjs` — Notes section (optional but recommended)

In `renderNotesSection()` (lines 105–120) add one bullet after the idempotency line:

```js
  lines.push(
    "- `new` and `doc update` accept a kind's declared fields as `--<field> <value>` (e.g. `--status done`);",
  );
  lines.push("  an unknown field or an out-of-enum value is rejected (exit 2). Run `kinds` to see a kind's fields.");
```

This bullet is IDENTICAL in both targets (shared helper), so both SKILL.md files stay in lockstep.

### 6. `STATUS.md` — changelog row

Add one usability-round changelog item recording: `doc read` now shows all frontmatter fields
(kind-declared included) — closes the "detail view drops status" bug; `doc update --<field>` patches
kind-declared fields with strict-by-default enum enforcement — closes the "no CLI path to mark a task
done" blocker. Reference this plan. Bump the test count in the STATUS rows/summary to match the new
tests. (Read the current tail of STATUS.md first to match its exact row format and current count.)

---

## Confirmed NO-CHANGE files

- `packages/cli/src/mutate.ts` — the pipeline already supports this end to end: patch mode's
  read→build→idempotency→validate→CAS-write loop, the `strict` knob, and the `buildCandidate`-may-throw
  contract are exactly what Facet 2 consumes. No new mode, no new option.
- `packages/core/src/kinds.ts` — `loadKinds` + `validateAgainstKind` already enforce required-field
  presence AND enum membership (`fields.values`, lines 380–395). Nothing to add.
- `packages/cli/src/kind-write.ts` — `defaultTimestampAndValidateKind` is the ONE validation decision;
  reused as-is (strict flag flows through unchanged).
- `packages/cli/src/errors.ts`, `output.ts`, `args.ts`, `invocation.ts` — no new codes, no new render
  path; all thrown errors are `CliError("USAGE", …)` (exit 2) via existing machinery.
- `packages/cli/src/commands/new.ts` — reused as a pattern, not edited (see Fork 1 rationale).
- `packages/cli/SKILL.md`, `skills/agentstate-lite/SKILL.md`, `packages/cli/dist/agentstate-lite.mjs`
  — NOT hand-edited; REGENERATED (see below).

---

## Test matrix — `packages/cli/test/doc.test.ts` (additive)

New fixtures (mirroring `kinds.test.ts`'s enum-convention pattern, lines 283–290): a helper
`makeTaskBundle()` that `initBundle`s a temp dir and `writeDoc`s a `conventions/task` Convention doc
governing `Task` — `path: "tasks/"`, required `[title, status]`, optional `[priority, assignee,
description]`, `values.status: [todo, in_progress, blocked, done, canceled]` — matching the deployed
lite bundle's Task kind. Every body-less `doc` call passes an explicit `readStdin: async () =>
undefined` (test-authoring note, doc.test.ts lines 40–45). For `--remote` variants, boot a
`MemoryBackend` server via the existing `bootServerOverBundle` helper (real enforced CAS) and seed the
convention + a task through the engine before serving.

### FACET 1 — `doc read` shows kind fields

1. **read shows kind fields (`--dir`)**: create a Task via engine `writeDoc` with `status: in_progress`,
   `priority: high`; `doc read tasks/x --json` → record includes `status: "in_progress"` AND
   `priority: "high"` AND the standard `type`/`title`/`timestamp`. (Directly reproduces the reported
   bug.)
2. **stable ordering**: assert `Object.keys(record)` begins `["id", "type", "title", …]` and that
   `status`/`priority` appear AFTER `timestamp` — pins Fork 3's ordering.
3. **body truncation preserved**: a Task with a > `BODY_PREVIEW_LIMIT` body → `body_truncated: true`,
   `body_chars` set, `help` points at `doc read … --out <file>`, AND `status` still present. Proves
   the read change did not disturb the byte-channel pointer.
4. **conventions-free non-regression**: a plain `Concept` doc with only standard fields in a bundle
   with NO conventions → `doc read` output is byte-identical to today (id/type/title/…); no extra
   keys, no registry touched.
5. **`--out` untouched**: existing F3 `--out` tests (lines 535–645) must still pass unchanged (no
   edit) — the read change is confined to the no-`--out` branch.

### FACET 2 — `doc update` patches kind fields

6. **status transition (`--dir`)**: Task at `status: in_progress` → `doc update tasks/x --status done`
   → `changed: true`, exit 0; `readDoc` confirms `status: "done"` AND `title`/`priority` preserved
   (NO silent data loss, F1 class). THE headline recipe.
7. **status transition (`--remote`)**: same over a `MemoryBackend`-backed `serve()` — proves kind
   loading + patch works through the wire (parity with `new`/`doc write` remote paths).
8. **multi kind-field patch**: `--status blocked --priority low` in one call → both persisted, other
   fields intact.
9. **standard + kind field together**: `--title "New" --status done` → both applied; strict mode
   (triggered by the kind field) still writes because the result is valid.
10. **idempotency (P6)**: `doc update tasks/x --status done` twice → second call `changed: false`,
    exit 0, and the on-disk `timestamp` is UNCHANGED between the two writes (assert the file mtime/
    frontmatter timestamp did not bump). Proves kind-field patches ride the ignoring-timestamp no-op.
11. **invalid-enum rejection (STRICT-by-default, Fork 2)**: `doc update tasks/x --status frobnicate`
    (no `--strict`) → `CliError` code `USAGE`, exit 2, message matches `/does not satisfy the 'Task'
    kind/` and `/frobnicate/`; `readDoc` confirms status UNCHANGED (no write).
12. **unknown-field rejection**: `doc update tasks/x --sttatus done` → `USAGE`, exit 2, message matches
    `/unknown field\(s\) for kind 'Task'/` and lists declared fields; no write.
13. **kind field on ungoverned type**: `doc update concepts/plain --status done` where `concepts/plain`
    is a `Concept` with no governing kind → `USAGE`, exit 2, message matches `/no kind governs type
    'Concept'/`; no write. (Locks in "dynamic fields require a governing kind".)
14. **standard-field patch stays warn-by-default (non-regression)**: the EXISTING tests "kind-aware —
    patching a doc's type … warn-by-default" (lines 448–468) and "--strict upgrades …" (lines 470–495)
    must pass UNCHANGED — a standard-only `--type` patch that violates a kind still WARNS (not
    rejects) without `--strict`. Add one explicit assertion: `doc update needs-title --description X`
    (standard-only) on a Task-typed doc missing `status` → `changed: true` with `warnings[]`, exit 0
    (warn-by-default preserved for standard-only patches).
15. **nothing-to-patch still USAGE**: `doc update tasks/x` (no fields) → USAGE exit 2 (existing test
    lines 421–446 stays green; message now also mentions kind fields — update its `assert.match` if it
    pins wording, else leave).
16. **`--body ""` explicit-empty still works**: regression guard that the hand-rolled parser treats
    `--body ""` as an explicit body source (mirrors `parseArgs` `values.body !== undefined`).
17. **CAS retry non-regression**: the existing N-concurrent-update convergence test (lines 507–531)
    must pass UNCHANGED — proves the parser swap did not disturb the retry loop.

### Build-CLI smoke (per CLAUDE.md working gate)

18. Manually (or in `doc-cli-integration.test.ts` if a built-CLI assertion is cheap): on a bundle with
    a Task convention, `node packages/cli/dist/agentstate-lite.mjs doc update tasks/x --status done`
    exits 0 and `doc read tasks/x` shows `status: done` — the exact dogfooding flow that was broken.

---

## Regeneration + verification steps (in order)

1. `npm run build -w agentstate-lite` — re-bundle the CLI to `dist/agentstate-lite.mjs` (esbuild).
2. `npm run gen:skill -w agentstate-lite` — regenerate `packages/cli/SKILL.md` (npm target) from the
   edited `reference.ts` + `gen-skill.mjs`.
3. `npm run gen:skill:bundle -w agentstate-lite` — regenerate `skills/agentstate-lite/SKILL.md`
   (skill target).
4. `npm run check` — the single gate: `build` + `typecheck` + all workspace tests + `check:skill`
   (npm drift) + `check:skill:bundle` (skill drift) + `check:bundle` (committed-bundle byte-compare).
   Must exit 0. If `check:skill`/`check:skill:bundle` fail, step 2/3 was skipped or `reference.ts`/
   `gen-skill.mjs` drifted — re-run them.
5. Smoke the built CLI on `examples/sample-bundle` (init/note/list/link/view unaffected — expect
   4 nodes / 7 edges) AND the Facet-1/Facet-2 flow on a scratch bundle carrying a Task convention
   (test 18).
6. Update `STATUS.md` counts to match the final test total AFTER the suite passes.

## Commit

One commit, message summarizing both facets, the two forks' resolutions, and the regeneration.
Co-authored trailer per CLAUDE.md. Local only — no PR until the human asks.
