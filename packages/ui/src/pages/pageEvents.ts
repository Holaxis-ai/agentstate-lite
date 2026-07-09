/**
 * The shell's single SSE connection to `/events` (tasks/ui-pages-spike, "Live updates"). ONLY the
 * shell holds this — pages have `connect-src 'none'` and cannot open an EventSource. The server's
 * version-token watcher pushes one `data:` frame per change; every subscriber (the launcher's page
 * list, each open PageFrame) gets the same {@link ChangeEvent}, then decides what to refetch or fan
 * into its iframe over the bridge.
 *
 * One lazily-opened, reference-counted EventSource shared across subscribers: opened on the first
 * subscribe, closed when the last unsubscribes. EventSource reconnects on its own if the stream
 * drops, so there is no manual retry here.
 */

export interface ChangeEvent {
  docs: { changed: { id: string; version: string }[]; removed: string[] };
  blobs: { changed: { key: string; version: string }[]; removed: string[] };
}

type Listener = (e: ChangeEvent) => void;

const listeners = new Set<Listener>();
let source: EventSource | null = null;

function ensureSource(): void {
  if (source) return;
  source = new EventSource("/events", { withCredentials: true });
  source.onmessage = (ev: MessageEvent<string>) => {
    let parsed: ChangeEvent;
    try {
      parsed = JSON.parse(ev.data) as ChangeEvent;
    } catch {
      return;
    }
    for (const l of listeners) l(parsed);
  };
  // EventSource auto-reconnects on error; nothing to do but let it.
}

/** Subscribe to change events. Returns an unsubscribe that closes the shared stream once no one is listening. */
export function subscribeToChanges(listener: Listener): () => void {
  ensureSource();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && source) {
      source.close();
      source = null;
    }
  };
}
