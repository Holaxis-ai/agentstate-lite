---
name: agentstate-lite
description: >-
  Read and write a local OKF knowledge bundle (agent context notes, docs, cross-links, and a
  self-contained static-HTML view) via the self-contained agentstate-lite CLI bundled in this
  skill (scripts/agentstate-lite — a committed, zero-dependency bundle; no npm install
  required). Use when an agent needs to persist a context note across sessions, store a
  decision/spec as a doc, link concepts, query a bundle, share the project's board with
  teammates (`sync`), run a local wire-protocol server (`serve` / `--remote`), or bake a
  shareable HTML view.
---

# agentstate-lite

read and write a local OKF knowledge bundle (context notes, docs, cross-links, static-HTML view).

This skill bundles a **self-contained** `agentstate-lite` CLI at `scripts/agentstate-lite` (a
committed, zero-dependency `.mjs` esbuild bundle, run through a small bash shim). It runs under
plain `node >= 20` — there is **no install step, no `npm install`, and no `node_modules`**. This
is a SEPARATE distribution channel from the published npm package (`npx -y agentstate-lite`);
both wrap the identical CLI source, so behavior and output are identical.

## Invocation — it is NOT on PATH

The bundle is **not** on your `PATH`, and it does **not** live at a fixed path — the bundle may
ship inside a version-keyed plugin cache, so a bare `scripts/agentstate-lite` does **not**
resolve from an arbitrary cwd. Resolve its absolute path once, with this one-line resolver, then
use `"$ASLITE"` in every command:

```bash
ASLITE="$(command -v agentstate-lite 2>/dev/null || ls -d \
  "$HOME"/.claude/skills/agentstate-lite/scripts/agentstate-lite \
  "$HOME"/.claude/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite/scripts/agentstate-lite \
  2>/dev/null | sort -V | tail -1)"
"$ASLITE" --help
```

`command -v` short-circuits if a future install ever puts `agentstate-lite` on `PATH`; otherwise
the glob checks both a direct skill install (`~/.claude/skills/…`) and a plugin-marketplace
cache install (`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/agentstate-lite/scripts/…` — the cache copies the PLUGIN DIR's contents, so there is no `plugins/` segment), and
`sort -V | tail -1` selects the highest installed version. This works from any cwd. Resolve to
the **shim** (not the `.mjs` directly) so the Node >= 20 floor guard runs first.

> If your harness happens to export `${CLAUDE_PLUGIN_ROOT}` you may instead use
> `"$CLAUDE_PLUGIN_ROOT/skills/agentstate-lite/scripts/agentstate-lite"`, but it is **often unset**
> in an agent shell — do not rely on it; prefer the resolver above.

**Runtime-hint note.** Every follow-up command the CLI itself prints (`help:` fields, error
hints) uses its own resolved invocation. Off `PATH`, running the skill bundle now prints its own
resolved absolute path there — directly runnable as printed, no substitution needed. If a bare
`agentstate-lite` or an `npx -y agentstate-lite …` prefix ever shows up instead (e.g. a
different install answered the `PATH` probe), swap that leading token for `"$ASLITE"` and run
the rest of the line unchanged.

<!-- GENERATED from src/reference.ts by scripts/gen-skill.mjs --target skill — do not edit by hand. -->

## Commands

### Bundle

- `"$ASLITE" init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]`
  — Create (or open) an OKF knowledge bundle in a directory — greenfield setup; a project that already shares a board is set up by sync, not init
- `"$ASLITE" view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]`
  — Bake the bundle into one self-contained static HTML file
- `"$ASLITE" status [--limit <n>] [--remote <url>]`
  — Read-only bundle health report (kind lint, unresolved links, orphans, staleness, graph lints)

### Documents & links

- `"$ASLITE" doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [--actor <n>] [--remote <url>]`
  — Write a generic OKF concept document
- `"$ASLITE" doc update <id> [--<field> <value> ...] [--title <t>] [--tag <t>] [--type <t>] [--body <s> | --body-file <p>] [--expected-version <v>] [--actor <n>] [--remote <url>]`
  — Patch given fields (incl. kind-declared fields like --status) of an existing doc, preserving the rest; optimistic-CAS with --expected-version
- `"$ASLITE" doc read <id> [--out (<path> | -) | --field <name>] [--remote <url>]`
  — Read a doc (or pull its raw markdown bytes to disk, or print one raw field for scripting)
- `"$ASLITE" doc history <id> [--remote <url>]`
  — Show a doc's attributed version history (newest first) — the tokens for --expected-version
- `"$ASLITE" doc delete <id> [--expected-version <v>] [--remote <url>]`
  — Hard-delete a doc (idempotent: absent -> deleted:false, exit 0)
- `"$ASLITE" list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--open] [--limit <n>] [--remote <url>]`
  — Query concepts over their frontmatter (alias: query) — a comma in --field's value is set membership (OR); --open excludes terminal instances (declared kinds only)
- `"$ASLITE" link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>] | list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]) [--remote <url>]`
  — Add a cross-link, show a concept's links + backlinks, or query the whole bundle's derived edge list filtered by from/to (id or prefix/, repeatable/union) and exact-match text

### Artifacts

- `"$ASLITE" promote <file> --doc-key <key> [--content-type <mime>] [--expected-version <v>] [--remote <url>]`
  — Move a local file's bytes into the store (a .md key routes through the engine; else a blob)
- `"$ASLITE" pull --doc-key <key> --out (<path> | -) [--remote <url>]`
  — Pull a doc's canonical form or a blob's raw bytes out of the store (the reverse of promote)
- `"$ASLITE" blobs [--prefix <p>] [--limit <n>] [--remote <url>]`
  — List the store's blob (non-document) keys (documents are listed by 'list'/'query')
- `"$ASLITE" delete --doc-key <key> [--expected-version <v>] [--remote <url>]`
  — Hard-delete a doc or blob by key (idempotent: absent -> deleted:false, exit 0)

### Kinds

- `"$ASLITE" new "<Kind>" <id> --<field> <value> [...] [--link "<type>=<target-id>" ...] [--no-prefix] [--actor <n>] [--remote <url>]`
  — Create a new instance of a bundle-declared kind — e.g. new "Context Note" <id> for a note (validates strictly); repeatable --link wires typed cross-links in the same step
- `"$ASLITE" kinds [--remote <url>]`
  — List the kind conventions this bundle declares (purpose, described fields, typed-link vocabulary, horizon)
- `"$ASLITE" kind field "<Kind>" (add <name> [--required] [--values <a,b,c>] | remove <name>) [--remote <url>]`
  — Edit a kind's schema — add/remove a declared field or enum value on its convention (idempotent)
- `"$ASLITE" recipes [--remote <url>]`
  — List built-in recipes and whether each is already applied to this bundle
- `"$ASLITE" recipe add <name-or-path> [--remote <url>]`
  — Apply a recipe's (built-in name or folder path) convention docs to the bundle (idempotent)

### Remote

- `"$ASLITE" serve [--dir <path>] [--host <h>] [--port <p>]`
  — Boot the reference wire-protocol server over a local bundle (loopback, no auth)
- `"$ASLITE" ui [--dir <path> | --remote <url>] [--port <p>] [--open]`
  — Boot the local web UI: a launcher for the bundle's pages (type: Page docs rendered in sandboxed iframes, with live updates) — same origin, loopback-only
- `"$ASLITE" sync [--establish | --pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]`
  — Share the board branch with a remote — commits, pulls, and pushes (git tier; --pull-only skips commit+push). `init` makes a LOCAL bundle; --establish is the separate, explicit act that starts sharing it (creates the board branch, pushes; never automatic). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch. Board-reading commands (list/doc read/status/home/link show) auto-run the ff-only pull when board state is >~5m stale — silent, bounded (~2s), never a push; AGENTSTATE_LITE_NO_AUTOPULL=<any value, even 0> disables it

### Identity

- `"$ASLITE" login --remote <url> --api-key <key>`
  — Store an API key for a gated --remote deployment (keyed by origin; join redeems an invite instead)
- `"$ASLITE" join --remote <url> --invite <token> [--display <name>]`
  — Redeem an invite token to join a remote bundle (stores the returned API key; never prints it)
- `"$ASLITE" whoami [--remote <url>]`
  — List the remote origins you hold a key for (offline), or (with --remote) the live remote identity + bundle memberships

### Invites & members (admin)

- `"$ASLITE" invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]`
  — Create a join invite for a remote bundle (prints the token once)
- `"$ASLITE" invite list --remote <url> [--fields <a,b|all>]`
  — List invites (minimal id/role/expires/status by default; --fields all for the full record)
- `"$ASLITE" invite revoke --remote <url> <invite_id>`
  — Revoke an invite (idempotent)
- `"$ASLITE" member list --remote <url>`
  — List a remote bundle's members and their roles
- `"$ASLITE" member set-role --remote <url> <user_id> <role>`
  — Change a member's role (idempotent)
- `"$ASLITE" member remove --remote <url> <user_id>`
  — Remove a member and revoke all their API keys (idempotent)

### API keys

- `"$ASLITE" key mint --remote <url> [--label <s>]`
  — Mint an API key for YOURSELF (self-serve; any member may do this)
- `"$ASLITE" key mint --remote <url> --agent <name> [--label <s>]`
  — Mint a NEW agent user's first key (admin-only; prints the key once)
- `"$ASLITE" key list --remote <url> [--fields <a,b|all>]`
  — List API keys (minimal id/prefix/label/status; --fields all for more — never the secret)
- `"$ASLITE" key revoke --remote <url> <key_id>`
  — Revoke an API key you own, or (admin) any key (idempotent)

### Session

- `"$ASLITE" session-start [--dir <path>]`
  — The SessionStart hook payload: a time-boxed best-effort board pull, then the home view — every pull failure falls through to the render (exit 0)
- `"$ASLITE" hook install|status|uninstall [--scope project|global]`
  — Install the SessionStart hook (runs session-start: pull the board, then render) for Claude Code, Codex, OpenCode

## Workspaces — the project's bundle lives at `.agentstate-lite/` in the project root

Unless the user directs otherwise, a project's workspace bundle lives in a `.agentstate-lite/`
folder at the project root. Two verbs, two different jobs — `init` always creates a LOCAL
bundle (solo use is first-class, nothing forces sharing); `sync` is how a project's board
becomes — or stays — shared memory across clones and teammates:

- **Joining an existing project** — if `.agentstate-lite/` is already in the clone, there is
  NOTHING to set up. If it isn't but the project already shares its board (the repo's remote
  has a `board` branch), `sync` is the setup verb — run it once and it creates the folder and
  pulls the shared state. NEVER init a project that already has a workspace: that creates a
  divergent second bundle.
- **Starting fresh (greenfield)** — `init` creates a bundle that doesn't exist anywhere yet.
  It is LOCAL until you choose to share it: run `sync --establish` once to publish it (creates
  the `board` branch, pushes it) — teammates then just run `sync` to join. Never automatic:
  a bare `sync` never establishes on its own (it would silently publish a bundle nobody asked
  to share), though it hints at `--establish` when it looks like you meant to.

```sh
"$ASLITE" sync                            # existing shared project — provisions the board, or reports "nothing to sync"
"$ASLITE" init --dir .agentstate-lite     # greenfield — idempotent; creates a LOCAL bundle, or opens an existing one
"$ASLITE" sync --establish                # optional — start sharing a local bundle's board with teammates
```

That's the whole setup. The CLI discovers the conventional folder on its own (the way git
finds `.git`), so every command runs BARE from anywhere in the project tree — no flags, no
config files:

```sh
"$ASLITE" list
"$ASLITE" doc read context-notes/cycle-1
```

The folder is LOCAL until you choose to share it: `aslite sync --establish` (once) publishes it
onto its own `board` branch — from then on `sync` commits and pushes board changes itself, never
batched with code. Until established, the bundle stays local — either left uncommitted, or
committed directly on the code branch like any other file, whichever the user prefers. (Gitignore
the folder only if the workspace should stay private to this machine.)

Write with attribution: pass `--actor <your-name>` on `new` / `doc write` / `doc update`.
There is no default actor, so an unattributed write renders as unknown in teammates'
awareness — the `--actor` you pass is what attributes your changes to you.

Each invocation is stateless and resolves its bundle in this order: explicit `--dir`/`--remote`
flag → `AGENTSTATE_LITE_REMOTE` env (URL only) → nearest `.agentstate.json` binding up-tree →
the cwd walk, which at each ancestor checks the directory's own `index.md`, then its
conventional `.agentstate-lite/index.md`. Reserve `--dir` for the exceptions: a bundle outside
any project, a second workspace, or reaching another project's bundle from elsewhere.

Two things override the default:

1. **Explicit user direction** — the user names a directory or a `--remote`; use that. A
   `.agentstate.json` binding (`{ "bundle": "<path-or-url>" }` at the project root) is the
   durable form of that direction — it beats the conventional folder when both exist.
2. **An existing workspace** — if a bare command already resolves (a binding, an enclosing
   bundle, or a conventional folder exists up-tree), that IS this project's workspace — use
   it rather than creating a second one.

If the user wants the workspace PRIVATE to their machine instead of shared (a personal
scratch workspace), keep the bundle OUT of the repo (e.g. under `~/.agentstate-lite/<name>/`)
and point a git-excluded `.agentstate.json` at it. Choose by one question: do teammates
share this bundle? When the user's intent is ambiguous, ask rather than defaulting silently.

## Typical flow

```sh
# One-time setup at the project root (see the Workspaces section) — run ONE of these:
"$ASLITE" sync                          # existing project that shares a board — sets up AND pulls the shared board
"$ASLITE" init --dir .agentstate-lite   # GREENFIELD — never on a project that already has a workspace; makes a LOCAL bundle

# Optional, after a greenfield init: start sharing this bundle's board with teammates
"$ASLITE" sync --establish

# Everything after runs bare, from anywhere in the project tree
# Create a context note (an OKF concept) for the next session
"$ASLITE" new "Context Note" cycle-1 --title "cycle-1" --actor <your-name>
"$ASLITE" doc update context-notes/cycle-1 --body "What this session did and what's next" --actor <your-name>

# Read it back
"$ASLITE" doc read context-notes/cycle-1

# Store a doc, cross-link it, and query the bundle
"$ASLITE" doc write specs/auth --type Spec --title "Auth" --body "…" --actor <your-name>
"$ASLITE" link add specs/auth context-notes/cycle-1
"$ASLITE" list --type Spec

# Bake a shareable, self-contained HTML view of the whole bundle
"$ASLITE" view

# Share the board — recording work isn't done until it's shared
# (safe everywhere: a project with no shared board just prints "sync: nothing to sync")
"$ASLITE" sync
```

## Sharing the board — `sync`

Ordinary `aslite sync` shares your board — commits your changes, pulls your teammate's, pushes yours,
while leaving code-project files untouched.

Run it whenever you close a unit of work — a task finished, a decision recorded, a session
ending. Recording work isn't done until it's shared. Two honest empty states (both exit 0): a
project with no shared board yet prints `sync: nothing to sync` (with a `hint` naming
`--establish` when this project looks like a candidate — a local bundle, a git repo, an `origin`
remote — but bare `sync` NEVER establishes on its own: that would silently publish a bundle
nobody asked to share); a clean, already-current board prints `sync: already up to date`.

`sync --establish` is the one explicit, one-time act that starts sharing a project's local
bundle: it snapshots and publishes the bundle, checks out the `board` branch at the same path,
and appends that path to the root working-tree `.gitignore`; teammates then just run plain
`sync` to join. Never run it on a project that already shares a board (it
detects that state, notes `already established`, and proceeds as an ordinary sync instead of
erroring).

When a doc changed on BOTH sides, sync converges instead of stopping: your teammate's version
is kept on the board, YOURS is saved to an export file named in the receipt, and the run
exits 5 with one row per conflicted doc. Reconcile with the doc verbs, never git:

```sh
"$ASLITE" sync --show-incoming <id>                 # view the kept incoming version (as of the last fetch)
"$ASLITE" doc update <id> --body-file <export-file> # write your merged version on top
"$ASLITE" sync                                      # share it
```

`sync --pull-only` picks up teammates' changes without publishing local ones. If a push fails
(offline, auth), your work is already committed locally — re-running sync retries the push.

Reads stay fresh on their own: board-reading commands (`list`, `doc read`, `status`, `home`,
`link show`) automatically run the same fast-forward-only pull when the board's state is older
than ~5 minutes — silent, time-boxed (~2s), never a rebase, never a push, and it never sets a
board up (that stays `sync`'s job) — so a plain `list` can advance the board checkout's HEAD.
Your OWN changes still only leave the machine when you run `sync`. To disable the auto-pull
(CI, scripted runs), set `AGENTSTATE_LITE_NO_AUTOPULL` to any non-empty value — even `0`
disables it; the variable's presence is the switch.

On projects that share their board you may notice a `board` branch in the repo's GitHub —
that's the board; never merge it into main.

## Remote (--remote, serve, identity, invites, keys)

Every remote-facing command ships in the SAME bundle, wired the same way as `--dir` — `serve`,
`--remote <url>` on any bundle-facing command, plus `login` / `join` / `whoami` / `invite` /
`member` / `key` all work identically through `"$ASLITE"`. Credentials are stored at
`~/.agentstate/` (0600/0700 discipline), never printed.

```bash
"$ASLITE" serve --dir ./my-bundle --port 4818 &
"$ASLITE" list --remote http://127.0.0.1:4818
```

The wire-protocol v0.1 contract `serve` implements is documented as a project bundle doc, not
(yet) shipped in this skill's references — `serve`'s own source is the authoritative reference
implementation in the meantime.

## Shipped references — worked examples & contracts alongside the CLI

A few capabilities below (bundle pages, custom recipes) are backed by a full contract or a
worked example shipped in this skill's `references/` folder rather than inlined here, so a
plain session that never touches them pays nothing for them. Resolve the path once:

```bash
REFS="$(ls -d "$HOME"/.claude/skills/agentstate-lite/references \
  "$HOME"/.claude/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite/references \
  2>/dev/null | sort -V | tail -1)"
```

Every `$REFS/…` path below is a byte-for-byte copy of the matching file in the CLI's own repo —
one authority, regenerated on every release, never hand-duplicated.

## Bundle pages — ship a live UI as bundle content

A **bundle page** is a self-contained HTML file living IN the bundle: promoted as a blob under
`pages/…`, declared by a `type: Page` registry doc (`title`, `entry`), and rendered by
`"$ASLITE" ui` inside a sandboxed, opaque-origin iframe (`sandbox="allow-scripts"`, no network
access) — its only channel out is a **read-only** postMessage bridge to the shell.

The bridge (protocol `v0`) has five read-only data request types: `hello` (bundle identity), `query`
(frontmatter-filtered rows — the same head projection `list` uses), `read` (one doc), `edges`
(the general from/to/text graph query — backlinks and containment both reduce to this), and
`subscribe` (opt into a server-pushed `change` event whenever the watched bundle moves). There
is no mutation message — read-only is enforced by construction, not convention. `open-page`
is a separate fire-and-forget shell action available to either Page capability; it opens only
another valid registered Page and returns none of that target's content or metadata.

Author a page in four steps:

```bash
# 1. write a self-contained pages/my-page.html (inline CSS/JS, no external hosts),
#    embedding the bridge client copied from the shipped contract below
"$ASLITE" promote my-page.html --doc-key pages/my-page.html                        # 2. promote the HTML blob
"$ASLITE" promote my-page-registry.md --doc-key pages-registry/my-page.md           # 3. promote its type: Page doc (title, entry)
"$ASLITE" promote "$REFS/pages/conventions/page.md" --doc-key conventions/page.md   # 4. declare the Page convention (once per bundle, ready-made)
```

Full message shapes, the trust model, the copy-paste bridge client with safe live-refresh
examples (including a live graph view over Roadmap Items) are in the shipped contract:

```bash
cat "$REFS/pages/BRIDGE.md"
```

## Notes

- `doc read <id>` truncates a large body and points at `doc read <id> --out <file>`, which streams
  the raw markdown bytes to disk without loading them into the model context window.
- Mutations are idempotent: re-writing a doc or re-adding an existing link is a no-op (exit 0).
- `new` and `doc update` accept a kind's declared fields as `--<field> <value>` (e.g. `--status done`);
  an unknown field or an out-of-enum value is rejected (exit 2). Run `kinds` to see a kind's fields.
- `hook install` registers a SessionStart hook (Claude Code, Codex, OpenCode) that runs
  `session-start`: a quick best-effort pull of the shared board, then the home view — so a new
  session starts with the bundle's state AND any teammate changes already in context. Offline is
  fine: the render always appears, labeled with the last known state. If you installed the hook
  before `session-start` existed, re-run `hook install` once to upgrade it.
- Edit a doc's body through `doc update --body-file` (or `--body`), never by pulling the raw file
  with `--out`, editing it with text tools, and re-promoting it — that risks corrupting the
  frontmatter (the engine rejects it, but the right tool avoids the dance entirely).
- Writing a custom recipe: a worked example (the `Claim` kind — event-lifecycle findings with
  provenance, composed from lite primitives) ships at `$REFS/recipes/claims/`; copy its shape,
  then `"$ASLITE" recipe add <folder>` to apply it (built-in recipes are named directly, e.g.
  `"$ASLITE" recipe add work-tracking`).
- A full interop-shaped example bundle (externally-authored markdown: unquoted timestamps,
  relative links, wrapped bullets) ships at `$REFS/sample-bundle/` — copy it and point `--dir` at
  the copy to explore a populated bundle without writing one from scratch.
