#!/usr/bin/env node
// `axi` CLI entry point.
// Thin bin wrapper: delegate to the dispatcher (./cli.ts), which wires axi-sdk-js's runAxiCli. The
// throw->exit mapping lives in cli.ts's `formatError`; runAxiCli sets `process.exitCode` (never
// `process.exit`), so the full 0/1/2/4/5/6 taxonomy survives and the process drains naturally. argv
// is passed explicitly so tests can inject it.
import { fileURLToPath } from "node:url";
import { main } from "./cli.js";
import { registerExecutableEntry } from "./invocation.js";
import { runUpdateRefreshWorker } from "./update-orientation.js";

registerExecutableEntry(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
if (argv[0] === "__update-refresh-v1") {
  // Private process route: malformed argv is intentionally silent zero-work. It is absent from
  // public command registries/help and is reachable only through the exact registered entry.
  if (argv.length === 2) await runUpdateRefreshWorker(argv[1]!);
} else {
  await main(argv);
}
