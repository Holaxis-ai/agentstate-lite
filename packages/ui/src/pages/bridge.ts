/**
 * The postMessage bridge, shell side (tasks/ui-pages-spike, "The bridge"). A sandboxed,
 * opaque-origin page cannot reach the data API directly (no same-origin, `connect-src 'none'`);
 * its ONLY channel is `postMessage` to the shell, which brokers a NARROW, READ-ONLY, versioned
 * (`bridge: 'v0'`) read-only data set plus registered-Page shell navigation on its behalf.
 *
 * READ-ONLY BY CONSTRUCTION: there is no write/delete/update handler — an unknown request type
 * (including anything mutating) returns an error reply. v0 exposes data operations `hello`,
 * `query`, `read`, `edges`, `subscribe`, plus the `open-page` shell action. This module is the pure router ({@link handleBridgeRequest}); the
 * DOM plumbing (source validation, posting, SSE fan-in, hot-reload) lives in
 * `../views/PageFrame.tsx`.
 *
 * ENFORCED CAPABILITY (designs/page-model-and-viewer-deprecation): a page's Page-convention
 * `bridge` field — `none | bundle-read | bundle-propose` — gates bundle-data operations. A `none` page may
 * navigate to another registered Page but gets an error reply for every data request. The data
 * gate lives HERE, in the router, and is enforced by the
 * caller passing the framed page's {@link BridgeCapability} — never by anything the sandboxed
 * page itself claims.
 */
import { isTerminal } from "@agentstate-lite/core/kinds";
import type { KindConvention } from "@agentstate-lite/core/kinds";
import type { DocHead, Edge, ReadDocResponse } from "../api/types.js";
import { isAnyRegistryId, type BridgeCapability } from "./registry.js";

export const BRIDGE_PROTOCOL = "v0";

/** A page's bridge capability (the Page convention's `bridge` field), as enforced by the shell. */
export { resolveBridgeCapability } from "./registry.js";
export type { BridgeCapability } from "./registry.js";

/** A page->shell request. `bridge`/`type` are always present; `id` correlates the reply; other keys are per-type. */
export interface BridgeRequest {
  bridge: string;
  id?: string;
  type: string;
  params?: unknown;
  docId?: unknown;
  pageId?: unknown;
}

/** Bridge `query` params: server-side `type`/`prefix`, then shell-side `field` (k=v, comma=OR), `open`, `limit` post-filters. */
export interface QueryParams {
  type?: string;
  prefix?: string;
  field?: string;
  open?: boolean;
  limit?: number;
}

/** Bridge `edges` params — the SAME selector shape core's `queryEdges` defines: `from`/`to` accept an id, a trailing-slash prefix, or an array-union of either (AND across the two facets); `text` is exact-match. */
export interface EdgeParams {
  from?: string | string[];
  to?: string | string[];
  text?: string;
}

/** What the shell can do on a page's behalf — READ ONLY. Injected so the router is testable without the DOM/network. */
export interface BridgeDeps {
  config: () => Promise<{ root: string | null; name: string; mode: string }>;
  /** Fetch doc heads by server-side facets (`type`/`prefix`); the router applies `field`/`open`/`limit` after. */
  query: (params: { type?: string; prefix?: string }) => Promise<DocHead[]>;
  read: (docId: string) => Promise<ReadDocResponse>;
  /** The bundle's kind registry (server-loaded via core's `loadKinds`) — feeds `open`'s terminal derivation. Only consulted when a query asks `open: true`. */
  kinds: () => Promise<KindConvention[]>;
  /** The bundle's derived edge list (server-loaded via core's `queryEdges`) — the general graph primitive backing backlinks (`{to: docId}`) and "contains" queries (`{from: itemId, text: "contains"}`) alike. */
  edges: (params: EdgeParams) => Promise<Edge[]>;
  /** Validate one caller-supplied id as a usable registered Page; exposes no target metadata. */
  resolvePage: (pageId: string) => Promise<boolean>;
}

/** The router's decision: a reply object to post back (or `null` to ignore a non-bridge message), and whether this was a `subscribe` (the caller then streams `change` events to it). */
export interface BridgeOutcome {
  reply: Record<string, unknown> | null;
  subscribed?: boolean;
  openPageId?: string;
}

function isBridgeRequest(msg: unknown): msg is BridgeRequest {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as { bridge?: unknown }).bridge === BRIDGE_PROTOCOL &&
    typeof (msg as { type?: unknown }).type === "string"
  );
}

function ok(id: string | undefined, type: string, result: unknown): Record<string, unknown> {
  return { bridge: BRIDGE_PROTOCOL, id, type: `${type}:result`, result };
}

function fail(id: string | undefined, code: string, message: string): Record<string, unknown> {
  return { bridge: BRIDGE_PROTOCOL, id, type: "error", error: { code, message } };
}

/** Parse the loosely-typed `params` object of a `query` request into a {@link QueryParams}. */
export function normalizeQueryParams(raw: unknown): QueryParams {
  const p = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const out: QueryParams = {};
  if (typeof p.type === "string" && p.type.trim()) out.type = p.type.trim();
  if (typeof p.prefix === "string" && p.prefix.trim()) out.prefix = p.prefix.trim();
  if (typeof p.field === "string" && p.field.trim()) out.field = p.field.trim();
  if (p.open === true) out.open = true;
  if (typeof p.limit === "number" && Number.isFinite(p.limit) && p.limit >= 0) out.limit = Math.floor(p.limit);
  return out;
}

/** Sanitize one `from`/`to` facet from postMessage JSON: a string, an array of strings, or absent — trimmed, blanks dropped, and an entirely-blank result treated as "no restriction" (mirrors `normalizeQueryParams`'s own drop-if-blank posture, never core CLI's "an empty selector is a USAGE error" — a page's JSON has no human to report a typo to). */
function normalizeSelector(raw: unknown): string | string[] | undefined {
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? t : undefined;
  }
  if (Array.isArray(raw)) {
    const vals = raw
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);
    return vals.length > 0 ? vals : undefined;
  }
  return undefined;
}

/** Parse the loosely-typed `params` object of an `edges` request into an {@link EdgeParams} — the same selector shape core's `queryEdges` defines. */
export function normalizeEdgeParams(raw: unknown): EdgeParams {
  const p = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const out: EdgeParams = {};
  const from = normalizeSelector(p.from);
  if (from !== undefined) out.from = from;
  const to = normalizeSelector(p.to);
  if (to !== undefined) out.to = to;
  if (typeof p.text === "string" && p.text.trim()) out.text = p.text.trim();
  return out;
}

/**
 * Apply the shell-side `field` (k=v, comma=OR), `open`, and `limit` filters to server-returned
 * rows. Pure. `open` mirrors `list --open` exactly (gate 3: one registry, one derivation): a row
 * is dropped iff its OWN kind — the convention governing its `type`, from the bundle's registry —
 * marks the row's current field value(s) terminal (core's `isTerminal`). A row with no governing
 * kind is kept, and a bundle where no kind declares a terminal set filters nothing.
 */
export function applyRowFilters(rows: DocHead[], params: QueryParams, kinds: KindConvention[] = []): DocHead[] {
  let out = rows;
  if (params.field) {
    const eq = params.field.indexOf("=");
    if (eq > 0) {
      const key = params.field.slice(0, eq).trim();
      const values = params.field
        .slice(eq + 1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      out = out.filter((r) => values.includes(String(r.frontmatter[key] ?? "")));
    }
  }
  if (params.open) {
    const byGoverns = new Map(kinds.map((k) => [k.governs, k]));
    out = out.filter((r) => {
      const kind = byGoverns.get(String(r.frontmatter.type ?? ""));
      return !kind || !isTerminal(kind, r.frontmatter);
    });
  }
  // `limit > 0` caps; `limit: 0` (and absent) means UNLIMITED — matching the CLI's documented
  // `list --limit 0 = unlimited` contract (commands/list.ts). Slicing at 0 would silently return
  // an empty result with no error, exactly the footgun a page author hits by passing 0 for "all".
  if (typeof params.limit === "number" && params.limit > 0) out = out.slice(0, params.limit);
  return out;
}

/**
 * Route ONE page->shell message. Returns `{ reply: null }` for anything that is not a valid v0
 * bridge request (the caller drops it). Every handler is read-only; an unrecognized `type` — which
 * is how any would-be mutation arrives, since none is defined — yields an error reply.
 *
 * `open-page` is handled before the data-capability gate. For every other type, `capability`
 * gates the switch below: a page whose capability is not exactly
 * `"bundle-read"` (the fail-closed default, `"none"`) gets a `FORBIDDEN` error reply for every
 * data request, without a single data-dep call — the enforced content/data-page split.
 */
export async function handleBridgeRequest(
  msg: unknown,
  deps: BridgeDeps,
  capability: BridgeCapability = "none",
): Promise<BridgeOutcome> {
  if (!isBridgeRequest(msg)) return { reply: null };
  const { id, type } = msg;
  if (type === "open-page") {
    if (!isAnyRegistryId(msg.pageId)) {
      return { reply: fail(id, "USAGE", "open-page requires a valid views-registry/<id> (or legacy pages-registry/<id>) pageId") };
    }
    try {
      if (!(await deps.resolvePage(msg.pageId))) {
        return { reply: fail(id, "NOT_FOUND", `page '${msg.pageId}' is not a usable registered Page`) };
      }
      return { reply: null, openPageId: msg.pageId };
    } catch (err) {
      return { reply: fail(id, "RUNTIME", err instanceof Error ? err.message : String(err)) };
    }
  }
  if (capability !== "bundle-read" && capability !== "bundle-propose") {
    return { reply: fail(id, "FORBIDDEN", "this page declares bridge: none — no bundle access") };
  }
  try {
    switch (type) {
      case "hello": {
        const c = await deps.config();
        return { reply: ok(id, type, { bundle: { root: c.root, name: c.name }, mode: c.mode, protocol: BRIDGE_PROTOCOL, grant: capability === "bundle-propose" ? "propose" : "read" }) };
      }
      case "query": {
        const params = normalizeQueryParams(msg.params);
        const rows = await deps.query({ type: params.type, prefix: params.prefix });
        const filtered = applyRowFilters(rows, params, params.open ? await deps.kinds() : []);
        return { reply: ok(id, type, { rows: filtered, count: filtered.length }) };
      }
      case "read": {
        const docId = typeof msg.docId === "string" ? msg.docId : "";
        if (!docId) return { reply: fail(id, "USAGE", "read requires a docId string") };
        const doc = await deps.read(docId);
        return { reply: ok(id, type, doc) };
      }
      case "edges": {
        const params = normalizeEdgeParams(msg.params);
        const edges = await deps.edges(params);
        return { reply: ok(id, type, { edges, count: edges.length }) };
      }
      case "subscribe": {
        return { reply: ok(id, type, { ok: true }), subscribed: true };
      }
      default:
        return { reply: fail(id, "USAGE", `unknown bridge request '${type}' (v0: open-page; read-only data: hello, query, read, edges, subscribe)`) };
    }
  } catch (err) {
    return { reply: fail(id, "RUNTIME", err instanceof Error ? err.message : String(err)) };
  }
}

/** Build the `change` event the shell pushes to a subscribed iframe when docs move (server-initiated; no request `id`). */
export function changeMessage(changes: { id: string; version: string }[], removed: string[]): Record<string, unknown> {
  return { bridge: BRIDGE_PROTOCOL, type: "change", event: { changes, removed } };
}
