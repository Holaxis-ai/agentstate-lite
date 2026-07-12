/** The one browser-side definition of a usable registered bundle Page. */

export type BridgeCapability = "none" | "bundle-read";

export interface RegisteredPage {
  id: string;
  entry: string;
  bridge: BridgeCapability;
  title: string;
  description?: string;
  actor?: string;
  timestamp?: string;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function hasSafeSegments(value: string, prefix: string): boolean {
  if (!value.startsWith(prefix) || value.length === prefix.length) return false;
  if (value.startsWith("/") || /[\\%?#]/.test(value)) return false;
  const segments = value.slice(prefix.length).split("/");
  return segments.every(
    (segment) => segment !== "." && segment !== ".." && /^[A-Za-z0-9._-]+$/.test(segment),
  );
}

/** Strict concept-id grammar for Page registry documents. Nested ids and ordinary dots are valid. */
export function isPageRegistryId(id: unknown): id is string {
  return typeof id === "string" && !id.endsWith(".md") && hasSafeSegments(id, "pages-registry/");
}

/** Strict blob-key grammar for executable Page entries. */
export function isPageEntryKey(entry: unknown): entry is string {
  return typeof entry === "string" && hasSafeSegments(entry, "pages/");
}

/** Only the exact grant string enables bundle reads; every other value fails closed. */
export function resolveBridgeCapability(bridge: unknown): BridgeCapability {
  return bridge === "bundle-read" ? "bundle-read" : "none";
}

/** Parse a usable registered Page without exposing document contents or executable bytes. */
export function parseRegisteredPage(
  id: unknown,
  frontmatter: Record<string, unknown>,
): RegisteredPage | null {
  if (!isPageRegistryId(id) || frontmatter.type !== "Page" || !isPageEntryKey(frontmatter.entry)) return null;
  return {
    id,
    entry: frontmatter.entry,
    bridge: resolveBridgeCapability(frontmatter.bridge),
    title: stringValue(frontmatter.title) ?? id,
    description: stringValue(frontmatter.description),
    actor: stringValue(frontmatter.actor),
    timestamp: stringValue(frontmatter.timestamp),
  };
}
