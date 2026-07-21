import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const baseExpectedFiles = ["LICENSE", "README.md", "SKILL.md", "dist/agentstate-lite.mjs", "package.json"];

/** The exact expected tarball file set: the fixed base plus the committed references/ tree. */
export function expectedTarballFiles(referenceFiles) {
  return [...baseExpectedFiles, ...referenceFiles.map((relative) => `references/${relative}`)].sort();
}
const runtimeDependencyFields = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
  "bundledDependencies",
  "bundleDependencies",
];

function npmInvocation(args, env = process.env) {
  const npmCli = env.npm_execpath?.trim();
  if (!npmCli) {
    throw new Error("npm_execpath is required; run `npm run verify:npm-package` from the repository root");
  }
  return { command: process.execPath, args: [npmCli, ...args] };
}

async function run(command, args, options = {}) {
  return execFileAsync(command, args, {
    maxBuffer: 20 * 1024 * 1024,
    ...options,
  });
}

export function sanitizedNpmEnvironment(source, userConfig) {
  const env = {};
  for (const [key, value] of Object.entries(source)) {
    if (!key.toLowerCase().startsWith("npm_config_")) env[key] = value;
  }
  return {
    ...env,
    npm_config_dry_run: "false",
    npm_config_bin_links: "true",
    npm_config_userconfig: userConfig,
  };
}

async function runNpm(args, options = {}) {
  const env = sanitizedNpmEnvironment(options.env ?? process.env, options.npmUserConfig);
  const invocation = npmInvocation(args, env);
  const { npmUserConfig: _, ...runOptions } = options;
  return run(invocation.command, invocation.args, { ...runOptions, env });
}

function hasWorkspaceReference(value) {
  if (typeof value === "string") return value.startsWith("workspace:");
  if (Array.isArray(value)) return value.some(hasWorkspaceReference);
  if (value && typeof value === "object") return Object.values(value).some(hasWorkspaceReference);
  return false;
}

export function assertPackageContract(receipt, manifest, referenceFiles) {
  const tarballFiles = receipt.files.map((file) => file.path).sort();
  assert.deepEqual(
    tarballFiles,
    expectedTarballFiles(referenceFiles),
    "the npm tarball must contain only the CLI, manifest, README, license, SKILL.md, and references/",
  );
  assert.deepEqual(
    tarballFiles.filter((file) => file.endsWith(".mjs")),
    ["dist/agentstate-lite.mjs"],
    "the tarball must carry exactly one .mjs executable (the dist bundle)",
  );
  assert.equal(manifest.name, "aslite");
  assert.deepEqual(manifest.files, ["dist", "SKILL.md", "references"]);
  assert.deepEqual(manifest.bin, {
    aslite: "dist/agentstate-lite.mjs",
    "agentstate-lite": "dist/agentstate-lite.mjs",
  });
  for (const field of runtimeDependencyFields) {
    assert.ok(
      manifest[field] === undefined || Object.keys(manifest[field]).length === 0,
      `${field} must be empty in the published CLI`,
    );
  }
  assert.equal(hasWorkspaceReference(manifest), false, "the published manifest must not contain workspace: references");
}

async function listFiles(root, relative = "") {
  const files = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(root, child)));
    else if (entry.isFile()) files.push(child);
  }
  return files.sort();
}

async function snapshotTree(root) {
  const snapshot = new Map();
  for (const relative of await listFiles(root)) {
    const absolute = path.join(root, relative);
    const [bytes, info] = await Promise.all([readFile(absolute), stat(absolute)]);
    snapshot.set(relative.split(path.sep).join("/"), { bytes, mode: info.mode });
  }
  return snapshot;
}

function assertSnapshotUnchanged(before, after, label) {
  assert.deepEqual([...after.keys()], [...before.keys()], `${label} file set changed during npm verification`);
  for (const [relative, expected] of before) {
    const actual = after.get(relative);
    assert.ok(actual.bytes.equals(expected.bytes), `${label}${relative} changed during npm verification`);
    assert.equal(actual.mode, expected.mode, `${label}${relative} mode changed during npm verification`);
  }
}

function parseJson(stdout, label) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${label} did not emit valid JSON: ${error.message}`);
  }
}

function pathDelimiter(platform) {
  return platform === "win32" ? ";" : ":";
}

function normalizedPath(value, platform) {
  const resolved = path.resolve(value);
  return platform === "win32" ? resolved.toLowerCase() : resolved;
}

export async function resolveCommandOnPath(command, env, platform = process.platform) {
  const directories = (env.PATH ?? "").split(pathDelimiter(platform)).filter(Boolean);
  const extensions =
    platform === "win32"
      ? (env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean)
      : [""];
  for (const directory of directories) {
    for (const extension of extensions) {
      const candidate = path.join(directory, `${command}${extension.toLowerCase()}`);
      try {
        await access(candidate, platform === "win32" ? constants.F_OK : constants.X_OK);
        return candidate;
      } catch {
        // Keep searching the explicit PATH.
      }
    }
  }
  return undefined;
}

export async function assertCommandInBin(command, env, binDir, platform = process.platform) {
  const expected = path.join(binDir, platform === "win32" ? `${command}.cmd` : command);
  const resolved = await resolveCommandOnPath(command, env, platform);
  assert.equal(
    resolved && normalizedPath(resolved, platform),
    normalizedPath(expected, platform),
    `${command} must resolve from the isolated npm prefix`,
  );
  return expected;
}

export async function verifyNpmPackage() {
  const scratch = await mkdtemp(path.join(tmpdir(), "agentstate-lite-npm-proof-"));
  const packDir = path.join(scratch, "pack");
  const prefix = path.join(scratch, "prefix");
  const home = path.join(scratch, "home");
  const bundle = path.join(scratch, "bundle");
  const npmUserConfig = path.join(scratch, "empty-npmrc");
  const pluginsDir = path.join(repoRoot, "plugins");
  const marketplaceDir = path.join(repoRoot, ".claude-plugin");
  const pluginsBefore = await snapshotTree(pluginsDir);
  const marketplaceBefore = await snapshotTree(marketplaceDir);

  try {
    await Promise.all([mkdir(packDir), mkdir(prefix), mkdir(home)]);
    await writeFile(npmUserConfig, "");
    const cleanBuildEnv = sanitizedNpmEnvironment(process.env, npmUserConfig);
    await run(process.execPath, [path.join(repoRoot, "packages", "cli", "build.mjs")], {
      cwd: repoRoot,
      env: cleanBuildEnv,
    });
    const packed = await runNpm(
      [
        "pack",
        "--json",
        "--ignore-scripts",
        "--pack-destination",
        packDir,
      ],
      { cwd: path.join(repoRoot, "packages", "cli"), npmUserConfig },
    );
    const receipts = parseJson(packed.stdout, "npm pack");
    assert.equal(receipts.length, 1, "npm pack must produce exactly one tarball");
    const receipt = receipts[0];
    const tarball = path.join(packDir, receipt.filename);

    await runNpm(
      [
        "install",
        "--global",
        "--prefix",
        prefix,
        "--offline",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        tarball,
      ],
      { cwd: scratch, npmUserConfig },
    );

    const installedRoot =
      process.platform === "win32"
        ? path.join(prefix, "node_modules", "aslite")
        : path.join(prefix, "lib", "node_modules", "aslite");
    const manifest = parseJson(await readFile(path.join(installedRoot, "package.json"), "utf8"), "installed package.json");
    const committedSkillRoot = path.join(repoRoot, "packages", "cli");
    const referenceFiles = (await listFiles(path.join(committedSkillRoot, "references"))).map((relative) =>
      relative.split(path.sep).join("/"),
    );
    assertPackageContract(receipt, manifest, referenceFiles);

    // The shipped skill assets are byte-identical to the repo-committed generated ones (which
    // check:skill pins to the renderer + resource manifest).
    for (const relative of ["SKILL.md", ...referenceFiles.map((file) => `references/${file}`)]) {
      const installed = await readFile(path.join(installedRoot, relative));
      const committed = await readFile(path.join(committedSkillRoot, relative));
      assert.ok(installed.equals(committed), `${relative} in the installed package differs from the committed copy`);
    }
    const installedSkill = await readFile(path.join(installedRoot, "SKILL.md"), "utf8");
    assert.ok(
      !installedSkill.includes("npx -y agentstate-lite"),
      "the installed SKILL.md must not use the retired npm coordinate",
    );
    for (const marker of ["plugins/cache", 'ASLITE="$(']) {
      assert.ok(
        !installedSkill.includes(marker),
        `the installed SKILL.md must not carry the marketplace-cache resolver (found ${JSON.stringify(marker)})`,
      );
    }

    const binDir = process.platform === "win32" ? prefix : path.join(prefix, "bin");
    const commandEnv = {
      ...process.env,
      PATH: `${binDir}${path.delimiter}${path.dirname(process.execPath)}`,
      HOME: home,
      USERPROFILE: home,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      AGENTSTATE_LITE_NO_AUTOPULL: "1",
    };
    await assertCommandInBin("aslite", commandEnv, binDir);
    await assertCommandInBin("agentstate-lite", commandEnv, binDir);

    const installedEntrypoint = path.join(installedRoot, manifest.bin.aslite);
    const runCli = (command, args, options = {}) => {
      const cwd = options.cwd ?? scratch;
      const env = { ...commandEnv, ...(options.env ?? {}) };
      return process.platform === "win32"
        ? run(process.execPath, [installedEntrypoint, ...args], { cwd, env })
        : run(command, args, { cwd, env });
    };

    await runCli("agentstate-lite", ["--help"]);
    await runCli("aslite", ["--help"]);
    parseJson((await runCli("aslite", ["init", "--dir", bundle, "--recipe", "none", "--json"])).stdout, "init");
    parseJson(
      (await runCli("aslite", ["recipe", "add", "work-tracking", "--dir", bundle, "--json"])).stdout,
      "recipe add",
    );
    parseJson(
      (
        await runCli("aslite", [
          "new",
          "Task",
          "package-proof",
          "--title",
          "Package proof",
          "--status",
          "todo",
          "--dir",
          bundle,
          "--json",
        ])
      ).stdout,
      "new",
    );
    const listed = parseJson(
      (await runCli("aslite", ["list", "--type", "Task", "--dir", bundle, "--json"])).stdout,
      "list",
    );
    assert.ok(
      JSON.stringify(listed).includes("tasks/package-proof"),
      "the installed CLI must list the Task it created",
    );

    // ── skill-channel proof: install → status → reinstall no-op → uninstall, project + global ──
    const project = path.join(scratch, "skill-project");
    const foreignSkill = path.join(project, ".claude", "skills", "foreign");
    await mkdir(foreignSkill, { recursive: true });
    await writeFile(path.join(foreignSkill, "SKILL.md"), "# foreign skill — must survive\n");

    const skillInstall = parseJson(
      (await runCli("aslite", ["skill", "install", "--scope", "project", "--json"], { cwd: project })).stdout,
      "skill install",
    );
    assert.equal(skillInstall.skill.changed, true, "first skill install must report changed");
    for (const host of [".claude", ".codex"]) {
      const dir = path.join(project, host, "skills", "aslite");
      const installedSkillMd = await readFile(path.join(dir, "SKILL.md"));
      assert.ok(
        installedSkillMd.equals(await readFile(path.join(committedSkillRoot, "SKILL.md"))),
        `${host} installed skill SKILL.md must match the shipped copy`,
      );
      for (const relative of referenceFiles) {
        const bytes = await readFile(path.join(dir, "references", ...relative.split("/")));
        assert.ok(
          bytes.equals(await readFile(path.join(committedSkillRoot, "references", relative))),
          `${host} installed reference ${relative} must match the shipped copy`,
        );
      }
      const skillManifest = parseJson(
        await readFile(path.join(dir, ".aslite-skill.json"), "utf8"),
        "skill manifest",
      );
      assert.equal(skillManifest.package, "aslite");
      assert.equal(skillManifest.version, manifest.version);
    }

    const skillStatus = parseJson(
      (await runCli("aslite", ["skill", "status", "--scope", "project", "--json"], { cwd: project })).stdout,
      "skill status",
    );
    assert.equal(skillStatus.skill.hosts.claude_code.state, "installed");
    assert.equal(skillStatus.skill.hosts.codex.state, "installed");

    const skillReinstall = parseJson(
      (await runCli("aslite", ["skill", "install", "--scope", "project", "--json"], { cwd: project })).stdout,
      "skill reinstall",
    );
    assert.equal(skillReinstall.skill.changed, false, "reinstall over a current install must be a no-op");

    parseJson(
      (await runCli("aslite", ["skill", "uninstall", "--scope", "project", "--json"], { cwd: project })).stdout,
      "skill uninstall",
    );
    for (const host of [".claude", ".codex"]) {
      await assert.rejects(
        stat(path.join(project, host, "skills", "aslite")),
        /ENOENT/,
        `${host}/skills/aslite must be gone after uninstall`,
      );
    }
    assert.equal(
      (await readFile(path.join(foreignSkill, "SKILL.md"), "utf8")).includes("must survive"),
      true,
      "a foreign sibling skill must survive uninstall",
    );

    // Global scope under relocated host homes (CLAUDE_CONFIG_DIR / CODEX_HOME).
    const relocatedClaude = path.join(scratch, "relocated-claude");
    const relocatedCodex = path.join(scratch, "relocated-codex");
    const relocatedEnv = { CLAUDE_CONFIG_DIR: relocatedClaude, CODEX_HOME: relocatedCodex };
    parseJson(
      (
        await runCli("aslite", ["skill", "install", "--scope", "global", "--json"], {
          cwd: project,
          env: relocatedEnv,
        })
      ).stdout,
      "skill install global",
    );
    for (const dir of [relocatedClaude, relocatedCodex]) {
      await stat(path.join(dir, "skills", "aslite", "SKILL.md"));
    }
    const globalStatus = parseJson(
      (
        await runCli("aslite", ["skill", "status", "--scope", "global", "--json"], {
          cwd: project,
          env: relocatedEnv,
        })
      ).stdout,
      "skill status global",
    );
    assert.equal(globalStatus.skill.hosts.claude_code.state, "installed");
    assert.equal(globalStatus.skill.hosts.codex.state, "installed");
    parseJson(
      (
        await runCli("aslite", ["skill", "uninstall", "--scope", "global", "--json"], {
          cwd: project,
          env: relocatedEnv,
        })
      ).stdout,
      "skill uninstall global",
    );
    for (const dir of [relocatedClaude, relocatedCodex]) {
      await assert.rejects(stat(path.join(dir, "skills", "aslite")), /ENOENT/, `${dir} must be cleaned up`);
    }

    // ── hook-command stability: the written SessionStart hook runs the preferred `aslite` bin ──
    parseJson(
      (await runCli("aslite", ["hook", "install", "--scope", "project", "--json"], { cwd: project })).stdout,
      "hook install",
    );
    const settings = parseJson(
      await readFile(path.join(project, ".claude", "settings.json"), "utf8"),
      "project .claude/settings.json",
    );
    const hookCommands = (settings.hooks?.SessionStart ?? []).flatMap((group) =>
      (group.hooks ?? []).map((h) => h.command),
    );
    if (process.platform === "win32") {
      // The win32 harness execs node directly, so the bare-bin PATH probe cannot match.
      assert.equal(hookCommands.length, 1, "exactly one managed SessionStart hook");
      assert.ok(hookCommands[0].endsWith(" session-start"), "hook must run session-start");
    } else {
      assert.deepEqual(
        hookCommands,
        ["aslite session-start"],
        "the installed hook command must be exactly `aslite session-start`",
      );
    }
    parseJson(
      (await runCli("aslite", ["hook", "uninstall", "--scope", "project", "--json"], { cwd: project })).stdout,
      "hook uninstall",
    );
    const settingsAfter = parseJson(
      await readFile(path.join(project, ".claude", "settings.json"), "utf8"),
      "project .claude/settings.json after uninstall",
    );
    const remaining = (settingsAfter.hooks?.SessionStart ?? []).flatMap((group) =>
      (group.hooks ?? []).map((h) => h.command),
    );
    assert.deepEqual(remaining, [], "hook uninstall must remove the managed SessionStart hook");

    assertSnapshotUnchanged(pluginsBefore, await snapshotTree(pluginsDir), "plugins/");
    assertSnapshotUnchanged(marketplaceBefore, await snapshotTree(marketplaceDir), ".claude-plugin/");

    return {
      package: `${manifest.name}@${manifest.version}`,
      files: receipt.files.length,
      bins: Object.keys(manifest.bin),
      workflow: ["init", "recipe add", "new", "list", "skill install/status/uninstall", "hook install/uninstall"],
    };
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const result = await verifyNpmPackage();
    console.log(`verified ${result.package}: ${result.files} files, zero runtime dependencies, bins ${result.bins.join("/")}, offline workflow passed`);
  } catch (error) {
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  }
}
