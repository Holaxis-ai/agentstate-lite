/**
 * Render-path gate (designs/doc-reader rev 2, MEDIUM-3): the reader builds React elements from
 * mdast DIRECTLY — no HTML-string intermediate, no DOMParser, no innerHTML sink. This grep gate
 * bans `dangerouslySetInnerHTML` (and DOMParser/innerHTML use) across the SPA source so the
 * closed-construction belt cannot silently regress anywhere content renders.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(process.cwd(), "src");
const BANNED = [/dangerouslySetInnerHTML/, /\binnerHTML\s*=/, /new DOMParser\(/];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") && !entry.endsWith(".test.tsx")) out.push(full);
  }
  return out;
}

describe("reader render-path gate", () => {
  it("bans dangerouslySetInnerHTML / innerHTML assignment / DOMParser in SPA source", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const content = readFileSync(file, "utf8");
      for (const pattern of BANNED) {
        if (pattern.test(content)) offenders.push(`${path.relative(SRC, file)}: ${pattern}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
