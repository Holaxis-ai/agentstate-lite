// `mutateDoc` — the ONE internal pipeline every doc-mutating CLI verb (`doc write`, `doc update`,
// `new`) composes down to (consolidation unit, plans/mutation-pipeline.md).
//
// Three postures, one shared shape — build a candidate -> a kind-conformance decision -> a write,
// reusing the SAME compare-and-swap + bounded-retry pattern `link add`/`doc update` already proved
// for the engine's read-modify-write seam:
//
//   - "create-only" (`new`): never reads. Writes with an expect-absent CAS (`expectedVersion: null`)
//     — a pre-existing id throws `VersionConflict`, mapped to a caller-supplied ALREADY_EXISTS.
//   - "overwrite" (`doc write`): never reads either. Any existing-doc peek a verb needs (e.g. `doc
//     write`'s F1 body-blanking guard) is the VERB's OWN concern, run before calling this — it has
//     its own conditional-read/error-classification shape that does not belong in a generic helper.
//     Writes unconditionally (last-writer-wins), matching `writeDoc`'s historical default.
//   - "patch" (`doc update`): reads (versioned) inside a bounded CAS-retry loop, so a
//     concurrent writer moving the doc between read and write is retried rather than lost. On an
//     ABSENT doc: `onAbsent: "fail"` (`doc update`) throws a caller-supplied NOT_FOUND before
//     `buildCandidate` ever runs; `onAbsent: "create"` instead calls
//     `buildCandidate(undefined)` and writes an expect-absent CAS create — so a race between two
//     concurrent creates of the SAME new doc converges through the SAME retry loop (the losing
//     writer's retry re-reads, finds the winner's doc, and MERGES into it instead of failing).
//     An EXPLICIT `expectedVersion` (Tier-1 kind-capabilities Fork C, `--expected-version` on
//     `doc update`) turns this into a HARD single-shot CAS instead: the read version must match
//     the caller's claimed token (checked BEFORE the idempotency short-circuit, so a stale claim
//     on an otherwise-unchanged doc still reports a conflict) and a `VersionConflict` on write is
//     NOT retried — it is terminal, the whole point of an optimistic "claim: update IFF
//     unchanged". Omitting it keeps the pre-existing bounded-retry behavior unchanged.
//
// Idempotency (patch mode only): after `buildCandidate` returns, a candidate that is structurally
// identical to the existing doc — IGNORING `frontmatter.timestamp` (a patch/merge that changes
// nothing meaningful must not persist a bumped timestamp either, `link add`'s original policy) —
// converges to `changed: false` with NO write. `buildCandidate` therefore always resolves its OWN
// timestamp policy (refresh/keep/explicit); this comparison decides whether that resolved value ever
// reaches disk. A "create" (`existing` was absent) is never a no-op — there is nothing to compare
// against — so it always proceeds to a write.
//
// Kind conformance is centralized here too, reusing `kind-write.ts`'s `defaultTimestampAndValidateKind`
// (the SAME warn-by-default/`--strict`-rejects decision `doc write`/`promote` already share — see that
// file's own header for why a parallel copy is forbidden) — it also defaults `frontmatter.timestamp`
// in place if `buildCandidate` left it empty, so a kind requiring `timestamp` validates against the
// value that will actually be persisted, not a still-absent one.
import {
  readDocVersioned,
  writeDocVersioned,
  versionedMutation,
  VersionConflict,
  type Bundle,
  type ConceptId,
  type Frontmatter,
  type KindRegistry,
  type OkfDocument,
  type ValidationWarning,
  type Version,
} from "@agentstate-lite/core";
import { CliError, classifyBundleError } from "./errors.js";
import { defaultTimestampAndValidateKind } from "./kind-write.js";

/** Bounded compare-and-swap retry budget for "patch" mode — mirrors `link add`/`doc update`'s. */
const DEFAULT_MAX_ATTEMPTS = 5;

export type MutateMode = "create-only" | "overwrite" | "patch";

/** The frontmatter + body a verb wants persisted; `mutateDoc` supplies the `id` at write time. */
export interface MutateCandidate {
  frontmatter: Frontmatter;
  body: string;
}

/** Structured errors for the conflict shapes `mutateDoc` can hit; each verb supplies its own wording. */
export interface MutateErrorHooks {
  /** "patch" mode, `onAbsent: "fail"`: thrown when the doc does not exist. */
  notFound?: () => CliError;
  /** "create-only" mode: thrown when the id already carries a document. */
  alreadyExists?: () => CliError;
  /** "patch" mode: thrown when the CAS retry budget is exhausted. */
  staleHead?: (err: VersionConflict) => CliError;
}

export interface MutateDocOptions {
  bundle: Bundle;
  id: ConceptId;
  mode: MutateMode;
  /** Loaded ONCE per invocation by the caller (the command layer) — never loaded here. */
  registry: KindRegistry;
  /** Upgrades a non-empty kind-warning set to a thrown USAGE error instead of writing. */
  strict: boolean;
  /** The `help` fixing command attached to a `--strict` kind rejection. */
  helpOnKindReject: string;
  /**
   * Build the write candidate from the current state: `undefined` in "create-only" mode (never
   * consulted), or in "patch" mode when the doc does not yet exist (`onAbsent: "create"`); otherwise
   * the existing document. Called ONCE PER CAS ATTEMPT in "patch" mode — must be a pure function of
   * `existing` plus already-resolved external input (e.g. piped stdin, read ONCE by the caller before
   * calling `mutateDoc` — a stream can only be consumed once). May throw a `CliError` (e.g. a
   * required-on-create field is missing); the throw propagates out of `mutateDoc` unchanged.
   */
  buildCandidate: (existing: OkfDocument | undefined) => MutateCandidate | Promise<MutateCandidate>;
  /** "patch" mode only: NOT_FOUND when absent (`doc update`) vs. fall through to a create. */
  onAbsent?: "fail" | "create";
  /** Bounded CAS retry budget for "patch" mode. Default 5 (matches `link add`/`doc update`). */
  maxAttempts?: number;
  /**
   * "patch" mode only: when true, `frontmatter.timestamp` PARTICIPATES in the no-op comparison
   * instead of being ignored. Default false (ignore timestamp — `link add`/`doc update`'s original
   * policy, unaffected by this addition): a patch that changes nothing meaningful must not persist a
   * bumped auto-refreshed timestamp either. Set this true ONLY when the caller is passing an
   * EXPLICIT, caller-chosen timestamp override (e.g. `doc update --timestamp`) — an intentional
   * timestamp change is a real change and must write; an explicit value IDENTICAL to the stored one
   * still converges to `changed: false`.
   */
  compareTimestamp?: boolean;
  /**
   * The `--remote <url>` value, when this is a remote mutation — threaded into
   * {@link classifyBundleError} so an `AUTH_REQUIRED` (e.g. a revoked key mid-write) carries a
   * copy-pastable `login --remote <url>` hint. Optional: a local (`--dir`) mutation omits it and
   * the classification is identical bar the hint's placeholder URL.
   */
  remoteUrl?: string;
  /**
   * Attribution for the write (`WriteOptions.actor`). Threaded on every mode's `writeDoc` call.
   * This is ONLY the engine/version-history channel: the CLI verbs each ALSO persist `--actor`
   * into `frontmatter.actor` in their own candidate construction (the per-doc attribution sync
   * reads — adjudication F), because frontmatter is document CONTENT with per-verb semantics
   * (patch preserves, overwrite full-replaces, create scaffolds) — not a pipeline concern.
   */
  actor?: string;
  /**
   * "patch" mode only: an EXPLICIT optimistic compare-and-swap token. When set, the patch is a
   * HARD single-shot CAS — the read version must equal this token (else `STALE_HEAD`, checked
   * BEFORE the idempotency short-circuit so a stale claim on an otherwise-unchanged doc still
   * reports a conflict) and the write CASes against it with NO bounded retry (a conflict is
   * terminal — the whole point of an optimistic "claim: update IFF unchanged"). When omitted,
   * patch keeps its pre-existing bounded-retry behavior unchanged.
   */
  expectedVersion?: Version;
  /**
   * "overwrite" mode only: couple the read `buildCandidate` needs to the WRITE via compare-and-swap,
   * instead of writing unconditionally (the default when omitted/false — the historical
   * last-writer-wins behavior, unchanged for any caller that doesn't set this). When true, reads the
   * CURRENT doc (present OR absent) immediately before EACH write attempt and passes it to
   * `buildCandidate`, so a per-write guard inside `buildCandidate` (e.g. `doc write`'s link-drop guard,
   * `guardDroppedLinks`) always evaluates against a version-matched snapshot — never a stale read from
   * before a concurrent writer's change. A `VersionConflict` (ANY concurrent writer moved the doc,
   * INCLUDING a concurrent absent -> created race) re-reads, re-runs `buildCandidate` against the FRESH
   * doc — so a guard inside it re-evaluates against what the write is actually about to clobber — and
   * retries bounded (`maxAttempts`), the same shape "patch" mode's CAS loop uses minus its
   * no-op-patch short-circuit (an overwrite always writes) and its onAbsent/notFound handling (an
   * absent doc is a valid create in "overwrite" mode, exactly as the unconditional path always allowed).
   */
  coupleRead?: boolean;
  errors: MutateErrorHooks;
}

export interface MutateResult {
  doc: OkfDocument;
  /** Present for "patch" mode only — absent for "create-only"/"overwrite" (which always write). */
  changed?: boolean;
  /**
   * The content-addressed version token of the doc AFTER this mutation: the write's new version, or
   * (a "patch" no-op) the unchanged current head. Callers surface it on their receipt so an agent can
   * pass it back as `--expected-version` for an optimistic compare-and-swap.
   */
  version: Version;
  warnings: ValidationWarning[];
}

/**
 * Classify an error thrown by the read/write seam during a mutation. Delegates to the shared
 * {@link classifyBundleError} (the SAME classifier `link add`/the command catch-alls use) so a
 * `RemoteError` from a `--remote` mutation keeps its server-derived `code` — a role-denied `403`
 * surfaces as `FORBIDDEN`, a `404` as `NOT_FOUND`, a `409` as `LAST_ADMIN` — instead of being
 * flattened to a generic `USAGE`. Behavior for the two pre-existing cases is unchanged: an
 * already-classified `CliError` (e.g. a wrapped transport RUNTIME from `bundle.ts`) passes through,
 * and a plain `Error` (core's reserved-id/empty-type/unsafe-id violations) still becomes `USAGE`.
 */
function classify(err: unknown, remoteUrl?: string): CliError {
  return classifyBundleError(err, remoteUrl);
}

/** Structural equality (order-independent, recursive through plain objects/arrays). */
function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((v, i) => valuesEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => valuesEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

/**
 * True when `candidate` differs from `existing` in NO way that counts as a change. By default,
 * `frontmatter.timestamp` is EXCLUDED from the comparison (see {@link MutateDocOptions.compareTimestamp}).
 * `compareTimestamp: true` includes it instead — an explicit timestamp override that actually
 * differs from the stored value is then a real change; an explicit value identical to the stored one
 * is still a true no-op.
 */
function isNoopPatch(existing: OkfDocument, candidate: MutateCandidate, compareTimestamp: boolean): boolean {
  if (candidate.body !== existing.body) return false;
  if (compareTimestamp) return valuesEqual(existing.frontmatter, candidate.frontmatter);
  const { timestamp: _a, ...restExisting } = existing.frontmatter;
  const { timestamp: _b, ...restCandidate } = candidate.frontmatter;
  return valuesEqual(restExisting, restCandidate);
}

export async function mutateDoc(opts: MutateDocOptions): Promise<MutateResult> {
  const { bundle, id, mode, registry, strict, helpOnKindReject, buildCandidate, errors } = opts;
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;

  // Shared validate step: defaults `frontmatter.timestamp` in place (if `buildCandidate` left it
  // empty) THEN validates against any kind governing `frontmatter.type` — warn-by-default, `--strict`
  // upgrades to a thrown USAGE rejection (no write happens). Every mode routes through this SAME
  // decision (B8 — one place, no parallel copy).
  const validate = (candidate: MutateCandidate): ValidationWarning[] =>
    defaultTimestampAndValidateKind({ id, ...candidate }, registry, { strict, helpOnReject: helpOnKindReject });

  if (mode === "create-only") {
    const candidate = await buildCandidate(undefined);
    const warnings = validate(candidate);
    try {
      const { doc: saved, version } = await writeDocVersioned(bundle, { id, ...candidate }, { expectedVersion: null, actor: opts.actor });
      return { doc: saved, version, warnings };
    } catch (err) {
      if (err instanceof VersionConflict) {
        throw errors.alreadyExists ? errors.alreadyExists() : new CliError("ALREADY_EXISTS", `'${id}' already exists`);
      }
      throw classify(err, opts.remoteUrl);
    }
  }

  if (mode === "overwrite" && !opts.coupleRead) {
    const candidate = await buildCandidate(undefined);
    const warnings = validate(candidate);
    try {
      const { doc: saved, version } = await writeDocVersioned(bundle, { id, ...candidate }, opts.actor ? { actor: opts.actor } : undefined);
      return { doc: saved, version, warnings };
    } catch (err) {
      throw classify(err, opts.remoteUrl);
    }
  }

  // A versioned read of `id`, shared by both remaining modes below: present -> {doc, version};
  // absent (ENOENT) -> {undefined, null} (an expect-absent CAS basis) — any OTHER read error is
  // classified and thrown immediately (never retried; only a `VersionConflict` from the WRITE
  // half gets `versionedMutation`'s bounded-retry treatment).
  const readExisting = async (): Promise<{ state: OkfDocument | undefined; version: Version | null }> => {
    try {
      const { doc, version } = await readDocVersioned(bundle, id);
      return { state: doc, version };
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return { state: undefined, version: null };
      throw classify(err, opts.remoteUrl);
    }
  };

  if (mode === "overwrite") {
    // coupleRead: true — read (present or absent) -> build -> validate -> CAS write, bounded-retried
    // on conflict via the shared `versionedMutation` primitive (core's ONE read-decide-CAS-retry
    // boundary — CLAUDE.md gate 3); see `MutateDocOptions.coupleRead`'s own comment for the full
    // rationale (P1 review fix: closes a window where an unconditional overwrite could silently
    // clobber a concurrent writer's change that a guard inside `buildCandidate` would otherwise have
    // refused). `decide` re-runs `buildCandidate`/`validate` against EVERY attempt's fresh read —
    // never a decision computed once and blindly retried with a newer token — which is exactly what
    // lets a guard inside `buildCandidate` (e.g. `doc write`'s link-drop guard) see a concurrent
    // writer's change instead of a stale snapshot. This mode never converges to a no-op (an
    // overwrite always writes), so `decide` never returns `done`.
    let savedDoc: OkfDocument | undefined;
    let warnings: ValidationWarning[] = [];
    try {
      const outcome = await versionedMutation<OkfDocument, undefined>({
        read: readExisting,
        decide: async (existing) => {
          const candidate = await buildCandidate(existing);
          warnings = validate(candidate);
          return { action: "write", next: { id, ...candidate }, result: undefined };
        },
        write: async (next, expectedVersion) => {
          try {
            const { doc: saved, version } = await writeDocVersioned(bundle, next, {
              expectedVersion,
              actor: opts.actor,
            });
            savedDoc = saved;
            return version;
          } catch (err) {
            if (err instanceof VersionConflict) throw err; // let the primitive retry/exhaust
            throw classify(err, opts.remoteUrl);
          }
        },
        maxAttempts,
      });
      return { doc: savedDoc!, version: outcome.version!, warnings };
    } catch (err) {
      if (err instanceof VersionConflict) {
        throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
      }
      throw err; // already classified (readExisting/write's own classify, or a buildCandidate throw)
    }
  }

  // mode === "patch": versioned read -> build -> (idempotency) -> validate -> CAS write, with a
  // bounded conflict retry — the exact shape `link add` proves for this seam, now riding the same
  // shared `versionedMutation` primitive `appendLog`/`regenerateIndex` (core) and the "overwrite"
  // branch above both use.
  //
  // `lastReadVersion` is set by `readExisting` on every attempt and read by `decide` for the
  // explicit-`--expected-version` precheck below: `decide` never receives a version token from
  // `versionedMutation` itself (a decision is made over domain state only — the primitive owns CAS
  // pairing), but THIS check is a caller-side claim comparison ("the doc must still be at version V"),
  // not a domain decision, so the two closures share it via this attempt-scoped variable rather than
  // threading it through the primitive's contract.
  let lastReadVersion: Version | null = null;
  let savedDoc: OkfDocument | undefined;
  const hardCas = opts.expectedVersion !== undefined;

  try {
    const outcome = await versionedMutation<OkfDocument, { doc?: OkfDocument; warnings: ValidationWarning[] }>({
      read: async () => {
        const read = await readExisting();
        lastReadVersion = read.version;
        if (read.state === undefined && onAbsent === "fail") {
          throw errors.notFound ? errors.notFound() : new CliError("NOT_FOUND", `no concept document at id '${id}'`);
        }
        return read;
      },
      decide: async (existing) => {
        // Explicit-token hard CAS: the caller's claimed version must match what was just read — a
        // mismatch here is a genuine stale claim, checked BEFORE the idempotency short-circuit so a
        // stale token on an otherwise-unchanged doc still reports STALE_HEAD (the claim premise — "I
        // am acting on version V" — is false even if V's content happens to equal the current content).
        if (hardCas && lastReadVersion !== opts.expectedVersion) {
          const conflict = new VersionConflict(id, opts.expectedVersion!, lastReadVersion);
          throw errors.staleHead ? errors.staleHead(conflict) : new CliError("STALE_HEAD", conflict.message);
        }

        const candidate = await buildCandidate(existing);

        if (existing && isNoopPatch(existing, candidate, compareTimestamp)) {
          // No write — the doc's CURRENT version (from this attempt's read) is still its head.
          return { action: "done", result: { doc: existing, warnings: [] } };
        }

        const warnings = validate(candidate);
        return { action: "write", next: { id, ...candidate }, result: { warnings } };
      },
      write: async (next, expectedVersion) => {
        const writeVersion = hardCas ? opts.expectedVersion! : expectedVersion;
        try {
          const { doc: saved, version } = await writeDocVersioned(bundle, next, {
            expectedVersion: writeVersion,
            actor: opts.actor,
          });
          savedDoc = saved;
          return version;
        } catch (err) {
          if (err instanceof VersionConflict) throw err; // let the primitive retry/exhaust
          throw classify(err, opts.remoteUrl);
        }
      },
      // An EXPLICIT caller token makes a conflict terminal (hard CAS, no retry) — the whole point of
      // an optimistic "claim: update IFF unchanged". Without one, keep the pre-existing bounded-retry
      // behavior (a benign concurrent writer is retried, not failed).
      maxAttempts: hardCas ? 1 : maxAttempts,
    });

    return outcome.wrote
      ? { doc: savedDoc!, changed: true, version: outcome.version!, warnings: outcome.result.warnings }
      : { doc: outcome.result.doc!, changed: false, version: outcome.version!, warnings: [] };
  } catch (err) {
    if (err instanceof VersionConflict) {
      throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
    }
    throw err; // already classified (readExisting/notFound/write's own classify, or a buildCandidate throw)
  }
}
