// The `ui` command's node:http listener: ONE server, same origin, either mode (plans/ui-v1.md
// rev 3.2). Every request passes the Host allowlist, then the token/cookie session check, then
// (for a mutation) the `X-Requested-With` check, before it ever reaches the router / proxy /
// asset layer — see each helper module's own doc comment for why each gate exists.
//
// Reuses the server package's exported node:http adapter ({@link requestFromIncomingMessage} /
// {@link writeResponseToServerResponse}) rather than forking Request/Response marshaling — the
// SMALL ADDITIVE surface `plans/ui-v1.md` rev 3.2 calls for instead of a second implementation.
//
// PAGES SPIKE (tasks/ui-pages-spike) adds a SECOND privilege tier alongside the data API: a
// PAGE-BYTES route (`/__page/<nonce>`) that serves a bundle page's static HTML to a sandboxed,
// opaque-origin iframe, gated by a per-page nonce the session-authed shell mints (`POST
// /__page/mint`) — NOT by the session token, so a page structurally cannot reach `/v0/*`. Plus an
// SSE `/events` stream (shell-only) fed by a version-token watcher for live updates. See
// `pages.ts`, `events.ts`, `watch.ts`.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { basename } from "node:path";
import { requestFromIncomingMessage, writeResponseToServerResponse } from "@agentstate-lite/server";
import { readBlob, assertSafeBlobKey, type Bundle } from "@agentstate-lite/core";
import { isAllowedHost } from "./host.js";
import { checkAuth, mintSessionSecret, sessionCookieHeader } from "./session.js";
import { serveAsset } from "./assets.js";
import { proxyToRemote } from "./proxy.js";
import { PageNonceRegistry, pageCsp } from "./pages.js";
import { SseHub } from "./events.js";
import { startWatcher, type ChangeEvent, type WatcherHandle } from "./watch.js";

/** No `--host` in v1 (rev 3.2: "a network-exposed key proxy is a different feature with its own review") — always loopback. */
const HOST = "127.0.0.1";

/** The single-bundle reference router's bundle segment (mirrors the SPA client's `BUNDLE`). */
const REMOTE_BUNDLE = "default";

export interface UiServerOptions {
  mode: "dir" | "remote";
  port?: number;
  /** REQUIRED in `--dir` mode: the in-process router mounted over the local bundle (`createRouter(bundle)`). */
  router?: (req: Request) => Promise<Response>;
  /** REQUIRED in `--dir` mode: the opened bundle — page-blob reads and the live-update watcher's snapshots go through it. */
  bundle?: Bundle;
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

/** Per-run mutable state the request handler closes over: the page-nonce registry, the SSE fan-out, and the change watcher. */
interface UiRuntime {
  nonces: PageNonceRegistry;
  sse: SseHub;
  watcher?: WatcherHandle;
}

function jsonError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** A minimal readable error rendered INSIDE the page iframe (the page route serves HTML, so a JSON envelope would show as raw text). Carries the page CSP so the error frame is as locked-down as a real page. */
function pageError(status: number, message: string): Response {
  const body = `<!doctype html><meta charset="utf-8"><title>page unavailable</title><p>${message}</p>`;
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": pageCsp() },
  });
}

/** Percent-encode each `/`-separated segment of a blob key independently (mirrors the SPA client's `encodeIdPath`). */
function encodeBlobKeyPath(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

/** Read a page blob's bytes + content-type in either mode: local backend (`--dir`) or the remote's blob route (`--remote`). `null` when absent. */
async function readPageBlob(options: UiServerOptions, key: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  if (options.mode === "dir") {
    const r = await readBlob(options.bundle!, key);
    return r ? { bytes: r.bytes, contentType: r.contentType } : null;
  }
  const target = `${options.remoteBase}/v0/bundles/${REMOTE_BUNDLE}/blobs/${encodeBlobKeyPath(key)}`;
  const headers: Record<string, string> = {};
  if (options.apiKey) headers.authorization = `Bearer ${options.apiKey}`;
  const res = await fetch(target, { headers });
  if (!res.ok) return null;
  return { bytes: new Uint8Array(await res.arrayBuffer()), contentType: res.headers.get("content-type") ?? "application/octet-stream" };
}

/** Serve a page's bytes for a resolved nonce — the ONLY thing a nonce authorizes, and only ITS one key. */
async function servePageBytes(options: UiServerOptions, runtime: UiRuntime, nonce: string): Promise<Response> {
  const key = runtime.nonces.resolve(nonce);
  if (!key) return pageError(403, "This page link is unknown or has expired. Reopen the page from the launcher.");
  const blob = await readPageBlob(options, key);
  if (!blob) return pageError(404, `No page bytes found for '${key}'.`);
  return new Response(blob.bytes, {
    status: 200,
    headers: {
      "content-type": blob.contentType,
      "content-security-policy": pageCsp(),
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
    },
  });
}

/** Mint a nonce for the requested (session-authed) page key. Only a SAFE blob key is accepted; the served bytes may still 404 if the blob is absent. */
async function handleMint(req: Request, runtime: UiRuntime): Promise<Response> {
  let payload: { key?: unknown };
  try {
    payload = (await req.json()) as { key?: unknown };
  } catch {
    return jsonError(400, "USAGE", "request body must be JSON { key }");
  }
  const key = typeof payload.key === "string" ? payload.key.trim() : "";
  if (!key) return jsonError(400, "USAGE", "request body must include a non-empty page key");
  try {
    assertSafeBlobKey(key);
  } catch (err) {
    return jsonError(400, "USAGE", err instanceof Error ? err.message : `unsafe page key '${key}'`);
  }
  const nonce = runtime.nonces.mint(key);
  return new Response(JSON.stringify({ nonce, url: `/__page/${nonce}` }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** The SPA bootstrap endpoint: mode, the `--remote` origin (for `ReloginScreen`), and a friendly bundle label for the launcher summary. NOT part of the wire surface (no `/v0/` prefix, never proxied). */
function configResponse(options: UiServerOptions): Response {
  const name =
    options.mode === "dir"
      ? basename(options.bundle?.root ?? "") || "bundle"
      : (() => {
          try {
            return new URL(options.remoteBase!).host;
          } catch {
            return options.remoteBase ?? "remote";
          }
        })();
  return new Response(
    JSON.stringify({
      mode: options.mode,
      remoteUrl: options.mode === "remote" ? (options.remoteBase ?? null) : null,
      root: options.mode === "dir" ? (options.bundle?.root ?? null) : (options.remoteBase ?? null),
      name,
    }),
    { status: 200, headers: { "content-type": "application/json; charset=utf-8" } },
  );
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: UiServerOptions,
  runtime: UiRuntime,
  sessionSecret: string,
): Promise<void> {
  if (!isAllowedHost(req.headers.host)) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "Host header is not in the loopback allowlist"));
    return;
  }

  const origin = `http://${req.headers.host}`;
  const request = await requestFromIncomingMessage(req, origin);
  const url = new URL(request.url);

  // PAGE BYTES — the second privilege tier. Nonce-gated and SESSION-INDEPENDENT: the sandboxed,
  // opaque-origin iframe that loads this URL holds no session token, and the nonce is its sole
  // capability (minted by the session-authed shell for this one key). The data token does NOT open
  // this route to arbitrary keys, and this nonce does NOT open any data route (`checkAuth` below
  // rejects it — it is not the session secret). `/__page/mint` is excluded here: it is a data
  // operation and stays behind the session gate.
  if (url.pathname.startsWith("/__page/") && url.pathname !== "/__page/mint") {
    const nonce = decodeURIComponent(url.pathname.slice("/__page/".length));
    await writeResponseToServerResponse(res, await servePageBytes(options, runtime, nonce));
    return;
  }

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

  // SSE — a long-lived stream written directly on the raw response (never marshaled through
  // `writeResponseToServerResponse`, which finishes the response). Shell-only; pages can't reach it.
  if (url.pathname === "/events" && request.method === "GET") {
    const cookieHeaders: Record<string, string> = auth.grantsCookie ? { "set-cookie": sessionCookieHeader(sessionSecret) } : {};
    runtime.sse.add(res, cookieHeaders);
    return;
  }

  let response: Response;
  if (url.pathname === "/__page/mint" && request.method === "POST") {
    response = await handleMint(request, runtime);
  } else if (url.pathname === "/__ui/config") {
    response = configResponse(options);
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

/** Boot the change watcher for live updates, feeding each diff into the SSE hub. Best-effort: a watcher that can't start (e.g. an unreachable remote at boot) leaves the UI fully usable, just without live push. */
async function bootWatcher(options: UiServerOptions, sse: SseHub): Promise<WatcherHandle | undefined> {
  const onChange = (e: ChangeEvent): void => sse.broadcast(e);
  const onError = (err: unknown): void => {
    process.stderr.write(`[ui watcher] ${err instanceof Error ? err.message : String(err)}\n`);
  };
  try {
    return options.mode === "dir"
      ? await startWatcher({ mode: "dir", bundle: options.bundle!, onChange, onError })
      : await startWatcher({ mode: "remote", remoteBase: options.remoteBase!, apiKey: options.apiKey, onChange, onError });
  } catch (err) {
    onError(err);
    return undefined;
  }
}

/** Boot the `ui` command's http listener and resolve once it is listening. */
export async function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  const sessionSecret = options.sessionSecret ?? mintSessionSecret();
  const runtime: UiRuntime = { nonces: new PageNonceRegistry(), sse: new SseHub() };
  runtime.watcher = await bootWatcher(options, runtime.sse);

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      void handleRequest(req, res, options, runtime, sessionSecret).catch((err: unknown) => {
        res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
      });
    });
    server.once("error", (err) => {
      void runtime.watcher?.stop();
      runtime.sse.close();
      reject(err);
    });
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
        close: () =>
          new Promise<void>((resolveClose, rejectClose) => {
            void runtime.watcher?.stop();
            runtime.sse.close();
            server.close((err) => (err ? rejectClose(err) : resolveClose()));
          }),
      });
    });
  });
}
