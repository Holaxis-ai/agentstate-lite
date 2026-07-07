---
type: Plan
title: Binding plan — package the agentstate-lite CLI as a self-contained skill
timestamp: '2026-07-06T16:48:30.233Z'
---
# Binding plan — package the agentstate-lite CLI as a self-contained skill

Goal: ship the existing `agentstate-lite` CLI *inside a Claude Code skill* so a single
`npx skills add <owner>/agentstate-lite` delivers a ready-to-run, agent-facing tool — no
`npm install`, no `node_modules`, no npm publish. "The repo is the skill." The existing
npm-first channel (`packages/cli`, published `agentstate-lite`, its `npx -y agentstate-lite`
SKILL.md) stays fully intact and publishable. **Additive only** — no source-behavior change to
any command.

Grounding facts verified in this repo (do not re-litigate):
- The CLI already bundles to a single zero-dep ESM file `packages/cli/dist/agentstate-lite.mjs`
  (~409 KB) via `packages/cli/build.mjs` (esbuild, `platform:node target:node20`, workspace deps
  aliased to source, `createRequire` banner, `chmod 0o755`). It runs `--help` standalone from a
  clean dir with **no `node_modules`** (the one `require("esprima")` is a guarded js-yaml optional
  path, never hit on normal use). `dist/` is **gitignored** (root `.gitignore` line `dist/`).
- `packages/cli/src/reference.ts` is the SINGLE SOURCE OF TRUTH: `DESCRIPTION` + `COMMAND_GROUPS`
  (+ pure projectors `commandReference`, `kindsPointer`, `remoteEnvPointer`). `--help`, the home
  view (`src/commands/home.ts`), and the generated SKILL.md all derive from it.
- `packages/cli/scripts/gen-skill.mjs` already generates `packages/cli/SKILL.md` from
  `reference.ts` (esbuild-in-memory → `data:` import) with an `npx -y agentstate-lite` prefix, and
  has a `--check` drift mode wired as `npm run check:skill -w agentstate-lite`, folded into the
  root `npm run check`.
- `src/invocation.ts`: `cliInvocation()` = bare bin name if on PATH else `npx -y agentstate-lite`;
  `hookCommand()` = bare bin if on PATH else **the absolute realpath of the running executable**
  else pkg name; `binPath()` = home-collapsed absolute exe path.
- `hook install` (`src/commands/hook.ts`) writes REAL SessionStart hooks for Claude Code / Codex /
  OpenCode via `axi-sdk-js installSessionStartHooks` with `shouldInstall: () => true` (forced), and
  the portable command it registers is `hookCommand()` (absolute exe path when off PATH).
- **The bundle build is deterministic**: two builds of identical source are byte-identical; there
  is **no** embedded `git describe`/version/timestamp literal (`build.mjs` does no version stamp;
  no `0.1.0` or `version:` literal appears in the output). => the drift gate is a plain byte
  compare; **gotcha #4 (version-literal normalization) does NOT apply today** (keep a guard note in
  case stamping is ever added).

---

## 1. Skill directory location — CONFIRMED

`<repo>/skills/agentstate-lite/` at repo root
("the repo is the skill"). Rationale:
- `npx skills add` installs a repo's `skills/<name>/` directory (the same shape the reference
  skill and the `axi`/`axi-skills` skills already installed on this machine use).
- Repo-root `skills/…` is **not** under any `dist/` path, so it is **not** gitignored and its
  committed `.mjs` is tracked normally.
- It is **not** part of the npm package: `packages/cli/package.json` has `files: ["dist"]`, so
  `npm pack -w agentstate-lite` never sees `skills/`. Clean channel separation.

Final layout:
```
skills/agentstate-lite/
  SKILL.md                        # generated (skill variant: resolver prefix + preamble)
  scripts/
    agentstate-lite               # bash shim (chmod 755) — the documented invocation
    agentstate-lite.mjs           # COMMITTED self-contained bundle (chmod 755, linguist-generated)
```
Shim + bundle basenames = the primary bin name `agentstate-lite` (matches `BIN_NAMES[0]` and the
resolver's `command -v agentstate-lite`). No `VERSION` file is required for the `npx skills add`
channel (that reference-skill file is a marketplace/plugin artifact, out of scope here — see §9).

---

## 2. Files to CREATE

### 2a. `skills/agentstate-lite/scripts/agentstate-lite` (bash shim, committed chmod 755)
Model exactly on the reference skill's `agentstate` shim: resolve own dir, Node>=20 floor guard,
`exec node <own-dir>/agentstate-lite.mjs "$@"`. Verbatim target:
```bash
#!/usr/bin/env bash
# Shim for the self-contained agentstate-lite CLI bundle. Resolves its own directory (works from any
# cwd / however invoked) and runs the committed .mjs under node. Node>=20 floor guard: the bundle
# targets node20; a bare `exec node` would give a node-18/no-node user a cryptic crash.
ver="$(node -v 2>/dev/null)"; major="${ver#v}"; major="${major%%.*}"
case "$major" in ''|*[!0-9]*) echo "agentstate-lite requires Node >= 20 (found ${ver:-none})" >&2; exit 1;; esac
if [ "$major" -lt 20 ]; then echo "agentstate-lite requires Node >= 20 (found ${ver:-none})" >&2; exit 1; fi
exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/agentstate-lite.mjs" "$@"
```
Because `Write` does not set +x (gotcha #3), the build step (or a committed `chmod`) MUST mark it
`755` and it MUST be committed executable.

### 2b. `skills/agentstate-lite/scripts/agentstate-lite.mjs` (committed bundle, chmod 755)
The byte output of the existing esbuild build, copied here and committed. Produced/refreshed by the
new build step (§3a), never hand-edited. Marked `linguist-generated` (§2d) and chmod 755.

### 2c. `skills/agentstate-lite/SKILL.md` (generated — skill variant)
Generated from `reference.ts` by the extended generator (§3b). Differs from the npm SKILL.md in
exactly two ways: (1) a **resolver preamble** (§4) instead of the "standalone npm package / `npx -y`"
paragraph, and (2) every command example is prefixed with `"$ASLITE" …` instead of
`npx -y agentstate-lite …`. The `## Commands` region is the SAME projection of `COMMAND_GROUPS`, so
it cannot drift from the implementation.

### 2d. `<repo>/.gitattributes` (new file)
```
skills/agentstate-lite/scripts/agentstate-lite.mjs linguist-generated=true
```
(gotcha #5 — collapses the 400 KB generated blob in diffs.)

---

## 3. Files to MODIFY

### 3a. `packages/cli/build.mjs` — ALSO emit + install the skill bundle
Keep the existing `dist/agentstate-lite.mjs` output byte-identical (npm channel unchanged). After
the existing `chmod(outfile, 0o755)`, ADD a step that copies the freshly built bundle to
`../../skills/agentstate-lite/scripts/agentstate-lite.mjs` and `chmod`s **both** that `.mjs` and the
shim `../../skills/agentstate-lite/scripts/agentstate-lite` to `0o755` (gotcha #3). Guard the copy
so it is skipped gracefully if the skill dir does not yet exist is unnecessary — the dir is
committed, so just `mkdir -p` its `scripts/` then copy. This makes `npm run build` keep the
committed skill bundle in sync as a side effect.

Alternative (equally acceptable): a dedicated `packages/cli/scripts/build-skill-bundle.mjs` that
imports/duplicates the esbuild config, writes straight to the skill path, chmods both files, and
supports `--check` (§6). Prefer folding into `build.mjs` for ONE esbuild config (no second bundler
config to drift); put the **`--check`** logic in the generator/gate script (§6), not in `build.mjs`.

### 3b. `packages/cli/scripts/gen-skill.mjs` — add a skill-variant target
Parameterize the existing generator so it emits BOTH SKILL.md files from the one `render` core
(single source of truth preserved). Concretely, add a `--target npm|skill` flag (default `npm` =
today's behavior, writes/`--check`s `../SKILL.md`, `npx -y` prefix). `--target skill`:
- writes/`--check`s `../../skills/agentstate-lite/SKILL.md`,
- swaps the front-matter/intro paragraph for the resolver preamble (§4),
- replaces the per-command prefix `npx -y agentstate-lite` with `"$ASLITE"`,
- swaps the `kinds`/typical-flow example prefixes to `"$ASLITE"` as well.
Keep the `## Commands` loop over `COMMAND_GROUPS` identical between targets (only the prefix
string differs — factor it to a `PREFIX` variable). Both targets keep the existing `--check`
stale-exit-1 behavior.

### 3c. `packages/cli/package.json` — scripts
Add:
```jsonc
"gen:skill:bundle": "node scripts/gen-skill.mjs --target skill",
"check:skill:bundle": "node scripts/gen-skill.mjs --target skill --check",
"build:skill": "node build.mjs && node scripts/gen-skill.mjs --target skill",
"check:bundle": "node scripts/check-skill-bundle.mjs"   // the .mjs byte-drift gate, §6
```
(Existing `build`, `gen:skill`, `check:skill` stay. `build` already emits the skill `.mjs` via 3a;
`build:skill` additionally regenerates the skill SKILL.md.)

### 3d. root `package.json` — fold the two new gates into `npm run check`
Change:
```
"check": "npm run build && npm run typecheck && npm test --workspaces --if-present && npm run check:skill -w agentstate-lite"
```
to also run `check:skill:bundle` (SKILL.md-skill drift) and `check:bundle` (committed-`.mjs`-vs-
source drift), e.g. append `&& npm run check:skill:bundle -w agentstate-lite && npm run check:bundle -w agentstate-lite`.
(Root `npm run build` runs first, so the committed `.mjs` is fresh before `check:bundle` compares.)

### 3e. NEW `packages/cli/scripts/check-skill-bundle.mjs` — the `.mjs` byte-drift gate (§6)
(Listed under CREATE-adjacent-to-cli; it is a modification of the check surface.)

No change to `reference.ts`, `invocation.ts`, `cli.ts`, `home.ts`, `hook.ts`, or any command
handler is required. (One OPTIONAL runtime refinement is discussed in §5.)

---

## 4. How the skill's SKILL.md invokes the CLI — the resolver

The committed bundle is **NOT on PATH** and lives inside a version/host-specific install dir, so a
bare `agentstate-lite` or a relative `scripts/agentstate-lite` does not resolve from an arbitrary
cwd (gotcha: "the bundle is not on PATH"). The shim (§2a) already makes the bundle location-
independent *once you have its absolute path*; the SKILL.md's job is to give the agent a one-line
resolver that finds that absolute path. Mirror the reference skill's `command -v … || ls -d <glob>
… | sort -V | tail -1` pattern, targeting BOTH install channels:

```bash
# Resolve the CLI once per shell, then use "$ASLITE" for every command.
ASLITE="$(command -v agentstate-lite 2>/dev/null || ls -d \
  "$HOME"/.claude/skills/agentstate-lite/scripts/agentstate-lite \
  "$HOME"/.claude/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite/scripts/agentstate-lite \
  2>/dev/null | sort -V | tail -1)"
"$ASLITE" --help
```
- `command -v` short-circuits if a future install ever puts the bin on PATH.
- First glob = the `npx skills add` location (`~/.claude/skills/agentstate-lite/…`, confirmed on
  this machine as where `axi`/`axi-skills` landed).
- Second glob = the plugin/marketplace cache channel (if the skill is ever shipped that way);
  `sort -V | tail -1` picks the highest installed version.
- Optional note (as the reference does): if the harness exports `$CLAUDE_PLUGIN_ROOT`, then
  `"$CLAUDE_PLUGIN_ROOT/skills/agentstate-lite/scripts/agentstate-lite"` also works, but it is
  often unset — prefer the resolver.

Every command block in the skill SKILL.md then reads `"$ASLITE" init`, `"$ASLITE" note write …`,
etc. Resolve to the **shim** (not the raw `.mjs`) so the Node>=20 guard applies.

**Runtime-hint caveat (state it in SKILL.md).** The CLI's own emitted follow-up hints (`--help`,
home view, `help:` fields) are produced by `cliInvocation()`, which — when the executable is off
PATH — prints the `npx -y agentstate-lite …` form. Inside the skill that prefix is a fetch-from-npm
form the agent should NOT use. Add one sentence, mirroring the reference skill: *"The CLI's own
output may print follow-ups beginning with `npx -y agentstate-lite …`; ignore that prefix and run
the subcommand via `\"$ASLITE\" …`."* (See §5 for the optional source fix that removes this caveat.)

---

## 5. Preserving `--remote` / `serve` / `join` / `invite` / `whoami` / `key` / `member`

**It is the SAME binary — the entire remote + auth surface works unchanged.** The skill ships the
identical esbuild output that the npm package ships; `--remote <url>` on `note`/`doc`/`list`/`link`/
`view`/`status`, plus `serve`, `login`, `join`, `whoami`, `invite`, `member`, `key`, and the
`AGENTSTATE_LITE_REMOTE` env default, are all in `COMMAND_GROUPS` and in the bundle. There is no
per-channel code path, so "it just works." Credentials still live in `~/.agentstate/` (0600) exactly
as before — unaffected by how the bin is delivered.

**Required verification (not just an assertion) — see acceptance (b):** the implementer MUST prove a
`--remote` command actually routes through the *skill-invoked* bundle. Cheapest robust proof on one
machine: boot the reference server from the skill bin and drive a real remote round-trip —
```bash
"$ASLITE" serve --dir /tmp/asl-bundle --port 8787 &   # or a tmp bundle from "$ASLITE" init
"$ASLITE" list --remote http://127.0.0.1:8787         # must return a TOON list over HTTP
```
or, if standing up a server is undesirable, a negative proof that the flag is wired end-to-end:
`"$ASLITE" list --remote http://127.0.0.1:1  →` a structured RemoteBackend transport-error envelope
(exit non-zero) rather than a "reading local bundle" result — proving the arg reached
`RemoteBackend`, through the skill bin.

**OPTIONAL source refinement (removes the §4 runtime-hint caveat; still additive, npm channel
safe).** In `src/invocation.ts`, make `cliInvocation()` return the running executable's absolute
path when it detects it is running as the committed skill bundle (i.e. the resolved exe basename is
`agentstate-lite.mjs` AND it is NOT under a `dist/` segment — the npm bin lives at
`dist/agentstate-lite.mjs`, the skill bundle at `skills/agentstate-lite/scripts/agentstate-lite.mjs`).
That way runtime hints in the skill print a directly-runnable absolute path instead of `npx -y …`,
and the npm-published bundle (path ends in `dist/agentstate-lite.mjs`) is byte-for-byte unchanged.
This is a nicety, not a blocker — ship §4's one-sentence caveat first; do the refinement only if
review wants clean runtime hints. (Note `hookCommand()` ALREADY does the right thing for the skill:
off PATH it returns the absolute exe realpath — the committed `.mjs` — which is directly runnable via
its shebang + chmod 755, so an installed SessionStart hook points at the real committed bundle with
no change.)

---

## 6. Drift gate — committed skill bundle matches current source

Two independent drifts, two `--check`s (both folded into root `npm run check`, §3d):

1. **SKILL.md-skill drift** — `node scripts/gen-skill.mjs --target skill --check` re-renders the
   skill SKILL.md from `reference.ts` in memory and exits 1 if the committed file differs. Reuses
   the existing generator's proven `--check` path. (The npm SKILL.md keeps its own existing
   `check:skill`.)

2. **Committed-`.mjs`-vs-source drift** — NEW `packages/cli/scripts/check-skill-bundle.mjs`:
   rebuild the bundle in memory / to a scratch temp with the SAME esbuild config `build.mjs` uses
   (import the shared config, or run `build.mjs` to a temp outfile), then **byte-compare** against
   `skills/agentstate-lite/scripts/agentstate-lite.mjs`; exit 1 with "skill bundle is stale — run
   `npm run build`" on mismatch. Because the build is **deterministic and carries no version/
   timestamp literal** (verified), a straight `cmp`/`Buffer.equals` is correct and stable — **no
   version normalization needed** (gotcha #4 is a no-op here).
   - GUARD NOTE for the implementer: if anyone later adds `git describe`/version stamping to
     `build.mjs`, this gate MUST switch to normalizing that literal out of BOTH sides before
     comparing (gotcha #4). Leave a comment saying so.
   - Prove the gate BITES: after wiring, temporarily edit a `reference.ts` summary string, run
     `check:bundle` WITHOUT rebuilding → it must exit 1; rebuild → it must pass. (Acceptance c.)

Keep the gates in `packages/cli` (co-located with the source they guard); the root `check` already
delegates to `-w agentstate-lite`, so this matches the existing pattern — no root `scripts/` dir is
introduced.

---

## 7. chmod + .gitattributes (gotchas #3, #5)

- Both `skills/agentstate-lite/scripts/agentstate-lite` (shim) and
  `skills/agentstate-lite/scripts/agentstate-lite.mjs` (bundle) MUST be committed mode `755`.
  `Write`/`Edit` do not set +x, and `build.mjs`'s copy step must `chmod 0o755` both. Verify with
  `git ls-files -s skills/agentstate-lite/scripts` → mode `100755` for both before committing.
- `.gitattributes` at repo root marks the `.mjs` `linguist-generated=true` (§2d).

---

## 8. Coexistence — both channels survive

- npm channel UNTOUCHED: `packages/cli/build.mjs` still writes `dist/agentstate-lite.mjs`
  byte-identically; `packages/cli/SKILL.md` still generated with the `npx -y` prefix
  (`gen:skill` default target); `files: ["dist"]` still packs clean; `bin` unchanged. The skill
  copy is a pure additive side output.
- skill channel is a SEPARATE generated artifact (`skills/agentstate-lite/SKILL.md`, resolver
  prefix) — it does **not** replace the npm SKILL.md. Two SKILL.md files, one `reference.ts`.
- Verify BOTH: `npm run check` green (all gates) AND `npm pack -w agentstate-lite` produces a
  tarball whose `node_modules` (when installed in a temp dir outside the monorepo) contains ONLY
  `agentstate-lite` — i.e. nothing about the skill leaked into the package.

---

## 9. NON-GOALS (do NOT do these — human-gated)

- No marketplace registration, no `marketplace.json`/`known_marketplaces.json` edits, no plugin
  `VERSION` file for a marketplace channel.
- No `git push`, no remote, no PR, no `npm publish`. Commit locally only if/when asked (the repo's
  cadence is human-gated; this pass may be left uncommitted for review).
- No Cloudflare/Worker/D1/R2 code, no auth-mechanic changes, no wire-protocol change (repo-wide
  standing constraint; this work is packaging only).
- No change to any command's runtime behavior beyond the OPTIONAL, path-keyed `cliInvocation()`
  refinement in §5 (which itself leaves the npm bundle byte-identical).

---

## 10. Acceptance checklist (implementer + reviewer verify each)

- **(a) Standalone run, no `node_modules`.** From a clean shell in a dir with no `node_modules`:
  `node skills/agentstate-lite/scripts/agentstate-lite.mjs --help` exits 0 and prints the command
  reference; `skills/agentstate-lite/scripts/agentstate-lite --help` (the shim) does too. (Already
  demonstrated for the dist bundle; must hold for the committed skill copy.)
- **(b) `--remote` routes through the skill bin.** Either a real `serve` + `list --remote` round-
  trip via `"$ASLITE"`, or a `--remote http://127.0.0.1:1` transport-error envelope — proving the
  flag reaches `RemoteBackend` through the skill-invoked bundle (§5).
- **(c) Drift gate is real.** `npm run check:bundle -w agentstate-lite` and
  `check:skill:bundle` pass on a fresh build; each FAILS (exit 1) after a `reference.ts`/source edit
  made without rebuild, and passes again after `npm run build` / `build:skill`.
- **(d) Executable + linguist-marked.** `git ls-files -s skills/agentstate-lite/scripts` shows mode
  `100755` for both shim and `.mjs`; `.gitattributes` marks the `.mjs` `linguist-generated`.
- **(e) npm channel intact.** `npm run check` green; `npm pack -w agentstate-lite` then install the
  tarball in a temp dir outside the monorepo — its `node_modules` contains ONLY `agentstate-lite`;
  `dist/agentstate-lite.mjs` byte-identical to pre-change (no accidental build drift);
  `packages/cli/SKILL.md` still `npx -y`-prefixed.
- **(f) Skill SKILL.md is generated from `reference.ts`.** `skills/agentstate-lite/SKILL.md`'s
  `## Commands` region matches the `COMMAND_GROUPS` projection (resolver prefix), and
  `gen-skill.mjs --target skill --check` passes — no hand-drift.

---

## 11. Ordered implementation steps

1. Create `skills/agentstate-lite/scripts/agentstate-lite` (shim, §2a); `chmod 755`.
2. Extend `build.mjs` (§3a) to copy the built bundle to
   `skills/agentstate-lite/scripts/agentstate-lite.mjs` and `chmod 755` both scripts. Run
   `npm run build` → the committed `.mjs` appears.
3. Extend `gen-skill.mjs` with `--target npm|skill` (§3b); run `--target skill` → creates
   `skills/agentstate-lite/SKILL.md` (resolver preamble + `"$ASLITE"` prefixes + runtime-hint
   caveat, §4).
4. Add `packages/cli/scripts/check-skill-bundle.mjs` byte-drift gate (§6).
5. Add the four `packages/cli/package.json` scripts (§3c) and extend root `check` (§3d).
6. Add `.gitattributes` linguist line (§2d).
7. (Optional) `src/invocation.ts` path-keyed `cliInvocation()` refinement (§5) — only if review
   wants clean runtime hints; keep npm bundle byte-identical.
8. Run the full acceptance checklist (§10). Leave uncommitted (or commit locally only) per §9.
