/**
 * URL-search-param routing — no router library (plans/ui-v1.md rev 2/3.2: "no router (URL-search-
 * param routing, `history.replaceState`, deep links must work)").
 *
 * A `Route` is entirely derived from `location.search`; navigation is a `history.pushState` +
 * a same-tab notification (no `popstate` fires for pushState, so {@link navigate} notifies
 * subscribers itself — {@link subscribeToRoute} additionally listens for `popstate`, which DOES
 * fire on back/forward). Pure parse/serialize functions are exported separately from the
 * window-touching store so routing logic is unit-testable without a DOM.
 */

export type ViewName = "launcher" | "page" | "doc";

const VIEW_NAMES: readonly ViewName[] = ["launcher", "page", "doc"];

function isViewName(v: string | null): v is ViewName {
  return v !== null && (VIEW_NAMES as readonly string[]).includes(v);
}

/**
 * The parsed route: a view name plus its params. The pages-spike surface is exactly two views
 * (tasks/ui-pages-spike) — `launcher` (the landing, and the fallback for any unknown/legacy `view`
 * such as a stale `?view=board` deep link), `page` (whose `id` is the registry doc to frame), and
 * `doc` (whose `id` is the concept doc the reader renders — designs/doc-reader).
 */
export interface Route {
  view: ViewName;
  id?: string;
}

/** Parse a `location.search`-shaped string (leading `?` optional) into a {@link Route}. */
export function parseRoute(search: string): Route {
  const params = new URLSearchParams(search);
  const view = params.get("view");
  const id = params.get("id");
  const route: Route = { view: isViewName(view) ? view : "launcher" };
  if (id) route.id = id;
  return route;
}

/** Serialize a {@link Route} back to a `?`-prefixed search string (empty string for the bare launcher route). */
export function routeToSearch(route: Route): string {
  const params = new URLSearchParams();
  if (route.view !== "launcher") params.set("view", route.view);
  if (route.id) params.set("id", route.id);
  const s = params.toString();
  return s ? `?${s}` : "";
}

type Listener = () => void;
const listeners = new Set<Listener>();

// `useSyncExternalStore`'s `getSnapshot` MUST return a referentially stable value when nothing
// changed — returning a fresh object literal every call (as a naive `parseRoute(location.search)`
// would) makes React conclude the snapshot changed on every render, which loops forever (React
// error #185, "Maximum update depth exceeded"). Cache the last search string alongside the
// `Route` it produced; recompute only when `location.search` actually differs.
let lastSearch: string | undefined;
let lastRoute: Route | undefined;

/** Current route, derived from `window.location.search` — referentially stable across calls until the URL actually changes (required for {@link subscribeToRoute}'s `useSyncExternalStore` consumer). */
export function getRoute(): Route {
  const search = window.location.search;
  if (search !== lastSearch) {
    lastSearch = search;
    lastRoute = parseRoute(search);
  }
  return lastRoute!;
}

/** Push a new route onto history (deep-linkable — `routeToSearch` produces a shareable URL) and notify subscribers. */
export function navigate(route: Route): void {
  const search = routeToSearch(route);
  const url = `${window.location.pathname}${search}${window.location.hash}`;
  window.history.pushState(null, "", url);
  for (const l of listeners) l();
}

/** Subscribe to route changes (pushState-driven navigation AND back/forward `popstate`). Returns an unsubscribe function — the shape `useSyncExternalStore` expects. */
export function subscribeToRoute(listener: Listener): () => void {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}
