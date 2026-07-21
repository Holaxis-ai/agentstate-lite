/**
 * Source hygiene gate: no SPA source file may contain a raw NUL (or other C0 control byte
 * besides tab/newline/CR). A stray NUL slipped into relationships.ts's dedupe-key separator
 * (PR #140), caught in review only because git flagged the file "binary" -- such a byte is
 * invisible in the Read tool and most editors and makes the file unreviewable in a diff. This
 * gate makes the class impossible to reintroduce silently: use unicode escapes, never the raw byte.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(process.cwd(), "src");
// Every C0 control byte except tab, LF, CR -- written as escapes so THIS file stays clean.
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|css)$/.test(entry)) out.push(full);
  }
  return out;
}

describe("source hygiene", () => {
  it("no SPA source carries a raw NUL or C0 control byte", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const content = readFileSync(file, "utf8");
      if (FORBIDDEN.test(content)) {
        const index = content.search(FORBIDDEN);
        const line = content.slice(0, index).split("\n").length;
        offenders.push(path.relative(SRC, file) + ':' + line);
      }
    }
    expect(offenders).toEqual([]);
  });
});
