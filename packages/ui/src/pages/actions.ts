import type { DocumentSetFieldAction } from "../api/pages.js";

export const ACTION_BRIDGE_PROTOCOL = "v1";
const MAX_MESSAGE_BYTES = 8 * 1024;

export type ActionBridgeMessage =
  | { bridge: "v1"; type: "read-versioned"; id: string; docId: string }
  | { bridge: "v1"; type: "action.propose"; requestId: string; action: DocumentSetFieldAction };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function exactKeys(record: Record<string, unknown>, expected: readonly string[]): boolean {
  const actual = Object.keys(record).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((key, index) => key === sortedExpected[index]);
}

function safeDocId(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  const normalized = value.replaceAll("\\", "/");
  return !normalized.startsWith("/") && !normalized.split("/").includes("..");
}

function safeScalar(value: unknown): value is string | number | boolean {
  if (typeof value === "string") return new TextEncoder().encode(value).byteLength <= 4096;
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "boolean";
}

function jsonSize(value: unknown): number | null {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).byteLength;
  } catch {
    return null;
  }
}

/** Validate the complete structured-clone message before any shell work or confirmation UI. */
export function parseActionBridgeMessage(value: unknown): { ok: true; message: ActionBridgeMessage } | { ok: false; message: string } | null {
  if (!isPlainRecord(value) || value.bridge !== ACTION_BRIDGE_PROTOCOL || typeof value.type !== "string") return null;
  const size = jsonSize(value);
  if (size === null || size > MAX_MESSAGE_BYTES) return { ok: false, message: "action bridge message must be acyclic JSON of at most 8 KiB" };

  if (value.type === "read-versioned") {
    if (!exactKeys(value, ["bridge", "type", "id", "docId"]) || typeof value.id !== "string" || !value.id || value.id.length > 64 || !safeDocId(value.docId)) {
      return { ok: false, message: "read-versioned requires exact bridge, type, id, and safe docId fields" };
    }
    return { ok: true, message: value as ActionBridgeMessage };
  }

  if (value.type === "action.propose") {
    if (!exactKeys(value, ["bridge", "type", "requestId", "action"]) || typeof value.requestId !== "string" || !value.requestId || value.requestId.length > 64) {
      return { ok: false, message: "action.propose requires an exact non-empty requestId of at most 64 characters" };
    }
    const action = value.action;
    if (
      !isPlainRecord(action) ||
      !exactKeys(action, ["kind", "docId", "field", "value", "expectedVersion"]) ||
      action.kind !== "document.set-field" ||
      !safeDocId(action.docId) ||
      typeof action.field !== "string" ||
      !action.field ||
      new TextEncoder().encode(action.field).byteLength > 128 ||
      typeof action.expectedVersion !== "string" ||
      !action.expectedVersion ||
      action.expectedVersion.length > 256 ||
      !safeScalar(action.value)
    ) {
      return { ok: false, message: "action.propose requires one valid document.set-field scalar action" };
    }
    return { ok: true, message: value as ActionBridgeMessage };
  }

  return { ok: false, message: `unknown action bridge request '${value.type}'` };
}

export function actionReply(requestId: string, result: unknown): Record<string, unknown> {
  return { bridge: ACTION_BRIDGE_PROTOCOL, requestId, type: "action.result", result };
}

export function actionError(id: string | undefined, message: string): Record<string, unknown> {
  return { bridge: ACTION_BRIDGE_PROTOCOL, id, type: "error", error: { code: "REJECTED", message } };
}
