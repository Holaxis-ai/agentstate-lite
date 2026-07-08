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
- `npx -y agentstate-lite doc read <id> [--out (<path> | -) | --field <name>] [--remote <url>]`
  — Read a doc (or pull its raw markdown bytes to disk, or print one raw field for scripting)
- `npx -y agentstate-lite doc history <id> [--remote <url>]`
  — Show a doc's attributed version history (newest first) — the tokens for --expected-version
- `npx -y agentstate-lite doc delete <id> [--expected-version <v>] [--remote <url>]`
  — Hard-delete a doc (idempotent: absent -> deleted:false, exit 0)
- `npx -y agentstate-lite list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--open] [--limit <n>] [--remote <url>]`
  — Query concepts over their frontmatter (alias: query) — a comma in --field's value is set membership (OR); --open excludes terminal instances (declared kinds only)
- `npx -y agentstate-lite link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>]) [--remote <url>]`
  — Add a cross-link, or show a concept's links + backlinks (each carrying link text; --text filters both directions by exact match)

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
  — List the kind conventions this bundle declares (required/optional fields, typed-link vocabulary, horizon)
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
  — Boot the local web UI (board / doc detail / admin / graph) — same origin, loopback-only
- `npx -y agentstate-lite sync [--pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]`
  — Share the board branch with a remote — commits, pulls, and pushes (git tier; --pull-only skips commit+push). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch

### Identity

- `npx -y agentstate-lite login --remote <url> --api-key <key>`
  — Store an API key for a gated --remote deployment (keyed by origin; join redeems an invite instead)
- `npx -y agentstate-lite join --remote <url> --invite <token> [--display <name>]`
  — Redeem an invite token to join a remote bundle (stores the returned API key; never prints it)
- `npx -y agentstate-lite whoami [--remote <url>]`
  — List the remote origins you hold a key for (offline), or (with --remote) the live remote identity + bundle memberships

### Invites & members (admin)

- `npx -y agentstate-lite invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]`
  — Create a join invite for a remote bundle (prints the token once)
- `npx -y agentstate-lite invite list --remote <url> [--fields <a,b|all>]`
  — List invites (minimal id/role/expires/status by default; --fields all for the full record)
- `npx -y agentstate-lite invite revoke --remote <url> <invite_id>`
  — Revoke an invite (idempotent)
- `npx -y agentstate-lite member list --remote <url>`
  — List a remote bundle's members and their roles
- `npx -y agentstate-lite member set-role --remote <url> <user_id> <role>`
  — Change a member's role (idempotent)
- `npx -y agentstate-lite member remove --remote <url> <user_id>`
  — Remove a member and revoke all their API keys (idempotent)

### API keys

- `npx -y agentstate-lite key mint --remote <url> [--label <s>]`
  — Mint an API key for YOURSELF (self-serve; any member may do this)
- `npx -y agentstate-lite key mint --remote <url> --agent <name> [--label <s>]`
  — Mint a NEW agent user's first key (admin-only; prints the key once)
- `npx -y agentstate-lite key list --remote <url> [--fields <a,b|all>]`
  — List API keys (minimal id/prefix/label/status; --fields all for more — never the secret)
- `npx -y agentstate-lite key revoke --remote <url> <key_id>`
  — Revoke an API key you own, or (admin) any key (idempotent)

### Session

- `npx -y agentstate-lite hook install|status|uninstall [--scope project|global]`
  — Install the SessionStart home-view hook (Claude Code, Codex, OpenCode)

## Workspaces — the project's bundle lives at `.agentstate-lite/` in the project root

Unless the user directs otherwise, a project's workspace bundle lives in a `.agentstate-lite/`
folder at the project root, and it is COMMITTED to the repo — the bundle is shared memory, and
sharing it is what lets two or more humans (and their agents) collaborate on it across
clones. Setup depends on whether the project already has a workspace:

- **Joining an existing project** — if `.agentstate-lite/` is already in the clone, there is
  NOTHING to set up. If it isn't but the project shares its board (the repo's remote has a
  `board` branch), `sync` is the setup verb — run it once and it creates the folder and pulls
  the shared state. NEVER init a project that already has a workspace: that creates a
  divergent second bundle.
- **Starting fresh (greenfield)** — `init` creates a bundle that doesn't exist anywhere yet.

```sh
npx -y agentstate-lite sync                            # existing project — provisions the shared board, or reports "nothing to sync"
npx -y agentstate-lite init --dir .agentstate-lite     # greenfield only — idempotent; creates the bundle, or opens an existing one
```

That's the whole setup. The CLI discovers the conventional folder on its own (the way git
finds `.git`), so every command runs BARE from anywhere in the project tree — no flags, no
config files:

```sh
npx -y agentstate-lite list
npx -y agentstate-lite doc read context-notes/cycle-1
```

The folder is shared with teammates via `aslite sync`, which commits and pushes board changes
itself; until a project adopts sync, board changes are committed as their own small commits,
not batched with code. (Only gitignore the folder if the user says the workspace should stay
private to this machine.)

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
npx -y agentstate-lite sync                          # existing project that shares a board — sets up AND pulls the shared board
npx -y agentstate-lite init --dir .agentstate-lite   # GREENFIELD ONLY — never on a project that already has a workspace

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

`aslite sync` shares your board — commits your changes, pulls your teammate's, pushes yours,
touching nothing but the board.

Run it whenever you close a unit of work — a task finished, a decision recorded, a session
ending. Recording work isn't done until it's shared. Two honest empty states (both exit 0):
a project that doesn't share a board yet prints `sync: nothing to sync` (keep committing the
folder's changes as their own small commits there); a clean, already-current board prints
`sync: already up to date`.

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

On projects that share their board you may notice a `board` branch in the repo's GitHub —
that's the board; never merge it into main.

## Notes

- `doc read <id>` truncates a large body and points at `doc read <id> --out <file>`, which streams
  the raw markdown bytes to disk without loading them into the model context window.
- Mutations are idempotent: re-writing a doc or re-adding an existing link is a no-op (exit 0).
- `new` and `doc update` accept a kind's declared fields as `--<field> <value>` (e.g. `--status done`);
  an unknown field or an out-of-enum value is rejected (exit 2). Run `kinds` to see a kind's fields.
- `hook install` registers a SessionStart home-view hook for Claude Code, Codex, and OpenCode so a
  new session starts with the bundle's state already in context.
- Edit a doc's body through `doc update --body-file` (or `--body`), never by pulling the raw file
  with `--out`, editing it with text tools, and re-promoting it — that risks corrupting the
  frontmatter (the engine rejects it, but the right tool avoids the dance entirely).
