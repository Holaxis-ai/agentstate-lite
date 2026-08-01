import test from "node:test";
import assert from "node:assert/strict";
import { MemoryBackend, writeBlob, writeDoc } from "@agentstate-lite/core";
import { listViewCatalog, listViewCatalogPage, projectViewCatalog } from "../dist/index.js";

class CountingMemoryBackend extends MemoryBackend {
  blobReads = 0;

  async readBlob(key) {
    this.blobReads += 1;
    return super.readBlob(key);
  }
}

test("View catalog uses the shared registration grammar and deterministic id order", async () => {
  const backend = new CountingMemoryBackend();
  const bundle = { root: "mem://view-catalog", backend };
  await writeBlob(
    bundle,
    "views/shared.html",
    new TextEncoder().encode("<!doctype html><title>Shared</title>"),
    "text/html; charset=utf-8",
  );
  await writeDoc(bundle, {
    id: "views-registry/zeta",
    frontmatter: {
      type: "View",
      title: "Zeta",
      entry: "views/shared.html",
      access: "bundle-read",
      presentation: "inline",
    },
    body: "",
  });
  await writeDoc(bundle, {
    id: "views-registry/alpha",
    frontmatter: { type: "View", title: "Alpha", entry: "views/shared.html" },
    body: "",
  });
  await writeDoc(bundle, {
    id: "docs/not-a-registration",
    frontmatter: { type: "View", title: "Invalid", entry: "views/nope.html" },
    body: "",
  });
  await writeDoc(bundle, {
    id: "views-registry/dangling",
    frontmatter: { type: "View", title: "Dangling", entry: "views/missing.html" },
    body: "",
  });

  const catalog = await listViewCatalog(bundle);
  assert.deepEqual(catalog.entries.map((entry) => entry.id), [
    "views-registry/alpha",
    "views-registry/zeta",
  ]);
  assert.equal(catalog.entries[1].access, "bundle-read");
  assert.equal(catalog.entries[1].presentation, "inline");
  assert.equal(catalog.invalidRegistrations, 1);
  assert.equal(catalog.unavailableEntries, 1);
  assert.equal(catalog.total, 2);
  assert.equal(backend.blobReads, 2, "shared entry bytes are admitted once per catalog read");
});

test("unknown presentation is advisory and does not invalidate a View", async () => {
  const catalog = await projectViewCatalog([
    {
      id: "views-registry/a",
      version: "v1",
      frontmatter: {
        type: "View",
        title: "A",
        entry: "views/a.html",
        presentation: "phone-only",
      },
    },
  ], { admitEntry: async () => true });
  assert.equal(catalog.entries.length, 1);
  assert.equal(catalog.entries[0].presentation, undefined);
});

test("agent-facing View catalog pages bound admission work and advance past broken entries", async () => {
  const backend = new CountingMemoryBackend();
  const bundle = { root: "mem://bounded-view-catalog", backend };
  for (let index = 0; index < 41; index += 1) {
    const suffix = String(index).padStart(2, "0");
    await writeDoc(bundle, {
      id: `views-registry/broken-${suffix}`,
      frontmatter: {
        type: "View",
        title: `Broken ${suffix}`,
        entry: `views/missing-${suffix}.html`,
        access: "bundle-read",
      },
      body: "",
    });
  }
  await writeBlob(
    bundle,
    "views/working.html",
    new TextEncoder().encode("<!doctype html><title>Working</title>"),
    "text/html; charset=utf-8",
  );
  await writeDoc(bundle, {
    id: "views-registry/working",
    frontmatter: {
      type: "View",
      title: "Working",
      entry: "views/working.html",
      access: "bundle-read",
    },
    body: "",
  });

  const first = await listViewCatalogPage(bundle, {
    limit: 20,
    scanLimit: 40,
    access: ["bundle-read"],
  });
  assert.equal(first.registeredTotal, 42);
  assert.equal(first.entries.length, 0);
  assert.equal(first.examined, 40);
  assert.equal(first.pageUnavailableEntries, 40);
  assert.equal(first.truncated, true);
  assert.equal(first.nextAfterId, "views-registry/broken-39");
  assert.equal(backend.blobReads, 40);

  const second = await listViewCatalogPage(bundle, {
    afterId: first.nextAfterId,
    limit: 20,
    scanLimit: 40,
    access: ["bundle-read"],
  });
  assert.deepEqual(second.entries.map((entry) => entry.id), ["views-registry/working"]);
  assert.equal(second.examined, 2);
  assert.equal(second.pageUnavailableEntries, 1);
  assert.equal(second.truncated, false);
  assert.equal(backend.blobReads, 42);
});
