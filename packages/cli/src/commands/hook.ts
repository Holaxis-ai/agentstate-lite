// `agentstate-lite hook install|status|uninstall` — manage the SessionStart board-aware hook.
//
// Since sync-verb §U4 the installed hook runs `<bin> session-start` — ONE subcommand doing a
// time-boxed best-effort board pull and THEN rendering the home view (identity + auth + bundle
// dashboard + board awareness) as ambient context, so an agent orients — with its teammates'
// board changes already pulled — before its first action. It is a single unconditional hook
// command, never two entries or a compound shell string.
//
// MULTI-RUNTIME (AXI §7 "default app targets"): install writes a real SessionStart hook for ALL of
//   • Claude Code   → project .claude/ or ${CLAUDE_CONFIG_DIR:-~/.claude}
//   • Codex         → project .codex/ or ${CODEX_HOME:-~/.codex}
//   • OpenCode      → project .config/opencode/ or its configured/XDG user config directory
//
// The portable COMMAND BASE (bare bin name when on PATH, else the absolute executable — never a
// phantom) comes from invocation.ts's `hookCommand()`, which mirrors the axi-sdk-js
// `resolvePortableHookCommand` semantics. The TOML edit reuses the SDK's exported pure updater
// (`computeCodexConfigUpdate`); the JSON SessionStart edit is OUR SDK-modeled pure updater
// (`computeSessionStartHookInstall`) because the SDK's single-substring marker cannot recognize
// both managed command forms (legacy `agentstate-lite`-marked and the preferred `aslite` bin) —
// with the SDK's append-if-no-match behavior, a reinstall over an `aslite session-start` hook
// would append a duplicate. The OpenCode plugin source is OURS (the SDK's generated plugin spawns
// its command with NO argv, so it cannot express `<bin> session-start`) but carries the
// SDK-compatible managed-marker line, so status/uninstall — and any SDK-side tooling matching
// that marker — keep working unchanged.
//
// DESTRUCTIVE-WRITE DISCIPLINE: `install` REFUSES (structured RUNTIME failure, nothing written)
// any settings file it cannot faithfully round-trip — unparseable JSON or a malformed hooks shape
// — because "repairing" it would destroy the user's other settings. Every managed write goes
// through same-directory temp + rename, so a concurrent reader never observes a torn file.
// Read-only paths (status, probes) and uninstall stay lenient: a malformed file is never touched.
//
// SCOPE: `--scope project` (default) targets the current repo; `--scope global` targets each
// host's configured user directory. Project-scope OpenCode stays under `<cwd>/.config/opencode/`.
import {
  chmodSync,
  existsSync,
  lstatSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  computeCodexConfigUpdate,
  type HookSettings,
  type HookEntry,
} from "axi-sdk-js";
import { cliInvocation, hookCommand, collapseHomeDirectory } from "../invocation.js";
import { render, resolveMode } from "../output.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { HOST_CONFIG_ROOTS, resolveHostConfigRoot } from "../host-config.js";

export const HOOK_USAGE = `agentstate-lite hook — manage the SessionStart board-aware hook

Usage:
  agentstate-lite hook install   [--scope project|global]
  agentstate-lite hook status    [--scope project|global]
  agentstate-lite hook uninstall [--scope project|global]

Installs (or removes) a SessionStart hook that runs \`session-start\` — a time-boxed best-effort
board pull, then the home view — as ambient context at the start of every agent session, for
Claude Code, Codex, AND OpenCode. Idempotent: re-installing the same hook is a no-op; uninstalling
an absent hook is a no-op. Re-run install after upgrading from a pre-session-start version: the
old hook rendered the home view without pulling the board first.

Options:
  --scope project   Write to the CURRENT project (default): .claude/, .codex/, .config/opencode/
  --scope global    Write to each host's configured USER home (environment override or default)
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;

/**
 * The LEGACY managed-hook marker: every pre-rename hook command contains this substring (bare bin,
 * absolute path, or npx form), and it stays the token in the SDK-compatible OpenCode managed-marker
 * line. New-form commands run the preferred `aslite` bin and do NOT contain it — see
 * {@link isManagedHookCommand} for the full recognition rule.
 */
export const HOOK_MARKER = "agentstate-lite";
/**
 * New-form recognition: the command's FIRST token invokes an `aslite` bin — bare, absolute path,
 * or double-quoted path, with `aslite` as the exact basename. Deliberately word-boundary-strict so
 * a foreign command merely containing the letters (`easlite`, `aslite2`, `foo --aslite`) is never
 * claimed as ours.
 */
const NEW_BIN_COMMAND_RE = /^\s*(?:"(?:[^"]*\/)?aslite"|(?:[^\s"]*\/)?aslite)(?:\s|$)/;

/**
 * Managed-hook recognition over a hook COMMAND string: legacy marker substring, or new-form bin.
 * Known asymmetry: a hand-authored `npx -y aslite session-start` is NOT recognized (first token
 * is `npx`), while the legacy npx form is (substring) — acceptable because the installer never
 * emits an npx form (`hookCommand()` resolves a bin name or an absolute executable path).
 */
export function isManagedHookCommand(command: string): boolean {
  return command.includes(HOOK_MARKER) || NEW_BIN_COMMAND_RE.test(command);
}
/** SessionStart hook timeout, in seconds (matches the SDK default; session-start budgets under it). */
export const HOOK_TIMEOUT_SECONDS = 10;
/** The subcommand the installed hook runs (sync-verb §U4's pull-then-render command). */
export const HOOK_SUBCOMMAND = "session-start";
/** The OpenCode plugin filename (SDK naming convention for this marker) and its managed-file marker. */
const OPENCODE_PLUGIN_FILENAME = "axi-agentstate-lite.js";
const OPENCODE_MANAGED_MARKER = `axi-sdk-js managed opencode plugin: ${HOOK_MARKER}`;

/**
 * The full hook command: `<portable-base> session-start`. A base containing whitespace (an
 * absolute executable path with a space) is double-quoted for the shell-string targets — the
 * OpenCode plugin spawns the base UNQUOTED as an argv[0] with `["session-start"]` args, so it
 * never needs the quoting.
 *
 * Writer/recognizer contract, asserted HERE in the owning composer: the composed command must
 * satisfy {@link isManagedHookCommand}, or install would write an ORPHAN hook — invisible to
 * status, duplicated by reinstall, stranded by uninstall. Unreachable through every real channel
 * (bare bins match by rule; npm-dist and skill-bundle absolute paths carry the legacy token in
 * their filename); an exotic/future channel whose executable carries neither token fails CLOSED
 * here instead of orphaning a hook.
 */
export function sessionStartHookCommand(base: string = hookCommand()): string {
  const quoted = /\s/.test(base) ? JSON.stringify(base) : base;
  const command = `${quoted} ${HOOK_SUBCOMMAND}`;
  if (!isManagedHookCommand(command)) {
    throw new Error(
      `composed hook command ${JSON.stringify(command)} would not be recognized as managed — refusing to install an orphan hook`,
    );
  }
  return command;
}

function isManagedHook(hook: HookEntry | undefined): boolean {
  return typeof hook?.command === "string" && isManagedHookCommand(hook.command);
}

/**
 * Pure install updater for the Claude settings.json / Codex hooks.json SessionStart shape —
 * modeled on the SDK's `computeSessionStartHookUpdate`, but recognizing managed hooks through
 * {@link isManagedHookCommand} (both command forms) instead of one substring marker. Rewrites the
 * FIRST managed hook in place (preserving its group position), removes any FURTHER managed hooks
 * (a duplicate left by an older marker mismatch), strips legacy `hooks.session_start` managed
 * entries, and appends a fresh group only when no managed hook exists. Returns
 * [updatedSettings, changed]; an already-correct sole managed hook is a no-op. Foreign hooks and
 * groups survive untouched.
 */
export function computeSessionStartHookInstall(
  settings: HookSettings,
  spec: { command: string; timeoutSeconds?: number },
): [HookSettings, boolean] {
  const updated = structuredClone(settings);
  let changed = false;
  if (!updated.hooks) {
    updated.hooks = {};
    changed = true;
  }
  const hooks = updated.hooks;

  if (Array.isArray(hooks.session_start)) {
    const kept = hooks.session_start.filter((h) => !isManagedHook(h));
    if (kept.length !== hooks.session_start.length) {
      changed = true;
      if (kept.length === 0) delete hooks.session_start;
      else hooks.session_start = kept;
    }
  }

  if (!Array.isArray(hooks.SessionStart)) {
    hooks.SessionStart = [];
    changed = true;
  }
  const timeout = spec.timeoutSeconds ?? HOOK_TIMEOUT_SECONDS;
  let rewritten = false;
  const newGroups: typeof hooks.SessionStart = [];
  for (const group of hooks.SessionStart) {
    // `group?.`: a malformed member (null/primitive) passes through untouched, never throws —
    // the CLI install path refuses such files up front (readSettingsForInstall), but this pure
    // updater must stay total for any direct caller.
    if (!Array.isArray(group?.hooks)) {
      newGroups.push(group);
      continue;
    }
    const keptHooks: HookEntry[] = [];
    for (const h of group.hooks) {
      if (!isManagedHook(h)) {
        keptHooks.push(h);
        continue;
      }
      if (rewritten) {
        changed = true; // a second managed hook is a duplicate — drop it
        continue;
      }
      rewritten = true;
      if (h.command !== spec.command || h.type !== "command" || h.timeout !== timeout) {
        changed = true;
        h.command = spec.command;
        h.type = "command";
        h.timeout = timeout;
      }
      keptHooks.push(h);
    }
    if (keptHooks.length !== group.hooks.length) {
      if (keptHooks.length === 0) continue; // drop the now-empty group
      group.hooks = keptHooks;
    }
    newGroups.push(group);
  }
  hooks.SessionStart = newGroups;
  if (!rewritten) {
    hooks.SessionStart.push({
      matcher: "",
      hooks: [{ type: "command", command: spec.command, timeout }],
    });
    changed = true;
  }
  return changed ? [updated, true] : [settings, false];
}

/**
 * Pure managed-hook removal (the SDK exports none). Removes every SessionStart hook recognized by
 * {@link isManagedHookCommand} (either command form), drops any group left with no hooks, and
 * strips legacy hooks.session_start matches. Returns [updatedSettings, changed]; unrelated hooks
 * and groups survive untouched. Shared by the Claude settings.json and the Codex hooks.json
 * (identical HookSettings shape).
 */
export function computeHookUninstall(settings: HookSettings): [HookSettings, boolean] {
  const updated = structuredClone(settings);
  let changed = false;
  const hooks = updated.hooks;
  if (!hooks) return [settings, false];

  if (Array.isArray(hooks.session_start)) {
    const kept = hooks.session_start.filter((h) => !isManagedHook(h));
    if (kept.length !== hooks.session_start.length) {
      changed = true;
      if (kept.length === 0) delete hooks.session_start;
      else hooks.session_start = kept;
    }
  }

  if (Array.isArray(hooks.SessionStart)) {
    const newGroups: typeof hooks.SessionStart = [];
    for (const group of hooks.SessionStart) {
      // Tolerate malformed members (skip untouched, never throw) — same reason as install's updater.
      if (!Array.isArray(group?.hooks)) {
        newGroups.push(group);
        continue;
      }
      const keptHooks = group.hooks.filter((h) => !isManagedHook(h));
      if (keptHooks.length !== group.hooks.length) {
        changed = true;
        if (keptHooks.length === 0) continue; // drop the now-empty group
        newGroups.push({ ...group, hooks: keptHooks });
      } else {
        newGroups.push(group);
      }
    }
    if (changed) hooks.SessionStart = newGroups;
  }

  return changed ? [updated, true] : [settings, false];
}

/** Pure status scan: report whether a managed SessionStart hook (either form) is installed (+ its command). */
export function readHookStatus(settings: HookSettings): { installed: boolean; command?: string } {
  const hooks = settings.hooks;
  if (hooks) {
    if (Array.isArray(hooks.SessionStart)) {
      for (const group of hooks.SessionStart) {
        if (!Array.isArray(group?.hooks)) continue; // tolerate malformed members — report, never throw
        for (const h of group.hooks) {
          if (isManagedHook(h)) return { installed: true, command: h.command };
        }
      }
    }
    if (Array.isArray(hooks.session_start)) {
      for (const h of hooks.session_start) {
        if (isManagedHook(h)) return { installed: true, command: h.command };
      }
    }
  }
  return { installed: false };
}

/** The per-runtime target files for one resolved scope. */
export interface HookTargets {
  claudeSettings: string;
  codexHooks: string;
  codexConfig: string;
  opencodePlugin: string;
}

function targetsForBase(base: string): HookTargets {
  return {
    claudeSettings: join(base, ".claude", "settings.json"),
    codexHooks: join(base, ".codex", "hooks.json"),
    codexConfig: join(base, ".codex", "config.toml"),
    opencodePlugin: join(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME),
  };
}

function configuredPath(value: string | undefined, fallback: string): string {
  return value === undefined || value.length === 0 ? fallback : value;
}

/** Resolve global targets exactly where each host reads them. */
export function globalHookTargets(home: string = homedir(), env: NodeJS.ProcessEnv = process.env): HookTargets {
  const claudeHome = resolveHostConfigRoot(HOST_CONFIG_ROOTS.claude, home, env);
  const codexHome = resolveHostConfigRoot(HOST_CONFIG_ROOTS.codex, home, env);
  const xdgConfigHome = configuredPath(env.XDG_CONFIG_HOME, join(home, ".config"));
  const opencodeHome = configuredPath(env.OPENCODE_CONFIG_DIR, join(xdgConfigHome, "opencode"));
  return {
    claudeSettings: join(claudeHome, "settings.json"),
    codexHooks: join(codexHome, "hooks.json"),
    codexConfig: join(codexHome, "config.toml"),
    opencodePlugin: join(opencodeHome, "plugins", OPENCODE_PLUGIN_FILENAME),
  };
}

export interface HookLocationDeps {
  cwd?: string;
  home?: string;
  env?: NodeJS.ProcessEnv;
}

function targetSets(bases: string[] | undefined, deps: HookLocationDeps): HookTargets[] {
  if (bases !== undefined) return bases.map(targetsForBase);
  const cwd = deps.cwd ?? process.cwd();
  const home = deps.home ?? homedir();
  const env = deps.env ?? process.env;
  return [targetsForBase(cwd), globalHookTargets(home, env)];
}

/**
 * Lenient read for the READ-ONLY paths (status, uninstall-scan, needs-update probes): a missing or
 * unparseable file reads as empty settings and is never touched. `hook install` must NOT use this
 * — see {@link readSettingsForInstall}.
 */
function readSettings(path: string): HookSettings {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8")) as HookSettings;
  } catch {
    return {};
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Fail-loud read for the INSTALL write path. A missing file is empty settings (we create it), but
 * content we cannot faithfully round-trip — unreadable, unparseable JSON, a non-object root, a
 * non-object `hooks`, a present-but-non-array `hooks.SessionStart`/`hooks.session_start`, or an
 * ARRAY MEMBER that is not the object shape the updater consumes — is refused with a reason
 * instead of being silently normalized: writing "repaired" settings would destroy the user's
 * other keys (permissions, theme, a hand-authored value), and a member the updater cannot walk
 * must refuse UP FRONT rather than throw mid-write.
 */
export function readSettingsForInstall(
  path: string,
): { ok: true; settings: HookSettings } | { ok: false; reason: string } {
  if (!existsSync(path)) return { ok: true, settings: {} };
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    return { ok: false, reason: `unreadable (${err instanceof Error ? err.message : String(err)})` };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { ok: false, reason: `unparseable JSON (${err instanceof Error ? err.message : String(err)})` };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, reason: "settings root is not a JSON object" };
  }
  const hooks = (parsed as HookSettings).hooks;
  if (hooks !== undefined) {
    if (!isPlainObject(hooks)) {
      return { ok: false, reason: "`hooks` is not a JSON object" };
    }
    if (hooks.SessionStart !== undefined) {
      if (!Array.isArray(hooks.SessionStart)) {
        return { ok: false, reason: "`hooks.SessionStart` exists but is not an array" };
      }
      for (const [i, group] of hooks.SessionStart.entries()) {
        if (!isPlainObject(group)) {
          return { ok: false, reason: `\`hooks.SessionStart[${i}]\` is not an object` };
        }
        if (group.hooks !== undefined) {
          if (!Array.isArray(group.hooks)) {
            return { ok: false, reason: `\`hooks.SessionStart[${i}].hooks\` exists but is not an array` };
          }
          for (const [j, entry] of group.hooks.entries()) {
            if (!isPlainObject(entry)) {
              return { ok: false, reason: `\`hooks.SessionStart[${i}].hooks[${j}]\` is not an object` };
            }
          }
        }
      }
    }
    if (hooks.session_start !== undefined) {
      if (!Array.isArray(hooks.session_start)) {
        return { ok: false, reason: "`hooks.session_start` exists but is not an array" };
      }
      for (const [i, entry] of hooks.session_start.entries()) {
        if (!isPlainObject(entry)) {
          return { ok: false, reason: `\`hooks.session_start[${i}]\` is not an object` };
        }
      }
    }
  }
  return { ok: true, settings: parsed as HookSettings };
}

/**
 * A SYMLINKED destination (a stowed/dotfile-managed settings file) is written THROUGH, not
 * replaced: renaming a temp over the link path would swap the link for a regular file and strand
 * the real target. The link is resolved once and the whole atomic dance happens at the RESOLVED
 * path, so the link stays a link and its target updates atomically. A dangling link is refused —
 * writing "through" it would silently create a file somewhere the user's manager doesn't own.
 * A non-link destination passes through verbatim (ancestor symlinks need no handling: the temp
 * lives in the same — possibly linked — directory, so rename resolves them identically).
 */
function resolveWriteDestination(path: string): string {
  let isLink = false;
  try {
    isLink = lstatSync(path).isSymbolicLink();
  } catch {
    return path; // absent → create at the literal path
  }
  if (!isLink) return path;
  try {
    return realpathSync(path);
  } catch {
    throw new Error(`dangling symlink at ${path} — refusing to write through it; fix or remove the link`);
  }
}

/**
 * Atomic file write: temp file in the SAME directory + rename, so a concurrent reader sees either
 * the old bytes or the new bytes — never a torn/empty file (truncate-then-write's race window).
 * A symlinked destination is written through at its resolved target (see
 * {@link resolveWriteDestination}); when replacing an existing file its mode is preserved (a
 * user's 0600 settings must not widen to the default umask); the temp is cleaned up on ANY
 * failure (write or rename).
 */
export function atomicWriteFileSync(path: string, content: string | Uint8Array): void {
  const destination = resolveWriteDestination(path);
  mkdirSync(dirname(destination), { recursive: true });
  const mode = existsSync(destination) ? statSync(destination).mode & 0o7777 : undefined;
  const tmp = `${destination}.tmp-${process.pid}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    writeFileSync(tmp, content, mode !== undefined ? { mode } : {});
    if (mode !== undefined) chmodSync(tmp, mode); // umask masks writeFileSync's mode; enforce it
    renameSync(tmp, destination);
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
}

function writeSettings(path: string, settings: HookSettings): void {
  // Match the SDK's on-disk format: 2-space JSON + trailing newline.
  atomicWriteFileSync(path, `${JSON.stringify(settings, null, 2)}\n`);
}

function opencodePluginInstalled(path: string): boolean {
  if (!existsSync(path)) return false;
  try {
    return readFileSync(path, "utf8").includes(OPENCODE_MANAGED_MARKER);
  } catch {
    return false;
  }
}

/**
 * The OpenCode ambient-context plugin source — OURS, not the SDK's generated one (the SDK plugin
 * spawns its command with an EMPTY argv, so it cannot run `<bin> session-start`). Functionally a
 * fork of the SDK's plugin with an args array; line 1 is the SDK-compatible managed-marker
 * verbatim, so `hook status`/`hook uninstall` (and the SDK's own marker rule) treat it as the same
 * managed file.
 */
export function buildOpenCodePluginSource(base: string, timeoutSeconds: number = HOOK_TIMEOUT_SECONDS): string {
  return `// ${OPENCODE_MANAGED_MARKER}
// Generated by \`agentstate-lite hook install\` (axi-sdk-js managed-marker compatible). It is safe
// to edit only if you remove the managed marker above.
import { spawn } from "node:child_process";

const command = ${JSON.stringify(base)};
const commandArgs = [${JSON.stringify(HOOK_SUBCOMMAND)}];
const marker = ${JSON.stringify(HOOK_MARKER)};
const ambientHeader = ${JSON.stringify(`## AXI ambient context: ${HOOK_MARKER}`)};
const timeoutMs = ${JSON.stringify(timeoutSeconds * 1000)};

function runAxiSessionStart(cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      cwd: directoryOrFallback(cwd),
      env: process.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      resolve("error: " + marker + " ambient context timed out after " + timeoutMs + "ms");
    }, timeoutMs);

    child.stdout?.setEncoding("utf-8");
    child.stderr?.setEncoding("utf-8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve("error: " + marker + " ambient context failed: " + error.message);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }
      const message = (stderr || stdout || marker + " exited with code " + code).trim();
      resolve("error: " + marker + " ambient context failed: " + message);
    });
  });
}

function directoryOrFallback(directory) {
  return typeof directory === "string" && directory.length > 0
    ? directory
    : process.cwd();
}

export const AxiAgentstateLiteAmbientContextPlugin = async ({ directory }) => {
  const sessionCache = new Map();

  return {
    "experimental.chat.system.transform": async (input, output) => {
      const sessionID = input.sessionID ?? "__global__";
      let homeView = sessionCache.get(sessionID);
      if (homeView === undefined) {
        homeView = await runAxiSessionStart(directory);
        sessionCache.set(sessionID, homeView);
      }

      if (homeView.length === 0) return;
      output.system.push(ambientHeader + "\\n" + homeView);
    },
  };
};
`;
}

/**
 * U6-inherited re-install prompt signal (consumed by the home render): TRUE when a MANAGED
 * SessionStart hook is installed at any of the given scope bases (default: the cwd project scope
 * and each host's configured global target) whose command predates {@link HOOK_SUBCOMMAND} — i.e. the
 * pre-U4 home-only hook. Fs-only reads, tolerant of anything malformed; self-clearing (a re-run
 * `hook install` rewrites the command and this goes quiet).
 */
export function hookNeedsUpdate(bases?: string[], deps: HookLocationDeps = {}): boolean {
  for (const targets of targetSets(bases, deps)) {
    for (const p of [targets.claudeSettings, targets.codexHooks]) {
      const s = readHookStatus(readSettings(p));
      if (s.installed && s.command !== undefined && !s.command.includes(HOOK_SUBCOMMAND)) return true;
    }
    if (opencodePluginInstalled(targets.opencodePlugin)) {
      try {
        if (!readFileSync(targets.opencodePlugin, "utf8").includes(HOOK_SUBCOMMAND)) return true;
      } catch {
        /* unreadable plugin file — no claim either way */
      }
    }
  }
  return false;
}

/**
 * True when ANY managed SessionStart hook is installed at any of the given scope bases (default:
 * the cwd project scope and each host's configured global target) — Claude Code settings, Codex hooks, or
 * the OpenCode plugin. Fs-only reads, tolerant of anything malformed. This is the onboarding
 * last-mile signal sync's receipt hints on: no hook anywhere means new sessions never see the
 * board until someone runs `hook install`. (Contrast {@link hookNeedsUpdate}: installed but
 * PREDATING `session-start` — a different, self-clearing prompt on the home render.)
 */
export function hookInstalled(bases?: string[], deps: HookLocationDeps = {}): boolean {
  for (const targets of targetSets(bases, deps)) {
    for (const p of [targets.claudeSettings, targets.codexHooks]) {
      if (readHookStatus(readSettings(p)).installed) return true;
    }
    if (opencodePluginInstalled(targets.opencodePlugin)) return true;
  }
  return false;
}

/** Injectable filesystem-location and output seams, defaulting to production. */
export interface HookDeps extends HookLocationDeps {
  /** Override all scope targets with one legacy base directory (for focused tests). */
  base: string;
  /** Override the resolved command base (default `hookCommand()`) — for orphan-guard tests. */
  commandBase: string;
  stdout: (s: string) => void;
}

/**
 * CLI entry: dispatch the positional subcommand (install|status|uninstall). Output is TOON. An
 * unknown/missing subcommand, or an unsupported --scope, is a USAGE error.
 */
export async function hook(argv: string[], deps: Partial<HookDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          scope: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "hook",
  );
  if (values.help) {
    stdout(HOOK_USAGE);
    return;
  }

  const sub = positionals[0];
  if (sub !== "install" && sub !== "status" && sub !== "uninstall") {
    throw new CliError(
      "USAGE",
      sub === undefined
        ? "hook requires a subcommand (install|status|uninstall)"
        : `unknown hook subcommand: ${sub} (expected install|status|uninstall)`,
      { help: `${cliInvocation()} hook install|status|uninstall [--scope project|global]` },
    );
  }

  const scope = (values.scope as string | undefined) ?? "project";
  if (scope !== "project" && scope !== "global") {
    throw new CliError("USAGE", `unsupported hook scope: ${scope} (expected project|global)`, {
      help: `${cliInvocation()} hook ${sub} --scope project|global`,
    });
  }

  const targets = deps.base !== undefined
    ? targetsForBase(deps.base)
    : scope === "global"
      ? globalHookTargets(deps.home ?? homedir(), deps.env ?? process.env)
      : targetsForBase(deps.cwd ?? process.cwd());
  const mode = resolveMode(values);

  if (sub === "status") {
    const claude = readHookStatus(readSettings(targets.claudeSettings));
    const codex = readHookStatus(readSettings(targets.codexHooks));
    const opencode = opencodePluginInstalled(targets.opencodePlugin);
    // Read-only paths stay serene: if composing the WOULD-BE command trips the orphan guard
    // (exotic channel), status omits the field rather than failing.
    let wouldInstall: string | undefined;
    try {
      wouldInstall = sessionStartHookCommand(deps.commandBase);
    } catch {
      wouldInstall = undefined;
    }
    const display = claude.command ? collapseHomeDirectory(claude.command) : wouldInstall;
    stdout(
      render(
        {
          hook: {
            action: "status",
            scope,
            installed: claude.installed || codex.installed || opencode,
            claude_code: claude.installed,
            codex: codex.installed,
            opencode,
            ...(display !== undefined ? { command: display } : {}),
            targets: {
              claude_code: collapseHomeDirectory(targets.claudeSettings),
              codex: collapseHomeDirectory(targets.codexHooks),
              opencode: collapseHomeDirectory(targets.opencodePlugin),
            },
          },
        },
        mode,
      ),
    );
    return;
  }

  if (sub === "install") {
    // `errors` is the exit-0 receipt field — ONLY the deliberate unmanaged-OpenCode-plugin
    // refusal lives there. Everything that means "this host was NOT installed" — a malformed
    // settings refusal OR an unexpected updater/write throw — is a `refusals` entry and fails
    // the command (RUNTIME throw below): the receipt must never claim success for a host that
    // was not written.
    const errors: string[] = [];
    const refusals: string[] = [];
    const failTarget = (target: string, err: unknown) =>
      refusals.push(
        `${collapseHomeDirectory(target)}: ${err instanceof Error ? err.message : String(err)} — this target was not installed`,
      );
    // Compose through the owning guard BEFORE touching any target: an orphan-composing channel
    // (see sessionStartHookCommand) refuses the whole install — same command feeds every target,
    // so nothing may be written.
    const commandBase = deps.commandBase ?? hookCommand();
    let command: string;
    try {
      command = sessionStartHookCommand(commandBase);
    } catch (err) {
      throw new CliError("RUNTIME", err instanceof Error ? err.message : String(err), {
        details: { command_base: collapseHomeDirectory(commandBase) },
        help: "install from a channel whose executable resolves as aslite/agentstate-lite (e.g. npm install -g aslite), then re-run hook install",
      });
    }
    // Claude Code settings.json + Codex hooks.json: OUR SDK-modeled pure updater, recognizing
    // both managed command forms (see the module header for why the SDK's marker cannot).
    for (const target of [targets.claudeSettings, targets.codexHooks]) {
      try {
        const read = readSettingsForInstall(target);
        if (!read.ok) {
          refusals.push(`${collapseHomeDirectory(target)}: ${read.reason} — nothing was written to this file`);
          continue;
        }
        const [updated, changed] = computeSessionStartHookInstall(read.settings, {
          command,
          timeoutSeconds: HOOK_TIMEOUT_SECONDS,
        });
        if (changed) writeSettings(target, updated);
      } catch (err) {
        failTarget(target, err);
      }
    }
    // Codex [features].hooks flag (config.toml) — same SDK updater the old installer used.
    const codexConfigPath = targets.codexConfig;
    try {
      const current = existsSync(codexConfigPath) ? readFileSync(codexConfigPath, "utf8") : "";
      const [updated, changed] = computeCodexConfigUpdate(current);
      if (changed) atomicWriteFileSync(codexConfigPath, updated);
    } catch (err) {
      failTarget(codexConfigPath, err);
    }
    // OpenCode ambient-context plugin — our args-aware source, SDK-marker compatible.
    try {
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync(targets.opencodePlugin)
        ? readFileSync(targets.opencodePlugin, "utf8")
        : undefined;
      if (current !== undefined && !current.includes(OPENCODE_MANAGED_MARKER)) {
        errors.push(`${targets.opencodePlugin}: refusing to overwrite unmanaged OpenCode plugin`);
      } else if (current !== next) {
        atomicWriteFileSync(targets.opencodePlugin, next);
      }
    } catch (err) {
      failTarget(targets.opencodePlugin, err);
    }
    if (refusals.length > 0) {
      throw new CliError(
        "RUNTIME",
        `hook install failed for ${refusals.length} target(s); other targets were still processed`,
        {
          details: { refused: refusals, ...(errors.length > 0 ? { errors } : {}) },
          help: "fix or remove the named file(s), then re-run hook install",
        },
      );
    }
    const out: Record<string, unknown> = {
      action: "install",
      scope,
      installed: true,
      command,
      targets: {
        claude_code: collapseHomeDirectory(targets.claudeSettings),
        codex: collapseHomeDirectory(targets.codexHooks),
        opencode: collapseHomeDirectory(targets.opencodePlugin),
      },
    };
    if (errors.length > 0) out.errors = errors;
    stdout(render({ hook: out }, mode));
    return;
  }

  // uninstall: remove the managed hook from the JSON targets + delete the OpenCode plugin file. The
  // Codex config.toml [features].hooks flag is left in place (harmless; other hooks may rely on it).
  let changed = false;
  for (const path of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path));
    if (didChange) {
      writeSettings(path, updated);
      changed = true;
    }
  }
  if (opencodePluginInstalled(targets.opencodePlugin)) {
    rmSync(targets.opencodePlugin, { force: true });
    changed = true;
  }
  stdout(
    render(
      {
        hook: {
          action: "uninstall",
          scope,
          installed: false,
          changed,
          targets: {
            claude_code: collapseHomeDirectory(targets.claudeSettings),
            codex: collapseHomeDirectory(targets.codexHooks),
            opencode: collapseHomeDirectory(targets.opencodePlugin),
          },
        },
      },
      mode,
    ),
  );
}
