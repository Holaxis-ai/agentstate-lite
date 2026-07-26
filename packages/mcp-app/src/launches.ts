import { randomBytes } from "node:crypto";
import type { Version } from "@agentstate-lite/core";
import {
  type DocumentSetFieldAction,
  type TrustedActionLaunch,
  type TrustedActionLaunchAuthority,
} from "@agentstate-lite/view-runtime";
import type {
  GeneratedActionDeclaration,
  ResolvedShowViewInput,
  ResolvedViewContent,
  ViewActionDescriptor,
  ViewLaunchPayload,
} from "./contract.js";

interface StoredAction {
  descriptor: ViewActionDescriptor;
  declaration: GeneratedActionDeclaration;
  action: DocumentSetFieldAction;
}

interface StoredLaunch {
  expiresAt: number;
  input: ResolvedShowViewInput;
  content: ResolvedViewContent;
  actions: Map<string, StoredAction>;
}

const DEFAULT_TTL_MS = 60 * 60 * 1000;
const DEFAULT_MAX_LAUNCHES = 256;

function ownVersions(content: ResolvedViewContent): Record<string, Version> {
  const versions: Record<string, Version> = {};
  for (const object of content.objects) {
    Object.defineProperty(versions, object.id, {
      value: object.version,
      enumerable: true,
      configurable: true,
      writable: false,
    });
  }
  return versions;
}

function copyInput(input: ResolvedShowViewInput): ResolvedShowViewInput {
  return {
    title: input.title,
    html: input.html,
    css: input.css,
    objectIds: [...input.objectIds],
    query: input.query ? { ...input.query } : undefined,
    matchedCount: input.matchedCount,
    actions: input.actions?.map((action) => ({ ...action })),
  };
}

/** Bounded launch state for the fixed MCP App shell and the shared governed-action service. */
export class McpViewLaunchRegistry implements TrustedActionLaunchAuthority {
  private readonly launches = new Map<string, StoredLaunch>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly now: () => number;

  constructor(
    ttlMs = DEFAULT_TTL_MS,
    maxEntries = DEFAULT_MAX_LAUNCHES,
    now: () => number = Date.now,
  ) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.now = now;
  }

  mint(input: ResolvedShowViewInput, content: ResolvedViewContent): ViewLaunchPayload {
    this.sweepExpired();
    while (this.launches.size >= Math.max(1, this.maxEntries)) {
      const oldest = this.launches.keys().next().value as string | undefined;
      if (!oldest) break;
      this.revoke(oldest);
    }
    const launchId = randomBytes(32).toString("base64url");
    const actions = new Map<string, StoredAction>();
    for (const declaration of input.actions ?? []) {
      const target = content.objects.find((object) => object.id === declaration.objectId);
      if (!target) {
        throw new Error(
          `action target '${declaration.objectId}' is outside this View's frozen object selection`,
        );
      }
      const actionId = randomBytes(32).toString("base64url");
      const descriptor = {
        actionId,
        label: declaration.label,
        targetId: declaration.objectId,
      };
      actions.set(actionId, {
        descriptor,
        declaration: { ...declaration },
        action: {
          kind: "document.set-field",
          docId: declaration.objectId,
          field: declaration.field,
          value: declaration.value,
          expectedVersion: target.version,
        },
      });
    }
    this.launches.set(launchId, {
      expiresAt: this.now() + this.ttlMs,
      input: copyInput(input),
      content,
      actions,
    });
    return this.payload(launchId)!;
  }

  payload(launchId: string): ViewLaunchPayload | null {
    const launch = this.resolveStored(launchId);
    if (!launch) return null;
    return {
      ...launch.content,
      launch: {
        launchId,
        actions: Array.from(launch.actions.values(), ({ descriptor }) => ({ ...descriptor })),
      },
    };
  }

  input(launchId: string): ResolvedShowViewInput | null {
    const launch = this.resolveStored(launchId);
    return launch ? copyInput(launch.input) : null;
  }

  refresh(launchId: string, content: ResolvedViewContent): ViewLaunchPayload | null {
    const launch = this.resolveStored(launchId);
    if (!launch) return null;
    launch.content = content;
    for (const stored of launch.actions.values()) {
      const target = content.objects.find((object) => object.id === stored.declaration.objectId);
      if (!target) {
        this.revoke(launchId);
        return null;
      }
      stored.action = { ...stored.action, expectedVersion: target.version };
    }
    return this.payload(launchId);
  }

  action(launchId: string, actionId: string): DocumentSetFieldAction | null {
    const launch = this.resolveStored(launchId);
    const action = launch?.actions.get(actionId)?.action;
    return action ? { ...action } : null;
  }

  async resolve(launchId: string): Promise<TrustedActionLaunch | null> {
    const launch = this.resolveStored(launchId);
    if (!launch) return null;
    return {
      launchId,
      capability: "bundle-propose",
      source: {
        registryId: `mcp-ephemeral:${launch.content.presentation.contentHash}`,
        title: launch.content.title,
        registryVersion: launch.content.presentation.contentHash,
        contentVersion: launch.content.presentation.contentHash,
      },
      documentVersions: ownVersions(launch.content),
    };
  }

  revoke(launchId: string): void {
    this.launches.delete(launchId);
  }

  size(): number {
    this.sweepExpired();
    return this.launches.size;
  }

  private resolveStored(launchId: string): StoredLaunch | null {
    const launch = this.launches.get(launchId);
    if (!launch) return null;
    if (this.now() > launch.expiresAt) {
      this.revoke(launchId);
      return null;
    }
    return launch;
  }

  private sweepExpired(): void {
    const now = this.now();
    for (const [launchId, launch] of this.launches) {
      if (now > launch.expiresAt) this.revoke(launchId);
    }
  }
}
