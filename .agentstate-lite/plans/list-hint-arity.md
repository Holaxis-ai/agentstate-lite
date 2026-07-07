---
type: Plan
title: 'Kind-UX pair + a stale-caveat close — list discovery hint, enum arity guard'
timestamp: '2026-07-06T16:48:21.916Z'
---
# Kind-UX pair + a stale-caveat close — list discovery hint, enum arity guard

**Status: binding plan (2026-07-04).** The first slice of `tasks/task-ergonomics`, scoped
to what dogfooding actually proved, plus one records fix.

## Decisions

1. **NO data-dependent schema.** The considered design — project kind columns whenever a
   result set is uniformly one governed kind — was REJECTED: it keys the output schema on
   bundle CONTENT (adding one off-kind doc under `tasks/` silently flips a scan back to
   the minimal schema), where every existing projection decision is INVOCATION-keyed
   (`--type`, `--fields`). Schema instability an agent didn't cause is the exact surprise
   class this CLI's AXI discipline exists to prevent.
2. **The felt friction (typing `--fields status,priority` because nothing advertises Fork
   A) is a DISCOVERY gap → fix it with a HINT**: when a minimal-schema result set turns
   out to be uniformly ONE governed kind with projectable fields, `list` appends one help
   line naming the `--type <Kind>` invocation. Registry load is gated behind the
   uniformity precondition (plus no `--type`/`--fields`), so the common mixed/unscoped
   scan pays nothing; when it fires over `--remote` it costs one thin `conventions/`
   round-trip. If dogfooding later proves the hint insufficient, an invocation-keyed
   extension (activate columns when `--prefix` equals a kind's declared `path`) remains
   available — a second step to earn, not assume.
3. **Enum arity guard lives in CORE's one validation locus**, not in per-command parsers.
   Repeated kind-field flags are an intentional FEATURE (`--tags a --tags b` → array);
   the actual gap is that an ENUM-RESTRICTED field (scalar semantics by construction —
   `status`) accepts an array whose members each pass the element-wise membership check:
   `new "Task" x --status todo --status done` persists a two-status task with ZERO
   warnings, even `--strict`. Fix: `validateAgainstKind` emits `KIND_FIELD_ARITY` when a
   `fields.values`-constrained field carries an array — so `new` (always strict), `doc
   update` (strict for kind fields), `doc write --strict`, and `status` (bundle lint,
   which will now surface any EXISTING two-status docs) all inherit it from one place.
   Non-enum fields keep their array feature untouched. If a future kind genuinely wants a
   multi-select enum, that needs declared arity in the convention schema — out of scope.
4. **`doc read --out` traversal caveat: STALE — verified closed, caveat updated.** Live
   probe (`doc read '../secret' --out -` against a bundle nested beside a secret file)
   rejects with USAGE; `doc/read.ts` explicitly `assertSafeConceptId(id)`s before the raw
   `fs.readFile(join(root, rel))`, and the remote branch routes through the engine.
   `FilesystemBackend`'s half was already closed by the fs-hardening pass. No code
   change; the STATUS caveat is rewritten to say resolved-and-reverified.

## Touch list

- `core/src/kinds.ts` — arity check in `validateAgainstKind` (+ core test).
- `cli/src/commands/list.ts` — uniform-kind discovery hint (+ cli tests: fires on
  uniform-governed, silent on mixed/ungoverned/`--type`/`--fields`).
- CLI tests pinning the guard end-to-end: `new` repeated enum flag → USAGE; `doc update`
  repeated enum flag → USAGE; repeated NON-enum field still produces an array.
- STATUS.md: caveat rewrite + changelog item 41.
- Board: `tasks/task-ergonomics` progress note (stays open — claim/runnable-blocked
  remain, deliberately unearned).
