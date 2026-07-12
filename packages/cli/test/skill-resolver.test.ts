/**
 * Cross-host resolver gate — the bug this pins: the skill's `$ASLITE`/`$REFS` bash resolvers only
 * ever globbed `~/.claude/…`, so an agent running under a Codex marketplace-cache install (the
 * plugin lands at `~/.codex/plugins/cache/<marketplace>/agentstate-lite/<version>/skills/agentstate-lite/…`)
 * got an empty resolved variable and a confusing empty-command failure — the product's front door,
 * silently broken on one of its three declared hosts. There were no tests for either resolver at
 * all before this file.
 *
 * These tests run the REAL emitted bash — extracted verbatim from `renderSkill()`'s output via
 * {@link extractBashBlock}, never a re-implementation of the resolver logic — against a fake `$HOME`
 * tree via `bash -c` with `HOME` set to it, so a future change to the resolver prose is pinned by
 * its actual runtime behavior, not by a hand-written mirror of it that could silently drift from
 * the generator.
 *
 * Host coverage mirrors `SKILL_HOST_ROOTS` (the single source both resolvers derive their globs
 * from, see skill-render.ts): Claude Code direct + marketplace-cache, Codex direct +
 * marketplace-cache. OpenCode is intentionally absent — see that constant's doc comment for why.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

import { renderSkill, SKILL_HOST_ROOTS } from "../src/skill-render.js";

const rendered = renderSkill();

/** The FIRST fenced ```bash block in `text` whose body includes `marker`, verbatim (no re-typing). */
function extractBashBlock(text: string, marker: string): string {
  for (const m of text.matchAll(/```bash\n([\s\S]*?)\n```/g)) {
    if (m[1]!.includes(marker)) return m[1]!;
  }
  throw new Error(`no \`\`\`bash block in the rendered skill containing marker: ${marker}`);
}

const ASLITE_BLOCK = extractBashBlock(rendered, 'ASLITE="$(command -v agentstate-lite');
const REFS_BLOCK = extractBashBlock(rendered, 'REFS="$(ls -d');

// The $ASLITE block ends by invoking the resolved binary (`"$ASLITE" --help`) — drop that trailing
// line for the "does it resolve to the right path" tests so they don't need a real, fully-working
// CLI behind the planted stub; the failure-guard test below runs the block UNMODIFIED.
const ASLITE_RESOLVE_ONLY = ASLITE_BLOCK.replace(/\n"\$ASLITE" --help\s*$/, "");
assert.notEqual(ASLITE_RESOLVE_ONLY, ASLITE_BLOCK, "expected to find and strip the trailing \"$ASLITE\" --help line");

/** Replace `"$HOME"` with a real directory and each glob `*` with a concrete fake segment. */
function concretizeRoot(root: string, home: string): string {
  let out = root.replace('"$HOME"', home);
  const fakeSegments = ["some-marketplace", "1.0.39"];
  let i = 0;
  out = out.replace(/\*/g, () => fakeSegments[i++] ?? "x");
  return out;
}

function plantExecutable(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, "#!/bin/sh\necho stub\n");
  chmodSync(path, 0o755);
}

function plantDir(path: string): void {
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, "BRIDGE.md"), "stub reference\n");
}

/** A minimal env with no real `agentstate-lite` reachable on PATH, so the glob fallback is exercised. */
function fakeEnv(home: string): NodeJS.ProcessEnv {
  return { HOME: home, PATH: "/usr/bin:/bin" };
}

function withFakeHome<T>(fn: (home: string) => T): T {
  const home = mkdtempSync(join(tmpdir(), "aslite-resolver-"));
  try {
    return fn(home);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

function runBash(script: string, env: NodeJS.ProcessEnv) {
  return spawnSync("bash", ["-c", script], { env, encoding: "utf8" });
}

// ---------------------------------------------------------------------------------------------
// $ASLITE — per-host resolution.
// ---------------------------------------------------------------------------------------------

for (const root of SKILL_HOST_ROOTS) {
  test(`$ASLITE resolver finds the CLI planted under host root: ${root}`, () => {
    withFakeHome((home) => {
      const planted = join(concretizeRoot(root, home), "scripts", "agentstate-lite");
      plantExecutable(planted);

      const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, fakeEnv(home));

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
}

test("$ASLITE resolver's PATH short-circuit still wins over the glob fallback", () => {
  withFakeHome((home) => {
    // A directory on PATH containing an `agentstate-lite` shim — `command -v` should find this
    // before ever falling through to the glob, even though a planted skill install also exists.
    const binDir = join(home, "bin");
    const onPath = join(binDir, "agentstate-lite");
    plantExecutable(onPath);
    plantExecutable(join(concretizeRoot(SKILL_HOST_ROOTS[0]!, home), "scripts", "agentstate-lite"));

    const env = { HOME: home, PATH: `${binDir}:/usr/bin:/bin` };
    const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, env);

    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
    assert.equal(result.stdout, onPath);
  });
});

test("$ASLITE resolver's failure guard fires loudly when nothing matches", () => {
  withFakeHome((home) => {
    // Nothing planted anywhere under `home` — run the block UNMODIFIED (including the trailing
    // invocation line) so the guard's `exit`/`return` short-circuit before that line is proven too.
    const result = runBash(ASLITE_BLOCK, fakeEnv(home));

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /agentstate-lite: plugin executable not found/);
    assert.equal(result.stdout, "", "must never fall through to invoking an empty command");
  });
});

// ---------------------------------------------------------------------------------------------
// $REFS — per-host resolution.
// ---------------------------------------------------------------------------------------------

for (const root of SKILL_HOST_ROOTS) {
  test(`$REFS resolver finds the references dir planted under host root: ${root}`, () => {
    withFakeHome((home) => {
      const planted = join(concretizeRoot(root, home), "references");
      plantDir(planted);

      const result = runBash(`${REFS_BLOCK}\nprintf '%s' "$REFS"`, fakeEnv(home));

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
}

test("$REFS resolver's failure guard fires loudly when nothing matches", () => {
  withFakeHome((home) => {
    const result = runBash(REFS_BLOCK, fakeEnv(home));

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /agentstate-lite: shipped references not found/);
    assert.equal(result.stdout, "");
  });
});

// ---------------------------------------------------------------------------------------------
// Highest-version selection — `sort -V | tail -1` must pick the newer of two installed versions
// under the SAME marketplace-cache host, not just any match.
// ---------------------------------------------------------------------------------------------

test("$ASLITE resolver selects the highest version when multiple are installed", () => {
  withFakeHome((home) => {
    const cacheRoot = SKILL_HOST_ROOTS.find((r) => r.includes("plugins/cache") && r.includes(".claude"))!;
    const older = join(cacheRoot.replace('"$HOME"', home).replace("*", "some-marketplace").replace("*", "1.0.2"), "scripts", "agentstate-lite");
    const newer = join(cacheRoot.replace('"$HOME"', home).replace("*", "some-marketplace").replace("*", "1.0.39"), "scripts", "agentstate-lite");
    plantExecutable(older);
    plantExecutable(newer);

    const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, fakeEnv(home));

    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
    assert.equal(result.stdout, newer);
  });
});
