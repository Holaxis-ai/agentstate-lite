/**
 * `skill install|status|uninstall` — destructive-write boundary tests (same discipline as the
 * hook suite): manifest-tracked installs, refusal of anything unmanaged, convergent reinstall,
 * exact-manifest uninstall, and env-var host relocation for --scope global.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  lstatSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  SKILL_MANIFEST_FILENAME,
  isSafeManifestEntry,
  resolveSkillAssets,
  skill,
  skillStatusForDir,
  skillTargets,
} from "../src/commands/skill.js";
import { CliError } from "../src/errors.js";

const ASSET_FILES: Record<string, string> = {
  "SKILL.md": "---\nname: aslite\n---\n# aslite\n",
  "references/views/view-authoring.md": "# views contract\n",
  "references/recipes/claims/recipe.md": "# claims recipe\n",
};

/** Build a fake npm-layout distribution root; returns its dist executable path. */
function makeDistribution(root: string, version = "9.9.9", files: Record<string, string> = ASSET_FILES): string {
  mkdirSync(path.join(root, "dist"), { recursive: true });
  writeFileSync(path.join(root, "dist", "agentstate-lite.mjs"), "// bundle\n");
  writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "aslite", version }) + "\n");
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, ...relative.split("/"));
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  return path.join(root, "dist", "agentstate-lite.mjs");
}

function scratch(): { base: string; executable: string } {
  const base = mkdtempSync(path.join(tmpdir(), "aslite-skill-cmd-"));
  const executable = makeDistribution(path.join(base, "pkg"));
  return { base, executable };
}

async function runSkill(
  argv: string[],
  deps: { cwd?: string; home?: string; env?: NodeJS.ProcessEnv; executable?: string },
): Promise<Record<string, any>> {
  let out = "";
  await skill([...argv, "--json"], { env: {}, ...deps, stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, any>;
}

/** Every file under `dir` mapped to its bytes (posix-relative), for byte-stability snapshots. */
function treeSnapshot(dir: string, prefix = ""): Map<string, Buffer> {
  const snapshot = new Map<string, Buffer>();
  if (!existsSync(dir)) return snapshot;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      for (const [key, value] of treeSnapshot(path.join(dir, entry.name), relative)) snapshot.set(key, value);
    } else {
      snapshot.set(relative, readFileSync(path.join(dir, entry.name)));
    }
  }
  return snapshot;
}

function assertSameTree(a: Map<string, Buffer>, b: Map<string, Buffer>): void {
  assert.deepEqual([...a.keys()].sort(), [...b.keys()].sort());
  for (const [key, bytes] of a) assert.ok(b.get(key)!.equals(bytes), `${key} bytes changed`);
}

test("skill install (project scope): assets + manifest land in BOTH host folders; reinstall is byte-stable and changed:false", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });

  const receipt = await runSkill(["install"], { cwd, executable });
  assert.equal(receipt.skill.action, "install");
  assert.equal(receipt.skill.changed, true);
  assert.equal(receipt.skill.version, "9.9.9");

  for (const host of [".claude", ".codex"]) {
    const dir = path.join(cwd, host, "skills", "aslite");
    for (const [relative, content] of Object.entries(ASSET_FILES)) {
      assert.equal(readFileSync(path.join(dir, ...relative.split("/")), "utf8"), content);
    }
    const manifest = JSON.parse(readFileSync(path.join(dir, SKILL_MANIFEST_FILENAME), "utf8"));
    assert.equal(manifest.package, "aslite");
    assert.equal(manifest.version, "9.9.9");
    assert.equal(manifest.installed_by, "aslite skill install");
    assert.deepEqual(manifest.files, Object.keys(ASSET_FILES).sort());
  }

  const before = treeSnapshot(path.join(cwd, ".claude"));
  const again = await runSkill(["install"], { cwd, executable });
  assert.equal(again.skill.changed, false);
  assert.equal(again.skill.hosts.claude_code.changed, false);
  assert.equal(again.skill.hosts.codex.changed, false);
  assertSameTree(before, treeSnapshot(path.join(cwd, ".claude")));
});

test("skill install refuses a pre-existing unmanaged folder (nothing written there); the other host is still processed", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  const claudeDir = path.join(cwd, ".claude", "skills", "aslite");
  mkdirSync(claudeDir, { recursive: true });
  writeFileSync(path.join(claudeDir, "somebody-elses.md"), "not ours\n");

  await assert.rejects(
    () => runSkill(["install"], { cwd, executable }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /refused 1 target folder/);
      return true;
    },
  );
  // Refused folder untouched: the foreign file survives, no manifest, no assets.
  assert.deepEqual(readdirSync(claudeDir), ["somebody-elses.md"]);
  // The codex target was still processed to completion.
  assert.ok(existsSync(path.join(cwd, ".codex", "skills", "aslite", SKILL_MANIFEST_FILENAME)));
});

test("hand-edited managed files: status reports stale, reinstall converges back to installed", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });

  const edited = path.join(cwd, ".claude", "skills", "aslite", "SKILL.md");
  writeFileSync(edited, "tampered\n");

  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "stale");
  assert.equal(status.skill.hosts.codex.state, "installed");

  const receipt = await runSkill(["install"], { cwd, executable });
  assert.equal(receipt.skill.hosts.claude_code.changed, true);
  assert.equal(receipt.skill.hosts.codex.changed, false);
  assert.equal(readFileSync(edited, "utf8"), ASSET_FILES["SKILL.md"]);
  const after = await runSkill(["status"], { cwd, executable });
  assert.equal(after.skill.hosts.claude_code.state, "installed");
});

test("skill status: absent before install, unmanaged for a manifest-less folder, version reported when installed", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(path.join(cwd, ".codex", "skills", "aslite"), { recursive: true });
  writeFileSync(path.join(cwd, ".codex", "skills", "aslite", "stray.md"), "x\n");

  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "absent");
  assert.equal(status.skill.hosts.codex.state, "unmanaged");

  rmSync(path.join(cwd, ".codex"), { recursive: true, force: true });
  await runSkill(["install"], { cwd, executable });
  const installed = await runSkill(["status"], { cwd, executable });
  assert.equal(installed.skill.hosts.claude_code.state, "installed");
  assert.equal(installed.skill.hosts.claude_code.version, "9.9.9");
});

test("skill uninstall removes exactly the managed folders and leaves foreign sibling skills untouched", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  const foreign = path.join(cwd, ".claude", "skills", "somebody-else");
  mkdirSync(foreign, { recursive: true });
  writeFileSync(path.join(foreign, "SKILL.md"), "# foreign skill\n");
  await runSkill(["install"], { cwd, executable });

  const receipt = await runSkill(["uninstall"], { cwd, executable });
  assert.equal(receipt.skill.changed, true);
  assert.equal(existsSync(path.join(cwd, ".claude", "skills", "aslite")), false);
  assert.equal(existsSync(path.join(cwd, ".codex", "skills", "aslite")), false);
  assert.equal(readFileSync(path.join(foreign, "SKILL.md"), "utf8"), "# foreign skill\n");

  // Uninstalling again is a no-op, exit 0.
  const again = await runSkill(["uninstall"], { cwd, executable });
  assert.equal(again.skill.changed, false);
});

test("skill uninstall refuses unmanifested extra files — nothing at all is deleted", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  writeFileSync(path.join(dir, "user-notes.md"), "keep me\n");

  await assert.rejects(
    () => runSkill(["uninstall"], { cwd, executable }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /refused 1 target folder/);
      return true;
    },
  );
  // The refusing folder kept EVERYTHING: assets, manifest, and the extra file.
  assert.equal(readFileSync(path.join(dir, "user-notes.md"), "utf8"), "keep me\n");
  assert.equal(readFileSync(path.join(dir, "SKILL.md"), "utf8"), ASSET_FILES["SKILL.md"]);
  assert.ok(existsSync(path.join(dir, SKILL_MANIFEST_FILENAME)));
  // The clean codex folder was still uninstalled.
  assert.equal(existsSync(path.join(cwd, ".codex", "skills", "aslite")), false);
});

test("skill uninstall refuses a folder with no manifest and a folder whose manifest is malformed", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  const claudeDir = path.join(cwd, ".claude", "skills", "aslite");
  const codexDir = path.join(cwd, ".codex", "skills", "aslite");
  mkdirSync(claudeDir, { recursive: true });
  writeFileSync(path.join(claudeDir, "SKILL.md"), "unmanaged copy\n");
  mkdirSync(codexDir, { recursive: true });
  writeFileSync(path.join(codexDir, SKILL_MANIFEST_FILENAME), "{not json");

  await assert.rejects(
    () => runSkill(["uninstall"], { cwd, executable }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /refused 2 target folder/);
      return true;
    },
  );
  assert.equal(readFileSync(path.join(claudeDir, "SKILL.md"), "utf8"), "unmanaged copy\n");
  assert.ok(existsSync(path.join(codexDir, SKILL_MANIFEST_FILENAME)));
});

test("a manifest naming paths outside the folder is malformed — uninstall refuses, nothing outside is touched", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  mkdirSync(dir, { recursive: true });
  const victim = path.join(cwd, ".claude", "skills", "victim.md");
  writeFileSync(victim, "outside the managed folder\n");
  writeFileSync(
    path.join(dir, SKILL_MANIFEST_FILENAME),
    JSON.stringify({ package: "aslite", version: "1.0.0", installed_by: "x", files: ["../victim.md"] }),
  );

  await assert.rejects(() => runSkill(["uninstall"], { cwd, executable }), CliError);
  assert.equal(readFileSync(victim, "utf8"), "outside the managed folder\n");
  assert.ok(existsSync(path.join(dir, SKILL_MANIFEST_FILENAME)));
});

test("--scope global honors CLAUDE_CONFIG_DIR / CODEX_HOME relocation, with ${VAR:-fallback} semantics", async () => {
  const { base, executable } = scratch();
  const home = path.join(base, "home");
  const claudeHome = path.join(base, "relocated-claude");
  const codexHome = path.join(base, "relocated-codex");
  mkdirSync(home, { recursive: true });

  const env = { CLAUDE_CONFIG_DIR: claudeHome, CODEX_HOME: codexHome };
  const receipt = await runSkill(["install", "--scope", "global"], { home, env, executable });
  assert.equal(receipt.skill.scope, "global");
  assert.ok(existsSync(path.join(claudeHome, "skills", "aslite", "SKILL.md")));
  assert.ok(existsSync(path.join(codexHome, "skills", "aslite", "SKILL.md")));
  assert.equal(existsSync(path.join(home, ".claude")), false);
  assert.equal(existsSync(path.join(home, ".codex")), false);

  await runSkill(["uninstall", "--scope", "global"], { home, env, executable });
  assert.equal(existsSync(path.join(claudeHome, "skills", "aslite")), false);
  assert.equal(existsSync(path.join(codexHome, "skills", "aslite")), false);

  // An EMPTY env value falls back to <home>/.<host> — the shell ${VAR:-default} rule.
  const targets = skillTargets("global", { home, env: { CLAUDE_CONFIG_DIR: "", CODEX_HOME: "" } });
  assert.equal(targets.claude, path.join(home, ".claude", "skills", "aslite"));
  assert.equal(targets.codex, path.join(home, ".codex", "skills", "aslite"));
});

test("running as the marketplace skill bundle: install refuses with marketplace guidance", async () => {
  const { base } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  const bundleExe = path.join(
    base,
    "plugins", "cache", "mkt", "agentstate-lite", "1.0.0", "skills", "agentstate-lite", "scripts", "agentstate-lite.mjs",
  );
  await assert.rejects(
    () => runSkill(["install"], { cwd, executable: bundleExe }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /marketplace/);
      return true;
    },
  );
  assert.equal(existsSync(path.join(cwd, ".claude")), false);
});

test("a distribution without shipped skill assets is a loud runtime error, not a partial install", async () => {
  const base = mkdtempSync(path.join(tmpdir(), "aslite-skill-noassets-"));
  const root = path.join(base, "bare-pkg");
  mkdirSync(path.join(root, "dist"), { recursive: true });
  writeFileSync(path.join(root, "dist", "agentstate-lite.mjs"), "// bundle\n");
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await assert.rejects(
    () => runSkill(["install"], { cwd, executable: path.join(root, "dist", "agentstate-lite.mjs") }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /no skill assets/);
      return true;
    },
  );
  assert.equal(existsSync(path.join(cwd, ".claude")), false);
});

test("resolveSkillAssets reads the package root next to dist/ and lists SKILL.md + references recursively", () => {
  const { executable } = scratch();
  const assets = resolveSkillAssets(executable);
  assert.equal(assets.version, "9.9.9");
  assert.deepEqual(assets.files, Object.keys(ASSET_FILES).sort());
  assert.equal(skillStatusForDir(path.join(assets.root, "does-not-exist"), assets).state, "absent");
});

test("isSafeManifestEntry: traversal, absolute, backslash, NUL, and empty-segment entries are all unsafe", () => {
  const cases: [entry: string, safe: boolean][] = [
    ["SKILL.md", true],
    ["references/views/view-authoring.md", true],
    ["..", false],
    ["../victim.md", false],
    ["references/../../victim.md", false],
    ["/etc/passwd", false],
    ["references\\evil.md", false],
    ["references/\0evil.md", false],
    ["", false],
    ["references//evil.md", false],
    ["./evil.md", false],
    [".", false],
  ];
  for (const [entry, safe] of cases) {
    assert.equal(isSafeManifestEntry(entry), safe, `isSafeManifestEntry(${JSON.stringify(entry)})`);
  }
});

test("a symlinked target folder is refused by install AND uninstall, reported unmanaged by status, and never followed", async () => {
  const { base, executable } = scratch();
  // A REAL managed install the symlink points at — its bytes must never change.
  const victimProject = path.join(base, "victim-project");
  mkdirSync(victimProject, { recursive: true });
  await runSkill(["install"], { cwd: victimProject, executable });
  const victimDir = path.join(victimProject, ".claude", "skills", "aslite");
  const victimBefore = treeSnapshot(victimDir);

  // The attacked project: claude target is a symlink to the victim's managed install.
  const cwd = path.join(base, "linked-project");
  mkdirSync(path.join(cwd, ".claude", "skills"), { recursive: true });
  symlinkSync(victimDir, path.join(cwd, ".claude", "skills", "aslite"));

  // install: refused on the symlinked host, structured error, sibling (codex) still processed.
  await assert.rejects(
    () => runSkill(["install"], { cwd, executable }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(err.message, /refused 1 target folder/);
      assert.match(JSON.stringify(err.details), /symlink/);
      return true;
    },
  );
  assertSameTree(victimBefore, treeSnapshot(victimDir));
  assert.ok(existsSync(path.join(cwd, ".codex", "skills", "aslite", SKILL_MANIFEST_FILENAME)));

  // status: the symlinked target is honestly unmanaged, never followed into the victim.
  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "unmanaged");
  assert.equal(status.skill.hosts.codex.state, "installed");

  // uninstall: refused on the symlinked host — the pointed-to managed install is byte-untouched
  // and the link survives — while the sibling codex host still uninstalls cleanly (exit 1 overall).
  await assert.rejects(
    () => runSkill(["uninstall"], { cwd, executable }),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.match(JSON.stringify(err.details), /symlink/);
      return true;
    },
  );
  assert.ok(lstatSync(path.join(cwd, ".claude", "skills", "aslite")).isSymbolicLink());
  assertSameTree(victimBefore, treeSnapshot(victimDir));
  assert.equal(existsSync(path.join(cwd, ".codex", "skills", "aslite")), false);
});

test("manifest-first: an interrupted install (manifest present, files missing) is managed-stale — status stale, install converges, uninstall cleans", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");

  // Simulate the interruption point after the manifest write: manifested files missing.
  rmSync(path.join(dir, "SKILL.md"));
  rmSync(path.join(dir, "references"), { recursive: true, force: true });

  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "stale");

  const converge = await runSkill(["install"], { cwd, executable });
  assert.equal(converge.skill.hosts.claude_code.changed, true);
  assert.equal(readFileSync(path.join(dir, "SKILL.md"), "utf8"), ASSET_FILES["SKILL.md"]);
  assert.equal((await runSkill(["status"], { cwd, executable })).skill.hosts.claude_code.state, "installed");

  // And a partial state uninstalls without a throw (skip-missing).
  rmSync(path.join(dir, "SKILL.md"));
  const removed = await runSkill(["uninstall"], { cwd, executable });
  assert.equal(removed.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(dir), false);
});

test("a manifested file symlinked to an outside victim: uninstall unlinks the LINK only; install replaces the link; status reports stale", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  const victim = path.join(base, "victim.md");
  // Victim bytes IDENTICAL to the shipped asset — the link must still be detected and replaced.
  writeFileSync(victim, ASSET_FILES["SKILL.md"]);

  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  const linked = path.join(dir, "SKILL.md");
  rmSync(linked);
  symlinkSync(victim, linked);

  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "stale");

  // install replaces the LINK with a real file; the victim is byte-untouched.
  const receipt = await runSkill(["install"], { cwd, executable });
  assert.equal(receipt.skill.hosts.claude_code.changed, true);
  assert.equal(lstatSync(linked).isSymbolicLink(), false);
  assert.equal(readFileSync(victim, "utf8"), ASSET_FILES["SKILL.md"]);

  // uninstall over a re-linked file unlinks the link itself — the victim survives.
  rmSync(linked);
  symlinkSync(victim, linked);
  await runSkill(["uninstall"], { cwd, executable });
  assert.equal(existsSync(dir), false);
  assert.equal(readFileSync(victim, "utf8"), ASSET_FILES["SKILL.md"]);
});

test("a killed atomic write's tmp orphan of an OWNED file is managed debris: install converges, uninstall cleans", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");

  writeFileSync(path.join(dir, "SKILL.md.tmp-99999-abc-def"), "stranded half-write\n");
  const converge = await runSkill(["install"], { cwd, executable });
  assert.equal(converge.skill.hosts.claude_code.changed, true, "debris removal must report changed");
  assert.equal(existsSync(path.join(dir, "SKILL.md.tmp-99999-abc-def")), false);
  assert.equal((await runSkill(["status"], { cwd, executable })).skill.hosts.claude_code.state, "installed");

  writeFileSync(path.join(dir, "SKILL.md.tmp-99999-abc-def"), "stranded again\n");
  const removed = await runSkill(["uninstall"], { cwd, executable });
  assert.equal(removed.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(dir), false);
});

test("a temp-patterned file with a FOREIGN base is NOT debris — install and uninstall still refuse, file intact", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  // The name MATCHES the temp regex shape exactly — only the owned-base check keeps it foreign,
  // so this test pins `owned.has(base)` itself, not the regex.
  writeFileSync(path.join(dir, "random-foreign.md.tmp-1-ab-cd"), "not ours\n");

  await assert.rejects(() => runSkill(["install"], { cwd, executable }), CliError);
  await assert.rejects(() => runSkill(["uninstall"], { cwd, executable }), CliError);
  assert.equal(readFileSync(path.join(dir, "random-foreign.md.tmp-1-ab-cd"), "utf8"), "not ours\n");
  assert.ok(existsSync(path.join(dir, "SKILL.md")), "refusal must delete nothing");
});

test("the manifest's own tmp orphan: state reads MANAGED (status ignores without deleting), install converges", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable });
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  const orphan = path.join(dir, ".aslite-skill.json.tmp-4242-q1w2-e3r4");
  writeFileSync(orphan, "{half-written manifest");

  // status is READ-ONLY: it ignores the debris (managed state, not unmanaged) and leaves it.
  const status = await runSkill(["status"], { cwd, executable });
  assert.equal(status.skill.hosts.claude_code.state, "installed");
  assert.ok(existsSync(orphan), "status must not delete anything");

  const converge = await runSkill(["install"], { cwd, executable });
  assert.equal(converge.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(orphan), false);

  // A FIRST-install kill strands only the manifest tmp: absent (not unmanaged), fresh install ok.
  const codexDir = path.join(cwd, ".codex", "skills", "aslite");
  await runSkill(["uninstall"], { cwd, executable });
  mkdirSync(codexDir, { recursive: true });
  writeFileSync(path.join(codexDir, ".aslite-skill.json.tmp-1-a2-b3"), "{");
  const early = await runSkill(["status"], { cwd, executable });
  assert.equal(early.skill.hosts.codex.state, "absent");
  const fresh = await runSkill(["install"], { cwd, executable });
  assert.equal(fresh.skill.hosts.codex.changed, true);
  assert.equal((await runSkill(["status"], { cwd, executable })).skill.hosts.codex.state, "installed");
});

// ── upgrade transitions: every intermediate state is owned by its manifest ──

const LEGACY_FILE = "references/legacy/old-contract.md";
const V1_FILES: Record<string, string> = { ...ASSET_FILES, [LEGACY_FILE]: "# retired contract\n" };
const UNION_FILES = [...new Set([...Object.keys(V1_FILES), ...Object.keys(ASSET_FILES)])].sort();

/** A scratch with BOTH a v1 (extra legacy asset) and a v2 (standard) distribution. */
function upgradeScratch(): { base: string; exe1: string; exe2: string } {
  const base = mkdtempSync(path.join(tmpdir(), "aslite-skill-upgrade-"));
  const exe1 = makeDistribution(path.join(base, "pkg-v1"), "1.0.0", V1_FILES);
  const exe2 = makeDistribution(path.join(base, "pkg-v2"), "9.9.9", ASSET_FILES);
  return { base, exe1, exe2 };
}

/** Hand-write the exact transitional manifest an interrupted v1→v2 upgrade leaves behind. */
function writeTransitionalManifest(dir: string): void {
  writeFileSync(
    path.join(dir, SKILL_MANIFEST_FILENAME),
    `${JSON.stringify({ package: "aslite", version: "9.9.9", installed_by: "aslite skill install", files: UNION_FILES }, null, 2)}\n`,
  );
}

test("upgrade end-to-end: obsolete v1 asset removed, final manifest is exactly the v2 set", async () => {
  const { base, exe1, exe2 } = upgradeScratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable: exe1 });
  const dir = path.join(cwd, ".claude", "skills", "aslite");
  assert.ok(existsSync(path.join(dir, ...LEGACY_FILE.split("/"))));

  const upgraded = await runSkill(["install"], { cwd, executable: exe2 });
  assert.equal(upgraded.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(path.join(dir, ...LEGACY_FILE.split("/"))), false, "obsolete v1 asset converges away");
  const manifest = JSON.parse(readFileSync(path.join(dir, SKILL_MANIFEST_FILENAME), "utf8"));
  assert.deepEqual(manifest.files, Object.keys(ASSET_FILES).sort(), "final manifest owns exactly the v2 set");
  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "installed");
});

test("upgrade intermediate (transitional manifest + surviving v1 asset): stale, install converges, uninstall cleans", async () => {
  const { base, exe1, exe2 } = upgradeScratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  const dir = path.join(cwd, ".claude", "skills", "aslite");

  // The kill point right after the transitional-manifest write: v1 files intact, union manifest.
  const construct = async () => {
    rmSync(path.join(cwd, ".claude"), { recursive: true, force: true });
    rmSync(path.join(cwd, ".codex"), { recursive: true, force: true });
    await runSkill(["install"], { cwd, executable: exe1 });
    writeTransitionalManifest(dir);
  };

  await construct();
  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "stale");
  const converge = await runSkill(["install"], { cwd, executable: exe2 });
  assert.equal(converge.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(path.join(dir, ...LEGACY_FILE.split("/"))), false);
  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "installed");

  await construct();
  const removed = await runSkill(["uninstall"], { cwd, executable: exe2 });
  assert.equal(removed.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(dir), false, "uninstall from the transitional state removes every owned file");
});

test("upgrade intermediate (transitional manifest + partial v2 assets): stale, install converges, uninstall cleans", async () => {
  const { base, exe1, exe2 } = upgradeScratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  const dir = path.join(cwd, ".claude", "skills", "aslite");

  // The kill point mid-asset-writes: union manifest, one v2 asset missing, legacy still present.
  const construct = async () => {
    rmSync(path.join(cwd, ".claude"), { recursive: true, force: true });
    rmSync(path.join(cwd, ".codex"), { recursive: true, force: true });
    await runSkill(["install"], { cwd, executable: exe1 });
    writeTransitionalManifest(dir);
    rmSync(path.join(dir, "references", "views", "view-authoring.md"));
  };

  await construct();
  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "stale");
  const converge = await runSkill(["install"], { cwd, executable: exe2 });
  assert.equal(converge.skill.hosts.claude_code.changed, true);
  assert.equal(
    readFileSync(path.join(dir, "references", "views", "view-authoring.md"), "utf8"),
    ASSET_FILES["references/views/view-authoring.md"],
  );
  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "installed");

  await construct();
  const removed = await runSkill(["uninstall"], { cwd, executable: exe2 });
  assert.equal(removed.skill.hosts.claude_code.changed, true);
  assert.equal(existsSync(dir), false);
});

test("upgrade completed state (final manifest, exact v2 assets): installed, install no-op, uninstall cleans", async () => {
  const { base, exe1, exe2 } = upgradeScratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  await runSkill(["install"], { cwd, executable: exe1 });
  await runSkill(["install"], { cwd, executable: exe2 });
  const dir = path.join(cwd, ".claude", "skills", "aslite");

  assert.equal((await runSkill(["status"], { cwd, executable: exe2 })).skill.hosts.claude_code.state, "installed");
  assert.equal((await runSkill(["install"], { cwd, executable: exe2 })).skill.changed, false);
  await runSkill(["uninstall"], { cwd, executable: exe2 });
  assert.equal(existsSync(dir), false);
});

test("UNMANAGED folder + asset-named tmp + foreign file: refusal deletes NEITHER (ownership not established)", async () => {
  // The reviewer's fixture: without a valid manifest, an asset-name-based tmp could shadow
  // foreign data — the sweep must not touch it; only the reserved manifest-name tmp is ours.
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  const claudeDir = path.join(cwd, ".claude", "skills", "aslite");
  mkdirSync(claudeDir, { recursive: true });
  writeFileSync(path.join(claudeDir, "SKILL.md.tmp-123-abc-def"), "could be foreign data\n");
  writeFileSync(path.join(claudeDir, "foreign.md"), "definitely foreign\n");

  await assert.rejects(() => runSkill(["install"], { cwd, executable }), CliError);
  assert.equal(readFileSync(path.join(claudeDir, "SKILL.md.tmp-123-abc-def"), "utf8"), "could be foreign data\n");
  assert.equal(readFileSync(path.join(claudeDir, "foreign.md"), "utf8"), "definitely foreign\n");

  await assert.rejects(() => runSkill(["uninstall"], { cwd, executable }), CliError);
  assert.equal(readFileSync(path.join(claudeDir, "SKILL.md.tmp-123-abc-def"), "utf8"), "could be foreign data\n");
  assert.equal(readFileSync(path.join(claudeDir, "foreign.md"), "utf8"), "definitely foreign\n");
});

test("install adopts a pre-existing EMPTY real directory as a fresh install", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(path.join(cwd, ".claude", "skills", "aslite"), { recursive: true });
  const receipt = await runSkill(["install"], { cwd, executable });
  assert.equal(receipt.skill.hosts.claude_code.changed, true);
  assert.equal((await runSkill(["status"], { cwd, executable })).skill.hosts.claude_code.state, "installed");
});

test("skill usage errors: missing/unknown subcommand and bad scope are USAGE, not runtime", async () => {
  const { base, executable } = scratch();
  const cwd = path.join(base, "project");
  mkdirSync(cwd, { recursive: true });
  for (const argv of [[], ["frobnicate"], ["install", "--scope", "galaxy"]]) {
    await assert.rejects(
      () => runSkill(argv, { cwd, executable }),
      (err: unknown) => err instanceof CliError && err.code === "USAGE",
    );
  }
});
