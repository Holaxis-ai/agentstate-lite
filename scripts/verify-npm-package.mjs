import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { access, mkdtemp, mkdir, readFile, readdir, realpath, rm, stat, symlink, writeFile } from "node:fs/promises";
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

export function verificationPolicy(mode) {
  if (mode === "local") return { mode, artifactChannel: "local-dev" };
  if (mode === "release") return { mode, artifactChannel: "npm-package" };
  throw new Error("usage: verify-npm-package.mjs --local|--release [--json]");
}

const USAGE = "usage: verify-npm-package.mjs (--local | --release | --tarball <path> --manifest <path>) [--json]";

export function parseVerificationArgs(argv) {
  const json = argv.includes("--json");
  const rest = argv.filter((arg) => arg !== "--json");

  const tarballAt = rest.indexOf("--tarball");
  if (tarballAt !== -1) {
    // Retained-artifact mode: verify an ALREADY-PACKED tarball with NO build and NO pack. This is
    // the mode the staged-release workflow and prepublishOnly use so the verified bytes are the
    // SAME bytes that get staged/published — never a freshly-rebuilt second candidate. The manifest
    // is REQUIRED: without it the SHA cross-check is impossible and ANY valid npm-package tarball
    // would pass instead of specifically the staged candidate (QA finding #2). Fail closed.
    const tarball = rest[tarballAt + 1];
    if (!tarball || tarball.startsWith("--")) throw new Error(USAGE);
    const manifestAt = rest.indexOf("--manifest");
    if (manifestAt === -1) throw new Error(USAGE);
    const manifest = rest[manifestAt + 1];
    if (!manifest || manifest.startsWith("--")) throw new Error(USAGE);
    const consumed = new Set([tarballAt, tarballAt + 1, manifestAt, manifestAt + 1]);
    const leftover = rest.filter((_, i) => !consumed.has(i));
    if (leftover.length !== 0) throw new Error(USAGE);
    return { mode: "tarball", tarball, manifest, json };
  }

  if (rest.length !== 1 || (rest[0] !== "--local" && rest[0] !== "--release")) {
    throw new Error(USAGE);
  }
  return { mode: rest[0].slice(2), json };
}

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

export function sanitizedNpmEnvironment(source, userConfig, cache) {
  const env = {};
  for (const [key, value] of Object.entries(source)) {
    if (!key.toLowerCase().startsWith("npm_config_")) env[key] = value;
  }
  const sanitized = {
    ...env,
    npm_config_dry_run: "false",
    npm_config_bin_links: "true",
    npm_config_userconfig: userConfig,
  };
  if (cache) sanitized.npm_config_cache = cache;
  return sanitized;
}

async function runNpm(args, options = {}) {
  const env = sanitizedNpmEnvironment(
    options.env ?? process.env,
    options.npmUserConfig,
    options.npmCache,
  );
  const invocation = npmInvocation(args, env);
  const { npmUserConfig: _, npmCache: __, ...runOptions } = options;
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
  assert.equal(manifest.name, "@holaxis/aslite");
  assert.deepEqual(manifest.files, ["dist", "SKILL.md", "references"]);
  assert.deepEqual(manifest.bin, {
    aslite: "dist/agentstate-lite.mjs",
    "agentstate-lite": "dist/agentstate-lite.mjs",
  });
  // Scoped packages default to restricted at publish time — the manifest must pin public.
  assert.deepEqual(manifest.publishConfig, { access: "public" }, "publishConfig.access must be public");
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

/** SHA-256 of a file, prefixed `sha256:` (the build-identity convention). */
export async function fileSha256(file) {
  return `sha256:${createHash("sha256").update(await readFile(file)).digest("hex")}`;
}

/**
 * Two producers, ONE proof. `spec.produce({ scratch, packDir, npmUserConfig, npmCache })` returns
 * `{ tarball, meta }`: either builds+packs a fresh scratch candidate (developer/PR modes) OR
 * accepts an ALREADY-RETAINED tarball and packs nothing (the staged-release path). The install +
 * contract + workflow + identity proof below is byte-for-byte identical across both — the ONLY
 * difference is where the tarball came from, which is exactly the retained-artifact invariant:
 * the bytes we prove are the bytes that ship.
 */
async function runInstalledProof(spec) {
  const scratch = await mkdtemp(path.join(tmpdir(), "agentstate-lite-npm-proof-"));
  const packDir = path.join(scratch, "pack");
  const prefix = path.join(scratch, "prefix");
  const home = path.join(scratch, "home");
  const bundle = path.join(scratch, "bundle");
  const npmUserConfig = path.join(scratch, "empty-npmrc");
  const npmCache = path.join(scratch, "npm-cache");
  const pluginsDir = path.join(repoRoot, "plugins");
  const marketplaceDir = path.join(repoRoot, ".claude-plugin");
  const pluginsBefore = await snapshotTree(pluginsDir);
  const marketplaceBefore = await snapshotTree(marketplaceDir);

  try {
    await Promise.all([mkdir(packDir), mkdir(prefix), mkdir(home)]);
    await writeFile(npmUserConfig, "");
    const { tarball, meta } = await spec.produce({ scratch, packDir, npmUserConfig, npmCache });

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
      { cwd: scratch, npmUserConfig, npmCache },
    );

    const installedRoot =
      process.platform === "win32"
        ? path.join(prefix, "node_modules", "@holaxis", "aslite")
        : path.join(prefix, "lib", "node_modules", "@holaxis", "aslite");
    const manifest = parseJson(await readFile(path.join(installedRoot, "package.json"), "utf8"), "installed package.json");
    const committedSkillRoot = path.join(repoRoot, "packages", "cli");
    const referenceFiles = (await listFiles(path.join(committedSkillRoot, "references"))).map((relative) =>
      relative.split(path.sep).join("/"),
    );
    // Derive the tarball's file set from the installed tree so the contract check holds in BOTH
    // producer modes (retained mode never sees npm pack's file list). The installed
    // node_modules/@holaxis/aslite tree IS the tarball's contents.
    const contractReceipt = {
      files: (await listFiles(installedRoot)).map((relative) => ({ path: relative.split(path.sep).join("/") })),
    };
    assertPackageContract(contractReceipt, manifest, referenceFiles);

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
    assert.ok(
      installedSkill.includes('REFS="<skill-base-dir>/references"'),
      "the installed SKILL.md must instruct setting $REFS from the host-reported skill base directory",
    );
    for (const banned of ["cat references/", "promote references/"]) {
      assert.ok(
        !installedSkill.includes(banned),
        `the installed SKILL.md must not emit cwd-relative reference commands (found ${JSON.stringify(banned)})`,
      );
    }

    const binDir = process.platform === "win32" ? prefix : path.join(prefix, "bin");
    if (process.platform !== "win32") {
      // `npm install --prefix` builds an isolated package prefix but not a Node installation.
      // Model the supported real-world POSIX global layout so durable hook authority can prove
      // and persist the stable <prefix>/bin/node launcher.
      await symlink(process.execPath, path.join(binDir, "node"));
    }
    const commandEnv = {
      ...process.env,
      PATH: `${binDir}${path.delimiter}${path.dirname(process.execPath)}`,
      npm_config_prefix: prefix,
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

    // Every installed projection agrees with the immutable build identity. Both bin aliases resolve
    // the same bytes, and the adjacent installed manifest is diagnostic rather than authority.
    const preferredVersion = (await runCli("aslite", ["--version"])).stdout.trim();
    const legacyVersion = (await runCli("agentstate-lite", ["-v"])).stdout.trim();
    assert.equal(preferredVersion, manifest.version, "aslite --version must equal the package manifest");
    assert.equal(legacyVersion, manifest.version, "agentstate-lite -v must equal the package manifest");
    const preferredIdentity = parseJson(
      (await runCli("aslite", ["version", "--json"])).stdout,
      "aslite version --json",
    );
    const legacyIdentity = parseJson(
      (await runCli("agentstate-lite", ["version", "--json"])).stdout,
      "agentstate-lite version --json",
    );
    assert.deepEqual(legacyIdentity, preferredIdentity, "both installed bin aliases must report one identity");
    assert.equal(preferredIdentity.identity.schema, "aslite.build-identity.v1");
    assert.deepEqual(preferredIdentity.identity.package, {
      name: "@holaxis/aslite",
      version: manifest.version,
    });
    assert.equal(preferredIdentity.identity.artifact.channel, spec.expectedChannel);
    const installedSha = `sha256:${createHash("sha256").update(await readFile(installedEntrypoint)).digest("hex")}`;
    assert.equal(preferredIdentity.identity.artifact.sha256, installedSha);
    const installedEntrypointRealPath = await realpath(installedEntrypoint);
    assert.equal(preferredIdentity.identity.runtime.executable_path, installedEntrypointRealPath);
    assert.deepEqual(preferredIdentity.identity.compatibility_contracts, { skill: 1, hook: 1, mcp: 1 });
    assert.deepEqual(preferredIdentity.drift, {
      adjacent_package_version: manifest.version,
      version_mismatch: false,
    });
    const homeIdentity = parseJson((await runCli("aslite", ["--json"])).stdout, "aslite home --json")[
      "agentstate-lite"
    ];
    assert.equal(homeIdentity.version, manifest.version);
    assert.equal(homeIdentity.channel, spec.expectedChannel);
    assert.equal(homeIdentity.bin, installedEntrypointRealPath);

    await runCli("agentstate-lite", ["--help"]);
    await runCli("aslite", ["--help"]);
    const initHelp = (await runCli("aslite", ["init", "--help"])).stdout;
    assert.match(
      initHelp,
      /(?:agentstate-lite|aslite) recipes/,
      "init help must point at recipe discovery through an installed bin alias",
    );
    const discoveryDir = path.join(scratch, "recipe-discovery");
    await mkdir(discoveryDir);
    const discoveredRecipes = parseJson(
      (await runCli("aslite", ["recipes", "--json"], { cwd: discoveryDir })).stdout,
      "bundle-free recipes",
    );
    assert.ok(discoveredRecipes.count >= 3, "the installed CLI must discover the built-in recipe inventory");
    const contextNotes = discoveredRecipes.recipes.find((recipe) => recipe.name === "context-notes");
    assert.ok(contextNotes, "the installed recipe inventory must include context-notes");
    assert.equal(contextNotes.applied, null, "bundle-free discovery must not imply an applied state");
    assert.deepEqual(contextNotes.commands, {
      create_bundle: "aslite init --recipe context-notes",
      add_to_bundle: "aslite recipe add context-notes",
    });
    assert.deepEqual(await readdir(discoveryDir), [], "recipe discovery must not create bundle files");
    parseJson((await runCli("aslite", ["init", "--dir", bundle, "--recipe", "none", "--json"])).stdout, "init");
    parseJson(
      (await runCli("aslite", ["recipe", "add", "work-tracking", "--dir", bundle, "--json"])).stdout,
      "recipe add",
    );

    // ── init --create-only: the installed guard proves the exact public spelling offline ──
    const freshCreateOnly = path.join(scratch, "create-only-fresh");
    parseJson(
      (await runCli("aslite", ["init", "--create-only", "--dir", freshCreateOnly, "--recipe", "none", "--json"])).stdout,
      "init --create-only (fresh)",
    );
    const bundleSnapshotBefore = await snapshotTree(bundle);
    const refused = await runCli(
      "aslite",
      ["init", "--create-only", "--dir", bundle, "--json"],
      {},
    ).then(
      () => {
        throw new Error("init --create-only over an existing bundle must exit non-zero");
      },
      (error) => error,
    );
    assert.match(String(refused.stdout ?? refused.message), /already an OKF bundle/);
    assertSnapshotUnchanged(
      bundleSnapshotBefore,
      await snapshotTree(bundle),
      "create-only refusal must not change the existing bundle: ",
    );
    assert.match(initHelp, /--create-only/, "installed init help must carry the exact create-only spelling");
    const appliedRecipes = parseJson(
      (await runCli("aslite", ["recipes", "--dir", bundle, "--json"])).stdout,
      "bundle recipes",
    );
    assert.equal(
      appliedRecipes.recipes.find((recipe) => recipe.name === "work-tracking")?.applied,
      true,
      "the installed recipe inventory must retain bundle-aware applied state",
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
      assert.equal(skillManifest.package, "@holaxis/aslite");
      assert.equal(skillManifest.version, manifest.version);
    }

    const skillStatus = parseJson(
      (await runCli("aslite", ["skill", "status", "--scope", "project", "--json"], { cwd: project })).stdout,
      "skill status",
    );
    assert.equal(skillStatus.skill.hosts.claude_code.state, "installed");
    assert.equal(skillStatus.skill.hosts.codex.state, "installed");

    // Follow the installed SKILL.md's own $REFS instruction from the project ROOT: the host
    // reports the skill base dir; REFS = <base>/references, and $REFS/<dest> resolves from any cwd.
    const skillBaseDir = path.join(project, ".claude", "skills", "aslite");
    const refsDir = path.join(skillBaseDir, "references");
    const authoringViaRefs = await readFile(path.join(refsDir, "views", "references", "view-authoring-v0.md"));
    assert.ok(
      authoringViaRefs.equals(
        await readFile(path.join(committedSkillRoot, "references", "views", "references", "view-authoring-v0.md")),
      ),
      "the $REFS composition instructed by the installed SKILL.md must resolve the shipped reference from the project root",
    );

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

    // ── hook-command stability: installed hooks bind Node + the package entry, never ambient PATH ──
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
      assert.equal(hookCommands.length, 1, "exactly one managed SessionStart hook");
      assert.ok(hookCommands[0].endsWith(" session-start"), "hook must run session-start");
    } else {
      assert.deepEqual(
        hookCommands,
        [
          `${
            spec.expectedChannel === "npm-package" ? path.join(prefix, "bin", "node") : process.execPath
          } ${installedEntrypointRealPath} session-start`,
        ],
        "the installed hook must use absolute Node and package-entry paths",
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
      mode: spec.mode,
      package: `${manifest.name}@${manifest.version}`,
      files: contractReceipt.files.length,
      bins: Object.keys(manifest.bin),
      workflow: [
        "recipes",
        "init",
        "recipe add",
        "new",
        "list",
        "skill install/status/uninstall",
        "hook install/uninstall",
      ],
      identity: preferredIdentity,
      tarball: {
        path: meta.path ?? null,
        filename: meta.filename,
        sha256: meta.sha256 ?? (await fileSha256(tarball)),
        shasum: meta.shasum,
        integrity: meta.integrity,
        size: meta.size,
        unpacked_size: meta.unpackedSize,
      },
    };
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

/**
 * Scratch-candidate mode (developer `--local`, PR-gate `--release`): builds+packs a FRESH candidate
 * in the scratch dir, then proves it. This is ordinary verification — NOT the production release
 * candidate. "Build/pack once" is a claim about the release-candidate command, not this mode.
 */
export async function verifyNpmPackage({ mode }) {
  const policy = verificationPolicy(mode);
  return runInstalledProof({
    mode: policy.mode,
    expectedChannel: policy.artifactChannel,
    async produce({ packDir, npmUserConfig, npmCache }) {
      const cleanBuildEnv = sanitizedNpmEnvironment(process.env, npmUserConfig, npmCache);
      await run(process.execPath, [path.join(repoRoot, "packages", "cli", "build.mjs"), policy.artifactChannel], {
        cwd: repoRoot,
        env: cleanBuildEnv,
      });
      const packed = await runNpm(
        ["pack", "--json", "--ignore-scripts", "--pack-destination", packDir],
        { cwd: path.join(repoRoot, "packages", "cli"), npmUserConfig, npmCache },
      );
      const receipts = parseJson(packed.stdout, "npm pack");
      assert.equal(receipts.length, 1, "npm pack must produce exactly one tarball");
      const receipt = receipts[0];
      const tarball = path.join(packDir, receipt.filename);
      return {
        tarball,
        meta: {
          path: tarball,
          filename: receipt.filename,
          sha256: await fileSha256(tarball),
          shasum: receipt.shasum,
          integrity: receipt.integrity,
          size: receipt.size,
          unpackedSize: receipt.unpackedSize,
        },
      };
    },
  });
}

/**
 * Retained-artifact mode (`--tarball <path> [--manifest <candidate.json>]`): verifies an
 * ALREADY-PACKED tarball with NO build and NO pack. Contains, by construction, zero calls to
 * build.mjs or `npm pack` — the whole point of P5A's no-rebuild invariant. When a candidate
 * manifest is supplied its recorded SHA-256 must equal the tarball's actual bytes, so a swapped
 * or rebuilt artifact fails closed here before it can be staged.
 */
export async function verifyRetainedTarball({ tarball, manifest }) {
  const tarballPath = path.resolve(tarball);
  // The manifest is MANDATORY (QA finding #2): it is the only thing that ties these exact bytes to
  // the staged candidate. Without it we could only prove "some valid npm-package tarball", which is
  // not the retained-artifact guarantee. Fail closed.
  if (!manifest) {
    throw new Error("verifyRetainedTarball requires a candidate manifest (the retained SHA cross-check anchor)");
  }
  await access(tarballPath, constants.R_OK).catch(() => {
    throw new Error(`retained tarball not found: ${tarballPath}`);
  });
  const actualSha = await fileSha256(tarballPath);
  const recorded = parseJson(await readFile(path.resolve(manifest), "utf8"), "candidate manifest");
  const recordedSha = recorded?.tarball?.sha256;
  assert.equal(
    actualSha,
    recordedSha,
    `retained tarball SHA-256 ${actualSha} does not match candidate manifest ${recordedSha ?? "<missing>"}`,
  );
  assert.equal(
    recorded?.build_identity?.artifact?.channel ?? "npm-package",
    "npm-package",
    "a retained release candidate must carry the npm-package artifact channel",
  );
  return runInstalledProof({
    mode: "tarball",
    // A retained release candidate is always an npm-package build; the identity proof enforces it.
    expectedChannel: "npm-package",
    async produce() {
      return {
        tarball: tarballPath,
        meta: {
          path: tarballPath,
          filename: path.basename(tarballPath),
          sha256: actualSha,
          shasum: recorded?.tarball?.shasum ?? null,
          integrity: recorded?.tarball?.integrity ?? null,
          size: recorded?.tarball?.size ?? null,
          unpackedSize: recorded?.tarball?.unpacked_size ?? null,
        },
      };
    },
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const args = parseVerificationArgs(process.argv.slice(2));
    const result =
      args.mode === "tarball"
        ? await verifyRetainedTarball({ tarball: args.tarball, manifest: args.manifest })
        : await verifyNpmPackage({ mode: args.mode });
    if (args.json) {
      console.log(JSON.stringify(result));
    } else {
      const source = result.identity.identity.source;
      console.log(
        `verified ${result.mode} ${result.package}: ${result.files} files, zero runtime dependencies, ` +
          `bins ${result.bins.join("/")}, source commit=${source.commit ?? "unknown"} dirty=${source.dirty ?? "unknown"}, ` +
          "offline workflow passed",
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  }
}
