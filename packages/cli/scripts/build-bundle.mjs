// Shared esbuild config for the self-contained CLI bundle — the ONE bundler config, reused by
// its three consumers: `build.mjs` (the default dev/npm build, writing ONLY dist/ — never the
// committed plugin path), `build-plugin-bundle.mjs` (the ONE writer of the committed skill
// bundle, used by the CI bot and the manual `npm run build:plugin-bundle`), and
// `check-skill-bundle.mjs` (rebuilds to a scratch temp file for a byte-compare drift gate).
// Keeping this in one place means the bundle-producing call sites can never drift from each
// other.
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// packages/cli/scripts -> packages/cli
const pkgRoot = resolve(here, "..");
const r = (p) => resolve(pkgRoot, p);

// The published package version, BAKED into the bundle as `__ASLITE_VERSION__`. This is the only
// source that works in EVERY channel: the npm dist could read its adjacent package.json, but the
// plugin bundle ships as a lone `scripts/agentstate-lite.mjs` with no package.json at `../`. Baking
// it at build time makes `--version` report the same product version everywhere.
const version = JSON.parse(readFileSync(r("package.json"), "utf8")).version;

/**
 * Bundle src/index.ts (+ the workspace source packages + every npm dep) into ONE self-contained
 * ESM file at `outfile`. Does NOT chmod the result — callers decide whether the output needs +x
 * (the committed bundles do; a scratch drift-gate temp file does not).
 */
export async function buildCliBundle(outfile) {
  await build({
    // Pin esbuild's working directory — it otherwise defaults to `process.cwd()` and embeds
    // paths relative to it in the CJS-interop module comments/keys (e.g. `node_modules/foo/…`
    // vs `../../node_modules/foo/…`), making the OUTPUT BYTES depend on the CALLER's cwd. Every
    // existing call site happened to run with cwd == this package (`npm run build -w @holaxis/aslite`,
    // `-w @holaxis/aslite` script invocations), so this went unnoticed until a
    // caller running from the repo root (scripts/ci-version-bundle.mjs) hit a false "changed"
    // diff on an otherwise-identical rebuild.
    absWorkingDir: pkgRoot,
    entryPoints: [r("src/index.ts")],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    // Compile-time constant read by cli.ts's cliVersion() — channel-independent (see `version` above).
    define: { __ASLITE_VERSION__: JSON.stringify(version) },
    // Resolve the workspace deps to their TypeScript source so no dist pre-build is needed.
    alias: {
      // List browser-safe core subpaths before the package root so esbuild does not append the
      // subpath to `index.ts` (which would resolve as the impossible `index.ts/page`).
      "@agentstate-lite/core/page": r("../core/src/page.ts"),
      "@agentstate-lite/core": r("../core/src/index.ts"),
      // The git tier lives in its own workspace package (board-git A1); alias to source so the
      // npm artifact stays ONE self-contained file with no dist pre-build.
      "@agentstate-lite/board-git": r("../board-git/src/index.ts"),
      // server/src/index.ts is guard-free re-exports (createRouter + serve) — its only deps are
      // core + node:http, so aliasing straight to it keeps the esbuild bundle ONE self-contained file.
      "@agentstate-lite/server": r("../server/src/index.ts"),
      // The loopback UI runtime is a private workspace package; source-alias it so the npm CLI
      // remains one self-contained artifact with no workspace dependency at install time.
      "@agentstate-lite/ui-server": r("../ui-server/src/index.ts"),
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
