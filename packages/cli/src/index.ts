#!/usr/bin/env node
// `axi` CLI entry point.
// Thin bin wrapper: delegate to the dispatcher (./cli.ts), which wires axi-sdk-js's runAxiCli. The
// throw->exit mapping lives in cli.ts's `formatError`; runAxiCli sets `process.exitCode` (never
// `process.exit`), so the full 0/1/2/4/5/6 taxonomy survives and the process drains naturally. argv
// is passed explicitly so tests can inject it.
import { main } from "./cli.js";

await main(process.argv.slice(2));
