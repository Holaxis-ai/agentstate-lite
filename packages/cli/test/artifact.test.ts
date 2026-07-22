// `artifact create` pins (designs/artifact-runtime Unit 1): one command owns derive-id → promote →
// record; collision-safe ids; --supersedes flips the prior + writes the supersedes link; works with
// NO Artifact convention declared (product kind, convention-independent).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle } from "@agentstate-lite/core";

import { artifact, slugifyTitle, firstFreeId } from "../src/commands/artifact.js";

async function makeBundle(): Promise<{ dir: string; html: string; cleanup: () => Promise<void> }> {
  const top = await mkdtemp(path.join(tmpdir(), "aslite-artifact-"));
  const dir = path.join(top, "b");
  await initBundle(dir); // seeds context-notes only — deliberately NO Artifact convention
  const html = path.join(top, "report.html");
  await writeFile(html, "<!doctype html><h1>hi</h1>");
  return { dir, html, cleanup: () => rm(top, { recursive: true, force: true }) };
}

async function runJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await artifact([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

test("slugifyTitle: lowercase, hyphen-joined, bounded, never empty", () => {
  assert.equal(slugifyTitle("Q3 Analysis!"), "q3-analysis");
  assert.equal(slugifyTitle("  Weird__Title -- v2  "), "weird-title-v2");
  assert.equal(slugifyTitle("!!!"), "artifact"); // no alnum → fallback
  assert.equal(slugifyTitle("x".repeat(200)).length, 60);
});

test("firstFreeId: base, then -2, -3 against taken ids", () => {
  assert.equal(firstFreeId("report", new Set()), "artifacts/report");
  assert.equal(firstFreeId("report", new Set(["artifacts/report"])), "artifacts/report-2");
  assert.equal(firstFreeId("report", new Set(["artifacts/report", "artifacts/report-2"])), "artifacts/report-3");
});

test("create: one command promotes the blob + writes the record (no Artifact convention needed)", async () => {
  const { dir, html, cleanup } = await makeBundle();
  try {
    const receipt = await runJson(["create", html, "--title", "Q3 Analysis!", "--dir", dir, "--actor", "tester"]);
    assert.equal(receipt.artifact, "created");
    assert.equal(receipt.id, "artifacts/q3-analysis"); // slug from title
    assert.equal(receipt.entry, "artifacts/q3-analysis.html");
    assert.equal(receipt.status, "active");
    assert.match(String(receipt.entry_version), /^sha256:/);
    assert.equal(receipt.open, "?view=artifact&id=artifacts%2Fq3-analysis");

    // Both the record and the blob exist on disk under artifacts/.
    assert.ok(existsSync(path.join(dir, "artifacts", "q3-analysis.md")), "record written");
    assert.ok(existsSync(path.join(dir, "artifacts", "q3-analysis.html")), "blob written");
    const record = await readFile(path.join(dir, "artifacts", "q3-analysis.md"), "utf8");
    assert.match(record, /type: Artifact/);
    assert.match(record, /status: active/);
    assert.match(record, /entry: artifacts\/q3-analysis\.html/);
    assert.match(record, /entry_version:/);
  } finally {
    await cleanup();
  }
});

test("create: a second same-title artifact gets a collision-safe id", async () => {
  const { dir, html, cleanup } = await makeBundle();
  try {
    const first = await runJson(["create", html, "--title", "Report", "--dir", dir, "--actor", "t"]);
    const second = await runJson(["create", html, "--title", "Report", "--dir", dir, "--actor", "t"]);
    assert.equal(first.id, "artifacts/report");
    assert.equal(second.id, "artifacts/report-2");
  } finally {
    await cleanup();
  }
});

test("create --supersedes: flips the prior to superseded and links this one 'supersedes' it", async () => {
  const { dir, html, cleanup } = await makeBundle();
  try {
    await runJson(["create", html, "--title", "Report", "--dir", dir, "--actor", "t"]);
    const v2 = await runJson(["create", html, "--title", "Report v2", "--supersedes", "artifacts/report", "--dir", dir, "--actor", "t"]);
    assert.equal(v2.id, "artifacts/report-v2");
    assert.equal(v2.supersedes, "artifacts/report");

    const prior = await readFile(path.join(dir, "artifacts", "report.md"), "utf8");
    assert.match(prior, /status: superseded/);
    const nu = await readFile(path.join(dir, "artifacts", "report-v2.md"), "utf8");
    // The supersedes edge is a same-directory relative body link carrying the declared verb.
    assert.match(nu, /\[supersedes\]\(report\.md\)/);
  } finally {
    await cleanup();
  }
});

test("create: --title is required; a missing file is a USAGE error; neither leaves a partial write", async () => {
  const { dir, html, cleanup } = await makeBundle();
  try {
    await assert.rejects(runJson(["create", html, "--dir", dir, "--actor", "t"]), /requires --title/);
    await assert.rejects(runJson(["create", path.join(dir, "nope.html"), "--title", "X", "--dir", dir, "--actor", "t"]), /no such file/);
    assert.ok(!existsSync(path.join(dir, "artifacts")), "no artifacts/ dir created on a rejected call");
  } finally {
    await cleanup();
  }
});
