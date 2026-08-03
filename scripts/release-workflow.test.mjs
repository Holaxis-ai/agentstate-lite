import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staged = readFileSync(path.join(repoRoot, ".github", "workflows", "release-staged.yml"), "utf8");
const finalize = readFileSync(path.join(repoRoot, ".github", "workflows", "release-finalize.yml"), "utf8");

// Split a workflow's `jobs:` mapping into { jobName -> rawJobText } using the 2-space job-header
// indentation. Dependency-free (no yaml package in the published boundary); the format is ours.
function extractJobs(text) {
  const lines = text.split("\n");
  const jobsAt = lines.findIndex((l) => l === "jobs:");
  assert.notEqual(jobsAt, -1, "workflow must declare jobs:");
  const jobs = {};
  let current = null;
  for (let i = jobsAt + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") {
      if (current) jobs[current].push(line);
      continue;
    }
    const header = /^ {2}([A-Za-z0-9_-]+):\s*$/.exec(line);
    if (header) {
      current = header[1];
      jobs[current] = [];
      continue;
    }
    // A non-blank line indented 2 or fewer spaces ends the jobs: mapping.
    if (!/^ {3,}/.test(line)) break;
    if (current) jobs[current].push(line);
  }
  const out = {};
  for (const [k, v] of Object.entries(jobs)) out[k] = v.join("\n");
  return out;
}

// Extract the `permissions:` block of a job into { scope -> value }.
function permissionsOf(jobText) {
  const lines = jobText.split("\n");
  const at = lines.findIndex((l) => /^ {4}permissions:\s*$/.test(l));
  if (at === -1) return null;
  const perms = {};
  for (let i = at + 1; i < lines.length; i++) {
    const m = /^ {6}([a-z-]+):\s*(\S+)\s*$/.exec(lines[i]);
    if (!m) break;
    perms[m[1]] = m[2];
  }
  return perms;
}

// Tokens that mean "a build or a pack happened here". The artifact NAME/dir `release-candidate` and
// `release-candidate-<id>` are deliberately NOT in this list — only the command that BUILDS/PACKS.
const BUILD_PACK_TOKENS = ["release:candidate", "release-candidate.mjs", "build.mjs", "npm pack", "npm run build", "buildCli"];

test("neither workflow grants ambient permissions — every job opts in", () => {
  assert.match(staged, /\npermissions: \{\}\n/, "release-staged.yml must set top-level permissions: {}");
  assert.match(finalize, /\npermissions: \{\}\n/, "release-finalize.yml must set top-level permissions: {}");
});

test("staged workflow: each job carries exactly its minimal permissions", () => {
  const jobs = extractJobs(staged);
  assert.deepEqual(Object.keys(jobs).sort(), ["candidate", "draft", "stage"]);
  assert.deepEqual(permissionsOf(jobs.candidate), { contents: "read" }, "candidate reads source only");
  assert.deepEqual(permissionsOf(jobs.draft), { contents: "write" }, "draft prepares the GitHub draft only");
  assert.deepEqual(
    permissionsOf(jobs.stage),
    { contents: "read", "id-token": "write" },
    "stage needs read + OIDC only — never contents:write",
  );
});

test("finalize workflow: registry-verify is read-only, finalize gets contents:write only", () => {
  const jobs = extractJobs(finalize);
  assert.deepEqual(Object.keys(jobs).sort(), ["finalize", "registry-verify"]);
  assert.deepEqual(permissionsOf(jobs["registry-verify"]), { contents: "read" });
  assert.deepEqual(permissionsOf(jobs.finalize), { contents: "write" });
});

test("THE INVARIANT: no build/pack token appears outside the candidate job", () => {
  const jobs = extractJobs(staged);
  for (const token of BUILD_PACK_TOKENS) {
    for (const [name, body] of Object.entries(jobs)) {
      if (name === "candidate") continue;
      assert.ok(!body.includes(token), `job ${name} must not contain build/pack token ${JSON.stringify(token)}`);
    }
  }
  // The candidate job IS where the one build+pack happens.
  assert.ok(jobs.candidate.includes("release:candidate"), "candidate job must run the release-candidate command");
  // The finalize workflow rebuilds nothing at all.
  for (const token of BUILD_PACK_TOKENS) {
    assert.ok(!finalize.includes(token), `finalize workflow must not contain build/pack token ${JSON.stringify(token)}`);
  }
});

test("the stage job stages the LITERAL retained tarball, not a fresh build", () => {
  const jobs = extractJobs(staged);
  assert.match(jobs.stage, /download-artifact/, "stage must download the retained artifact");
  assert.match(jobs.stage, /TARBALL="\$ARTIFACT_DIR\/\$\{\{ needs\.candidate\.outputs\.tarball_filename \}\}"/);
  assert.match(jobs.stage, /npm stage publish "\$TARBALL" --tag "\$POLICY_TAG"/);
  // And it re-verifies the retained bytes against the prepared SHA before staging.
  assert.match(jobs.stage, /needs\.candidate\.outputs\.tarball_sha256/);
});

test("the run ends with immutable identifiers and the interactive inspection instructions", () => {
  const jobs = extractJobs(staged);
  assert.match(jobs.candidate, /run_id: \$\{\{ github\.run_id \}\}/);
  assert.match(jobs.candidate, /artifact_id: \$\{\{ steps\.upload\.outputs\.artifact-id \}\}/);
  assert.match(jobs.stage, /release-emit-receipt\.mjs/, "stage emits the immutable receipt + inspection instructions");
  assert.match(jobs.stage, /--stage-id/);
});

test("live registry/release mutation is guarded by MODE == live in BOTH workflows", () => {
  // Every stage/publish/dist-tag mutation sits behind a `[ "$MODE" = "live" ]` guard.
  for (const [name, text] of [["staged", staged], ["finalize", finalize]]) {
    const guardedMutations = /if \[ "\$MODE" = "live" \]/.test(text);
    assert.ok(guardedMutations, `${name} workflow must guard live mutation behind MODE == live`);
  }
  // The default mode is dry-run.
  assert.match(staged, /MODE: \$\{\{ github\.event\.inputs\.mode \|\| 'dry-run' \}\}/);
});

test("the stage job binds the protected release environment; finalize does too", () => {
  const stagedJobs = extractJobs(staged);
  const finalizeJobs = extractJobs(finalize);
  assert.match(stagedJobs.stage, /environment: release/);
  assert.match(finalizeJobs.finalize, /environment: release/);
});

test("the finalizer is separately dispatched and accepts the original immutable IDs", () => {
  assert.match(finalize, /on:\n {2}workflow_dispatch:/, "finalize is workflow_dispatch only (no tag trigger)");
  for (const input of ["run_id", "artifact_id", "stage_id", "draft_release_id", "version"]) {
    assert.match(finalize, new RegExp(`\\n {6}${input}:`), `finalize must accept the ${input} identifier`);
  }
  // It downloads the retained artifact from the ORIGINAL run rather than rebuilding.
  assert.match(finalize, /run-id: \$\{\{ github\.event\.inputs\.run_id \}\}/);
});

test("the staged workflow triggers on v* tags and on dry-run dispatch", () => {
  assert.match(staged, /on:\n {2}push:\n {4}tags: \["v\*"\]/);
  assert.match(staged, /workflow_dispatch:/);
});
