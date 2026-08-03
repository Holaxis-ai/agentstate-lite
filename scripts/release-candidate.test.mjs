import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseCandidateArgs, createReleaseCandidate } from "./release-candidate.mjs";
import { verifyRetainedTarball, fileSha256 } from "./verify-npm-package.mjs";
import { buildCli } from "../packages/cli/build.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPackageJson = path.join(repoRoot, "packages", "cli", "package.json");

function headCommit() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

test("parseCandidateArgs validates the tag shape and 40-hex commit", () => {
  assert.deepEqual(parseCandidateArgs(["--tag", "v0.1.0-pre.4", "--commit", "a".repeat(40)]), {
    tag: "v0.1.0-pre.4",
    commit: "a".repeat(40),
    out: "release-candidate",
    json: false,
  });
  assert.equal(parseCandidateArgs(["--tag", "v1.2.3", "--commit", "b".repeat(40), "--out", "cand", "--json"]).json, true);
  assert.throws(() => parseCandidateArgs(["--tag", "1.2.3", "--commit", "a".repeat(40)]), /v-prefixed SemVer/);
  assert.throws(() => parseCandidateArgs(["--tag", "v1.2.3", "--commit", "xyz"]), /40-hex/);
  assert.throws(() => parseCandidateArgs(["--commit", "a".repeat(40)]), /usage:/);
});

test("createReleaseCandidate refuses a tag that does not match the package version — before building", async () => {
  const version = JSON.parse(await readFile(cliPackageJson, "utf8")).version;
  const distPath = path.join(repoRoot, "packages", "cli", "dist", "agentstate-lite.mjs");
  const before = await fileSha256(distPath).catch(() => null);
  await assert.rejects(
    createReleaseCandidate({ tag: "v99.99.99", commit: "a".repeat(40), out: path.join(tmpdir(), "never"), verify: false }),
    new RegExp(`does not match packages/cli/package.json version ${version.replace(/\./g, "\\.")}`),
  );
  // The mismatch is caught before any build overwrites dist.
  const after = await fileSha256(distPath).catch(() => null);
  assert.equal(after, before, "a version mismatch must not rebuild dist");
});

test("build once, pack once: the retained manifest's SHA-256 is the tarball's actual bytes", async (t) => {
  const commit = headCommit();
  if (!commit || !process.env.npm_execpath) {
    t.skip("requires a git checkout and npm_execpath (run via npm)");
    return;
  }
  const version = JSON.parse(await readFile(cliPackageJson, "utf8")).version;
  const out = await mkdtemp(path.join(tmpdir(), "aslite-candidate-"));
  try {
    const { candidate, tarballPath, outDir } = await createReleaseCandidate({
      tag: `v${version}`,
      commit,
      out,
      verify: false, // the heavy global-install proof is exercised by verify:npm-package; here we
      // pin build/pack-once + retention integrity deterministically.
    });
    // Exactly one tarball retained, plus the manifest — never a second candidate.
    const entries = (await readdir(outDir)).filter((f) => f.endsWith(".tgz"));
    assert.equal(entries.length, 1, "exactly one retained tarball");
    assert.equal(candidate.schema, "aslite.release-candidate.v1");
    assert.equal(candidate.tag, `v${version}`);
    assert.equal(candidate.build_identity.artifact.channel, "npm-package");
    assert.deepEqual(candidate.source, { commit, dirty: false });
    // The recorded SHA-256 is exactly the retained bytes — a swap or rebuild would break this.
    assert.equal(candidate.tarball.sha256, await fileSha256(tarballPath));
    assert.ok(candidate.agreement.skill_md_sha256.startsWith("sha256:"));
    assert.ok(Object.keys(candidate.agreement.references_sha256).length > 0, "agreement pins the references tree");
  } finally {
    await rm(out, { recursive: true, force: true });
    // Restore the ordinary dev bundle so later gates see a local-dev dist.
    await buildCli("local-dev");
  }
});

test("verifyRetainedTarball fails closed when the tarball bytes do not match the manifest SHA", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "aslite-swap-"));
  try {
    const fakeTgz = path.join(scratch, "holaxis-aslite-0.0.0.tgz");
    await writeFile(fakeTgz, "not a real tarball\n");
    const manifestPath = path.join(scratch, "candidate.json");
    await writeFile(
      manifestPath,
      JSON.stringify({
        tarball: { sha256: "sha256:" + "0".repeat(64) }, // deliberately wrong
        build_identity: { artifact: { channel: "npm-package" } },
      }),
    );
    // The SHA cross-check throws BEFORE any npm install is attempted.
    await assert.rejects(
      verifyRetainedTarball({ tarball: fakeTgz, manifest: manifestPath }),
      /does not match candidate manifest/,
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("verifyRetainedTarball fails closed when no manifest is supplied (QA finding #2)", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "aslite-nomanifest-"));
  try {
    const fakeTgz = path.join(scratch, "holaxis-aslite-0.0.0.tgz");
    await writeFile(fakeTgz, "not a real tarball\n");
    // No manifest -> refuse BEFORE any install, so a bare valid npm-package tarball can never pass
    // as "the staged candidate".
    await assert.rejects(
      verifyRetainedTarball({ tarball: fakeTgz }),
      /requires a candidate manifest/,
    );
    await assert.rejects(verifyRetainedTarball({ tarball: fakeTgz, manifest: null }), /requires a candidate manifest/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("the retained-tarball verifier path contains no build or pack call (structural no-rebuild proof)", async () => {
  const source = await readFile(path.join(repoRoot, "scripts", "verify-npm-package.mjs"), "utf8");
  const at = source.indexOf("export async function verifyRetainedTarball");
  assert.notEqual(at, -1);
  const retainedRegion = source.slice(at); // to EOF: only the retained fn + CLI dispatch follow
  for (const token of ["build.mjs", "npm pack", "buildCli", '"pack"']) {
    assert.ok(!retainedRegion.includes(token), `retained verifier must not reference ${JSON.stringify(token)}`);
  }
});
