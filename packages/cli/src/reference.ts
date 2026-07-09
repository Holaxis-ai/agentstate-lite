// SINGLE SOURCE OF TRUTH for the CLI's self-description.
//
// `DESCRIPTION` + `COMMAND_GROUPS` feed two consumers that therefore CANNOT drift:
//   1. the zero-arg `home` view (identity header + command reference),
//   2. the `--help` / `-h` / `help` reference.
//
// Neither `home` nor `--help` may hardcode a command list — both derive from `COMMAND_GROUPS` via the
// pure `commandReference()` projector below. Adding/removing a command here updates every consumer at
// once. This module is pure data + a pure projection: NO I/O, NO imports beyond TypeScript types.
//
// `--help` renders `commandReference()`'s output as PLAIN PROSE via `helpIndexText()` (grouped
// headings, one command per physical line) — never TOON. Field feedback (external-agent session,
// help-index-readability task) found the previous rendering (TOON-encoding the same data) crammed
// every group's commands into one escaped string-array value per line, forcing an agent to grep a
// giant line instead of reading it; subcommand help (e.g. `new --help`) is plain prose and was
// praised by the same agent. Help is prose an agent READS, not data it parses — TOON stays the
// default for actual data surfaces (`list`, `status`, …), never for this index. `home` keeps
// rendering `compactCommandReference()`'s command NAMES as TOON (it is real per-session state —
// bundle summary, auth status — not a help manual), so this is a renderer change scoped to `--help`
// alone; the registry (`COMMAND_GROUPS`) and `commandReference()`'s projection are untouched.
//
// Adapted from holaxis-agentstate `packages/cli/src/reference.ts`, retargeted from the promote/pull
// command set to the OKF-native bundle command set.

/** The one-sentence tagline. */
export const DESCRIPTION =
  "read and write a local OKF knowledge bundle (context notes, docs, cross-links, static-HTML view)";

/** A single command's usage line + a one-line summary of what it does. */
export interface CommandRef {
  usage: string;
  summary: string;
}

/** A named group of related commands (e.g. "Bundle", "Notes & Docs", "Session"). */
export interface CommandGroup {
  group: string;
  commands: CommandRef[];
}

/**
 * Every command the CLI exposes, grouped for display. This is the ONLY place the command list is
 * enumerated.
 */
export const COMMAND_GROUPS: CommandGroup[] = [
  {
    group: "Bundle",
    commands: [
      {
        usage: "init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]",
        summary:
          "Create (or open) an OKF knowledge bundle in a directory — greenfield setup; a project that already shares a board is set up by sync, not init",
      },
      {
        usage: "view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]",
        summary: "Bake the bundle into one self-contained static HTML file",
      },
      {
        usage: "status [--limit <n>] [--remote <url>]",
        summary: "Read-only bundle health report (kind lint, unresolved links, orphans, staleness, graph lints)",
      },
    ],
  },
  {
    group: "Documents & links",
    commands: [
      {
        usage:
          "doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [--actor <n>] [--remote <url>]",
        summary: "Write a generic OKF concept document",
      },
      {
        usage:
          "doc update <id> [--<field> <value> ...] [--title <t>] [--tag <t>] [--type <t>] [--body <s> | --body-file <p>] [--expected-version <v>] [--actor <n>] [--remote <url>]",
        summary: "Patch given fields (incl. kind-declared fields like --status) of an existing doc, preserving the rest; optimistic-CAS with --expected-version",
      },
      {
        usage: "doc read <id> [--out (<path> | -) | --field <name>] [--remote <url>]",
        summary: "Read a doc (or pull its raw markdown bytes to disk, or print one raw field for scripting)",
      },
      {
        usage: "doc history <id> [--remote <url>]",
        summary: "Show a doc's attributed version history (newest first) — the tokens for --expected-version",
      },
      {
        usage: "doc delete <id> [--expected-version <v>] [--remote <url>]",
        summary: "Hard-delete a doc (idempotent: absent -> deleted:false, exit 0)",
      },
      {
        usage: "list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--open] [--limit <n>] [--remote <url>]",
        summary:
          "Query concepts over their frontmatter (alias: query) — a comma in --field's value is set membership (OR); --open excludes terminal instances (declared kinds only)",
      },
      {
        usage: "link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>]) [--remote <url>]",
        summary: "Add a cross-link, or show a concept's links + backlinks (each carrying link text; --text filters both directions by exact match)",
      },
    ],
  },
  {
    group: "Artifacts",
    commands: [
      {
        usage:
          "promote <file> --doc-key <key> [--content-type <mime>] [--expected-version <v>] [--remote <url>]",
        summary: "Move a local file's bytes into the store (a .md key routes through the engine; else a blob)",
      },
      {
        usage: "pull --doc-key <key> --out (<path> | -) [--remote <url>]",
        summary: "Pull a doc's canonical form or a blob's raw bytes out of the store (the reverse of promote)",
      },
      {
        usage: "blobs [--prefix <p>] [--limit <n>] [--remote <url>]",
        summary: "List the store's blob (non-document) keys (documents are listed by 'list'/'query')",
      },
      {
        usage: "delete --doc-key <key> [--expected-version <v>] [--remote <url>]",
        summary: "Hard-delete a doc or blob by key (idempotent: absent -> deleted:false, exit 0)",
      },
    ],
  },
  {
    group: "Kinds",
    commands: [
      {
        usage:
          'new "<Kind>" <id> --<field> <value> [...] [--link "<type>=<target-id>" ...] [--no-prefix] [--actor <n>] [--remote <url>]',
        summary:
          'Create a new instance of a bundle-declared kind — e.g. new "Context Note" <id> for a note (validates strictly); repeatable --link wires typed cross-links in the same step',
      },
      {
        usage: "kinds [--remote <url>]",
        summary: "List the kind conventions this bundle declares (required/optional fields, typed-link vocabulary, horizon)",
      },
      {
        usage: 'kind field "<Kind>" (add <name> [--required] [--values <a,b,c>] | remove <name>) [--remote <url>]',
        summary: "Edit a kind's schema — add/remove a declared field or enum value on its convention (idempotent)",
      },
      {
        usage: "recipes [--remote <url>]",
        summary: "List built-in recipes and whether each is already applied to this bundle",
      },
      {
        usage: "recipe add <name-or-path> [--remote <url>]",
        summary: "Apply a recipe's (built-in name or folder path) convention docs to the bundle (idempotent)",
      },
    ],
  },
  {
    group: "Remote",
    commands: [
      {
        usage: "serve [--dir <path>] [--host <h>] [--port <p>]",
        summary: "Boot the reference wire-protocol server over a local bundle (loopback, no auth)",
      },
      {
        usage: "ui [--dir <path> | --remote <url>] [--port <p>] [--open]",
        summary: "Boot the local web UI (board / doc detail / admin / graph) — same origin, loopback-only",
      },
      {
        // NOTE: `sync --migrate` (TEMPORARY, founders' one-time act — see commands/sync-migrate.ts)
        // is deliberately ABSENT here: it appears in `sync --help` only (discoverable, not taught),
        // so the skill channels and the compact reference never teach it.
        usage: "sync [--pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]",
        summary:
          "Share the board branch with a remote — commits, pulls, and pushes (git tier; --pull-only skips commit+push). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch. Board-reading commands (list/doc read/status/home/link show) auto-run the ff-only pull when board state is >~5m stale — silent, bounded (~2s), never a push; AGENTSTATE_LITE_NO_AUTOPULL=<any value, even 0> disables it",
      },
    ],
  },
  {
    group: "Identity",
    commands: [
      {
        usage: "login --remote <url> --api-key <key>",
        summary: "Store an API key for a gated --remote deployment (keyed by origin; join redeems an invite instead)",
      },
      {
        usage: "join --remote <url> --invite <token> [--display <name>]",
        summary: "Redeem an invite token to join a remote bundle (stores the returned API key; never prints it)",
      },
      {
        usage: "whoami [--remote <url>]",
        summary:
          "List the remote origins you hold a key for (offline), or (with --remote) the live remote identity + bundle memberships",
      },
    ],
  },
  {
    group: "Invites & members (admin)",
    commands: [
      {
        usage:
          "invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]",
        summary: "Create a join invite for a remote bundle (prints the token once)",
      },
      {
        usage: "invite list --remote <url> [--fields <a,b|all>]",
        summary: "List invites (minimal id/role/expires/status by default; --fields all for the full record)",
      },
      {
        usage: "invite revoke --remote <url> <invite_id>",
        summary: "Revoke an invite (idempotent)",
      },
      {
        usage: "member list --remote <url>",
        summary: "List a remote bundle's members and their roles",
      },
      {
        usage: "member set-role --remote <url> <user_id> <role>",
        summary: "Change a member's role (idempotent)",
      },
      {
        usage: "member remove --remote <url> <user_id>",
        summary: "Remove a member and revoke all their API keys (idempotent)",
      },
    ],
  },
  {
    group: "API keys",
    commands: [
      {
        usage: "key mint --remote <url> [--label <s>]",
        summary: "Mint an API key for YOURSELF (self-serve; any member may do this)",
      },
      {
        usage: "key mint --remote <url> --agent <name> [--label <s>]",
        summary: "Mint a NEW agent user's first key (admin-only; prints the key once)",
      },
      {
        usage: "key list --remote <url> [--fields <a,b|all>]",
        summary: "List API keys (minimal id/prefix/label/status; --fields all for more — never the secret)",
      },
      {
        usage: "key revoke --remote <url> <key_id>",
        summary: "Revoke an API key you own, or (admin) any key (idempotent)",
      },
    ],
  },
  {
    group: "Session",
    commands: [
      {
        usage: "session-start [--dir <path>]",
        summary:
          "The SessionStart hook payload: a time-boxed best-effort board pull, then the home view — every pull failure falls through to the render (exit 0)",
      },
      {
        usage: "hook install|status|uninstall [--scope project|global]",
        summary: "Install the SessionStart hook (runs session-start: pull the board, then render) for Claude Code, Codex, OpenCode",
      },
    ],
  },
];

/**
 * Static pointer TEMPLATE (no bundle I/O) from the offline `--help`/`home` views toward the live
 * kind-convention registry. Kind conventions are declared PER-BUNDLE (a `Convention` doc under
 * `conventions/`), so enumerating them requires a live registry load — which `--help`/`home` may
 * never do (they are pure/offline by contract, see `home.ts`'s OFFLINE GUARANTEE). The Phase-0 CLI
 * grammar experiment (kind-conventions plan, Part B) found this pointer is the causal ingredient:
 * subjects with NO discoverable path from help toward the registry spiraled into ~49-command probes;
 * this one static line, paired with the live `kinds` command, closed that gap.
 *
 * Takes the RESOLVED invocation prefix as a plain string argument rather than resolving it itself
 * (that would mean importing `invocation.ts`'s filesystem/PATH resolution into this module, breaking
 * its "NO I/O, NO imports beyond TypeScript types" contract) — every call site already resolves one
 * (`cliInvocation()` in `cli.ts`, `deps.invocation()` in `home.ts`) for its OTHER emitted hints, so
 * this is purely a projection of a value the caller already has.
 */
export function kindsPointer(invocation: string): string {
  return `kinds are declared per-bundle — run \`${invocation} kinds\` to list them`;
}

/**
 * Static pointer describing the full bundle-resolution precedence chain (Stage-1 Unit 2a Part C,
 * A9's `AGENTSTATE_LITE_REMOTE`, extended by item 43's committed `.agentstate.json` project
 * binding) — shown alongside the command reference in BOTH `--help` and the home view (no bundle
 * I/O needed to state it), so an agent that has already run `serve`, or is working in a bound
 * project it just cloned, discovers the bare-command shortcut without re-reading every
 * remote-capable command's full usage text. No `invocation` parameter (unlike {@link kindsPointer}):
 * the message names the env var/file itself, not a runnable command.
 */
export function remoteEnvPointer(): string {
  return (
    "bundle resolution, in order: an explicit --remote/--dir flag wins outright; else " +
    "AGENTSTATE_LITE_REMOTE=<url> sets a session remote default; else a committed .agentstate.json " +
    '({ "bundle": "<url-or-path>" }) at or above the cwd is read (a URL resolves like --remote, a ' +
    "path like --dir, relative to the file's own directory); else local discovery walks up from the " +
    "cwd for index.md. Explicit beats ambient beats committed beats discovered: an explicit --dir " +
    "always wins over BOTH the env default and the project binding, silently, no error — only an " +
    "explicit --remote together with an explicit --dir is still a conflict"
  );
}

/** A renderable command reference: group name -> array of "usage — summary" lines. */
export interface CommandReference {
  commands: Record<string, string[]>;
  /** See {@link kindsPointer}. */
  kinds: string;
  /** See {@link remoteEnvPointer}. */
  remoteEnv: string;
}

/**
 * Project COMMAND_GROUPS into a renderable plain object — the shared shape both the home view and the
 * `--help` reference render, so they cannot diverge. Pure: derives entirely from COMMAND_GROUPS plus
 * the caller-supplied `invocation` prefix (see {@link kindsPointer}).
 */
export function commandReference(invocation: string): CommandReference {
  const commands: Record<string, string[]> = {};
  for (const { group, commands: refs } of COMMAND_GROUPS) {
    commands[group] = refs.map((c) => `${c.usage} — ${c.summary}`);
  }
  return { commands, kinds: kindsPointer(invocation), remoteEnv: remoteEnvPointer() };
}

/** The leading command word(s) of a usage string, up to its first argument/flag/option token. */
function commandName(usage: string): string {
  const stop = usage.search(/[<[("]|\s--|\s-\w/);
  return (stop === -1 ? usage : usage.slice(0, stop)).trim();
}

/**
 * A COMPACT command list for the home view — which IS the SessionStart hook payload, so it must stay
 * token-lean (AXI §7 "ruthlessly minimize"). Each group maps to its command NAMES only (no
 * usage/summary): discoverability of WHAT commands exist is preserved (every name is visible) while
 * the verbose per-command reference — which the full `--help` still carries — is dropped, cutting the
 * every-session payload substantially. A comprehensive UX audit flagged the full reference (~1.6k
 * tokens) rendering on every session as the single worst §7 violation.
 */
export function compactCommandReference(invocation: string): {
  commands: Record<string, string>;
  commands_help: string;
} {
  const commands: Record<string, string> = {};
  for (const { group, commands: refs } of COMMAND_GROUPS) {
    // Set-dedupe: usage VARIANTS of one command (e.g. key mint self-serve vs --agent) collapse to
    // the same name here, and a name-only view gains nothing from repeating it ("key mint, key mint").
    commands[group] = [...new Set(refs.map((c) => commandName(c.usage)))].join(", ");
  }
  return {
    commands,
    commands_help: `run \`${invocation} <command> --help\` (or \`${invocation} --help\`) for full usage`,
  };
}

/**
 * Word-wrap `text` to `width` columns, breaking only at existing spaces (never mid-word). Pure, no
 * I/O. Used solely to keep the footer pointers ({@link kindsPointer}, {@link remoteEnvPointer}) —
 * each authored as one long single-line string — readable as wrapped prose in `helpIndexText()`
 * instead of one unbroken line; command usage/summary lines are deliberately left un-wrapped (see
 * {@link helpIndexText}'s comment).
 */
export function wrapText(text: string, width = 96): string {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wrapped: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line.length === 0 ? word : `${line} ${word}`;
    if (candidate.length > width && line.length > 0) {
      wrapped.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line.length > 0) wrapped.push(line);
  return wrapped.join("\n");
}

/**
 * The `--help` / `-h` / `help` INDEX: `commandReference()`'s data rendered as grouped PLAIN TEXT —
 * a heading per group, one command per physical line (its usage synopsis and one-line summary
 * joined by " — ", exactly as `commandReference()` already composes them — only the OUTPUT FORMAT
 * changes here, from a TOON-encoded object to prose). Command lines are intentionally left
 * un-wrapped (some usage+summary pairs are long; splitting them across physical lines would break
 * the "one command per line" property this rewrite exists to deliver) — only the free-prose footer
 * pointers are wrapped, via {@link wrapText}. Pure: derives entirely from {@link commandReference}
 * plus the caller-supplied `invocation` prefix; no I/O.
 */
export function helpIndexText(invocation: string): string {
  const ref = commandReference(invocation);
  const lines: string[] = [
    `${invocation} — ${DESCRIPTION}`,
    "",
    `Usage: ${invocation} <command> [options]`,
    `Run \`${invocation} <command> --help\` for a specific command's full reference.`,
  ];
  for (const [group, commandLines] of Object.entries(ref.commands)) {
    lines.push("", `${group}:`);
    for (const commandLine of commandLines) {
      lines.push(`  ${commandLine}`);
    }
  }
  lines.push("", wrapText(ref.kinds), "", wrapText(ref.remoteEnv));
  return `${lines.join("\n")}\n`;
}
