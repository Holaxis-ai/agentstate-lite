// Resolve the running CLI's OWN invocation for emitted follow-up commands + the home-view identity.
//
// The CLI is a standalone, npm-publishable package (`aslite` — the interim npm coordinate; bin
// names `aslite` / `agentstate-lite`). Per AXI §7/§10 a printed follow-up command must be
// COPY-PASTE runnable and never a phantom path:
//
//   • cliInvocation() — the runnable command PREFIX for hints/help. If a managed bin name resolves on
//     PATH to THIS executable, we emit the bare name (`aslite`, portable across installs);
//     otherwise we fall back to `npx -y aslite` (the npm-first distribution form), which runs
//     the published package without a global install. Never an absolute dist path.
//   • binPath() — the home-collapsed ABSOLUTE path of the running executable, for the home view's
//     `bin:` identity field (AXI §10: "identify the tool itself before the live data").
//
// This resolves against the REAL running module (import.meta.url / process.argv[1]) — no committed
// shim, no `dist/axi`. The former phantom-shim resolver is gone.
import { fileURLToPath } from "node:url";
import { realpathSync } from "node:fs";
import { delimiter, join } from "node:path";
import { homedir } from "node:os";

/** The npm package name — the token used for the `npx -y <pkg>` fallback and the bare-bin match. */
export const PACKAGE_NAME = "aslite";
/** The bin names this package installs (see package.json `bin`); the first is preferred for hints. */
export const BIN_NAMES = ["aslite", "agentstate-lite"] as const;

/** Collapse a leading $HOME to `~` (e.g. /Users/me/x → ~/x). Non-home paths pass through verbatim. */
export function collapseHomeDirectory(p: string): string {
  const home = homedir();
  if (home && (p === home || p.startsWith(home + "/"))) {
    return "~" + p.slice(home.length);
  }
  return p;
}

/** realpath a path, or undefined if it does not exist / is not resolvable. */
function realOrUndefined(p: string): string | undefined {
  try {
    return realpathSync(p);
  } catch {
    return undefined;
  }
}

/** The absolute real path of the running executable (the bundled entry), or undefined. */
export function currentExecutableRealPath(): string | undefined {
  // import.meta.url is the running module; under the bundle that IS the executable file.
  const fromModule = realOrUndefined(fileURLToPath(import.meta.url));
  if (fromModule) return fromModule;
  const argv1 = process.argv[1];
  return argv1 ? realOrUndefined(argv1) : undefined;
}

/**
 * If a managed bin name (`aslite` / `agentstate-lite`) is found on PATH and its realpath matches the
 * running executable, return that bare name (portable). Otherwise undefined. POSIX PATH scan — the
 * target platforms are macOS/Linux; Windows PATHEXT is not handled (the tool ships as an .mjs).
 */
function binNameOnPath(): string | undefined {
  const exe = currentExecutableRealPath();
  if (!exe) return undefined;
  const dirs = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  for (const name of BIN_NAMES) {
    for (const dir of dirs) {
      const resolved = realOrUndefined(join(dir, name));
      if (resolved && resolved === exe) return name;
    }
  }
  return undefined;
}

/**
 * True when the running executable IS the self-contained skill bundle
 * (skills/agentstate-lite/scripts/agentstate-lite.mjs — the `npx skills add` channel), as opposed
 * to the npm dist/ bundle (dist/agentstate-lite.mjs) or an unbundled dev/test run (src/*.ts).
 * Distinguished by WHERE the running file lives on disk, not by an embedded build-time literal —
 * the npm dist/ and skill scripts/ bundles are produced by the identical esbuild config
 * (scripts/build-bundle.mjs) and stay byte-identical; only the runtime path differs. Exported for
 * `skill install`'s channel refusal (the marketplace bundle carries no npm-layout skill assets).
 */
export function isSkillBundlePath(exe: string): boolean {
  const parts = exe.split("/");
  const base = parts[parts.length - 1];
  const parentDir = parts[parts.length - 2];
  return base === "agentstate-lite.mjs" && parentDir === "scripts";
}

/**
 * The runnable command prefix for emitted follow-ups: the bare bin name when this executable is on
 * PATH; else, when running as the self-contained SKILL bundle, its own resolved absolute path
 * (directly runnable — no npm/npx involved in that channel); else `npx -y aslite` (the
 * npm dist/ bundle off PATH, or a dev/test run). Every `help:` field and success `help[]` entry is
 * built from this so a copy-pasted next step always runs the real tool.
 */
export function cliInvocation(): string {
  const onPath = binNameOnPath();
  if (onPath) return onPath;
  const exe = currentExecutableRealPath();
  if (exe && isSkillBundlePath(exe)) return collapseHomeDirectory(exe);
  return `npx -y ${PACKAGE_NAME}`;
}

/**
 * The home-collapsed ABSOLUTE path of the running executable — the home view's `bin:` identity field
 * (AXI §10). Falls back to the package name if the path cannot be resolved.
 */
export function binPath(): string {
  const exe = currentExecutableRealPath();
  return exe ? collapseHomeDirectory(exe) : PACKAGE_NAME;
}

/**
 * The command a persistent SessionStart hook should run: the bare bin name when on PATH (fast,
 * portable), else the ABSOLUTE executable path (directly runnable via its shebang) — NOT the npx
 * form, so a per-session hook has no network/startup cost. This mirrors the axi-sdk-js
 * `resolvePortableHookCommand` semantics, so the value we DISPLAY matches what the installer writes.
 */
export function hookCommand(): string {
  return binNameOnPath() ?? currentExecutableRealPath() ?? PACKAGE_NAME;
}
