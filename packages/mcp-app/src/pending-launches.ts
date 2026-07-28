/**
 * One-shot claim tickets for launches whose tool result the host may not deliver to the App.
 *
 * Probe-established (tasks/mcp-shell-payload-without-structuredcontent): Claude Desktop rebuilds
 * tool-result notifications with prose content only — structuredContent and _meta are stripped —
 * while the App's own host-proxied tools/call channel is faithful. show_view therefore records
 * {hostRequestId -> launchId} here, and the app-only resolve_launch tool redeems it: by exact
 * request id where the host reuses the JSON-RPC id in its handshake toolInfo (spec-faithful
 * hosts), else by most-recent-unconsumed (Desktop reports an unrelated toolu_* id — under the
 * local trust model the ambiguity window is two panels launching concurrently in one process;
 * one-shot consumption voids each ticket, and the shell's RecoveryGuard caps an instance at
 * three redemptions total).
 */
export interface PendingLaunchEntry {
  key: string | null;
  launchId: string;
  kind: "generated" | "durable";
  recordedAt: number;
}

export class PendingLaunchRegistry {
  #entries: PendingLaunchEntry[] = [];
  readonly #limit: number;
  readonly #ttlMs: number;
  readonly #now: () => number;

  constructor(limit = 16, ttlMs = 10 * 60_000, now: () => number = Date.now) {
    this.#limit = limit;
    this.#ttlMs = ttlMs;
    this.#now = now;
  }

  record(key: string | null, launchId: string, kind: "generated" | "durable"): void {
    this.#prune();
    this.#entries.push({ key, launchId, kind, recordedAt: this.#now() });
    if (this.#entries.length > this.#limit) this.#entries.shift();
  }

  /** Exact key match wins; otherwise the most recent unconsumed entry. Consumption is one-shot. */
  consume(key?: string | null): PendingLaunchEntry | null {
    this.#prune();
    let index = -1;
    if (key) {
      for (let i = this.#entries.length - 1; i >= 0; i--) {
        if (this.#entries[i]!.key === key) {
          index = i;
          break;
        }
      }
    }
    if (index < 0) index = this.#entries.length - 1;
    if (index < 0) return null;
    const [entry] = this.#entries.splice(index, 1);
    return entry ?? null;
  }

  get size(): number {
    this.#prune();
    return this.#entries.length;
  }

  #prune(): void {
    const cutoff = this.#now() - this.#ttlMs;
    this.#entries = this.#entries.filter((entry) => entry.recordedAt >= cutoff);
  }
}
