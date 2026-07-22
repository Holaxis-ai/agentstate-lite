/**
 * `--version` / `-v` print the CLI's own version and exit 0 — NOT the pre-fix "options must follow
 * the command" USAGE error (exit 2). Unit: `cliVersion()` reads the package version (source-run
 * fallback path). Integration: the BUILT bundle prints it. Plugin-channel: a bundle copied to a
 * lone-script layout with NO adjacent package.json STILL prints it — proving the version is baked in
 * at build time (esbuild `define`), not merely read from a neighboring file.
 *
 * Requires the built bundle; the cli `test` script builds (`node build.mjs`) before running, same as
 * every other integration test here.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cliVersion } from "../src/cli.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const cliPackageRoot = path.resolve(here, "..");
const cliBin = path.resolve(cliPackageRoot, "dist/agentstate-lite.mjs");
const pkgVersion = (JSON.parse(readFileSync(path.resolve(cliPackageRoot, "package.json"), "utf8")) as { version: string }).version;

test("cliVersion() returns the package's own version (never 'unknown')", () => {
  assert.equal(cliVersion(), pkgVersion);
  assert.match(cliVersion(), /^\d+\.\d+\.\d+/); // a real semver, so the fallback never leaked
});

test("the BUILT CLI: `--version` and `-v` print the version and exit 0", () => {
  for (const flag of ["--version", "-v"]) {
    const r = spawnSync("node", [cliBin, flag], { encoding: "utf8" });
    assert.equal(r.status, 0, `${flag} exits 0 (was exit 2 USAGE before this fix)`);
    assert.equal(r.stdout.trim(), pkgVersion, `${flag} prints the version`);
  }
});

test("plugin-channel layout: a bundle with NO adjacent package.json still prints the BAKED version", () => {
  // The plugin bundle ships as a lone `skills/…/scripts/agentstate-lite.mjs` with no package.json at
  // `../` — a runtime file read finds nothing there, so the version must be compiled in.
  const dir = mkdtempSync(path.join(tmpdir(), "aslite-plugin-layout-"));
  try {
    const scriptDir = path.join(dir, "skills", "agentstate-lite", "scripts");
    mkdirSync(scriptDir, { recursive: true });
    const stray = path.join(scriptDir, "agentstate-lite.mjs");
    copyFileSync(cliBin, stray); // NO package.json anywhere near it
    const r = spawnSync("node", [stray, "--version"], { encoding: "utf8" });
    assert.equal(r.status, 0, "plugin-layout --version exits 0");
    assert.equal(r.stdout.trim(), pkgVersion, "plugin-layout --version prints the baked version, not 'unknown'");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
