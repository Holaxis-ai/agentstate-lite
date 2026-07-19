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
// `resolvePortableHookCommand` semantics. The JSON/TOML edits reuse the SDK's exported pure
// updaters (`computeSessionStartHookUpdate` / `computeCodexConfigUpdate`); the OpenCode plugin
// source is OURS (the SDK's generated plugin spawns its command with NO argv, so it cannot express
// `<bin> session-start`) but carries the SDK-compatible managed-marker line, so status/uninstall —
// and any SDK-side tooling matching that marker — keep working unchanged.
//
// SCOPE: `--scope project` (default) targets the current repo; `--scope global` targets each
// host's configured user directory. Project-scope OpenCode stays under `<cwd>/.config/opencode/`.
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  computeCodexConfigUpdate,
  computeSessionStartHookUpdate,
  type HookSettings,
  type HookEntry,
} from "axi-sdk-js";
import { cliInvocation, hookCommand, collapseHomeDirectory } from "../invocation.js";
import { render, resolveMode } from "../output.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { HOST_CONFIG_ROOTS, resolveHostConfigRoot } from "../host-config.js";

/** The marker the SDK/CLI match managed SessionStart hooks by (substring of the hook command). */
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

export const HOOK_MARKER = "agentstate-lite";
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
 */
export function sessionStartHookCommand(base: string = hookCommand()): string {
  const quoted = /\s/.test(base) ? JSON.stringify(base) : base;
  return `${quoted} ${HOOK_SUBCOMMAND}`;
}

function isManagedHook(hook: HookEntry | undefined): boolean {
  return typeof hook?.command === "string" && hook.command.includes(HOOK_MARKER);
}

/**
 * Pure marker-scoped removal (the SDK exports none). Removes every SessionStart hook whose command
 * includes the marker, drops any group left with no hooks, and strips legacy hooks.session_start
 * marker matches. Returns [updatedSettings, changed]; unrelated hooks and groups survive untouched.
 * Shared by the Claude settings.json and the Codex hooks.json (identical HookSettings shape).
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
      if (!Array.isArray(group.hooks)) {
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

/** Pure status scan: report whether a marker-matching SessionStart hook is installed (+ its command). */
export function readHookStatus(settings: HookSettings): { installed: boolean; command?: string } {
  const hooks = settings.hooks;
  if (hooks) {
    if (Array.isArray(hooks.SessionStart)) {
      for (const group of hooks.SessionStart) {
        if (!Array.isArray(group.hooks)) continue;
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

function readSettings(path: string): HookSettings {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8")) as HookSettings;
  } catch {
    return {};
  }
}

function writeSettings(path: string, settings: HookSettings): void {
  mkdirSync(dirname(path), { recursive: true });
  // Match the SDK's on-disk format: 2-space JSON + trailing newline.
  writeFileSync(path, `${JSON.stringify(settings, null, 2)}\n`);
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
            command: claude.command ? collapseHomeDirectory(claude.command) : sessionStartHookCommand(),
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
    const errors: string[] = [];
    const commandBase = hookCommand();
    const command = sessionStartHookCommand(commandBase);
    // Claude Code settings.json + Codex hooks.json: the SDK's exported pure updater, with OUR
    // `<bin> session-start` command (the SDK's own installer computes an argv-less command
    // internally, which cannot express a subcommand — see the module header).
    for (const target of [targets.claudeSettings, targets.codexHooks]) {
      try {
        const [updated, changed] = computeSessionStartHookUpdate(readSettings(target), {
          marker: HOOK_MARKER,
          command,
          timeoutSeconds: HOOK_TIMEOUT_SECONDS,
        });
        if (changed) writeSettings(target, updated);
      } catch (err) {
        errors.push(`${target}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    // Codex [features].hooks flag (config.toml) — same SDK updater the old installer used.
    const codexConfigPath = targets.codexConfig;
    try {
      const current = existsSync(codexConfigPath) ? readFileSync(codexConfigPath, "utf8") : "";
      const [updated, changed] = computeCodexConfigUpdate(current);
      if (changed) {
        mkdirSync(dirname(codexConfigPath), { recursive: true });
        writeFileSync(codexConfigPath, updated);
      }
    } catch (err) {
      errors.push(`${codexConfigPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    // OpenCode ambient-context plugin — our args-aware source, SDK-marker compatible.
    try {
      mkdirSync(dirname(targets.opencodePlugin), { recursive: true });
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync(targets.opencodePlugin)
        ? readFileSync(targets.opencodePlugin, "utf8")
        : undefined;
      if (current !== undefined && !current.includes(OPENCODE_MANAGED_MARKER)) {
        errors.push(`${targets.opencodePlugin}: refusing to overwrite unmanaged OpenCode plugin`);
      } else if (current !== next) {
        writeFileSync(targets.opencodePlugin, next);
      }
    } catch (err) {
      errors.push(`${targets.opencodePlugin}: ${err instanceof Error ? err.message : String(err)}`);
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
