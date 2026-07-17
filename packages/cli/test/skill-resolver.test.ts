/**
 * Cross-host resolver gate — the bug this pins: the skill's `$ASLITE`/`$REFS` shell resolvers only
 * ever globbed `~/.claude/…`, so an agent running under a Codex marketplace-cache install (the
 * plugin lands at `~/.codex/plugins/cache/<marketplace>/agentstate-lite/<version>/skills/agentstate-lite/…`)
 * got an empty resolved variable and a confusing empty-command failure — the product's front door,
 * silently broken on one of its three declared hosts. There were no tests for either resolver at
 * all before this file.
 *
 * A second round found the same class of bug one level up: both hosts support RELOCATING their
 * home (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`), and the resolvers hardcoded `$HOME/.<host>` — a
 * relocated install resolved NOT_FOUND. See the "relocated host homes" tests below.
 *
 * These tests run the REAL emitted shell blocks — extracted verbatim from `renderSkill()`'s output
 * via {@link extractBashBlock}, never a re-implementation of the resolver logic — against a fake
 * `$HOME`. The full matrix runs through bash; targeted regression cases also run through default
 * zsh, whose NOMATCH behavior rejects optional shell globs before a command can handle them.
 *
 * Host coverage mirrors the `SKILL_HOST_ROOTS` projection from the resolver's host-home authority
 * (see skill-render.ts): Claude Code direct + marketplace-cache, Codex direct +
 * marketplace-cache, each honoring its relocation variable. OpenCode is intentionally absent — see
 * that constant's doc comment for why.
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

const ASLITE_BLOCK = extractBashBlock(rendered, "command -v agentstate-lite");
const REFS_BLOCK = extractBashBlock(rendered, 'REFS="$(');

// The per-host tests below iterate the projected roots, so deleting a host from the generator also
// deletes its dynamic test. This independent literal assertion catches that regression.
test("SKILL_HOST_ROOTS covers exactly the intended hosts (pinned by literal, not derived from itself)", () => {
  assert.deepEqual(SKILL_HOST_ROOTS, [
    '"${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/skills/agentstate-lite',
    '"${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite',
    '"${CODEX_HOME:-$HOME/.codex}"/skills/agentstate-lite',
    '"${CODEX_HOME:-$HOME/.codex}"/plugins/cache/*/agentstate-lite/*/skills/agentstate-lite',
  ]);
});

// The $ASLITE block ends by invoking the resolved binary (`"$ASLITE" --help`) — drop that trailing
// line for the "does it resolve to the right path" tests so they don't need a real, fully-working
// CLI behind the planted stub; the failure-guard test below runs the block UNMODIFIED.
const ASLITE_RESOLVE_ONLY = ASLITE_BLOCK.replace(/\n"\$ASLITE" --help\s*$/, "");
assert.notEqual(ASLITE_RESOLVE_ONLY, ASLITE_BLOCK, "expected to find and strip the trailing \"$ASLITE\" --help line");

/**
 * Concretize a SKILL_HOST_ROOTS entry into a real filesystem path under `home`, mirroring the
 * emitted `${VAR:-$HOME/...}` fallback in plain JS: `envOverrides` supplies a relocated host home
 * (CLAUDE_CONFIG_DIR / CODEX_HOME) exactly as the resolver itself would see it; absent an override,
 * falls back to `home/.claude` or `home/.codex` — the default-host-home case the earlier per-host
 * tests exercise. Each glob `*` becomes a concrete fake marketplace/version segment.
 */
function concretizeRoot(root: string, home: string, envOverrides: NodeJS.ProcessEnv = {}): string {
  let out = root
    .replace('"${CLAUDE_CONFIG_DIR:-$HOME/.claude}"', envOverrides.CLAUDE_CONFIG_DIR ?? `${home}/.claude`)
    .replace('"${CODEX_HOME:-$HOME/.codex}"', envOverrides.CODEX_HOME ?? `${home}/.codex`);
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
  mkdirSync(join(path, "views", "references"), { recursive: true });
  writeFileSync(join(path, "views", "references", "view-authoring-v0.md"), "stub reference\n");
}

/** A minimal env with no real `agentstate-lite` reachable on PATH, so host discovery is exercised. */
function fakeEnv(home: string): NodeJS.ProcessEnv {
  return { HOME: home, PATH: "/usr/bin:/bin" };
}

function withTempDir<T>(prefix: string, fn: (dir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function withFakeHome<T>(fn: (home: string) => T): T {
  return withTempDir("aslite-resolver-home-", fn);
}

function runBash(script: string, env: NodeJS.ProcessEnv) {
  return spawnSync("bash", ["-c", script], { env, encoding: "utf8" });
}

function runZsh(script: string, env: NodeJS.ProcessEnv) {
  return spawnSync("zsh", ["-c", script], { env, encoding: "utf8" });
}

const zshAvailable = spawnSync("zsh", ["-c", "exit 0"], { encoding: "utf8" }).status === 0;

test("generated resolvers delegate cache wildcards to find instead of shell expansion", () => {
  for (const block of [ASLITE_BLOCK, REFS_BLOCK]) {
    assert.doesNotMatch(block, /plugins\/cache\/\*/);
    assert.match(block, /find "\$cache"/);
    assert.match(block, /-path '\*\/agentstate-lite\/\*\/skills\/agentstate-lite\//);
  }
});

test("$ASLITE resolver tolerates a missing optional host under default zsh", { skip: !zshAvailable }, () => {
  withFakeHome((home) => {
    const codexHome = join(home, "codex-home");
    const planted = join(
      codexHome,
      "plugins/cache/some-marketplace/agentstate-lite/1.0.39/skills/agentstate-lite/scripts/agentstate-lite",
    );
    plantExecutable(planted);

    const env = {
      HOME: home,
      CLAUDE_CONFIG_DIR: join(home, "missing-claude-home"),
      CODEX_HOME: codexHome,
      PATH: "/usr/bin:/bin",
    };
    const result = runZsh(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, env);

    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
    assert.equal(result.stdout, planted);
  });
});

test("$REFS resolver tolerates a missing optional host under default zsh", { skip: !zshAvailable }, () => {
  withFakeHome((home) => {
    const codexHome = join(home, "codex-home");
    const planted = join(
      codexHome,
      "plugins/cache/some-marketplace/agentstate-lite/1.0.39/skills/agentstate-lite/references",
    );
    plantDir(planted);

    const env = {
      HOME: home,
      CLAUDE_CONFIG_DIR: join(home, "missing-claude-home"),
      CODEX_HOME: codexHome,
      PATH: "/usr/bin:/bin",
    };
    const result = runZsh(`${REFS_BLOCK}\nprintf '%s' "$REFS"`, env);

    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
    assert.equal(result.stdout, planted);
  });
});

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

test("$ASLITE resolver's PATH short-circuit still wins over host discovery", () => {
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
    const older = join(cacheRoot.replace("*", "some-marketplace").replace("*", "1.0.2").replace('"${CLAUDE_CONFIG_DIR:-$HOME/.claude}"', `${home}/.claude`), "scripts", "agentstate-lite");
    const newer = join(cacheRoot.replace("*", "some-marketplace").replace("*", "1.0.39").replace('"${CLAUDE_CONFIG_DIR:-$HOME/.claude}"', `${home}/.claude`), "scripts", "agentstate-lite");
    plantExecutable(older);
    plantExecutable(newer);

    const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, fakeEnv(home));

    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
    assert.equal(result.stdout, newer);
  });
});

// ---------------------------------------------------------------------------------------------
// Relocated host homes — CLAUDE_CONFIG_DIR / CODEX_HOME must be honored, not just $HOME/.<host>.
// Reviewer repro: an empty $HOME + CODEX_HOME pointing at the real cache resolved NOT_FOUND before
// this fix (SKILL_HOST_ROOTS hardcoded $HOME/.codex and $HOME/.claude). Verified these four tests
// fail against the pre-fix $HOME-only SKILL_HOST_ROOTS (reverted it locally, reran, saw them fail;
// restored, reran, saw them pass) — the exact "must fail without the fix" sanity check.
// ---------------------------------------------------------------------------------------------

test("$ASLITE resolver honors a relocated Codex home via CODEX_HOME (empty $HOME)", () => {
  withFakeHome((home) => {
    withTempDir("aslite-resolver-codex-home-", (codexHome) => {
      const planted = join(codexHome, "skills", "agentstate-lite", "scripts", "agentstate-lite");
      plantExecutable(planted);

      const env = { HOME: home, CODEX_HOME: codexHome, PATH: "/usr/bin:/bin" };
      const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, env);

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
});

test("$ASLITE resolver honors a relocated Claude Code home via CLAUDE_CONFIG_DIR (empty $HOME)", () => {
  withFakeHome((home) => {
    withTempDir("aslite-resolver-claude-home-", (claudeHome) => {
      const planted = join(claudeHome, "skills", "agentstate-lite", "scripts", "agentstate-lite");
      plantExecutable(planted);

      const env = { HOME: home, CLAUDE_CONFIG_DIR: claudeHome, PATH: "/usr/bin:/bin" };
      const result = runBash(`${ASLITE_RESOLVE_ONLY}\nprintf '%s' "$ASLITE"`, env);

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
});

test("$REFS resolver honors a relocated Codex home via CODEX_HOME (empty $HOME)", () => {
  withFakeHome((home) => {
    withTempDir("aslite-resolver-codex-home-", (codexHome) => {
      const planted = join(codexHome, "skills", "agentstate-lite", "references");
      plantDir(planted);

      const env = { HOME: home, CODEX_HOME: codexHome, PATH: "/usr/bin:/bin" };
      const result = runBash(`${REFS_BLOCK}\nprintf '%s' "$REFS"`, env);

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
});

test("$REFS resolver honors a relocated Claude Code home via CLAUDE_CONFIG_DIR (empty $HOME)", () => {
  withFakeHome((home) => {
    withTempDir("aslite-resolver-claude-home-", (claudeHome) => {
      const planted = join(claudeHome, "skills", "agentstate-lite", "references");
      plantDir(planted);

      const env = { HOME: home, CLAUDE_CONFIG_DIR: claudeHome, PATH: "/usr/bin:/bin" };
      const result = runBash(`${REFS_BLOCK}\nprintf '%s' "$REFS"`, env);

      assert.equal(result.status, 0, `stderr: ${result.stderr}`);
      assert.equal(result.stdout, planted);
    });
  });
});
