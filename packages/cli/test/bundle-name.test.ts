/**
 * `bundle-name.ts` — THE bundle display-name derivation (tasks/bundle-display-name).
 *
 * Pins the chain ORDER (explicit doc beats parent-of-conventional-dir beats root basename), the
 * two-projects field-report scenario (two bundles both rooted at `.agentstate-lite/` under
 * different parents get DIFFERENT names), the plain `doc write --title` set path, and the total
 * degrade property: an absent, malformed, or non-string-valued well-known doc — and a backend
 * whose `read` throws outright — all fall silently down the chain, never throwing and never
 * touching anything beyond the one known-id read.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeDoc, type Bundle, type StorageBackend } from "@agentstate-lite/core";
import { deriveBundleDisplayName, BUNDLE_NAME_DOC_ID } from "../src/bundle-name.js";
import { CONVENTIONAL_BUNDLE_DIR_NAME } from "../src/bundle.js";

async function makeTmp(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-bundle-name-"));
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/** A conventional project bundle: `<tmp>/<project>/.agentstate-lite/` with an `index.md`. */
async function makeConventionalBundle(tmp: string, project: string): Promise<string> {
  const root = path.join(tmp, project, CONVENTIONAL_BUNDLE_DIR_NAME);
  await mkdir(root, { recursive: true });
  await initBundle(root);
  return root;
}

test("chain rung (b): a conventional-dir root displays as its PARENT — two projects get DIFFERENT names", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const rootA = await makeConventionalBundle(dir, "project-a");
    const rootB = await makeConventionalBundle(dir, "project-b");
    const nameA = await deriveBundleDisplayName({ root: rootA });
    const nameB = await deriveBundleDisplayName({ root: rootB });
    assert.equal(nameA, "project-a");
    assert.equal(nameB, "project-b");
    assert.notEqual(nameA, nameB); // the field report's exact failure: both used to be ".agentstate-lite"
  } finally {
    await cleanup();
  }
});

test("chain rung (c): a standalone (non-conventional) bundle keeps its root basename", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = path.join(dir, "my-standalone-bundle");
    await mkdir(root, { recursive: true });
    await initBundle(root);
    assert.equal(await deriveBundleDisplayName({ root }), "my-standalone-bundle");
  } finally {
    await cleanup();
  }
});

test("chain rung (a): an explicit `name` field on the well-known doc beats the parent name", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = await makeConventionalBundle(dir, "project-a");
    await writeDoc(
      { root },
      { id: BUNDLE_NAME_DOC_ID, frontmatter: { type: "Doc", name: "Holaxis CE", title: "About this workspace" }, body: "" },
    );
    assert.equal(await deriveBundleDisplayName({ root }), "Holaxis CE");
  } finally {
    await cleanup();
  }
});

test("chain rung (a): `title` is the plain-CLI-settable carrier — used when no `name` field exists", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = await makeConventionalBundle(dir, "project-a");
    // The exact shape `doc write docs/bundle --type Doc --title <name>` persists.
    await writeDoc({ root }, { id: BUNDLE_NAME_DOC_ID, frontmatter: { type: "Doc", title: "holaxis-ce" }, body: "" });
    assert.equal(await deriveBundleDisplayName({ root }), "holaxis-ce");
  } finally {
    await cleanup();
  }
});

test("chain order pinned end to end: explicit beats parent beats basename", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = await makeConventionalBundle(dir, "parent-name");
    // basename rung would say ".agentstate-lite"; parent rung says "parent-name"…
    assert.equal(await deriveBundleDisplayName({ root }), "parent-name");
    // …and the explicit doc beats both.
    await writeDoc({ root }, { id: BUNDLE_NAME_DOC_ID, frontmatter: { type: "Doc", name: "explicit-name" }, body: "" });
    assert.equal(await deriveBundleDisplayName({ root }), "explicit-name");
  } finally {
    await cleanup();
  }
});

test("degrade: whitespace-only and non-string name/title values fall through to the path chain", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = await makeConventionalBundle(dir, "project-a");
    await writeDoc({ root }, { id: BUNDLE_NAME_DOC_ID, frontmatter: { type: "Doc", name: "   ", title: 42 }, body: "" });
    assert.equal(await deriveBundleDisplayName({ root }), "project-a");
  } finally {
    await cleanup();
  }
});

test("degrade: a MALFORMED well-known doc (no frontmatter) never throws — falls to the parent name", async () => {
  const { dir, cleanup } = await makeTmp();
  try {
    const root = await makeConventionalBundle(dir, "project-a");
    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(root, "docs", "bundle.md"), "no frontmatter here at all\n", "utf8");
    assert.equal(await deriveBundleDisplayName({ root }), "project-a");
  } finally {
    await cleanup();
  }
});

test("no-throw / no-I/O-beyond-the-one-read property: a backend whose read throws still resolves, with ONLY the known id ever requested", async () => {
  const reads: string[] = [];
  const backend = {
    read: (id: string) => {
      reads.push(id);
      return Promise.reject(new Error("backend down"));
    },
  } as unknown as StorageBackend;
  const bundle: Bundle = { root: `/somewhere/proj/${CONVENTIONAL_BUNDLE_DIR_NAME}`, backend };
  assert.equal(await deriveBundleDisplayName(bundle), "proj");
  assert.deepEqual(reads, [BUNDLE_NAME_DOC_ID]); // exactly one read, of exactly the well-known id
});

test("edge: a conventional dir directly under the filesystem root falls back to the basename; an empty basename falls back to 'bundle'", async () => {
  const throwing = { read: () => Promise.reject(new Error("absent")) } as unknown as StorageBackend;
  assert.equal(
    await deriveBundleDisplayName({ root: `${path.sep}${CONVENTIONAL_BUNDLE_DIR_NAME}`, backend: throwing }),
    CONVENTIONAL_BUNDLE_DIR_NAME,
  );
  assert.equal(await deriveBundleDisplayName({ root: path.sep, backend: throwing }), "bundle");
});
