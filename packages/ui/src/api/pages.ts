/**
 * Pages-spike API surface (tasks/ui-pages-spike), layered on the same-origin `/v0/*` client
 * (`client.ts`) plus two shell-only local endpoints the pages server adds:
 *   - `GET /__ui/config` — bundle summary for the launcher + the bridge `hello` reply.
 *   - `POST /__page/mint` — exchange a page's blob key for a short-lived nonce URL; the launcher
 *     sets that URL as the sandboxed iframe's `src`. Session-gated (cookie + X-Requested-With),
 *     so a page — which holds neither — can never mint its own.
 *
 * A page's HTML never rides the model/query path: only its registry doc (frontmatter) is read
 * here; the bytes travel opaquely through the nonce route into the iframe.
 */
import { getDoc, listAllHeads, parseErrorEnvelope } from "./client.js";
import type { Edge, EdgesResponse, Frontmatter } from "./types.js";
import type { KindConvention } from "@agentstate-lite/core/kinds";
import type { ActionConfirmation, ActionPrepareResult, ActionTerminalResult, DocumentSetFieldAction, SharingSummary, WorkspaceSummaryEntry } from "@agentstate-lite/ui-server";
import { PAGE_TYPE_NAMES, parseRegisteredPage, type BridgeCapability } from "../pages/registry.js";

/** `/__ui/config` shape (server `configResponse`). `sharing`/`workspaces` are ui-server's plain data shapes (type-only import — no runtime dependency), CLI-injected in dir mode. */
export interface UiConfig {
  mode: string;
  remoteUrl: string | null;
  root: string | null;
  name: string;
  sharing: SharingSummary | null;
  workspaces: WorkspaceSummaryEntry[];
}

/** A `type: View` registry doc, projected to the launcher's card fields (provenance included). */
export interface PageEntry {
  id: string;
  version: string;
  title: string;
  entry: string;
  description?: string;
  actor?: string;
  timestamp?: string;
  /** The page's ENFORCED bridge capability (see `../pages/bridge.js`) — groups the launcher. */
  bridge: BridgeCapability;
}

export async function fetchConfig(): Promise<UiConfig> {
  const res = await fetch("/__ui/config", { credentials: "same-origin" });
  if (!res.ok) throw await parseErrorEnvelope(res);
  return (await res.json()) as UiConfig;
}

/**
 * Every valid `type: View` registration, newest-first, projected for the launcher. Validity is
 * core's `parseRegistration` (via {@link pageFromFrontmatter} -> `parseRegisteredPage`) — the
 * SAME predicate the server's mint/serve allowlist consumes. The wire query takes ONE type, so
 * the accepted names ride `PAGE_TYPE_NAMES` (exactly `View` post-removal — a legacy `type: Page`
 * doc is never listed; the CLI's `status` legacy_naming finding is its diagnostic).
 *
 * Failure policy (matches the server's allowlist enumeration): if ANY per-type query fails, the
 * WHOLE listing fails (`Promise.all` rejects) — never a partial launcher that hides one kind while
 * the mint route still errors, or vice versa.
 */
export async function listPages(): Promise<PageEntry[]> {
  const heads = (await Promise.all(PAGE_TYPE_NAMES.map((type) => listAllHeads({ type })))).flat();
  const pages = heads
    .map((h) => pageFromFrontmatter(h.id, h.version, h.frontmatter))
    .filter((p): p is PageEntry => p !== null);
  pages.sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? "") || a.title.localeCompare(b.title));
  return pages;
}

/** Exported for the `bridge` fail-closed-default unit test (pages.test.ts) — not otherwise a public API. */
export function pageFromFrontmatter(id: string, version: string, fm: Frontmatter): PageEntry | null {
  const page = parseRegisteredPage(id, fm);
  if (!page) return null;
  return {
    id: page.id,
    version,
    title: page.title,
    entry: page.entry,
    description: page.description,
    actor: page.actor,
    timestamp: page.timestamp,
    bridge: page.bridge,
  };
}

/** Narrow navigation resolver: return only whether an id is a usable registered Page. */
export async function resolvePageTarget(pageId: string): Promise<boolean> {
  try {
    const { doc } = await getDoc(pageId);
    return parseRegisteredPage(doc.id, doc.frontmatter) !== null;
  } catch {
    return false;
  }
}

/**
 * `GET /__ui/kinds` — the bundle's kind registry, serialized by the server from core's
 * `loadKinds` (gate 3: ONE registry; the browser consumes it, never re-implements discovery).
 * Feeds the bridge's `open` filter. Cached until {@link invalidateKinds}; errors yield an empty
 * registry (=> `open` filters nothing — `list --open`'s posture on a terminal-free bundle).
 */
let kindsCache: Promise<KindConvention[]> | null = null;

export function fetchKinds(): Promise<KindConvention[]> {
  kindsCache ??= (async () => {
    try {
      const res = await fetch("/__ui/kinds", { credentials: "same-origin" });
      if (!res.ok) return [];
      const body = (await res.json()) as { kinds?: KindConvention[] };
      return Array.isArray(body.kinds) ? body.kinds : [];
    } catch {
      return [];
    }
  })();
  return kindsCache;
}

/** Drop the cached kind registry when a `conventions/` doc moved (`ids` = changed+removed doc ids from a change event), or unconditionally when `ids` is omitted (the SSE-resync case: anything may have changed during the gap). */
export function invalidateKinds(ids?: string[]): void {
  if (ids === undefined || ids.some((id) => id.startsWith("conventions/"))) kindsCache = null;
}

/**
 * `GET /__ui/edges?from=&to=&text=` — the bundle's derived edge list (core's `queryEdges`,
 * server-proxied), for the bridge's `edges` request. `from`/`to` each accept an id, a
 * trailing-slash prefix, or an array-union of either — sent as repeated query params (the
 * server's `EdgeFilter` union, mirroring `link list --from/--to`); `text` is exact-match. Unlike
 * `fetchKinds` (an auxiliary display filter, best-effort), this is primary data like `query`/`read`
 * — a non-2xx throws the SAME typed {@link ApiError} they do, so a dead session (403) reaches the
 * bridge's error reply / the interceptor instead of masquerading as "zero edges".
 */
export async function fetchEdges(params: { from?: string | string[]; to?: string | string[]; text?: string }): Promise<Edge[]> {
  const query = new URLSearchParams();
  for (const from of toArray(params.from)) query.append("from", from);
  for (const to of toArray(params.to)) query.append("to", to);
  if (params.text) query.set("text", params.text);
  const res = await fetch(`/__ui/edges?${query.toString()}`, { credentials: "same-origin" });
  if (!res.ok) throw await parseErrorEnvelope(res);
  const body = (await res.json()) as EdgesResponse;
  return Array.isArray(body.edges) ? body.edges : [];
}

function toArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

/** Resolve one registry doc to an immutable frame launch and its nonce-gated byte URL. */
export async function mintPageNonce(registryId: string): Promise<{ url: string; launchId: string }> {
  const res = await fetch("/__page/mint", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", "X-Requested-With": "agentstate-lite-ui" },
    body: JSON.stringify({ registryId }),
  });
  if (!res.ok) throw await parseErrorEnvelope(res);
  return (await res.json()) as { url: string; launchId: string };
}

async function postTrustedAction<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", "X-Requested-With": "agentstate-lite-ui" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorEnvelope(res);
  return (await res.json()) as T;
}

export function prepareTrustedAction(launchId: string, action: DocumentSetFieldAction): Promise<ActionPrepareResult> {
  return postTrustedAction("/__ui/actions/prepare", { launchId, action });
}

export function commitTrustedAction(approvalToken: string): Promise<ActionTerminalResult> {
  return postTrustedAction("/__ui/actions/commit", { approvalToken });
}

export function cancelTrustedAction(approvalToken: string): Promise<ActionTerminalResult> {
  return postTrustedAction("/__ui/actions/cancel", { approvalToken });
}

export type { ActionConfirmation, ActionPrepareResult, ActionTerminalResult, DocumentSetFieldAction, SharingSummary, WorkspaceSummaryEntry };
