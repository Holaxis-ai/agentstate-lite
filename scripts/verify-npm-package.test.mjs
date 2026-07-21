import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import {
  assertCommandInBin,
  assertPackageContract,
  resolveCommandOnPath,
  sanitizedNpmEnvironment,
} from "./verify-npm-package.mjs";
import { npmInvocation as uiBuildNpmInvocation } from "../packages/cli/scripts/embed-ui-assets.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const receipt = {
  files: [
    { path: "package.json" },
    { path: "dist/agentstate-lite.mjs" },
    { path: "README.md" },
    { path: "LICENSE" },
  ],
};
const manifest = {
  name: "aslite",
  files: ["dist"],
  bin: {
    aslite: "dist/agentstate-lite.mjs",
    "agentstate-lite": "dist/agentstate-lite.mjs",
  },
  devDependencies: { local: "*" },
};

test("the npm package contract accepts the intended self-contained artifact", () => {
  assert.doesNotThrow(() => assertPackageContract(receipt, manifest));
});

test("the npm package contract rejects surface and runtime dependency drift", () => {
  assert.throws(
    () => assertPackageContract({ files: [...receipt.files, { path: "src/index.ts" }] }, manifest),
    /must contain only/,
  );
  assert.throws(
    () => assertPackageContract(receipt, { ...manifest, dependencies: { pako: "^2" } }),
    /dependencies must be empty/,
  );
  assert.throws(
    () => assertPackageContract(receipt, { ...manifest, devDependencies: { local: "workspace:*" } }),
    /workspace: references/,
  );
});

test("npm subprocesses discard inherited lifecycle, workspace, prefix, and bin settings", () => {
  const clean = sanitizedNpmEnvironment(
    {
      PATH: "/runtime/bin",
      npm_execpath: "/npm-cli.js",
      npm_config_dry_run: "true",
      NPM_CONFIG_WORKSPACES: "false",
      npm_config_workspace: "aslite",
      npm_config_prefix: "/wrong-prefix",
      npm_config_bin_links: "false",
    },
    "/isolated/npmrc",
  );
  assert.deepEqual(clean, {
    PATH: "/runtime/bin",
    npm_execpath: "/npm-cli.js",
    npm_config_dry_run: "false",
    npm_config_bin_links: "true",
    npm_config_userconfig: "/isolated/npmrc",
  });
});

test("the UI build launches npm shell-free through the lifecycle CLI path", () => {
  const npmCli = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
  assert.deepEqual(uiBuildNpmInvocation(["run", "build"], { npm_execpath: npmCli }), {
    command: process.execPath,
    args: [npmCli, "run", "build"],
  });
  assert.throws(() => uiBuildNpmInvocation([], {}), /npm_execpath is required/);
});

test("command resolution cannot fall through to a same-named host binary", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "agentstate-lite-path-proof-"));
  const prefixBin = path.join(scratch, "prefix-bin");
  const hostBin = path.join(scratch, "host-bin");
  try {
    await Promise.all([mkdir(prefixBin), mkdir(hostBin)]);
    const hostCommand = path.join(hostBin, "aslite");
    await writeFile(hostCommand, "#!/bin/sh\nexit 0\n");
    await chmod(hostCommand, 0o755);
    const env = { PATH: `${prefixBin}:${hostBin}` };
    assert.equal(await resolveCommandOnPath("aslite", env, "linux"), hostCommand);
    await assert.rejects(() => assertCommandInBin("aslite", env, prefixBin, "linux"), /isolated npm prefix/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Windows resolution requires the npm .cmd shim inside the prefix", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "agentstate-lite-windows-bin-"));
  try {
    const shim = path.join(scratch, "aslite.cmd");
    await writeFile(shim, "@echo off\r\n");
    const env = { PATH: scratch, PATHEXT: ".EXE;.CMD" };
    assert.equal(await assertCommandInBin("aslite", env, scratch, "win32"), shim);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("the complete proof survives poisoned npm lifecycle configuration", async () => {
  const npmCli = process.env.npm_execpath?.trim();
  assert.ok(npmCli, "run this proof through npm so npm_execpath is available");
  const result = await execFileAsync(process.execPath, [path.join(repoRoot, "scripts", "verify-npm-package.mjs")], {
    cwd: repoRoot,
    env: {
      ...process.env,
      npm_config_dry_run: "true",
      npm_config_workspaces: "false",
      npm_config_workspace: "aslite",
      npm_config_prefix: path.join(tmpdir(), "wrong-agentstate-lite-prefix"),
      npm_config_bin_links: "false",
    },
    maxBuffer: 20 * 1024 * 1024,
  });
  assert.match(result.stdout, /offline workflow passed/);
});
