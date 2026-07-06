// `agentstate-lite ui [--dir <path> | --remote <url>] [--port <n>] [--open]` — boot the local
// web UI (plans/ui-v1.md rev 3.2): the SPA plus a same-origin `/v0/*` surface, either the
// reference router mounted in-process over a local bundle (`--dir`) or a reverse proxy onto a
// deployed remote (`--remote`) with conditional Bearer injection. The SPA never knows which.
//
// Source resolution follows the house ambient rules exactly like every other remote-capable
// command (`resolveRemoteFlag`: explicit `--remote` wins, else `AGENTSTATE_LITE_REMOTE` unless
// `--dir` was passed explicitly, else local bundle discovery) — EXCEPT `ui` builds its OWN
// remote handling (a reverse proxy, `packages/cli/src/ui/proxy.ts`) rather than routing through
// `openBundle`'s `RemoteBackend` path, since the SPA needs the raw `/v0/*` wire surface
// same-origin, not the engine-level `StorageBackend` abstraction.
//
// AXI shape mirrors `serve.ts`: the TOON receipt (the resolved, TOKENIZED url — carries the
// per-run session secret the first load exchanges for a cookie) prints FIRST, then the command
// stays in the foreground until SIGINT/SIGTERM close the listener cleanly.
import { parseArgs } from "node:util";
import { spawn } from "node:child_process";
import { createRouter } from "@agentstate-lite/server";
import { openBundle, resolveRemoteFlag, API_KEY_ENV_VAR } from "../bundle.js";
import { normalizeServer } from "../config.js";
import { getApiKeyForOrigin } from "../credentials.js";
import { bootUiServer as bootUiServerDefault, type UiServerHandle, type UiServerOptions } from "../ui/server.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const UI_USAGE = `agentstate-lite ui — boot the local web UI (board · doc detail · admin · graph)

Usage:
  agentstate-lite ui [--dir <path> | --remote <url>] [--port <n>] [--open]

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd) — mounts the
                         reference router in-process
  --remote <url>         Reverse-proxy /v0/* to a deployed remote instead (also honors
                         AGENTSTATE_LITE_REMOTE when neither flag is given and --dir is not)
  --port <p>            Port to bind (default: 0 — an OS-assigned ephemeral port)
  --open                Open the printed URL in a browser once the server is listening
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help

No --host flag in v1 — always binds 127.0.0.1 (loopback-only; a network-exposed key proxy is a
separate, unreviewed feature). The printed URL carries a per-run session token; the first load
exchanges it for an HttpOnly, SameSite=Strict cookie — nothing is persisted beyond this process.
`;

/** Injectable seam so boot + shutdown wiring is unit-testable without real sockets/signals/spawns. */
export interface UiCliDeps {
  stdout: (s: string) => void;
  bootUiServer: (options: UiServerOptions) => Promise<UiServerHandle>;
  waitForShutdown: () => Promise<void>;
  openBrowser: (url: string) => void;
}

function defaultWaitForShutdown(): Promise<void> {
  return new Promise((resolve) => {
    process.once("SIGINT", () => resolve());
    process.once("SIGTERM", () => resolve());
  });
}

/** Best-effort cross-platform "open a URL in the default browser" — no dependency (the CLI bundle stays zero-runtime-deps); a failure here never fails the command, since the printed URL is always the fallback. */
function defaultOpenBrowser(url: string): void {
  try {
    const platform = process.platform;
    const [cmd, args] =
      platform === "darwin" ? ["open", [url]] : platform === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    // best-effort only
  }
}

/** Map a raw `listen()` failure to a structured CliError — mirrors `serve.ts`'s `mapBootError` exactly. */
function mapBootError(err: unknown, port: number): CliError {
  if (err instanceof CliError) return err;
  if ((err as NodeJS.ErrnoException)?.code === "EADDRINUSE") {
    return new CliError("RUNTIME", `port ${port} is already in use — something else is listening there`, {
      help: `${cliInvocation()} ui --port 0 (ephemeral port), or pass a different --port`,
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message);
}

export async function ui(argv: string[], deps: Partial<UiCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const bootUiServer = deps.bootUiServer ?? bootUiServerDefault;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown;
  const openBrowser = deps.openBrowser ?? defaultOpenBrowser;

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          remote: { type: "string" },
          port: { type: "string" },
          open: { type: "boolean" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "ui",
  );
  if (values.help) {
    stdout(UI_USAGE);
    return;
  }

  let port = 0; // rev 3.2: --port defaults to 0 (OS-assigned), unlike `serve`'s stable 4818 default
  if (values.port !== undefined) {
    const raw = values.port.trim();
    if (!/^\d+$/.test(raw) || Number(raw) > 65535) {
      throw new CliError("USAGE", "--port must be an integer between 0 and 65535", {
        help: `${cliInvocation()} ui --port <p>`,
      });
    }
    port = Number(raw);
  }

  const remoteFlag = await resolveRemoteFlag(values.remote, values.dir);
  let options: UiServerOptions;
  let rootLabel: string;

  if (remoteFlag) {
    if (values.dir) {
      throw new CliError("USAGE", "--remote and --dir are mutually exclusive", {
        help: `${cliInvocation()} ui --remote <url>`,
      });
    }
    let base: string;
    let origin: string;
    try {
      const resolved = normalizeServer(remoteFlag);
      base = resolved.base;
      origin = resolved.resource;
    } catch (err) {
      throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
        help: `${cliInvocation()} ui --remote http://127.0.0.1:4818`,
      });
    }
    const envKey = process.env[API_KEY_ENV_VAR]?.trim();
    const apiKey = envKey || (await getApiKeyForOrigin(origin));
    options = { mode: "remote", port, remoteBase: base, apiKey };
    rootLabel = base;
  } else {
    const bundle = await openBundle(values.dir);
    const router = createRouter(bundle);
    options = { mode: "dir", port, router };
    rootLabel = bundle.root;
  }

  let handle: UiServerHandle;
  try {
    handle = await bootUiServer(options);
  } catch (err) {
    throw mapBootError(err, port);
  }

  const url = `http://${handle.host}:${handle.port}/?token=${handle.token}`;

  stdout(
    render(
      {
        ui: "listening",
        url,
        mode: options.mode,
        root: rootLabel,
        auth:
          "per-run session token embedded in the URL above; the first load exchanges it for an HttpOnly, SameSite=Strict cookie — nothing is persisted beyond this process",
        help: [`open ${url} in a browser`],
      },
      resolveMode(values),
    ),
  );

  if (values.open) openBrowser(url);

  // Stay in the foreground; SIGINT/SIGTERM (or the injected waitForShutdown) close the listener
  // cleanly and this resolves — exit 0. No request logs to stdout by default.
  await waitForShutdown();
  await handle.close();
}
