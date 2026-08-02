import {
  VersionConflict,
  readBlob,
  readDocVersioned,
  writeBlob,
  writeDocVersioned,
  type Bundle,
  type Frontmatter,
  type OkfDocument,
  type Version,
} from "@agentstate-lite/core";
import {
  isViewEntryKey,
  isViewRegistryId,
  VIEW_ENTRY_PREFIX,
  VIEW_REGISTRY_PREFIX,
  type BridgeCapability,
} from "@agentstate-lite/core/page";

export interface SaveTransientViewInput {
  launchId: string;
  viewId: string;
  description?: string;
}

export interface SaveTransientViewResult {
  viewId: string;
  entry: string;
  title: string;
  access: BridgeCapability;
  sourceVersion: Version;
  entryVersion: Version;
  registryVersion: Version;
  entryCreated: boolean;
  registryCreated: boolean;
}

export interface TransientViewSaveSource {
  title: string;
  capability: BridgeCapability;
  contentType: string;
  contentVersion: Version;
  bytes: Uint8Array;
}

/**
 * A transient save may have persisted the immutable entry before a later registry operation
 * failed. The entry is deliberately retained: deleting it could race a concurrent registration.
 * Callers must surface `retainedEntry` rather than reporting the operation as an atomic rollback.
 */
export class TransientViewSaveError extends Error {
  readonly code = "TRANSIENT_VIEW_SAVE_FAILED";
  readonly retainedEntry?: { key: string; version: Version };

  constructor(message: string, retainedEntry?: { key: string; version: Version }) {
    super(message);
    this.name = "TransientViewSaveError";
    this.retainedEntry = retainedEntry;
  }
}

function transientViewEntry(viewId: string): string {
  if (!isViewRegistryId(viewId)) {
    throw new TransientViewSaveError(
      `viewId must be a safe current View registration id under '${VIEW_REGISTRY_PREFIX}'`,
    );
  }
  const entry = `${VIEW_ENTRY_PREFIX}${viewId.slice(VIEW_REGISTRY_PREFIX.length)}.html`;
  if (!isViewEntryKey(entry)) {
    throw new TransientViewSaveError(`viewId '${viewId}' cannot be mapped to a safe View entry`);
  }
  return entry;
}

function withoutTimestamp(frontmatter: Frontmatter): Frontmatter {
  const { timestamp: _timestamp, ...rest } = frontmatter;
  return rest as Frontmatter;
}

function sameSavedRegistration(existing: OkfDocument, desired: OkfDocument): boolean {
  const existingFields = withoutTimestamp(existing.frontmatter);
  const desiredFields = withoutTimestamp(desired.frontmatter);
  const existingKeys = Object.keys(existingFields).sort();
  const desiredKeys = Object.keys(desiredFields).sort();
  return (
    existingKeys.length === desiredKeys.length &&
    existingKeys.every(
      (key, index) => key === desiredKeys[index] && existingFields[key] === desiredFields[key],
    ) &&
    existing.body === desired.body
  );
}

async function readRegistrationIfPresent(
  bundle: Bundle,
  viewId: string,
): Promise<{ doc: OkfDocument; version: Version } | null> {
  try {
    return await readDocVersioned(bundle, viewId);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return null;
    throw error;
  }
}

/** Persist one already-authorized immutable source as a create-only blob/registration pair. */
export async function persistTransientView(
  bundle: Bundle,
  source: TransientViewSaveSource,
  input: SaveTransientViewInput,
  revalidateSource: () => Promise<boolean>,
  options: { actor?: string; now?: string } = {},
): Promise<SaveTransientViewResult> {
  const viewId = input.viewId.trim();
  const entry = transientViewEntry(viewId);
  const description = input.description?.trim();
  if (input.description !== undefined && (!description || description.length > 500)) {
    throw new TransientViewSaveError("description must be a non-empty string of at most 500 characters");
  }
  const title = source.title.trim();
  if (!title || title.length > 120) {
    throw new TransientViewSaveError("the transient View title is invalid for a durable registration");
  }

  const desiredRegistry: OkfDocument = {
    id: viewId,
    frontmatter: {
      type: "View",
      title,
      ...(description ? { description } : {}),
      entry,
      access: source.capability,
      timestamp: options.now ?? new Date().toISOString(),
    },
    body: "",
  };

  const [existingEntry, existingRegistry] = await Promise.all([
    readBlob(bundle, entry),
    readRegistrationIfPresent(bundle, viewId),
  ]);
  if (
    existingEntry !== null &&
    (existingEntry.contentType !== source.contentType ||
      !Buffer.from(existingEntry.bytes).equals(Buffer.from(source.bytes)))
  ) {
    throw new TransientViewSaveError(
      `Cannot save '${viewId}' because a different View entry already exists at '${entry}'.`,
    );
  }
  if (
    existingRegistry !== null &&
    !sameSavedRegistration(existingRegistry.doc, desiredRegistry)
  ) {
    throw new TransientViewSaveError(
      `Cannot save '${viewId}' because a different View registration already exists.`,
    );
  }

  let entryCreated = false;
  let entryVersion: Version;
  if (existingEntry !== null) {
    entryVersion = existingEntry.version;
  } else {
    try {
      entryVersion = await writeBlob(
        bundle,
        entry,
        source.bytes,
        source.contentType,
        { expectedVersion: null, ...(options.actor ? { actor: options.actor } : {}) },
      );
      entryCreated = true;
    } catch (error) {
      if (!(error instanceof VersionConflict)) throw error;
      const winner = await readBlob(bundle, entry);
      if (
        winner === null ||
        winner.contentType !== source.contentType ||
        !Buffer.from(winner.bytes).equals(Buffer.from(source.bytes))
      ) {
        throw new TransientViewSaveError(
          `Cannot save '${viewId}' because another writer created a different View entry at '${entry}'.`,
        );
      }
      entryVersion = winner.version;
    }
  }

  const retainedEntry = entryCreated ? { key: entry, version: entryVersion } : undefined;
  let sourceIsCurrent = false;
  try {
    sourceIsCurrent = await revalidateSource();
  } catch {
    sourceIsCurrent = false;
  }
  if (!sourceIsCurrent || source.contentVersion !== entryVersion) {
    throw new TransientViewSaveError(
      "The transient View changed or expired after its entry was persisted; no registration was created.",
      retainedEntry,
    );
  }

  try {
    let registryCreated = false;
    let registryVersion: Version;
    const currentRegistry = await readRegistrationIfPresent(bundle, viewId);
    if (currentRegistry !== null) {
      if (!sameSavedRegistration(currentRegistry.doc, desiredRegistry)) {
        throw new TransientViewSaveError(
          `Cannot save '${viewId}' because its registration changed before creation completed.`,
          retainedEntry,
        );
      }
      registryVersion = currentRegistry.version;
    } else {
      try {
        const written = await writeDocVersioned(bundle, desiredRegistry, {
          expectedVersion: null,
          ...(options.actor ? { actor: options.actor } : {}),
        });
        registryVersion = written.version;
        registryCreated = true;
      } catch (error) {
        if (!(error instanceof VersionConflict)) throw error;
        const winner = await readRegistrationIfPresent(bundle, viewId);
        if (winner === null || !sameSavedRegistration(winner.doc, desiredRegistry)) {
          throw new TransientViewSaveError(
            `Cannot save '${viewId}' because another writer created a different View registration.`,
            retainedEntry,
          );
        }
        registryVersion = winner.version;
      }
    }

    return {
      viewId,
      entry,
      title,
      access: source.capability,
      sourceVersion: source.contentVersion,
      entryVersion,
      registryVersion,
      entryCreated,
      registryCreated,
    };
  } catch (error) {
    if (error instanceof TransientViewSaveError) throw error;
    const prefix = entryCreated
      ? `The exact View entry was retained at '${entry}', but`
      : `The existing exact View entry at '${entry}' was left untouched, but`;
    throw new TransientViewSaveError(
      `${prefix} its registration could not be created: ${error instanceof Error ? error.message : String(error)}`,
      retainedEntry,
    );
  }
}
