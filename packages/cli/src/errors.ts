// Structured CLI errors with stable codes + a capped exit-code taxonomy.
//
// Per the agent-first design (§6/§7): an agent shelling out branches on the EXIT CODE first and the
// structured `code` enum second, so both must be deterministic. Every failable command throws a
// `CliError`; the bin wrapper (index.ts / cli.ts formatError) maps it to an exit code and a structured
// stdout envelope — never by prose-matching the message. Non-CliError throws are classified by
// `classifyBundleError` — THE one boundary from typed failures to public codes/exits — whether they
// reach a command catch-all or fall all the way to `toExit`.
//
// The 0/1/2/4/5/6 exit taxonomy is PRESERVED intact from holaxis-agentstate.
import { InvalidInputError, MalformedDocumentError, RemoteError, VersionConflict } from "@agentstate-lite/core";

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
 * THE CLI error boundary: classify ANY thrown value into a `CliError` on the capped taxonomy.
 * Every command catch-all delegates here; `toExit` (the bin wrapper) applies the SAME mapping to
 * anything left uncaught, so the two layers can never disagree. Command-level catches may still
 * translate an EXPECTED domain condition with better context (a typed pre-check — e.g. ENOENT ->
 * "no concept document at id 'X'"), but never classify an arbitrary plain error themselves.
 * `classifyGitError` (below) is the git-porcelain DOMAIN classifier: it feeds this boundary by
 * producing already-classified `CliError`s, which pass through unchanged — it is not a second
 * boundary. Contract (pinned by `test/error-boundary.test.ts`'s table):
 *
 *  - `CliError` -> unchanged (already classified).
 *  - `InvalidInputError` (core's typed input-validation rejection: unsafe/reserved ids, §9.2
 *    empty type, bad option values) -> USAGE (2). This TYPE is the only path by which a
 *    non-`CliError` throw reaches USAGE — "fix your input" is a claim about the input, so it
 *    must be provably input-derived, never a fallback bucket.
 *  - `MalformedDocumentError` (corrupt STORED bytes; the invocation was valid) -> RUNTIME (1).
 *  - `VersionConflict` that escaped a call site's own translation -> STALE_HEAD (5), with
 *    `{expected, actual}` details.
 *  - `RemoteError` -> by ITS server-derived `code`: AUTH_REQUIRED -> exit 4 with an
 *    `AGENTSTATE_LITE_API_KEY` fixing hint; RUNTIME and VERSION_MISSING (a 5xx, or an
 *    intermediary stripping the version header — retry/report, not a caller mistake) -> RUNTIME
 *    (1); FORBIDDEN -> FORBIDDEN (USAGE's exit 2, distinct code — re-authenticating grants no
 *    role); NOT_FOUND -> NOT_FOUND (6); LAST_ADMIN -> LAST_ADMIN (CONFLICT's exit 5); any other
 *    envelope code (e.g. the wire's own USAGE, a 4xx-shaped client error) -> USAGE (2).
 *  - ANYTHING else — fs errnos (ENOSPC, EACCES, a raw ENOENT no call site translated),
 *    unexpected backend/engine failures, a non-Error throw — -> RUNTIME (1): a valid invocation
 *    hitting a broken environment is "retry/report a bug", never "fix your input". An
 *    ENOENT-shaped "missing document" is a DOMAIN condition: the call sites that know the id
 *    translate it (NOT_FOUND with the id, USAGE for a missing `promote` source file) before it
 *    ever reaches this fallback — context-free, ENOENT is just a failed syscall.
 */
export function classifyBundleError(err: unknown, remoteUrl?: string): CliError {
  if (err instanceof CliError) return err;
  if (err instanceof InvalidInputError) return new CliError("USAGE", err.message);
  if (err instanceof MalformedDocumentError) return new CliError("RUNTIME", err.message);
  if (err instanceof VersionConflict) {
    return new CliError("STALE_HEAD", err.message, {
      details: { expected: err.expected, actual: err.actual },
    });
  }
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
  return new CliError("RUNTIME", err instanceof Error ? err.message : String(err));
}

/**
 * Map ANY thrown value to the exit code + envelope the bin wrapper emits — the SAME
 * {@link classifyBundleError} mapping, so an uncaught typed failure lands on the identical
 * code/exit a command catch-all would have produced. `handled` rides along so the wrapper can
 * suppress its stdout write when the command already emitted the envelope on its own channel.
 */
export function toExit(err: unknown): { exitCode: number; envelope: ErrorEnvelope; handled: boolean } {
  const cliErr = classifyBundleError(err);
  return { exitCode: cliErr.exitCode, envelope: toEnvelope(cliErr), handled: cliErr.handled };
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
  const classified = classifyBundleError(err);
  return new CliError(classified.code, classified.message, {
    details: classified.details,
    help: classified.help,
    handled: true,
  });
}
