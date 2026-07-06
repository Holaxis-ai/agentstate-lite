/**
 * The ONE global interceptor state (plans/ui-v1.md rev 3.2 "Interceptor re-scope"): a 401
 * (`AUTH_REQUIRED`) or a 429 (`RATE_LIMITED`) is TERMINAL for polling — both stop every
 * `refetchInterval` in the app and render a full-screen recovery view instead of letting a
 * revoked key or a rate-limited caller keep hammering the endpoint (the review's catch: "a
 * revoked key that keeps polling escalates into the per-IP rate limiter — never poll-loop into
 * 429s"). `--dir` mode never produces either status (no auth surface), so this stays "ok" for
 * the life of a `--dir` session.
 *
 * A plain module-level store (not a state library — rev 3.2 "no state library"): React
 * components read it via {@link useInterceptorStatus} (a `useSyncExternalStore` subscription,
 * the same idiom `routing.ts` uses for the URL), and `queryClient.ts`'s `QueryCache.onError`
 * is the ONE writer.
 */
import { useSyncExternalStore } from "react";

export type InterceptorStatus = "ok" | "unauthorized" | "rate_limited";

let status: InterceptorStatus = "ok";
const listeners = new Set<() => void>();

export function getInterceptorStatus(): InterceptorStatus {
  return status;
}

/** Set the interceptor status. Once tripped (non-"ok"), it stays tripped for the session — recovery is a fresh page load after the operator re-runs the printed login command, never an automatic reset. */
export function setInterceptorStatus(next: InterceptorStatus): void {
  if (next === status) return;
  if (status !== "ok") return; // terminal — never downgrades back to "ok" or flips between tripped states
  status = next;
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInterceptorStatus(): InterceptorStatus {
  return useSyncExternalStore(subscribe, getInterceptorStatus);
}

/** Test-only reset (there is no in-app way to un-trip the interceptor by design). */
export function __resetInterceptorForTests(): void {
  status = "ok";
}
