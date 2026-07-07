---
type: Plan
title: Tier-1 Generic Kind Capabilities — Binding Implementation Plan
timestamp: '2026-07-06T16:48:31.713Z'
---
# Tier-1 Generic Kind Capabilities — Binding Implementation Plan

Status: proposed (binding once reviewed). Author date: 2026-07-03.
Scope: make a kind's DECLARED frontmatter fields first-class **generically** — no per-kind
code, no bespoke `task`/`note` verb (an anti-goal). Three capabilities, one focused unit,
one commit (default; see "Commit strategy" for the split fallback).

- **A. READ / kind-aware columns** — a *type-scoped* `list`/`query --type X` (where a
  convention governs `X`) projects the kind's key fields as row columns instead of the
  minimal `{id,type,title,timestamp}`.
- **B. READ / generic field-filter** — `list`/`query --field key=value` (repeatable, ANDed)
  filters docs by a frontmatter field value. Any kind, any field.
- **C. WRITE / CAS + actor on `doc update`** — expose `--expected-version` (optimistic
  compare-and-swap, `STALE_HEAD`/exit 5 on conflict, present-but-blank USAGE guard) and
  `--actor` (attribution), mirroring `doc delete`. No new verb.

Tier 2 (runnable/blocked/rollup, dependency traversal, cookbook, a Roadmap kind, richer
filter operators `!=`/`in`/ranges, sorting, provenance) is **out of scope** — deferred per
the deployed designs/recipes "Decisions log".

---

## Ground-truth verification (line numbers confirmed by reading the real code)

- `packages/cli/src/commands/list.ts` (95 lines) — `list`/`query` (query is `list`'s alias
  at the router). Parses `--type/--tag/--prefix/--fields/--dir/--remote/--json` via
  `parseArgs` (lines 38–55); builds a `QueryFilter` (lines 61–64); computes `extraFields`
  from `--fields` minus the default keys (lines 68–71); calls core `query(bundle, filter)`
  (line 74); projects each doc to `{id,type,title,timestamp}` + `extraFields` (lines 76–91);
  renders `{count, docs}` via `render(...)` (line 93). **Does NOT load kinds today.**
- `packages/cli/src/commands/doc.ts` (967 lines) — `docUpdate` (lines 521–675) uses the
  hand-rolled `parseDocUpdateArgs` (lines 414–519) with `DOC_UPDATE_VALUE_FLAGS` (line 379)
  / `DOC_UPDATE_BOOLEAN_FLAGS` (line 381); loads the registry once (line 585); computes
  `strict = p.strict || p.kindFields.size > 0` (line 591); calls `mutateDoc({mode:"patch",
  onAbsent:"fail", ...})` (lines 597–663) with a `staleHead` hook (line 661) that today
  carries **no** `{expected,actual}` details. `docDelete` (lines 826–909) is the mirror
  target: `--expected-version` option (line 834), the **present-but-blank USAGE guard**
  (lines 874–881), `deleteDoc(..., {expectedVersion})` (line 889), and the
  `VersionConflict → STALE_HEAD` map with `details:{expected,actual}` (lines 891–901).
- `packages/cli/src/mutate.ts` (244 lines) — the shared pipeline. Patch mode (lines
  205–242): versioned read → premise (none today) → `buildCandidate` → idempotency
  (`isNoopPatch`, lines 226–228) → `validate` → `writeDoc(bundle, {id,...candidate},
  {expectedVersion: version})` with a **bounded CAS retry** (lines 232–241). **No `actor`
  is passed on any of the three `writeDoc` calls (lines 182, 196, 233).** `MutateDocOptions`
  (lines 71–112) has no `expectedVersion`/`actor` field.
- `packages/core/src/bundle.ts` — `query()` (lines 209–226): `backend.list(prefix)` →
  `backend.readMany(ids)` → **client-side** `type`/`tags` filter in the loop (lines 217–222)
  → sort. This client-side filter runs for EVERY backend (filesystem/memory/remote), so a
  new facet filtered here works over `--remote` for free.
- `packages/core/src/types.ts` — `QueryFilter` (lines 344–351): `type?/tags?/prefix?` only.
  `WriteOptions` (lines 143–159): **already** carries `expectedVersion?` and `actor?` — no
  change needed. `VersionInfo` (lines 133–140): `{version, actor, timestamp}`.
- `packages/core/src/kinds.ts` — `KindConvention` (lines 43–57) with `fields.required` /
  `fields.optional` / `fields.values` (lines 33–41); `validateAgainstKind` enum coercion is
  **`String(v)` per element, arrays mapped element-wise** (lines 397–412) — the coercion the
  `--field` filter mirrors.
- `packages/core/src/backend.ts` — `FilesystemBackend.write` **accepts `options.actor` for
  contract parity but does NOT persist it** (lines 313–317); `versions()` reports actor from
  an `updated_by`/`actor` frontmatter field else a default (lines 356–359). This is the
  **degenerate** adapter (CLAUDE.md gate 3). `MemoryBackend` DOES persist actor into the
  version chain (`memory-backend.ts` lines 129, 168). This asymmetry shapes the actor test
  (below).
- `packages/server/src/router.ts` — `writeOptionsFromHeaders` (lines 149–159) already maps
  `If-Match → expectedVersion` and `X-Actor → actor`; every write route uses it (lines 271,
  402, 450). So `--expected-version` and `--actor` thread over the wire with **zero server
  change**. `handleList` (lines 340–350) reads a `fields`/`type`/`tag` param, but the CLI
  `list` path does not use server-side projection — it goes through core `query()`, which
  filters client-side after `readMany`. No collision, no server change for Fork B.
- `packages/cli/src/reference.ts` — `COMMAND_GROUPS` is the single source of truth for
  `--help`/`home`/both `SKILL.md` files. `doc update` usage (lines 60–63), `doc delete`
  (line 69), `list` (lines 73–74). `scripts/gen-skill.mjs --check` is the drift gate
  (wired into `npm run check` via `check:skill` + `check:skill:bundle`).

---

## Design forks — resolved

### Fork A (columns): activation + field selection

**Activation.** Kind-aware columns activate **only** when ALL hold:
1. `--type X` is given (result is single-kind — the hard TOON constraint: `docs[N]{cols}` is
   a UNIFORM table, so per-row kind-specific columns are only sound when every row shares one
   kind), AND
2. `--fields` is **not** given (`--fields` ALWAYS overrides — an explicit projection wins),
   AND
3. the loaded registry governs `X` (`registry.kinds.get(X)` is defined), AND
4. that kind declares at least one **non-excluded** field (else there is nothing kind-specific
   to show — fall back to the minimal schema rather than emit a thinner `{id,title}` table).

An **unscoped** `list`, or a type-scoped list of an **ungoverned** type, keeps the minimal
`{id,type,title,timestamp}` schema byte-for-byte. `loadKinds` is called **only** when (1)
holds and `--fields` is absent — so an unscoped/`--fields` list (and every conventions-free
bundle) does zero extra registry work.

**Field selection (exact rule).** Columns become:

```
["id", "title", ...kindCols]
  where kindCols = dedupe([...kind.fields.required, ...kind.fields.optional])
                     .filter(f => f !== "id" && f !== "title" && f !== "description")
```

Rationale:
- Derive from **required + optional** (not required-only): dogfooding tasks, `priority`/
  `assignee` are frequently *optional* yet exactly the scannable signal an agent wants; a
  required-only rule would drop them.
- Exclude `description` — the one **standard OKF long-text field** (AXI §3: long text belongs
  in the `doc read` detail view, never a row). This excludes a *standard field name*, not a
  kind name, so it stays generic (no hardcoded kind). Exclude `id`/`title` because they are
  already the leading columns (a kind that redundantly declares them must not duplicate a
  column and break TOON uniformity).
- Drop `type` (redundant — every row is type `X`) and `timestamp` (not a kind field; it is
  recoverable on demand via `--fields timestamp`, and omitting it keeps the kind view tight
  and focused on the kind's own fields). This is a deliberate decision recorded here.
- **No new convention key** (no `columns:`/`card:` hint) — required/optional already carry
  the intent; adding a projection hint is scope creep and a second source of truth.
- **Per-cell safety:** every cell is string-coerced (arrays joined with `,`) and truncated to
  a defensive cap (`COLUMN_CELL_CAP = 80` chars, ellipsis on overflow) so an accidental long
  value in a declared field can never blow the row width — generic protection without a
  per-field long-text guess.

`count` is always emitted (unchanged). Missing optional field on a row → `""` (keeps every
row's key set uniform — required by TOON).

### Fork B (filter): syntax + location + operators

**Syntax:** `--field key=value`, repeatable, **ANDed**. `=` **only** for v1 (`!=`, `in`,
ranges deferred to Tier 2). Split on the **first** `=`; empty key ⇒ USAGE (exit 2); a token
with no `=` ⇒ USAGE. Key is trimmed; value is taken verbatim after the first `=` (shell
handles quoting; not trimmed so a deliberate spaced value survives).

**Location:** a **core `QueryFilter` facet** (`fields?: Record<string,string>`), filtered
inside core `query()`'s existing post-`readMany` loop — NOT a CLI post-filter. Rationale:
- Consistent with the existing `type`/`tags`/`prefix` facets (same loop, same ANDing).
- Works over `--remote` **for free**: core `query()` filters client-side after
  `list()`+`readMany()` for every backend, exactly as `type`/`tags` already do — no
  `RemoteBackend` change, no server change.
- It is a **generic query primitive**, not kind/recipe machinery, so extending core `query`
  is explicitly allowed by gate 3 (it is not the "no recipe/kind in the engine" concern).

**Comparison (coercion):** mirror `validateAgainstKind`'s enum coercion exactly — coerce the
frontmatter value to string(s) with `String(v)` **per element** (scalar → `[String(v)]`,
array → element-wise), then match iff the coerced set **contains** the requested value. So
`--field status=done` matches a scalar `status: done`; `--field priority=1` matches an
unquoted YAML number `priority: 1` (`String(1)==="1"`); `--field tag=urgent` matches
membership in a `tags` array. A field the doc lacks ⇒ empty set ⇒ no match (correctly
excluded).

**Empty state (AXI §5):** a filter that matches nothing yields `{count:0, docs:[]}` at exit
0 — the definitive empty state (not an error, not a silent hang). Preserved by construction
(no special-casing needed; `count` is already emitted).

### Fork C (CAS + actor on `doc update`)

Add `--expected-version <v>` and `--actor <s>` to `doc update`, **mirroring `doc delete`**:
- **`--expected-version` present ⇒ HARD, single-shot CAS** (no bounded retry — a conflict is
  terminal, which is the whole point of an optimistic "claim: update IFF unchanged"). On any
  mismatch, `STALE_HEAD`/exit 5 with `details:{expected,actual}`.
- **`--expected-version` present-but-blank ⇒ USAGE** (exit 2) — the F1-class guard copied
  verbatim from `docDelete` (a blank flag from `--expected-version "$UNSET"` must not silently
  downgrade a claim into an unconditional last-writer-wins patch).
- **`--expected-version` ABSENT ⇒ current behavior unchanged** (bounded CAS retry — a benign
  concurrent writer is retried, not failed).
- **`--actor <s>`** threads to `WriteOptions.actor` (and over the wire via `X-Actor`, already
  wired). Present-but-blank `--actor` ⇒ USAGE (symmetry; do not record an empty actor).
- **Idempotency preserved:** a true no-op patch still returns `changed:false` with no write.
  Ordering: the CAS *premise* check (read version vs `--expected-version`) runs **before**
  the idempotency short-circuit, so a stale claim on an otherwise-unchanged doc still reports
  `STALE_HEAD` (the claim premise — "I am acting on version V" — is false). A matching-version
  no-op returns `changed:false` (no wasted write).
- **Interaction with kind-field patching:** none — `--expected-version`/`--actor` are control
  flags, not patch fields; they do not satisfy the "at least one field to patch" guard and do
  not enter the `kindFields` bucket.

**Honest caveat (recorded, not hidden):** the default `FilesystemBackend` accepts but does
NOT persist `options.actor` (degenerate adapter — `backend.ts` lines 313–317); `serve()` is
filesystem-backed too. So `--actor` is observable in version history only on a persisting
backend (`MemoryBackend` today, `D1R2Backend` later). Over `--dir`/default `--remote` it is a
correctly-threaded no-op on the wire/seam. The test matrix reflects this (a `MemoryBackend`
mutate-level test proves the thread to the seam; the CLI test asserts acceptance).

---

## Per-file edits

### 1. `packages/core/src/types.ts` — add the `fields` facet to `QueryFilter`

In `QueryFilter` (lines 344–351), add:

```ts
/**
 * Restrict to concepts whose frontmatter field equals this value (string-coerced per the
 * same rule as kind enum validation: array fields match on membership). Multiple entries
 * are ANDed with each other and with the other facets.
 */
fields?: Record<string, string>;
```

No change to `WriteOptions` (already has `expectedVersion?`/`actor?`).

### 2. `packages/core/src/bundle.ts` — filter the `fields` facet in `query()`

Inside `query()`'s loop (after the `tags` block, lines 218–221, before `results.push`):

```ts
if (filter.fields) {
  const fm = doc.frontmatter as Record<string, unknown>;
  let ok = true;
  for (const [k, want] of Object.entries(filter.fields)) {
    const raw = fm[k];
    const actual = raw === undefined || raw === null
      ? []
      : (Array.isArray(raw) ? raw : [raw]).map((v) => String(v));
    if (!actual.includes(want)) { ok = false; break; }
  }
  if (!ok) continue;
}
```

Update the `query()` doc-comment (lines 204–208) to note the new `fields` facet is ANDed with
the others. This is the ONE query implementation (no parallel walk — gate 3).

### 3. `packages/cli/src/mutate.ts` — thread `actor`; add hard-CAS `expectedVersion` to patch mode

- **`MutateDocOptions`** (lines 71–112): add two optional fields:
  ```ts
  /** Attribution for the write (WriteOptions.actor). Threaded on every mode's writeDoc call. */
  actor?: string;
  /**
   * "patch" mode only: an EXPLICIT optimistic compare-and-swap token. When set, the patch is a
   * HARD single-shot CAS — the read version must equal this token (else STALE_HEAD) and the
   * write CASes against it with NO bounded retry (a conflict is terminal). When omitted, patch
   * keeps its bounded-retry behavior unchanged.
   */
  expectedVersion?: Version;
  ```
- **create-only** write (line 182): add actor →
  `writeDoc(bundle, {id,...candidate}, { expectedVersion: null, actor: opts.actor })`.
- **overwrite** write (line 196): add actor →
  `writeDoc(bundle, {id,...candidate}, opts.actor ? { actor: opts.actor } : undefined)`.
- **patch loop** (lines 205–242):
  - After the versioned read resolves `version` (after line 222), insert the **CAS premise
    check** (before `buildCandidate`):
    ```ts
    if (opts.expectedVersion !== undefined && version !== opts.expectedVersion) {
      const conflict = new VersionConflict(id, opts.expectedVersion, version);
      throw errors.staleHead ? errors.staleHead(conflict) : new CliError("STALE_HEAD", conflict.message);
    }
    ```
  - In the write (line 233): use the caller's token when present and pass actor →
    ```ts
    const writeVersion = opts.expectedVersion !== undefined ? opts.expectedVersion : version;
    const saved = await writeDoc(bundle, { id, ...candidate }, { expectedVersion: writeVersion, actor: opts.actor });
    ```
  - In the `VersionConflict` catch (lines 236–238): only retry when there is **no** explicit
    token —
    ```ts
    if (err instanceof VersionConflict) {
      if (opts.expectedVersion === undefined && attempt < maxAttempts - 1) continue;
      throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
    }
    ```
  - `VersionConflict` is already imported (line 41). Update the `mutateDoc` header comment
    (patch-mode paragraph, lines 14–20) to record the explicit-`expectedVersion` hard-CAS
    posture. Idempotency (`isNoopPatch`, lines 226–228) is unchanged and still runs after the
    premise check, preserving `changed:false` for a matching-version no-op.

### 4. `packages/cli/src/commands/doc.ts` — `--expected-version` + `--actor` on `doc update`

- **`parseDocUpdateArgs`** (lines 414–519):
  - Add `"expected-version"` and `"actor"` to `DOC_UPDATE_VALUE_FLAGS` (line 379). This keeps
    them OUT of the `kindFields` bucket (they are standard control flags).
  - Add `expectedVersion?: string` and `actor?: string` to `ParsedDocUpdateArgs` (lines
    383–400) and to the returned object (lines 503–518).
  - In the `DOC_UPDATE_VALUE_FLAGS` dispatch (lines 484–494), add
    `else if (name === "expected-version") expectedVersion = value;` and
    `else if (name === "actor") actor = value;` (declare the two `let`s near line 425).
- **`docUpdate`** (lines 521–675):
  - After the `id` guard (line 546), add the **present-but-blank guards** (mirror `docDelete`
    lines 874–881):
    ```ts
    if (p.expectedVersion !== undefined && p.expectedVersion.trim() === "") {
      throw new CliError("USAGE",
        "--expected-version was given an empty value — pass a real version token (from a prior read/write receipt) or omit the flag for a normal (retrying) update.",
        { help: `${cliInvocation()} doc update ${id} --expected-version <v>` });
    }
    if (p.actor !== undefined && p.actor.trim() === "") {
      throw new CliError("USAGE",
        "--actor was given an empty value — pass an actor identity or omit the flag.",
        { help: `${cliInvocation()} doc update ${id} --actor <name>` });
    }
    ```
    (`--expected-version`/`--actor` do NOT count toward `anyFieldGiven`, lines 561–577 — they
    are control flags, unchanged.)
  - In the `mutateDoc(...)` call (lines 597–663), add:
    ```ts
    actor: p.actor?.trim(),
    expectedVersion: p.expectedVersion?.trim(),
    ```
  - Upgrade the `staleHead` hook (line 661) to carry structured details (mirror `docDelete`):
    ```ts
    staleHead: (err) =>
      new CliError("STALE_HEAD",
        `'${id}' has moved since --expected-version ${err.expected} was read (current: ${err.actual ?? "absent"}) — re-read and retry with the current version.`,
        { help: `${cliInvocation()} doc read ${id}`, details: { expected: err.expected, actual: err.actual } }),
    ```
    (This wording is only reachable via the explicit-token path; the bounded-retry path emits
    the same STALE_HEAD only on budget exhaustion, still with details — acceptable.)
- **`DOC_USAGE`** (lines 98–123, the `doc update options` block): document the two new flags:
  ```
  --expected-version <v> Optimistic compare-and-swap: patch ONLY if the doc still matches this
                         token (from a prior read/write receipt) — a conflict is STALE_HEAD
                         (exit 5), NOT retried. Omit for a normal (auto-retrying) update.
  --actor <name>         Attribute this write (recorded in version history by a persisting
                         backend; the local filesystem backend accepts but does not store it).
  ```

### 5. `packages/cli/src/commands/list.ts` — `--field` filter + kind-aware columns

- **Imports:** add `loadKinds` to the core import (line 8); add `import { CliError } from
  "../errors.js";`.
- **Options** (lines 42–51): add `field: { type: "string", multiple: true }`.
- **`--field` parse → filter.fields** (after line 64):
  ```ts
  if (values.field && values.field.length > 0) {
    const fields: Record<string, string> = {};
    for (const entry of values.field) {
      const eq = entry.indexOf("=");
      const key = eq >= 0 ? entry.slice(0, eq).trim() : "";
      if (eq < 0 || key === "") {
        throw new CliError("USAGE", `--field expects key=value (got '${entry}')`, {
          help: `${cliInvocation()} list --field status=done`,
        });
      }
      fields[key] = entry.slice(eq + 1);
    }
    filter.fields = fields;
  }
  ```
  (Import `cliInvocation` from `../invocation.js`.)
- **Kind-aware column projection** (replace the fixed projection at lines 76–91). Keep the
  current minimal projection as the default `projectMinimal(d)`; add:
  ```ts
  const COLUMN_CELL_CAP = 80;
  const cell = (v: unknown): unknown => {
    if (v === undefined || v === null) return "";
    const s = Array.isArray(v) ? v.join(",") : v;
    return typeof s === "string" && s.length > COLUMN_CELL_CAP ? s.slice(0, COLUMN_CELL_CAP) + "…" : s;
  };

  let rows: Record<string, unknown>[];
  let kindCols: string[] | undefined;
  if (extraFields.length === 0 && filter.type && docs.length > 0) {
    const registry = await loadKinds(bundle);              // command-layer, loaded ONCE (gate 3)
    const kind = registry.kinds.get(filter.type);
    if (kind) {
      const cols = [...new Set([...kind.fields.required, ...kind.fields.optional])]
        .filter((f) => f !== "id" && f !== "title" && f !== "description");
      if (cols.length > 0) kindCols = cols;
    }
  }
  if (kindCols) {
    rows = docs.map((d) => {
      const fm = d.frontmatter as Record<string, unknown>;
      const row: Record<string, unknown> = {
        id: d.id,
        title: typeof fm.title === "string" ? fm.title : (d.id.split("/").pop() ?? d.id),
      };
      for (const c of kindCols!) row[c] = cell(fm[c]);
      return row;
    });
  } else {
    rows = docs.map(projectMinimal);   // existing {id,type,title,timestamp}+extraFields path
  }
  ```
  `loadKinds` runs ONLY on a non-empty, type-scoped, `--fields`-free query — an unscoped /
  `--fields` / conventions-free query does zero registry work.
- **`LIST_USAGE`** (lines 13–29): add the `--field` option and a one-line note that a
  `--type`-scoped query over a governed kind shows that kind's fields as columns (override
  with `--fields`):
  ```
  --field <k=v>        Restrict to concepts whose frontmatter field k equals v (repeatable;
                       ALL must match). Array fields match on membership.
  ```
  and to the Usage synopsis: `[--field <k=v>]`. Note under Options: "A --type-scoped query of
  a kind-governed type projects that kind's declared fields as columns; --fields overrides."

### 6. `packages/cli/src/reference.ts` — single-source usage strings (drives both SKILL.md)

- `list` entry (lines 73–74): usage →
  `list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--remote <url>]`.
- `doc update` entry (lines 60–63): usage → append `[--expected-version <v>] [--actor <n>]`;
  summary unchanged (or append ", optimistic-CAS with --expected-version").

After editing, regenerate both SKILL files (see Gate steps) so the drift gate passes.

---

## Confirmed NO-CHANGE files

- `packages/core/src/types.ts` **`WriteOptions`** — already carries `expectedVersion?`/
  `actor?`. (Only `QueryFilter` in this file changes.)
- `packages/core/src/backend.ts` (`FilesystemBackend`), `packages/core/src/memory-backend.ts`,
  `packages/core/src/remote-backend.ts` — `query`'s `fields` facet is filtered in core
  `query()`, backend-agnostic; actor/CAS already flow through the existing seam. No adapter
  change. (Filesystem's accept-but-don't-persist-actor posture is pre-existing and intended.)
- `packages/server/src/router.ts` — `writeOptionsFromHeaders` already maps
  `If-Match→expectedVersion` and `X-Actor→actor`; `--field` filtering is client-side in core
  `query()` (the CLI `list` does not use server-side projection). Zero server change.
- `packages/core/src/bundle.ts` `writeDoc`/`writeDocVersioned`/`docVersions` — unchanged
  (they already accept/return the version/actor surface).
- `packages/cli/src/commands/kinds.ts` — read-only display of the registry; unchanged (the
  new column/filter logic reads the SAME `loadKinds` registry, no fork).
- `packages/worker/*` (`D1R2Backend`) — a persisting backend that already honors actor/CAS;
  no change (it will simply be a backend on which `--actor` becomes observable later).

---

## Test matrix

Harness: in-process command functions against a real temp filesystem bundle (the
`kinds.test.ts` / `link.test.ts` pattern), plus a real `serve()` instance for `--remote`
(the `remote.test.ts` pattern). Add a `test/list.test.ts` (there is none today) and extend
`test/doc.test.ts` + `test/remote.test.ts`. Seed a bundle with **two distinct kinds** (e.g. a
`Task` convention: required `status` values `[todo,doing,done]`, optional `priority`,
`description`; and a second kind, e.g. `Ticket`: required `severity`) to prove genericity.

**A — kind-aware columns**
1. Type-scoped query of a governed kind projects the kind's fields: `list --type Task` rows
   have keys exactly `{id, title, status, priority}` (required+optional minus `description`),
   NOT `{id,type,title,timestamp}`; `description` is EXCLUDED; `count` present.
2. **Unscoped `list` stays minimal:** rows are `{id,type,title,timestamp}` across mixed kinds
   (regression guard — no per-row kind columns; loadKinds NOT invoked — assert via a bundle
   with a malformed convention that would surface a warning only if loaded, or spy).
3. **`--fields` override:** `list --type Task --fields foo` yields the minimal schema +
   `foo` (kind columns suppressed).
4. Type-scoped query of an **ungoverned** type → minimal schema (no kind, no crash).
5. Governed kind with **zero declared fields** → minimal schema (activation guard 4).
6. **Generic across kinds:** `list --type Ticket` projects `{id,title,severity}` — proving
   no hardcoded kind name (same code, different kind).
7. Long declared-field value is truncated to `COLUMN_CELL_CAP` in the cell (row-width safety).

**B — `--field` filter**
8. `list --field status=done` returns only done Tasks; `count` matches.
9. Repeatable AND: `list --field status=doing --field priority=high` returns the intersection.
10. **No-match definitive empty state:** `list --field status=nope` → `{count:0, docs:[]}`,
    exit 0 (not an error, not a hang).
11. Unquoted numeric coercion: a doc with `priority: 1` (YAML number) matches
    `--field priority=1`.
12. Array membership: a doc with `tags: [a,b]` matches `--field tag=a` (if a `tag` field) /
    `--field tags=a`.
13. Malformed `--field foo` (no `=`) and `--field =v` (empty key) → USAGE (exit 2).
14. **Compose with columns:** `list --type Task --field status=done` filters AND projects
    kind columns together.
15. **`--field` over `--remote`:** same result set as `--dir` against a live `serve()`
    (proves the core-facet decision — client-side filter rides `readMany` over the wire).

**C — `doc update --expected-version` / `--actor`**
16. **Optimistic CAS happy path:** read a doc's version → `doc update <id> --status done
    --expected-version <v>` → `changed:true`, exit 0.
17. **CAS conflict → STALE_HEAD:** read version `v`, mutate the doc out-of-band (a second
    update), then `doc update <id> --status done --expected-version v` → `CliError` code
    `STALE_HEAD`, exit 5, `details:{expected,actual}` populated.
18. **Present-but-blank `--expected-version` → USAGE** (exit 2), no write (mirror `docDelete`).
19. **Present-but-blank `--actor` → USAGE** (exit 2).
20. **`--expected-version` disables retry** (hard CAS): distinct from the ABSENT case — with
    no token, a benign concurrent-version bump is retried and succeeds (existing behavior,
    regression guard); with a token it fails STALE_HEAD.
21. **Idempotent no-op with matching version:** `doc update <id> --status <current>
    --expected-version <current-v>` → `changed:false`, no write.
22. **Stale-token no-op still STALE_HEAD:** a no-op patch whose `--expected-version` no longer
    matches current → `STALE_HEAD` (premise checked before idempotency).
23. **`--actor` recorded (mutate-level, MemoryBackend):** call `mutateDoc({mode:"patch",
    bundle: <MemoryBackend bundle>, actor:"alice", ...})` and assert
    `docVersions(bundle,id)[0].actor === "alice"` — proves the thread from options →
    `writeDoc` → seam. (The CLI cannot inject a MemoryBackend; this is the observability path.)
24. **`--actor` accepted through the CLI (filesystem):** `doc update <id> --status done
    --actor alice` exits 0, `changed:true` — documents that the degenerate filesystem backend
    accepts-but-does-not-persist (no crash; caveat recorded in the plan).
25. **`--actor` over `--remote`:** `doc update --actor alice --remote <serve()>` succeeds
    (the request carries `X-Actor` via the already-wired path; server is filesystem-backed so
    persistence is not asserted — thread-through only).

**Cross-cutting**
26. **Conventions-free bundle unaffected (both features):** a bundle with NO `Convention`
    docs — `list --type Foo` returns the minimal schema (no kind columns); `--field k=v`
    filters normally; `doc update --expected-version` CAS works — byte-for-byte as before
    kinds existed (registry loads to empty; loadKinds is a cheap list-of-nothing).
27. **Existing suites stay green:** `examples/sample-bundle` round-trip, `kinds.test.ts`,
    `doc.test.ts`, `remote.test.ts`, the `list`-invoking tests
    (`status`/`recipes`/`remote-auth`) unchanged.

---

## Commit strategy

**Default: one commit** — the three capabilities are small, share the same registry/seam
plumbing, and are a coherent "make declared kind fields first-class" unit. If review prefers,
split at the natural seam:
- Commit 1 (READ): Forks A+B — `types.ts` + `bundle.ts` (`fields` facet) + `list.ts` +
  `reference.ts` (list usage) + `test/list.test.ts` + remote field test.
- Commit 2 (WRITE): Fork C — `mutate.ts` + `doc.ts` + `reference.ts` (doc update usage) +
  `doc.test.ts`/`remote.test.ts` CAS+actor tests.

Default to one; the split is a fallback if the diff reviews too large.

---

## Gate steps (must all pass before shipping — CLAUDE.md "Working here")

1. `npm run build` (bundles the CLI to `packages/cli/dist/agentstate-lite.mjs`) — exit 0.
2. `npm run typecheck` — exit 0 (new `QueryFilter.fields`, `MutateDocOptions.actor/
   expectedVersion`, `ParsedDocUpdateArgs` fields all type-clean).
3. `npm test --workspaces --if-present` — core + cli + viewer suites green, including the new
   list/doc/remote tests.
4. **Regenerate both SKILL.md** from the edited `reference.ts`:
   `npm run gen:skill -w agentstate-lite` and `npm run gen:skill:bundle -w agentstate-lite`
   (then `npm run check:skill` + `npm run check:skill:bundle` must be clean — the drift gate).
5. `npm run check` (build + typecheck + tests + both skill drift gates + bundle check) — the
   one-shot green gate.
6. **Smoke-test the built CLI** on `examples/sample-bundle` (must still report 4 nodes / 7
   edges on `view`), plus exercise the three new surfaces on a `--init`'d bundle with a seeded
   kind: `list --type <Kind>` (kind columns), `list --field status=<v>` (filter + no-match
   empty), `doc update <id> --status <v> --expected-version <v>` (CAS happy path + a forced
   conflict), and the `--remote` variants against a local `serve()`.
7. AXI conformance re-check (gate 1): unscoped `list` still minimal; long text never in rows;
   `count` emitted; definitive empty state on no-match; structured errors + capped exit codes
   (USAGE=2, STALE_HEAD=5); kind columns are a type-scoped affordance, not a default-widening.
