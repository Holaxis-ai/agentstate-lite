---
type: Doc
title: >-
  How agentstate-lite works: CLI, engine, sync, and the dynamic UI (with
  plain-language sections)
actor: brian-claude
timestamp: '2026-07-17T20:54:24.401Z'
---
## What this is

A working brief on how agentstate-lite actually operates, written 2026-07-16 against
the shipped code (plugin ~1.0.62). Companion docs: docs/core (product statement),
docs/relationships (link semantics), the codex architecture explainer (kinds). Each
complex section ends with IN PLAIN LANGUAGE.

## 1. The one-sentence model

agentstate-lite is a folder of markdown files with a disciplined CLI in front of it:
agents and humans read and write plain documents, the CLI enforces the conventions
that make those documents behave like a shared memory (types, links, versions,
attribution), and everything else — sync, dashboards, session greetings — is built on
top of that folder without ever replacing it.

## 2. Vocabulary: the concepts, precisely

- BUNDLE — the substrate. Any directory of OKF markdown documents rooted at an
  index.md. A bundle is a data format, not a purpose: sample fixtures, a personal
  scratch space, and this team's task tracker are all bundles.
- BOARD — a ROLE a bundle plays, not a different thing. The board is a project's
  shared-workspace bundle: the one at the conventional .agentstate-lite/ location
  that carries the team's tasks, plans, decisions, and pages — the bundle that sync
  manages, session-start greets you with, and the dashboards render. Every board is a
  bundle; most bundles you'll ever touch are boards. A board can be local-only (a
  supported mode) or shared (living on the board branch, below).
- DOC — one markdown file in a bundle: frontmatter (must have a type) + body.
- KIND — a doc type with declared structure (Task, Claim, Context Note). Declared by
  a CONVENTION doc (type: Convention under conventions/) naming required/optional
  fields, enum values, terminal statuses, expected links, and a freshness horizon.
- RECIPE — an installable folder of convention docs (work-tracking, context-notes):
  how a bundle gains kinds. Applied idempotently; never overwrites hand edits.
- LINK / LABEL — a relative markdown link in a doc's body; its display text is the
  label ("contains", "evidence"). Backlinks are derived at read time, never stored.
- BOARD BRANCH — the dedicated git branch (literally named `board`) where a SHARED
  board lives, checked out into the working tree at .agentstate-lite/ (gitignored on
  main). Created files-only, so it shares no history with main — which is why the two
  can never be merged, even accidentally.
- SYNC — the one verb that moves a shared board: commit board changes, pull
  teammates', push yours. Also the setup verb on a fresh clone (it provisions the
  checkout from the board branch).
- CURSOR / AWARENESS — sync's bookmark of where THIS machine last was (an opaque
  token anchored to a commit) plus the derived change feed {doc, actor, verb} — the
  raw material of session-start's "since you last synced" greeting.
- ACTOR — the attribution string on writes (--actor or AGENTSTATE_LITE_ACTOR). What
  teammates' greetings display; unattributed writes render as "unknown".
- VERSION TOKEN / CAS — every read returns a content-hash version; a write may say
  "only if it's still version X" (compare-and-swap). This is what makes claiming a
  task race-safe between agents.
- VIEW — a doc of type View registering a self-contained HTML blob (views/*.html) as
  a dashboard; rendered by the ui shell in a sandboxed iframe over the read-only
  bridge. Views are bundle content: authored, synced, and versioned like any doc.
  `Page` is the accepted legacy name — legacy-typed docs under the old
  pages-registry//pages/ prefixes keep working and never need migrating.
- SKILL / PLUGIN — the distribution channel: a marketplace plugin carrying the
  self-contained CLI plus the SKILL text that teaches agents to use it.
- TOON — the compact structured-text format receipts render in on stdout.

IN PLAIN LANGUAGE: a bundle is a notebook (the physical format); a board is THE
team notebook (the one whose job is tracking your shared work). The board branch is
the parallel git track the team notebook travels on. Docs are pages of the notebook;
kinds are the stationery templates; recipes are packs of templates; views are interactive dashboards stored inside the notebook itself.

## 3. The data model: a bundle

A BUNDLE is a directory tree rooted at a folder containing index.md. Every document
is one .md file: YAML frontmatter (must carry a non-empty `type`) plus a markdown
body. Cross-links are ordinary relative markdown links in the body; the link's display
text is its label ("contains", "evidence"). Backlinks are never stored — they are
DERIVED by walking every doc's links at query time. Timestamps derive freshness.

Document KINDS (Task, Claim, Context Note...) are themselves plain docs: a
`type: Convention` doc under conventions/ declares which `type` it governs, its
required/optional fields, allowed enum values (status: todo|in_progress|...), which
statuses mean "finished" (terminal), expected inbound links, and a freshness horizon.
RECIPES are folders of convention docs applied idempotently — install the
work-tracking recipe and your bundle gains the Task kind.

IN PLAIN LANGUAGE: the whole database is a folder of readable text files you could
edit by hand. The "schema" is more text files in the same folder, describing what a
Task or a Claim looks like. Nothing is hidden in a binary store; git can diff all of
it; deleting the tool leaves your notes intact.

## 4. How a CLI command actually runs

The shipped CLI is ONE self-contained JavaScript file (~esbuild bundle of core +
server + UI assets + deps) run by node — no install, no node_modules. Walkthrough of
`aslite doc update tasks/foo --status done --actor brian`:

1. DISPATCH: argv is matched against the command registry; unknown commands get a
   structured error naming the known set.
2. BUNDLE RESOLUTION (the part that makes bare commands work anywhere): explicit
   --dir/--remote flag wins; else a committed .agentstate.json pointer; else a walk UP
   from the cwd checking each ancestor for its own index.md and then for the
   conventional `.agentstate-lite/index.md`. That last rung is why `aslite list`
   works from any subdirectory of any project with zero config — the same way git
   finds .git.
3. KIND REGISTRY: the command layer loads the conventions ONCE (query over
   conventions/, type Convention). This is why `--status done` is a legal flag: the
   Task convention declares the field and its enum, so the CLI accepts kind-declared
   fields as flags and rejects out-of-enum values before touching disk.
4. ENGINE CALL through the STORAGE SEAM: the engine (packages/core) speaks only to a
   StorageBackend interface — read returns a content-addressed version token; write
   accepts an optional compare-and-swap expectedVersion (typed VersionConflict on
   mismatch) and an actor. The filesystem is just the default adapter; memory, the
   wire client, and the production D1/R2 worker implement the same contract, and
   parity tests pin byte-identical version tokens across all four.
5. OUTPUT: receipts render as TOON (a compact structured text) on stdout; errors go
   through ONE classification boundary to a capped exit-code taxonomy (0 ok, 1
   runtime, 2 usage, 4 auth, 5 conflict, 6 not-found) — an agent can branch on the
   exit code without parsing prose. Mutations are idempotent: re-adding an existing
   link exits 0 with changed:false.

IN PLAIN LANGUAGE: every command is a short pipeline — figure out which folder is the
notebook, read the notebook's own schema, do the read/write through a plug-socket that
doesn't care whether the notebook is on disk or on a server, and print a small
machine-readable receipt. If two agents write the same doc at once, version tokens
make the second writer retry or fail loudly instead of silently overwriting.

## 5. How agents actually use it (a day in the life)

- SESSION START: a hook installed once per machine (`hook install`, all three agent
  runtimes) runs `session-start`: a time-boxed (~7s) best-effort pull of the shared
  board, then the home dashboard rendered into the agent's opening context — bundle
  stats, recent docs, and "since this machine last synced: N board changes from
  mike/claude ..." with the agent's own changes filtered out.
- DURING WORK: `list --type Task --open` (terminal statuses excluded via the kind's
  declaration), `doc read`, `new "Task" my-task --status todo --link
  "contains=..."`, `link show`. Reads keep themselves fresh: board-reading commands
  auto-run a fast-forward-only pull when the awareness cache is >~5m stale — silent,
  ~2s budget, never a push, disabled by AGENTSTATE_LITE_NO_AUTOPULL.
- CLAIMING WORK: flipping a task to in_progress with --actor IS the claim — the
  compare-and-swap write means two agents cannot both win it.
- UNIT CLOSE: `sync` — commits board changes, pulls teammates', pushes yours.
  Recording work isn't done until it's shared.

## 6. Sync: the board on its own branch

The shared board lives on a dedicated `board` git branch of the project's own repo,
checked out INTO the working tree at .agentstate-lite/ (gitignored on main). sync
commits only inside that checkout, pulls with rebase, pushes — it can never touch
code. Because the branch shares no history with main (it was created files-only),
GitHub cannot even open a PR from board into main — merging them is structurally
blocked, not just forbidden.

Conflicts CONVERGE instead of stopping work: if a doc changed on both sides, sync
keeps the teammate's version on the board, exports YOURS to a file named in the
receipt, finishes cleanly, and exits 5. You reconcile with `doc update
--body-file <export>` — a new write on top — never with git surgery.

Awareness is a by-product: sync records a cursor (an opaque {tier, token} anchored to
a commit) and an enriched change feed {docId, actor, verb, kind, title}; session-start
renders the delta since YOUR machine's cursor, attributed per actor.

IN PLAIN LANGUAGE: the team's task board rides along inside the same git repo as the
code, but on a parallel track that never crosses the code's track. One command moves
the board in both directions. If you and a teammate edited the same card, the tool
keeps theirs, hands yours back as a file, and tells you exactly how to merge the two —
you never see a git conflict marker.

## 7. The dynamic UI: views are documents

`aslite ui` boots a LOOPBACK-ONLY web server over the bundle and prints a one-time
tokened URL (the token becomes an HttpOnly cookie on first load; it dies with the
process). The SPA it serves is just a LAUNCHER: it lists registered views — docs of
`type: View` naming a title and an entry blob — and renders each view in a sandboxed
iframe. (`Page` is the accepted legacy name: existing `type: Page` docs under the
legacy pages-registry//pages/ prefixes keep working and never need migrating.)

The views themselves are BUNDLE CONTENT: self-contained HTML files stored as blobs
under views/, authored by anyone (mostly agents), versioned, attributed, and synced to
teammates like any doc. The board's own Board/Roadmap/Memory dashboards are exactly
this — they arrived on Mike's machine via ordinary sync.

Security is BY CONSTRUCTION, not policy:
- The iframe is sandbox="allow-scripts" with no allow-same-origin: the view runs at an
  opaque origin, and its CSP allows NO network at all — no fetch, no websocket.
- Its only channel is postMessage to the shell, which brokers a READ-ONLY request set
  (protocol v0): hello, query (frontmatter rows), read (one doc), edges (the graph
  primitive), subscribe (change events), open-page (navigation — a wire verb, stable across the rename). There is no mutation
  message — the shell defines no write handler.
- Each view's registry doc must DECLARE `bridge: bundle-read` to get data at all;
  fail-closed — an undeclared page can navigate but every data request errors.
- View bytes are served via a short-lived nonce the shell mints per page; the nonce
  opens no data route, the session cookie opens no page route.

LIVENESS: the server watches the bundle (fs events locally, polling for remotes) and
pushes change deltas over one SSE stream to the shell, which fans them to subscribed
views — so a dashboard re-renders when a teammate's sync lands. When a view's own
HTML blob changes, the shell hot-reloads its iframe with a fresh nonce.

IN PLAIN LANGUAGE: dashboards are web pages that live INSIDE the notebook. The viewer
app is just a picture frame: it shows a page in a locked glass box. The page can't
reach the internet or touch your files — it can only pass written questions ("list the
open tasks") through a slot, and the librarian answers with read-only copies. When
the notebook changes, the librarian taps the glass and the page redraws itself. The
one-time password in the URL means only the person who started the viewer can use it.

## 8. Other architecturally interesting choices

- LOCAL-FIRST, GIT-OPTIONAL: everything works with the network off, and a bundle
  without any remote is a first-class supported mode (sync says so honestly). Sharing
  is one explicit act (`sync --establish`); nothing publishes on its own.
- ONE-OF-EVERYTHING DISCIPLINE: exactly one frontmatter parser, one bundle walk, one
  link resolver, one kind registry, one error-classification boundary, one bundle-name
  derivation, one committed-artifact writer. Recurring bugs are treated as API
  feedback: the invariant moves into an owning primitive instead of patching callers.
- AGENTS ARE THE USERS (AXI): receipts are compact structured text with total counts;
  large bodies truncate and point at the byte channel (--out); help arrives at the
  moment of use (create receipts suggest the next command; near-misses hint the
  declared spelling); the skill that installs the CLI also teaches it — the corpus
  showed agents copy examples, so the examples ARE the interface.
- THE TEACHING CHANNEL IS LOAD-BEARING: one unlabeled example in the skill produced
  ~80 unlabeled links on the live board — behavior follows scaffolding, so scaffolding
  is reviewed like code.
- SELF-HOSTING: this repo's own board runs on the product (the team's tasks, plans,
  research, and these very docs), so every feature is dogfooded the day it ships —
  several of this week's fixes were found by the founders literally using the board.
- BOT-OWNED ARTIFACTS: the committed plugin bundle and version numbers are written
  ONLY by CI on merge (byte-reproducible via a pinned pure-JS compressor); dev builds
  can't touch them, so parallel branches never collide on versions.
- DELIBERATE FREEZES: the hosted multi-user substrate (worker, auth, invites) is
  deployed but FROZEN and now extracted behind the OSS wire boundary; the product
  grows by explicit founder decisions, with parked items carrying written wake
  conditions instead of ambient pressure.

## Provenance

Written from the shipped code and this week's review records; where this brief and
the code disagree, the code wins and this doc gets fixed (same rule as CLAUDE.md).

[docs/core](core.md)

[docs/relationships](relationships.md)
