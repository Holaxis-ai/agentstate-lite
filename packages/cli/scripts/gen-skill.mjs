// Generate a SKILL.md from the CLI's single source of truth (src/reference.ts COMMAND_GROUPS).
//
// AXI §7 "single source of truth": every installable channel's command reference is DERIVED from
// the same COMMAND_GROUPS the home view + `--help` render, so it can never drift. Two TARGETS:
//
//   --target npm   (default) → packages/cli/SKILL.md, examples prefixed `npx -y agentstate-lite`
//                    (the published-package channel; installed with no bin-on-PATH assumption).
//   --target skill            → skills/agentstate-lite/SKILL.md, examples prefixed `"$ASLITE"`
//                    (the self-contained committed-bundle channel; see the resolver section it
//                    generates — the bundle is not on PATH, so examples reference the resolved
//                    shim path via the shell variable convention).
//
// The `## Commands` loop is IDENTICAL between targets (rendered by the same renderCommandsSection
// helper, parameterized only by the invocation prefix) — the two SKILL.md files can describe
// different distribution channels but can never list different commands.
//
//   node scripts/gen-skill.mjs [--target npm|skill]           → (re)write the target's SKILL.md
//   node scripts/gen-skill.mjs [--target npm|skill] --check   → exit 1 if stale (CI drift gate)
//
// reference.ts is pure data (no runtime imports), so we bundle it in-memory with esbuild and import
// the result as a data: URL — no temp files, no pre-build.
import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const referenceTs = resolve(here, "../src/reference.ts");
const PKG = "agentstate-lite";
const NPX = `npx -y ${PKG}`;
const ASLITE = '"$ASLITE"';

const targetArgIdx = process.argv.indexOf("--target");
const TARGET = targetArgIdx !== -1 ? process.argv[targetArgIdx + 1] : "npm";
if (TARGET !== "npm" && TARGET !== "skill") {
  console.error(`--target must be "npm" or "skill" (got "${TARGET}")`);
  process.exit(2);
}

const skillPath =
  TARGET === "npm"
    ? resolve(here, "../SKILL.md")
    // packages/cli/scripts -> repo root -> skills/agentstate-lite/SKILL.md
    : resolve(here, "../../../skills/agentstate-lite/SKILL.md");

async function loadReference() {
  const out = await build({
    entryPoints: [referenceTs],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const code = out.outputFiles[0].text;
  return import(`data:text/javascript,${encodeURIComponent(code)}`);
}

// ---------------------------------------------------------------------------------------------
// Shared projections (single source: COMMAND_GROUPS), parameterized only by invocation prefix.
// ---------------------------------------------------------------------------------------------

function renderCommandsSection(COMMAND_GROUPS, prefix) {
  const lines = [];
  lines.push("## Commands");
  lines.push("");
  for (const { group, commands } of COMMAND_GROUPS) {
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

function renderTypicalFlow(prefix) {
  const lines = [];
  lines.push("## Typical flow");
  lines.push("");
  lines.push("```sh");
  lines.push(`# Create a bundle in the current directory`);
  lines.push(`${prefix} init`);
  lines.push("");
  lines.push(`# Create a context note (an OKF concept) for the next session`);
  lines.push(`${prefix} new "Context Note" cycle-1 --title "cycle-1"`);
  lines.push(`${prefix} doc update context-notes/cycle-1 --body "What this session did and what's next"`);
  lines.push("");
  lines.push(`# Read it back`);
  lines.push(`${prefix} doc read context-notes/cycle-1`);
  lines.push("");
  lines.push(`# Store a doc, cross-link it, and query the bundle`);
  lines.push(`${prefix} doc write specs/auth --type Spec --title "Auth" --body "…"`);
  lines.push(`${prefix} link add specs/auth context-notes/cycle-1`);
  lines.push(`${prefix} list --type Spec`);
  lines.push("");
  lines.push(`# Bake a shareable, self-contained HTML view of the whole bundle`);
  lines.push(`${prefix} view`);
  lines.push("```");
  lines.push("");
  return lines;
}

function renderNotesSection() {
  const lines = [];
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
    "- `hook install` registers a SessionStart home-view hook for Claude Code, Codex, and OpenCode so a",
  );
  lines.push("  new session starts with the bundle's state already in context.");
  lines.push("");
  return lines;
}

// ---------------------------------------------------------------------------------------------
// npm target — packages/cli/SKILL.md, published-package channel.
// ---------------------------------------------------------------------------------------------

function renderNpm(DESCRIPTION, COMMAND_GROUPS) {
  const lines = [];
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
  lines.push(`  query a bundle, or bake a shareable HTML view. Runs standalone via \`${NPX}\`.`);
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
  lines.push(...renderTypicalFlow(NPX));
  lines.push(...renderNotesSection());
  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------------
// skill target — skills/agentstate-lite/SKILL.md, self-contained committed-bundle channel
// (`npx skills add`). Mirrors the resolver pattern of the reference `holaxis-agentstate` skill.
// ---------------------------------------------------------------------------------------------

function renderSkill(DESCRIPTION, COMMAND_GROUPS) {
  const lines = [];
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
    "  decision/spec as a doc, link concepts, query a bundle, run a local wire-protocol server",
  );
  lines.push("  (`serve` / `--remote`), or bake a shareable HTML view.");
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
    "cache install (`~/.claude/plugins/cache/…/skills/agentstate-lite/scripts/…`), and",
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
  lines.push(...renderTypicalFlow(ASLITE));
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
  lines.push(...renderNotesSection());
  return lines.join("\n");
}

const { DESCRIPTION, COMMAND_GROUPS } = await loadReference();
const content = TARGET === "npm" ? renderNpm(DESCRIPTION, COMMAND_GROUPS) : renderSkill(DESCRIPTION, COMMAND_GROUPS);

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = await readFile(skillPath, "utf8");
  } catch {
    /* missing → stale */
  }
  if (current !== content) {
    console.error(`${skillPath} is stale — run \`node scripts/gen-skill.mjs --target ${TARGET}\` to regenerate.`);
    process.exit(1);
  }
  console.log(`${skillPath} is up to date.`);
} else {
  await writeFile(skillPath, content);
  console.log(`wrote ${skillPath}`);
}
