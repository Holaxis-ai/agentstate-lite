import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { FilesystemBackend } from "../src/backend.js";

test("FilesystemBackend expect-absent observation propagates read uncertainty", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agentstate-lite-expected-version-"));
  const target = path.join(root, "index.md");
  const originalReadFile = fs.readFile;
  try {
    await writeFile(target, "foreign bytes\n");
    Reflect.set(fs, "readFile", async (...args: unknown[]) => {
      if (path.resolve(String(args[0])) === path.resolve(target)) {
        throw Object.assign(new Error("injected version-observation fault"), { code: "EIO" });
      }
      return Reflect.apply(originalReadFile, fs, args);
    });
    await assert.rejects(
      () => new FilesystemBackend(root).writeReserved("", "index.md", "replacement\n", { expectedVersion: null }),
      (err: unknown) => (err as NodeJS.ErrnoException).code === "EIO",
    );
    Reflect.set(fs, "readFile", originalReadFile);
    assert.equal(await readFile(target, "utf8"), "foreign bytes\n");
  } finally {
    Reflect.set(fs, "readFile", originalReadFile);
    await rm(root, { recursive: true, force: true });
  }
});
