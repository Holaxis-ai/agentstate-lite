// Structured CLI errors with stable codes + a capped exit-code taxonomy.
//
// Per the agent-first design (§6/§7): an agent shelling out branches on the EXIT CODE first and the
// structured `code` enum second, so both must be deterministic. Every failable command throws a
// `CliError`; the bin wrapper (index.ts / cli.ts formatError) maps it to an exit code and a structured
// stdout envelope — never by prose-matching the message. Non-CliError throws fall back to a generic
// RUNTIME (exit 1) — EXCEPT a `RemoteError` (Stage-1 Unit 2b Part C, `core/src/remote-backend.ts`),
// which `toExit` now classifies by its OWN `code` (see `classifyBundleError` below) instead of
// collapsing into that generic fallback, so an uncaught AUTH_REQUIRED/RUNTIME distinction from a
// `--remote` command survives even for a command with no engine-call-specific catch-all of its own.
//
// Ported verbatim from holaxis-agentstate `packages/cli/src/errors.ts` — the 0/1/2/4/5/6 exit taxonomy
// is PRESERVED intact.
import { MalformedDocumentError, RemoteError } from "@agentstate-lite/core";

/** Stable, documented error codes. Finer than the exit table; rides alongside it in the envelope. */
export type CliErrorCode =
  | "AUTH_REQUIRED"
  | "AUDIENCE_MISMATCH"
  | "NOT_FOUND"
  | "STALE_HEAD"
  | "ALREADY_EXISTS"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INTEGRITY_MISMATCH"
  | "NOT_IMPLEMENTED"
  | "USAGE"
  | "TRANSIENT"
  | "RUNTIME"
  /**
   * Stage-2 auth Part B: the caller authenticated fine but lacks the role a
   * `packages/worker/src/auth-routes.ts` admin route requires (the wire's `403 FORBIDDEN`).
   * Exit 2 (USAGE) is the least-wrong bucket in the capped taxonomy — exit 4 (AUTH) would
   * mislead an agent into re-authenticating, which grants no additional role — but the
   * `code` is preserved distinctly (not collapsed into a generic `"USAGE"`) so an agent can
   * still branch on "wrong role" vs. "malformed request."
   */
  | "FORBIDDEN"
  /**
   * Stage-2 auth Part B: the wire's `409 LAST_ADMIN` — a well-formed membership mutation that
   * would strip a bundle of its last real admin
   * (`packages/worker/src/auth-routes.ts`'s `wouldRemoveLastAdmin` guard). A genuine
   * precondition conflict, same taxonomy bucket as `STALE_HEAD`/`ALREADY_EXISTS`.
   */
  | "LAST_ADMIN"
  /**
   * sync U1 (plans/sync-verb-implementation §U1): the `git` binary itself is absent (the spawn
   * fails ENOENT). Exit 1 with a DISTINCT code — the FORBIDDEN/LAST_ADMIN distinct-code-shared-exit
   * pattern — so an agent can branch on "install git" vs. a transient runtime failure.
   */
  | "GIT_MISSING"
  /**
   * sync U1: the board branch has no usable remote counterpart — no `origin` remote, or `origin`
   * exists but carries no `board` ref (`origin/board` unresolvable). Exit 1, distinct code.
   */
  | "NO_UPSTREAM"
  /**
   * sync U1 (adjudication B): another git process holds the repository lock (`index.lock` exists —
   * a concurrent sync, or the user's own git mid-operation). Exit 1 with `details.retryable: true`
   * — a STRUCTURED RETRY envelope, never a raw git strand on stdout.
   */
  | "GIT_BUSY"
  /**
   * sync U1: an unresolved same-doc divergence between the local board and `origin/board` (or a
   * worktree left with unmerged paths). The CAS-semantics bucket: same exit (5) as
   * `STALE_HEAD`/`ALREADY_EXISTS` — "the precondition moved under you" — with a distinct code.
   */
  | "CONFLICT";

/** The capped exit-code taxonomy (§6). More codes become brittle; refine via `code` instead. */
export const EXIT = {
  /** success or definitive no-op/empty */
  OK: 0,
  /** recoverable runtime error (5xx / transient) */
  RUNTIME: 1,
  /** usage error: bad/missing flags, parse failure, not-implemented */
  USAGE: 2,
  /** auth required: no/expired creds, refresh failed, audience mismatch */
  AUTH: 4,
  /** CAS / precondition conflict: head moved, expected-* mismatch */
  CONFLICT: 5,
  /** not found: doc_key / doc_id / concept id absent */
  NOT_FOUND: 6,
} as const;

/** Single source of truth mapping each `code` to its exit code. */
const CODE_EXIT: Record<CliErrorCode, number> = {
  AUTH_REQUIRED: EXIT.AUTH,
  AUDIENCE_MISMATCH: EXIT.AUTH,
  NOT_FOUND: EXIT.NOT_FOUND,
  STALE_HEAD: EXIT.CONFLICT,
  ALREADY_EXISTS: EXIT.CONFLICT,
  UNSUPPORTED_MEDIA_TYPE: EXIT.USAGE,
  INTEGRITY_MISMATCH: EXIT.RUNTIME,
  NOT_IMPLEMENTED: EXIT.USAGE,
  USAGE: EXIT.USAGE,
  TRANSIENT: EXIT.RUNTIME,
  RUNTIME: EXIT.RUNTIME,
  FORBIDDEN: EXIT.USAGE,
  LAST_ADMIN: EXIT.CONFLICT,
  GIT_MISSING: EXIT.RUNTIME,
  NO_UPSTREAM: EXIT.RUNTIME,
  GIT_BUSY: EXIT.RUNTIME,
  CONFLICT: EXIT.CONFLICT,
};

export interface CliErrorOptions {
  /** Machine-readable specifics (e.g. { current_head_seq: 9 }) the agent can act on. */
  details?: Record<string, unknown>;
  /** A parameterized fixing command — the SPECIFIC next step, never "see --help". */
  help?: string;
  /**
   * When true, the command already emitted this error's envelope to its own channel (e.g.
   * `doc read --out -` routes it to STDERR to keep the stdout byte stream pure). The bin wrapper
   * honors this and does NOT re-emit the envelope to stdout — it only sets the exit code.
   */
  handled?: boolean;
}

/**
 * A command-level failure carrying its own stable `code`, derived `exitCode`, and optional
 * machine `details` + a `help` fixing command. Throw this from any command instead of a bare
 * Error so the exit code and structured envelope are deterministic.
 */
export class CliError extends Error {
  readonly code: CliErrorCode;
  readonly exitCode: number;
  readonly details?: Record<string, unknown>;
  readonly help?: string;
  /** See CliErrorOptions.handled — the bin wrapper skips the stdout envelope when true. */
  readonly handled: boolean;

  constructor(code: CliErrorCode, message: string, opts: CliErrorOptions = {}) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = CODE_EXIT[code];
    this.handled = opts.handled ?? false;
    if (opts.details !== undefined) this.details = opts.details;
    if (opts.help !== undefined) this.help = opts.help;
  }
}

/** The on-wire structured-error envelope an agent parses from stdout (§7). */
export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    help?: string;
  };
}

/** Project a CliError into its wire envelope (omitting absent optional fields). */
export function toEnvelope(err: CliError): ErrorEnvelope {
  const e: ErrorEnvelope["error"] = { code: err.code, message: err.message };
  if (err.details !== undefined) e.details = err.details;
  if (err.help !== undefined) e.help = err.help;
  return { error: e };
}

/**
 * Classify ANY thrown value caught from a `--remote`-capable bundle operation into a `CliError`
 * carrying the correct taxonomy code — the ONE mapping every command's catch-all should use
 * INSTEAD OF a blind `new CliError("USAGE", ...)` (Stage-1 Unit 2b Part C, closing the documented
 * misclassification where a genuine server-side `500` surfaced to an agent as exit 2 "fix your
 * input" instead of exit 1 "retry/report a bug", and where a gated remote's `401` had no path to
 * the AUTH exit-code taxonomy at all):
 *
 *  - An already-classified `CliError` (e.g. a transport-error RUNTIME from `bundle.ts`'s
 *    `wrapTransportErrors`, or a NOT_FOUND a caller already derived from an ENOENT check) passes
 *    through UNCHANGED.
 *  - A `RemoteError` (`core/src/remote-backend.ts` — any non-2xx, non-404, non-412 wire response, OR
 *    a response `RemoteBackend` itself rejected client-side) maps by ITS `code`: `AUTH_REQUIRED` ->
 *    the AUTH exit-code taxonomy (4) with an `AGENTSTATE_LITE_API_KEY` fixing hint (using
 *    `remoteUrl` when the caller has it in scope; a placeholder otherwise); `RUNTIME` AND
 *    `VERSION_MISSING` -> RUNTIME (1) — the regression this closes, and (for `VERSION_MISSING`,
 *    Stage-1 Unit 2b production repair) a response that arrived with no version header is almost
 *    always an intermediary (a CDN/compressing proxy) stripping it in transit, not a caller mistake,
 *    so "retry/report a bug" is the right signal, not "fix your input"; `FORBIDDEN` (Stage-2 auth
 *    Part B — the `/v0/invites|members|keys` admin routes' `403`) -> `FORBIDDEN`, USAGE's exit code
 *    (2) but a DISTINCT `code` (re-authenticating grants no additional role, so exit 4 would
 *    mislead); `NOT_FOUND` -> `NOT_FOUND` (exit 6 — safe here specifically because every EXISTING
 *    bundle-scoped read already intercepts its own 404 before it can reach this function, see
 *    `RemoteBackend`'s `read`/`readMany`/`readReserved`/`readBlob`/`exists`/`existsBlob`; only the
 *    NEW auth-route surface's 404s for absent administrative resources flow through here);
 *    `LAST_ADMIN` (Stage-2 auth Part B — the membership mutation `409` guard
 *    against stripping a bundle of its last admin) -> `LAST_ADMIN`, the CONFLICT exit code (5);
 *    anything else (e.g. the envelope's own `USAGE`) -> USAGE (2), the pre-existing default.
 *  - Any other thrown value (a LOCAL engine's plain `Error`, e.g. an OKF validation rejection,
 *    which never becomes a `RemoteError`) -> USAGE (2), unchanged from the pre-existing convention
 *    every one of these call sites already followed.
 *
 * Local (`--dir`) behavior is entirely unaffected: a `RemoteError` can only originate from
 * `RemoteBackend` (`--remote`) or `auth-client.ts` (the Stage-2 auth surface), so this function is
 * a strict superset of the old `if (err instanceof CliError) throw err; throw new CliError("USAGE",
 * ...)` pattern for every OTHER kind of thrown value.
 */
export function classifyBundleError(err: unknown, remoteUrl?: string): CliError {
  if (err instanceof CliError) return err;
  // A corrupt document (unparseable YAML) is a data-integrity failure, NOT a usage error: the
  // invocation was valid, the STORED bytes are the problem. Classified here (the ONE chokepoint
  // every bundle command's catch routes through) so read/write/update/history/link all report it
  // uniformly as RUNTIME (exit 1) — not the USAGE (exit 2) default below, which would misleadingly
  // read as "you called it wrong". The message is already actionable (names the file, says fix-or-
  // remove), so no `help` is attached.
  if (err instanceof MalformedDocumentError) return new CliError("RUNTIME", err.message);
  if (err instanceof RemoteError) {
    if (err.code === "AUTH_REQUIRED") {
      return new CliError("AUTH_REQUIRED", err.message, {
        help:
          `set AGENTSTATE_LITE_API_KEY=<key> and retry the same command against --remote ${remoteUrl ?? "<url>"}; ` +
          "an already-provisioned stored per-origin credential is also accepted",
      });
    }
    if (err.code === "RUNTIME" || err.code === "VERSION_MISSING") {
      return new CliError("RUNTIME", err.message);
    }
    if (err.code === "FORBIDDEN") {
      return new CliError("FORBIDDEN", err.message);
    }
    if (err.code === "NOT_FOUND") {
      return new CliError("NOT_FOUND", err.message);
    }
    if (err.code === "LAST_ADMIN") {
      return new CliError("LAST_ADMIN", err.message);
    }
    return new CliError("USAGE", err.message);
  }
  return new CliError("USAGE", err instanceof Error ? err.message : String(err));
}

/**
 * Map ANY thrown value to the exit code + envelope the bin wrapper emits. A CliError maps by its
 * own code; a `RemoteError` that reached this point uncaught (no command-specific catch-all
 * intercepted it) is classified via {@link classifyBundleError} rather than falling into the
 * generic RUNTIME catch-all, so an AUTH_REQUIRED/RUNTIME distinction from an UNWRAPPED `--remote`
 * command still reaches the correct exit code; anything else becomes a generic RUNTIME (exit 1) so
 * an unexpected throw still produces a structured stdout error rather than a raw stack trace.
 * `handled` rides along so the wrapper can suppress its stdout write when the command already
 * emitted the envelope on its own channel.
 */
export function toExit(err: unknown): { exitCode: number; envelope: ErrorEnvelope; handled: boolean } {
  if (err instanceof CliError) {
    return { exitCode: err.exitCode, envelope: toEnvelope(err), handled: err.handled };
  }
  if (err instanceof RemoteError) {
    const cliErr = classifyBundleError(err);
    return { exitCode: cliErr.exitCode, envelope: toEnvelope(cliErr), handled: false };
  }
  const message = err instanceof Error ? err.message : String(err);
  return { exitCode: EXIT.RUNTIME, envelope: { error: { code: "RUNTIME", message } }, handled: false };
}

/**
 * The captured outcome of one failed `git` invocation (`cli/src/git.ts`'s spawn wrapper is the ONLY
 * producer). Deliberately a plain data shape — not an Error subclass — so the classifier below is a
 * pure, unit-testable function mirroring {@link classifyBundleError}'s role for the wire surface.
 */
export interface GitFailure {
  /** The git argv (WITHOUT the leading `git -C <dir>` prefix) — names the op in messages/details. */
  args: readonly string[];
  /** The child's exit status; null when the spawn itself failed or the process was killed. */
  status: number | null;
  stdout: string;
  stderr: string;
  /** True when the per-op timeout killed the child (the wrapper's no-hang invariant fired). */
  timedOut?: boolean;
  /** The spawn-level errno code (e.g. `ENOENT` = no git binary), when the process never ran. */
  spawnErrorCode?: string;
}

/** First non-empty line of a git failure's stderr (fall back to stdout) — for compact messages. */
function firstGitLine(f: GitFailure): string {
  const line =
    f.stderr.split("\n").find((l) => l.trim().length > 0) ??
    f.stdout.split("\n").find((l) => l.trim().length > 0) ??
    "";
  return line.trim();
}

/**
 * Classify one failed git invocation into a `CliError` on the capped taxonomy — the ONE chokepoint
 * (plans/sync-verb-implementation, "Global porcelain invariants") between raw git and the AXI
 * surface: no raw git strand ever reaches stdout; every failure lands structured. Mirrors
 * {@link classifyBundleError}. Matching prefers STABLE signals (spawn errno, `index.lock`, ref
 * names) over localized prose where git offers one; the prose fallbacks are ordered so the more
 * specific state wins:
 *
 *  - spawn `ENOENT` -> `GIT_MISSING` (exit 1): git itself is not installed — distinct code, shared
 *    exit (the FORBIDDEN/LAST_ADMIN pattern), so "install git" is branchable from "retry".
 *  - per-op timeout -> `TRANSIENT` (exit 1): the no-hang invariant fired; retryable.
 *  - `index.lock` / "Another git process" -> `GIT_BUSY` (exit 1, adjudication B) with
 *    `details.retryable: true` — the structured RETRY envelope.
 *  - missing `origin` remote / unresolvable `origin/board` (invalid upstream, can't-merge,
 *    couldn't-find-remote-ref, src-refspec) -> `NO_UPSTREAM` (exit 1): the board branch isn't
 *    linked to a remote yet.
 *  - credential/permission signals -> `AUTH_REQUIRED` (exit 4). BEST-EFFORT by design (recorded in
 *    research/sync-verb-review): GitHub answers "Repository not found." for unauthorized-private,
 *    so not-found-shaped transport failures classify as AUTH rather than silently reading as
 *    "no such repo" — clean AUTH-vs-network separation is impossible from stderr alone.
 *  - detached HEAD -> RUNTIME (exit 1), a precondition failure NAMING the state.
 *  - unmerged paths / mid-merge refusals -> `CONFLICT` (exit 5).
 *  - unreachable/unresolvable host, connection refused/timed out -> `TRANSIENT` (exit 1).
 *  - anything else -> RUNTIME (exit 1) carrying the op name + first stderr line (structured, never
 *    a raw dump).
 */
export function classifyGitError(f: GitFailure): CliError {
  const op = f.args[0] ?? "git";
  const text = `${f.stderr}\n${f.stdout}`;

  if (f.spawnErrorCode === "ENOENT") {
    return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
      details: { op },
      help: "install git (https://git-scm.com/downloads), then re-run the command",
    });
  }
  if (f.timedOut || f.spawnErrorCode === "ETIMEDOUT") {
    return new CliError("TRANSIENT", `git ${op} timed out — the network or repository may be slow; retry`, {
      details: { op, retryable: true },
    });
  }
  if (/index\.lock|Another git process seems to be running/i.test(text)) {
    return new CliError(
      "GIT_BUSY",
      "another git process is using this repository — retry once it finishes",
      { details: { op, retryable: true } },
    );
  }
  if (
    /'origin' does not appear to be a git repository/i.test(text) ||
    /No such remote:? '?origin'?/i.test(text) ||
    /invalid upstream ['"]?origin\//i.test(text) ||
    /origin\/[^\s]+ - not something we can merge/i.test(text) ||
    /couldn'?t find remote ref/i.test(text) ||
    /src refspec [^\s]+ does not match any/i.test(text)
  ) {
    return new CliError(
      "NO_UPSTREAM",
      "the board branch isn't linked to a remote yet — sync can't share it",
      { details: { op } },
    );
  }
  if (
    /authentication failed/i.test(text) ||
    /could not read (Username|Password)/i.test(text) ||
    /Permission denied \(publickey/i.test(text) ||
    /returned error: 40[13]/i.test(text) ||
    /Repository not found/i.test(text) ||
    /does not appear to be a git repository/i.test(text) ||
    /access denied|Invalid username or password/i.test(text)
  ) {
    return new CliError(
      "AUTH_REQUIRED",
      `git ${op} was denied access to the remote (or the repository is not visible to your credentials)`,
      { details: { op, best_effort: true } },
    );
  }
  if (/You are not currently on a branch|HEAD detached/i.test(text)) {
    return new CliError(
      "RUNTIME",
      "the board worktree is in a detached-HEAD state — sync needs the board branch checked out",
      { details: { op, state: "detached-head" } },
    );
  }
  if (
    /needs merge/i.test(text) ||
    /unmerged files/i.test(text) ||
    /not possible because you have unmerged/i.test(text) ||
    /Resolve all conflicts/i.test(text)
  ) {
    return new CliError("CONFLICT", "the board worktree has unresolved conflicts", { details: { op } });
  }
  if (
    /Could not resolve host|unable to access|Connection (refused|timed out|reset)|Operation timed out|network is unreachable|Failed to connect/i.test(
      text,
    )
  ) {
    return new CliError("TRANSIENT", `git ${op} could not reach the remote — offline or the host is unreachable; retry`, {
      details: { op, retryable: true },
    });
  }
  const line = firstGitLine(f);
  return new CliError("RUNTIME", `git ${op} failed${line ? `: ${line}` : ""}`, {
    details: { op, exit_status: f.status },
  });
}

/**
 * Re-wrap a thrown value as a CliError flagged `handled` (preserving code/message/details/help).
 * A command that has already written the error envelope to its own channel (e.g. `doc read --out -`
 * → stderr) throws `asHandled(err)` so the bin wrapper sets the exit code WITHOUT re-emitting the
 * envelope to stdout — keeping the reserved byte channel pure regardless of outcome.
 */
export function asHandled(err: unknown): CliError {
  if (err instanceof CliError) {
    return new CliError(err.code, err.message, {
      details: err.details,
      help: err.help,
      handled: true,
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message, { handled: true });
}
