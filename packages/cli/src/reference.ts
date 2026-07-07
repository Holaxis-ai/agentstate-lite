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
        usage: "init [--dir <path>] [--okf-version <v>]",
        summary: "Create (or open) an OKF knowledge bundle in a directory",
      },
      {
        usage: "view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]",
        summary: "Bake the bundle into one self-contained static HTML file",
      },
      {
        usage: "status [--limit <n>] [--remote <url>]",
        summary: "Read-only bundle health report (kind lint, unresolved links, orphans, staleness)",
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
        usage: "list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--limit <n>] [--remote <url>]",
        summary: "Query concepts over their frontmatter (alias: query)",
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
        usage: 'new "<Kind>" <id> --<field> <value> [...] [--no-prefix] [--actor <n>] [--remote <url>]',
        summary: 'Create a new instance of a bundle-declared kind — e.g. new "Context Note" <id> for a note (validates strictly)',
      },
      {
        usage: "kinds [--remote <url>]",
        summary: "List the kind conventions this bundle declares (required/optional fields, horizon)",
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
        usage: "sync [options]",
        summary: "Sync the bundle with a remote (NOT YET IMPLEMENTED)",
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
        usage: "hook install|status|uninstall [--scope project|global]",
        summary: "Install the SessionStart home-view hook (Claude Code, Codex, OpenCode)",
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
    commands[group] = refs.map((c) => commandName(c.usage)).join(", ");
  }
  return {
    commands,
    commands_help: `run \`${invocation} <command> --help\` (or \`${invocation} --help\`) for full usage`,
  };
}
