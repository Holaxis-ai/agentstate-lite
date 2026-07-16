import os from "node:os";
import path from "node:path";

/** npm-style name-vs-path disambiguation: a separator or leading `~` addresses a path. */
export function looksLikeRecipePath(ref: string): boolean {
  return ref.includes("/") || ref.startsWith("~");
}

export function expandRecipePath(ref: string): string {
  if (ref === "~") return os.homedir();
  if (ref.startsWith("~/")) return path.join(os.homedir(), ref.slice(2));
  return ref;
}
