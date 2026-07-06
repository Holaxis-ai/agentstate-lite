/**
 * Pure CAS-conflict classification for a status-change mutation (plans/ui-v1.md rev 2 Views §1:
 * "a 412 renders as a recoverable state (REFRESH / RETRY), never a raw error"). Kept dependency-
 * free (only the `ApiError` shape) so the mapping is unit-testable without React or a network.
 */
import { ApiError } from "../api/client.js";

export type ConflictState =
  | { kind: "none" }
  | { kind: "conflict"; expected?: string; actual?: string; message: string };

/** Classify a thrown mutation error: a 412 becomes a recoverable `conflict` state; everything else is `none` (the caller falls back to a normal error render, e.g. a transient network failure — never silently swallowed). */
export function classifyWriteError(err: unknown): ConflictState {
  if (err instanceof ApiError && err.status === 412) {
    return {
      kind: "conflict",
      expected: typeof err.details?.expected === "string" ? err.details.expected : undefined,
      actual: typeof err.details?.actual === "string" ? err.details.actual : undefined,
      message: err.message,
    };
  }
  return { kind: "none" };
}
