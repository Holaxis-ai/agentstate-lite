// `agentstate-lite serve [--dir <path>] [--host <h>] [--port <p>]` — boot the reference
// wire-protocol server (`@agentstate-lite/server`) over a local bundle.
//
// This is the CLI's half of Stage 1 Unit 3: with `serve` running, `--remote <url>` on every
// other bundle command (note/doc/list/link/view) talks to it over `docs/WIRE-PROTOCOL.md` v0 —
// the complete remote loop (CLI -> HTTP -> engine) on one machine, zero cloud infra.
//
// AXI shape for a long-running command: the TOON receipt (bound `url`, bundle `root`, and a
// `help:` hint showing how a client connects) prints FIRST, then the command stays in the
// foreground until SIGINT/SIGTERM close the listener cleanly (exit 0) — no request logs to
// stdout by default. `bootServer`/`waitForShutdown` are injectable so this is unit-testable
// without relying on real OS signals or leaving a listener running past a test.
//
// HONEST CAVEAT (say it in the receipt, not just the docs): no auth in v0 — the `Authorization`
// header slot is reserved but unenforced (see `docs/WIRE-PROTOCOL.md`); binding `127.0.0.1` by
// default is the stated mitigation (a process on the same machine can reach it, the network
// cannot).
//
// SECOND HONEST CAVEAT: `serve` only ever boots over a FILESYSTEM bundle (the sole thing
// `openBundle` without `--remote` can produce). `FilesystemBackend`'s compare-and-swap is now
// serialized (atomic) for concurrent writers WITHIN this one `serve` process (a process-wide
// per-path mutex in `core/src/backend.ts`), so multiple `--remote` clients hitting the SAME doc
// through THIS server converge losslessly — the served multi-writer case STATUS.md used to flag
// is closed. What remains best-effort is CROSS-PROCESS: two separate `serve` instances (or `serve`
// plus a direct local CLI write) over the SAME directory can still each see `changed:true` while
// only one write survives, because POSIX has no atomic conditional rename across processes. Said
// out loud in both the usage text and the receipt, matching the auth caveat's say-it-out-loud norm.
import { parseArgs } from "node:util";
import { serve as bootServerDefault, type ServeOptions, type ServerHandle } from "@agentstate-lite/server";
import { openBundle } from "../bundle.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const SERVE_USAGE = `agentstate-lite serve — boot the reference wire-protocol server over a local bundle

Usage:
  agentstate-lite serve [--dir <path>] [--host <h>] [--port <p>]

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --host <h>            Host to bind (default: 127.0.0.1 — loopback-only; NO AUTH in v0)
  --port <p>            Port to bind (default: 4818; use 0 for an ephemeral port)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help

Connect a client once this is running:
  agentstate-lite list --remote http://127.0.0.1:<port>

Caveat: concurrent writes to the SAME doc from multiple clients hitting THIS server converge
losslessly (FilesystemBackend serializes same-process writes per doc); a SECOND server (or a
direct local CLI write) over the SAME directory is still best-effort — see STATUS.md.
`;

/**
 * The CLI's own stable default port. `@agentstate-lite/server`'s `ServeOptions.port` itself
 * defaults to `0` (ephemeral) — the CLI documents and passes its own fixed default explicitly
 * so `agentstate-lite serve` is predictable across runs; pass `--port 0` for an ephemeral port.
 */
export const DEFAULT_SERVE_PORT = 4818;

/** Injectable seam so boot + shutdown wiring is unit-testable without real sockets/signals. */
export interface ServeCliDeps {
  stdout: (s: string) => void;
  /** Boots the wire-protocol server; defaults to the real `@agentstate-lite/server` `serve`. */
  bootServer: (options: ServeOptions) => Promise<ServerHandle>;
  /** Resolves when the foreground process should stop and close the listener. Defaults to a
   *  SIGINT/SIGTERM listener; tests inject an immediately-resolving promise. */
  waitForShutdown: () => Promise<void>;
}

function defaultWaitForShutdown(): Promise<void> {
  return new Promise((resolve) => {
    process.once("SIGINT", () => resolve());
    process.once("SIGTERM", () => resolve());
  });
}

export async function serve(argv: string[], deps: Partial<ServeCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const bootServer = deps.bootServer ?? bootServerDefault;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown;

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          host: { type: "string" },
          port: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "serve",
  );
  if (values.help) {
    stdout(SERVE_USAGE);
    return;
  }

  let port = DEFAULT_SERVE_PORT;
  if (values.port !== undefined) {
    const raw = values.port.trim();
    if (!/^\d+$/.test(raw) || Number(raw) > 65535) {
      throw new CliError("USAGE", "--port must be an integer between 0 and 65535", {
        help: `${cliInvocation()} serve --port <p>`,
      });
    }
    port = Number(raw);
  }
  const host = values.host?.trim() || "127.0.0.1";

  const bundle = await openBundle(values.dir);
  let handle: ServerHandle;
  try {
    handle = await bootServer({ bundle, host, port });
  } catch (err) {
    throw mapBootError(err, port);
  }
  const url = `http://${handle.host}:${handle.port}`;

  stdout(
    render(
      {
        serve: "listening",
        url,
        root: bundle.root,
        auth: "none (v0 reference server; loopback-only default — see docs/WIRE-PROTOCOL.md)",
        concurrency:
          "lossless for concurrent writers hitting THIS server (same-process, per-doc serialized); still best-effort across a SECOND serve process or a direct local write to the same directory (see STATUS.md)",
        help: [`${cliInvocation()} list --remote ${url}`],
      },
      resolveMode(values),
    ),
  );

  // Stay in the foreground; SIGINT/SIGTERM (or the injected waitForShutdown) close the
  // listener cleanly and this resolves — exit 0. No request logs to stdout by default.
  await waitForShutdown();
  await handle.close();
}

/**
 * Map a raw `listen()` failure from `bootServer` to a structured CliError with a fixing `help`
 * hint, instead of letting a bare Node error (e.g. EADDRINUSE when two agents contend for the
 * same default port) surface without an envelope or a next step.
 */
function mapBootError(err: unknown, port: number): CliError {
  if (err instanceof CliError) return err;
  if ((err as NodeJS.ErrnoException)?.code === "EADDRINUSE") {
    return new CliError("RUNTIME", `port ${port} is already in use — something else is listening there`, {
      help: `${cliInvocation()} serve --port 0 (ephemeral port), or pass a different --port`,
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message);
}
