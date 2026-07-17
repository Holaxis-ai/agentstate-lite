/**
 * CLI adapter for core's document mutation service.
 *
 * Core owns the read/decide/CAS/retry policy and typed domain failures. This
 * module deliberately owns only CLI presentation: verb-specific error wording,
 * remote error hints, help text, and the best-effort board attribution hook.
 */
import {
  DocumentNotFoundError,
  KindConformanceError,
  mutateDocument,
  VersionConflict,
  type Bundle,
  type ConceptId,
  type DocumentMutationCandidate,
  type DocumentMutationMode,
  type Frontmatter,
  type KindRegistry,
  type OkfDocument,
  type ValidationWarning,
  type Version,
} from "@agentstate-lite/core";
import { CliError, classifyBundleError } from "./errors.js";

export type MutateMode = DocumentMutationMode;

/** The frontmatter and body a CLI verb wants persisted; the service supplies the id. */
export interface MutateCandidate extends DocumentMutationCandidate {
  frontmatter: Frontmatter;
}

/** Structured CLI errors for the conflict shapes a verb can hit. */
export interface MutateErrorHooks {
  notFound?: () => CliError;
  alreadyExists?: () => CliError;
  staleHead?: (err: VersionConflict) => CliError;
}

export interface MutateDocOptions {
  bundle: Bundle;
  id: ConceptId;
  mode: MutateMode;
  registry: KindRegistry;
  strict: boolean;
  helpOnKindReject: string;
  buildCandidate: (existing: OkfDocument | undefined) => MutateCandidate | Promise<MutateCandidate>;
  onAbsent?: "fail" | "create";
  maxAttempts?: number;
  compareTimestamp?: boolean;
  remoteUrl?: string;
  actor?: string;
  persistActor?: boolean;
  expectedVersion?: Version;
  /** Best-effort CLI orchestration hook; it never changes mutation success. */
  onPersisted?: () => void | Promise<void>;
  errors: MutateErrorHooks;
}

export interface MutateResult {
  doc: OkfDocument;
  /** Present for patch mode only; create-only and overwrite always write. */
  changed?: boolean;
  version: Version;
  warnings: ValidationWarning[];
}

async function firePostPersist(hook: (() => void | Promise<void>) | undefined): Promise<void> {
  if (!hook) return;
  try {
    await hook();
  } catch {
    // Best-effort by contract: orchestration cannot turn a successful write into a failure.
  }
}

function translateMutationError(error: unknown, opts: MutateDocOptions): never {
  if (error instanceof KindConformanceError) {
    throw new CliError("USAGE", error.message, {
      help: opts.helpOnKindReject,
      details: { violations: error.violations },
    });
  }
  if (error instanceof DocumentNotFoundError) {
    throw opts.errors.notFound?.() ?? new CliError("NOT_FOUND", error.message);
  }
  if (error instanceof VersionConflict) {
    if (opts.mode === "create-only") {
      throw opts.errors.alreadyExists?.() ?? new CliError("ALREADY_EXISTS", `'${opts.id}' already exists`);
    }
    throw opts.errors.staleHead?.(error) ?? new CliError("STALE_HEAD", error.message);
  }
  throw classifyBundleError(error, opts.remoteUrl);
}

export async function mutateDoc(opts: MutateDocOptions): Promise<MutateResult> {
  try {
    const result = await mutateDocument({
      bundle: opts.bundle,
      id: opts.id,
      mode: opts.mode,
      registry: opts.registry,
      strict: opts.strict,
      buildCandidate: opts.buildCandidate,
      onAbsent: opts.onAbsent,
      maxAttempts: opts.maxAttempts,
      compareTimestamp: opts.compareTimestamp,
      actor: opts.actor,
      persistActor: opts.persistActor,
      expectedVersion: opts.expectedVersion,
    });

    if (result.changed) await firePostPersist(opts.onPersisted);

    return opts.mode === "patch"
      ? result
      : { doc: result.doc, version: result.version, warnings: result.warnings };
  } catch (error) {
    translateMutationError(error, opts);
  }
}
