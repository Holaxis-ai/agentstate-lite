/** Browser-side parsing for a usable registered bundle Page. */

import { isPageEntryKey, isPageRegistryId } from "@agentstate-lite/core/page";

export { isPageEntryKey, isPageRegistryId } from "@agentstate-lite/core/page";

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
