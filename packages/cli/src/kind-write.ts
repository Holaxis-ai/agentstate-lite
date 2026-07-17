// CLI translation for kind-conformance failures. Core owns timestamp defaulting,
// registry lookup, and validation; this module owns strict-mode CLI presentation.
import {
  defaultTimestampAndValidateAgainstRegistry,
  KindConformanceError,
  type KindRegistry,
  type OkfDocument,
  type ValidationWarning,
} from "@agentstate-lite/core";
import { CliError } from "./errors.js";

/** Translate a typed core rejection into the established strict-mode CLI contract. */
export function kindConformanceCliError(error: KindConformanceError, help: string): CliError {
  return new CliError("USAGE", error.message, {
    help,
    details: { violations: error.violations },
  });
}

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
  const { kind, warnings } = defaultTimestampAndValidateAgainstRegistry(candidate, registry);
  if (kind && warnings.length > 0 && opts.strict) {
    throw kindConformanceCliError(
      new KindConformanceError(candidate.id, kind.governs, warnings),
      opts.helpOnReject,
    );
  }
  return warnings;
}
