import { randomBytes } from "node:crypto";
import {
  DocumentNotFoundError,
  KindConformanceError,
  VersionConflict,
  assertSafeConceptId,
  loadKinds,
  mutateDocument,
  readBlob,
  readDocVersioned,
  validateAgainstKind,
  versionOfBytes,
  type Bundle,
  type Frontmatter,
  type KindConvention,
  type ValidationWarning,
  type Version,
} from "@agentstate-lite/core";
import {
  parseRegistration,
  resolveBridgeCapability,
  type BridgeCapability,
  type PageTypeName,
} from "@agentstate-lite/core/page";

export type ActionScalar = string | number | boolean;

export interface DocumentSetFieldAction {
  kind: "document.set-field";
  docId: string;
  field: string;
  value: ActionScalar;
  expectedVersion: Version;
}

export interface PageLaunch {
  launchId: string;
  nonce: string;
  registryId: string;
  registryType: PageTypeName;
  registryVersion: Version;
  registryTitle: string;
  entryKey: string;
  contentType: string;
  contentVersion: Version;
  bytes: Uint8Array;
  capability: BridgeCapability;
  nonceExpiresAt: number;
  expiresAt: number;
}

const DEFAULT_LAUNCH_TTL_MS = 60 * 60 * 1000;
const DEFAULT_NONCE_TTL_MS = 120_000;
const DEFAULT_MAX_LAUNCHES = 256;

/** Bounded, in-memory identity for the exact registry and HTML bytes loaded into one frame. */
export class PageLaunchRegistry {
  private readonly byLaunch = new Map<string, PageLaunch>();
  private readonly byNonce = new Map<string, string>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly now: () => number;
  private readonly nonceTtlMs: number;

  constructor(
    ttlMs = DEFAULT_LAUNCH_TTL_MS,
    maxEntries = DEFAULT_MAX_LAUNCHES,
    now: () => number = Date.now,
    nonceTtlMs = DEFAULT_NONCE_TTL_MS,
  ) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.now = now;
    this.nonceTtlMs = nonceTtlMs;
  }

  mint(input: Omit<PageLaunch, "launchId" | "nonce" | "nonceExpiresAt" | "expiresAt">): PageLaunch {
    this.sweepExpired();
    while (this.byLaunch.size >= Math.max(1, this.maxEntries)) {
      const oldest = this.byLaunch.keys().next().value as string | undefined;
      if (!oldest) break;
      this.revoke(oldest);
    }
    const launchId = randomBytes(32).toString("base64url");
    const nonce = randomBytes(32).toString("base64url");
    const launch: PageLaunch = {
      ...input,
      bytes: input.bytes.slice(),
      launchId,
      nonce,
      nonceExpiresAt: this.now() + this.nonceTtlMs,
      expiresAt: this.now() + this.ttlMs,
    };
    this.byLaunch.set(launchId, launch);
    this.byNonce.set(nonce, launchId);
    return launch;
  }

  resolveLaunch(launchId: string): PageLaunch | null {
    const launch = this.byLaunch.get(launchId);
    if (!launch) return null;
    if (this.now() > launch.expiresAt) {
      this.revoke(launchId);
      return null;
    }
    return launch;
  }

  resolveNonce(nonce: string): PageLaunch | null {
    const launchId = this.byNonce.get(nonce);
    const launch = launchId ? this.resolveLaunch(launchId) : null;
    if (!launch) return null;
    if (this.now() > launch.nonceExpiresAt) {
      this.byNonce.delete(nonce);
      return null;
    }
    return launch;
  }

  revoke(launchId: string): void {
    const launch = this.byLaunch.get(launchId);
    if (!launch) return;
    this.byLaunch.delete(launchId);
    this.byNonce.delete(launch.nonce);
  }

  size(): number {
    this.sweepExpired();
    return this.byLaunch.size;
  }

  private sweepExpired(): void {
    const now = this.now();
    for (const [launchId, launch] of this.byLaunch) {
      if (now > launch.expiresAt) this.revoke(launchId);
    }
  }
}

function ownRecord(source: Record<string, unknown>): Frontmatter {
  const target: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true });
  }
  return target as Frontmatter;
}

function setOwn(record: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(record, key, { value, enumerable: true, configurable: true, writable: true });
}

function scalarEqual(a: unknown, b: ActionScalar): boolean {
  return typeof a === typeof b && a === b;
}

function isActionScalar(value: unknown): value is ActionScalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((key, index) => key === sortedExpected[index]);
}

export function parseDocumentSetFieldAction(value: unknown): DocumentSetFieldAction {
  if (!isPlainRecord(value) || !hasExactKeys(value, ["kind", "docId", "field", "value", "expectedVersion"])) {
    throw new Error("action must contain exactly kind, docId, field, value, and expectedVersion");
  }
  if (value.kind !== "document.set-field") throw new Error("unsupported action kind");
  const docId = typeof value.docId === "string" ? value.docId.trim() : "";
  assertSafeConceptId(docId);
  const field = typeof value.field === "string" ? value.field.trim() : "";
  if (!field || Buffer.byteLength(field, "utf8") > 128) throw new Error("field must be a non-empty string of at most 128 bytes");
  const expectedVersion = typeof value.expectedVersion === "string" ? value.expectedVersion.trim() : "";
  if (!expectedVersion || expectedVersion.length > 256) {
    throw new Error("expectedVersion must be a non-empty string of at most 256 characters");
  }
  const scalar = value.value;
  if (!isActionScalar(scalar) || (typeof scalar === "string" && Buffer.byteLength(scalar, "utf8") > 4096)) {
    throw new Error("value must be a string (at most 4 KiB), finite number, or boolean");
  }
  return { kind: "document.set-field", docId, field, value: scalar, expectedVersion };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isPlainRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function kindDigest(kind: KindConvention): Version {
  return versionOfBytes(stableJson(kind));
}

export async function launchIsCurrent(bundle: Bundle, launch: PageLaunch): Promise<boolean> {
  try {
    const registryRead = await readDocVersioned(bundle, launch.registryId);
    if (registryRead.version !== launch.registryVersion) return false;
    const registration = parseRegistration(registryRead.doc.id, registryRead.doc.frontmatter);
    if (
      !registration ||
      registration.type !== launch.registryType ||
      registration.entry !== launch.entryKey ||
      resolveBridgeCapability(registryRead.doc.frontmatter.bridge) !== launch.capability
    ) {
      return false;
    }
    const blob = await readBlob(bundle, launch.entryKey);
    return blob !== null && blob.version === launch.contentVersion && blob.contentType === launch.contentType;
  } catch {
    return false;
  }
}

export interface ActionConfirmation {
  source: {
    registryId: string;
    title: string;
    registryVersion: Version;
    contentVersion: Version;
  };
  target: { docId: string; title: string; kind: string; version: Version };
  field: string;
  before: ActionScalar | null;
  after: ActionScalar;
  actor: string;
  timestamp: string;
}

export type ActionTerminalStatus = "committed" | "unchanged" | "cancelled" | "conflict" | "revoked" | "expired" | "rejected" | "failed";

export interface ActionTerminalResult {
  status: ActionTerminalStatus;
  action: "document.set-field";
  docId?: string;
  field?: string;
  changed?: boolean;
  version?: Version;
  warnings?: ValidationWarning[];
  confirmed?: boolean;
  expectedVersion?: Version;
  actualVersion?: Version | null;
  source?: { registryId: string; registryVersion: Version; contentVersion: Version };
  message?: string;
}

export type ActionPrepareResult =
  | { status: "prepared"; approvalToken: string; expiresAt: number; confirmation: ActionConfirmation }
  | ActionTerminalResult;

interface PendingApproval {
  token: string;
  expiresAt: number;
  launchId: string;
  action: DocumentSetFieldAction;
  timestamp: string;
  targetTitle: string;
  targetType: string;
  before: ActionScalar | null;
  kindId: string;
  kindVersion: Version;
  kindDigest: Version;
}

const DEFAULT_APPROVAL_TTL_MS = 120_000;
const DEFAULT_MAX_APPROVALS = 128;

export class TrustedActionService {
  private readonly pending = new Map<string, PendingApproval>();
  private readonly bundle: Bundle;
  private readonly launches: PageLaunchRegistry;
  private readonly actor: string | undefined;
  private readonly now: () => number;
  private readonly approvalTtlMs: number;
  private readonly maxApprovals: number;

  constructor(
    bundle: Bundle,
    launches: PageLaunchRegistry,
    actor: string | undefined,
    now: () => number = Date.now,
    approvalTtlMs = DEFAULT_APPROVAL_TTL_MS,
    maxApprovals = DEFAULT_MAX_APPROVALS,
  ) {
    this.bundle = bundle;
    this.launches = launches;
    this.actor = actor;
    this.now = now;
    this.approvalTtlMs = approvalTtlMs;
    this.maxApprovals = maxApprovals;
  }

  async prepare(launchId: string, rawAction: unknown): Promise<ActionPrepareResult> {
    const rejected = (message: string): ActionTerminalResult => ({ status: "rejected", action: "document.set-field", message });
    const actor = this.actor?.trim();
    if (!actor) return rejected("set an action actor with ui --actor or AGENTSTATE_LITE_ACTOR before proposing writes");
    const launch = this.launches.resolveLaunch(launchId);
    if (!launch || launch.capability !== "bundle-propose" || !(await launchIsCurrent(this.bundle, launch))) {
      if (launch) this.launches.revoke(launch.launchId);
      return { status: "revoked", action: "document.set-field", message: "the source View is no longer the exact launched content" };
    }

    let action: DocumentSetFieldAction;
    try {
      action = parseDocumentSetFieldAction(rawAction);
    } catch (error) {
      return rejected(error instanceof Error ? error.message : String(error));
    }
    if (["type", "timestamp", "actor"].includes(action.field)) return rejected(`field '${action.field}' is shell-managed and cannot be proposed`);

    let target: Awaited<ReturnType<typeof readDocVersioned>>;
    try {
      target = await readDocVersioned(this.bundle, action.docId);
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return rejected(`document '${action.docId}' does not exist`);
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }
    if (target.version !== action.expectedVersion) {
      return {
        status: "conflict",
        action: "document.set-field",
        docId: action.docId,
        field: action.field,
        expectedVersion: action.expectedVersion,
        actualVersion: target.version,
      };
    }

    let registry: Awaited<ReturnType<typeof loadKinds>>;
    try {
      registry = await loadKinds(this.bundle);
    } catch (error) {
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }
    const targetType = String(target.doc.frontmatter.type ?? "");
    const kind = registry.kinds.get(targetType);
    if (!kind) return rejected(`document '${action.docId}' is not governed by a declared Kind`);
    if (!kind.fields.required.includes(action.field) && !kind.fields.optional.includes(action.field)) {
      return rejected(`field '${action.field}' is not declared by the '${kind.governs}' Kind`);
    }
    const beforeRaw = target.doc.frontmatter[action.field];
    let before: ActionScalar | null;
    if (beforeRaw === undefined || beforeRaw === null) {
      before = null;
    } else if (!isActionScalar(beforeRaw)) {
      return rejected(`field '${action.field}' currently contains a non-scalar value; trusted scalar actions cannot replace it`);
    } else {
      before = beforeRaw;
    }
    if (scalarEqual(beforeRaw, action.value)) {
      return {
        status: "unchanged",
        action: "document.set-field",
        docId: action.docId,
        field: action.field,
        changed: false,
        version: target.version,
        confirmed: false,
        source: { registryId: launch.registryId, registryVersion: launch.registryVersion, contentVersion: launch.contentVersion },
      };
    }

    const timestamp = new Date(this.now()).toISOString();
    const candidate = ownRecord(target.doc.frontmatter);
    setOwn(candidate, action.field, action.value);
    setOwn(candidate, "timestamp", timestamp);
    setOwn(candidate, "actor", actor);
    const violations = validateAgainstKind({ id: action.docId, frontmatter: candidate, body: target.doc.body }, kind);
    if (violations.length > 0) return rejected(violations.map((warning) => warning.message).join("; "));

    let kindVersion: Version;
    try {
      kindVersion = (await readDocVersioned(this.bundle, kind.id)).version;
    } catch (error) {
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }

    this.sweepExpired();
    if (this.pending.size >= this.maxApprovals) return rejected("the trusted shell has too many pending confirmations; cancel one and try again");
    const token = randomBytes(32).toString("base64url");
    const expiresAt = this.now() + this.approvalTtlMs;
    this.pending.set(token, {
      token,
      expiresAt,
      launchId,
      action,
      timestamp,
      targetTitle: typeof target.doc.frontmatter.title === "string" ? target.doc.frontmatter.title : action.docId,
      targetType,
      before,
      kindId: kind.id,
      kindVersion,
      kindDigest: kindDigest(kind),
    });
    return {
      status: "prepared",
      approvalToken: token,
      expiresAt,
      confirmation: {
        source: {
          registryId: launch.registryId,
          title: launch.registryTitle,
          registryVersion: launch.registryVersion,
          contentVersion: launch.contentVersion,
        },
        target: { docId: action.docId, title: this.pending.get(token)!.targetTitle, kind: targetType, version: target.version },
        field: action.field,
        before,
        after: action.value,
        actor,
        timestamp,
      },
    };
  }

  cancel(token: string): ActionTerminalResult {
    const pending = this.consume(token);
    return pending
      ? { status: "cancelled", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, changed: false, confirmed: false }
      : { status: "expired", action: "document.set-field", message: "the approval is unknown or expired" };
  }

  async commit(token: string): Promise<ActionTerminalResult> {
    const pending = this.consume(token);
    if (!pending) return { status: "expired", action: "document.set-field", message: "the approval is unknown or expired" };
    if (this.now() > pending.expiresAt) return { status: "expired", action: "document.set-field", docId: pending.action.docId, field: pending.action.field };
    const launch = this.launches.resolveLaunch(pending.launchId);
    if (!launch || launch.capability !== "bundle-propose" || !(await launchIsCurrent(this.bundle, launch))) {
      if (launch) this.launches.revoke(launch.launchId);
      return { status: "revoked", action: "document.set-field", docId: pending.action.docId, field: pending.action.field };
    }

    try {
      const target = await readDocVersioned(this.bundle, pending.action.docId);
      if (target.version !== pending.action.expectedVersion) {
        return {
          status: "conflict",
          action: "document.set-field",
          docId: pending.action.docId,
          field: pending.action.field,
          expectedVersion: pending.action.expectedVersion,
          actualVersion: target.version,
        };
      }
      const registry = await loadKinds(this.bundle);
      const kind = registry.kinds.get(pending.targetType);
      if (!kind || kind.id !== pending.kindId) return { status: "revoked", action: "document.set-field", message: "the governing Kind changed" };
      const currentKindVersion = (await readDocVersioned(this.bundle, kind.id)).version;
      if (currentKindVersion !== pending.kindVersion || kindDigest(kind) !== pending.kindDigest) {
        return { status: "revoked", action: "document.set-field", message: "the governing Kind changed" };
      }

      const result = await mutateDocument({
        bundle: this.bundle,
        id: pending.action.docId,
        mode: "patch",
        registry,
        strict: true,
        actor: this.actor!.trim(),
        persistActor: true,
        expectedVersion: pending.action.expectedVersion,
        buildCandidate: (existing) => {
          if (!existing) throw new DocumentNotFoundError(pending.action.docId);
          const frontmatter = ownRecord(existing.frontmatter);
          setOwn(frontmatter, pending.action.field, pending.action.value);
          setOwn(frontmatter, "timestamp", pending.timestamp);
          return { frontmatter, body: existing.body };
        },
      });
      return {
        status: "committed",
        action: "document.set-field",
        docId: pending.action.docId,
        field: pending.action.field,
        changed: result.changed,
        version: result.version,
        warnings: result.warnings,
        confirmed: true,
        source: { registryId: launch.registryId, registryVersion: launch.registryVersion, contentVersion: launch.contentVersion },
      };
    } catch (error) {
      if (error instanceof VersionConflict) {
        return {
          status: "conflict",
          action: "document.set-field",
          docId: pending.action.docId,
          field: pending.action.field,
          expectedVersion: error.expected ?? pending.action.expectedVersion,
          actualVersion: error.actual,
        };
      }
      if (error instanceof DocumentNotFoundError) {
        return { status: "conflict", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, expectedVersion: pending.action.expectedVersion, actualVersion: null };
      }
      if (error instanceof KindConformanceError) {
        return { status: "rejected", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, message: error.message };
      }
      return { status: "failed", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, message: error instanceof Error ? error.message : String(error) };
    }
  }

  size(): number {
    this.sweepExpired();
    return this.pending.size;
  }

  private consume(token: string): PendingApproval | undefined {
    const pending = this.pending.get(token);
    if (pending) this.pending.delete(token);
    return pending;
  }

  private sweepExpired(): void {
    const now = this.now();
    for (const [token, pending] of this.pending) {
      if (now > pending.expiresAt) this.pending.delete(token);
    }
  }
}
