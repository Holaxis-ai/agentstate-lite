// Build the single, self-contained, publishable CLI bundle.
//
// esbuild bundles src/index.ts together with its two workspace source packages
// (@agentstate-lite/core, @agentstate-lite/viewer) and every npm dependency into ONE ESM file with a
// `#!/usr/bin/env node` shebang. The published `agentstate-lite` package therefore has NO runtime
// dependencies and NO unresolved `workspace:*` links — `npx -y agentstate-lite …` runs with zero
// workspace resolution.
//
// The two workspace deps are aliased to their SOURCE entry points so this build is self-contained:
// it does NOT require core/viewer to be pre-compiled to dist first (esbuild transpiles the .ts and
// resolves their NodeNext `.js`-extension imports to the sibling `.ts` files). That keeps
// `prepublishOnly` a single step.
//
// A createRequire shim is injected in the banner because a bundled CommonJS dependency (gray-matter)
// may call require() at runtime; ESM output has no ambient `require`, so we provide one.
//
// ADDITIVE mirror step: after producing the npm dist/ bundle, this ALSO copies the identical bytes
// into the self-contained skill's scripts/ (skills/agentstate-lite/scripts/agentstate-lite.mjs) —
// the second, install-free distribution channel (`npx skills add`). One esbuild config
// (scripts/build-bundle.mjs), no second bundler; the npm dist/ output is unaffected (files:
// ["dist"] in package.json never sees the skill directory).
import { rm, chmod, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { buildCliBundle } from "./scripts/build-bundle.mjs";
import { embedUiAssets } from "./scripts/embed-ui-assets.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(here, p);
const outfile = r("dist/agentstate-lite.mjs");
// packages/cli -> repo root -> skills/agentstate-lite/scripts/
const skillMjs = r("../../skills/agentstate-lite/scripts/agentstate-lite.mjs");
const skillShim = r("../../skills/agentstate-lite/scripts/agentstate-lite");

// Clean dist so the packed tarball never carries stale files (files: ["dist"]).
await rm(r("dist"), { recursive: true, force: true });

// FIRST: rebuild packages/ui fresh and embed its dist/ as generated source
// (src/generated/ui-assets.generated.ts) — the esbuild bundle below imports it transitively via
// src/ui/assets.ts. Runs identically whether invoked via the root build, `npm run build -w
// agentstate-lite`, or `prepublishOnly` (all three are just "run this file"), so packages/ui/dist
// can never be missing or stale by the time esbuild runs (see embed-ui-assets.mjs's module doc).
await embedUiAssets();

await buildCliBundle(outfile);

// The bin must be directly executable via its shebang (npm sets +x on install, but keep it correct
// in the tarball and for direct `./dist/agentstate-lite.mjs` runs).
await chmod(outfile, 0o755);
console.log(`built ${outfile}`);

// Mirror the exact built bytes into the skill's scripts/ and keep both the bundle and its shim
// executable — `Write`/`copyFile` do not set +x, and the skill's committed bundle must be
// directly runnable the moment it's checked out (no npm install step in that channel).
await mkdir(dirname(skillMjs), { recursive: true });
await copyFile(outfile, skillMjs);
await chmod(skillMjs, 0o755);
await chmod(skillShim, 0o755);
console.log(`copied skill bundle -> ${skillMjs}`);
