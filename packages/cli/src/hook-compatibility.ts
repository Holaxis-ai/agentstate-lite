import { basename, isAbsolute, normalize, sep } from "node:path";

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
  expectedCommand?: string;
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
  const tokens: string[] = [];
  let i = 0;
  while (i < command.length) {
    while (i < command.length && /\s/.test(command[i]!)) i += 1;
    if (i === command.length) break;
    let token = "";
    let consumed = false;
    while (i < command.length && !/\s/.test(command[i]!)) {
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
        const start = i;
        i += 1;
        let escaped = false;
        while (i < command.length) {
          const inner = command[i]!;
          if (!escaped && inner === '"') break;
          if (!escaped && inner === "\\") escaped = true;
          else escaped = false;
          i += 1;
        }
        if (i >= command.length) return undefined;
        try {
          token += JSON.parse(command.slice(start, i + 1)) as string;
        } catch {
          return undefined;
        }
        i += 1;
        continue;
      }
      if (ch === "\\" && command[i + 1] === "'") {
        token += "'";
        i += 2;
        continue;
      }
      if (/[;&|<>`$()\\]/.test(ch)) return undefined;
      token += ch;
      i += 1;
    }
    if (!consumed) return undefined;
    tokens.push(token);
  }
  return tokens.length > 0 ? tokens : undefined;
}

function isBareManagedBin(value: string): boolean {
  return value === "aslite" || value === "agentstate-lite";
}

function isKnownAbsoluteManagedExecutable(value: string): boolean {
  if (!isAbsolute(value)) return false;
  const normalized = normalize(value);
  const name = basename(normalized);
  if (name === "aslite" || name === "agentstate-lite") return true;
  return name === "agentstate-lite.mjs";
}

function stableNpmRuntimePair(program: string, executable: string): boolean {
  if (!isAbsolute(program) || !isAbsolute(executable)) return false;
  const runtimeSuffix = `${sep}bin${sep}node`;
  const executableSuffix = `${sep}lib${sep}node_modules${sep}@holaxis${sep}aslite${sep}dist${sep}agentstate-lite.mjs`;
  if (!program.endsWith(runtimeSuffix) || !executable.endsWith(executableSuffix)) return false;
  return program.slice(0, -runtimeSuffix.length) === executable.slice(0, -executableSuffix.length);
}

/** Classify a complete command token sequence; near-matches are always unmanaged. */
export function classifyHookCommand(
  command: string,
  expectedCommand?: string,
): HookCompatibility {
  const tokens = tokenizeGeneratedHookCommand(command);
  if (!tokens) return result("unmanaged", "command is outside the generated-command grammar");

  if (expectedCommand !== undefined) {
    const expected = tokenizeGeneratedHookCommand(expectedCommand);
    if (expected && tokens.length === expected.length && tokens.every((token, i) => token === expected[i])) {
      return result("current", "command exactly matches this installation's PATH-independent launch");
    }
  }

  if (
    tokens.length === 3 &&
    stableNpmRuntimePair(tokens[0]!, tokens[1]!) &&
    tokens[2] === "session-start"
  ) {
    return result("current", "command uses the stable npm-prefix Node launcher and package entry");
  }

  if (tokens.length === 2 && isBareManagedBin(tokens[0]!) && tokens[1] === "session-start") {
    return result("current", "recognized historical generated bare-bin session-start command");
  }
  if (tokens.length === 1 && isBareManagedBin(tokens[0]!)) {
    return result("stale", "recognized pre-session-start generated bare-bin command");
  }

  if (tokens.length === 2 && isKnownAbsoluteManagedExecutable(tokens[0]!) && tokens[1] === "session-start") {
    return result("legacy_path_bound", "recognized generated direct-executable command bound to one path");
  }
  if (tokens.length === 1 && isKnownAbsoluteManagedExecutable(tokens[0]!)) {
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
    basename(tokens[0]!) === "node" &&
    isKnownAbsoluteManagedExecutable(tokens[1]!) &&
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
  const commandCompatibility = classifyHookCommand(command, context.expectedCommand);
  if (commandCompatibility.state === "unmanaged") return commandCompatibility;
  if (
    context.location !== "SessionStart" ||
    context.matcher !== "" ||
    context.entry?.type !== "command" ||
    context.entry?.timeout !== context.timeoutSeconds
  ) {
    return result("stale", "recognized generated command has a historical or non-current hook shape");
  }
  return commandCompatibility;
}

export function isOwnedHookCompatibility(compatibility: HookCompatibility): boolean {
  return compatibility.state !== "absent" && compatibility.state !== "unmanaged";
}
