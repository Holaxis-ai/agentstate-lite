// Shared kind-conformance decision for a create-or-overwrite doc write path.
//
// `doc write` and `promote`'s `.md` route (Stage-1 Unit 2a Part C) both need the IDENTICAL
// warn-by-default / `--strict`-rejects logic — INCLUDING the timestamp-default-BEFORE-validation
// ordering that prevents a phantom KIND_FIELD_MISSING warning for `timestamp` (a kind that requires
// it must validate against the value that will actually be persisted, not a still-absent one, or a
// timestamp-less write of a governed type would warn about the very field the engine is about to
// stamp in anyway). B8 (CLI-layer one-of-each rule): this is the ONE place that decision is made — a
// parallel copy in `promote.ts` is forbidden.
import {
  validateDocumentAgainstRegistry,
  type KindRegistry,
  type OkfDocument,
  type ValidationWarning,
} from "@agentstate-lite/core";
import { CliError } from "./errors.js";

/** Options for {@link defaultTimestampAndValidateKind}. */
export interface KindValidateOptions {
  /** Upgrade a non-empty warning set to a thrown USAGE CliError instead of returning it (no write happens). */
  strict: boolean;
  /** The `help` fixing command attached to a `--strict` rejection. */
  helpOnReject: string;
}

/**
 * Default `candidate.frontmatter.timestamp` to now (in place) if it is still absent, look up the
 * kind governing `candidate.frontmatter.type` in `registry`, and validate the candidate against it.
 *
 * Warn-by-default: returns the (possibly empty) warning list for the caller to attach to its
 * receipt. `opts.strict: true` upgrades a non-empty warning list to a thrown `CliError("USAGE", …)`
 * instead — the caller must not write in that case. An ungoverned `type` (no kind declares it, or a
 * conventions-free bundle) is a no-op: `[]`, timestamp still defaulted.
 *
 * Mutates `candidate.frontmatter` in place (matching `doc write`'s original mutation-based style) —
 * callers that pass the SAME object into a subsequent write see the defaulted timestamp too.
 */
export function defaultTimestampAndValidateKind(
  candidate: OkfDocument,
  registry: KindRegistry,
  opts: KindValidateOptions,
): ValidationWarning[] {
  const { kind, warnings } = validateDocumentAgainstRegistry(candidate, registry);
  if (kind && warnings.length > 0 && opts.strict) {
    throw new CliError(
      "USAGE",
      `'${candidate.id}' does not satisfy the '${kind.governs}' kind: ${warnings.map((w) => w.message).join("; ")}`,
      // In a --strict REJECTION these validation issues CAUSED the failure, so surface them under
      // `violations` — NOT `warnings`, which reads as "advisory, write went through anyway". The
      // ValidationWarning type is deliberately advisory-only (severity "warning"|"info", no "error"),
      // so the rename conveys "these blocked the write" without inventing a severity the type forbids.
      { help: opts.helpOnReject, details: { violations: warnings } },
    );
  }
  return warnings;
}
