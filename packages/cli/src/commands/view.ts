// `agentstate-lite view [--dir <path>] [--out <path>] [--name <label>]` — bake the bundle into one static HTML file.
//
// Delegates to `@agentstate-lite/viewer` `generateVisualization(bundleDir, { out?, name? })`, which
// walks the bundle, reduces it to a graph payload, and writes ONE self-contained HTML file (inline
// CSS/JS, bundle embedded as JSON — an interactive Cytoscape link graph + rendered body panel +
// derived "Cited by" backlinks). No backend; nothing leaves the page. Defaults the output to
// `<root>/viz.html`.
import { parseArgs } from "node:util";
import { generateVisualization } from "@agentstate-lite/viewer";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";

export const VIEW_USAGE = `agentstate-lite view — bake the bundle into one self-contained static HTML file

Usage:
  agentstate-lite view [--dir <path>] [--out <path>] [--name <label>]

Options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set).
                       --out then defaults to ./viz.html in the current directory — viz.html is
                       always written LOCALLY.
  --out <path>         Output HTML path (default: <root>/viz.html, or ./viz.html for --remote)
  --name <label>       Display label shown in the viewer header
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;

export interface ViewCliDeps {
  stdout: (s: string) => void;
}

export async function view(argv: string[], deps: Partial<ViewCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          remote: { type: "string" },
          out: { type: "string" },
          name: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "view",
  );
  if (values.help) {
    stdout(VIEW_USAGE);
    return;
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const options: { out?: string; name?: string } = {};
  if (values.out?.trim()) options.out = values.out.trim();
  if (values.name?.trim()) options.name = values.name.trim();

  // Local bundles keep the original string-root path (generateVisualization's own fs.stat
  // existence check applies); a --remote bundle has no filesystem root, so it goes through the
  // Bundle-object path instead (viz.html is still always written LOCALLY — see generate.ts).
  const result = await generateVisualization(bundle.backend ? bundle : bundle.root, options);

  stdout(
    render(
      {
        view: "ok",
        out: result.out,
        nodes: result.nodeCount,
        edges: result.edgeCount,
        // The bundle DATA is inlined (self-contained, nothing leaves the page), but the render
        // libraries (Cytoscape/marked/DOMPurify) load from a CDN — so an OFFLINE recipient sees a
        // blank shell. State it here rather than let a shared file surprise them (comprehensive UX
        // audit finding); inlining the libs for true offline use is a deliberate, ~460 KB-per-file
        // tradeoff, not the default.
        note: "viz.html inlines the bundle data but loads its render libraries (Cytoscape/marked/DOMPurify) from a CDN — it needs network access to draw the graph and render markdown. Share it with recipients who are online.",
        help: [`open ${result.out}`],
      },
      resolveMode(values),
    ),
  );
}
