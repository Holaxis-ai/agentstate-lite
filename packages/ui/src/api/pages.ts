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
import { listAllHeads } from "./client.js";
import type { Frontmatter } from "./types.js";

/** `/__ui/config` shape (server `configResponse`). */
export interface UiConfig {
  mode: string;
  remoteUrl: string | null;
  root: string | null;
  name: string;
}

/** A `type: Page` registry doc, projected to the launcher's card fields (provenance included). */
export interface PageEntry {
  id: string;
  version: string;
  title: string;
  entry: string;
  description?: string;
  actor?: string;
  timestamp?: string;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

export async function fetchConfig(): Promise<UiConfig> {
  const res = await fetch("/__ui/config", { credentials: "same-origin" });
  if (!res.ok) throw new Error(`config request failed with status ${res.status}`);
  return (await res.json()) as UiConfig;
}

/** Every `type: Page` registry doc with a usable `entry`, newest-first, projected for the launcher. */
export async function listPages(): Promise<PageEntry[]> {
  const heads = await listAllHeads({ type: "Page" });
  const pages = heads
    .map((h) => pageFromFrontmatter(h.id, h.version, h.frontmatter))
    .filter((p): p is PageEntry => p !== null);
  pages.sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? "") || a.title.localeCompare(b.title));
  return pages;
}

function pageFromFrontmatter(id: string, version: string, fm: Frontmatter): PageEntry | null {
  const entry = str(fm.entry);
  if (!entry) return null;
  return {
    id,
    version,
    title: str(fm.title) ?? id,
    entry,
    description: str(fm.description),
    actor: str(fm.actor),
    timestamp: str(fm.timestamp),
  };
}

/** Mint a nonce for `key` and return the relative page-bytes URL (`/__page/<nonce>`) to load in the iframe. */
export async function mintPageNonce(key: string): Promise<string> {
  const res = await fetch("/__page/mint", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", "X-Requested-With": "agentstate-lite-ui" },
    body: JSON.stringify({ key }),
  });
  if (!res.ok) throw new Error(`page-nonce mint failed with status ${res.status}`);
  const data = (await res.json()) as { url: string };
  return data.url;
}
