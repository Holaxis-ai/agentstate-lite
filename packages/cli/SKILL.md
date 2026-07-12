---
name: agentstate-lite
description: >-
  Read and write a local OKF knowledge bundle (agent context notes, docs, cross-links, and a
  self-contained static-HTML view) from the shell via the agentstate-lite CLI. Use when an agent
  needs to persist a context note across sessions, store a decision/spec as a doc, link concepts,
  query a bundle, share the project's board with teammates (`sync`), or bake a shareable HTML
  view. Runs standalone via `npx -y agentstate-lite`.
---

# agentstate-lite

read and write a local OKF knowledge bundle (context notes, docs, cross-links, static-HTML view).

It is a standalone npm package. Every example below runs with no install via `npx -y agentstate-lite …`; if the
tool is installed globally you can drop the `npx -y ` prefix and call `agentstate-lite …` (or the
short alias `aslite …`) directly.

Output is TOON on stdout (a `--json` hatch exists). Errors are structured TOON on stdout with a
capped exit-code taxonomy (0 ok/no-op, 2 usage, 4 auth, 5 conflict, 6 not-found, 1 runtime).

<!-- GENERATED from src/reference.ts by scripts/gen-skill.mjs — do not edit by hand. -->

## Commands

### Bundle

- `npx -y agentstate-lite init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]`
  — Create (or open) an OKF knowledge bundle in a directory — greenfield setup; a project that already shares a board is set up by sync, not init
- `npx -y agentstate-lite view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]`
  — Bake the bundle into one self-contained static HTML file
- `npx -y agentstate-lite status [--limit <n>] [--remote <url>]`
  — Read-only bundle health report (kind lint, unresolved links, orphans, staleness, graph lints)

### Documents & links

- `npx -y agentstate-lite doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [--actor <n>] [--remote <url>]`
  — Write a generic OKF concept document
- `npx -y agentstate-lite doc update <id> [--<field> <value> ...] [--title <t>] [--tag <t>] [--type <t>] [--body <s> | --body-file <p>] [--expected-version <v>] [--actor <n>] [--remote <url>]`
  — Patch given fields (incl. kind-declared fields like --status) of an existing doc, preserving the rest; optimistic-CAS with --expected-version
- `npx -y agentstate-lite doc read <id> [--out (<path> | -) | --body-out (<path> | -) | --field <name>] [--remote <url>]`
  — Read a doc, export its raw markdown, export its body with a same-read CAS version, or print one raw field for scripting
- `npx -y agentstate-lite doc history <id> [--remote <url>]`
  — Show a doc's attributed version history (newest first) — the tokens for --expected-version
- `npx -y agentstate-lite doc delete <id> [--expected-version <v>] [--remote <url>]`
  — Hard-delete a doc (idempotent: absent -> deleted:false, exit 0)
- `npx -y agentstate-lite list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--open] [--limit <n>] [--remote <url>]`
  — Query concepts over their frontmatter (alias: query) — a comma in --field's value is set membership (OR); --open excludes terminal instances (declared kinds only)
- `npx -y agentstate-lite link (add <from> <to> [--text <t>] [--actor <n>] | show <id> [--limit <n>] [--text <t>] | list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]) [--remote <url>]`
  — Add a cross-link, show a concept's links + backlinks, or query the whole bundle's derived edge list filtered by from/to (id or prefix/, repeatable/union) and exact-match text

### Artifacts

- `npx -y agentstate-lite promote <file> --doc-key <key> [--content-type <mime>] [--expected-version <v>] [--remote <url>]`
  — Move a local file's bytes into the store (a .md key routes through the engine; else a blob)
- `npx -y agentstate-lite pull --doc-key <key> --out (<path> | -) [--remote <url>]`
  — Pull a doc's canonical form or a blob's raw bytes out of the store (the reverse of promote)
- `npx -y agentstate-lite blobs [--prefix <p>] [--limit <n>] [--remote <url>]`
  — List the store's blob (non-document) keys (documents are listed by 'list'/'query')
- `npx -y agentstate-lite delete --doc-key <key> [--expected-version <v>] [--remote <url>]`
  — Hard-delete a doc or blob by key (idempotent: absent -> deleted:false, exit 0)

### Kinds

- `npx -y agentstate-lite new "<Kind>" <id> --<field> <value> [...] [--link "<type>=<target-id>" ...] [--no-prefix] [--actor <n>] [--remote <url>]`
  — Create a new instance of a bundle-declared kind — e.g. new "Context Note" <id> for a note (validates strictly); repeatable --link wires typed cross-links in the same step
- `npx -y agentstate-lite kinds [--remote <url>]`
  — List the kind conventions this bundle declares (purpose, described fields, typed-link vocabulary, horizon)
- `npx -y agentstate-lite kind field "<Kind>" (add <name> [--required] [--values <a,b,c>] | remove <name>) [--remote <url>]`
  — Edit a kind's schema — add/remove a declared field or enum value on its convention (idempotent)
- `npx -y agentstate-lite recipes [--remote <url>]`
  — List built-in recipes and whether each is already applied to this bundle
- `npx -y agentstate-lite recipe add <name-or-path> [--remote <url>]`
  — Apply a recipe's (built-in name or folder path) convention docs to the bundle (idempotent)

### Remote

- `npx -y agentstate-lite serve [--dir <path>] [--host <h>] [--port <p>]`
  — Boot the reference wire-protocol server over a local bundle (loopback, no auth)
- `npx -y agentstate-lite ui [--dir <path> | --remote <url>] [--port <p>] [--open]`
  — Boot the local web UI: a launcher for the bundle's pages (type: Page docs rendered in sandboxed iframes, with live updates) — same origin, loopback-only
- `npx -y agentstate-lite sync [--establish | --pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]`
  — Share the board branch with a remote — commits, pulls, and pushes (git tier; --pull-only skips commit+push). `init` makes a LOCAL bundle; --establish is the separate, explicit act that starts sharing it (creates the board branch, pushes; never automatic). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch. Board-reading commands (list/doc read/status/home/link show) auto-run the ff-only pull when board state is >~5m stale — silent, bounded (~2s), never a push; AGENTSTATE_LITE_NO_AUTOPULL=<any value, even 0> disables it

### Session

- `npx -y agentstate-lite session-start [--dir <path>]`
  — The SessionStart hook payload: a time-boxed best-effort board pull, then the home view — every pull failure falls through to the render (exit 0)
- `npx -y agentstate-lite hook install|status|uninstall [--scope project|global]`
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
npx -y agentstate-lite sync                            # existing shared project — provisions the board, or reports "nothing to sync"
npx -y agentstate-lite init --dir .agentstate-lite     # greenfield — idempotent; creates a LOCAL bundle, or opens an existing one
npx -y agentstate-lite sync --establish                # optional — start sharing a local bundle's board with teammates
```

That's the whole setup. The CLI discovers the conventional folder on its own (the way git
finds `.git`), so every command runs BARE from anywhere in the project tree — no flags, no
config files:

```sh
npx -y agentstate-lite list
npx -y agentstate-lite doc read context-notes/cycle-1
```

The folder is LOCAL until you choose to share it: `aslite sync --establish` (once) publishes it
onto its own `board` branch — from then on `sync` commits and pushes board changes itself, never
batched with code. Until established, the bundle stays local — either left uncommitted, or
committed directly on the code branch like any other file, whichever the user prefers. (Gitignore
the folder only if the workspace should stay private to this machine.)

Write with attribution: set `AGENTSTATE_LITE_ACTOR=<your-name>` once for `new`, `doc write`,
`doc update`, and `link add`, or pass `--actor <your-name>` per command (the flag wins).
With neither source, no advisory actor label is stored in frontmatter or sent as an agent label;
backend history still reports its own principal (for example, the local OS owner or an
authenticated remote user). A present-but-blank flag or environment value is a usage error.
Advisory attribution describes a real mutation and never creates a no-op write.
Actor labels are advisory metadata, not authentication or authorization credentials.

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
npx -y agentstate-lite sync                          # existing project that shares a board — sets up AND pulls the shared board
npx -y agentstate-lite init --dir .agentstate-lite   # GREENFIELD — never on a project that already has a workspace; makes a LOCAL bundle

# Optional, after a greenfield init: start sharing this bundle's board with teammates
npx -y agentstate-lite sync --establish

# Everything after runs bare, from anywhere in the project tree
# Create a context note (an OKF concept) for the next session
npx -y agentstate-lite new "Context Note" cycle-1 --title "cycle-1" --actor <your-name>
npx -y agentstate-lite doc update context-notes/cycle-1 --body "What this session did and what's next" --actor <your-name>

# Read it back
npx -y agentstate-lite doc read context-notes/cycle-1

# Store a doc, cross-link it, and query the bundle
npx -y agentstate-lite doc write specs/auth --type Spec --title "Auth" --body "…" --actor <your-name>
npx -y agentstate-lite link add specs/auth context-notes/cycle-1
npx -y agentstate-lite list --type Spec

# Bake a shareable, self-contained HTML view of the whole bundle
npx -y agentstate-lite view

# Share the board — recording work isn't done until it's shared
# (safe everywhere: a project with no shared board just prints "sync: nothing to sync")
npx -y agentstate-lite sync
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
npx -y agentstate-lite sync --show-incoming <id>                 # view the kept incoming version (as of the last fetch)
npx -y agentstate-lite doc update <id> --body-file <export-file> # write your merged version on top
npx -y agentstate-lite sync                                      # share it
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

## Remote bundle access (--remote, serve)

Remote bundle access remains explicit and wired the same way as `--dir`: use `serve` to expose
a local bundle over the wire protocol, or pass `--remote <url>` to a bundle-facing command.
For an authenticated remote, provide `AGENTSTATE_LITE_API_KEY`; an already-provisioned
stored per-origin credential is also consumed when present. Account and admin credential
provisioning is outside the default CLI surface.

```bash
npx -y agentstate-lite serve --dir ./my-bundle --port 4818 &
npx -y agentstate-lite list --remote http://127.0.0.1:4818
```

## Notes

- `doc read <id>` truncates a large body and points at `doc read <id> --out <file>`, which streams
  the raw markdown bytes to disk without loading them into the model context window.
- To revise body prose without parsing YAML, run `doc read <id> --body-out <file> --json`; edit the
  file, then pass it to `doc update <id> --body-file <file> --expected-version <receipt-version>`.
  The body-out receipt's version comes from the same read, so this is a safe CAS edit cycle.
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
