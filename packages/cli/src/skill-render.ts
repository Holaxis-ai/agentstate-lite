// Pure SKILL.md section renderers for both distribution channels — extracted from
// scripts/gen-skill.mjs so they are typed, unit-testable without esbuild's data-URL bundling
// dance, and importable directly by test/skill-distribution.test.ts (which renders the skill
// target in-memory to gate its shipped-references prose). NO I/O: pure functions over
// reference.ts's COMMAND_GROUPS/DESCRIPTION and skill-references.ts's manifest, parameterized only
// by the caller-supplied invocation prefix where relevant — mirrors reference.ts's own "pure data +
// pure projection" contract (see that file's header comment).
//
// gen-skill.mjs bundles this module (transitively pulling in reference.ts + skill-references.ts)
// via esbuild's data-URL loader and calls `renderNpm()` / `renderSkill()` directly; it no longer
// contains any rendering logic of its own, only the write/--check CLI shell.
//
// `renderNpm`'s output is BYTE-IDENTICAL to before this extraction (`check:skill` sees no churn).
// The skill-target-only additions (Shipped references, Bundle pages, the Remote section's
// wire-protocol note, two extra Notes bullets) live entirely on `renderSkill`'s own path;
// `renderNotesSection`'s shared body is unchanged — only its new `extraBullets` param is added,
// defaulting to none so the npm call site reproduces the exact prior output.
import { DESCRIPTION, COMMAND_GROUPS, commandName, type CommandGroup } from "./reference.js";
import { SKILL_REFERENCES } from "./skill-references.js";

export { SKILL_REFERENCES, commandName };

const PKG = "agentstate-lite";
const NPX = `npx -y ${PKG}`;
const ASLITE = '"$ASLITE"';

// ---------------------------------------------------------------------------------------------
// Shared projections (single source: COMMAND_GROUPS), parameterized only by invocation prefix.
// ---------------------------------------------------------------------------------------------

function renderCommandsSection(groups: CommandGroup[], prefix: string): string[] {
  const lines: string[] = [];
  lines.push("## Commands");
  lines.push("");
  for (const { group, commands } of groups) {
    lines.push(`### ${group}`);
    lines.push("");
    for (const { usage, summary } of commands) {
      lines.push(`- \`${prefix} ${usage}\``);
      lines.push(`  — ${summary}`);
    }
    lines.push("");
  }
  return lines;
}

function renderWorkspaceLocation(prefix: string): string[] {
  const lines: string[] = [];
  lines.push("## Workspaces — the project's bundle lives at `.agentstate-lite/` in the project root");
  lines.push("");
  lines.push(
    "Unless the user directs otherwise, a project's workspace bundle lives in a `.agentstate-lite/`",
  );
  lines.push(
    "folder at the project root. Two verbs, two different jobs — `init` always creates a LOCAL",
  );
  lines.push(
    "bundle (solo use is first-class, nothing forces sharing); `sync` is how a project's board",
  );
  lines.push("becomes — or stays — shared memory across clones and teammates:");
  lines.push("");
  lines.push(
    "- **Joining an existing project** — if `.agentstate-lite/` is already in the clone, there is",
  );
  lines.push(
    "  NOTHING to set up. If it isn't but the project already shares its board (the repo's remote",
  );
  lines.push(
    "  has a `board` branch), `sync` is the setup verb — run it once and it creates the folder and",
  );
  lines.push(
    "  pulls the shared state. NEVER init a project that already has a workspace: that creates a",
  );
  lines.push("  divergent second bundle.");
  lines.push(
    "- **Starting fresh (greenfield)** — `init` creates a bundle that doesn't exist anywhere yet.",
  );
  lines.push(
    "  It is LOCAL until you choose to share it: run `sync --establish` once to publish it (creates",
  );
  lines.push(
    "  the `board` branch, pushes it) — teammates then just run `sync` to join. Never automatic:",
  );
  lines.push(
    "  a bare `sync` never establishes on its own (it would silently publish a bundle nobody asked",
  );
  lines.push("  to share), though it hints at `--establish` when it looks like you meant to.");
  lines.push("");
  lines.push("```sh");
  lines.push(`${prefix} sync                            # existing shared project — provisions the board, or reports "nothing to sync"`);
  lines.push(`${prefix} init --dir .agentstate-lite     # greenfield — idempotent; creates a LOCAL bundle, or opens an existing one`);
  lines.push(`${prefix} sync --establish                # optional — start sharing a local bundle's board with teammates`);
  lines.push("```");
  lines.push("");
  lines.push(
    "That's the whole setup. The CLI discovers the conventional folder on its own (the way git",
  );
  lines.push(
    "finds `.git`), so every command runs BARE from anywhere in the project tree — no flags, no",
  );
  lines.push("config files:");
  lines.push("");
  lines.push("```sh");
  lines.push(`${prefix} list`);
  lines.push(`${prefix} doc read context-notes/cycle-1`);
  lines.push("```");
  lines.push("");
  lines.push(
    "The folder is LOCAL until you choose to share it: `aslite sync --establish` (once) publishes it",
  );
  lines.push(
    "onto its own `board` branch — from then on `sync` commits and pushes board changes itself, never",
  );
  lines.push(
    "batched with code. Until established, the bundle stays local — either left uncommitted, or",
  );
  lines.push(
    "committed directly on the code branch like any other file, whichever the user prefers. (Gitignore",
  );
  lines.push("the folder only if the workspace should stay private to this machine.)");
  lines.push("");
  lines.push(
    "Write with attribution: pass `--actor <your-name>` on `new` / `doc write` / `doc update`.",
  );
  lines.push(
    "There is no default actor, so an unattributed write renders as unknown in teammates'",
  );
  lines.push("awareness — the `--actor` you pass is what attributes your changes to you.");
  lines.push("");
  lines.push(
    "Each invocation is stateless and resolves its bundle in this order: explicit `--dir`/`--remote`",
  );
  lines.push(
    "flag → `AGENTSTATE_LITE_REMOTE` env (URL only) → nearest `.agentstate.json` binding up-tree →",
  );
  lines.push(
    "the cwd walk, which at each ancestor checks the directory's own `index.md`, then its",
  );
  lines.push(
    "conventional `.agentstate-lite/index.md`. Reserve `--dir` for the exceptions: a bundle outside",
  );
  lines.push("any project, a second workspace, or reaching another project's bundle from elsewhere.");
  lines.push("");
  lines.push("Two things override the default:");
  lines.push("");
  lines.push(
    "1. **Explicit user direction** — the user names a directory or a `--remote`; use that. A",
  );
  lines.push(
    "   `.agentstate.json` binding (`{ \"bundle\": \"<path-or-url>\" }` at the project root) is the",
  );
  lines.push("   durable form of that direction — it beats the conventional folder when both exist.");
  lines.push(
    "2. **An existing workspace** — if a bare command already resolves (a binding, an enclosing",
  );
  lines.push(
    "   bundle, or a conventional folder exists up-tree), that IS this project's workspace — use",
  );
  lines.push("   it rather than creating a second one.");
  lines.push("");
  lines.push(
    "If the user wants the workspace PRIVATE to their machine instead of shared (a personal",
  );
  lines.push(
    "scratch workspace), keep the bundle OUT of the repo (e.g. under `~/.agentstate-lite/<name>/`)",
  );
  lines.push(
    "and point a git-excluded `.agentstate.json` at it. Choose by one question: do teammates",
  );
  lines.push("share this bundle? When the user's intent is ambiguous, ask rather than defaulting silently.");
  lines.push("");
  return lines;
}

function renderTypicalFlow(prefix: string): string[] {
  const lines: string[] = [];
  lines.push("## Typical flow");
  lines.push("");
  lines.push("```sh");
  lines.push(`# One-time setup at the project root (see the Workspaces section) — run ONE of these:`);
  lines.push(`${prefix} sync                          # existing project that shares a board — sets up AND pulls the shared board`);
  lines.push(`${prefix} init --dir .agentstate-lite   # GREENFIELD — never on a project that already has a workspace; makes a LOCAL bundle`);
  lines.push("");
  lines.push(`# Optional, after a greenfield init: start sharing this bundle's board with teammates`);
  lines.push(`${prefix} sync --establish`);
  lines.push("");
  lines.push(`# Everything after runs bare, from anywhere in the project tree`);
  lines.push(`# Create a context note (an OKF concept) for the next session`);
  lines.push(`${prefix} new "Context Note" cycle-1 --title "cycle-1" --actor <your-name>`);
  lines.push(`${prefix} doc update context-notes/cycle-1 --body "What this session did and what's next" --actor <your-name>`);
  lines.push("");
  lines.push(`# Read it back`);
  lines.push(`${prefix} doc read context-notes/cycle-1`);
  lines.push("");
  lines.push(`# Store a doc, cross-link it, and query the bundle`);
  lines.push(`${prefix} doc write specs/auth --type Spec --title "Auth" --body "…" --actor <your-name>`);
  lines.push(`${prefix} link add specs/auth context-notes/cycle-1`);
  lines.push(`${prefix} list --type Spec`);
  lines.push("");
  lines.push(`# Bake a shareable, self-contained HTML view of the whole bundle`);
  lines.push(`${prefix} view`);
  lines.push("");
  lines.push(`# Share the board — recording work isn't done until it's shared`);
  lines.push(`# (safe everywhere: a project with no shared board just prints "sync: nothing to sync")`);
  lines.push(`${prefix} sync`);
  lines.push("```");
  lines.push("");
  return lines;
}

function renderSyncSection(prefix: string): string[] {
  const lines: string[] = [];
  lines.push("## Sharing the board — `sync`");
  lines.push("");
  lines.push(
    "Ordinary `aslite sync` shares your board — commits your changes, pulls your teammate's, pushes yours,",
  );
  lines.push("while leaving code-project files untouched.");
  lines.push("");
  lines.push(
    "Run it whenever you close a unit of work — a task finished, a decision recorded, a session",
  );
  lines.push(
    "ending. Recording work isn't done until it's shared. Two honest empty states (both exit 0): a",
  );
  lines.push(
    "project with no shared board yet prints `sync: nothing to sync` (with a `hint` naming",
  );
  lines.push(
    "`--establish` when this project looks like a candidate — a local bundle, a git repo, an `origin`",
  );
  lines.push(
    "remote — but bare `sync` NEVER establishes on its own: that would silently publish a bundle",
  );
  lines.push(
    "nobody asked to share); a clean, already-current board prints `sync: already up to date`.",
  );
  lines.push("");
  lines.push(
    "`sync --establish` is the one explicit, one-time act that starts sharing a project's local",
  );
  lines.push(
    "bundle: it snapshots and publishes the bundle, checks out the `board` branch at the same path,",
  );
  lines.push(
    "and appends that path to the root working-tree `.gitignore`; teammates then just run plain",
  );
  lines.push(
    "`sync` to join. Never run it on a project that already shares a board (it",
  );
  lines.push(
    "detects that state, notes `already established`, and proceeds as an ordinary sync instead of",
  );
  lines.push("erroring).");
  lines.push("");
  lines.push(
    "When a doc changed on BOTH sides, sync converges instead of stopping: your teammate's version",
  );
  lines.push(
    "is kept on the board, YOURS is saved to an export file named in the receipt, and the run",
  );
  lines.push("exits 5 with one row per conflicted doc. Reconcile with the doc verbs, never git:");
  lines.push("");
  lines.push("```sh");
  lines.push(`${prefix} sync --show-incoming <id>                 # view the kept incoming version (as of the last fetch)`);
  lines.push(`${prefix} doc update <id> --body-file <export-file> # write your merged version on top`);
  lines.push(`${prefix} sync                                      # share it`);
  lines.push("```");
  lines.push("");
  lines.push(
    "`sync --pull-only` picks up teammates' changes without publishing local ones. If a push fails",
  );
  lines.push(
    "(offline, auth), your work is already committed locally — re-running sync retries the push.",
  );
  lines.push("");
  lines.push(
    "Reads stay fresh on their own: board-reading commands (`list`, `doc read`, `status`, `home`,",
  );
  lines.push(
    "`link show`) automatically run the same fast-forward-only pull when the board's state is older",
  );
  lines.push(
    "than ~5 minutes — silent, time-boxed (~2s), never a rebase, never a push, and it never sets a",
  );
  lines.push(
    "board up (that stays `sync`'s job) — so a plain `list` can advance the board checkout's HEAD.",
  );
  lines.push(
    "Your OWN changes still only leave the machine when you run `sync`. To disable the auto-pull",
  );
  lines.push(
    "(CI, scripted runs), set `AGENTSTATE_LITE_NO_AUTOPULL` to any non-empty value — even `0`",
  );
  lines.push("disables it; the variable's presence is the switch.");
  lines.push("");
  lines.push(
    "On projects that share their board you may notice a `board` branch in the repo's GitHub —",
  );
  lines.push("that's the board; never merge it into main.");
  lines.push("");
  return lines;
}

/**
 * `extraBullets` is skill-target-only (default none, reproducing the npm-channel's exact prior
 * output): a handful of physical lines appended after the standard bullets, still under the same
 * `## Notes` heading, for capabilities the npm channel doesn't carry a shipped `references/` copy
 * of at all.
 */
function renderNotesSection(extraBullets: string[] = []): string[] {
  const lines: string[] = [];
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- `doc read <id>` truncates a large body and points at `doc read <id> --out <file>`, which streams",
  );
  lines.push("  the raw markdown bytes to disk without loading them into the model context window.");
  lines.push("- Mutations are idempotent: re-writing a doc or re-adding an existing link is a no-op (exit 0).");
  lines.push(
    "- `new` and `doc update` accept a kind's declared fields as `--<field> <value>` (e.g. `--status done`);",
  );
  lines.push("  an unknown field or an out-of-enum value is rejected (exit 2). Run `kinds` to see a kind's fields.");
  lines.push(
    "- `hook install` registers a SessionStart hook (Claude Code, Codex, OpenCode) that runs",
  );
  lines.push(
    "  `session-start`: a quick best-effort pull of the shared board, then the home view — so a new",
  );
  lines.push(
    "  session starts with the bundle's state AND any teammate changes already in context. Offline is",
  );
  lines.push(
    "  fine: the render always appears, labeled with the last known state. If you installed the hook",
  );
  lines.push("  before `session-start` existed, re-run `hook install` once to upgrade it.");
  lines.push(
    "- Edit a doc's body through `doc update --body-file` (or `--body`), never by pulling the raw file",
  );
  lines.push(
    "  with `--out`, editing it with text tools, and re-promoting it — that risks corrupting the",
  );
  lines.push("  frontmatter (the engine rejects it, but the right tool avoids the dance entirely).");
  lines.push(...extraBullets);
  lines.push("");
  return lines;
}

// ---------------------------------------------------------------------------------------------
// npm target — packages/cli/SKILL.md, published-package channel.
// ---------------------------------------------------------------------------------------------

export function renderNpm(): string {
  const lines: string[] = [];
  lines.push("---");
  lines.push(`name: ${PKG}`);
  lines.push("description: >-");
  lines.push(
    "  Read and write a local OKF knowledge bundle (agent context notes, docs, cross-links, and a",
  );
  lines.push(
    "  self-contained static-HTML view) from the shell via the agentstate-lite CLI. Use when an agent",
  );
  lines.push(
    "  needs to persist a context note across sessions, store a decision/spec as a doc, link concepts,",
  );
  lines.push(
    "  query a bundle, share the project's board with teammates (`sync`), or bake a shareable HTML",
  );
  lines.push(`  view. Runs standalone via \`${NPX}\`.`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${PKG}`);
  lines.push("");
  lines.push(`${DESCRIPTION}.`);
  lines.push("");
  lines.push(
    `It is a standalone npm package. Every example below runs with no install via \`${NPX} …\`; if the`,
  );
  lines.push(
    "tool is installed globally you can drop the `npx -y ` prefix and call `agentstate-lite …` (or the",
  );
  lines.push("short alias `aslite …`) directly.");
  lines.push("");
  lines.push("Output is TOON on stdout (a `--json` hatch exists). Errors are structured TOON on stdout with a");
  lines.push("capped exit-code taxonomy (0 ok/no-op, 2 usage, 4 auth, 5 conflict, 6 not-found, 1 runtime).");
  lines.push("");
  lines.push("<!-- GENERATED from src/reference.ts by scripts/gen-skill.mjs — do not edit by hand. -->");
  lines.push("");
  lines.push(...renderCommandsSection(COMMAND_GROUPS, NPX));
  lines.push(...renderWorkspaceLocation(NPX));
  lines.push(...renderTypicalFlow(NPX));
  lines.push(...renderSyncSection(NPX));
  lines.push(...renderNotesSection());
  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------------
// skill target — plugins/agentstate-lite/skills/agentstate-lite/SKILL.md, self-contained committed-bundle channel
// (`npx skills add`). Mirrors the resolver pattern of the reference `holaxis-agentstate` skill.
// ---------------------------------------------------------------------------------------------

/** `## Shipped references` — resolves `$REFS` once, the same way `$ASLITE` is resolved above. */
function renderShippedReferencesSection(): string[] {
  const lines: string[] = [];
  lines.push("## Shipped references — worked examples & contracts alongside the CLI");
  lines.push("");
  lines.push(
    "A few capabilities below (bundle pages, custom recipes) are backed by a full contract or a",
  );
  lines.push(
    "worked example shipped in this skill's `references/` folder rather than inlined here, so a",
  );
  lines.push("plain session that never touches them pays nothing for them. Resolve the path once:");
  lines.push("");
  lines.push("```bash");
  lines.push('REFS="$(ls -d "$HOME"/.claude/skills/agentstate-lite/references \\');
  lines.push('  "$HOME"/.claude/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite/references \\');
  lines.push('  2>/dev/null | sort -V | tail -1)"');
  lines.push("```");
  lines.push("");
  lines.push(
    "Every `$REFS/…` path below is a byte-for-byte copy of the matching file in the CLI's own repo —",
  );
  lines.push("one authority, regenerated on every release, never hand-duplicated.");
  lines.push("");
  return lines;
}

/** `## Bundle pages` — the concept + v0 request-type names + the 4 authoring steps + a pointer. */
function renderBundlePagesSection(): string[] {
  const lines: string[] = [];
  lines.push("## Bundle pages — ship a live UI as bundle content");
  lines.push("");
  lines.push(
    "A **bundle page** is a self-contained HTML file living IN the bundle: promoted as a blob under",
  );
  lines.push(
    "`pages/…`, declared by a `type: Page` registry doc (`title`, `entry`), and rendered by",
  );
  lines.push(
    `\`${ASLITE} ui\` inside a sandboxed, opaque-origin iframe (\`sandbox="allow-scripts"\`, no network`,
  );
  lines.push("access) — its only channel out is a **read-only** postMessage bridge to the shell.");
  lines.push("");
  lines.push(
    "The bridge (protocol `v0`) has five read-only data request types: `hello` (bundle identity), `query`",
  );
  lines.push(
    "(frontmatter-filtered rows — the same head projection `list` uses), `read` (one doc), `edges`",
  );
  lines.push(
    "(the general from/to/text graph query — backlinks and containment both reduce to this), and",
  );
  lines.push(
    "`subscribe` (opt into a server-pushed `change` event whenever the watched bundle moves). There",
  );
  lines.push("is no mutation message — read-only is enforced by construction, not convention. `open-page`");
  lines.push("is a separate fire-and-forget shell action available to either Page capability; it opens only");
  lines.push("another valid registered Page and returns none of that target's content or metadata.");
  lines.push("");
  lines.push("Author a page in four steps:");
  lines.push("");
  lines.push("```bash");
  lines.push("# 1. write a self-contained pages/my-page.html (inline CSS/JS, no external hosts),");
  lines.push("#    embedding the bridge client copied from the shipped contract below");
  lines.push(
    `${ASLITE} promote my-page.html --doc-key pages/my-page.html                        # 2. promote the HTML blob`,
  );
  lines.push(
    `${ASLITE} promote my-page-registry.md --doc-key pages-registry/my-page.md           # 3. promote its type: Page doc (title, entry)`,
  );
  lines.push(
    `${ASLITE} promote "$REFS/pages/conventions/page.md" --doc-key conventions/page.md   # 4. declare the Page convention (once per bundle, ready-made)`,
  );
  lines.push("```");
  lines.push("");
  lines.push(
    "Full message shapes, the trust model, the copy-paste ~30-line bridge client, and two working",
  );
  lines.push("examples (including a live graph view over Roadmap Items) are in the shipped contract:");
  lines.push("");
  lines.push("```bash");
  lines.push('cat "$REFS/pages/BRIDGE.md"');
  lines.push("```");
  lines.push("");
  return lines;
}

/** Skill-target-only addendum to `## Notes` — see {@link renderNotesSection}'s `extraBullets`. */
const SKILL_NOTES_ADDENDUM: string[] = [
  "- Writing a custom recipe: a worked example (the `Claim` kind — event-lifecycle findings with",
  "  provenance, composed from lite primitives) ships at `$REFS/recipes/claims/`; copy its shape,",
  `  then \`${ASLITE} recipe add <folder>\` to apply it (built-in recipes are named directly, e.g.`,
  `  \`${ASLITE} recipe add work-tracking\`).`,
  "- A full interop-shaped example bundle (externally-authored markdown: unquoted timestamps,",
  "  relative links, wrapped bullets) ships at `$REFS/sample-bundle/` — copy it and point `--dir` at",
  "  the copy to explore a populated bundle without writing one from scratch.",
];

export function renderSkill(): string {
  const lines: string[] = [];
  lines.push("---");
  lines.push(`name: ${PKG}`);
  lines.push("description: >-");
  lines.push(
    "  Read and write a local OKF knowledge bundle (agent context notes, docs, cross-links, and a",
  );
  lines.push(
    "  self-contained static-HTML view) via the self-contained agentstate-lite CLI bundled in this",
  );
  lines.push(
    "  skill (scripts/agentstate-lite — a committed, zero-dependency bundle; no npm install",
  );
  lines.push(
    "  required). Use when an agent needs to persist a context note across sessions, store a",
  );
  lines.push(
    "  decision/spec as a doc, link concepts, query a bundle, share the project's board with",
  );
  lines.push(
    "  teammates (`sync`), run a local wire-protocol server (`serve` / `--remote`), or bake a",
  );
  lines.push("  shareable HTML view.");
  lines.push("---");
  lines.push("");
  lines.push(`# ${PKG}`);
  lines.push("");
  lines.push(`${DESCRIPTION}.`);
  lines.push("");
  lines.push(
    "This skill bundles a **self-contained** `agentstate-lite` CLI at `scripts/agentstate-lite` (a",
  );
  lines.push(
    "committed, zero-dependency `.mjs` esbuild bundle, run through a small bash shim). It runs under",
  );
  lines.push(
    "plain `node >= 20` — there is **no install step, no `npm install`, and no `node_modules`**. This",
  );
  lines.push(
    "is a SEPARATE distribution channel from the published npm package (`npx -y agentstate-lite`);",
  );
  lines.push("both wrap the identical CLI source, so behavior and output are identical.");
  lines.push("");
  lines.push("## Invocation — it is NOT on PATH");
  lines.push("");
  lines.push(
    "The bundle is **not** on your `PATH`, and it does **not** live at a fixed path — the bundle may",
  );
  lines.push(
    "ship inside a version-keyed plugin cache, so a bare `scripts/agentstate-lite` does **not**",
  );
  lines.push(
    "resolve from an arbitrary cwd. Resolve its absolute path once, with this one-line resolver, then",
  );
  lines.push(`use \`${ASLITE}\` in every command:`);
  lines.push("");
  lines.push("```bash");
  lines.push('ASLITE="$(command -v agentstate-lite 2>/dev/null || ls -d \\');
  lines.push('  "$HOME"/.claude/skills/agentstate-lite/scripts/agentstate-lite \\');
  lines.push('  "$HOME"/.claude/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite/scripts/agentstate-lite \\');
  lines.push("  2>/dev/null | sort -V | tail -1)\"");
  lines.push(`${ASLITE} --help`);
  lines.push("```");
  lines.push("");
  lines.push(
    "`command -v` short-circuits if a future install ever puts `agentstate-lite` on `PATH`; otherwise",
  );
  lines.push(
    "the glob checks both a direct skill install (`~/.claude/skills/…`) and a plugin-marketplace",
  );
  lines.push(
    "cache install (`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/agentstate-lite/scripts/…` — the cache copies the PLUGIN DIR's contents, so there is no `plugins/` segment), and",
  );
  lines.push(
    "`sort -V | tail -1` selects the highest installed version. This works from any cwd. Resolve to",
  );
  lines.push("the **shim** (not the `.mjs` directly) so the Node >= 20 floor guard runs first.");
  lines.push("");
  lines.push(
    "> If your harness happens to export `${CLAUDE_PLUGIN_ROOT}` you may instead use",
  );
  lines.push(
    '> `"$CLAUDE_PLUGIN_ROOT/skills/agentstate-lite/scripts/agentstate-lite"`, but it is **often unset**',
  );
  lines.push("> in an agent shell — do not rely on it; prefer the resolver above.");
  lines.push("");
  lines.push(
    "**Runtime-hint note.** Every follow-up command the CLI itself prints (`help:` fields, error",
  );
  lines.push(
    "hints) uses its own resolved invocation. Off `PATH`, running the skill bundle now prints its own",
  );
  lines.push(
    "resolved absolute path there — directly runnable as printed, no substitution needed. If a bare",
  );
  lines.push(
    "`agentstate-lite` or an `npx -y agentstate-lite …` prefix ever shows up instead (e.g. a",
  );
  lines.push(
    `different install answered the \`PATH\` probe), swap that leading token for \`${ASLITE}\` and run`,
  );
  lines.push("the rest of the line unchanged.");
  lines.push("");
  lines.push(
    "<!-- GENERATED from src/reference.ts by scripts/gen-skill.mjs --target skill — do not edit by hand. -->",
  );
  lines.push("");
  lines.push(...renderCommandsSection(COMMAND_GROUPS, ASLITE));
  lines.push(...renderWorkspaceLocation(ASLITE));
  lines.push(...renderTypicalFlow(ASLITE));
  lines.push(...renderSyncSection(ASLITE));
  lines.push("## Remote (--remote, serve, identity, invites, keys)");
  lines.push("");
  lines.push(
    "Every remote-facing command ships in the SAME bundle, wired the same way as `--dir` — `serve`,",
  );
  lines.push(
    "`--remote <url>` on any bundle-facing command, plus `login` / `join` / `whoami` / `invite` /",
  );
  lines.push(`\`member\` / \`key\` all work identically through \`${ASLITE}\`. Credentials are stored at`);
  lines.push("`~/.agentstate/` (0600/0700 discipline), never printed.");
  lines.push("");
  lines.push("```bash");
  lines.push(`${ASLITE} serve --dir ./my-bundle --port 4818 &`);
  lines.push(`${ASLITE} list --remote http://127.0.0.1:4818`);
  lines.push("```");
  lines.push("");
  lines.push(
    "The wire-protocol v0.1 contract `serve` implements is documented as a project bundle doc, not",
  );
  lines.push(
    "(yet) shipped in this skill's references — `serve`'s own source is the authoritative reference",
  );
  lines.push("implementation in the meantime.");
  lines.push("");
  lines.push(...renderShippedReferencesSection());
  lines.push(...renderBundlePagesSection());
  lines.push(...renderNotesSection(SKILL_NOTES_ADDENDUM));
  return lines.join("\n");
}
