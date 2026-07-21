// `aslite skill install|status|uninstall` — install this distribution's generated Agent Skill
// (SKILL.md + references/) into host skill folders.
//
// ASSET SOURCE: the running distribution's own package root (`dirname(executable)/..` → SKILL.md +
// references/) — the npm layout (`<pkg>/dist/agentstate-lite.mjs`) and a dev/repo build
// (`packages/cli/dist/…`) both resolve naturally. When the running executable IS the
// marketplace/plugin skill bundle (`…/skills/agentstate-lite/scripts/agentstate-lite.mjs`,
// see invocation.ts `isSkillBundlePath`), install refuses with guidance: that channel is
// installed via the marketplace; `skill install` ships with the npm package.
//
// TARGETS: Claude Code + Codex only, via the ONE HOST_CONFIG_ROOTS authority (the same env-var
// semantics `hook install --scope global` uses). OpenCode is deliberately excluded — it has no
// skill surface; its SessionStart integration is the plugin written by `hook install`.
//
// DESTRUCTIVE-WRITE DISCIPLINE (same boundary as hook.ts): install writes a manifest
// (`.aslite-skill.json`: file list + package version + installed-by) inside the target folder and
// REFUSES a pre-existing folder it does not manage (no manifest, a malformed manifest, or files
// present that no manifest names) — nothing is written or deleted on refusal. Uninstall removes
// EXACTLY the manifested files + the manifest, then only empty directories. Reinstall is
// idempotent/convergent: byte-stable, exit 0, changed:false when already current. Every write is
// same-directory temp + rename (atomicWriteFileSync).
//
// The MANIFEST IS WRITTEN FIRST on install — and an UPGRADE writes a TRANSITIONAL manifest
// (files = union of old and new) before touching assets, converges assets, removes obsolete old
// files, then writes the FINAL manifest (= exactly the asset set) — so every reachable
// interruption point leaves a MANAGED state whose manifest owns everything on disk: `status`
// reports stale, a re-run install converges over it (exit 0), and uninstall removes whatever
// manifested files exist. A kill inside atomicWriteFileSync's write→rename window strands a
// `<file>.tmp-<pid>-…` orphan; one whose base name we own is MANAGED DEBRIS — ignored by the
// extras scan and swept by the mutating verbs — while a temp-patterned name with a foreign base
// stays foreign — and ownership must be ESTABLISHED: without a valid manifest, the only swept
// base is the reserved manifest filename itself, so a refusal over a foreign folder deletes
// nothing of that folder's own content. (Honesty note: the sweep still runs BEFORE the
// unmanaged/malformed refusals — load-bearing for interruption recovery — so a folder about to
// be refused can first lose a reserved-manifest-name tmp.) The one unmanaged shape (files, no
// manifest) can only be foreign, and stays a refusal. A target that exists but is NOT a real directory — a symlink above all — is refused by
// every verb before any walk: destructive operations never follow a link AT the target or in
// manifested entries (ancestor symlinks, e.g. a stowed ~/.claude, are deliberately honored — the
// guard is leaf-only), and manifested files that ARE links are replaced on install / unlinked
// (never followed) on removal.
import { existsSync, lstatSync, readFileSync, readdirSync, rmSync, rmdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import {
  cliInvocation,
  collapseHomeDirectory,
  currentExecutableRealPath,
  isSkillBundlePath,
} from "../invocation.js";
import { atomicWriteFileSync } from "./hook.js";
import { render, resolveMode } from "../output.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { HOST_CONFIG_ROOTS, resolveHostConfigRoot } from "../host-config.js";

export const SKILL_USAGE = `agentstate-lite skill — install this package's Agent Skill into host skill folders

Usage:
  agentstate-lite skill install   [--scope project|global]
  agentstate-lite skill status    [--scope project|global]
  agentstate-lite skill uninstall [--scope project|global]

Installs (or removes) the generated Agent Skill shipped with this npm package — SKILL.md plus its
references/ folder — for Claude Code and Codex. OpenCode is deliberately not a target: it has no
skill surface; its SessionStart integration is the plugin written by \`hook install\`.

Install writes a manifest (${"`"}.aslite-skill.json${"`"}) inside the target folder and refuses a
pre-existing folder it does not manage; uninstall removes exactly the manifested files and refuses
a folder holding anything else. Reinstall is idempotent (exit 0, changed:false when current).
\`status\` reports per host: absent | unmanaged | installed | stale (byte-compare against this
executable's own shipped assets). Status reports install state at these paths; Codex host
discovery is verified at GLOBAL scope (codex 0.144.x) — project-scope placement follows each
host's documented convention.

Options:
  --scope project   Write to the CURRENT project (default): .claude/skills/aslite/, .codex/skills/aslite/
  --scope global    Write to each host's configured USER home (environment override or default)
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;

/** The installed skill folder name under each host's `skills/` directory. */
export const SKILL_DIR_NAME = "aslite";
/** The install-manifest filename written inside the target folder. */
export const SKILL_MANIFEST_FILENAME = ".aslite-skill.json";

/** The running distribution's skill assets: package root, version, and relative file list. */
export interface SkillAssets {
  root: string;
  version: string;
  /** Sorted, POSIX-relative to `root`: `SKILL.md` plus every file under `references/`. */
  files: string[];
}

export interface SkillManifest {
  package: string;
  version: string;
  installed_by: string;
  files: string[];
}

/** All files under `dir`, recursively, POSIX-relative (empty when `dir` does not exist). */
function listFilesRelative(dir: string, prefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relativePath = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...listFilesRelative(join(dir, entry.name), relativePath));
    else out.push(relativePath);
  }
  return out.sort();
}

/**
 * Resolve the running distribution's skill assets, or throw. `executable` is injectable for
 * tests; production resolves the real running bundle.
 */
export function resolveSkillAssets(executable?: string): SkillAssets {
  const exe = executable ?? currentExecutableRealPath();
  if (exe === undefined) {
    throw new CliError("RUNTIME", "cannot resolve the running executable's own path", {
      help: `${cliInvocation()} skill install --scope project|global`,
    });
  }
  if (isSkillBundlePath(exe)) {
    throw new CliError(
      "RUNTIME",
      "this executable is the marketplace skill bundle — that channel is installed and updated via the marketplace, and carries no separately installable skill assets",
      { help: "`skill install` ships with the npm package: npm install -g aslite, then `aslite skill install`" },
    );
  }
  const root = dirname(dirname(exe));
  const skillMd = join(root, "SKILL.md");
  const referencesDir = join(root, "references");
  if (!existsSync(skillMd) || !existsSync(referencesDir)) {
    throw new CliError(
      "RUNTIME",
      `the running distribution carries no skill assets (expected SKILL.md + references/ at ${collapseHomeDirectory(root)})`,
      { help: "run the npm-installed (or repo-built) CLI, whose package root ships both" },
    );
  }
  let version: string;
  try {
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { version?: unknown };
    version = typeof manifest.version === "string" ? manifest.version : "unknown";
  } catch {
    version = "unknown";
  }
  const files = ["SKILL.md", ...listFilesRelative(referencesDir).map((f) => `references/${f}`)].sort();
  return { root, version, files };
}

/** The per-host target folders (the `skills/aslite` dir itself) for one resolved scope. */
export interface SkillTargets {
  claude: string;
  codex: string;
}

export function skillTargets(
  scope: "project" | "global",
  deps: { cwd?: string; home?: string; env?: NodeJS.ProcessEnv } = {},
): SkillTargets {
  if (scope === "project") {
    const cwd = deps.cwd ?? process.cwd();
    return {
      claude: join(cwd, ".claude", "skills", SKILL_DIR_NAME),
      codex: join(cwd, ".codex", "skills", SKILL_DIR_NAME),
    };
  }
  const home = deps.home ?? homedir();
  const env = deps.env ?? process.env;
  return {
    claude: join(resolveHostConfigRoot(HOST_CONFIG_ROOTS.claude, home, env), "skills", SKILL_DIR_NAME),
    codex: join(resolveHostConfigRoot(HOST_CONFIG_ROOTS.codex, home, env), "skills", SKILL_DIR_NAME),
  };
}

/**
 * Refusal reason when the target path exists but is not a REAL directory — a symlink above all
 * (destructive/creative walks must never follow a link; a dangling link counts), or a plain file.
 * `undefined` means absent or a real directory: safe to proceed.
 */
function nonDirectoryRefusal(dir: string): string | undefined {
  let stats;
  try {
    stats = lstatSync(dir);
  } catch {
    return undefined; // absent — fine
  }
  if (stats.isSymbolicLink()) return "target is a symlink — refusing destructive operations through links";
  if (!stats.isDirectory()) return "target exists and is not a directory";
  return undefined;
}

/** True when the path itself is a symlink (never follows; false when absent). */
function isSymlink(p: string): boolean {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

/** atomicWriteFileSync's temp naming: `<base>.tmp-<pid>-<time36>-<rand36>`. Captures the base. */
const TEMP_DEBRIS_RE = /^(.+)\.tmp-\d+-[a-z0-9]+-[a-z0-9]+$/;

/**
 * MANAGED DEBRIS: a relative path matching OUR atomic-write temp pattern whose stripped base is a
 * path we own — the stranding a kill inside the write→rename window leaves. Scoped tightly on
 * purpose: a temp-patterned name with a foreign base stays foreign, so the extras refusal is not
 * weakened.
 */
function isManagedDebris(relativePath: string, owned: Set<string>): boolean {
  const match = TEMP_DEBRIS_RE.exec(relativePath);
  return match !== null && owned.has(match[1]!);
}

/**
 * The owned-path set debris recognition checks bases against. OWNERSHIP MUST BE ESTABLISHED: only
 * a VALID manifest extends ownership to manifested/asset file names. Without one (absent or
 * malformed — a folder the verbs will refuse as unmanaged), the ONLY owned base is the reserved
 * manifest filename itself: its tmp is unambiguously ours (needed for the first-install-kill
 * recovery shape), while an asset-named tmp in a foreign folder could shadow foreign data and
 * must survive the refusal untouched.
 */
function sweepOwnership(
  manifest: SkillManifest | undefined | null,
  assetFiles: readonly string[],
): Set<string> {
  if (manifest === undefined || manifest === null) return new Set([SKILL_MANIFEST_FILENAME]);
  return new Set([...manifest.files, ...assetFiles, SKILL_MANIFEST_FILENAME]);
}

/** Delete managed debris from `dir` (mutating verbs only — status merely ignores it). */
function sweepManagedDebris(dir: string, owned: Set<string>): boolean {
  let removed = false;
  for (const relativePath of listFilesRelative(dir)) {
    if (isManagedDebris(relativePath, owned)) {
      rmSync(join(dir, ...relativePath.split("/")), { force: true });
      removed = true;
    }
  }
  return removed;
}

/**
 * A manifest file entry we would ever act on must stay INSIDE the target folder: relative, no
 * `..` segment, no absolute path, no backslash. A violating entry marks the whole manifest
 * malformed (refusal — a hand-edited manifest must never steer a delete outside the folder).
 */
export function isSafeManifestEntry(entry: string): boolean {
  if (typeof entry !== "string" || entry.length === 0) return false;
  if (entry.startsWith("/") || entry.includes("\\") || entry.includes("\0")) return false;
  return entry.split("/").every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

/** Read + validate the folder's manifest. `undefined` when absent; `null` when malformed. */
function readManifest(dir: string): SkillManifest | undefined | null {
  const manifestPath = join(dir, SKILL_MANIFEST_FILENAME);
  if (!existsSync(manifestPath)) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as SkillManifest;
    if (typeof parsed !== "object" || parsed === null || !Array.isArray(parsed.files)) return null;
    if (!parsed.files.every(isSafeManifestEntry)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function manifestContent(assets: SkillAssets, files: readonly string[] = assets.files): string {
  const manifest: SkillManifest = {
    package: "aslite",
    version: assets.version,
    installed_by: "aslite skill install",
    files: [...files],
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/** Files in `dir` that neither the manifest nor the new asset set accounts for. */
function unmanagedExtras(dir: string, managed: Set<string>): string[] {
  return listFilesRelative(dir).filter((f) => f !== SKILL_MANIFEST_FILENAME && !managed.has(f));
}

type InstallResult = { ok: true; changed: boolean } | { ok: false; reason: string };

/** Convergent install into one target folder. Refuses (nothing written) a folder we don't manage. */
function installIntoDir(dir: string, assets: SkillAssets): InstallResult {
  const notDir = nonDirectoryRefusal(dir);
  if (notDir !== undefined) return { ok: false, reason: notDir };
  const manifest = readManifest(dir);
  const debrisRemoved = sweepManagedDebris(dir, sweepOwnership(manifest, assets.files));
  if (existsSync(dir)) {
    if (manifest === undefined && listFilesRelative(dir).length > 0) {
      return { ok: false, reason: `folder exists with no ${SKILL_MANIFEST_FILENAME} manifest — not managed by this tool` };
    }
    if (manifest === null) {
      return { ok: false, reason: `${SKILL_MANIFEST_FILENAME} is malformed — refusing to write over a folder in an unknown state` };
    }
    if (manifest !== undefined) {
      const managed = new Set([...manifest.files, ...assets.files]);
      const extras = unmanagedExtras(dir, managed);
      if (extras.length > 0) {
        return {
          ok: false,
          reason: `folder holds file(s) the manifest does not name: ${extras.join(", ")} — remove them or delete the folder, then re-run`,
        };
      }
    }
  }
  let changed = debrisRemoved;
  // Manifest FIRST — and on an UPGRADE over an existing valid manifest, a TRANSITIONAL manifest
  // first: files = union(old manifested files, new asset files). Every interruption point then
  // leaves a manifest that OWNS everything on disk (old survivors, partial new assets, or both),
  // so the extras refusal can never fire on our own intermediate state; a re-run converges and
  // uninstall removes only owned files. The FINAL manifest (= exactly the asset set) lands only
  // after assets are converged AND obsolete old files are removed.
  const manifestPath = join(dir, SKILL_MANIFEST_FILENAME);
  const finalManifest = manifestContent(assets);
  const unionFiles = [...new Set([...(manifest?.files ?? []), ...assets.files])].sort();
  const transitionalManifest = manifestContent(assets, unionFiles);
  const writeManifest = (content: string): void => {
    // atomicWriteFileSync writes THROUGH a symlinked destination (right for user-owned settings);
    // skill-folder contents are wholly TOOL-owned, so a link here is unmanaged drift — converge by
    // REPLACING the link with a real file: unlink the link itself first (never its target).
    if (isSymlink(manifestPath)) rmSync(manifestPath, { force: true });
    atomicWriteFileSync(manifestPath, content);
    changed = true;
  };
  const currentManifest =
    !isSymlink(manifestPath) && existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : undefined;
  // Steady state (current == final) and resumed-upgrade state (current == transitional) skip this
  // write; anything else (fresh install, v1 manifest, symlinked/hand-edited manifest) gets the
  // transitional content, which for a fresh install IS the final content (union == asset set).
  if (currentManifest !== transitionalManifest && currentManifest !== finalManifest) {
    writeManifest(transitionalManifest);
  }
  const wanted = new Set(assets.files);
  for (const relativePath of assets.files) {
    const bytes = readFileSync(join(assets.root, relativePath));
    const destPath = join(dir, ...relativePath.split("/"));
    // A dest that is a LINK is always replaced with a real file (same rationale as the manifest).
    const destIsLink = isSymlink(destPath);
    const current = !destIsLink && existsSync(destPath) ? readFileSync(destPath) : undefined;
    if (destIsLink || current === undefined || !bytes.equals(current)) {
      if (destIsLink) rmSync(destPath, { force: true });
      atomicWriteFileSync(destPath, bytes);
      changed = true;
    }
  }
  // A previously manifested file no longer shipped converges away.
  for (const relativePath of manifest?.files ?? []) {
    if (!wanted.has(relativePath)) {
      rmSync(join(dir, ...relativePath.split("/")), { force: true });
      changed = true;
    }
  }
  // FINAL manifest: exactly the asset set — written only now that the disk matches it.
  const manifestAfterConverge = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : undefined;
  if (manifestAfterConverge !== finalManifest) {
    writeManifest(finalManifest);
  }
  removeEmptyDirectories(dir, false);
  return { ok: true, changed };
}

/** Remove empty directories bottom-up under `dir`; when `removeSelf`, also `dir` if empty. */
function removeEmptyDirectories(dir: string, removeSelf: boolean): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirectories(join(dir, entry.name), true);
  }
  if (removeSelf && readdirSync(dir).length === 0) rmdirSync(dir);
}

type UninstallResult = { ok: true; changed: boolean } | { ok: false; reason: string };

/**
 * Remove EXACTLY the manifested files (skip-missing — a manifest-first partial install cleans up
 * without a throw) + the manifest; refuse a folder holding anything else, and refuse a target
 * that is not a real directory before any walk.
 */
function uninstallFromDir(dir: string): UninstallResult {
  const notDir = nonDirectoryRefusal(dir);
  if (notDir !== undefined) return { ok: false, reason: notDir };
  if (!existsSync(dir)) return { ok: true, changed: false };
  const manifest = readManifest(dir);
  const debrisRemoved = sweepManagedDebris(dir, sweepOwnership(manifest, []));
  if (manifest === undefined) {
    // A folder left empty (a first-install kill stranded only OUR manifest tmp, or a pre-existing
    // empty dir) holds nothing foreign — a no-op, cleaned up only when we removed the debris.
    if (listFilesRelative(dir).length === 0) {
      if (debrisRemoved) removeEmptyDirectories(dir, true);
      return { ok: true, changed: debrisRemoved };
    }
    return { ok: false, reason: `folder exists with no ${SKILL_MANIFEST_FILENAME} manifest — not managed by this tool, nothing deleted` };
  }
  if (manifest === null) {
    return { ok: false, reason: `${SKILL_MANIFEST_FILENAME} is malformed — refusing to delete anything from a folder in an unknown state` };
  }
  const managed = new Set(manifest.files);
  const extras = unmanagedExtras(dir, managed);
  if (extras.length > 0) {
    return {
      ok: false,
      reason: `folder holds file(s) the manifest does not name: ${extras.join(", ")} — nothing deleted`,
    };
  }
  for (const relativePath of manifest.files) {
    // rmSync unlinks a symlinked entry itself, never its target; force skips absent files.
    rmSync(join(dir, ...relativePath.split("/")), { force: true });
  }
  rmSync(join(dir, SKILL_MANIFEST_FILENAME), { force: true });
  removeEmptyDirectories(dir, true);
  return { ok: true, changed: true };
}

export type SkillState = "absent" | "unmanaged" | "installed" | "stale";

/**
 * Read-only per-folder state: byte-compare the manifested install against the running assets.
 * A target that is not a real directory (a symlink above all) reports `unmanaged` — the same
 * honesty install/uninstall enforce as a refusal. A manifest whose files are missing, partial,
 * hand-edited, or symlinked is managed-STALE (install converges over it), never unmanaged.
 * Managed temp-write debris is IGNORED (status stays read-only; the mutating verbs sweep it).
 */
export function skillStatusForDir(dir: string, assets: SkillAssets): { state: SkillState; version?: string } {
  if (nonDirectoryRefusal(dir) !== undefined) return { state: "unmanaged" };
  if (!existsSync(dir)) return { state: "absent" };
  const manifest = readManifest(dir);
  const owned = sweepOwnership(manifest, assets.files);
  const files = listFilesRelative(dir).filter((f) => !isManagedDebris(f, owned));
  if (files.length === 0) return { state: "absent" };
  if (manifest === undefined || manifest === null) return { state: "unmanaged" };
  const version = typeof manifest.version === "string" ? manifest.version : undefined;
  const onDisk = files.filter((f) => f !== SKILL_MANIFEST_FILENAME);
  const sameSet =
    onDisk.length === assets.files.length && onDisk.every((f, i) => f === assets.files[i]);
  if (!sameSet) return { state: "stale", version };
  for (const relativePath of assets.files) {
    const installedPath = join(dir, ...relativePath.split("/"));
    if (isSymlink(installedPath)) return { state: "stale", version };
    const installed = readFileSync(installedPath);
    const shipped = readFileSync(join(assets.root, relativePath));
    if (!installed.equals(shipped)) return { state: "stale", version };
  }
  if (readFileSync(join(dir, SKILL_MANIFEST_FILENAME), "utf8") !== manifestContent(assets)) {
    return { state: "stale", version };
  }
  return { state: "installed", version };
}

/** Injectable seams, defaulting to production. */
export interface SkillDeps {
  cwd?: string;
  home?: string;
  env?: NodeJS.ProcessEnv;
  /** Override the running-executable path the asset source derives from (tests). */
  executable?: string;
  stdout?: (s: string) => void;
}

/**
 * CLI entry: dispatch the positional subcommand (install|status|uninstall). Output is TOON. An
 * unknown/missing subcommand, or an unsupported --scope, is a USAGE error; a refused folder is a
 * structured RUNTIME failure with nothing written or deleted at the refusing target.
 */
export async function skill(argv: string[], deps: SkillDeps = {}): Promise<void> {
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
    "skill",
  );
  if (values.help) {
    stdout(SKILL_USAGE);
    return;
  }

  const sub = positionals[0];
  if (sub !== "install" && sub !== "status" && sub !== "uninstall") {
    throw new CliError(
      "USAGE",
      sub === undefined
        ? "skill requires a subcommand (install|status|uninstall)"
        : `unknown skill subcommand: ${sub} (expected install|status|uninstall)`,
      { help: `${cliInvocation()} skill install|status|uninstall [--scope project|global]` },
    );
  }

  const scope = (values.scope as string | undefined) ?? "project";
  if (scope !== "project" && scope !== "global") {
    throw new CliError("USAGE", `unsupported skill scope: ${scope} (expected project|global)`, {
      help: `${cliInvocation()} skill ${sub} --scope project|global`,
    });
  }

  const targets = skillTargets(scope, deps);
  const mode = resolveMode(values);
  const hostDirs: [key: "claude_code" | "codex", dir: string][] = [
    ["claude_code", targets.claude],
    ["codex", targets.codex],
  ];

  if (sub === "status") {
    const assets = resolveSkillAssets(deps.executable);
    const hosts: Record<string, unknown> = {};
    for (const [key, dir] of hostDirs) {
      const s = skillStatusForDir(dir, assets);
      hosts[key] = { path: collapseHomeDirectory(dir), state: s.state, ...(s.version ? { version: s.version } : {}) };
    }
    stdout(render({ skill: { action: "status", scope, version: assets.version, hosts } }, mode));
    return;
  }

  if (sub === "install") {
    const assets = resolveSkillAssets(deps.executable);
    const refusals: string[] = [];
    const hosts: Record<string, unknown> = {};
    let changed = false;
    for (const [key, dir] of hostDirs) {
      // Any unexpected fs throw on one host becomes a structured refusal so the sibling host
      // still processes (same aggregation shape as hook install).
      let result: InstallResult;
      try {
        result = installIntoDir(dir, assets);
      } catch (err) {
        result = { ok: false, reason: `unexpected error: ${err instanceof Error ? err.message : String(err)}` };
      }
      if (!result.ok) {
        refusals.push(`${collapseHomeDirectory(dir)}: ${result.reason}`);
        continue;
      }
      changed = changed || result.changed;
      hosts[key] = { path: collapseHomeDirectory(dir), changed: result.changed };
    }
    if (refusals.length > 0) {
      throw new CliError(
        "RUNTIME",
        `skill install refused ${refusals.length} target folder(s); other targets were still processed`,
        {
          details: { refused: refusals },
          help: "inspect the named folder(s) — nothing was written to them; remove what this tool does not manage, then re-run",
        },
      );
    }
    stdout(
      render(
        {
          skill: {
            action: "install",
            scope,
            version: assets.version,
            source: collapseHomeDirectory(assets.root),
            changed,
            hosts,
          },
        },
        mode,
      ),
    );
    return;
  }

  // uninstall
  const refusals: string[] = [];
  const hosts: Record<string, unknown> = {};
  let changed = false;
  for (const [key, dir] of hostDirs) {
    // Same per-host wrap as install: one host's unexpected fs throw must never abort the sibling.
    let result: UninstallResult;
    try {
      result = uninstallFromDir(dir);
    } catch (err) {
      result = { ok: false, reason: `unexpected error: ${err instanceof Error ? err.message : String(err)}` };
    }
    if (!result.ok) {
      refusals.push(`${collapseHomeDirectory(dir)}: ${result.reason}`);
      continue;
    }
    changed = changed || result.changed;
    hosts[key] = { path: collapseHomeDirectory(dir), changed: result.changed };
  }
  if (refusals.length > 0) {
    throw new CliError(
      "RUNTIME",
      `skill uninstall refused ${refusals.length} target folder(s); other targets were still processed`,
      {
        details: { refused: refusals },
        help: "inspect the named folder(s) — nothing was deleted from them",
      },
    );
  }
  stdout(render({ skill: { action: "uninstall", scope, changed, hosts } }, mode));
}
