/**
 * `@agentstate-lite/viewer` — generate a single self-contained static HTML
 * visualizer for an OKF Knowledge Bundle (OKF mapping §d).
 *
 * Equivalent to the reference `generate_visualization(bundle_root, out_path)`:
 * walk the bundle, reduce it to a graph payload, and string-substitute that
 * payload plus the inlined CSS/JS into the HTML skeleton. The output is one
 * portable file — shareable, hostable, and versionable with no backend.
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import type { Bundle } from "@agentstate-lite/core";
import { buildBundleData, type BundleData } from "./bundle.js";
import { renderTemplate } from "./template.js";

export type { BundleData, BundleNode, BundleEdge } from "./bundle.js";
export { buildBundleData } from "./bundle.js";
export { renderTemplate } from "./template.js";

/** Options for {@link generateVisualization}. */
export interface GenerateOptions {
  /** Output path for the HTML file. Defaults to `<bundleDir>/viz.html`. */
  out?: string;
  /** Display label shown in the viewer header. Defaults to the bundle dir name. */
  name?: string;
}

/** The result of a visualizer generation. */
export interface GenerateResult {
  /** Absolute path of the written HTML file. */
  out: string;
  /** Number of concept nodes embedded. */
  nodeCount: number;
  /** Number of resolved edges embedded. */
  edgeCount: number;
}

/**
 * Render a bundle to a single self-contained HTML visualizer and write it to `options.out` via
 * temp-file + rename. ONE HTML-writing path regardless of source (gate 3: one viewer engine).
 *
 * `bundleSource` is either a bundle-root directory path (the original, common case — `fs.stat`'d
 * for existence, `options.out` defaults to `<bundleDir>/viz.html`) OR an opened {@link Bundle}
 * handle (mirrors `buildBundleData`'s own `string | Bundle` acceptance) for a non-filesystem
 * store, e.g. a `--remote` bundle: there is no directory to `fs.stat` or default `--out` into, so
 * `options.out` instead falls back to `./viz.html` in the CURRENT working directory, and the
 * display name falls back to `buildBundleData`'s own `baseName(bundle.root)` (URL-derived for a
 * remote bundle, since its `root` is the server URL). The HTML file itself is always written
 * LOCALLY either way — only where the graph DATA comes from differs.
 *
 * @returns The output path plus node/edge counts.
 */
export async function generateVisualization(
  bundleSource: string | Bundle,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  let data: BundleData;
  let defaultOutDir: string;

  if (typeof bundleSource === "string") {
    const root = path.resolve(bundleSource);
    const stat = await fs.stat(root).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      throw new Error("bundle directory not found: " + root);
    }
    data = await buildBundleData(root, options.name);
    defaultOutDir = root;
  } else {
    data = await buildBundleData(bundleSource, options.name);
    defaultOutDir = process.cwd();
  }

  const html = renderTemplate(data);

  const out = path.resolve(options.out ?? path.join(defaultOutDir, "viz.html"));
  await fs.mkdir(path.dirname(out), { recursive: true });
  const tmp = out + ".tmp-" + process.pid;
  await fs.writeFile(tmp, html, "utf8");
  await fs.rename(tmp, out);

  return { out, nodeCount: data.nodes.length, edgeCount: data.edges.length };
}
