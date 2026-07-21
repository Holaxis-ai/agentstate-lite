// The reusable loopback UI node:http listener: one server, same origin, either mode. Every request
// passes the Host allowlist, then the token/cookie session check, then
// (for a mutation) the `X-Requested-With` check, before it ever reaches the router / proxy /
// asset layer — see each helper module's own doc comment for why each gate exists.
//
// Reuses the server package's exported node:http adapter ({@link requestFromIncomingMessage} /
// {@link writeResponseToServerResponse}) so Request/Response marshaling has one implementation.
//
// Bundle Views add a second privilege tier alongside the data API: a
// PAGE-BYTES route (`/__page/<nonce>`) that serves a bundle page's static HTML to a sandboxed,
// opaque-origin iframe, gated by a per-page nonce the session-authed shell mints (`POST
// /__page/mint`) — NOT by the session token, so a page structurally cannot reach `/v0/*`. Plus an
// SSE `/events` stream (shell-only) fed by a version-token watcher for live updates. See
// `pages.ts`, `events.ts`, `watch.ts`.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { requestFromIncomingMessage, writeResponseToServerResponse } from "@agentstate-lite/server";
import { assertSafeBlobKey, blobVersion, readBlob, readDocVersioned, loadKinds, queryEdges, queryHeads, type Bundle, type EdgeFilter, type Frontmatter } from "@agentstate-lite/core";
import { PAGE_TYPE_NAMES, parseRegistration, resolveBridgeCapability } from "@agentstate-lite/core/page";
import { isAllowedHost } from "./host.js";
import { checkAuth, mintSessionSecret, sessionCookieHeader } from "./session.js";
import type { UiAssetHandler } from "./assets.js";
import { proxyToRemote } from "./proxy.js";
import { pageCsp } from "./pages.js";
import {
  PageLaunchRegistry,
  TrustedActionService,
  launchIsCurrent,
  type ActionTerminalResult,
} from "./actions.js";
import { SseHub } from "./events.js";
import { startWatcher, type ChangeEvent, type WatcherHandle } from "./watch.js";

/** Always loopback: a network-exposed key proxy is a different feature and security boundary. */
const HOST = "127.0.0.1";

/** The single-bundle reference router's bundle segment (mirrors the SPA client's `BUNDLE`). */
const REMOTE_BUNDLE = "default";

/**
 * The home surface's sharing-chip state (designs/home-surface, the 9-row truth table). Declared
 * HERE as a plain data shape — ui-server owns the vocabulary; the CLI maps its board-channel
 * detection into it (the import-direction test forbids even type-only CLI/board-git imports).
 * The SPA owns the WORDS; this enum owns the states. `hosted` is the one state this runtime
 * derives itself (remote mode, from `remoteBase` — no injection involved).
 */
export type SharingStateKind =
  | "private"
  | "private_local_branch"
  | "private_intree_no_remote"
  | "private_intree_not_pushed"
  | "shared_branch"
  | "shared_intree"
  | "hosted"
  | "unavailable"
  | "unscoped";

/** One sharing-state reading, stamped with when it was computed (`as_of` — the loader is TTL-cached and offline-evidence-only, so freshness is part of the truth). */
export interface SharingSummary {
  kind: SharingStateKind;
  /** Humanized remote for the shared/hosted kinds (`org/repo`, a host, or a path tail — consumer-degraded). */
  remote?: string;
  /** Short human reason for `unavailable` (a determinate refusal state or a probe failure — never silently "private"). */
  reason?: string;
  as_of: string;
}

/** One registered-workspace row for the home's collapsed workspaces block (labels + paths only — no availability probes; CLI policy decides the projection). */
export interface WorkspaceSummaryEntry {
  label: string;
  path: string;
  /** True when this entry IS the bundle this server is mounted over. */
  open: boolean;
}

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
  /** Asset bytes stay consumer-owned (the CLI injects its build-generated embedded table). */
  serveAsset: UiAssetHandler;
  /** Consumer-owned display-name policy; the runtime never imports CLI naming rules. */
  resolveBundleDisplayName?: (bundle: Bundle) => Promise<string>;
  /**
   * `--dir` mode, consumer-owned (the CLI injects its board-channel classification): the sharing
   * summary for the home's trust chip. Called per config request — the consumer owns caching/TTL.
   * A loader that THROWS reads as `unavailable` (never a fabricated "private"); absent loader in
   * dir mode reads as no claim (`sharing: null`). Remote mode ignores it (`hosted` is derived here).
   */
  loadSharingSummary?: () => Promise<SharingSummary>;
  /** `--dir` mode, consumer-owned: registered-workspace rows for the home's collapsed block (labels + paths only). A throwing loader reads as an empty list. */
  loadWorkspaces?: () => Promise<WorkspaceSummaryEntry[]>;
  /** Injectable for tests; defaults to a fresh random secret per boot (never reused across runs). */
  sessionSecret?: string;
  /** Advisory identity recorded by a confirmed local View action. Read-only UI needs no actor. */
  actor?: string;
  /**
   * `--remote` mode only: override the watcher's boot-time initial-snapshot timeout (default
   * `DEFAULT_REMOTE_BOOT_TIMEOUT_MS` in `watch.ts`, ~5s) — a test seam
   * (tasks/ui-remote-watcher-boot-timeout) so a "never-responding remote" boot-bound test doesn't
   * have to wait out the real default.
   */
  watcherBootTimeoutMs?: number;
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
  launches: PageLaunchRegistry;
  actions?: TrustedActionService;
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

/** Escape text for interpolation into HTML (the standard `&<>\"'` five). The ONE escape primitive for the serve path — every {@link pageError} message flows through it, because a message on that path can carry remote-originated text (e.g. an upstream failure's error string) and must never reach the iframe as markup. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** A minimal readable error rendered INSIDE the page iframe (the page route serves HTML, so a JSON envelope would show as raw text). Carries the page CSP so the error frame is as locked-down as a real page. The message is ALWAYS HTML-escaped — it is data, never markup. Exported for the escaping pin (ui-pages.test.ts); not otherwise a public API. */
export function pageError(status: number, message: string): Response {
  const body = `<!doctype html><meta charset="utf-8"><title>page unavailable</title><p>${escapeHtml(message)}</p>`;
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": pageCsp(), "referrer-policy": "no-referrer" },
  });
}

/** Read a page blob's bytes + content-type in either mode: local backend (`--dir`) or the remote's blob route (`--remote`). `null` when absent. */
async function readPageBlob(options: UiServerOptions, key: string): Promise<{ bytes: Uint8Array; contentType: string; version: string } | null> {
  if (options.mode === "dir") {
    const r = await readBlob(options.bundle!, key);
    return r ? { bytes: r.bytes, contentType: r.contentType, version: r.version } : null;
  }
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  const target = `${options.remoteBase}/v0/bundles/${REMOTE_BUNDLE}/blobs/${encoded}`;
  const headers: Record<string, string> = {};
  if (options.apiKey) headers.authorization = `Bearer ${options.apiKey}`;
  const res = await fetch(target, { headers });
  if (!res.ok) return null;
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { bytes, contentType: res.headers.get("content-type") ?? "application/octet-stream", version: res.headers.get("x-version") ?? blobVersion(bytes) };
}

interface RegistryHead {
  id: string;
  version: string;
  frontmatter: Frontmatter;
}

/** Compatibility read for remote hosts that expose the wire surface but are not mounted as a Bundle. */
async function remoteRegistryHeads(options: UiServerOptions): Promise<RegistryHead[]> {
  const headers: Record<string, string> = {};
  if (options.apiKey) headers.authorization = `Bearer ${options.apiKey}`;
  const heads: RegistryHead[] = [];
  for (const type of PAGE_TYPE_NAMES) {
    let cursor: string | undefined;
    do {
      const url = new URL(`${options.remoteBase}/v0/bundles/${REMOTE_BUNDLE}/docs`);
      url.searchParams.set("fields", "frontmatter");
      url.searchParams.set("type", type);
      url.searchParams.set("limit", "200");
      if (cursor) url.searchParams.set("cursor", cursor);
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`type=${type} listing returned status ${response.status}`);
      const body = (await response.json()) as { docs?: RegistryHead[]; next_cursor?: string | null };
      if (!Array.isArray(body.docs)) throw new Error(`type=${type} listing returned malformed data`);
      heads.push(...body.docs);
      cursor = body.next_cursor ?? undefined;
    } while (cursor);
  }
  return heads;
}

/** Serve a page's bytes for a resolved nonce — the ONLY thing a nonce authorizes, and only ITS one key. */
async function servePageBytes(options: UiServerOptions, runtime: UiRuntime, nonce: string): Promise<Response> {
  const launch = runtime.launches.resolveNonce(nonce);
  if (!launch) return pageError(403, "This view link is unknown or has expired. Reopen the view from the launcher.");
  const bundle = options.mode === "dir" ? options.bundle : options.kindsBundle;
  let current = false;
  try {
    if (bundle) {
      current = await launchIsCurrent(bundle, launch);
    } else if (options.mode === "remote") {
      const head = (await remoteRegistryHeads(options)).find((candidate) => candidate.id === launch.registryId);
      const registration = head ? parseRegistration(head.id, head.frontmatter) : null;
      const blob = registration ? await readPageBlob(options, registration.entry) : null;
      current = Boolean(
        head &&
        registration &&
        head.version === launch.registryVersion &&
        registration.type === launch.registryType &&
        registration.entry === launch.entryKey &&
        resolveBridgeCapability(head.frontmatter.bridge) === launch.capability &&
        blob &&
        blob.version === launch.contentVersion &&
        blob.contentType === launch.contentType,
      );
    }
  } catch (error) {
    return pageError(502, `The bundle's View registry could not be read (${error instanceof Error ? error.message : String(error)}). Try again.`);
  }
  if (!current) {
    runtime.launches.revoke(launch.launchId);
    return pageError(403, "This view changed after it was opened. Reopen it from the launcher.");
  }
  return new Response(launch.bytes, {
    status: 200,
    headers: {
      "content-type": launch.contentType,
      "content-security-policy": pageCsp(),
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
    },
  });
}

/**
 * Mint an immutable launch from a registry id. The server resolves the registration and exact HTML
 * itself; the shell never gets to pair an arbitrary key with a trusted registry identity.
 */
async function handleMint(req: Request, runtime: UiRuntime, options: UiServerOptions): Promise<Response> {
  let payload: { registryId?: unknown; key?: unknown };
  try {
    payload = (await req.json()) as { registryId?: unknown; key?: unknown };
  } catch {
    return jsonError(400, "USAGE", "request body must be JSON { registryId }");
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return jsonError(400, "USAGE", "request body must contain exactly registryId");
  }
  const keys = Object.keys(payload).sort();
  if (keys.length !== 1 || (keys[0] !== "registryId" && keys[0] !== "key")) {
    return jsonError(400, "USAGE", "request body must contain exactly registryId");
  }
  const bundle = options.mode === "dir" ? options.bundle : options.kindsBundle;

  let registryId = typeof payload.registryId === "string" ? payload.registryId.trim() : "";
  const legacyKey = typeof payload.key === "string" ? payload.key.trim() : "";
  if (!registryId && legacyKey) {
    try {
      assertSafeBlobKey(legacyKey);
    } catch (error) {
      return jsonError(400, "USAGE", error instanceof Error ? error.message : String(error));
    }
    const matches: string[] = [];
    try {
      const heads = bundle
        ? (await Promise.all(PAGE_TYPE_NAMES.map((type) => queryHeads(bundle, { type })))).flat()
        : await remoteRegistryHeads(options);
      for (const head of heads) {
        const registration = parseRegistration(head.id, head.frontmatter);
        if (registration?.entry === legacyKey) matches.push(registration.id);
      }
    } catch (error) {
      return jsonError(502, "RUNTIME", `could not read the View registry (${error instanceof Error ? error.message : String(error)})`);
    }
    registryId = matches.sort()[0] ?? "";
    if (!registryId) return jsonError(403, "FORBIDDEN", `'${legacyKey}' is not the entry of any valid registered View`);
  }
  if (!registryId) return jsonError(400, "USAGE", "request body must include a non-empty registryId");

  let registryRead: Awaited<ReturnType<typeof readDocVersioned>>;
  try {
    if (bundle) {
      registryRead = await readDocVersioned(bundle, registryId);
    } else {
      const head = (await remoteRegistryHeads(options)).find((candidate) => candidate.id === registryId);
      if (!head) return jsonError(404, "NOT_FOUND", `View registry '${registryId}' does not exist`);
      registryRead = { doc: { id: head.id, frontmatter: head.frontmatter, body: "" }, version: head.version };
    }
  } catch (err) {
    return jsonError((err as NodeJS.ErrnoException)?.code === "ENOENT" ? 404 : 502, "RUNTIME", err instanceof Error ? err.message : String(err));
  }
  const registration = parseRegistration(registryRead.doc.id, registryRead.doc.frontmatter);
  if (!registration) {
    return jsonError(403, "FORBIDDEN", `'${registryId}' is not a valid type:View (or legacy type:Page) registration`);
  }
  const blob = await readPageBlob(options, registration.entry);
  if (!blob) return jsonError(404, "NOT_FOUND", `no View bytes found for '${registration.entry}'`);
  const launch = runtime.launches.mint({
    registryId: registration.id,
    registryType: registration.type,
    registryVersion: registryRead.version,
    registryTitle: typeof registryRead.doc.frontmatter.title === "string" ? registryRead.doc.frontmatter.title : registration.id,
    entryKey: registration.entry,
    contentType: blob.contentType,
    contentVersion: blob.version,
    bytes: blob.bytes,
    capability: resolveBridgeCapability(registryRead.doc.frontmatter.bridge),
  });
  return new Response(JSON.stringify({ nonce: launch.nonce, url: `/__page/${launch.nonce}`, launchId: launch.launchId }), {
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
        ? options.resolveBundleDisplayName
          ? await options.resolveBundleDisplayName(options.bundle)
          : "bundle"
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
      sharing: await sharingSummary(options),
      workspaces: await workspacesSummary(options),
    }),
    { status: 200, headers: { "content-type": "application/json; charset=utf-8" } },
  );
}

/**
 * The trust chip's state. Remote mode is derived HERE (`hosted` off remoteBase); dir mode is the
 * consumer's injected classification (absent loader = no claim, `null`). A THROWING loader is
 * `unavailable`, never a fabricated "private" — a wrong "private" and a wrong "shared" are the
 * same trust bug (designs/home-surface, the truth-table rules).
 */
async function sharingSummary(options: UiServerOptions): Promise<SharingSummary | null> {
  if (options.mode === "remote") {
    let host: string;
    try {
      host = new URL(options.remoteBase!).host;
    } catch {
      host = options.remoteBase ?? "remote";
    }
    return { kind: "hosted", remote: host, as_of: new Date().toISOString() };
  }
  if (!options.loadSharingSummary) return null;
  try {
    return await options.loadSharingSummary();
  } catch (err) {
    return {
      kind: "unavailable",
      reason: err instanceof Error ? err.message : String(err),
      as_of: new Date().toISOString(),
    };
  }
}

/** The collapsed workspaces block's rows (dir mode, consumer-injected). Best-effort: a throwing loader is an empty list, never a failed config. */
async function workspacesSummary(options: UiServerOptions): Promise<WorkspaceSummaryEntry[]> {
  if (options.mode !== "dir" || !options.loadWorkspaces) return [];
  try {
    return await options.loadWorkspaces();
  } catch {
    return [];
  }
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

function actionJson(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function exactOwnKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

const MAX_TRUSTED_ACTION_BODY_BYTES = 16 * 1024;

async function actionPayload(req: Request, keys: readonly string[]): Promise<Record<string, unknown> | Response> {
  if (req.headers.get("x-requested-with") !== "agentstate-lite-ui") {
    return jsonError(403, "FORBIDDEN", "trusted actions require X-Requested-With: agentstate-lite-ui");
  }
  if (req.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return jsonError(415, "USAGE", "trusted action requests require application/json");
  }
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TRUSTED_ACTION_BODY_BYTES) {
    return jsonError(413, "USAGE", "trusted action request body must be at most 16 KiB");
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return jsonError(400, "USAGE", "trusted action request body could not be read");
  }
  if (Buffer.byteLength(text, "utf8") > MAX_TRUSTED_ACTION_BODY_BYTES) {
    return jsonError(413, "USAGE", "trusted action request body must be at most 16 KiB");
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return jsonError(400, "USAGE", "trusted action request body must be valid JSON");
  }
  return exactOwnKeys(value, keys) ? value : jsonError(400, "USAGE", `trusted action request must contain exactly ${keys.join(", ")}`);
}

async function prepareAction(req: Request, options: UiServerOptions, runtime: UiRuntime): Promise<Response> {
  const payload = await actionPayload(req, ["launchId", "action"]);
  if (payload instanceof Response) return payload;
  if (options.mode !== "dir" || !runtime.actions) {
    const result: ActionTerminalResult = { status: "rejected", action: "document.set-field", message: "trusted View actions are available only in local --dir mode" };
    return actionJson(result);
  }
  const launchId = typeof payload.launchId === "string" ? payload.launchId : "";
  if (!launchId || launchId.length > 256) return jsonError(400, "USAGE", "launchId must be a non-empty string of at most 256 characters");
  return actionJson(await runtime.actions.prepare(launchId, payload.action));
}

async function finishAction(req: Request, runtime: UiRuntime, operation: "commit" | "cancel"): Promise<Response> {
  const payload = await actionPayload(req, ["approvalToken"]);
  if (payload instanceof Response) return payload;
  const token = typeof payload.approvalToken === "string" ? payload.approvalToken : "";
  if (!token || token.length > 256) return jsonError(400, "USAGE", "approvalToken must be a non-empty string of at most 256 characters");
  if (!runtime.actions) {
    return actionJson({ status: "rejected", action: "document.set-field", message: "trusted View actions are unavailable" } satisfies ActionTerminalResult);
  }
  return actionJson(operation === "commit" ? await runtime.actions.commit(token) : runtime.actions.cancel(token));
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
  } else if (url.pathname === "/__ui/actions/prepare" && request.method === "POST") {
    response = await prepareAction(request, options, runtime);
  } else if (url.pathname === "/__ui/actions/commit" && request.method === "POST") {
    response = await finishAction(request, runtime, "commit");
  } else if (url.pathname === "/__ui/actions/cancel" && request.method === "POST") {
    response = await finishAction(request, runtime, "cancel");
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
    const asset = options.serveAsset(url.pathname, request.headers.get("accept-encoding"));
    response = new Response(asset.body, { status: asset.status, headers: asset.headers });
  }

  if (auth.grantsCookie) response.headers.append("set-cookie", sessionCookieHeader(sessionSecret));
  await writeResponseToServerResponse(res, response);
}

/**
 * Boot the change watcher for live updates, feeding each diff into the SSE hub. Best-effort: a
 * watcher that can't start (e.g. an unreachable remote at boot, or — tasks/ui-remote-watcher-boot-timeout
 * — a `--remote` upstream that never responds, now bounded by `startWatcher`'s boot-time timeout so
 * it THROWS instead of hanging) leaves the UI fully usable, just without live push. Either way the
 * failure is logged to stderr (`onError`) — never a silent no-watch and never a hung boot.
 */
async function bootWatcher(options: UiServerOptions, sse: SseHub): Promise<WatcherHandle | undefined> {
  const onChange = (e: ChangeEvent): void => sse.broadcast(e);
  const onError = (err: unknown): void => {
    process.stderr.write(`[ui watcher] ${err instanceof Error ? err.message : String(err)}\n`);
  };
  try {
    return options.mode === "dir"
      ? await startWatcher({ mode: "dir", bundle: options.bundle!, onChange, onError })
      : await startWatcher({
          mode: "remote",
          remoteBase: options.remoteBase!,
          apiKey: options.apiKey,
          bootTimeoutMs: options.watcherBootTimeoutMs,
          onChange,
          onError,
        });
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
  const launches = new PageLaunchRegistry();
  const runtime: UiRuntime = {
    launches,
    actions: options.mode === "dir" && options.bundle ? new TrustedActionService(options.bundle, launches, options.actor) : undefined,
    sse: new SseHub(),
    shutdown: new AbortController(),
  };
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
