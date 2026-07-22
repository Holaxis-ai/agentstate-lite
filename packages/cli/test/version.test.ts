/**
 * `--version` / `-v` print the CLI's own version and exit 0 — NOT the pre-fix "options must follow
 * the command" USAGE error (exit 2). Unit: `cliVersion()` reads the package's version. Integration:
 * the BUILT bundle resolves the same version from its own package.json (the published `../package.json`
 * relative to `dist/agentstate-lite.mjs`), proving the runtime path resolution survives bundling.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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
  if (!existsSync(cliBin)) execFileSync("node", ["build.mjs"], { cwd: cliPackageRoot, stdio: "inherit" });
  for (const flag of ["--version", "-v"]) {
    const r = spawnSync("node", [cliBin, flag], { encoding: "utf8" });
    assert.equal(r.status, 0, `${flag} exits 0 (was exit 2 USAGE before this fix)`);
    assert.equal(r.stdout.trim(), pkgVersion, `${flag} prints the version`);
  }
});
