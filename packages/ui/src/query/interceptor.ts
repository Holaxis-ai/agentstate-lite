/**
 * The ONE global interceptor state (plans/ui-v1.md rev 3.2 "Interceptor re-scope"): a 401
 * (`AUTH_REQUIRED`), a 429 (`RATE_LIMITED`), or a 403 from the shell's OWN session gate is
 * TERMINAL for polling — all three stop every `refetchInterval` in the app and render a
 * full-screen recovery view instead of letting a dead session or a rate-limited caller keep
 * hammering the endpoint (the review's catch: "a revoked key that keeps polling escalates into
 * the per-IP rate limiter — never poll-loop into 429s"; the 403 case is the same failure mode
 * for a stable-port restart, which mints a fresh per-run session secret and 403s every request
 * an already-open tab makes with its now-dead cookie). `--dir` mode never produces a 401 (no
 * remote auth surface), but the local session-cookie 403 applies in BOTH modes.
 *
 * `session_expired` (403) is intentionally a DIFFERENT status than `unauthorized` (401): a 401
 * only ever reaches the browser via a `--remote` proxy relaying the wire-protocol server's own
 * rejection of the API key (recovery: restart `ui --remote` with `AGENTSTATE_LITE_API_KEY` and
 * open its fresh URL), while a 403 here is the `ui` command's OWN loopback session gate rejecting
 * the cookie/token (recovery: reopen the URL the `ui` command just printed). This can never be
 * confused with the
 * page-bytes route's own 403 (`/__page/<nonce>`, served when a page's registry doc is deleted or
 * retargeted): that route is loaded as the sandboxed iframe's `src`, a browser-native navigation
 * this shell's JS never observes as a fetch failure, so it can't reach this store — see
 * `PageFrame.tsx`'s revoke path for that (structurally separate) handling.
 *
 * A plain module-level store (not a state library — rev 3.2 "no state library"): React
 * components read it via {@link useInterceptorStatus} (a `useSyncExternalStore` subscription,
 * the same idiom `routing.ts` uses for the URL). `queryClient.ts`'s `QueryCache.onError` writes
 * it for every TanStack-managed query; `PageFrame.tsx` also writes it directly, but ONLY from its
 * imperative `getDoc` call (a bare `/v0/*` read, so a 403 there has no cause OTHER than a dead
 * session) — deliberately NOT from its `mintPageNonce` call, whose 403 can ALSO mean this doc's
 * `entry` fails the mint confinement check (outside `pages/`, or not a registered Page's entry) —
 * a malformed-doc problem, not a session-death one, and not worth bricking the whole tab over.
 */
import { useSyncExternalStore } from "react";

export type InterceptorStatus = "ok" | "unauthorized" | "rate_limited" | "session_expired";

let status: InterceptorStatus = "ok";
const listeners = new Set<() => void>();

export function getInterceptorStatus(): InterceptorStatus {
  return status;
}

/** Set the interceptor status. Once tripped (non-"ok"), it stays tripped for the session — recovery is a fresh page load after the operator follows the terminal recovery instructions, never an automatic reset. */
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
