// Drift gate for the committed SKILL bundle (plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs).
//
// Rebuilds the CLI with the SAME esbuild config used by build.mjs (scripts/build-bundle.mjs — one
// bundler config, no duplication) into a scratch temp file, then byte-compares it against the
// committed skill bundle. Exits 1 on any mismatch (missing committed file, or bytes differ) so CI
// (root `npm run check`) catches a source edit that was never rebuilt.
//
//   node scripts/check-skill-bundle.mjs
//
// GUARD NOTE — version-literal normalization: this repo's build is verified deterministic and
// embeds NO version / `git describe` / build-timestamp literal (confirmed: two builds from the
// same source are byte-identical), so a straight byte compare is correct today. If version
// stamping is ever added to the bundle (see the axi-skills "gotcha #4" precedent), this gate MUST
// gain a normalization step — strip/replace the stamped literal on both sides before comparing —
// or it will fail on every commit. Until then, normalization is a deliberate no-op.
import { readFile, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCliBundle } from "./build-bundle.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// packages/cli/scripts -> repo root -> plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs
const committedPath = resolve(here, "../../../plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs");

const scratchDir = await mkdtemp(join(tmpdir(), "aslite-skill-bundle-"));
const scratchFile = join(scratchDir, "agentstate-lite.mjs");

try {
  await buildCliBundle(scratchFile);

  const fresh = await readFile(scratchFile);
  let existing;
  try {
    existing = await readFile(committedPath);
  } catch {
    console.error(`committed skill bundle is missing: ${committedPath}`);
    console.error("Run `npm run build -w agentstate-lite` to create it.");
    process.exit(1);
  }

  if (!fresh.equals(existing)) {
    console.error(`skill bundle is stale: ${committedPath}`);
    console.error("does not byte-match a fresh build of src/. Run `npm run build -w agentstate-lite`");
    console.error("and commit the result.");
    process.exit(1);
  }

  console.log(`skill bundle is up to date: ${committedPath}`);
} finally {
  await rm(scratchDir, { recursive: true, force: true });
}
