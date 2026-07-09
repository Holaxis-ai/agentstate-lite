---
type: Plan
title: AXI Experience Pass — binding per-file implementation plan
timestamp: '2026-07-06T16:48:12.231Z'
---
# AXI Experience Pass — binding per-file implementation plan

Task: `tasks/axi-experience-pass`. Three sub-items that make the CLI itself exemplify the AXI
principles it is built around. Builds on the clean tree after delete (fccb067) + kind-aware doc
surface (e0349b9).

- **A1** — content-first home (AXI §8): zero-arg `home` leads with a live bundle dashboard when a
  local bundle is discoverable; falls back to identity + reference + `init` hint otherwise.
- **A2** — translate `parseArgs` errors (AXI §6) at the single `parseOrUsage` chokepoint.
- **A3** — invocation-correct hints (AXI §7/§10): audit (done below), fix the one emitted-message
  bypass, defer the static USAGE-prose bulk with a logged follow-up.

All line numbers below were verified against the current tree while writing this plan.

---

## Grounding facts established by reading the real code

- `packages/cli/src/commands/home.ts` (74 lines): `buildHomeView(creds, {binPath, invocation})` is
  PURE and returns `{ "agentstate-lite": {bin,description}, auth, commands, kinds, remote_env }`.
  `home(argv, deps)` reads creds (file only), builds, writes TOON, always exits 0. Imports ONLY
  `credentials`, `invocation`, `reference`, `output` — the documented structural-offline guarantee.
- `packages/cli/src/cli.ts`: `main()` pre-routes bare args (`command === undefined`) to `home(argv)`
  (line 118-121) BEFORE `runAxiCli`; `home` is also a defensive SDK alias `home: wrap(home)`
  (line 177). `wrap` calls `fn(args)` with no deps.
- `packages/cli/src/bundle.ts`: `openBundle(dirFlag, remoteFlag?)` (line 170). With BOTH args
  undefined it runs `findBundleRoot(process.cwd())` — a pure local up-tree walk for `index.md`
  (line 55-65) — and throws `CliError("NOT_FOUND", …)` (line 191-196) when none is found. It only
  ever constructs a `RemoteBackend` when `remoteFlag` is truthy (line 171-180). So
  `openBundle(undefined, undefined)` is structurally network-free.
- `packages/core/src/bundle.ts`: `query(bundle, filter={})` (line 281) = ONE `backend.list()` +
  ONE `backend.readMany()` batch; returns `OkfDocument[]` sorted by id. This is the sanctioned ONE
  bundle walk (gate 3). `readMany` reads full doc bodies (cost noted below).
- `packages/cli/src/commands/list.ts`: the minimal row schema is `{id, type, title, timestamp}`
  with `title` fallback = `d.id.split("/").pop() ?? d.id` (line 76-91). Reused verbatim in A1.
- `packages/cli/src/commands/status.ts`: the `Capped = {shown, total, rows}` convention (line
  92-102) — reused for the recent-docs list. status does a `loadKinds` + `freshness` sweep; A1 does
  NEITHER (cheapness).
- `packages/cli/src/args.ts` (26 lines): `parseOrUsage(parse, command)` catches any non-CliError
  throw and rethrows `CliError("USAGE", err.message, {help: \`${cliInvocation()} ${command} --help\`})`
  — fixes exit code (2) but preserves parseArgs's raw message verbatim (the leak A2 removes).
- `packages/cli/src/errors.ts`: `CliError`, `EXIT` table, `CODE_EXIT` — **unchanged by this unit.**
- `packages/cli/src/invocation.ts`: `cliInvocation()`, `binPath()`, `hookCommand()` — already
  correct, **unchanged.**
- `packages/cli/src/reference.ts`: `DESCRIPTION` + `COMMAND_GROUPS` are the single source of truth
  for `--help`, `home`'s command block, AND `SKILL.md` (via `scripts/gen-skill.mjs`, which reads
  `COMMAND_GROUPS` only — line 1, 302-303). **Unchanged by this unit** ⇒ `SKILL.md` bytes unchanged.
- `packages/cli/src/commands/hook.ts` line 39: `DIST_ENTRYPOINT = "dist/agentstate-lite.mjs"` is
  passed as `distEntrypoints: [DIST_ENTRYPOINT]` to axi-sdk-js `installSessionStartHooks` (line
  232-235) — used to DETECT/clean legacy phantom-dist hooks, NOT an emitted next-step. Intentional
  infra, **out of scope, no change.** Confirmed.
- Existing home coverage: there is **no** `home.test.ts`. The ONLY pinned home assertion is
  `kinds.test.ts:72-73` — `buildHomeView(null, {binPath, invocation})` asserting `home.kinds`. That
  call stays valid (the new `summary` param is optional) and its assertion is unaffected.

### Empirically captured node `parseArgs` error codes (A2 ground truth — read off real throws)

Run against the real `node:util` on this machine, with `allowPositionals: true` (the config the
commands use, which is what appends the advisory tail):

| Input | `err.code` | `err.message` (verbatim) |
|---|---|---|
| `--foo` | `ERR_PARSE_ARGS_UNKNOWN_OPTION` | `Unknown option '--foo'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- "--foo"` |
| `-x` | `ERR_PARSE_ARGS_UNKNOWN_OPTION` | `Unknown option '-x'. To specify a positional argument …` |
| `--type` (no value) | `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` | `Option '--type <value>' argument missing` |
| `--json=hi` (bool w/ value) | `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` | `Option '--json' does not take an argument` |
| `--type --json` (ambiguous) | `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` | `Option '--type' argument is ambiguous.\nDid you forget…` |
| `bar` (positionals off) | `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` | `Unexpected argument 'bar'. This command does not take positional arguments` |

Three codes cover every case. The offending token is always the first single-quoted group
(for missing-value it is `--type <value>` ⇒ take the first whitespace word ⇒ `--type`).

---

## A1 — Content-first home

### Resolved forks

1. **Content & ordering.** Field insertion order (= rendered TOON order):
   1. `"agentstate-lite": { bin, description }` — tool identity FIRST (AXI §10: "identify the tool
      before the live data"; a one-line identity header is not "the manual").
   2. `auth` — unchanged block.
   3. `bundle` — the LIVE dashboard, present ONLY when a local bundle is discoverable. This places
      live content ABOVE the command reference (the manual), satisfying §8 ("no-args shows live
      content, not a manual"). Resolves the brief's "dashboard above the reference block" against
      §10's "identity first": identity stays first, the *manual* is demoted below the dashboard.
   4. `commands` — the reference (manual), now below live content.
   5. `kinds`, `remote_env` — unchanged static pointers.
   When NO bundle: the `bundle` block is omitted and a `getting_started` hint is inserted just
   before `commands`.

2. **`bundle` block shape** (all cheap, all from ONE `query`):
   - `root`: home-collapsed bundle root path (directory-scoped context, §7 — tells the agent WHICH
     bundle it is looking at).
   - `docs`: total concept count (§4 aggregate).
   - `by_type`: `Record<type, count>`, sorted by count desc then type asc for determinism (§4
     aggregate). Distinct types are inherently few; emitted in full.
   - When `docs > 0`: `recent`: `{ shown, total, docs: Row[] }` (status.ts's `Capped` convention) —
     the most-recent N docs in the minimal `{id,type,title,timestamp}` schema (§2), sorted by
     `timestamp` DESC (ISO string compare; missing/empty timestamp sorts LAST), id asc as tiebreak,
     capped at `HOME_RECENT_LIMIT = 5` (§7 token budget). `next`: 2–3 runnable
     `deps.invocation()`-derived hints — `<inv> list`, `<inv> status`, `<inv> view` (§9).
   - When `docs === 0` (bundle present, empty): omit `recent`; add `help`: `"<inv> note write … | <inv> new … — create the first doc"` (§5 definitive empty state, distinct from no-bundle).

3. **Cap = 5**; ordering = timestamp desc. Justified: small every-session payload; the full list is
   one `<inv> list` away (§9 contextual disclosure).

4. **Cheapness / gate-3 discipline.** A1 uses `query(bundle)` (the ONE sanctioned bundle walk) and
   NOTHING else: NO `loadKinds`, NO `freshness`, NO graph walk, NO backlinks. `by_type` and `recent`
   are computed in memory from that one result. This meets the brief's cheapness bar (which
   explicitly forbids graph walk / status / freshness / loadKinds — a plain `query` is not on that
   list). **Accepted cost + logged follow-up:** `query` → `readMany` reads full doc BODIES though
   the dashboard needs only frontmatter; for a pathologically huge bundle that is wasteful. We do
   NOT fork a second frontmatter-only walk here (gate 3: ONE bundle walk). Follow-up logged in
   STATUS.md: "home dashboard could use a frontmatter-only / limited backend `list` seam if
   profiling shows the every-session full-body read matters."

5. **Offline / hook-safe (highest-stakes).** Two layers:
   - The DEFAULT summarizer calls `openBundle(undefined, undefined)` (LOCAL discovery only — never
     constructs a RemoteBackend, structurally network-free) then `query`, all inside `try/catch`
     returning `null` on ANY failure (no bundle → NOT_FOUND thrown → null; permissions/malformed →
     null).
   - `home()` ALSO wraps the `summarizeBundle()` call in `try/catch` (belt + suspenders: even an
     injected/real dep that throws → treated as null → offline fallback). `home()` still ALWAYS
     resolves, NEVER rejects, exits 0.

6. **HomeDeps seam.** Add `summarizeBundle?: () => Promise<BundleSummary | null>` to `HomeDeps` so
   unit tests inject a fake and do zero real FS I/O. `home()` defaults it to
   `defaultSummarizeBundle` (the local-read impl).

7. **Second fork (hook payload).** RESOLVED per the brief's lean: `home` stays the single entry;
   the live dashboard is GATED by bundle-presence, which is naturally the project-scoped case (§7
   directory-scoped). When the SessionStart hook fires in a non-bundle dir the payload is the lean
   offline reference; when it fires inside a project bundle it is the richer dashboard. This gives
   token-budget discipline WITHOUT a separate `dashboard` verb (rejected — it would fork the entry
   surface and contradict §8's "the bare invocation is the home"). The hook installer is UNCHANGED
   (still runs the bare invocation = `home`).

### Edits

**`packages/cli/src/commands/home.ts`** (primary):
- Update the module header comment: re-express the offline guarantee — home MAY do a LOCAL bundle
  read via `openBundle(undefined, undefined)` (which never constructs a RemoteBackend, so it stays
  structurally network-free); it never takes a `--remote`/URL and never fetches. Note it now imports
  `bundle.ts` (`openBundle`) + core `query`, and that the local read is behind the injectable
  `summarizeBundle` seam and double-guarded so it can never fail a session.
- Add imports: `openBundle` from `../bundle.js`, `query` from `@agentstate-lite/core`,
  `collapseHomeDirectory` from `../invocation.js`.
- Add `const HOME_RECENT_LIMIT = 5;`.
- Add exported types:
  ```ts
  export interface HomeRow { id: string; type: string; title: string; timestamp: string; }
  export interface BundleSummary {
    root: string;                 // home-collapsed
    docs: number;
    byType: Record<string, number>;
    recent: { shown: number; total: number; rows: HomeRow[] }; // rows empty when docs===0
  }
  ```
- Add `summarizeBundle?: () => Promise<BundleSummary | null>` to `HomeDeps`.
- Add `export async function defaultSummarizeBundle(): Promise<BundleSummary | null>` — wraps
  `openBundle(undefined, undefined)` + `query` in try/catch → null on any throw; projects rows via
  the same minimal-schema mapping as list.ts; computes `byType` and the timestamp-desc-capped
  `recent`; `root` via `collapseHomeDirectory(bundle.root)`.
- Change `buildHomeView` signature to `buildHomeView(creds, deps, summary?: BundleSummary | null)`
  (additive — existing 2-arg call sites unaffected). Insert the `bundle` block (or `getting_started`
  hint) per the ordering above. The `next`/`help` hints use `deps.invocation()`.
- In `home()`: resolve `summarize = deps.summarizeBundle ?? defaultSummarizeBundle`; call it inside
  a `try { summary = await summarize(); } catch { summary = null; }`; pass `summary` to
  `buildHomeView`. Everything else (creds read, TOON write, exit 0) unchanged.

**`packages/cli/src/cli.ts`**: NO change required — the bare-arg pre-route `home(argv)` (line 119)
and the `home: wrap(home)` alias (line 177) both use `home`'s own defaults, which now include
`defaultSummarizeBundle`. (Confirmed: no dep-injection needed at the composition root because the
default lives in home.ts, matching the existing `loadCreds ?? loadCredentials` pattern.)

**`packages/cli/src/reference.ts`**: NO change (COMMAND_GROUPS/DESCRIPTION untouched).

---

## A2 — Translate parseArgs errors

### Design (grounded in the captured codes)

Rewrite `packages/cli/src/args.ts`. Add a pure helper and use it in `parseOrUsage`; keep exit 2
(`CliError("USAGE", …)`) and the existing `${cliInvocation()} ${command} --help` pointer.

```ts
const QUOTED = /'([^']+)'/;

/** Translate a node parseArgs error to a clean, tool-native USAGE message, or null if unrecognized. */
export function translateParseArgsError(err: unknown): string | null {
  if (!(err instanceof Error) || typeof (err as { code?: unknown }).code !== "string") return null;
  const code = (err as { code: string }).code;
  const tok = QUOTED.exec(err.message)?.[1];
  switch (code) {
    case "ERR_PARSE_ARGS_UNKNOWN_OPTION":
      return tok ? `unknown option '${tok}'` : stripAdvisory(err.message);
    case "ERR_PARSE_ARGS_INVALID_OPTION_VALUE": {
      const opt = tok ? tok.split(/\s+/)[0] : undefined;              // '--type <value>' -> '--type'
      if (/does not take an argument/.test(err.message))
        return opt ? `option '${opt}' takes no value` : stripAdvisory(err.message);
      return opt ? `option '${opt}' requires a value` : stripAdvisory(err.message);
    }
    case "ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL":
      return tok ? `unexpected argument '${tok}'` : stripAdvisory(err.message);
    default:
      return null; // unrecognized ERR_PARSE_ARGS_* (or non-parse Error) -> caller keeps trimmed original
  }
}

/** Drop node's advisory boilerplate tail (kept for the fall-through cases so nothing regresses). */
function stripAdvisory(msg: string): string {
  return msg
    .split(". To specify a positional argument")[0]
    .split("\nDid you forget")[0]
    .trim();
}
```

`parseOrUsage` becomes:
```ts
export function parseOrUsage<T>(parse: () => T, command: string): T {
  try {
    return parse();
  } catch (err) {
    if (err instanceof CliError) throw err;               // passthrough — never remapped
    const translated = translateParseArgsError(err);
    const raw = err instanceof Error ? err.message : String(err);
    const message = translated ?? stripAdvisory(raw);      // unrecognized -> trimmed original, never worse
    throw new CliError("USAGE", message, { help: `${cliInvocation()} ${command} --help` });
  }
}
```
Update the module header comment to say it now TRANSLATES the parseArgs message (not "preserving"),
mapping by `err.code`, stripping the advisory boilerplate, keeping exit 2 + the help pointer.

Resulting clean messages: `unknown option '--foo'`, `option '--type' requires a value`,
`option '--json' takes no value`, `unexpected argument 'bar'`. One change, all 30 call sites across
20 commands benefit; no per-command edits.

**`packages/cli/src/errors.ts`**: NO change (codes/exit map untouched, per gate).

---

## A3 — Invocation-correct hints (scoped)

### Audit result (do NOT re-derive — this is the finding)

- Grep of every `help:` field across `src/` for a hardcoded bin: **zero hits.** Every emitted
  runnable next-step (error `help:` fields, success `help[]` entries) already derives from
  `cliInvocation()` / `deps.invocation()` / `wrapTransportErrors`'s `cliInvocation()`. No bypass.
- The ONLY emitted MESSAGE (not a `help:` field) that hardcodes a runnable command is
  **`packages/cli/src/commands/whoami.ts:89`**:
  `throw new CliError("AUTH_REQUIRED", "not logged in — run \`agentstate-lite login --token <token>\`", { help: \`${cliInvocation()} login --token <token>\` })`.
  Its `help:` field is ALREADY resolved; the message merely duplicates the command as prose with a
  hardcoded bin.
- All other `agentstate-lite <verb>` occurrences are (a) module doc COMMENTS (never emitted) or
  (b) static `*_USAGE` constant bodies + embedded prose cross-refs (`see 'agentstate-lite kinds'`
  in doc.ts:96/117, kinds.ts:22/35, new.ts:40, delete.ts:40, key.ts:45, note.ts:82/104, …). These
  are module-level `const` strings printed on `--help`.

### Scope decision

- **IN:** (a) prove emitted next-steps are invocation-derived via a cheap guard test; (b) fix the
  one high-value emitted-message hardcode (whoami.ts:89).
- **DEFER (logged follow-up):** converting the ~18 `*_USAGE` constant strings + embedded prose
  cross-refs to invocation-aware builders. Rationale: they are static `--help` PROSE, not emitted
  runnable next-steps an agent branches on; the canonical resolved path is always the `help:` field
  (already correct). Converting every USAGE const to a builder touches every command file and every
  `--help`-pinned test — disproportionate to this unit, and a partial conversion would be
  inconsistent. Log as **"A3-defer: invocation-aware USAGE prose"** in STATUS.md.
- **Confirmed out of scope:** `hook.ts` `DIST_ENTRYPOINT` (infra passed to axi-sdk-js for legacy
  hook cleanup, not an emitted hint). No change.

### Edits

**`packages/cli/src/commands/whoami.ts:89`**: change the message to drop the hardcoded command (the
resolved `help:` already carries it):
```ts
throw new CliError("AUTH_REQUIRED", "not logged in", {
  help: `${cliInvocation()} login --token <token>`,
});
```
(Confirm no test pins the old message substring; adjust `login.test.ts`/`auth-cli.test.ts` if so.)

---

## Confirmed no-change files

- `packages/cli/src/errors.ts` — codes + exit map untouched (gate).
- `packages/cli/src/invocation.ts` — already correct.
- `packages/cli/src/reference.ts` — `COMMAND_GROUPS`/`DESCRIPTION` unchanged ⇒ `SKILL.md` bytes
  unchanged.
- `packages/cli/src/cli.ts` — pre-route + alias use home's own defaults; no dep threading needed.
- `packages/cli/src/commands/hook.ts` — `DIST_ENTRYPOINT` is intentional infra.
- All other command `*_USAGE` constants — A3-deferred.
- `packages/cli/src/output.ts` — untouched.
- `packages/core/**` and `packages/worker/**`, wire/backend — untouched (scope gate: no engine/wire
  change).

---

## Full test matrix

New file **`packages/cli/test/home.test.ts`** (in-process, dep-injected — mirrors status/kinds
harness). All A1 tests build/run `buildHomeView` and/or `home()` capturing stdout:

- **A1.1 dashboard (bundle present)** — inject `summarizeBundle` → summary with docs>0; assert the
  `bundle` block exists, `docs`/`by_type`/`recent.{shown,total}` correct, `recent.rows` in
  `{id,type,title,timestamp}` minimal schema, `next` hints reflect the injected `invocation()`.
- **A1.2 ordering** — assert insertion order: identity → auth → `bundle` → `commands` (bundle
  BEFORE the reference/manual; identity first).
- **A1.3 no-bundle fallback** — inject `summarizeBundle` → null; assert NO `bundle` block, a
  `getting_started` hint present, `commands` present, home resolves (exit 0).
- **A1.4 empty bundle (present, 0 docs)** — summary with docs:0; assert `docs:0`, no `recent.rows`,
  a create-first-doc `help` (§5 definitive empty state), distinct from A1.3.
- **A1.5 bundle-read-error → offline fallback, still exit 0** — inject `summarizeBundle` that
  THROWS; assert `home()` does NOT reject, renders the no-bundle fallback, and (via the cli.ts
  path or a direct assertion) exit code stays 0.
- **A1.6 offline / directory-scoped (default deps, real FS)** — run `home()` with DEFAULT deps
  against (i) a temp CWD that IS a real bundle → dashboard appears; (ii) a temp non-bundle CWD →
  fallback. No network is ever touched (openBundle local path). Covers §7 directory-scoping and the
  offline guarantee end-to-end.
- **A1.7 recent ordering + cap** — summarizer over a fixture with >5 docs incl. some missing
  timestamps; assert `recent.shown === 5`, `recent.total === N`, rows sorted timestamp-desc, missing
  timestamps sort last.
- **A1.8 auth preserved in both branches** — logged-in and logged-out creds each render the `auth`
  block correctly with AND without a bundle.
- **A1.9 hook-safety hardening** — inject a `loadCreds` that throws; assert `home()` still resolves
  and emits a fallback (never rejects). (Belt + suspenders around the creds read too.)

Update **`packages/cli/test/kinds.test.ts:72-73`**: verify (no code change needed) that the 2-arg
`buildHomeView(null, {binPath, invocation})` call and its `home.kinds` assertion still pass with the
new optional `summary` param. Add a one-line comment noting the third param is optional.

New file **`packages/cli/test/args.test.ts`** (drives `parseOrUsage` with real parseArgs thunks):

- **A2.a** unknown long `--foo` → `CliError` code `USAGE`, `exitCode === 2`, message
  `unknown option '--foo'`, message has NO advisory tail, `help` endsWith `<cmd> --help`.
- **A2.b** unknown short `-x` → `unknown option '-x'`.
- **A2.c** missing value `--type` → `option '--type' requires a value`.
- **A2.d** boolean-with-value `--json=hi` → `option '--json' takes no value`.
- **A2.e** unexpected positional (thunk with `allowPositionals:false`) `bar` →
  `unexpected argument 'bar'`.
- **A2.f** ambiguous value (`--type --json`) → `option '--type' requires a value`.
- **A2.g** unknown-code fallback — thunk throws a synthetic `Error` with
  `code = "ERR_PARSE_ARGS_FUTURE"` and an advisory tail → message = trimmed original (tail stripped),
  exit 2 (never a worse generic).
- **A2.h** CliError passthrough — thunk throws `CliError("NOT_FOUND", …)` → rethrown UNCHANGED
  (code NOT remapped to USAGE).
- **A2.i** non-Error throw (`throw "boom"`) → `String(err)`, exit 2 (regression guard).
- **A2.j** clean-message-not-regressed — a code-less Error with an already-clean message passes
  through via `stripAdvisory` unchanged.

A3 tests:

- **A3.guard** (add to `home.test.ts` or a small `invocation-hints.test.ts`) — source-scan every
  `src/**/*.ts`: assert no `help:` field literal contains a bare `agentstate-lite`/`aslite`/
  `dist/agentstate-lite.mjs` (each `help:` template must contain `${` and not begin with a literal
  bin). Locks the audit finding against future regressions. Cheap, no runtime.
- **A3.whoami** (extend `login.test.ts` or `auth-cli.test.ts`) — `whoami` with no creds →
  `AUTH_REQUIRED`, exit 4, message no longer contains a hardcoded `agentstate-lite`, `help` still
  `<resolved> login --token <token>`.

---

## Build / doc / SKILL regeneration

`COMMAND_GROUPS`/`DESCRIPTION` are UNCHANGED, so `SKILL.md` (npm + skill targets) is byte-identical.
But source bytes change (home.ts, args.ts, whoami.ts, tests) ⇒ the committed skill bundle
`skills/agentstate-lite/scripts/agentstate-lite.mjs` (which `check:bundle` byte-compares) MUST be
rebuilt. Steps, in order:

1. `npm run build -w agentstate-lite` — esbuild writes `dist/agentstate-lite.mjs` AND mirrors it to
   the committed `skills/agentstate-lite/scripts/agentstate-lite.mjs` (build.mjs does both).
2. `npm run build:skill -w agentstate-lite` — rebuild + regenerate the skill-target `SKILL.md`
   (idempotent here; refreshes the committed bundle + skill doc).
3. `npm run gen:skill -w agentstate-lite` — regenerate the npm-target `SKILL.md` (idempotent).
4. `npm run check` at repo root — full gate: `build` + `typecheck` + `test --workspaces` +
   `check:skill` (SKILL drift) + `check:skill:bundle` + `check:bundle` (committed .mjs byte-compare)
   must all exit 0.
5. Smoke-test the built CLI on `examples/sample-bundle` per CLAUDE.md: `init`, `note write/read`,
   `list`, `link add/show`, `view` (expect 4 nodes / 7 edges) — PLUS the new surfaces: bare
   `node packages/cli/dist/agentstate-lite.mjs` from INSIDE `examples/sample-bundle` (dashboard
   appears with recent docs) and from a non-bundle dir (offline fallback + init hint); and a
   deliberate `list --nope` (→ `unknown option '--nope'`, exit 2).

**`STATUS.md`**: add a changelog row for the AXI experience pass (A1 content-first home / A2
parseArgs translation / A3 scoped invocation hints), and record two follow-ups: (1) "A3-defer:
invocation-aware USAGE prose", (2) "home dashboard full-body read — frontmatter-only/limited backend
`list` seam if profiling warrants". (STATUS.md is the repo's tracked honest-state doc, not a new
report artifact.)

---

## Commit strategy

Default **ONE focused, reviewable commit** (A1 + A2 + A3). A1 is the largest slice but stays
contained (home.ts + one new test file + STATUS row); A2 and A3 are each a single small file plus
one test file. The three are independent, so if review prefers, a clean split is **A1** as one
commit and **A2 + A3** as a second — but the default is one. No remote/PR (local-only cadence per
CLAUDE.md).

---

## Gate checklist (pre-ship)

- [ ] home stays OFFLINE (openBundle local-only, never a RemoteBackend), HOOK-SAFE (always exit 0,
      double-guarded try/catch), CHEAP (ONE `query`, no kinds/freshness/graph).
- [ ] A2 errors on stdout, exit 2, help pointer intact, no raw dependency wording; `errors.ts`
      untouched.
- [ ] gate 3 (ONE registry / ONE bundle walk) — home adds NO kinds load and reuses `query`.
- [ ] A3 audit locked by guard test; whoami message fixed; USAGE-prose deferral logged.
- [ ] `npm run check` exits 0 (incl. skill drift + committed-bundle byte-compare); works network-off.
- [ ] existing `kinds.test.ts` home pin still green.
