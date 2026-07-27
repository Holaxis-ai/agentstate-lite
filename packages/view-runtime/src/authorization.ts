import type { BridgeCapability } from "@agentstate-lite/core/page";

export const ACTIVE_VIEW_POLICY_VERSION = "active-view-v1";
export const MAX_ACTIVE_VIEW_BYTES = 512 * 1024;
export const ACTIVE_VIEW_CONTENT_TYPE = "text/html; charset=utf-8";

export interface ViewAuthorizationSubject {
  registryId: string;
  contentVersion: string;
  contentType: string;
  capability: BridgeCapability;
  execution: "active";
  policyVersion: typeof ACTIVE_VIEW_POLICY_VERSION;
}

export interface ViewAuthorizationStore {
  isAuthorized(subject: ViewAuthorizationSubject): Promise<boolean>;
  authorize(subject: ViewAuthorizationSubject): Promise<void>;
}

export function admitActiveView(
  bytes: Uint8Array,
  contentType: string,
): { bytes: Uint8Array; contentType: typeof ACTIVE_VIEW_CONTENT_TYPE } {
  if (bytes.byteLength > MAX_ACTIVE_VIEW_BYTES) {
    throw new Error("active View HTML must be at most 512 KiB");
  }
  const [mediaType, ...parameters] = contentType
    .split(";")
    .map((part) => part.trim().toLowerCase());
  if (mediaType !== "text/html") throw new Error("active View entries must use text/html");
  for (const parameter of parameters) {
    if (parameter && parameter !== "charset=utf-8" && parameter !== 'charset="utf-8"') {
      throw new Error("active View entries may declare only UTF-8 HTML");
    }
  }
  new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return { bytes: bytes.slice(), contentType: ACTIVE_VIEW_CONTENT_TYPE };
}

function stableSubject(subject: ViewAuthorizationSubject): string {
  return JSON.stringify({
    registryId: subject.registryId,
    contentVersion: subject.contentVersion,
    contentType: subject.contentType,
    capability: subject.capability,
    execution: subject.execution,
    policyVersion: subject.policyVersion,
  });
}

/** Process-local fallback. Product hosts may inject a persistent user-controlled store. */
export class SessionViewAuthorizationStore implements ViewAuthorizationStore {
  private readonly authorized = new Set<string>();

  async isAuthorized(subject: ViewAuthorizationSubject): Promise<boolean> {
    return this.authorized.has(stableSubject(subject));
  }

  async authorize(subject: ViewAuthorizationSubject): Promise<void> {
    this.authorized.add(stableSubject(subject));
  }
}
