/** Browser-side parsing for a usable registered bundle Page/View. */

import { isAnyEntryKey, isAnyRegistryId, isPageTypeName, type PageTypeName } from "@agentstate-lite/core/page";

export {
  isAnyEntryKey,
  isAnyRegistryId,
  isPageEntryKey,
  isPageRegistryId,
  isPageTypeName,
  isViewEntryKey,
  isViewRegistryId,
  PAGE_TYPE_NAMES,
  type PageTypeName,
} from "@agentstate-lite/core/page";

export type BridgeCapability = "none" | "bundle-read";

export interface RegisteredPage {
  id: string;
  entry: string;
  bridge: BridgeCapability;
  /** Which accepted kind name matched — `View` (current) or `Page` (legacy). */
  type: PageTypeName;
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

/** Parse a usable registered Page/View without exposing document contents or executable bytes. */
export function parseRegisteredPage(
  id: unknown,
  frontmatter: Record<string, unknown>,
): RegisteredPage | null {
  if (!isAnyRegistryId(id) || !isPageTypeName(frontmatter.type) || !isAnyEntryKey(frontmatter.entry)) return null;
  return {
    id,
    entry: frontmatter.entry,
    bridge: resolveBridgeCapability(frontmatter.bridge),
    type: frontmatter.type,
    title: stringValue(frontmatter.title) ?? id,
    description: stringValue(frontmatter.description),
    actor: stringValue(frontmatter.actor),
    timestamp: stringValue(frontmatter.timestamp),
  };
}
