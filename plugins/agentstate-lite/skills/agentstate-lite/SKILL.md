---
name: agentstate-lite
description: >-
  Read and write a local OKF knowledge bundle (agent context notes, docs, cross-links, and a
  self-contained static-HTML view) via the self-contained agentstate-lite CLI bundled in this
  skill (scripts/agentstate-lite — a committed, zero-dependency bundle; no npm install
  required). Use when an agent needs to persist a context note across sessions, store a
  decision/spec as a doc, link concepts, query a bundle, run a local wire-protocol server
  (`serve` / `--remote`), or bake a shareable HTML view.
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

- `"$ASLITE" init [--dir <path>] [--okf-version <v>]`
  — Create (or open) an OKF knowledge bundle in a directory
- `"$ASLITE" view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]`
  — Bake the bundle into one self-contained static HTML file
- `"$ASLITE" status [--limit <n>] [--remote <url>]`
  — Read-only bundle health report (kind lint, unresolved links, orphans, staleness)

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
- `"$ASLITE" list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--limit <n>] [--remote <url>]`
  — Query concepts over their frontmatter (alias: query)
- `"$ASLITE" link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>]) [--remote <url>]`
  — Add a cross-link, or show a concept's links + backlinks (each carrying link text; --text filters both directions by exact match)

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

- `"$ASLITE" new "<Kind>" <id> --<field> <value> [...] [--no-prefix] [--actor <n>] [--remote <url>]`
  — Create a new instance of a bundle-declared kind — e.g. new "Context Note" <id> for a note (validates strictly)
- `"$ASLITE" kinds [--remote <url>]`
  — List the kind conventions this bundle declares (required/optional fields, typed-link vocabulary, horizon)
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
  — Boot the local web UI (board / doc detail / admin / graph) — same origin, loopback-only
- `"$ASLITE" sync [options]`
  — Sync the bundle with a remote (NOT YET IMPLEMENTED)

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

- `"$ASLITE" hook install|status|uninstall [--scope project|global]`
  — Install the SessionStart home-view hook (Claude Code, Codex, OpenCode)

## Workspaces — default location, one-time binding, then bare commands

Unless the user directs otherwise, store each workspace's bundle under `~/.agentstate-lite/`,
in a folder named after the workspace: a workspace named `holaxis-video-analyzer` keeps its
bundle at `~/.agentstate-lite/holaxis-video-analyzer/`. Do NOT pass `--dir` on every command —
set the workspace up ONCE per project, and every later command finds it automatically:

```sh
# One-time setup, run at the PROJECT ROOT (all three steps are idempotent):
WS="$HOME/.agentstate-lite/holaxis-video-analyzer"
"$ASLITE" init --dir "$WS"                        # create (or open) the bundle
printf '{ "bundle": "%s" }\n' "$WS" > .agentstate.json   # bind this project to it
grep -qxF .agentstate.json .git/info/exclude 2>/dev/null \
  || echo .agentstate.json >> .git/info/exclude  # local-only ignore (skip if not a git repo)
```

From then on, run every command BARE from anywhere in the project tree — the CLI resolves the
nearest `.agentstate.json` up-tree, exactly as if `--dir` had been passed:

```sh
"$ASLITE" list
"$ASLITE" doc read context-notes/cycle-1
```

Each invocation is stateless and resolves its bundle in this order: explicit `--dir`/`--remote`
flag → `AGENTSTATE_LITE_REMOTE` env (URL only) → nearest `.agentstate.json` up-tree → enclosing
bundle (`index.md` up-tree). So reserve `--dir` for the exceptions: reaching a workspace from
OUTSIDE its bound project, touching a second workspace, or one-off work with no project.

Two things override the default location:

1. **Explicit user direction** — the user names a directory or a `--remote`; use that.
2. **An existing binding or bundle** — if a bare command already resolves (a `.agentstate.json`
   or an enclosing bundle exists up-tree), that IS this project's workspace — use it rather
   than creating a second bundle under `~/.agentstate-lite/`.

The setup above is the **personal-workspace** pattern (home-dir bundle, absolute path, binding
kept OUT of the repo). The other pattern is **project-owned**: the bundle lives with the repo,
`.agentstate.json` holds a RELATIVE path and IS committed — every collaborator's agent then
resolves it from a bare clone. Choose by one question: do teammates share this bundle? When
the user's intent is ambiguous, ask which pattern fits rather than defaulting silently.

## Typical flow

```sh
# One-time workspace setup (default location + project binding — see the Workspaces section)
WS="$HOME/.agentstate-lite/my-workspace"
"$ASLITE" init --dir "$WS"
printf '{ "bundle": "%s" }\n' "$WS" > .agentstate.json

# Everything after runs bare — the binding resolves the workspace
# Create a context note (an OKF concept) for the next session
"$ASLITE" new "Context Note" cycle-1 --title "cycle-1"
"$ASLITE" doc update context-notes/cycle-1 --body "What this session did and what's next"

# Read it back
"$ASLITE" doc read context-notes/cycle-1

# Store a doc, cross-link it, and query the bundle
"$ASLITE" doc write specs/auth --type Spec --title "Auth" --body "…"
"$ASLITE" link add specs/auth context-notes/cycle-1
"$ASLITE" list --type Spec

# Bake a shareable, self-contained HTML view of the whole bundle
"$ASLITE" view
```

## Remote (--remote, serve, identity, invites, keys)

Every remote-facing command ships in the SAME bundle, wired the same way as `--dir` — `serve`,
`--remote <url>` on any bundle-facing command, plus `login` / `join` / `whoami` / `invite` /
`member` / `key` all work identically through `"$ASLITE"`. Credentials are stored at
`~/.agentstate/` (0600/0700 discipline), never printed.

```bash
"$ASLITE" serve --dir ./my-bundle --port 4818 &
"$ASLITE" list --remote http://127.0.0.1:4818
```

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
