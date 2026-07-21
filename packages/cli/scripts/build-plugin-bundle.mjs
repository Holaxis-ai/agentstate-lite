// The ONLY writer of the COMMITTED plugin bundle
// (plugins/agentstate-lite/skills/agentstate-lite/scripts/agentstate-lite.mjs).
//
// That artifact is BOT-OWNED on merge to main (scripts/ci-version-bundle.mjs regenerates it and
// bumps the plugin version if it changed — see CLAUDE.md's Working-here section). The default dev
// build (build.mjs) deliberately does NOT write it: a local `npm run build` dirtying a bot-owned
// committed file made every subsequent `git pull` abort with would-be-overwritten. Keeping the
// committed-path write in exactly one place — this module — is what makes that guarantee
// enforceable (regression pin: scripts/dev-build-no-plugin-writes.test.mjs at the repo root).
//
// Same esbuild config as the dev build (scripts/build-bundle.mjs — one bundler config, no second
// bundler) and the same fresh UI-embed step, so the bytes here are exactly what a dev build's
// dist/ would contain. Callers:
//   - scripts/ci-version-bundle.mjs (the CI bot, on push to main)
//   - `npm run build:plugin-bundle` (manual regeneration, repo root or -w aslite)
import { chmod } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCliBundle } from "./build-bundle.mjs";
import { embedUiAssets } from "./embed-ui-assets.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// packages/cli/scripts -> repo root -> plugins/.../skills/agentstate-lite/scripts/
const skillScriptsDir = resolve(here, "../../../plugins/agentstate-lite/skills/agentstate-lite/scripts");

/** Absolute path of the committed plugin bundle — exported so tests can pin that every consumer (CI diffing, this writer) agrees on ONE path. */
export const COMMITTED_BUNDLE_PATH = resolve(skillScriptsDir, "agentstate-lite.mjs");
const committedShimPath = resolve(skillScriptsDir, "agentstate-lite");

/** Rebuild the committed plugin bundle in place and keep it (and its bash shim) executable — the skill channel has no npm-install step, so the checked-out files must be directly runnable. */
export async function buildPluginBundle() {
  embedUiAssets();
  await buildCliBundle(COMMITTED_BUNDLE_PATH);
  await chmod(COMMITTED_BUNDLE_PATH, 0o755);
  await chmod(committedShimPath, 0o755);
  console.log(`built committed plugin bundle -> ${COMMITTED_BUNDLE_PATH}`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  await buildPluginBundle();
}
