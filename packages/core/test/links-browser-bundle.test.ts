/**
 * Browser-bundleability pin for the ONE link resolver (designs/doc-reader rev 2, HIGH-1): the
 * shell's doc reader runtime-imports `@agentstate-lite/core/links` into the BROWSER bundle, where
 * `node:*` builtins do not resolve. This bundles the BUILT module with esbuild `platform:
 * "browser"` and fails on any node builtin sneaking back in. Red-on-old: the pre-change
 * `import path from "node:path"` fails this exact probe with "Could not resolve".
 * (Requires a prior root build — the same sibling-dist convention other core tests document.)
 */
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));

test("links.js bundles for the browser with no node builtins", async () => {
  const result = await build({
    entryPoints: [path.resolve(here, "../dist/links.js")],
    bundle: true,
    platform: "browser",
    write: false,
    logLevel: "silent",
  });
  assert.equal(result.errors.length, 0, JSON.stringify(result.errors, null, 2));
  const output = result.outputFiles[0]!.text;
  assert.ok(output.includes("resolveConceptId"), "the bundled output carries the resolver");
});
