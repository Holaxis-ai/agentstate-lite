/**
 * The ONE versioned-mutation boundary: every read-modify-write over this engine's
 * compare-and-swap seam (reserved files' `appendLog`/`regenerateIndex` here in core; the
 * CLI's `mutateDoc`/`addLink` on top of it) reduces to the SAME shape — a fresh versioned
 * read, a domain decision over exactly that read, and a CAS write bounded-retried on
 * conflict. This module is that shape, extracted once so the retry loop cannot drift
 * between its five prior hand-rolled copies (`bundle.ts`'s `appendLog`/`regenerateIndex`,
 * the CLI's `mutateDoc` overwrite+patch modes, `link add`) — see CLAUDE.md gate 3: ONE
 * implementation, consumed everywhere, not a schema fork.
 *
 * The structural property that kills the "stale decision under a fresh token" bug class:
 * {@link VersionedMutationOptions.decide} is handed ONLY the state a fresh
 * {@link VersionedMutationOptions.read} just produced — never a version token, never a
 * previous attempt's state — and {@link VersionedMutationOptions.write} CASes with THAT
 * SAME read's version. A caller cannot compute a decision once and merely retry the write
 * with a newer token; each attempt re-derives its decision from its own fresh read.
 */

import { VersionConflict } from "./versioning.js";
import type { Version } from "./types.js";

/** Bounded compare-and-swap retry budget for a {@link versionedMutation} call, unless overridden. */
const CAS_MAX_ATTEMPTS = 5;

/**
 * What {@link VersionedMutationOptions.decide} resolves a single attempt to: either commit
 * `next` (CAS write against this attempt's read version) or converge with no write at all
 * (`done` — e.g. an idempotent no-op, or a retry that discovers a competing writer already
 * made the same change).
 */
export type MutationDecision<S, R> =
  | { action: "write"; next: S; result: R }
  | { action: "done"; result: R };

/** Inputs to a {@link versionedMutation} call, parameterized over the mutated state `S` and the caller's result shape `R`. */
export interface VersionedMutationOptions<S, R> {
  /** A FRESH versioned read, called once per attempt. `version: null` means the state is absent (an expect-absent CAS basis). */
  read: () => Promise<{ state: S | undefined; version: Version | null }>;
  /**
   * Re-run against EVERY attempt's fresh `state` — never a previous attempt's decision, never a
   * version token (decisions are made over domain state only; CAS pairing is this module's job,
   * not the caller's). Safe to call more than once; may throw a terminal domain error, which
   * propagates out of {@link versionedMutation} unchanged (not retried).
   */
  decide: (state: S | undefined, attempt: number) => MutationDecision<S, R> | Promise<MutationDecision<S, R>>;
  /** CAS-write `next`, conditional on THIS attempt's read version (`null` = expect-absent create). Returns the new version. */
  write: (next: S, expectedVersion: Version | null) => Promise<Version>;
  /** Bounded retry budget. Default 5. `1` makes a conflict terminal (hard single-shot CAS, no retry). */
  maxAttempts?: number;
}

/** The result of a {@link versionedMutation} call. */
export interface VersionedMutationOutcome<R> {
  /** The winning attempt's decision result. */
  result: R;
  /** The version current after this call: the write's new version, or (a `done` convergence) the read's version. */
  version: Version | null;
  /** `true` if a write actually happened; `false` for a `done` convergence. */
  wrote: boolean;
}

/**
 * Run one versioned read-decide-write cycle, retrying on a {@link VersionConflict} up to
 * `maxAttempts` (default 5). Each attempt: (1) one fresh `read`; (2) `decide` against THAT
 * state only; (3) `done` returns immediately with no write; (4) `write` CASes with THAT
 * attempt's own version; (5) a `VersionConflict` retries (fresh read, fresh decide) while
 * budget remains, else the final `VersionConflict` is RETHROWN unchanged — callers map it
 * to their own conflict shape (e.g. `STALE_HEAD`, exit 5); (6) any other thrown error is
 * terminal and propagates unchanged.
 */
export async function versionedMutation<S, R>(
  opts: VersionedMutationOptions<S, R>,
): Promise<VersionedMutationOutcome<R>> {
  const maxAttempts = opts.maxAttempts ?? CAS_MAX_ATTEMPTS;
  for (let attempt = 0; ; attempt++) {
    const { state, version } = await opts.read();
    const decision = await opts.decide(state, attempt);
    if (decision.action === "done") {
      return { result: decision.result, version, wrote: false };
    }
    try {
      const newVersion = await opts.write(decision.next, version);
      return { result: decision.result, version: newVersion, wrote: true };
    } catch (err) {
      if (err instanceof VersionConflict && attempt < maxAttempts - 1) continue;
      throw err;
    }
  }
}
