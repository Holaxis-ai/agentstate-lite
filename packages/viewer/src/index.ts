/**
 * `@agentstate-lite/viewer` — public entry point.
 *
 * Library: {@link generateVisualization} renders an OKF bundle to a single
 * self-contained static HTML file (OKF mapping §d).
 *
 * CLI: `node dist/index.js <bundle-dir> [--out <path>] [--name <label>]`
 * emits the HTML and prints the output path. Kept dependency-free so the v0
 * scaffold runs without any install step.
 *
 * @packageDocumentation
 */
import { pathToFileURL } from "node:url";
import process from "node:process";
import { generateVisualization, type GenerateOptions } from "./generate.js";

export * from "./generate.js";

interface CliArgs {
  bundle?: string;
  options: GenerateOptions;
}

function parseArgs(argv: string[]): CliArgs {
  const options: GenerateOptions = {};
  let bundle: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--out") {
      options.out = argv[++i];
    } else if (arg === "--name") {
      options.name = argv[++i];
    } else if (!arg.startsWith("-") && bundle === undefined) {
      bundle = arg;
    }
  }
  return { bundle, options };
}

async function main(argv: string[]): Promise<void> {
  const { bundle, options } = parseArgs(argv);
  if (!bundle) {
    process.stderr.write("usage: viewer <bundle-dir> [--out <path>] [--name <label>]\n");
    process.exitCode = 2;
    return;
  }
  const result = await generateVisualization(bundle, options);
  process.stdout.write(
    "wrote " + result.out + " (" + result.nodeCount + " nodes, " + result.edgeCount + " edges)\n",
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).catch((err) => {
    process.stderr.write(String(err && (err as Error).message ? (err as Error).message : err) + "\n");
    process.exitCode = 1;
  });
}
