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
import { requestFromIncomingMessage, writeResponseToServerResponse } from "@agentstate-lite/server";
import { readBlob, queryHeads, assertSafeBlobKey, loadKinds, queryEdges, type Bundle, type EdgeFilter } from "@agentstate-lite/core";
import { PAGE_TYPE_NAMES } from "@agentstate-lite/core/page";
import { deriveBundleDisplayName } from "../bundle-name.js";
import { isAllowedHost } from "./host.js";
import { checkAuth, mintSessionSecret, sessionCookieHeader } from "./session.js";
import { serveAsset } from "./assets.js";
import { proxyToRemote } from "./proxy.js";
import { PageNonceRegistry, pageCsp, PAGE_BLOB_PREFIXES } from "./pages.js";
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
  /**
   * `--remote` mode only: a `RemoteBackend`-backed bundle over the same origin, for engine-level
   * reads the wire protocol has no bespoke route for — kind-registry loads (`/__ui/kinds` ->
   * core's `loadKinds`) and the derived edge list (`/__ui/edges` -> core's `queryEdges`, which
   * itself rides `query`+`readMany` under the hood, so it needs no wire route of its own either).
   * The SPA's `/v0/*` data path stays the reverse proxy; this is the same engine-level plumbing
   * every other kind/graph-aware CLI command already rides for `--remote`.
   */
  kindsBundle?: Bundle;
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

/** Per-run mutable state the request handler closes over: the page-nonce registry, the SSE fan-out, the change watcher, and the shutdown signal (aborts remote-mode upstream requests at close()). */
interface UiRuntime {
  nonces: PageNonceRegistry;
  sse: SseHub;
  watcher?: WatcherHandle;
  shutdown: AbortController;
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
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": pageCsp(), "referrer-policy": "no-referrer" },
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
  // Re-verify registration at SERVE time, not only at mint time: deleting/retargeting a page's
  // registry doc revokes its live nonces immediately, instead of leaving a still-serving window
  // for the rest of the nonce TTL (tasks/ui-pages-spike P1 — doc-lifecycle revocation).
  if (!(await registeredPageEntries(options)).has(key)) {
    return pageError(403, "This page is no longer registered in the bundle (its registry doc was removed or retargeted).");
  }
  const blob = await readPageBlob(options, key);
  if (!blob) return pageError(404, `No page bytes found for '${key}'.`);
  return new Response(blob.bytes, {
    status: 200,
    headers: {
      "content-type": blob.contentType,
      "content-security-policy": pageCsp(),
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
    },
  });
}

/** The set of blob keys declared as a `type: View` (or legacy `type: Page`) doc's `entry` — the ONLY keys a nonce may be minted for (mode-aware: local `queryHeads`, or the remote's per-type head projection). Both queries take ONE type, so the accepted names are fetched separately and merged (stable order: legacy first, then current — a Set, so ordering only affects iteration). */
async function registeredPageEntries(options: UiServerOptions): Promise<Set<string>> {
  const entries = new Set<string>();
  if (options.mode === "dir") {
    for (const type of PAGE_TYPE_NAMES) {
      for (const head of await queryHeads(options.bundle!, { type })) {
        const entry = head.frontmatter.entry;
        if (typeof entry === "string" && entry) entries.add(entry);
      }
    }
    return entries;
  }
  // Paginate to EXHAUSTION, exactly like the launcher's own page listing — a mint-side ceiling
  // would strand every page past it (listed but unopenable, failing closed for no reason).
  const headers: Record<string, string> = {};
  if (options.apiKey) headers.authorization = `Bearer ${options.apiKey}`;
  for (const type of PAGE_TYPE_NAMES) {
    let cursor: string | undefined;
    do {
      const url = new URL(`${options.remoteBase}/v0/bundles/${REMOTE_BUNDLE}/docs`);
      url.searchParams.set("fields", "frontmatter");
      url.searchParams.set("type", type);
      url.searchParams.set("limit", "200");
      if (cursor) url.searchParams.set("cursor", cursor);
      const res = await fetch(url, { headers });
      if (!res.ok) break; // fail closed: an unreadable registry mints (and serves) nothing extra
      const body = (await res.json()) as { docs: { frontmatter: Record<string, unknown> }[]; next_cursor?: string | null };
      for (const d of body.docs) {
        const entry = d.frontmatter.entry;
        if (typeof entry === "string" && entry) entries.add(entry);
      }
      cursor = body.next_cursor ?? undefined;
    } while (cursor);
  }
  return entries;
}

/**
 * Mint a nonce for the requested (session-authed) page key. Confinement (tasks/ui-pages-spike A1):
 * a nonce may ONLY be minted for a key that (a) lives under an accepted page-blob prefix AND (b) is
 * the declared `entry` of a `type: View` (or legacy `type: Page`) registry doc. This is what stops the nonce mechanism from
 * being turned into a read-anything-blob primitive (e.g. minting `secrets/creds.bin`) even by a
 * compromised same-origin shell — a nonce only ever exists for a bundle-declared page.
 */
async function handleMint(req: Request, runtime: UiRuntime, options: UiServerOptions): Promise<Response> {
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
  if (!PAGE_BLOB_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    return jsonError(403, "FORBIDDEN", `page keys must live under '${PAGE_BLOB_PREFIXES.join("' or '")}'; '${key}' does not`);
  }
  const entries = await registeredPageEntries(options);
  if (!entries.has(key)) {
    return jsonError(403, "FORBIDDEN", `'${key}' is not a registered page (no type:View or legacy type:Page doc declares it as 'entry')`);
  }
  const nonce = runtime.nonces.mint(key);
  return new Response(JSON.stringify({ nonce, url: `/__page/${nonce}` }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/**
 * The SPA bootstrap endpoint: mode, the `--remote` origin (for `ReloginScreen`), and a friendly
 * bundle label for the launcher summary (shell header + bridge `hello.bundle.name`). NOT part of
 * the wire surface (no `/v0/` prefix, never proxied). Dir mode derives the label through THE
 * bundle display-name chain (`bundle-name.ts` — explicit doc, else parent-of-conventional-dir,
 * else root basename), read per request so a `doc write docs/bundle --title …` shows up on the
 * next load without a server restart. Remote mode keeps the origin host as the label.
 */
async function configResponse(options: UiServerOptions): Promise<Response> {
  const name =
    options.mode === "dir"
      ? options.bundle
        ? (await deriveBundleDisplayName(options.bundle)).name
        : "bundle"
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

/**
 * The bundle's kind conventions for the shell's bridge `open` filter, derived by core's
 * `loadKinds` — the ONE registry (gate 3) — over the mode-appropriate bundle. The browser never
 * re-implements discovery/dedupe; it consumes this serialized registry plus core's pure
 * `isTerminal`. Best-effort: a bundle that cannot be read (e.g. a remote hiccup) yields an empty
 * registry, which makes `open` filter nothing — the same posture as `list --open` on a bundle
 * with no terminal declarations (this endpoint feeds a display filter, not a security boundary).
 */
async function kindsResponse(options: UiServerOptions): Promise<Response> {
  const bundle = options.mode === "dir" ? options.bundle : options.kindsBundle;
  let kinds: unknown[] = [];
  if (bundle) {
    try {
      kinds = Array.from((await loadKinds(bundle)).kinds.values());
    } catch {
      kinds = [];
    }
  }
  return new Response(JSON.stringify({ kinds }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/**
 * The bundle's derived edge list (graph-query-v0's `queryEdges`, gate 3: proxied, never
 * reimplemented) for the bridge's `edges` request. Mode-aware exactly like `kindsResponse` above:
 * dir mode calls `queryEdges` over the mounted `Bundle`; remote mode calls it over the SAME
 * `RemoteBackend`-backed bundle `kindsResponse` already uses (`options.kindsBundle`) — `queryEdges`
 * rides `query`+`readMany` under the hood, so this costs no new wire route on the reference server.
 * `from`/`to` are repeatable query params (array-union, mirroring `link list --from/--to`); `text`
 * is exact-match. Row schema is AXI-minimal (`{from, to, text}`), the SAME projection `link list`
 * applies — core's `Link` also carries `href` (the raw pre-resolution markdown target), an
 * internal detail no page needs.
 *
 * UNLIKE `kindsResponse` (an auxiliary display filter, correctly best-effort), edges is PRIMARY
 * data — a page's backlinks panel, say — so a `queryEdges` failure (most commonly a `--remote`
 * upstream outage) is mapped to a 502, mirroring `proxyToRemote`'s own transport-failure envelope,
 * rather than swallowed into a 200 `{edges:[],count:0}`: a real outage must read as an error, not
 * as "this bundle simply has no edges" (the branch's own silent-staleness standard, and the reason
 * `fetchEdges` throws on any non-2xx rather than best-effort-emptying like `fetchKinds`).
 */
async function edgesResponse(options: UiServerOptions, url: URL): Promise<Response> {
  const bundle = options.mode === "dir" ? options.bundle : options.kindsBundle;
  const filter: EdgeFilter = {};
  const from = url.searchParams.getAll("from").map((v) => v.trim()).filter(Boolean);
  if (from.length > 0) filter.from = from;
  const to = url.searchParams.getAll("to").map((v) => v.trim()).filter(Boolean);
  if (to.length > 0) filter.to = to;
  const text = url.searchParams.get("text")?.trim();
  if (text) filter.text = text;

  let links: Awaited<ReturnType<typeof queryEdges>>;
  try {
    links = bundle ? await queryEdges(bundle, filter) : [];
  } catch (err) {
    return jsonError(502, "RUNTIME", `could not read the bundle's edges (${err instanceof Error ? err.message : String(err)})`);
  }
  const edges = links.map((l) => ({ from: l.from, to: l.to, text: l.text }));
  return new Response(JSON.stringify({ edges, count: edges.length }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
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
    response = await handleMint(request, runtime, options);
  } else if (url.pathname === "/__ui/config") {
    response = await configResponse(options);
  } else if (url.pathname === "/__ui/kinds") {
    response = await kindsResponse(options);
  } else if (url.pathname === "/__ui/edges") {
    response = await edgesResponse(options, url);
  } else if (url.pathname.startsWith("/v0/")) {
    response =
      options.mode === "dir"
        ? await options.router!(request)
        : await proxyToRemote(request, options.remoteBase!, options.apiKey, runtime.shutdown.signal);
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

/** How long close() waits for accepted request handlers to settle before shutting down without them (a backstop for a pathological handler; severed sockets settle ordinary blocked reads well within this). */
const CLOSE_DRAIN_WATCHDOG_MS = 5_000;

/** Boot the `ui` command's http listener and resolve once it is listening. */
export async function bootUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  const sessionSecret = options.sessionSecret ?? mintSessionSecret();
  const runtime: UiRuntime = { nonces: new PageNonceRegistry(), sse: new SseHub(), shutdown: new AbortController() };
  runtime.watcher = await bootWatcher(options, runtime.sse);

  return new Promise((resolve, reject) => {
    // Every ACCEPTED request's handler promise, tracked until it settles: close() drains this
    // set before resolving, so no handler can commit a write AFTER shutdown ostensibly finished
    // (the post-close destructive-write race — e.g. a mutation recreating a bundle dir the
    // operator deleted right after close()).
    const inFlight = new Set<Promise<void>>();
    const server = createServer((req, res) => {
      const handled = handleRequest(req, res, options, runtime, sessionSecret).catch((err: unknown) => {
        // Best-effort: the response may already be severed (shutdown's closeAllConnections) — a
        // throwing fallback here would surface as an unhandled rejection, not a served error.
        try {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
        } catch {
          res.destroy();
        }
      });
      inFlight.add(handled);
      void handled.finally(() => inFlight.delete(handled));
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
        close: async () => {
          void runtime.watcher?.stop();
          runtime.sse.close();
          const listenerClosed = new Promise<void>((resolveClose, rejectClose) =>
            server.close((err) => (err ? rejectClose(err) : resolveClose())),
          );
          // Handled-guard: listenerClosed is awaited only AFTER the drain below, so a rejection
          // landing during the drain (a concurrent second close() gets ERR_SERVER_NOT_RUNNING)
          // would otherwise sit handler-less across macrotask turns — a process-fatal
          // unhandledRejection. The no-op catch marks it handled now; the await still throws.
          listenerClosed.catch(() => {});
          // Shutdown never waits on a client: sever every remaining socket now. Without this,
          // an EventSource reconnect racing onto a kept-alive connection mid-drain registers a
          // fresh never-ending stream (or a pipelined request keeps its socket active) and
          // `server.close()` blocks forever — the session-rotation restart hang.
          server.closeAllConnections();
          // Remote mode: abort in-flight upstream requests — a slow remote must not stall
          // shutdown, and the remote owns its own write coherence. Dir mode is untouched by
          // this signal: an accepted LOCAL mutation finishes (see the drain below).
          runtime.shutdown.abort();
          // Drain accepted server-side work BEFORE resolving: severing sockets stops CLIENTS,
          // but a handler already executing (e.g. a mutation inside the router) is our work —
          // resolving under it would let a write commit AFTER close(). Dir-mode semantics:
          // finish-what-you-accepted (aborting a local fs write mid-flight risks partial
          // state). Bounded by a watchdog for a pathological handler that outlives its
          // severed socket.
          const drained = Promise.allSettled([...inFlight]).then(() => true as const);
          const bounded = await Promise.race([
            drained,
            new Promise<false>((resolveTimeout) => setTimeout(() => resolveTimeout(false), CLOSE_DRAIN_WATCHDOG_MS).unref()),
          ]);
          if (!bounded) {
            process.stderr.write("[ui] close(): a request handler did not settle within the drain window; shutting down without it\n");
          }
          await listenerClosed;
        },
      });
    });
  });
}
