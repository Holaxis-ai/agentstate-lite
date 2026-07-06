/**
 * Reduce an OKF Knowledge Bundle to the graph payload the static visualizer
 * embeds. This is a PURE CONSUMER of `@agentstate-lite/core`: the bundle walk,
 * frontmatter parsing, and cross-link resolution all live in core (one engine),
 * so the viewer owns only the node/edge/body projection and — in template.ts —
 * the HTML rendering.
 *
 * OKF grounding (all enforced by core): reserved `index.md`/`log.md` are not
 * concepts and are excluded (§3.1); graph edges are ONLY explicit body
 * cross-links, relative OR absolute (§5); backlinks are DERIVED client-side by
 * reversing this edge set, never stored.
 */
import { query, parseLinksFromDoc, type Bundle, type OkfDocument } from "@agentstate-lite/core";

/** A concept node embedded in the visualizer payload. */
export interface BundleNode {
  /** Concept ID: bundle-relative path minus `.md`. */
  id: string;
  /** Frontmatter `type` (OKF's only required field); drives node color. */
  type: string;
  /** Display title (falls back to the id when absent). */
  title: string;
  /** One-sentence description, if present. */
  description: string;
  /** Canonical URI of the underlying asset; empty for abstract concepts. */
  resource: string;
  /** Cross-cutting tags. */
  tags: string[];
  /** Body length in characters; the visualizer scales node size by it. */
  size: number;
}

/** A resolved directed cross-link (untyped, per OKF §5.3). */
export interface BundleEdge {
  /** Source Concept ID. */
  source: string;
  /** Target Concept ID (guaranteed to be an existing node). */
  target: string;
}

/** The complete payload embedded into the single-file visualizer. */
export interface BundleData {
  /** Display label for the bundle. */
  name: string;
  /** Concept nodes. */
  nodes: BundleNode[];
  /** Resolved edges among existing nodes. */
  edges: BundleEdge[];
  /** Concept ID -> raw markdown body, rendered client-side with marked.js. */
  bodies: Record<string, string>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}

/** Basename of a filesystem path (bundle display label fallback). */
function baseName(root: string): string {
  const parts = root.replace(/[/\\]+$/, "").split(/[/\\]/);
  return parts[parts.length - 1] || "bundle";
}

/**
 * Read a bundle (via core `query`) and reduce it to a {@link BundleData} payload:
 * concept nodes (reserved files excluded by core), resolved edges among existing
 * nodes (broken links and self-links dropped for the graph, but valid per OKF §5),
 * and raw bodies for client-side rendering.
 *
 * `source` is either a bundle-root path (the common filesystem case) OR an opened
 * {@link Bundle} handle — so a non-filesystem store (e.g. an in-memory or future
 * remote adapter) can be visualized through the SAME code path, not just a directory
 * on disk. The engine keeps all OKF semantics; the viewer stays a pure consumer.
 */
export async function buildBundleData(source: string | Bundle, name?: string): Promise<BundleData> {
  const bundle: Bundle = typeof source === "string" ? { root: source } : source;
  const docs: OkfDocument[] = await query(bundle);

  const nodes: BundleNode[] = [];
  const bodies: Record<string, string> = {};
  for (const doc of docs) {
    nodes.push({
      id: doc.id,
      type: asString(doc.frontmatter.type) || "Untyped",
      title: asString(doc.frontmatter.title) || doc.id,
      description: asString(doc.frontmatter.description),
      resource: asString(doc.frontmatter.resource),
      tags: asStringArray(doc.frontmatter.tags),
      size: doc.body.length,
    });
    bodies[doc.id] = doc.body;
  }

  const known = new Set(nodes.map((n) => n.id));
  const edges: BundleEdge[] = [];
  const seen = new Set<string>();
  for (const doc of docs) {
    for (const link of parseLinksFromDoc(doc)) {
      // Broken links are valid (OKF §5), but a graph edge needs a real, non-self node.
      if (!known.has(link.to) || link.to === doc.id) continue;
      const key = `${doc.id} ${link.to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: doc.id, target: link.to });
    }
  }

  return { name: name ?? baseName(bundle.root), nodes, edges, bodies };
}
