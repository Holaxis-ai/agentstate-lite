/**
 * The ONE query layer (plans/ui-v1.md rev 2 Realtime / rev 3.2 Interceptor re-scope): a single
 * `QueryClient` whose `QueryCache.onError` is the ONE writer to the global interceptor
 * (`interceptor.ts`) — every query in the app funnels through it, so a 401/429 anywhere trips
 * the SAME terminal state, not a per-view copy of the same logic.
 *
 * Polling: `refetchInterval` fires only while `getInterceptorStatus() === "ok"`; `--dir` mode
 * never trips it (no auth surface), so polling there is simply continuous. `refetchIntervalInBackground`
 * is left at its default (`false`) — TanStack's own "visible-tab only" behavior (rev 3.2 /
 * rev 2 Realtime: "Polling via TanStack `refetchInterval` (visible-tab only)").
 */
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/client.js";
import { getInterceptorStatus, setInterceptorStatus } from "./interceptor.js";

/** Launcher poll cadence (a fallback beneath the live SSE stream). A local dev tool over a single machine's bundle — no need to be aggressive. */
export const POLL_INTERVAL_MS = 5_000;

function onQueryError(err: unknown): void {
  if (!(err instanceof ApiError)) return;
  if (err.status === 401) setInterceptorStatus("unauthorized");
  else if (err.status === 429) setInterceptorStatus("rate_limited");
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: onQueryError }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchInterval: () => (getInterceptorStatus() === "ok" ? POLL_INTERVAL_MS : false),
    },
    mutations: {
      retry: false,
    },
  },
});
