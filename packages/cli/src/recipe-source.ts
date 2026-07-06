// The pluggable-recipe SEAM (Recipes Unit B) — a minimal `RecipeSource` provider plus ONE pure
// `parseRecipeFiles` pipeline that BOTH a built-in and an external (folder) recipe flow through.
//
// This is the whole point of the unit: a recipe source's sole job is producing `RecipeFile[]`
// (bytes acquisition). Nothing downstream of that — parsing, validation, materialization into a
// `LoadedRecipe` — ever branches on WHERE the bytes came from. `builtinRecipeSource.resolve` reads
// an in-code constant (`BUILTIN_FILES`); `filesRecipeSource.resolve` reads a directory tree. Both
// then call the SAME `parseRecipeFiles(files, source)`. There is no `if (source.kind === "builtin")`
// anywhere past this file's two `resolve()` bodies.
//
// Built-in recipe bytes are IN-CODE constants built at module load from the existing
// `kindConventionDoc(...)` -> `stringifyDoc(...)` serializer (approved §B decision 2) — no codegen,
// no authored on-disk `packages/cli/recipes/**` folder, so the single-file esbuild bundle and the
// `npm pack` "node_modules contains ONLY agentstate-lite" invariant are untouched. `recipes.ts`'s
// `CONTEXT_NOTE_KIND` / `CONTEXT_NOTE_SEED_BODY` / `CONTEXT_NOTES_SUMMARY` / `RECIPE_DESC_BODY`
// supply the CONTENT; this module supplies the packaging + the generic load/parse machinery.
//
// Zero `@agentstate-lite/core` changes: every primitive here (`parseMarkdown`, `stringifyDoc`,
// `kindConventionDoc`, `conceptIdFromPath`, `assertSafeConceptId`, `isReservedFile`,
// `CONVENTIONS_PREFIX`, `CONVENTION_TYPE`) was already exported (CLAUDE.md gate 3).
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseMarkdown,
  stringifyDoc,
  kindConventionDoc,
  conceptIdFromPath,
  assertSafeConceptId,
  isReservedFile,
  CONVENTIONS_PREFIX,
  CONVENTION_TYPE,
  type OkfDocument,
  type ValidationWarning,
} from "@agentstate-lite/core";
import {
  CONTEXT_NOTE_KIND,
  CONTEXT_NOTE_SEED_BODY,
  CONTEXT_NOTES_SUMMARY,
  RECIPE_DESC_BODY,
  TASK_KIND,
  TASK_SEED_BODY,
  WORK_TRACKING_SUMMARY,
  WORK_TRACKING_DESC_BODY,
} from "./recipes.js";

/** One recipe file: a path relative to the recipe root (posix), raw markdown bytes. */
export interface RecipeFile {
  path: string;
  bytes: string;
}

/** The common shape every `RecipeSource` produces and `applyRecipe` (recipes.ts) consumes. */
export interface LoadedRecipe {
  id: string;
  title: string;
  version: string;
  summary: string;
  /** `"builtin:<name>"` or the resolved absolute directory — for receipts (+ future provenance). */
  source: string;
  /** Convention docs, ids under `conventions/`. `timestamp` is stamped at APPLY, not here. */
  docs: OkfDocument[];
  /** The `type` values this recipe's conventions govern (derived at parse, for the receipt). */
  governs: string[];
  /** Non-fatal (skipped-malformed doc / reserved manifest key / etc). Never silently dropped. */
  warnings: ValidationWarning[];
}

export type RecipeErrorCode = "RECIPE_NOT_FOUND" | "RECIPE_MALFORMED" | "RECIPE_EMPTY" | "RECIPE_UNSAFE_PATH";

export interface RecipeError {
  code: RecipeErrorCode;
  message: string;
}

export type LoadResult = { ok: true; recipe: LoadedRecipe } | { ok: false; error: RecipeError };

/** A named- or path-addressed byte source. `resolve` returns `null` when `ref` is not addressed
 * to this source at all (so the next source in line gets a turn) — as opposed to `{ok:false}`,
 * which means "this ref WAS addressed to me, and loading it failed." */
export interface RecipeSource {
  readonly kind: "builtin" | "files";
  resolve(ref: string): Promise<LoadResult | null>;
}

/** Manifest (`recipe.md`) frontmatter keys reserved for a future composition surface (§D
 * non-goals: `composes:`/`seeds:`/`requires:`). Declared-but-unapplied — surfaced as a warning,
 * never silently ignored (approved §B decision 4). */
const RESERVED_MANIFEST_KEYS = ["composes", "seeds", "requires"] as const;

function nonEmptyString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * THE one parse+validate+materialize path (approved §B decision 1). Pure — no fs, no network, no
 * awareness of where `files`/`source` came from. Both `builtinRecipeSource` and
 * `filesRecipeSource` call this, unchanged.
 */
export function parseRecipeFiles(files: RecipeFile[], source: string): LoadResult {
  const manifestFile = files.find((f) => f.path === "recipe.md");
  if (!manifestFile) {
    return {
      ok: false,
      error: { code: "RECIPE_MALFORMED", message: `recipe at '${source}' is missing its required recipe.md manifest` },
    };
  }

  const { frontmatter: manifest } = parseMarkdown(manifestFile.bytes);
  if (manifest.type !== "Recipe") {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe at '${source}': recipe.md must declare 'type: Recipe' (got '${String(manifest.type)}')`,
      },
    };
  }

  const id = nonEmptyString(manifest.id);
  const title = nonEmptyString(manifest.title);
  const version = nonEmptyString(manifest.version);
  const summary = nonEmptyString(manifest.summary);
  const missing = [
    !id && "id",
    !title && "title",
    !version && "version",
    !summary && "summary",
  ].filter((v): v is string => Boolean(v));
  if (missing.length > 0) {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe at '${source}': recipe.md is missing required non-empty field(s): ${missing.join(", ")}`,
      },
    };
  }

  const warnings: ValidationWarning[] = [];
  for (const key of RESERVED_MANIFEST_KEYS) {
    if (key in manifest) {
      warnings.push({
        code: "RECIPE_MANIFEST_RESERVED_KEY",
        message: `recipe '${id}' declares '${key}:' in recipe.md, which this version does not apply (reserved for a future composition surface) — it is declared but NOT applied, not silently ignored.`,
        field: key,
        severity: "warning",
      });
    }
  }

  const docs: OkfDocument[] = [];
  const governsSeen = new Map<string, string>(); // governs -> the doc id that first declared it
  const governsList: string[] = [];

  for (const file of files) {
    if (file.path === "recipe.md") continue;

    const conceptId = conceptIdFromPath(file.path);
    try {
      assertSafeConceptId(conceptId);
    } catch {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${id}' contains an unsafe path '${file.path}'` },
      };
    }
    if (!conceptId.startsWith(CONVENTIONS_PREFIX)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${id}' contains a file outside '${CONVENTIONS_PREFIX}': '${file.path}'`,
        },
      };
    }
    if (isReservedFile(file.path)) {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${id}' contains a reserved filename: '${file.path}'` },
      };
    }

    const { frontmatter, body } = parseMarkdown(file.bytes);
    const doc: OkfDocument = { id: conceptId, frontmatter, body };

    // Mirror loadKinds' own skip-with-warning semantics (a doc that is not `type: Convention`, or
    // has an empty `governs`, is not a kind declaration at all) WITHOUT seeding a backend.
    if (frontmatter.type !== CONVENTION_TYPE) {
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `recipe '${id}': skipped '${doc.id}' (type '${String(frontmatter.type)}', expected '${CONVENTION_TYPE}').`,
        field: doc.id,
        severity: "warning",
      });
      continue;
    }
    const governs = nonEmptyString(frontmatter.governs);
    if (!governs) {
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `recipe '${id}': skipped '${doc.id}' (missing or empty 'governs' field).`,
        field: doc.id,
        severity: "warning",
      });
      continue;
    }

    // Self-duplicate governs WITHIN this recipe is a malformed recipe (approved §B decision 8(i)) —
    // NOT a skip-with-warning, since it means the recipe's own conventions disagree about a type
    // it declares governing twice.
    if (governsSeen.has(governs)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}' declares '${governs}' twice ('${governsSeen.get(governs)}' and '${doc.id}')`,
        },
      };
    }
    governsSeen.set(governs, doc.id);
    governsList.push(governs);
    docs.push(doc);
  }

  if (docs.length === 0) {
    return {
      ok: false,
      error: { code: "RECIPE_EMPTY", message: `recipe '${id}' at '${source}' declares zero valid convention docs` },
    };
  }

  return { ok: true, recipe: { id, title, version, summary, source, docs, governs: governsList, warnings } };
}

// ── The built-in source: bytes from in-code constants, produced through the SAME serializer
// (`kindConventionDoc` -> `stringifyDoc`) core already exports — no hand-authored YAML. ──────────

/** Any placeholder is fine: `applyRecipe` (recipes.ts) always restamps `timestamp` at apply. Its
 * only job here is to occupy the key's position so the in-place-replacement trick (see
 * `recipes.ts`'s `applyRecipe` doc comment) preserves on-disk key order. */
const PLACEHOLDER_TIMESTAMP = "1970-01-01T00:00:00.000Z";

function buildContextNotesFiles(): RecipeFile[] {
  const conv = kindConventionDoc(CONTEXT_NOTE_KIND, CONTEXT_NOTE_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  return [
    {
      path: "recipe.md",
      bytes: stringifyDoc(
        { type: "Recipe", id: "context-notes", title: "Context Notes", version: "1", summary: CONTEXT_NOTES_SUMMARY },
        RECIPE_DESC_BODY,
      ),
    },
    { path: "conventions/context-note.md", bytes: stringifyDoc(conv.frontmatter, conv.body) },
  ];
}

/** The second built-in recipe (the first DOMAIN recipe on the pluggable foundation, Recipes Unit
 * B) — ONE convention (the `Task` kind), built through the identical
 * `kindConventionDoc` -> `stringifyDoc` serializer `buildContextNotesFiles` uses above. */
function buildWorkTrackingFiles(): RecipeFile[] {
  const conv = kindConventionDoc(TASK_KIND, TASK_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  return [
    {
      path: "recipe.md",
      bytes: stringifyDoc(
        { type: "Recipe", id: "work-tracking", title: "Work Tracking", version: "1", summary: WORK_TRACKING_SUMMARY },
        WORK_TRACKING_DESC_BODY,
      ),
    },
    { path: "conventions/task.md", bytes: stringifyDoc(conv.frontmatter, conv.body) },
  ];
}

/** Every built-in recipe's `RecipeFile[]`, keyed by the name `recipe add <name>` takes. */
const BUILTIN_FILES: Record<string, RecipeFile[]> = {
  "context-notes": buildContextNotesFiles(),
  "work-tracking": buildWorkTrackingFiles(),
};

/** Names of every built-in recipe (`recipes` lists exactly these — approved §B decision 9). */
export function builtinNames(): string[] {
  return Object.keys(BUILTIN_FILES);
}

/** npm-style name-vs-path disambiguation (approved §B decision 5): a ref containing a separator
 * or starting `~` is a PATH; anything else is a NAME. A local folder literally named `X` is
 * reachable only as `./X`. */
function looksLikePath(ref: string): boolean {
  return ref.includes("/") || ref.startsWith("~");
}

function expandTilde(ref: string): string {
  if (ref === "~") return os.homedir();
  if (ref.startsWith("~/")) return path.join(os.homedir(), ref.slice(2));
  return ref;
}

export function builtinRecipeSource(): RecipeSource {
  return {
    kind: "builtin",
    async resolve(ref) {
      if (looksLikePath(ref)) return null; // a path is never a builtin name
      const files = BUILTIN_FILES[ref];
      if (!files) return null; // unknown name — let resolveRecipe report it
      return parseRecipeFiles(files, `builtin:${ref}`);
    },
  };
}

/** Read ONLY `recipe.md` (root) + `conventions/**\/*.md` (recursively) under `root`. Any other
 * file in the folder is simply never read — it cannot reach `parseRecipeFiles` at all. A
 * `conventions/` entry whose realpath escapes `root` (a symlink pointing outside the recipe
 * folder) is rejected outright: safety-first, not silently skipped. */
async function readRecipeDir(root: string): Promise<RecipeFile[]> {
  const files: RecipeFile[] = [];

  const manifestPath = path.join(root, "recipe.md");
  const manifestStat = await fs.stat(manifestPath).catch(() => null);
  if (manifestStat?.isFile()) {
    files.push({ path: "recipe.md", bytes: await fs.readFile(manifestPath, "utf8") });
  }

  const conventionsRoot = path.join(root, "conventions");
  const conventionsStat = await fs.stat(conventionsRoot).catch(() => null);
  if (conventionsStat?.isDirectory()) {
    const rootReal = await fs.realpath(root);
    await walkConventions(conventionsRoot, "conventions", rootReal, files);
  }

  return files;
}

async function walkConventions(dir: string, relPrefix: string, rootReal: string, out: RecipeFile[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = `${relPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      await walkConventions(abs, rel, rootReal, out);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    if (!rel.endsWith(".md")) continue;

    const real = await fs.realpath(abs).catch(() => null);
    if (!real || (real !== rootReal && !real.startsWith(rootReal + path.sep))) {
      throw new RecipeUnsafePathSignal(rel);
    }
    out.push({ path: rel, bytes: await fs.readFile(abs, "utf8") });
  }
}

/** Internal signal thrown by `walkConventions` on a symlink-out escape, caught by
 * `filesRecipeSource.resolve` and turned into a structured `RECIPE_UNSAFE_PATH` result — kept out
 * of `readRecipeDir`'s return type so the happy path stays a plain `RecipeFile[]`. */
class RecipeUnsafePathSignal extends Error {
  rel: string;
  constructor(rel: string) {
    super(`unsafe path '${rel}'`);
    this.rel = rel;
  }
}

export function filesRecipeSource(): RecipeSource {
  return {
    kind: "files",
    async resolve(ref) {
      if (!looksLikePath(ref)) return null; // a bare name is never a path
      const expanded = expandTilde(ref);
      const real = await fs.realpath(path.resolve(expanded)).catch(() => null);
      if (!real) {
        return { ok: false, error: { code: "RECIPE_NOT_FOUND", message: `no recipe folder at '${ref}'` } };
      }
      const stat = await fs.stat(real).catch(() => null);
      if (!stat || !stat.isDirectory()) {
        return { ok: false, error: { code: "RECIPE_UNSAFE_PATH", message: `'${ref}' is not a directory` } };
      }
      let files: RecipeFile[];
      try {
        files = await readRecipeDir(real);
      } catch (err) {
        if (err instanceof RecipeUnsafePathSignal) {
          return {
            ok: false,
            error: {
              code: "RECIPE_UNSAFE_PATH",
              message: `recipe folder '${ref}' contains a symlink escaping the recipe root: '${err.rel}'`,
            },
          };
        }
        throw err;
      }
      return parseRecipeFiles(files, real);
    },
  };
}

/** The default resolution order: built-in names first, then a filesystem path. */
export const DEFAULT_SOURCES: RecipeSource[] = [builtinRecipeSource(), filesRecipeSource()];

/** The recipe `init` applies when `--recipe` is omitted. */
export const DEFAULT_RECIPE_REF = "context-notes";

/** Resolve `ref` (a built-in name OR a path to a recipe folder) to a `LoadResult`, trying each
 * source in order. A source returning `null` means "not addressed to me"; the first non-null
 * result (success or a source-specific failure) wins. If NO source claims the ref at all, that is
 * itself a `RECIPE_NOT_FOUND` naming the known built-ins. */
export async function resolveRecipe(ref: string, sources: RecipeSource[] = DEFAULT_SOURCES): Promise<LoadResult> {
  for (const source of sources) {
    const result = await source.resolve(ref);
    if (result) return result;
  }
  return {
    ok: false,
    error: {
      code: "RECIPE_NOT_FOUND",
      message: `unknown recipe '${ref}' (built-ins: ${builtinNames().join(", ")}; or a path to a recipe folder)`,
    },
  };
}

/**
 * Test-convenience: the built-in `context-notes` recipe, pre-resolved through the SAME
 * `parseRecipeFiles` pipeline every caller uses (no separate hand-rolled shape). Synchronous
 * because a builtin source never touches the filesystem — safe to compute once at module load.
 * Several test suites apply this directly (bypassing the CLI's `recipe add`) to seed a bundle's
 * Context Note kind convention for an unrelated test's setup.
 */
function resolveBuiltinSync(name: string): LoadedRecipe {
  const files = BUILTIN_FILES[name];
  if (!files) throw new Error(`resolveBuiltinSync: no built-in recipe named '${name}'`);
  const result = parseRecipeFiles(files, `builtin:${name}`);
  if (!result.ok) throw new Error(`resolveBuiltinSync: built-in '${name}' failed to parse: ${result.error.message}`);
  return result.recipe;
}

export const CONTEXT_NOTES_RECIPE: LoadedRecipe = resolveBuiltinSync("context-notes");
