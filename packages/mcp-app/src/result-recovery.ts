/**
 * Payload extraction + recovery bounding for the App shell (view.ts wires this to the DOM).
 *
 * Probe-established: some hosts (Claude Desktop) rebuild tool-result notifications with prose
 * content only, stripping structuredContent and _meta, while proxying the App's own tools/call
 * requests faithfully. The shell therefore must not depend on the notification channel for its
 * payload: when a NON-ERROR result arrives without one, it redeems the launch's claim ticket via
 * the app-only resolve_launch tool. This module owns the pure parts — where a payload may live
 * in a result, and how many recovery attempts one App instance may make.
 */
import type {
  DurableViewLaunchPayload,
  McpViewPayload,
  ViewLaunchPayload,
} from "./contract.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isGeneratedViewPayload(value: unknown): value is ViewLaunchPayload {
  if (!isRecord(value)) return false;
  const presentation = value.presentation;
  const selection = value.selection;
  const launch = value.launch;
  return (
    value.schemaVersion === "agentstate.view-launch.v1" &&
    typeof value.title === "string" &&
    isRecord(presentation) &&
    typeof presentation.html === "string" &&
    typeof presentation.css === "string" &&
    typeof presentation.contentHash === "string" &&
    isRecord(selection) &&
    Array.isArray(selection.objectIds) &&
    Array.isArray(value.objects) &&
    isRecord(launch) &&
    typeof launch.launchId === "string" &&
    Array.isArray(launch.actions)
  );
}

export function isDurableViewPayload(value: unknown): value is DurableViewLaunchPayload {
  if (!isRecord(value)) return false;
  const source = value.source;
  const launch = value.launch;
  const authorization = isRecord(launch) ? launch.authorization : null;
  return (
    value.schemaVersion === "agentstate.durable-view-launch.v1" &&
    typeof value.title === "string" &&
    isRecord(source) &&
    typeof source.viewId === "string" &&
    typeof source.entry === "string" &&
    typeof source.html === "string" &&
    typeof source.contentType === "string" &&
    typeof source.contentVersion === "string" &&
    isRecord(launch) &&
    typeof launch.launchId === "string" &&
    isRecord(authorization) &&
    typeof authorization.required === "boolean" &&
    typeof authorization.authorized === "boolean"
  );
}

export function isViewPayload(value: unknown): value is McpViewPayload {
  return isGeneratedViewPayload(value) || isDurableViewPayload(value);
}

/**
 * The one place that knows where a payload may live inside a tool result. Error results never
 * yield a payload — their diagnosis belongs to the caller, and recovery must not fire for them.
 */
export function extractViewPayload(result: unknown): McpViewPayload | null {
  if (!isRecord(result)) return null;
  if (result.isError === true) return null;
  const structured = result.structuredContent;
  if (isViewPayload(structured)) return structured;
  if (isRecord(structured) && isViewPayload(structured.view)) return structured.view;
  return null;
}

/** First text content part of a result, for surfacing server error prose. */
export function firstResultText(result: unknown): string | null {
  if (!isRecord(result) || !Array.isArray(result.content)) return null;
  for (const part of result.content) {
    if (isRecord(part) && part.type === "text" && typeof part.text === "string" && part.text) {
      return part.text;
    }
  }
  return null;
}

/** Hard per-App-instance bound on recovery attempts — never by result identity. */
export class RecoveryGuard {
  #remaining: number;

  constructor(limit = 3) {
    this.#remaining = limit;
  }

  tryAcquire(): boolean {
    if (this.#remaining <= 0) return false;
    this.#remaining -= 1;
    return true;
  }
}
