import { isAbsolute, normalize, sep } from "node:path";

/** Compatibility states shared by status, install reconciliation, probes, and uninstall. */
export type HookCompatibilityState =
  | "current"
  | "stale"
  | "legacy_path_bound"
  | "absent"
  | "unmanaged";

export interface HookCompatibility {
  state: HookCompatibilityState;
  reason: string;
  remedy?: string;
}

export interface HookEntryLike {
  type?: unknown;
  command?: unknown;
  timeout?: unknown;
}

export interface HookEntryContext {
  entry: HookEntryLike | undefined;
  location: "SessionStart" | "session_start";
  matcher?: unknown;
  timeoutSeconds: number;
}

const CURRENT_REMEDY = "re-run `aslite hook install` from the durable global npm installation";

function result(
  state: HookCompatibilityState,
  reason: string,
  remedy: string | undefined = state === "stale" || state === "legacy_path_bound"
    ? CURRENT_REMEDY
    : undefined,
): HookCompatibility {
  return { state, reason, ...(remedy ? { remedy } : {}) };
}

/**
 * Tokenize only the deliberately small POSIX-shell subset emitted by this project. This is not a
 * general shell parser: control operators, substitutions, redirects, escapes in unquoted text,
 * and unterminated quotes are rejected so a merely similar hand-authored command is never owned.
 */
export function tokenizeGeneratedHookCommand(command: string): string[] | undefined {
  if (command.length === 0 || command.startsWith(" ") || command.endsWith(" ")) return undefined;
  const tokens: string[] = [];
  let i = 0;
  while (i < command.length) {
    let token = "";
    let consumed = false;
    while (i < command.length && command[i] !== " ") {
      consumed = true;
      const ch = command[i]!;
      if (ch === "'") {
        const end = command.indexOf("'", i + 1);
        if (end < 0) return undefined;
        token += command.slice(i + 1, end);
        i = end + 1;
        continue;
      }
      if (ch === '"') {
        i += 1;
        let closed = false;
        while (i < command.length) {
          const inner = command[i]!;
          if (inner === '"') {
            closed = true;
            i += 1;
            break;
          }
          const code = inner.charCodeAt(0);
          if (code < 0x20 || code === 0x7f) return undefined;
          if (inner === "$" || inner === "`") return undefined;
          if (inner === "\\") {
            const next = command[i + 1];
            if (next === undefined) return undefined;
            // POSIX double quotes only consume a backslash before $, `, ", or another backslash.
            // For every other character the backslash is literal; JSON.parse would incorrectly turn forms
            // such as `\u0061` into a different executable and could falsely claim ownership.
            if (next === "$" || next === "`" || next === '"' || next === "\\") {
              token += next;
              i += 2;
              continue;
            }
            token += "\\";
            i += 1;
            continue;
          }
          token += inner;
          i += 1;
        }
        if (!closed) return undefined;
        continue;
      }
      if (ch === "\\" && command[i + 1] === "'") {
        token += "'";
        i += 2;
        continue;
      }
      const code = ch.charCodeAt(0);
      if (code < 0x20 || code === 0x7f || /[;&|<>`$()\\]/.test(ch)) return undefined;
      token += ch;
      i += 1;
    }
    if (!consumed) return undefined;
    if ([...token].some((ch) => ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f)) {
      return undefined;
    }
    tokens.push(token);
    if (i < command.length) {
      i += 1;
      if (i === command.length || command[i] === " ") return undefined;
    }
  }
  return tokens.length > 0 ? tokens : undefined;
}

function isBareManagedBin(value: string): boolean {
  return value === "aslite" || value === "agentstate-lite";
}

type ManagedExecutableLayout = "npm" | "local_dev" | "marketplace";

function managedExecutableLayout(value: string): ManagedExecutableLayout | undefined {
  if (!isAbsolute(value)) return undefined;
  const normalized = normalize(value);
  const portable = normalized.split(sep).join("/");
  if (
    /\/node_modules\/(?:@holaxis\/aslite|aslite|agentstate-lite)\/dist\/agentstate-lite\.mjs$/.test(portable)
  ) {
    return "npm";
  }
  if (/\/packages\/cli\/dist\/agentstate-lite\.mjs$/.test(portable)) return "local_dev";
  if (
    /\/(?:\.claude|\.codex)\/plugins\/cache\/.+\/skills\/agentstate-lite\/scripts\/agentstate-lite\.mjs$/.test(portable) ||
    /\/plugins\/agentstate-lite\/skills\/agentstate-lite\/scripts\/agentstate-lite\.mjs$/.test(portable)
  ) {
    return "marketplace";
  }
  return undefined;
}

function stableNpmRuntimePair(program: string, executable: string): boolean {
  if (!isAbsolute(program) || !isAbsolute(executable)) return false;
  const runtimeSuffix = `${sep}bin${sep}node`;
  const executableSuffix = `${sep}lib${sep}node_modules${sep}@holaxis${sep}aslite${sep}dist${sep}agentstate-lite.mjs`;
  if (!program.endsWith(runtimeSuffix) || !executable.endsWith(executableSuffix)) return false;
  return program.slice(0, -runtimeSuffix.length) === executable.slice(0, -executableSuffix.length);
}

/** Classify a complete command token sequence; near-matches are always unmanaged. */
export function classifyHookCommand(command: string): HookCompatibility {
  const tokens = tokenizeGeneratedHookCommand(command);
  if (!tokens) return result("unmanaged", "command is outside the generated-command grammar");

  if (
    tokens.length === 3 &&
    stableNpmRuntimePair(tokens[0]!, tokens[1]!) &&
    tokens[2] === "session-start"
  ) {
    return result("current", "command uses the stable npm-prefix Node launcher and package entry");
  }

  if (tokens.length === 2 && isBareManagedBin(tokens[0]!) && tokens[1] === "session-start") {
    return result("legacy_path_bound", "recognized historical generated command depends on ambient PATH");
  }
  if (tokens.length === 1 && isBareManagedBin(tokens[0]!)) {
    return result("stale", "recognized pre-session-start generated bare-bin command");
  }

  if (tokens.length === 2 && managedExecutableLayout(tokens[0]!) && tokens[1] === "session-start") {
    return result("legacy_path_bound", "recognized generated direct-executable command bound to one path");
  }
  if (tokens.length === 1 && managedExecutableLayout(tokens[0]!)) {
    return result("stale", "recognized pre-session-start generated direct-executable command");
  }

  const legacyNpx =
    tokens.length >= 3 &&
    tokens[0] === "npx" &&
    tokens[1] === "-y" &&
    (tokens[2] === "agentstate-lite" || tokens[2] === "@holaxis/agentstate-lite");
  if (legacyNpx && tokens.length === 4 && tokens[3] === "session-start") {
    return result("legacy_path_bound", "recognized historical generated npx session-start command");
  }
  if (legacyNpx && tokens.length === 3) {
    return result("stale", "recognized pre-session-start generated npx command");
  }

  if (
    tokens.length === 3 &&
    isAbsolute(tokens[0]!) &&
    normalize(tokens[0]!).endsWith(`${sep}bin${sep}node`) &&
    managedExecutableLayout(tokens[1]!) !== undefined &&
    tokens[2] === "session-start"
  ) {
    return result("current", "recognized generated PATH-independent Node launch");
  }

  return result("unmanaged", "command is not an exact generated agentstate-lite form");
}

/** Classify command ownership together with the host hook shape the generator owns. */
export function classifyHookEntry(context: HookEntryContext): HookCompatibility {
  const command = context.entry?.command;
  if (typeof command !== "string") return result("unmanaged", "entry has no generated command string");
  const commandCompatibility = classifyHookCommand(command);
  if (commandCompatibility.state === "unmanaged") return commandCompatibility;
  const exactEntryShape =
    context.entry?.type === "command" && context.entry?.timeout === context.timeoutSeconds;
  if (!exactEntryShape) {
    return result("unmanaged", "recognized command appears in an unknown hook entry shape");
  }
  if (context.location === "session_start") {
    return result("stale", "recognized generated command has a historical or non-current hook shape");
  }
  if (context.matcher !== "") {
    return result("unmanaged", "recognized command appears under an unknown SessionStart matcher");
  }
  return commandCompatibility;
}

export function isOwnedHookCompatibility(compatibility: HookCompatibility): boolean {
  return compatibility.state !== "absent" && compatibility.state !== "unmanaged";
}
