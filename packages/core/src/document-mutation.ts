/**
 * CLI-neutral document mutation policy.
 *
 * This is the document-specific layer above {@link versionedMutation}: create-only,
 * overwrite, and patch postures share fresh-read/CAS coupling, kind validation,
 * timestamp ordering, semantic no-op detection, attribution, and final receipts.
 * Consumers own their transport and presentation errors; this module throws typed
 * core failures and never imports CLI or browser concerns.
 */

import { InvalidInputError } from "./errors.js";
import { validateDocumentAgainstRegistry } from "./kinds.js";
import { versionedMutation } from "./mutation.js";
import { VersionConflict } from "./versioning.js";
import { readDocVersioned, writeDocVersioned } from "./bundle.js";
import type { KindRegistry } from "./kinds.js";
import type { ValidationWarning } from "./content-type.js";
import type {
  Bundle,
  ConceptId,
  Frontmatter,
  OkfDocument,
  Version,
} from "./types.js";

const DEFAULT_MAX_ATTEMPTS = 5;

export type DocumentMutationMode = "create-only" | "overwrite" | "patch";

/** The frontmatter and body a caller wants persisted; the service supplies the id. */
export interface DocumentMutationCandidate {
  frontmatter: Frontmatter;
  body: string;
}

/** Typed strict-kind rejection for trusted consumers to translate at their own boundary. */
export class KindConformanceError extends InvalidInputError {
  readonly id: ConceptId;
  readonly governs: string;
  readonly violations: ValidationWarning[];

  constructor(id: ConceptId, governs: string, violations: ValidationWarning[]) {
    super(`'${id}' does not satisfy the '${governs}' kind: ${violations.map((warning) => warning.message).join("; ")}`);
    this.name = "KindConformanceError";
    this.id = id;
    this.governs = governs;
    this.violations = violations;
  }
}

/** Typed missing-document result for patch callers that require an existing target. */
export class DocumentNotFoundError extends Error {
  readonly id: ConceptId;

  constructor(id: ConceptId) {
    super(`no concept document at id '${id}'`);
    this.name = "DocumentNotFoundError";
    this.id = id;
  }
}

export interface MutateDocumentOptions {
  bundle: Bundle;
  id: ConceptId;
  mode: DocumentMutationMode;
  /** Loaded once by the trusted caller; the service never performs registry discovery implicitly. */
  registry: KindRegistry;
  /** Reject rather than return a non-empty kind warning set. */
  strict: boolean;
  /** Recomputed against every fresh CAS attempt. */
  buildCandidate: (
    existing: OkfDocument | undefined,
  ) => DocumentMutationCandidate | Promise<DocumentMutationCandidate>;
  /** Patch only: require an existing target or allow an expect-absent create. */
  onAbsent?: "fail" | "create";
  /** Retry budget for overwrite and ordinary patch. */
  maxAttempts?: number;
  /** Patch only: include timestamp in semantic no-op comparison. */
  compareTimestamp?: boolean;
  /** Advisory backend-history attribution, applied only when a write occurs. */
  actor?: string;
  /** Also persist the advisory actor in document frontmatter after no-op detection. */
  persistActor?: boolean;
  /** Patch only: a caller-supplied token makes the operation a single-shot hard CAS. */
  expectedVersion?: Version;
}

export interface DocumentMutationResult {
  doc: OkfDocument;
  changed: boolean;
  version: Version;
  warnings: ValidationWarning[];
}

/** Structural equality through plain objects and arrays, independent of object key order. */
function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((value, index) => valuesEqual(value, b[index]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const aRecord = a as Record<string, unknown>;
    const bRecord = b as Record<string, unknown>;
    const aKeys = Object.keys(aRecord);
    const bKeys = Object.keys(bRecord);
    return aKeys.length === bKeys.length && aKeys.every((key) => valuesEqual(aRecord[key], bRecord[key]));
  }
  return false;
}

function isNoopPatch(
  existing: OkfDocument,
  candidate: DocumentMutationCandidate,
  compareTimestamp: boolean,
): boolean {
  if (candidate.body !== existing.body) return false;
  if (compareTimestamp) return valuesEqual(existing.frontmatter, candidate.frontmatter);
  const { timestamp: _existingTimestamp, ...existingRest } = existing.frontmatter;
  const { timestamp: _candidateTimestamp, ...candidateRest } = candidate.frontmatter;
  return valuesEqual(existingRest, candidateRest);
}

function attributeCandidate(
  candidate: DocumentMutationCandidate,
  actor: string | undefined,
  persistActor: boolean,
): DocumentMutationCandidate {
  if (!persistActor || actor === undefined) return candidate;
  return { ...candidate, frontmatter: { ...candidate.frontmatter, actor } };
}

function validateCandidate(
  id: ConceptId,
  candidate: DocumentMutationCandidate,
  registry: KindRegistry,
  strict: boolean,
): ValidationWarning[] {
  const { kind, warnings } = validateDocumentAgainstRegistry({ id, ...candidate }, registry);
  if (strict && kind && warnings.length > 0) {
    throw new KindConformanceError(id, kind.governs, warnings);
  }
  return warnings;
}

export async function mutateDocument(opts: MutateDocumentOptions): Promise<DocumentMutationResult> {
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;
  const persistActor = opts.persistActor ?? false;

  if (opts.mode === "create-only") {
    const candidate = attributeCandidate(await opts.buildCandidate(undefined), opts.actor, persistActor);
    const warnings = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
    const { doc, version } = await writeDocVersioned(opts.bundle, { id: opts.id, ...candidate }, {
      expectedVersion: null,
      actor: opts.actor,
    });
    return { doc, changed: true, version, warnings };
  }

  const readExisting = async (): Promise<{ state: OkfDocument | undefined; version: Version | null }> => {
    try {
      const { doc, version } = await readDocVersioned(opts.bundle, opts.id);
      return { state: doc, version };
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return { state: undefined, version: null };
      throw error;
    }
  };

  if (opts.mode === "overwrite") {
    let savedDoc: OkfDocument | undefined;
    let warnings: ValidationWarning[] = [];
    const outcome = await versionedMutation<OkfDocument, undefined>({
      read: readExisting,
      decide: async (existing) => {
        const candidate = attributeCandidate(await opts.buildCandidate(existing), opts.actor, persistActor);
        warnings = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
        return { action: "write", next: { id: opts.id, ...candidate }, result: undefined };
      },
      write: async (next, expectedVersion) => {
        const written = await writeDocVersioned(opts.bundle, next, { expectedVersion, actor: opts.actor });
        savedDoc = written.doc;
        return written.version;
      },
      maxAttempts,
    });
    return { doc: savedDoc!, changed: true, version: outcome.version!, warnings };
  }

  let lastReadVersion: Version | null = null;
  let savedDoc: OkfDocument | undefined;
  const hardCas = opts.expectedVersion !== undefined;
  const outcome = await versionedMutation<OkfDocument, { doc?: OkfDocument; warnings: ValidationWarning[] }>({
    read: async () => {
      const read = await readExisting();
      lastReadVersion = read.version;
      if (read.state === undefined && onAbsent === "fail") throw new DocumentNotFoundError(opts.id);
      return read;
    },
    decide: async (existing) => {
      if (hardCas && lastReadVersion !== opts.expectedVersion) {
        throw new VersionConflict(opts.id, opts.expectedVersion!, lastReadVersion);
      }

      const candidate = await opts.buildCandidate(existing);
      if (existing && isNoopPatch(existing, candidate, compareTimestamp)) {
        return { action: "done", result: { doc: existing, warnings: [] } };
      }

      const attributed = attributeCandidate(candidate, opts.actor, persistActor);
      const warnings = validateCandidate(opts.id, attributed, opts.registry, opts.strict);
      return { action: "write", next: { id: opts.id, ...attributed }, result: { warnings } };
    },
    write: async (next, expectedVersion) => {
      const written = await writeDocVersioned(opts.bundle, next, {
        expectedVersion: hardCas ? opts.expectedVersion! : expectedVersion,
        actor: opts.actor,
      });
      savedDoc = written.doc;
      return written.version;
    },
    maxAttempts: hardCas ? 1 : maxAttempts,
  });

  return outcome.wrote
    ? { doc: savedDoc!, changed: true, version: outcome.version!, warnings: outcome.result.warnings }
    : { doc: outcome.result.doc!, changed: false, version: outcome.version!, warnings: [] };
}
