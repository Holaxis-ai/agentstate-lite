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
const expectedFiles = ["LICENSE", "README.md", "dist/agentstate-lite.mjs", "package.json"];
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

export function assertPackageContract(receipt, manifest) {
  assert.deepEqual(
    receipt.files.map((file) => file.path).sort(),
    expectedFiles,
    "the npm tarball must contain only the CLI, manifest, README, and license",
  );
  assert.equal(manifest.name, "agentstate-lite");
  assert.deepEqual(manifest.files, ["dist"]);
  assert.deepEqual(manifest.bin, {
    "agentstate-lite": "dist/agentstate-lite.mjs",
    aslite: "dist/agentstate-lite.mjs",
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
        ? path.join(prefix, "node_modules", "agentstate-lite")
        : path.join(prefix, "lib", "node_modules", "agentstate-lite");
    const manifest = parseJson(await readFile(path.join(installedRoot, "package.json"), "utf8"), "installed package.json");
    assertPackageContract(receipt, manifest);

    const binDir = process.platform === "win32" ? prefix : path.join(prefix, "bin");
    const commandEnv = {
      ...process.env,
      PATH: `${binDir}${path.delimiter}${path.dirname(process.execPath)}`,
      HOME: home,
      USERPROFILE: home,
      XDG_CONFIG_HOME: path.join(home, ".config"),
      AGENTSTATE_LITE_NO_AUTOPULL: "1",
    };
    await assertCommandInBin("agentstate-lite", commandEnv, binDir);
    await assertCommandInBin("aslite", commandEnv, binDir);

    const installedEntrypoint = path.join(installedRoot, manifest.bin.aslite);
    const runCli = (command, args) =>
      process.platform === "win32"
        ? run(process.execPath, [installedEntrypoint, ...args], { cwd: scratch, env: commandEnv })
        : run(command, args, { cwd: scratch, env: commandEnv });

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

    assertSnapshotUnchanged(pluginsBefore, await snapshotTree(pluginsDir), "plugins/");
    assertSnapshotUnchanged(marketplaceBefore, await snapshotTree(marketplaceDir), ".claude-plugin/");

    return {
      package: `${manifest.name}@${manifest.version}`,
      files: receipt.files.length,
      bins: Object.keys(manifest.bin),
      workflow: ["init", "recipe add", "new", "list"],
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
