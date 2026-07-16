/**
 * The seed of the board-git import-direction gate (board-git A0, `board-git-API.md`).
 *
 * `PACKAGE_CLEAN_MODULES` names the `packages/cli/src` modules confirmed to import ONLY node
 * builtins, `@agentstate-lite/*` workspace packages, and other modules already on this list — the
 * acceptance bar the future `@agentstate-lite/board-git` package's real modules must clear
 * (`board-git-API.md`'s completion criterion: "the package imports no CLI source and the
 * import-direction test has NO allowlist in any merged commit"). Today the list IS the allowlist,
 * grown module by module as each one is verified clean; A1's extraction removes the list
 * entirely by moving every member (plus their now-satisfied dependents) into the package.
 *
 * A module earns a spot on the list only by NOT importing `credentials.ts`, `errors.ts`,
 * `output.ts`, `invocation.ts`, any `commands/*` module, or any other CLI-bound source — directly
 * or transitively through a relative import that isn't itself on the list.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(here, "../src");

/**
 * Modules confirmed package-clean today (board-git A0). Growing this list is how the board-git
 * extraction makes measurable progress ahead of A1's actual file move.
 */
const PACKAGE_CLEAN_MODULES = ["board-git-errors.ts", "cursor-store.ts"];

/** Every static `import`/`export ... from "…"` specifier, plus dynamic `import("…")` calls. */
function importSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  for (const m of source.matchAll(/\bfrom\s+["']([^"']+)["']/g)) specifiers.push(m[1]!);
  for (const m of source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) specifiers.push(m[1]!);
  return specifiers;
}

/** A specifier is legal for a package-clean module: node builtin, workspace package, or listed. */
function isAllowedSpecifier(specifier: string, allowlist: ReadonlySet<string>): boolean {
  if (specifier.startsWith("node:")) return true;
  if (specifier.startsWith("@agentstate-lite/")) return true;
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const base = path.basename(specifier).replace(/\.js$/, ".ts");
    return allowlist.has(base);
  }
  return false; // a bare package import — not needed by anything on the list today
}

for (const moduleName of PACKAGE_CLEAN_MODULES) {
  test(`package-clean: ${moduleName} imports only node builtins, @agentstate-lite/*, and other package-clean modules`, async () => {
    const source = await readFile(path.join(SRC_DIR, moduleName), "utf8");
    const allowlist = new Set(PACKAGE_CLEAN_MODULES);
    const offenders = importSpecifiers(source).filter((s) => !isAllowedSpecifier(s, allowlist));
    assert.deepEqual(
      offenders,
      [],
      `${moduleName} imports CLI-bound module(s): ${offenders.join(", ")} — this breaks the future package's import-direction rule`,
    );
  });
}
