// Build the single, self-contained, publishable CLI bundle.
//
// esbuild bundles src/index.ts together with its workspace source packages
// (@agentstate-lite/core, @agentstate-lite/server, @agentstate-lite/ui-server,
// @agentstate-lite/mcp-app) and every npm dependency into ONE ESM file with a
// `#!/usr/bin/env node` shebang. The published `@holaxis/aslite` package therefore has NO runtime
// dependencies and NO unresolved `workspace:*` links — `npx -y @holaxis/aslite …` runs with zero
// workspace resolution.
//
// The workspace deps are aliased to their SOURCE entry points so this build is self-contained:
// it does NOT require core/server to be pre-compiled to dist first (esbuild transpiles the .ts and
// resolves their NodeNext `.js`-extension imports to the sibling `.ts` files). That keeps
// `prepublishOnly` a single step.
//
// A createRequire shim is injected in the banner because a bundled CommonJS dependency (gray-matter)
// may call require() at runtime; ESM output has no ambient `require`, so we provide one.
//
// This DEV/NPM build writes ONLY dist/ (plus the gitignored generated UI-assets module). It must
// NEVER touch the COMMITTED plugin bundle (plugins/agentstate-lite/skills/agentstate-lite/scripts/
// agentstate-lite.mjs) — that artifact is bot-owned on merge to main, and a default build dirtying
// it made every subsequent `git pull` collide. The one writer of the committed path is
// scripts/build-plugin-bundle.mjs (invoked by CI's scripts/ci-version-bundle.mjs and the manual
// `npm run build:plugin-bundle`); a regression test pins this (scripts/dev-build-no-plugin-writes.test.mjs).
import { rm, chmod } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { buildCliBundle } from "./scripts/build-bundle.mjs";
import { prepareCliBundleInputs } from "./scripts/prepare-bundle-inputs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(here, p);
const outfile = r("dist/agentstate-lite.mjs");

// Clean dist so the packed tarball never carries stale files (files: ["dist"]).
await rm(r("dist"), { recursive: true, force: true });

// FIRST: generate every embedded input (the local UI assets and fixed MCP App shell) through the
// same preparation helper used by the committed-plugin writer and drift checker. The esbuild
// bundle below imports those generated modules transitively, so none may be missing or stale.
await prepareCliBundleInputs();

await buildCliBundle(outfile);

// The bin must be directly executable via its shebang (npm sets +x on install, but keep it correct
// in the tarball and for direct `./dist/agentstate-lite.mjs` runs).
await chmod(outfile, 0o755);
console.log(`built ${outfile}`);
