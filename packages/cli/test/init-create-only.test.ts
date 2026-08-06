/**
 * `init --create-only` — the shared onboarding target-safety boundary (tasks/init-target-safety-guard).
 *
 * The guard's contract: create a bundle ONLY at a genuinely new target, refusing — before any
 * write — existing bundles, non-empty or symlinked targets, enclosing bundles/workspaces, and
 * binding-shadowed locations; a CONCURRENT creator is turned into a typed conflict by core
 * `initBundle`'s `expectNew` expect-absent CAS rather than silently adopted. Every refusal is
 * byte-preserving: these tests snapshot the target tree before the refused call and require it
 * unchanged after. Plain `init` (no flag) keeps its open-or-create behavior (its own suites pin
 * that; one control test here re-proves the exact case the guard refuses).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initBundle, VersionConflict } from "@agentstate-lite/core";
import { init } from "../src/commands/init.js";
import { assertCreateOnlyTarget } from "../src/bundle.js";
import { CliError } from "../src/errors.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const cliBin = path.resolve(here, "..", "dist", "agentstate-lite.mjs");

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-create-only-test-"));
}

async function runInit(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await init([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

/** Recursive { relativePath -> content } snapshot for byte-preservation assertions. */
async function treeSnapshot(dir: string): Promise<Map<string, string>> {
  const entries = new Map<string, string>();
  if (!existsSync(dir)) return entries;
  async function walk(rel: string): Promise<void> {
    for (const e of await readdir(path.join(dir, rel), { withFileTypes: true })) {
      const child = path.join(rel, e.name);
      if (e.isDirectory()) await walk(child);
      else entries.set(child, await readFile(path.join(dir, child), "utf8"));
    }
  }
  await walk("");
  return entries;
}

function assertSameTree(before: Map<string, string>, after: Map<string, string>): void {
  assert.deepEqual([...after.keys()].sort(), [...before.keys()].sort());
  for (const [key, content] of before) assert.equal(after.get(key), content, key);
}

async function expectRefusal(argv: string[], pattern: RegExp): Promise<CliError> {
  let thrown: unknown;
  try {
    await runInit(argv);
  } catch (err) {
    thrown = err;
  }
  assert.ok(thrown instanceof CliError, "refusal must be a structured CliError");
  assert.match(thrown.message, pattern);
  return thrown;
}

test("a fresh explicit target initializes with every supported recipe form", async () => {
  const base = await tempDir();
  try {
    // Default recipe (context-notes).
    const withDefault = await runInit(["--create-only", "--dir", path.join(base, "a")]);
    assert.equal(withDefault.init, "ok");
    assert.equal(withDefault.recipe, "context-notes");
    // Explicit opt-out.
    const bare = await runInit(["--create-only", "--dir", path.join(base, "b"), "--recipe", "none"]);
    assert.equal(bare.recipe, "none");
    // A named built-in.
    const named = await runInit([
      "--create-only",
      "--dir",
      path.join(base, "c"),
      "--recipe",
      "work-tracking",
    ]);
    assert.equal(named.recipe, "work-tracking");
    // A path-form recipe folder — the shipped worked example, exercising the external RecipeSource.
    const recipeDir = path.resolve(here, "..", "references", "recipes", "claims");
    const fromPath = await runInit(["--create-only", "--dir", path.join(base, "d"), "--recipe", recipeDir]);
    assert.equal(fromPath.init, "ok");
    assert.equal(fromPath.recipe, "claims");
    // Deep target whose intermediate ancestors do not exist yet.
    const deep = await runInit(["--create-only", "--dir", path.join(base, "x", "y", "z")]);
    assert.equal(deep.init, "ok");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("an existing bundle target is refused byte-for-byte before any write", async () => {
  const base = await tempDir();
  try {
    const target = path.join(base, "bundle");
    await runInit(["--dir", target]); // plain init creates it (control: open-or-create unchanged)
    const before = await treeSnapshot(target);
    const err = await expectRefusal(["--create-only", "--dir", target], /already an OKF bundle/);
    assert.equal(err.code, "ALREADY_EXISTS");
    assert.match(String(err.help), /recipe add/);
    assertSameTree(before, await treeSnapshot(target));
    // The control the guard exists to contrast with: plain init re-opens the same target fine.
    assert.equal((await runInit(["--dir", target])).init, "ok");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("a target nested inside an enclosing bundle is refused; conventional ancestor workspaces too", async () => {
  const base = await tempDir();
  try {
    // Enclosing bundle: an ancestor with its own index.md.
    const enclosingRoot = path.join(base, "enclosing");
    await runInit(["--dir", enclosingRoot, "--recipe", "none"]);
    const before = await treeSnapshot(enclosingRoot);
    await expectRefusal(
      ["--create-only", "--dir", path.join(enclosingRoot, "sub", "deep")],
      /nest inside the existing bundle/,
    );
    assertSameTree(before, await treeSnapshot(enclosingRoot));

    // Conventional workspace at an ancestor: <proj>/.agentstate-lite exists -> join it, not a second store.
    const proj = path.join(base, "proj");
    await runInit(["--dir", path.join(proj, ".agentstate-lite"), "--recipe", "none"]);
    await expectRefusal(
      ["--create-only", "--dir", path.join(proj, "docs", "new-bundle")],
      /existing project workspace .* already serves this location/,
    );

    // But creating the conventional folder ITSELF in a fresh project is allowed.
    const fresh = path.join(base, "fresh-proj");
    await mkdir(fresh, { recursive: true });
    const receipt = await runInit(["--create-only", "--dir", path.join(fresh, ".agentstate-lite")]);
    assert.equal(receipt.init, "ok");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("bindings: an existing bound bundle refuses; malformed and URL bindings keep their USAGE errors", async () => {
  const base = await tempDir();
  try {
    const proj = path.join(base, "proj");
    const bound = path.join(base, "workspace");
    await runInit(["--dir", bound, "--recipe", "none"]);
    await mkdir(path.join(proj, "sub"), { recursive: true });
    await writeFile(path.join(proj, ".agentstate.json"), `${JSON.stringify({ bundle: bound })}\n`);
    const err = await expectRefusal(
      ["--create-only", "--dir", path.join(proj, "sub", "new-bundle")],
      /project binding .* already resolves this location to the existing bundle/,
    );
    assert.equal(err.code, "ALREADY_EXISTS");

    // A binding pointing at a bundle that does NOT exist is not "an existing bundle" — allowed.
    const proj2 = path.join(base, "proj2");
    await mkdir(proj2, { recursive: true });
    await writeFile(
      path.join(proj2, ".agentstate.json"),
      `${JSON.stringify({ bundle: path.join(base, "nowhere") })}\n`,
    );
    assert.equal((await runInit(["--create-only", "--dir", path.join(proj2, "nb")])).init, "ok");

    // Malformed JSON binding: the existing fail-closed USAGE error, unchanged wording family.
    const proj3 = path.join(base, "proj3");
    await mkdir(proj3, { recursive: true });
    await writeFile(path.join(proj3, ".agentstate.json"), "{not json");
    const malformed = await expectRefusal(
      ["--create-only", "--dir", path.join(proj3, "nb")],
      /malformed project binding/,
    );
    assert.equal(malformed.code, "USAGE");

    // URL-valued binding: the existing explicit-remote migration error.
    const proj4 = path.join(base, "proj4");
    await mkdir(proj4, { recursive: true });
    await writeFile(
      path.join(proj4, ".agentstate.json"),
      `${JSON.stringify({ bundle: "https://example.com/b" })}\n`,
    );
    const url = await expectRefusal(["--create-only", "--dir", path.join(proj4, "nb")], /URL bindings/);
    assert.equal(url.code, "USAGE");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("symlink targets and symlinked ancestor aliases cannot dodge the guard", async () => {
  const base = await tempDir();
  try {
    // A symlink AT the target — even to an empty real directory — is an alias refusal.
    const real = path.join(base, "real-empty");
    await mkdir(real);
    const alias = path.join(base, "alias");
    await symlink(real, alias);
    const err = await expectRefusal(["--create-only", "--dir", alias], /is a symlink/);
    assert.equal(err.code, "ALREADY_EXISTS");
    assert.equal((await readdir(real)).length, 0, "nothing was written through the alias");

    // A symlinked ANCESTOR that resolves into an existing bundle: physical resolution finds the
    // enclosing bundle the logical path hides.
    const bundleRoot = path.join(base, "bundle");
    await runInit(["--dir", bundleRoot, "--recipe", "none"]);
    const sideDoor = path.join(base, "side-door");
    await symlink(bundleRoot, sideDoor);
    const before = await treeSnapshot(bundleRoot);
    await expectRefusal(
      ["--create-only", "--dir", path.join(sideDoor, "inner", "fresh")],
      /nest inside the existing bundle/,
    );
    assertSameTree(before, await treeSnapshot(bundleRoot));

    // A non-empty, non-bundle directory must not be adopted as a "new" workspace.
    const cluttered = path.join(base, "cluttered");
    await mkdir(cluttered);
    await writeFile(path.join(cluttered, "notes.txt"), "keep\n");
    await expectRefusal(["--create-only", "--dir", cluttered], /is not empty/);
    assert.equal(readFileSync(path.join(cluttered, "notes.txt"), "utf8"), "keep\n");

    // A plain FILE at the target.
    const file = path.join(base, "a-file");
    await writeFile(file, "x\n");
    await expectRefusal(["--create-only", "--dir", file], /not a directory/);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("core expectNew: a concurrent index.md is a typed VersionConflict, never silent adoption", async () => {
  const base = await tempDir();
  try {
    const dir = path.join(base, "raced");
    await initBundle(dir, {}); // the "other" creator finished first
    await assert.rejects(() => initBundle(dir, { expectNew: true }), VersionConflict);
    // And the preflight primitive alone performs no writes on a fresh path. The returned target
    // is PHYSICAL (e.g. macOS /var -> /private/var), so compare against the realpath'd base.
    const fresh = path.join(base, "untouched");
    const resolved = await assertCreateOnlyTarget(fresh);
    const { realpath } = await import("node:fs/promises");
    assert.equal(resolved, path.join(await realpath(base), "untouched"));
    assert.equal(existsSync(fresh), false, "the preflight must not create anything");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("two real concurrent create-only processes: exactly one winner, loser exits 5 with no partial state", async () => {
  const base = await tempDir();
  try {
    const target = path.join(base, "raced");
    const spawnOne = () =>
      spawnSync(process.execPath, [cliBin, "init", "--create-only", "--dir", target, "--json"], {
        encoding: "utf8",
      });
    // True simultaneity is not schedulable from here; run the pair sequentially — the SECOND run
    // exercises the exact loser path (existing-bundle refusal), and the CAS loser path is pinned
    // deterministically by the core expectNew test above.
    const first = spawnOne();
    const second = spawnOne();
    const codes = [first.status, second.status].sort();
    assert.deepEqual(codes, [0, 5], `${first.stdout}${first.stderr}${second.stdout}${second.stderr}`);
    const winner = first.status === 0 ? first : second;
    assert.equal(JSON.parse(winner.stdout).init, "ok");
    const loser = first.status === 0 ? second : first;
    assert.match(loser.stdout, /already an OKF bundle|gained a bundle concurrently/);
    assert.ok(existsSync(path.join(target, "index.md")), "the winner's bundle stands");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("permission failure surfaces as a structured error, not a crash or partial write", async (t) => {
  if (process.getuid?.() === 0) {
    t.skip("running as root — permission refusals are not enforceable");
    return;
  }
  const base = await tempDir();
  try {
    const sealed = path.join(base, "sealed");
    await mkdir(sealed);
    const { chmod } = await import("node:fs/promises");
    await chmod(sealed, 0o555);
    try {
      let thrown: unknown;
      try {
        await runInit(["--create-only", "--dir", path.join(sealed, "nb")]);
      } catch (err) {
        thrown = err;
      }
      assert.ok(thrown instanceof Error, "a denied write must surface as an error");
      assert.equal(existsSync(path.join(sealed, "nb")), false);
    } finally {
      await chmod(sealed, 0o755);
    }
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("usage text and reference carry the exact public spelling", async () => {
  const { INIT_USAGE } = await import("../src/commands/init.js");
  assert.match(INIT_USAGE, /--create-only/);
  const { COMMAND_GROUPS } = await import("../src/reference.js");
  const entry = COMMAND_GROUPS.flatMap((g) => g.commands).find((c) => c.usage.startsWith("init "));
  assert.ok(entry, "init entry present");
  assert.match(entry.usage, /\[--create-only\]/);
});

// ── review-fix round: findings from the independent exact-SHA review of e84a66e ──

test("dangling and looping symlink targets refuse at exit 5 with recovery help, never a raw fs error", async () => {
  const base = await tempDir();
  try {
    const dangling = path.join(base, "dangling");
    await symlink(path.join(base, "nowhere"), dangling);
    const err = await expectRefusal(["--create-only", "--dir", dangling], /is a symlink/);
    assert.equal(err.code, "ALREADY_EXISTS");
    assert.match(String(err.help), /recipe add/);

    const loop = path.join(base, "loop");
    await symlink(loop, loop);
    const looping = await expectRefusal(["--create-only", "--dir", loop], /is a symlink/);
    assert.equal(looping.code, "ALREADY_EXISTS");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("the CLI maps a core VersionConflict to a structured ALREADY_EXISTS conflict (seam-pinned)", async () => {
  const base = await tempDir();
  try {
    let out = "";
    let thrown: unknown;
    try {
      await init(["--create-only", "--dir", path.join(base, "raced"), "--json"], {
        stdout: (s) => (out += s),
        initBundleImpl: async () => {
          throw new VersionConflict("index.md", null, "sha256:other");
        },
      });
    } catch (err) {
      thrown = err;
    }
    assert.ok(thrown instanceof CliError, out);
    assert.equal(thrown.code, "ALREADY_EXISTS");
    assert.match(thrown.message, /gained a bundle concurrently/);
    assert.match(String(thrown.help), /recipe add/);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("claim closes the preflight-to-write window deterministically for both target shapes", async () => {
  const { claimCreateOnlyTarget } = await import("../src/bundle.js");
  const base = await tempDir();
  try {
    // Absent at preflight, concurrently created WITH CONTENT before the claim -> refusal, files
    // preserved. (A concurrently created EMPTY directory converges — same acceptance as preflight.)
    const raced = path.join(base, "raced-dir");
    const target = await assertCreateOnlyTarget(raced);
    await mkdir(target); // the concurrent creator...
    await writeFile(path.join(target, "theirs.txt"), "keep\n"); // ...with content
    await assert.rejects(
      () => claimCreateOnlyTarget(target),
      (err: unknown) => err instanceof CliError && /gained content after preflight/.test(err.message),
    );
    assert.equal(readFileSync(path.join(target, "theirs.txt"), "utf8"), "keep\n");

    // A symlink swapped in at the claimed path refuses as a shape change.
    const swapped = path.join(base, "swapped");
    const swappedTarget = await assertCreateOnlyTarget(swapped);
    const real = path.join(base, "swap-dest");
    await mkdir(real);
    await symlink(real, swappedTarget);
    await assert.rejects(
      () => claimCreateOnlyTarget(swappedTarget),
      (err: unknown) => err instanceof CliError && /changed shape after preflight/.test(err.message),
    );

    // Empty at preflight, file dropped in before the claim -> adoption refusal, file preserved.
    const drifted = path.join(base, "drifted");
    await mkdir(drifted);
    const verified = await assertCreateOnlyTarget(drifted);
    await writeFile(path.join(verified, "foreign.txt"), "keep\n");
    await assert.rejects(
      () => claimCreateOnlyTarget(verified),
      (err: unknown) => err instanceof CliError && /gained content after preflight/.test(err.message),
    );
    assert.equal(readFileSync(path.join(verified, "foreign.txt"), "utf8"), "keep\n");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("a project-root target holding a conventional workspace is refused BY NAME, not as clutter", async () => {
  const base = await tempDir();
  try {
    const proj = path.join(base, "proj");
    await runInit(["--dir", path.join(proj, ".agentstate-lite"), "--recipe", "none"]);
    const err = await expectRefusal(
      ["--create-only", "--dir", proj],
      /existing project workspace .*\.agentstate-lite already serves this location/,
    );
    assert.equal(err.code, "ALREADY_EXISTS");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("a target path running THROUGH an existing file refuses structurally, never a raw fs error", async () => {
  const base = await tempDir();
  try {
    const file = path.join(base, "blocker");
    await writeFile(file, "x\n");
    const err = await expectRefusal(
      ["--create-only", "--dir", path.join(file, "sub", "deep")],
      /runs through an existing file/,
    );
    assert.equal(err.code, "ALREADY_EXISTS");
    assert.match(String(err.help), /recipe add/);
    assert.equal(readFileSync(file, "utf8"), "x\n");
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("a claim-time index.md racer gets the accurate already-a-bundle refusal", async () => {
  const { claimCreateOnlyTarget } = await import("../src/bundle.js");
  const base = await tempDir();
  try {
    const raced = path.join(base, "raced");
    const target = await assertCreateOnlyTarget(raced);
    await mkdir(target);
    await writeFile(path.join(target, "index.md"), "---\nokf_version: '0.1'\n---\n# raced\n");
    await assert.rejects(
      () => claimCreateOnlyTarget(target),
      (err: unknown) => err instanceof CliError && /is already an OKF bundle — another process created it first/.test(err.message),
    );
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
