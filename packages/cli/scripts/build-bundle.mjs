// Shared esbuild config for the self-contained CLI bundle — the ONE bundler config, reused by
// both `build.mjs` (writes the real npm dist/ bundle, then mirrors it into the skill's
// scripts/) and `check-skill-bundle.mjs` (rebuilds to a scratch temp file for a byte-compare
// drift gate). Keeping this in one place means the two bundle-producing call sites can never
// drift from each other.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// packages/cli/scripts -> packages/cli
const pkgRoot = resolve(here, "..");
const r = (p) => resolve(pkgRoot, p);

/**
 * Bundle src/index.ts (+ the workspace source packages + every npm dep) into ONE self-contained
 * ESM file at `outfile`. Does NOT chmod the result — callers decide whether the output needs +x
 * (the committed bundles do; a scratch drift-gate temp file does not).
 */
export async function buildCliBundle(outfile) {
  await build({
    entryPoints: [r("src/index.ts")],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    // Resolve the workspace deps to their TypeScript source so no dist pre-build is needed.
    // viewer is aliased to its LIBRARY module (generate.ts), NOT its index.ts — the latter carries
    // an `import.meta.url === process.argv[1]` CLI self-exec guard that would fire once bundled
    // (the bundle's own module URL === argv[1]) and leak the viewer's usage line. generate.ts is
    // the full library surface the CLI uses (index.ts only re-exports it and adds the standalone
    // CLI).
    alias: {
      "@agentstate-lite/core": r("../core/src/index.ts"),
      "@agentstate-lite/viewer": r("../viewer/src/generate.ts"),
      // server/src/index.ts is guard-free re-exports (createRouter + serve) — its only deps are
      // core + node:http, so aliasing straight to it (unlike viewer, which needs the generate.ts
      // detour to dodge a CLI self-exec guard) keeps the esbuild bundle ONE self-contained file.
      "@agentstate-lite/server": r("../server/src/index.ts"),
    },
    // NOTE: esbuild hoists the entry file's own `#!/usr/bin/env node` shebang (src/index.ts) to
    // the top of the output, so the banner must NOT repeat it (two shebangs = a syntax error).
    banner: {
      js: [
        // gray-matter (bundled, CJS) can call require() at runtime; ESM has none, so supply one.
        "import { createRequire as ___createRequire } from 'node:module';",
        "const require = ___createRequire(import.meta.url);",
      ].join("\n"),
    },
    logLevel: "info",
  });
}
