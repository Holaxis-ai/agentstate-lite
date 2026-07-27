import {
  applyQuerySelectionFilters,
  loadKinds,
  queryEdges,
  queryHeads,
  readDocVersioned,
  type Bundle,
  type HeadResult,
  type KindConvention,
  type QuerySelectionParams,
} from "@agentstate-lite/core";
import { isAnyRegistryId, parseRegistration, type BridgeCapability } from "@agentstate-lite/core/page";

export const BRIDGE_PROTOCOL = "v0";
export const ACTION_BRIDGE_PROTOCOL = "v1";

const MAX_REQUEST_ID_BYTES = 128;
const MAX_DOC_ID_BYTES = 1024;
const MAX_SELECTOR_BYTES = 1024;
const MAX_SELECTOR_VALUES = 32;
const MAX_QUERY_ROWS = 500;
const MAX_EDGE_ROWS = 1_000;
const MAX_DOCUMENT_BODY_BYTES = 1024 * 1024;
const MAX_REPLY_BYTES = 2 * 1024 * 1024;

export interface BridgeLaunch {
  launchId: string;
  capability: BridgeCapability;
}

export interface BridgeLaunchAuthority {
  resolve(launchId: string, requireAuthorization: boolean): Promise<BridgeLaunch | null>;
  revoke(launchId: string): void;
}

export interface BridgeConfig {
  root: string | null;
  name: string;
  mode: string;
}

export interface BridgeOutcome {
  reply: Record<string, unknown> | null;
  subscribed?: boolean;
  openPageId?: string;
}

interface BaseRequest {
  bridge: typeof BRIDGE_PROTOCOL;
  id: string;
  type: "hello" | "query" | "read" | "edges" | "subscribe";
}

interface HelloRequest extends BaseRequest {
  type: "hello";
}

interface QueryRequest extends BaseRequest {
  type: "query";
  params: QuerySelectionParams;
}

interface ReadRequest extends BaseRequest {
  type: "read";
  docId: string;
}

export interface EdgeParams {
  from?: string | string[];
  to?: string | string[];
  text?: string;
}

interface EdgesRequest extends BaseRequest {
  type: "edges";
  params: EdgeParams;
}

interface SubscribeRequest extends BaseRequest {
  type: "subscribe";
}

interface OpenPageRequest {
  bridge: typeof BRIDGE_PROTOCOL;
  type: "open-page";
  id?: string;
  pageId: string;
}

interface ReadVersionedRequest {
  bridge: typeof ACTION_BRIDGE_PROTOCOL;
  type: "read-versioned";
  id: string;
  docId: string;
}

type ParsedBridgeRequest =
  | HelloRequest
  | QueryRequest
  | ReadRequest
  | EdgesRequest
  | SubscribeRequest
  | OpenPageRequest
  | ReadVersionedRequest;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function boundedString(value: unknown, maxBytes: number): string | null {
  if (typeof value !== "string" || value.length === 0 || Buffer.byteLength(value, "utf8") > maxBytes) {
    return null;
  }
  return value;
}

function requestId(value: unknown): string | null {
  return boundedString(value, MAX_REQUEST_ID_BYTES);
}

function normalizeQueryParams(raw: unknown): QuerySelectionParams | null {
  if (!isPlainRecord(raw)) return null;
  const allowed = new Set(["type", "prefix", "field", "open", "limit"]);
  if (Object.keys(raw).some((key) => !allowed.has(key))) return null;
  const out: QuerySelectionParams = {};
  if (raw.type !== undefined) {
    const value = boundedString(raw.type, 256)?.trim();
    if (!value) return null;
    out.type = value;
  }
  if (raw.prefix !== undefined) {
    const value = boundedString(raw.prefix, 1024)?.trim();
    if (!value) return null;
    out.prefix = value;
  }
  if (raw.field !== undefined) {
    const value = boundedString(raw.field, 1024)?.trim();
    if (!value) return null;
    out.field = value;
  }
  if (raw.open !== undefined) {
    if (raw.open !== true && raw.open !== false) return null;
    if (raw.open) out.open = true;
  }
  if (raw.limit !== undefined) {
    if (!Number.isSafeInteger(raw.limit) || (raw.limit as number) < 0 || (raw.limit as number) > MAX_QUERY_ROWS) {
      return null;
    }
    out.limit = raw.limit as number;
  }
  return out;
}

function selector(value: unknown): string | string[] | undefined | null {
  if (value === undefined) return undefined;
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized && Buffer.byteLength(normalized, "utf8") <= MAX_SELECTOR_BYTES ? normalized : null;
  }
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_SELECTOR_VALUES) return null;
  const normalized: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") return null;
    const trimmed = entry.trim();
    if (!trimmed || Buffer.byteLength(trimmed, "utf8") > MAX_SELECTOR_BYTES) return null;
    normalized.push(trimmed);
  }
  return normalized;
}

function normalizeEdgeParams(raw: unknown): EdgeParams | null {
  if (!isPlainRecord(raw)) return null;
  const allowed = new Set(["from", "to", "text"]);
  if (Object.keys(raw).some((key) => !allowed.has(key))) return null;
  const from = selector(raw.from);
  const to = selector(raw.to);
  if (from === null || to === null) return null;
  const out: EdgeParams = {};
  if (from !== undefined) out.from = from;
  if (to !== undefined) out.to = to;
  if (raw.text !== undefined) {
    const text = boundedString(raw.text, 1024)?.trim();
    if (!text) return null;
    out.text = text;
  }
  return out;
}

export function parseBridgeRequest(value: unknown): ParsedBridgeRequest | null {
  if (!isPlainRecord(value) || typeof value.bridge !== "string" || typeof value.type !== "string") {
    return null;
  }
  if (value.bridge === ACTION_BRIDGE_PROTOCOL && value.type === "read-versioned") {
    if (!exactKeys(value, ["bridge", "type", "id", "docId"])) return null;
    const id = requestId(value.id);
    const docId = boundedString(value.docId, MAX_DOC_ID_BYTES);
    return id && docId
      ? { bridge: ACTION_BRIDGE_PROTOCOL, type: "read-versioned", id, docId }
      : null;
  }
  if (value.bridge !== BRIDGE_PROTOCOL) return null;
  if (value.type === "open-page") {
    const expected = value.id === undefined
      ? ["bridge", "type", "pageId"]
      : ["bridge", "type", "id", "pageId"];
    if (!exactKeys(value, expected)) return null;
    if (value.id !== undefined && requestId(value.id) === null) return null;
    if (!isAnyRegistryId(value.pageId)) return null;
    return {
      bridge: BRIDGE_PROTOCOL,
      type: "open-page",
      ...(typeof value.id === "string" ? { id: value.id } : {}),
      pageId: value.pageId,
    };
  }
  const id = requestId(value.id);
  if (!id) return null;
  if (value.type === "hello" || value.type === "subscribe") {
    if (!exactKeys(value, ["bridge", "type", "id"])) return null;
    return { bridge: BRIDGE_PROTOCOL, type: value.type, id };
  }
  if (value.type === "read") {
    if (!exactKeys(value, ["bridge", "type", "id", "docId"])) return null;
    const docId = boundedString(value.docId, MAX_DOC_ID_BYTES);
    return docId ? { bridge: BRIDGE_PROTOCOL, type: "read", id, docId } : null;
  }
  if (value.type === "query") {
    if (!exactKeys(value, ["bridge", "type", "id", "params"])) return null;
    const params = normalizeQueryParams(value.params);
    return params ? { bridge: BRIDGE_PROTOCOL, type: "query", id, params } : null;
  }
  if (value.type === "edges") {
    if (!exactKeys(value, ["bridge", "type", "id", "params"])) return null;
    const params = normalizeEdgeParams(value.params);
    return params ? { bridge: BRIDGE_PROTOCOL, type: "edges", id, params } : null;
  }
  return null;
}

function ok(id: string | undefined, bridge: string, type: string, result: unknown): Record<string, unknown> {
  return { bridge, id, type: `${type}:result`, result };
}

function fail(id: string | undefined, bridge: string, code: string, message: string): Record<string, unknown> {
  return { bridge, id, type: "error", error: { code, message } };
}

function replyWithinLimit(reply: Record<string, unknown>): boolean {
  return Buffer.byteLength(JSON.stringify(reply), "utf8") <= MAX_REPLY_BYTES;
}

function boundedRows(rows: HeadResult[], params: QuerySelectionParams, kinds: KindConvention[]): {
  rows: HeadResult[];
  count: number;
} {
  const requested = params.limit === 0 || params.limit === undefined
    ? MAX_QUERY_ROWS
    : Math.min(params.limit, MAX_QUERY_ROWS);
  return applyQuerySelectionFilters(rows, { ...params, limit: requested }, kinds);
}

export interface BridgeServiceOptions {
  bundle: Bundle;
  launches: BridgeLaunchAuthority;
  config: () => Promise<BridgeConfig>;
}

/**
 * Server-owned semantic authority for the View bridge. Host shells only validate their current
 * child and forward an opaque launch id plus one bounded request.
 */
export class BridgeService {
  constructor(private readonly options: BridgeServiceOptions) {}

  async handle(launchId: string, rawRequest: unknown): Promise<BridgeOutcome> {
    const request = parseBridgeRequest(rawRequest);
    if (!request) return { reply: fail(undefined, BRIDGE_PROTOCOL, "USAGE", "invalid or unsupported bridge request") };
    const dataBearing = request.type !== "open-page";
    const before = await this.options.launches.resolve(launchId, dataBearing);
    if (!before) {
      return { reply: fail(request.id, request.bridge, "FORBIDDEN", "the View launch is unknown, changed, expired, or not locally authorized") };
    }
    if (
      dataBearing &&
      before.capability !== "bundle-read" &&
      before.capability !== "bundle-propose"
    ) {
      return { reply: fail(request.id, request.bridge, "FORBIDDEN", "this View has no bundle-data access") };
    }

    let outcome: BridgeOutcome;
    try {
      outcome = await this.execute(before, request);
    } catch (error) {
      outcome = {
        reply: fail(
          request.id,
          request.bridge,
          "RUNTIME",
          error instanceof Error ? error.message : String(error),
        ),
      };
    }

    const after = await this.options.launches.resolve(launchId, dataBearing);
    if (!after) {
      this.options.launches.revoke(launchId);
      return { reply: fail(request.id, request.bridge, "REVOKED", "the View changed while the request was running") };
    }
    if (outcome.reply && !replyWithinLimit(outcome.reply)) {
      return { reply: fail(request.id, request.bridge, "TOO_LARGE", "the bridge reply exceeded the 2 MiB safety limit") };
    }
    return outcome;
  }

  private async execute(launch: BridgeLaunch, request: ParsedBridgeRequest): Promise<BridgeOutcome> {
    if (request.type === "open-page") {
      try {
        const target = await readDocVersioned(this.options.bundle, request.pageId);
        if (!isAnyRegistryId(target.doc.id) || !parseRegistration(target.doc.id, target.doc.frontmatter)) {
          throw new Error("invalid View target");
        }
        return { reply: null, openPageId: request.pageId };
      } catch {
        return { reply: fail(request.id, request.bridge, "NOT_FOUND", `View '${request.pageId}' is not available`) };
      }
    }
    if (request.type === "hello") {
      const config = await this.options.config();
      return {
        reply: ok(request.id, request.bridge, request.type, {
          bundle: { root: config.root, name: config.name },
          mode: config.mode,
          protocol: BRIDGE_PROTOCOL,
          grant: launch.capability === "bundle-propose" ? "propose" : "read",
        }),
      };
    }
    if (request.type === "query") {
      const rows = await queryHeads(this.options.bundle, {
        ...(request.params.type ? { type: request.params.type } : {}),
        ...(request.params.prefix ? { prefix: request.params.prefix } : {}),
      });
      const kinds = request.params.open ? (await loadKinds(this.options.bundle)).kinds : new Map();
      const result = boundedRows(rows, request.params, [...kinds.values()]);
      return { reply: ok(request.id, request.bridge, request.type, result) };
    }
    if (request.type === "read" || request.type === "read-versioned") {
      const result = await readDocVersioned(this.options.bundle, request.docId);
      if (Buffer.byteLength(result.doc.body, "utf8") > MAX_DOCUMENT_BODY_BYTES) {
        return { reply: fail(request.id, request.bridge, "TOO_LARGE", "the document body exceeded the 1 MiB View limit") };
      }
      return {
        reply: ok(
          request.id,
          request.bridge,
          request.type,
          request.type === "read" ? result.doc : result,
        ),
      };
    }
    if (request.type === "edges") {
      const edges = await queryEdges(this.options.bundle, request.params);
      if (edges.length > MAX_EDGE_ROWS) {
        return { reply: fail(request.id, request.bridge, "TOO_LARGE", `the edge query exceeded ${MAX_EDGE_ROWS} rows`) };
      }
      const projected = edges.map(({ from, to, text }) => ({ from, to, text }));
      return { reply: ok(request.id, request.bridge, request.type, { edges: projected, count: projected.length }) };
    }
    return { reply: ok(request.id, request.bridge, request.type, { ok: true }), subscribed: true };
  }
}

export function changeMessage(
  changes: { id: string; version: string }[],
  removed: string[],
): Record<string, unknown> {
  const boundedChanges = changes.slice(0, MAX_QUERY_ROWS);
  const boundedRemoved = removed.slice(0, MAX_QUERY_ROWS);
  return {
    bridge: BRIDGE_PROTOCOL,
    type: "change",
    event: { changes: boundedChanges, removed: boundedRemoved },
  };
}
