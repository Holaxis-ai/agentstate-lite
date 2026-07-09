// Change detection for the `ui` command's live-update surface (tasks/ui-pages-spike): take a
// SNAPSHOT of every doc's + page-blob's version token, and on each filesystem event (`--dir`) or
// poll tick (`--remote`) diff a fresh snapshot against the last to derive a minimal change delta,
// which `server.ts` broadcasts to the shell over SSE. Version tokens are content-addressed, so a
// changed token means changed bytes — no timestamps, no content compare.
//
// The pure {@link diffSnapshots} is the unit-tested core; the watcher driver around it is a thin
// fs.watch (recursive, verified on this macOS node) / poll loop with a debounce. Snapshots ride
// the SAME head projection `list` uses (`queryHeads` — no bodies), so a scan is cheap.
import { watch as fsWatch, type FSWatcher } from "node:fs";
import { listBlobs, readBlob, queryHeads, type Bundle } from "@agentstate-lite/core";
import { PAGE_BLOB_PREFIX } from "./pages.js";

/** The single-bundle reference router's bundle segment (mirrors the SPA client's `BUNDLE`). */
const REMOTE_BUNDLE = "default";

/** A point-in-time map of every doc id -> version and every page-blob key -> version. */
export interface Snapshot {
  docs: Map<string, string>;
  blobs: Map<string, string>;
}

/** The delta between two snapshots: what changed/appeared, and what was removed, on each side. */
export interface ChangeEvent {
  docs: { changed: { id: string; version: string }[]; removed: string[] };
  blobs: { changed: { key: string; version: string }[]; removed: string[] };
}

/** Diff two snapshots into a {@link ChangeEvent}. A key present in `next` with a different (or new) version is `changed`; a key only in `prev` is `removed`. Pure — the unit-tested core of the watcher. */
export function diffSnapshots(prev: Snapshot, next: Snapshot): ChangeEvent {
  const docsChanged: { id: string; version: string }[] = [];
  for (const [id, version] of next.docs) {
    if (prev.docs.get(id) !== version) docsChanged.push({ id, version });
  }
  const docsRemoved: string[] = [];
  for (const id of prev.docs.keys()) {
    if (!next.docs.has(id)) docsRemoved.push(id);
  }
  const blobsChanged: { key: string; version: string }[] = [];
  for (const [key, version] of next.blobs) {
    if (prev.blobs.get(key) !== version) blobsChanged.push({ key, version });
  }
  const blobsRemoved: string[] = [];
  for (const key of prev.blobs.keys()) {
    if (!next.blobs.has(key)) blobsRemoved.push(key);
  }
  return {
    docs: { changed: docsChanged, removed: docsRemoved },
    blobs: { changed: blobsChanged, removed: blobsRemoved },
  };
}

/** True when a diff carries nothing on either side — the watcher suppresses these (no empty SSE frames). */
export function isEmptyChange(e: ChangeEvent): boolean {
  return (
    e.docs.changed.length === 0 && e.docs.removed.length === 0 && e.blobs.changed.length === 0 && e.blobs.removed.length === 0
  );
}

/** Snapshot a local bundle: doc heads via `queryHeads` (no bodies), page-blob versions via `listBlobs(pages/)` + `readBlob` (pages are small; only the hot-reloadable prefix is scanned). Routes through core's engine wrappers, so a pluggable backend is honored (gate 3). */
export async function snapshotBundle(bundle: Bundle): Promise<Snapshot> {
  const heads = await queryHeads(bundle, {});
  const docs = new Map<string, string>(heads.map((h) => [h.id, h.version]));
  const blobs = new Map<string, string>();
  let keys: string[] = [];
  try {
    keys = await listBlobs(bundle, PAGE_BLOB_PREFIX);
  } catch {
    keys = [];
  }
  for (const key of keys) {
    try {
      const r = await readBlob(bundle, key);
      if (r) blobs.set(key, r.version);
    } catch {
      // a blob that vanished mid-scan is simply absent from this snapshot
    }
  }
  return { docs, blobs };
}

/**
 * Snapshot a remote over the wire: doc heads via the `GET /docs?fields=frontmatter` projection,
 * paginated to exhaustion. Remote page-blob hot-reload is a LABELED follow-up (v0 ships live DOC
 * updates over `--remote`; blob-change hot-reload stays local-mode only), so `blobs` is empty here.
 */
export async function snapshotRemote(base: string, apiKey?: string): Promise<Snapshot> {
  const docs = new Map<string, string>();
  const headers: Record<string, string> = {};
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  let cursor: string | undefined;
  do {
    const url = new URL(`${base}/v0/bundles/${REMOTE_BUNDLE}/docs`);
    url.searchParams.set("fields", "frontmatter");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`remote snapshot failed with status ${res.status}`);
    const body = (await res.json()) as { docs: { id: string; version: string }[]; next_cursor: string | null };
    for (const d of body.docs) docs.set(d.id, d.version);
    cursor = body.next_cursor ?? undefined;
  } while (cursor);
  return { docs, blobs: new Map() };
}

export interface WatcherHandle {
  stop: () => Promise<void>;
}

interface CommonWatcherOptions {
  onChange: (e: ChangeEvent) => void;
  onError?: (err: unknown) => void;
}

export type WatcherOptions =
  | (CommonWatcherOptions & { mode: "dir"; bundle: Bundle; debounceMs?: number })
  | (CommonWatcherOptions & { mode: "remote"; remoteBase: string; apiKey?: string; pollMs?: number });

async function takeSnapshot(opts: WatcherOptions): Promise<Snapshot> {
  return opts.mode === "dir" ? snapshotBundle(opts.bundle) : snapshotRemote(opts.remoteBase, opts.apiKey);
}

/**
 * Start watching for changes, emitting a {@link ChangeEvent} to `opts.onChange` whenever a doc or
 * page blob's version token moves. `--dir` uses `fs.watch` recursively (debounced) with a 2s poll
 * fallback if the platform rejects a recursive watch; `--remote` polls on a fixed interval. Awaits
 * a baseline snapshot before resolving, so the first change is diffed against real state.
 */
export async function startWatcher(opts: WatcherOptions): Promise<WatcherHandle> {
  let last = await takeSnapshot(opts);
  let stopped = false;

  const emitDiff = async (): Promise<void> => {
    if (stopped) return;
    try {
      const next = await takeSnapshot(opts);
      const change = diffSnapshots(last, next);
      last = next;
      if (!isEmptyChange(change)) opts.onChange(change);
    } catch (err) {
      opts.onError?.(err);
    }
  };

  if (opts.mode === "dir") {
    const debounceMs = opts.debounceMs ?? 150;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const trigger = (): void => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        void emitDiff();
      }, debounceMs);
      timer.unref?.();
    };

    let watcher: FSWatcher | undefined;
    let pollFallback: ReturnType<typeof setInterval> | undefined;
    const startPollFallback = (): void => {
      if (pollFallback) return;
      pollFallback = setInterval(() => void emitDiff(), 2000);
      pollFallback.unref?.();
    };
    try {
      watcher = fsWatch(opts.bundle.root, { recursive: true }, () => trigger());
      watcher.on("error", () => {
        watcher?.close();
        watcher = undefined;
        startPollFallback();
      });
    } catch {
      startPollFallback();
    }

    return {
      stop: async () => {
        stopped = true;
        if (timer) clearTimeout(timer);
        watcher?.close();
        if (pollFallback) clearInterval(pollFallback);
      },
    };
  }

  const pollMs = opts.pollMs ?? 3000;
  const timer = setInterval(() => void emitDiff(), pollMs);
  timer.unref?.();
  return {
    stop: async () => {
      stopped = true;
      clearInterval(timer);
    },
  };
}
