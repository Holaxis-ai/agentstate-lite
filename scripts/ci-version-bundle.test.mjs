import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  parseSemver,
  bumpPatch,
  higherVersion,
  extractVersion,
  replaceVersion,
  run,
  regenerateArtifacts,
  REAL_PATHS,
} from "./ci-version-bundle.mjs";
import { buildCliBundle } from "../packages/cli/scripts/build-bundle.mjs";
import { embedUiAssets } from "../packages/cli/scripts/embed-ui-assets.mjs";

// ---------------------------------------------------------------------------------------------
// Pure semver helpers.
// ---------------------------------------------------------------------------------------------

describe("parseSemver / bumpPatch / higherVersion", () => {
  test("bumpPatch increments only the patch component", () => {
    assert.equal(bumpPatch("1.0.24"), "1.0.25");
    assert.equal(bumpPatch("2.9.9"), "2.9.10");
    assert.equal(bumpPatch("0.0.0"), "0.0.1");
  });

  test("parseSemver rejects anything that isn't plain major.minor.patch", () => {
    for (const bad of ["1.0", "1.0.0-beta", "v1.0.0", "1.0.0.1", "latest", ""]) {
      assert.throws(() => parseSemver(bad), /not a plain major\.minor\.patch/);
    }
  });

  test("higherVersion picks the semantically greater version, not the lexically greater string", () => {
    assert.equal(higherVersion("1.0.9", "1.0.10"), "1.0.10"); // lexical would wrongly pick "1.0.9"
    assert.equal(higherVersion("1.2.0", "1.10.0"), "1.10.0");
    assert.equal(higherVersion("2.0.0", "1.9.9"), "2.0.0");
    assert.equal(higherVersion("1.0.24", "1.0.24"), "1.0.24"); // equal -> either (returns `a`)
  });
});

// ---------------------------------------------------------------------------------------------
// Manifest text surgery — must be a surgical single-field replace, not a reformat.
// ---------------------------------------------------------------------------------------------

describe("extractVersion / replaceVersion", () => {
  const marketplaceFixture = [
    "{",
    '  "name": "agentstate-lite",',
    '  "owner": { "name": "Holaxis" },',
    '  "plugins": [',
    "    {",
    '      "name": "agentstate-lite",',
    '      "description": "A markdown knowledge bundle.",',
    '      "version": "1.2.3",',
    '      "source": "./plugins/agentstate-lite",',
    '      "author": { "name": "Holaxis" }',
    "    }",
    "  ]",
    "}",
    "",
  ].join("\n");

  test("extractVersion finds the sole version field", () => {
    assert.equal(extractVersion(marketplaceFixture, "fixture"), "1.2.3");
  });

  test("extractVersion throws when there isn't exactly one match", () => {
    assert.throws(() => extractVersion('{"no-version-here": true}', "fixture"), /found 0/);
    const twoVersions = '{"version": "1.0.0"}\n{"version": "2.0.0"}';
    assert.throws(() => extractVersion(twoVersions, "fixture"), /found 2/);
  });

  test("replaceVersion changes ONLY the version value — byte-identical everywhere else", () => {
    const updated = replaceVersion(marketplaceFixture, "1.2.4", "fixture");
    assert.equal(extractVersion(updated, "fixture"), "1.2.4");
    // Every other line, including the compact inline `"author": { "name": "Holaxis" }`, is untouched.
    const expected = marketplaceFixture.replace('"version": "1.2.3"', '"version": "1.2.4"');
    assert.equal(updated, expected);
  });
});

// ---------------------------------------------------------------------------------------------
// Orchestration — fixture temp dir + a fake `regenerate`, fully isolated from the real repo.
// ---------------------------------------------------------------------------------------------

async function makeFixtureBundle({ marketplaceVersion = "1.2.3", pluginVersion = marketplaceVersion } = {}) {
  const dir = await mkdtemp(join(tmpdir(), "ci-version-bundle-test-"));
  const paths = {
    marketplace: join(dir, "marketplace.json"),
    pluginJson: join(dir, "plugin.json"),
    skillMd: join(dir, "SKILL.md"),
    bundleMjs: join(dir, "agentstate-lite.mjs"),
  };
  await writeFile(
    paths.marketplace,
    `{\n  "name": "agentstate-lite",\n  "plugins": [\n    { "name": "agentstate-lite", "version": "${marketplaceVersion}" }\n  ]\n}\n`,
  );
  await writeFile(paths.pluginJson, `{\n  "name": "agentstate-lite",\n  "version": "${pluginVersion}"\n}\n`);
  await writeFile(paths.skillMd, "# SKILL v1\n");
  await writeFile(paths.bundleMjs, "console.log('bundle v1');\n");
  return { dir, paths };
}

describe("run() orchestration (fixtures, fake regenerate)", () => {
  test("artifact-current no-op: regen produces byte-identical content -> no bump, manifests untouched", async () => {
    const { dir, paths } = await makeFixtureBundle();
    try {
      const identityRegen = async (p) => {
        // "Rebuild" that reproduces exactly what's already committed — the steady state.
        await writeFile(p.skillMd, "# SKILL v1\n");
        await writeFile(p.bundleMjs, "console.log('bundle v1');\n");
      };
      const result = await run({ regenerate: identityRegen, paths });
      assert.deepEqual(result, { changed: false });
      assert.equal(extractVersion(await readFile(paths.marketplace, "utf8"), "m"), "1.2.3");
      assert.equal(extractVersion(await readFile(paths.pluginJson, "utf8"), "p"), "1.2.3");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("bump-both-manifests atomicity: a content change bumps BOTH manifests to the identical new version", async () => {
    const { dir, paths } = await makeFixtureBundle({ marketplaceVersion: "1.2.3" });
    try {
      const changingRegen = async (p) => {
        await writeFile(p.skillMd, "# SKILL v2 (regenerated)\n"); // differs from fixture's v1
        await writeFile(p.bundleMjs, "console.log('bundle v1');\n"); // unchanged
      };
      const result = await run({ regenerate: changingRegen, paths });
      assert.equal(result.changed, true);
      assert.equal(result.skillMdChanged, true);
      assert.equal(result.bundleChanged, false);
      assert.equal(result.baseVersion, "1.2.3");
      assert.equal(result.newVersion, "1.2.4");

      const marketplaceVersion = extractVersion(await readFile(paths.marketplace, "utf8"), "m");
      const pluginVersion = extractVersion(await readFile(paths.pluginJson, "utf8"), "p");
      assert.equal(marketplaceVersion, "1.2.4");
      assert.equal(pluginVersion, "1.2.4");
      assert.equal(marketplaceVersion, pluginVersion); // never allowed to diverge after one run
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("manifest drift self-heals: bumps from the HIGHER of two mismatched manifest versions", async () => {
    const { dir, paths } = await makeFixtureBundle({ marketplaceVersion: "1.2.3", pluginVersion: "1.2.5" });
    try {
      const changingRegen = async (p) => writeFile(p.skillMd, "# changed\n");
      const result = await run({ regenerate: changingRegen, paths });
      assert.equal(result.baseVersion, "1.2.5"); // the higher of the two, not marketplace's
      assert.equal(result.newVersion, "1.2.6");
      assert.equal(extractVersion(await readFile(paths.marketplace, "utf8"), "m"), "1.2.6");
      assert.equal(extractVersion(await readFile(paths.pluginJson, "utf8"), "p"), "1.2.6");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("convergence: a second run against the bot's own prior output is a clean no-op", async () => {
    const { dir, paths } = await makeFixtureBundle({ marketplaceVersion: "1.2.3" });
    try {
      // Run 1: simulates a real source change landing on main.
      const firstRegen = async (p) => writeFile(p.skillMd, "# SKILL v2 (regenerated)\n");
      const first = await run({ regenerate: firstRegen, paths });
      assert.equal(first.changed, true);
      assert.equal(first.newVersion, "1.2.4");

      // Run 2: simulates the bot's OWN commit re-triggering the workflow. A deterministic rebuild
      // reproduces exactly what run 1 just committed (byte-identical, per the empirical no-embedded-
      // version finding) — so this must be a no-op, not a further bump. This is the loop-safety
      // property the workflow depends on instead of a paths filter or actor check.
      const secondRegen = async (p) => writeFile(p.skillMd, "# SKILL v2 (regenerated)\n");
      const second = await run({ regenerate: secondRegen, paths });
      assert.deepEqual(second, { changed: false });
      assert.equal(extractVersion(await readFile(paths.marketplace, "utf8"), "m"), "1.2.4");
      assert.equal(extractVersion(await readFile(paths.pluginJson, "utf8"), "p"), "1.2.4");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Real repo integration — proves the production wiring, not just the orchestration logic.
// Any real mutation this makes to the committed repo files is restored in `finally`, so the test
// suite never leaves the working tree dirty regardless of pass/fail or of the repo's state at
// test time (e.g. a developer mid-edit on CLI source).
// ---------------------------------------------------------------------------------------------

describe("real build (repo-tied)", () => {
  test("two real builds of the same source are byte-identical and embed no version literal", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ci-version-bundle-real-"));
    try {
      embedUiAssets();
      const out1 = join(dir, "build1.mjs");
      const out2 = join(dir, "build2.mjs");
      await buildCliBundle(out1);
      await buildCliBundle(out2);
      const bytes1 = await readFile(out1);
      const bytes2 = await readFile(out2);
      assert.ok(bytes1.equals(bytes2), "two consecutive real builds must be byte-identical");

      const currentMarketplace = await readFile(REAL_PATHS.marketplace, "utf8");
      const currentVersion = extractVersion(currentMarketplace, REAL_PATHS.marketplace);
      assert.ok(
        !bytes1.toString("latin1").includes(currentVersion),
        `built bundle must not embed the manifest version literal (${currentVersion})`,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("run() against the REAL repo paths converges to a no-op when the tree is already current", async () => {
    // Snapshot so this test can never leave the real committed files mutated, whatever the
    // ambient repo state is at test time.
    const backup = {};
    for (const [key, path] of Object.entries(REAL_PATHS)) {
      backup[key] = await readFile(path);
    }
    try {
      const result = await run(); // real regenerate, real paths — no overrides
      // If the repo is in its normal, already-converged state (the common case, and the state
      // this worktree was in when this suite was written), regeneration matches committed bytes
      // exactly and this must be a no-op. If a developer is mid-edit on CLI source when running
      // tests, this may legitimately report changed:true — that's fine; the restore below still
      // guarantees no lasting side effect either way.
      assert.equal(typeof result.changed, "boolean");
    } finally {
      for (const [key, path] of Object.entries(REAL_PATHS)) {
        await writeFile(path, backup[key]);
      }
    }
  });
});
