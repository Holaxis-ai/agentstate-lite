# agentstate-lite — Orchestrator Guide

This file is read automatically at every session start. `agentstate-lite` is an
**OKF-native, CLI-first, local-first** knowledge store: `packages/core` (the OKF
engine), `packages/viewer` (static HTML visualizer generator, a pure consumer of core;
sunsetting per bundle doc `docs/core`'s ecosystem stance), `packages/server` (`@agentstate-lite/server`
— the wire-protocol REFERENCE server, a pure consumer of core; see gate 3 and Scope),
`packages/worker` (`@agentstate-lite/worker` — the PRIVATE Cloudflare D1+R2 deployment
package, never bundled into the CLI; deployed to production and FROZEN per bundle doc `docs/core`),
`packages/ui` (the browser SPA — PRIVATE workspace; only its BUILT assets ship, gzip-embedded
into the CLI bundle; its views are paused pending a rethink, see gate 4), and `packages/cli` —
the **publishable npm package `agentstate-lite`** (bins `agentstate-lite` / `aslite`), an
esbuild bundle that inlines core + viewer + server + the built UI assets + deps into one
self-contained ESM file. The filesystem is the
DEFAULT local backend; the storage seam is pluggable (gate 3) and production runs D1/R2.

Before changing anything, read the PROJECT BUNDLE — it lives IN-REPO at `.agentstate-lite/`
(committed shared memory, discovered by the conventional-folder walk with zero config), so a
bare `doc read docs/core` just works on any clone: `docs/core` (the ONE-PAGE
product statement + frozen-scope list; scope questions answer to it), the board for live
state (`list --type Task`; per-unit records live in `tasks/<unit>` descriptions; the
pre-2026-07-06 changelog lives in the PRIVATE out-of-repo board archive, with the other
`visibility: private` docs), `docs/vision` (near-term design
intent + OKF grounding) and `docs/north-star` (the future-state vision) as needed — then
the packages' `src/`. The repo carries README + this file + code + the committed bundle
(root `/docs/` stays gitignored; a `.agentstate.json` binding, also gitignored, is the
local-only override and must NOT be committed here — the conventional folder is the
resolution path). Ground
every change in the ACTUAL current code, not assumptions — including the claims in THIS
file: when this guide and the code disagree, the code wins and this file gets fixed.

## Standing gates (honor these before shipping)

### 1. AXI-conformance is a pre-ship check for the CLI

Any change to `packages/cli` must satisfy the ten AXI principles (see the `axi` skill).
Watch-points that are easy to regress here:

- **`read` truncates large bodies.** A `read` of a large document body must truncate and
  point at `doc read --out <file>` (the byte channel), never dump the whole body to
  stdout.
- **`list`/`query` default to a minimal schema.** Default output is a 3–4 field row
  (`id`, `type`, `title`, `timestamp`), with a `--fields` hatch for more — not the full
  frontmatter+body per row.
- **List output includes total counts.** `list`/`query` emit a `count`; `link show` emits
  `outbound_count` / `backlink_count`.
- **A `view`/detail shows backlink counts inline.** `link show` reports the derived
  "cited by" count next to the concept.
- **`view` writes an HTML file and prints the path.** `axi view` must write `viz.html` and
  print its path — never dump HTML to stdout.
- **Errors go to stdout in structured form.** Error envelopes render as TOON on stdout with
  a capped exit-code taxonomy (0/1/2/4/5/6). Exception: `doc read --out -` routes the
  envelope to STDERR because stdout is reserved for raw bytes.
- **Mutations are idempotent.** Re-writing a doc or re-adding an existing link must be a
  no-op that exits 0 (`link add` returns `changed:false` when the link already exists).
- **The SessionStart hook targets Claude Code, Codex, AND OpenCode.** `hook install` writes a
  REAL `<bin> session-start` hook to all three — hand-rolled over axi-sdk-js's exported pure
  updaters (the SDK installer can't express argv; our args-aware OpenCode plugin stays
  SDK-marker compatible) — with a portable command base (bare bin name when on PATH, else the
  absolute executable) — no phantom `dist/axi`.

### 2. OKF-conformance for bundles

Every produced bundle must stay a valid OKF v0.1 Knowledge Bundle:

- Frontmatter on every non-reserved `.md`, with a **required, non-empty `type`** (§9.2).
- `index.md` / `log.md` are **reserved** at any directory level (§3.1); only the bundle-root
  `index.md` may carry frontmatter, solely to declare `okf_version`.
- **Cross-links are relative** bundle-relative markdown links (the form the reference graph
  builder counts as edges); core still resolves absolute `/…md` too, but the CLI **emits
  relative**.
- **Backlinks are derived**, never stored. **Freshness** is derived from the optional
  `timestamp` field — and `timestamp` may arrive **unquoted** from external bundles, so it
  is normalized to an ISO string at the one parse layer. Do not reintroduce string-only
  timestamp guards upstream of that normalization.

### 3. Pluggable-core principle

- Storage lives behind the `StorageBackend` seam (`core/src/types.ts`); the filesystem is
  the **default** adapter (`FilesystemBackend` in `core/src/backend.ts`). Remote backends are
  plug-ins that implement the same interface — never baked into the engine. The
  engine keeps all OKF semantics; a backend only persists and retrieves. **`RemoteBackend`
  (`core/src/remote-backend.ts`) is the first remote adapter, proving the wire-protocol v0
  REFERENCE contract (`docs/WIRE-PROTOCOL.md`, `packages/server`) — but a CF/production
  deployment behind it is still future (see Scope). The CLI is now `RemoteBackend`'s first REAL
  consumer** (`--remote <url>` on every bundle command, `packages/cli/src/bundle.ts`), not just a
  test-suite exerciser — so a wiring bug here is a user-facing bug, not a contract-test gap.
- **Flagship remote backend = document-centric** (per-doc identity, per-doc/namespace
  access, per-doc CAS concurrency), carrying canonical AgentState's proven versioning model:
  content-addressed snapshots + a head with a version + compare-and-swap writes + actor
  attribution. Git is an **export / interop + optional** adapter (OKF bundles are just
  files), **not** the flagship — it is repo-coarse for granular sharing and awkward for
  serving artifacts. Generated HTML is stored as a blob and served by content-type. See
  bundle doc `docs/north-star` and the versioning rationale it records.
- **The seam contract now carries the hard-case capabilities** (delivered in the
  "core-shape" pass): `read` returns a content-addressed (SHA-shaped) version token;
  `write` takes an optional compare-and-swap `expectedVersion` (throwing a typed
  `VersionConflict` on mismatch) plus an `actor`; `versions(id)` returns attributed history
  newest-first; and `readMany(ids)` batches reads so graph/backlink traversal is ONE
  round-trip, not N. `FilesystemBackend` is the **degenerate** adapter (version = SHA of the
  on-disk bytes, single-version `versions()` because a plain filesystem keeps no history).
  Its compare-and-swap is serialized (atomic) for concurrent writers **within one process**
  via a process-wide per-path mutex — closing the served multi-writer case — but stays
  **best-effort across processes** (no atomic conditional rename on POSIX). **`MemoryBackend`
  (`core/src/memory-backend.ts`) proves the same
  contract for the hard case** — a real version chain, enforced CAS, per-write attribution —
  and is the standing evidence that the engine leaks no filesystem assumptions (a
  dual-backend test asserts identical core-operation results over both). The seam is shaped
  for the hardest backend — networked, concurrent, multi-writer — so a document-centric (or
  git) remote adapter is a plug-in, not a rewrite.
- **The ENGINE API now surfaces those capabilities too** (delivered in the "engine-surface"
  pass): the seam no longer swallows version/CAS/actor/history. `writeDoc` takes an
  optional `WriteOptions` (compare-and-swap `expectedVersion` → typed `VersionConflict`, plus
  `actor`); `writeDocVersioned` returns the write's version token; `readDocVersioned` returns a
  document with its version; `docVersions(id)` exposes attributed history — all ADDITIVE, so the
  plain `writeDoc`/`readDoc` returns are unchanged and no version leaks into CLI (TOON) output.
  `link add` is the proof consumer: versioned read → append → CAS write with bounded conflict
  retry (preserving the idempotent `changed:false`). **Reserved files (`index.md`/`log.md`) are
  in the versioning/CAS model now**, not outside it: `readReserved` returns `{content, version}`,
  `writeReserved` honors CAS (FilesystemBackend best-effort hash-then-rename; MemoryBackend
  enforced), and `appendLog`/`regenerateIndex` are read-CAS-write with a bounded retry — so the
  provenance surface (`log.md`) no longer loses entries under a concurrent writer.
- Keep exactly **ONE** frontmatter parser, **ONE** bundle walk, **ONE** link resolver, and
  **ONE** viewer engine. Do not add a parallel implementation. The viewer is a consumer of
  core, not a second engine. (The viewer's client-side `viz.js` link resolver is browser
  runtime emitted into the HTML, not a build-time parser — that is the one allowed
  exception.)
- **Kind conventions (`core/src/kinds.ts`) are ONE registry, in core, consumed everywhere —
  not a schema fork.** A bundle MAY declare document kinds as plain OKF convention docs
  (`type: Convention`) naming the `type` value they govern, its required/optional fields,
  allowed enum values, expected body sections, and a freshness horizon. **THE MECHANISM IS
  CORE AND NON-NEGOTIABLE; USAGE IS OPT-IN PER BUNDLE**: a conventions-free bundle (every
  external OKF bundle today) behaves byte-for-byte as before. **The discovery contract is
  prefix-scoped and documented, not incidental:** a kind convention doc MUST live under the
  `conventions/` prefix to be discovered (`loadKinds` calls `query(bundle, { prefix:
  "conventions/", type: "Convention" })`) — a `Convention` doc anywhere else is silently
  NOT a kind, by design, and this is what keeps a conventions-free bundle's registry load a
  cheap list-of-nothing. Malformed conventions are skipped with a collected warning, never
  thrown; a duplicate `governs` keeps the first-by-id declaration. The registry is built
  ONCE per invocation, in the COMMAND layer (`kinds`/`new`/`doc write`/`doc update`/`list`'s
  kind columns, and the other kind-aware commands — `status`, `link`, `home`, `promote`,
  recipe/init seeding); no engine path (`readDoc`/`writeDoc`/…) loads it
  implicitly. `validateAgainstKind` returns core's existing `ValidationWarning` shape and
  reuses THE one heading splitter (`splitSections`, now in `kinds.ts`) for section linting —
  no second heading parser. `freshnessHorizonMs` FEEDS the existing
  `FreshnessOptions.maxAgeMs`; it does not fork `freshness()`. **Seeding is a CLI RECIPE
  concern, never an engine one** (the recipe-zero + pluggable-recipes passes): `initBundle`
  seeds NOTHING (core carries zero convention content — the former `note` command and its
  core codec are deleted; context notes are a plain default recipe authored via the generic
  path); the CLI's `init` applies the built-in `context-notes` recipe (`--recipe none` opts
  out), `recipe add` installs others (e.g. `work-tracking`), and every recipe — built-in or
  external folder — flows through ONE `RecipeSource`/`parseRecipeFiles` pipeline applying
  via expect-absent CAS (idempotent, never clobbers a hand-edited convention). If a future
  consumer (viewer/server/an MCP surface) needs kind awareness, it calls `loadKinds` itself
  — do not thread a second registry implementation through a different layer.

### 4. Human visibility — the local `ui` command; views paused, substrate frozen

The human-visibility surface is the **local `agentstate-lite ui` command**: one loopback
server serving the embedded SPA over a bundle (`--dir` mounts the reference router
in-process; `--remote` reverse-proxies with the stored key; per-run token + Host allowlist
+ CSP). The plumbing (server, proxy, security, embed pipeline, typed client, query layer)
is production-grade and INVESTABLE; the **views are PAUSED by human verdict** — do not
build UI views without an explicit human decision, and expect the rethink to question the
primitive itself (board task `tasks/ui-v1` carries the record). The static viewer
(`axi view` → `viz.html`) still works and is kept until the UI's views supersede it —
sunsetting, do not extend it. The multi-human collaboration substrate (hosted worker,
auth, admin) is FROZEN per bundle doc `docs/core` — deployed, dormant, and not a build target
without an explicit human decision.

### 5. Local-first, standards-clean

Local-first: everything works with the network off. No bundled secret; credentials (if
any) live in `~/.agentstate/` with 0600/0700 discipline and are never printed. Stay
standards-clean (plain OKF markdown; no bespoke schema). Link form is **relative
bundle-relative**.

## Working here

- Build/verify gate: `npm run build` and `npm run typecheck` must exit 0, and `npm test`
  (`--workspaces --if-present`: core + cli + server + viewer + worker + ui suites) must pass, before
  shipping. `npm run check` runs all of that plus this repo's own `scripts/` tests (`test:scripts`)
  and the npm-target SKILL.md drift gate (`check:skill`) in one shot. The plugin-bundle drift gates
  (`check:skill:bundle`, `check:bundle` — the ~650KB committed artifact and the skill-target
  SKILL.md) are BOT-OWNED on merge to main (see the plugin version + bundle bullet below) and are
  deliberately NOT part of this PR-side gate; a branch that only touches CLI source is not expected
  to carry a current rebuild of either. Run them by hand via `npm run check:plugin-bundle` if you
  want to eyeball drift before the bot does.
  **Always build from the REPO ROOT** — a package-scoped build leaves sibling `dist/`s stale and
  test files that import them crash confusingly. `npm run build` bundles the CLI to
  `packages/cli/dist/agentstate-lite.mjs` (esbuild). Smoke-test the built CLI
  (`node packages/cli/dist/agentstate-lite.mjs …`) — at minimum `init`, `doc write`/`doc read`,
  `list`, `link add`/`show`, and `view` on `examples/sample-bundle` (expect 4 nodes / 7 edges). To
  verify publishability, `npm pack -w agentstate-lite` and run the tarball's bin in a temp dir
  outside the monorepo (its `node_modules` must contain ONLY `agentstate-lite`).
- **Verify a gate by its own exit code, never through a pipe.** A piped tail or grep (`npm test |
  tail`, `... | grep -v Skip`) reports the PIPE's last command's exit status, not the gate's — a
  failing gate can read as green. Run gates unpiped, or redirect to a file and grep the file
  separately; check the exit code from the LAST change made, never a stale run from before it.
- A fresh git worktree has no node_modules: run `npm ci` inside it before trusting any
  test or drift-gate result (up-tree module resolution manufactures phantom failures).
- `examples/sample-bundle` is the interop fixture: externally-shaped (unquoted timestamps,
  relative links, wrapped bullets). If a change breaks its round-trip, the change is wrong.
- **Plugin version + committed bundle are BOT-OWNED on merge to main — PRs never touch them
  (2026-07-09, retiring the old hand-bump-and-rebase convention).** A CI workflow
  (`.github/workflows/ci-version-bundle.yml`, logic in `scripts/ci-version-bundle.mjs`) runs on
  every push to `main`: it regenerates the skill-target `SKILL.md` and rebuilds the committed
  `plugins/…/scripts/agentstate-lite.mjs`; only if either differs from what's committed does it
  bump the patch version in BOTH `.claude-plugin/marketplace.json` and
  `plugins/agentstate-lite/.codex-plugin/plugin.json` and commit artifact+manifests together in
  ONE bot commit (the plugin cache is version-keyed, so they must land atomically). If nothing
  changed, the run is a no-op — that convergence, not a paths filter or actor check, is what stops
  the bot's own commit from re-triggering an infinite loop. **A PR must NOT hand-bump either
  manifest or hand-rebuild the committed bundle** — parallel branches no longer collide on the next
  version number, because they no longer touch it at all; the bot picks it up once, on merge. The
  bot's regen-and-diff only covers the two GENERATED artifacts (the skill-target SKILL.md, the
  compiled bundle) — a hand-edit to NON-generated plugin content (the bash shim
  `plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite`, or a manifest field
  other than `version`) has nothing for the bot to regenerate against and will go unnoticed, so it
  still needs a manual version bump in the SAME PR.
- **Branch from CURRENT `origin/main`, never from a previous PR's tip.** The npm-target
  `packages/cli/SKILL.md` (`check:skill`) is still generated from `reference.ts` and PR-verified, so
  a branch cut from a stale tip can carry a stale version of it relative to current main. More
  generally, regenerated prose can go semantically stale without any drift gate catching it — a
  change can make a sentence FALSE without any generator noticing. After any merge into a branch,
  re-read the regenerated prose near your change and check the front-door docs (README quickstart)
  still tell the truth.
- Commit cadence: one commit per reviewed unit of work, with a descriptive message; push to
  the public remote (github.com/Holaxis-ai/agentstate-lite) after each committed unit. The
  pre-public development history lives on the local `archive/pre-public` branch — NEVER push
  it (it predates the open-source scrub).
- **Every unit ships Builder → independent Reviewer → QA — never Build → QA.** Subagent code
  review is a required gate before QA and before any merge, even when the orchestrator applied
  the changes directly. Review-process conventions:
  - Agents that touch git or run tests work in an ISOLATED worktree/checkout, never the
    shared working tree; reviewers detach onto the exact sha under review.
  - A risky mechanic and the test that makes it safe ship in the SAME reviewed unit —
    a gate must own the risk it guards.
  - A review claiming it "executed" a documented command chain means character-for-character
    with the emitted artifacts — no reasonable substitutions; pin such chains with tests that
    literally run the emitted strings.
  - Reviewers verify empirically where feasible (built artifact, scratch environments),
    label each finding empirical vs reasoned, and report survived attacks alongside
    findings so an APPROVE is calibrated.
- **Security disclosure:** a defect that is (a) exploitable by someone other than the
  victim AND (b) present on main goes through a private GitHub Security Advisory —
  fix privately, merge, then disclose — never a public PR comment or board doc.
  Because the marketplace channel tracks this repo, "released" means "merged to main".
  Pre-merge review findings stay public by default. The board is public: the
  write-time scrub discipline covers vulnerability details, not just secrets.
- **Records live on the PROJECT BUNDLE (the in-repo board at `.agentstate-lite/`) — the
  product tracks its own build.** Unit-close means: update `tasks/<unit>` (bare
  `doc update tasks/<unit> --status …`, with the description carrying the record — what shipped, commit hash,
  honest caveats) and, when the shipped list or sequence changed, the bundle's `roadmap`
  doc. Plans are authored as bundle docs (`plans/<unit>`, `type: Plan`); research as
  `research/<topic>` (`type: Research`). Byte-channel moves (files ↔ bundle) go through
  `promote`/`pull`, never model retyping. Stale records have real cost here (a session once
  nearly rebuilt a shipped unit), so: BEFORE building any "queued" item, grep the tree —
  records may lag the code. Work is CLAIMED before it is built: flip `tasks/<unit>` to
  `in_progress` with `--actor` — the CAS write IS the claim (see the bundle's Task convention).
  **Board writes are not code commits.** Board/bundle writes (records, claims, context
  notes, task updates — anything under `.agentstate-lite/` with no code alongside) go through
  `aslite sync`, which shares them on the repo's own `board` branch. The board was MIGRATED off
  `main` (it is gitignored there now), so there is no longer a `board:`-prefixed direct-commit-to-main
  path — `sync` is the one channel, and it touches nothing outside the board. Code ships via branch +
  PR + review gates, always. A board doc rides a PR only when it is ITSELF the reviewed
  deliverable (a plan under vetting, records that explain a code change they accompany).

## Scope

**This section states what EXISTS and what is GATED — the authoritative, per-unit current-state
record is the PROJECT BUNDLE (board task descriptions + the `roadmap` doc; the frozen pre-shrink
changelog is bundle doc `archive/status`), and the forward sequence is `roadmap` plus
bundle doc `docs/north-star`. Do not grow a second changelog here: an earlier revision of this section
accreted per-unit history, fell out of sync with the moving tree, and became the most-misleading
file in the repo (a coherence audit's top finding). Keep it SHORT and re-verify claims against
the code when touching it.**

What exists, end to end (each verified in production or by the full suite — per-unit records on
the bundle):

- **Stage 1 CLOSED, Stage-2 auth CLOSED.** The wire protocol (v0.1: docs + reserved files +
  blobs + delete + push-down list) is implemented by the reference server (`packages/server`,
  loopback/no-auth by design) AND deployed to production: the Cloudflare Worker + D1 + R2
  (`packages/worker`, a PRIVATE deployment package, never bundled into the CLI; `D1R2Backend`
  with ENFORCED cross-process CAS) behind a minted-API-key gate with users/invites/memberships/
  roles (`IdentityVerifier` seam). The production deployment is live, out of auth-bootstrap
  (a real admin member exists), and serves the team's own work bundle (tasks/roadmap docs).
- **Four backends, one contract:** Filesystem (degenerate; same-process CAS serialized,
  cross-process best-effort — NOT safe under multi-writer contention across processes),
  Memory (enforced), Remote (wire client, typed `RemoteError` with server-derived codes),
  D1R2 (enforced, production). Quad parity tests pin byte-identical version tokens.
- **`--remote <url>` on every bundle command** (or `AGENTSTATE_LITE_REMOTE`); `serve` boots the
  reference server locally; `promote`/`pull`/`blobs`/`delete` are the byte channel. Known
  divergence (recorded in `docs/WIRE-PROTOCOL.md` open questions): a concept doc's RAW bytes
  don't cross the wire — `doc read --out --remote` re-serializes via `stringifyDoc` (canonical
  form; byte-identical only for engine-written docs).
- **Kinds + recipes:** kind conventions (gate 3) with two built-in recipes (`context-notes` —
  init's default — and `work-tracking`, the Task kind the team's own board runs on) over one
  pluggable `RecipeSource` pipeline.
- **Scans are cheap end to end:** `list`/`query` ride head projections (`queryHeads`) — no
  bodies over the wire, no per-doc R2 reads on the Worker (D1 `frontmatter` head column).
- **The local `ui` command** (gate 4): the SPA-over-loopback vertical slice is shipped and
  working in both modes; views paused by human verdict (`tasks/ui-v1`). The bundle now also
  holds the project's own plans/research/changelog-archive docs — the records convention above.
- **The `sync` verb (git tier)** — shares a project's board over a `board` branch on the
  repo's own remote: self-healing provisioning (sync is the SETUP verb on a fresh clone of a
  board-sharing project), commit/pull/push touching nothing outside the board, CONVERGING
  conflict resolution (teammate's version kept, yours exported to a file; reconcile via
  `doc update`, exit 5), `--show-incoming <id>` viewer, `--pull-only`, cursor + awareness
  cache (`cli/src/git.ts`, `cursor.ts`, `commands/sync.ts` — command layer only; core never
  learns git exists), and the SessionStart integration (U4): `session-start` — ONE hook
  subcommand doing a time-boxed (≤7s) best-effort pull then the home render in-process, with
  the board-awareness block ("since this machine last synced" attributed per actor,
  self-authored rows filtered, unpushed/uncommitted backstop, probe-gated "run sync — never
  init" first contact), wired by `hook install` across Claude Code/Codex/OpenCode
  (`commands/session-start.ts`, `commands/home.ts`'s board block, `commands/hook.ts`).
  The `sync --migrate` COMMAND (U5) was a TEMPORARY, founders-only flag — one-time
  and `--yes`-gated (preview-first; files-not-history board branch pushed with tracking; the
  folder-removal + gitignore commit prepared on a local `board-migration` branch for a
  human-opened PR; never any `git clean`), surfaced in `sync --help` only (never taught in
  the skill/reference channels). It has now been EXECUTED on this repo: the board lives on the
  `board` branch and is gitignored on `main`, so the bundle-write convention above (share via
  `aslite sync`) is the live path. The flag itself is SCHEDULED FOR REMOVAL in a follow-up PR
  now that the migration is done.

Standing gates on future work:

- **Deploys are human-gated**, and D1 migrations apply BEFORE `wrangler deploy` — the ordering
  is load-bearing (new code may reference new columns unconditionally; deploy-first has already
  been identified as a full-outage class).
- **Distribution is the in-repo marketplace/skill channel** — self-contained CLI + skill in one
  install, verified end-to-end from Claude Code and Codex; it ships the tool AND the knowledge of
  how to use it. npm is a PARKED parallel channel for plain-terminal audiences (keep `npm pack`
  verified standalone; the SKILL generator's dual-channel design stays); its wake condition is a
  real user asking for `npx` — do not surface it as a pending decision.
- **Multi-bundle partitioning + per-bundle key scoping + bundle-scoped authz** is its own
  future unit, designed and built TOGETHER (the Stage-2 review's adjudication) — do not build
  piecemeal, and do not build without an explicit decision. Same for the GitHub device-flow
  browser login, any admin/collaboration UI, and everything on bundle doc `docs/core`'s FROZEN list —
  CORE.md is the standing scope arbiter.
