import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  ViewAuthorizationStore,
  ViewAuthorizationSubject,
} from "@agentstate-lite/ui-server";
import { credentialsDir, writeFileAtomic0600 } from "../credentials.js";

const STORE_DIR = "view-authorizations";

interface StoredAuthorization {
  bundle: string;
  subject: ViewAuthorizationSubject;
}

function stableRecord(bundle: string, subject: ViewAuthorizationSubject): StoredAuthorization {
  return {
    bundle,
    subject: {
      registryId: subject.registryId,
      contentVersion: subject.contentVersion,
      contentType: subject.contentType,
      capability: subject.capability,
      execution: subject.execution,
      policyVersion: subject.policyVersion,
    },
  };
}

function serialized(bundle: string, subject: ViewAuthorizationSubject): string {
  return JSON.stringify(stableRecord(bundle, subject));
}

function fileName(bundle: string, subject: ViewAuthorizationSubject): string {
  return `${createHash("sha256").update(serialized(bundle, subject)).digest("hex")}.json`;
}

/**
 * Exact-byte, local-only approval store. One immutable record per subject avoids a shared JSON
 * read/modify/write race when multiple local AgentState sessions approve Views concurrently.
 */
export class LocalViewAuthorizationStore implements ViewAuthorizationStore {
  private readonly bundleIdentity: string;
  private readonly home: string | undefined;

  constructor(bundleIdentity: string, home?: string) {
    this.bundleIdentity = bundleIdentity;
    this.home = home;
  }

  async isAuthorized(subject: ViewAuthorizationSubject): Promise<boolean> {
    const expected = serialized(this.bundleIdentity, subject);
    try {
      const raw = await readFile(
        join(credentialsDir(this.home), STORE_DIR, fileName(this.bundleIdentity, subject)),
        "utf8",
      );
      return raw.trimEnd() === expected;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw error;
    }
  }

  async authorize(subject: ViewAuthorizationSubject): Promise<void> {
    await writeFileAtomic0600(
      join(credentialsDir(this.home), STORE_DIR),
      fileName(this.bundleIdentity, subject),
      `${serialized(this.bundleIdentity, subject)}\n`,
    );
  }
}
