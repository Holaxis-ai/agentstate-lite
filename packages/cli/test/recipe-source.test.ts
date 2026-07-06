/**
 * Recipes Unit B (pluggable recipes) — the seam itself: `parseRecipeFiles` (pure, no fs) and
 * `resolveRecipe`/`filesRecipeSource`/`builtinRecipeSource` (fs-touching, but still no bundle).
 *
 * Covers C.2 test matrix rows 6 (path-safety) and 8 (`parseRecipeFiles` unit table). Command-level
 * integration (built-in re-host, external apply, idempotency, conflict surfacing, malformed ->
 * CliError) lives in `recipes.test.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  parseRecipeFiles,
  resolveRecipe,
  builtinRecipeSource,
  filesRecipeSource,
  builtinNames,
  DEFAULT_RECIPE_REF,
  CONTEXT_NOTES_RECIPE,
  type RecipeFile,
} from "../src/recipe-source.js";

const VALID_MANIFEST: RecipeFile = {
  path: "recipe.md",
  bytes: "---\ntype: Recipe\nid: example\ntitle: Example\nversion: \"1\"\nsummary: A trivial test recipe.\n---\nBody.\n",
};

const VALID_TERM: RecipeFile = {
  path: "conventions/term.md",
  bytes: "---\ntype: Convention\ngoverns: Term\n---\n# Term\n\nA glossary entry.\n",
};

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-recipe-source-test-"));
}

// ── parseRecipeFiles: the pure pipeline (row 8) ────────────────────────────────────────────────

test("parseRecipeFiles: a valid manifest + one convention doc parses to a LoadedRecipe", () => {
  const result = parseRecipeFiles([VALID_MANIFEST, VALID_TERM], "test:valid");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.recipe.id, "example");
  assert.equal(result.recipe.title, "Example");
  assert.equal(result.recipe.version, "1");
  assert.equal(result.recipe.summary, "A trivial test recipe.");
  assert.equal(result.recipe.source, "test:valid");
  assert.deepEqual(result.recipe.governs, ["Term"]);
  assert.equal(result.recipe.docs.length, 1);
  assert.equal(result.recipe.docs[0]!.id, "conventions/term");
  assert.deepEqual(result.recipe.warnings, []);
});

test("parseRecipeFiles: a missing recipe.md manifest -> RECIPE_MALFORMED", () => {
  const result = parseRecipeFiles([VALID_TERM], "test:no-manifest");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_MALFORMED");
  assert.match(result.error.message, /recipe\.md/);
});

test("parseRecipeFiles: recipe.md with the wrong type -> RECIPE_MALFORMED", () => {
  const badType: RecipeFile = {
    path: "recipe.md",
    bytes: "---\ntype: NotARecipe\nid: x\ntitle: X\nversion: \"1\"\nsummary: s\n---\n",
  };
  const result = parseRecipeFiles([badType, VALID_TERM], "test:wrong-type");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_MALFORMED");
});

test("parseRecipeFiles: recipe.md missing id/version -> RECIPE_MALFORMED naming the missing fields", () => {
  const missingFields: RecipeFile = {
    path: "recipe.md",
    bytes: "---\ntype: Recipe\ntitle: X\nsummary: s\n---\n",
  };
  const result = parseRecipeFiles([missingFields, VALID_TERM], "test:missing-fields");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_MALFORMED");
  assert.match(result.error.message, /id/);
  assert.match(result.error.message, /version/);
});

test("parseRecipeFiles: zero valid convention docs -> RECIPE_EMPTY", () => {
  const result = parseRecipeFiles([VALID_MANIFEST], "test:empty");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_EMPTY");
});

test("parseRecipeFiles: a self-duplicate 'governs' within the recipe -> RECIPE_MALFORMED", () => {
  const dup: RecipeFile = {
    path: "conventions/term-2.md",
    bytes: "---\ntype: Convention\ngoverns: Term\n---\n# Term Two\n",
  };
  const result = parseRecipeFiles([VALID_MANIFEST, VALID_TERM, dup], "test:self-dup");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_MALFORMED");
  assert.match(result.error.message, /twice/);
});

test("parseRecipeFiles: an unsafe id (outside conventions/) -> RECIPE_UNSAFE_PATH", () => {
  const outside: RecipeFile = { path: "notes/term.md", bytes: VALID_TERM.bytes };
  const result = parseRecipeFiles([VALID_MANIFEST, outside], "test:outside");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_UNSAFE_PATH");
});

test("parseRecipeFiles: a reserved filename under conventions/ -> RECIPE_UNSAFE_PATH", () => {
  const reserved: RecipeFile = { path: "conventions/index.md", bytes: "---\ntype: Convention\ngoverns: X\n---\n" };
  const result = parseRecipeFiles([VALID_MANIFEST, reserved], "test:reserved");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_UNSAFE_PATH");
});

test("parseRecipeFiles: a non-Convention doc under conventions/ is skipped-with-warning, not fatal", () => {
  const notAConvention: RecipeFile = {
    path: "conventions/other.md",
    bytes: "---\ntype: SomethingElse\n---\nStray file.\n",
  };
  const result = parseRecipeFiles([VALID_MANIFEST, VALID_TERM, notAConvention], "test:skip-warn");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.recipe.docs.length, 1); // only the valid Term convention
  assert.equal(result.recipe.warnings.length, 1);
  assert.equal(result.recipe.warnings[0]!.code, "KIND_CONVENTION_MALFORMED");
});

test("parseRecipeFiles: a convention doc with empty 'governs' is skipped-with-warning", () => {
  const noGoverns: RecipeFile = { path: "conventions/other.md", bytes: "---\ntype: Convention\n---\nNo governs.\n" };
  const result = parseRecipeFiles([VALID_MANIFEST, VALID_TERM, noGoverns], "test:no-governs");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.recipe.docs.length, 1);
  assert.equal(result.recipe.warnings.length, 1);
});

test("parseRecipeFiles: reserved manifest keys (composes/seeds/requires) are surfaced as warnings, never silently dropped", () => {
  const withReserved: RecipeFile = {
    path: "recipe.md",
    bytes: "---\ntype: Recipe\nid: x\ntitle: X\nversion: \"1\"\nsummary: s\ncomposes: [other]\n---\n",
  };
  const result = parseRecipeFiles([withReserved, VALID_TERM], "test:reserved-key");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.recipe.warnings.length, 1);
  assert.equal(result.recipe.warnings[0]!.code, "RECIPE_MANIFEST_RESERVED_KEY");
});

// ── The built-in source (no special-case downstream of `parseRecipeFiles`) ────────────────────

test("builtinRecipeSource: resolves 'context-notes' through parseRecipeFiles, not a hand-rolled shape", async () => {
  const source = builtinRecipeSource();
  const result = await source.resolve("context-notes");
  assert.ok(result);
  assert.equal(result!.ok, true);
  if (!result!.ok) return;
  assert.equal(result!.recipe.id, "context-notes");
  assert.equal(result!.recipe.docs.length, 1);
  assert.equal(result!.recipe.docs[0]!.id, "conventions/context-note");
});

test("builtinRecipeSource: returns null (not addressed to me) for an unknown name and for anything path-shaped", async () => {
  const source = builtinRecipeSource();
  assert.equal(await source.resolve("bogus-recipe"), null);
  assert.equal(await source.resolve("./context-notes"), null);
});

test("builtinNames / DEFAULT_RECIPE_REF / CONTEXT_NOTES_RECIPE stay consistent", () => {
  assert.deepEqual(builtinNames(), ["context-notes", "work-tracking"]);
  assert.equal(DEFAULT_RECIPE_REF, "context-notes");
  assert.equal(CONTEXT_NOTES_RECIPE.id, "context-notes");
});

// ── The files source: path-safety (row 6) ──────────────────────────────────────────────────────

test("filesRecipeSource: returns null for a bare name (not path-shaped)", async () => {
  const source = filesRecipeSource();
  assert.equal(await source.resolve("context-notes"), null);
});

test("resolveRecipe: an absent path -> RECIPE_NOT_FOUND", async () => {
  const result = await resolveRecipe("./definitely-does-not-exist-anywhere");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_NOT_FOUND");
});

test("resolveRecipe: a path to a FILE, not a directory -> RECIPE_UNSAFE_PATH", async () => {
  const dir = await tempDir();
  try {
    const filePath = path.join(dir, "not-a-dir.md");
    await writeFile(filePath, "hello");
    const result = await resolveRecipe(filePath);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.error.code, "RECIPE_UNSAFE_PATH");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("resolveRecipe: an unknown bare name -> RECIPE_NOT_FOUND naming the known built-ins", async () => {
  const result = await resolveRecipe("bogus-recipe-name");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "RECIPE_NOT_FOUND");
  assert.match(result.error.message, /context-notes/);
});

test("resolveRecipe: loads a real external recipe folder end to end (the fixture)", async () => {
  const fixture = path.resolve(import.meta.dirname, "fixtures/example-recipe");
  const result = await resolveRecipe(fixture);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.recipe.id, "example");
  assert.equal(result.recipe.docs.length, 1);
  assert.equal(result.recipe.docs[0]!.id, "conventions/example-term");
  assert.deepEqual(result.recipe.governs, ["Term"]);
});

test("resolveRecipe: a symlink inside conventions/ that escapes the recipe root -> RECIPE_UNSAFE_PATH", async () => {
  const dir = await tempDir();
  const outsideTarget = await tempDir();
  try {
    await mkdir(path.join(dir, "conventions"), { recursive: true });
    await writeFile(path.join(dir, "recipe.md"), VALID_MANIFEST.bytes);
    const outsideFile = path.join(outsideTarget, "escaped.md");
    await writeFile(outsideFile, VALID_TERM.bytes);
    await symlink(outsideFile, path.join(dir, "conventions", "escaped.md"));

    const result = await resolveRecipe(dir);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.error.code, "RECIPE_UNSAFE_PATH");
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(outsideTarget, { recursive: true, force: true });
  }
});
