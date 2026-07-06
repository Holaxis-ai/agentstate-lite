// `agentstate-lite hook install|status|uninstall` — manage the SessionStart home-view hook.
//
// The hook makes the zero-arg home view (identity + auth + command reference) load as ambient context
// at the start of every agent session, so an agent orients before its first action (AXI §7).
//
// MULTI-RUNTIME (AXI §7 "default app targets"): install writes a real SessionStart hook for ALL of
//   • Claude Code   → <base>/.claude/settings.json           (SessionStart command hook)
//   • Codex         → <base>/.codex/hooks.json + config.toml  (SessionStart hook + [features].hooks)
//   • OpenCode      → <base>/.config/opencode/plugins/axi-agentstate-lite.js  (ambient-context plugin)
// via axi-sdk-js `installSessionStartHooks`, which also computes the PORTABLE hook command (the bare
// bin name when on PATH, else the absolute executable path — never a phantom).
//
// SCOPE: `--scope project` (default) targets the current repo (base = cwd); `--scope global` targets
// the user home (base = ~). The SDK builds runtime paths under the given base; project-scope OpenCode
// lands under `<cwd>/.config/opencode/plugins/` (see STATUS for that one caveat).
//
// install leverages the SDK (which owns the OpenCode plugin source); uninstall/status are hand-rolled
// (the SDK exports neither) and match the SDK's own marker rule so the three stay in agreement.
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  installSessionStartHooks,
  type HookSettings,
  type HookEntry,
} from "axi-sdk-js";
import { cliInvocation, hookCommand, collapseHomeDirectory, BIN_NAMES } from "../invocation.js";
import { render, resolveMode } from "../output.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";

/** The marker the SDK/CLI match managed SessionStart hooks by (substring of the hook command). */
export const HOOK_USAGE = `agentstate-lite hook — manage the SessionStart home-view hook

Usage:
  agentstate-lite hook install   [--scope project|global]
  agentstate-lite hook status    [--scope project|global]
  agentstate-lite hook uninstall [--scope project|global]

Installs (or removes) a SessionStart hook that runs the home view as ambient context at the start of
every agent session — for Claude Code, Codex, AND OpenCode. Idempotent: re-installing the same hook
is a no-op; uninstalling an absent hook is a no-op.

Options:
  --scope project   Write to the CURRENT project (default): .claude/, .codex/, .config/opencode/
  --scope global    Write to the USER home (~/.claude, ~/.codex, ~/.config/opencode)
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;

export const HOOK_MARKER = "agentstate-lite";
/** SessionStart hook timeout, in seconds (matches the SDK default). */
export const HOOK_TIMEOUT_SECONDS = 10;
/** The dist entrypoint whose presence in the exec path authorizes an auto-install (see the SDK policy). */
const DIST_ENTRYPOINT = "dist/agentstate-lite.mjs";
/** The OpenCode plugin filename the SDK writes for this marker, and its managed-file marker. */
const OPENCODE_PLUGIN_FILENAME = "axi-agentstate-lite.js";
const OPENCODE_MANAGED_MARKER = `axi-sdk-js managed opencode plugin: ${HOOK_MARKER}`;

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

/** The per-runtime target files for a scope base (~ for global, cwd for project). */
interface HookTargets {
  claudeSettings: string;
  codexHooks: string;
  opencodePlugin: string;
}

function targetsFor(base: string): HookTargets {
  return {
    claudeSettings: join(base, ".claude", "settings.json"),
    codexHooks: join(base, ".codex", "hooks.json"),
    opencodePlugin: join(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME),
  };
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

/** Injectable seam: scope base + stdout, defaulting to production. */
export interface HookDeps {
  /** Override the scope base directory (for tests). Default: ~ (global) or cwd (project). */
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

  const base = deps.base ?? (scope === "global" ? homedir() : process.cwd());
  const targets = targetsFor(base);
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
            command: claude.command ? collapseHomeDirectory(claude.command) : hookCommand(),
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
    // The SDK owns the OpenCode plugin source + the portable-command resolution + the Codex
    // config.toml [features].hooks flag; we force-install (explicit user intent) at the scope base.
    installSessionStartHooks({
      marker: HOOK_MARKER,
      binaryNames: [...BIN_NAMES],
      distEntrypoints: [DIST_ENTRYPOINT],
      homeDir: base,
      timeoutSeconds: HOOK_TIMEOUT_SECONDS,
      shouldInstall: () => true,
      onError: (m) => errors.push(m),
    });
    const out: Record<string, unknown> = {
      action: "install",
      scope,
      installed: true,
      command: hookCommand(),
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
