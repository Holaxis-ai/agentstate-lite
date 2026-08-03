/**
 * One-shot claim tickets for launches whose tool result the host may not deliver to the App.
 *
 * Probe-established (tasks/mcp-shell-payload-without-structuredcontent): Claude Desktop rebuilds
 * tool-result notifications with prose content only — structuredContent and _meta are stripped —
 * while preserving text content and proxying the App's own tools/call channel faithfully.
 * show_view therefore mints a RANDOM one-shot claim id, embeds it as an opaque marker in the
 * result's text content (the channel that provably survives), and records {claimId -> launchId}
 * here. The app-only resolve_launch tool redeems it by EXACT match only — an unknown or reused
 * claim fails closed, never falls back to another launch, so concurrent panels can never swap
 * launches (PR #178 review's blocking finding). The marker is model-visible by construction and
 * conveys no model authority: the resolver is app-only, same-connection, bounded, and one-shot.
 */
export interface PendingLaunchEntry {
  claimId: string;
  launchId: string;
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

  record(claimId: string, launchId: string): void {
    this.#prune();
    this.#entries.push({ claimId, launchId, recordedAt: this.#now() });
    if (this.#entries.length > this.#limit) this.#entries.shift();
  }

  /** Exact match only, one-shot. Unknown, expired, or already-consumed claims fail closed. */
  consume(claimId: string): PendingLaunchEntry | null {
    this.#prune();
    const index = this.#entries.findIndex((entry) => entry.claimId === claimId);
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
