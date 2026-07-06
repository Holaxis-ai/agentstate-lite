// The `ui` command's node:http listener: ONE server, same origin, either mode (plans/ui-v1.md
// rev 3.2). Every request passes the Host allowlist, then the token/cookie session check, then
// (for a mutation) the `X-Requested-With` check, before it ever reaches the router / proxy /
// asset layer — see each helper module's own doc comment for why each gate exists.
//
// Reuses the server package's exported node:http adapter ({@link requestFromIncomingMessage} /
// {@link writeResponseToServerResponse}) rather than forking Request/Response marshaling — the
// SMALL ADDITIVE surface `plans/ui-v1.md` rev 3.2 calls for instead of a second implementation.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { requestFromIncomingMessage, writeResponseToServerResponse } from "@agentstate-lite/server";
import { isAllowedHost } from "./host.js";
import { checkAuth, mintSessionSecret, sessionCookieHeader } from "./session.js";
import { serveAsset } from "./assets.js";
import { proxyToRemote } from "./proxy.js";

/** No `--host` in v1 (rev 3.2: "a network-exposed key proxy is a different feature with its own review") — always loopback. */
const HOST = "127.0.0.1";

export interface UiServerOptions {
  mode: "dir" | "remote";
  port?: number;
  /** REQUIRED in `--dir` mode: the in-process router mounted over the local bundle (`createRouter(bundle)`). */
  router?: (req: Request) => Promise<Response>;
  /** REQUIRED in `--remote` mode: the target origin's normalized base URL. */
  remoteBase?: string;
  /** `--remote` mode only: the stored API key for that origin, if any (absent ⇒ no `Authorization` header is sent — the zero-cloud E2E's keyless case). */
  apiKey?: string;
  /** Injectable for tests; defaults to a fresh random secret per boot (never reused across runs). */
  sessionSecret?: string;
}

export interface UiServerHandle {
  host: string;
  port: number;
  /** The per-run session secret — the `ui` command embeds this as the receipt URL's `?token=`. */
  token: string;
  close(): Promise<void>;
}

function jsonError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: UiServerOptions,
  sessionSecret: string,
): Promise<void> {
  if (!isAllowedHost(req.headers.host)) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "Host header is not in the loopback allowlist"));
    return;
  }

  const origin = `http://${req.headers.host}`;
  const request = await requestFromIncomingMessage(req, origin);
  const url = new URL(request.url);

  const auth = checkAuth(sessionSecret, url.searchParams.get("token"), request.headers.get("cookie"));
  if (!auth.ok) {
    await writeResponseToServerResponse(
      res,
      jsonError(403, "FORBIDDEN", "missing or invalid session — open the printed URL (with its ?token) again"),
    );
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD" && !request.headers.get("x-requested-with")) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "a mutation requires an X-Requested-With header"));
    return;
  }

  let response: Response;
  if (url.pathname === "/__ui/config") {
    // A LOCAL bootstrap endpoint for the SPA's own use (NOT part of the wire-protocol v0
    // surface — no `/v0/` prefix, never proxied) so `ReloginScreen` can render the exact
    // `--remote` origin to re-authenticate against, without CSP-forbidden inline JSON.
    response = new Response(
      JSON.stringify({ mode: options.mode, remoteUrl: options.mode === "remote" ? (options.remoteBase ?? null) : null }),
      { status: 200, headers: { "content-type": "application/json; charset=utf-8" } },
    );
  } else if (url.pathname.startsWith("/v0/")) {
    response =
      options.mode === "dir"
        ? await options.router!(request)
        : await proxyToRemote(request, options.remoteBase!, options.apiKey);
  } else {
    const asset = serveAsset(url.pathname, request.headers.get("accept-encoding"));
    response = new Response(asset.body, { status: asset.status, headers: asset.headers });
  }

  if (auth.grantsCookie) response.headers.append("set-cookie", sessionCookieHeader(sessionSecret));
  await writeResponseToServerResponse(res, response);
}

/** Boot the `ui` command's http listener and resolve once it is listening. */
export function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  const sessionSecret = options.sessionSecret ?? mintSessionSecret();

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      void handleRequest(req, res, options, sessionSecret).catch((err: unknown) => {
        res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
      });
    });
    server.once("error", reject);
    server.listen(options.port ?? 0, HOST, () => {
      const addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject(new Error("failed to bind a TCP address"));
        return;
      }
      resolve({
        host: HOST,
        port: addr.port,
        token: sessionSecret,
        close: () => new Promise<void>((resolveClose, rejectClose) => server.close((err) => (err ? rejectClose(err) : resolveClose()))),
      });
    });
  });
}
