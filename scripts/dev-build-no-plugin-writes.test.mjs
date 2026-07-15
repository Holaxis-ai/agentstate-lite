// Regression pin for tasks/dev-build-bundle-collision: the DEFAULT build must leave the
// committed plugin channel (plugins/, and the version-carrying .claude-plugin/ manifest)
// byte-for-byte untouched.
//
// History: packages/cli/build.mjs used to mirror its dist/ output into the COMMITTED, bot-owned
// plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs. Any local
// `npm run build` therefore dirtied a file no human/PR may commit, and the next `git pull`
// aborted with would-be-overwritten (bit both founders repeatedly; agents piping pull output
// silently failed to update). The committed path now has exactly ONE writer —
// packages/cli/scripts/build-plugin-bundle.mjs, invoked by the CI bot
// (scripts/ci-version-bundle.mjs) and the manual `npm run build:plugin-bundle` — and this test
// EMPIRICALLY pins that the real root `npm run build` no longer writes there.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { REAL_PATHS } from "./ci-version-bundle.mjs";
import { COMMITTED_BUNDLE_PATH } from "../packages/cli/scripts/build-plugin-bundle.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// scripts/ -> repo root
const repoRoot = resolve(here, "..");

/** All files under `dir`, recursively, as absolute paths. */
async function listFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFilesRecursive(full)));
    else out.push(full);
  }
  return out;
}

/** Snapshot every file under `dir` as `relative/posix/path -> { bytes, mode }` — mode included so a chmod-only touch (the old build chmod'd the committed shim) can't slip past a bytes-only compare. */
async function snapshotDir(dir) {
  const snapshot = new Map();
  for (const file of await listFilesRecursive(dir)) {
    const rel = relative(dir, file).split(sep).join("/");
    const [bytes, info] = await Promise.all([readFile(file), stat(file)]);
    snapshot.set(rel, { bytes, mode: info.mode });
  }
  return snapshot;
}

function assertSnapshotsIdentical(before, after, label) {
  assert.deepEqual(
    [...after.keys()].sort(),
    [...before.keys()].sort(),
    `${label}: the default build must not add or remove files`,
  );
  for (const [rel, { bytes, mode }] of before) {
    const now = after.get(rel);
    assert.ok(now.bytes.equals(bytes), `${label}: ${rel} bytes changed under the default build`);
    assert.equal(now.mode, mode, `${label}: ${rel} mode changed under the default build`);
  }
}

describe("default build leaves the committed plugin channel untouched", () => {
  test("committed-bundle path is agreed on by the ONE writer and the CI differ", () => {
    // If these ever diverge, the "single writer" property silently splits into two paths:
    // the bot would diff one file while the writer writes another.
    assert.equal(COMMITTED_BUNDLE_PATH, REAL_PATHS.bundleMjs);
  });

  test("root `npm run build` writes dist/ but nothing under plugins/ or .claude-plugin/", async () => {
    const pluginsDir = resolve(repoRoot, "plugins");
    const manifestDir = resolve(repoRoot, ".claude-plugin");

    const pluginsBefore = await snapshotDir(pluginsDir);
    const manifestBefore = await snapshotDir(manifestDir);
    assert.ok(pluginsBefore.size > 0, "sanity: plugins/ is a committed, non-empty tree");

    // The REAL default build — the exact command the acceptance criterion names.
    const npmCli = process.env.npm_execpath?.trim();
    assert.ok(npmCli, "run this proof through npm so npm_execpath is available");
    execFileSync(process.execPath, [npmCli, "run", "build"], { cwd: repoRoot, stdio: "inherit" });

    // Sanity that the build actually produced its intended output (we didn't pass a no-op).
    const distBundle = resolve(repoRoot, "packages/cli/dist/agentstate-lite.mjs");
    assert.ok((await stat(distBundle)).size > 0, "dev build must produce packages/cli/dist/agentstate-lite.mjs");

    assertSnapshotsIdentical(pluginsBefore, await snapshotDir(pluginsDir), "plugins/");
    assertSnapshotsIdentical(manifestBefore, await snapshotDir(manifestDir), ".claude-plugin/");
  });
});
