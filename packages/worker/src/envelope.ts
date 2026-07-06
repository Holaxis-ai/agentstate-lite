/**
 * The `{ error: { code, message, details? } }` JSON error envelope, shared by every
 * worker-owned HTTP surface (`auth.ts`'s gate, `auth-routes.ts`'s handlers) — matching
 * `packages/server/src/router.ts`'s own envelope shape (kept as a SEPARATE copy there
 * deliberately, per that module's placement rationale: the reference server's package
 * stays untouched by this deployment-specific unit). Extracted to its own module once a
 * SECOND worker-owned file needed it, rather than growing a third inline copy.
 */
import { VersionConflict } from "@agentstate-lite/core";

/** Build a JSON `Response` with the standard `content-type`, merging in any extra headers. */
export function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

/** Build the `{ error: { code, message, details? } }` envelope. */
export function errorResponse(status: number, code: string, message: string, details?: unknown): Response {
  return jsonResponse(status, {
    error: details === undefined ? { code, message } : { code, message, details },
  });
}

/** True when `err` carries the `ENOENT`-shaped `.code` the seam's adapters use for "absent". */
function isEnoent(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "ENOENT";
}

/**
 * M2 (adversarial review): the SAME error-to-envelope mapping
 * `packages/server/src/router.ts`'s `errorFromCaught` uses (kept as its own copy here,
 * not an import — that module stays untouched by this deployment-specific unit, same
 * reasoning as this file's header comment), now also wrapping `auth.ts`'s gate and
 * `auth-routes.ts`'s dispatch. Before this, an uncaught throw from `MembershipStore`
 * (a genuine D1 failure, not client-input validation) propagated past the gate as an
 * UNSTRUCTURED failure instead of the `{ error: { code, message } }` envelope every
 * OTHER path in this deployment guarantees. `VersionConflict` -> `412`; an
 * ENOENT-shaped rejection -> `404`; any other `Error` -> `400 USAGE` (mirroring
 * `router.ts`'s own reasoning: most `Error`s reaching this layer are validation-shaped,
 * e.g. `isRole`/`bundleGuardError`-adjacent checks that stayed uncaught somewhere); a
 * non-`Error` throw (a genuine bug) -> `500 RUNTIME`.
 */
export function errorFromCaught(err: unknown): Response {
  if (err instanceof VersionConflict) {
    return errorResponse(412, "VERSION_CONFLICT", err.message, { expected: err.expected, actual: err.actual });
  }
  if (isEnoent(err)) {
    return errorResponse(404, "NOT_FOUND", err instanceof Error ? err.message : "not found");
  }
  if (err instanceof Error) {
    return errorResponse(400, "USAGE", err.message);
  }
  return errorResponse(500, "RUNTIME", String(err));
}
