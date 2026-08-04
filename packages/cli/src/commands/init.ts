// `agentstate-lite init [--dir <path>] [--okf-version <v>]` — create (or open) an OKF knowledge bundle.
//
// Thin wrapper over core `initBundle(root, { okfVersion })`: creates the directory and a root
// `index.md` carrying the `okf_version` frontmatter (the sole place OKF permits index.md frontmatter).
// Idempotent — re-running against an existing bundle leaves its `index.md` untouched. The target dir
// is `--dir` or the cwd (unlike the other commands, `init` does NOT require the dir to already be a
// bundle — it is what makes one).
import { parseArgs } from "node:util";
import { existsSync } from "node:fs";
import path from "node:path";
import { initBundle, loadKinds } from "@agentstate-lite/core";
import { resolveTargetDir } from "../bundle.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation, shellArg } from "../invocation.js";
import { applyRecipe } from "../recipes.js";
import { resolveRecipe, DEFAULT_RECIPE_REF } from "../recipe-source.js";

export const INIT_USAGE = `agentstate-lite init — create (or open) an OKF knowledge bundle

Usage:
  agentstate-lite init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]

Options:
  --dir <path>            Directory to init the bundle in (default: the current directory)
  --okf-version <v>       OKF version stamped into the root index.md (default: 0.1)
  --recipe <name-or-path> Apply a recipe on create (default: context-notes; 'none' for a bare
                           bundle) — a built-in name or a path to a recipe folder; see
                           'agentstate-lite recipes' to list built-ins
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help
`;

/** Injectable seam so the parse→init wiring is unit-testable. */
export interface InitCliDeps {
  stdout: (s: string) => void;
}

/**
 * FS-only: true when `dir` or any ancestor contains a `.git` entry (directory OR file — a `.git`
 * FILE is how git marks a secondary checkout, so both shapes count). Deliberately never invokes
 * the git binary: `init` stays engine-only/offline, and this probe exists solely to print a hint,
 * so a cheap, dependency-free walk is the whole contract (plan §U6: "detected by `.git` up-tree,
 * NO git binary invoked").
 */
export function insideGitRepo(dir: string): boolean {
  let cur = path.resolve(dir);
  for (;;) {
    if (existsSync(path.join(cur, ".git"))) return true;
    const parent = path.dirname(cur);
    if (parent === cur) return false;
    cur = parent;
  }
}

/** CLI entry: parse flags, init the bundle, print its root. */
export async function init(argv: string[], deps: Partial<InitCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          "okf-version": { type: "string" },
          recipe: { type: "string" },
          // Declared (not just left to error out generically) so a misdirected `init --remote`
          // gets the SPECIFIC message below instead of parseArgs's generic unknown-option text.
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "init",
  );
  if (values.help) {
    stdout(INIT_USAGE);
    return;
  }
  if (values.remote) {
    throw new CliError(
      "USAGE",
      "the wire protocol has no create-bundle endpoint; run init on the server's directory",
      // Both halves of this two-step hint must resolve for the ACTUAL running executable (AXI
      // §7/§10) — a bare `agentstate-lite serve` here would be a phantom invocation under `npx`
      // or the skill-bundle channel. Found during the A3 audit (the plan's grep missed this one
      // because it looked for a bare-bin bypass, not a hardcode embedded AFTER an interpolation).
      { help: `${cliInvocation()} init --dir <path> (then ${cliInvocation()} serve --dir <path>)` },
    );
  }

  const root = resolveTargetDir(values.dir);
  const okfVersion = values["okf-version"]?.trim();
  // The engine (`initBundle`) no longer seeds anything (CLAUDE.md gate 3: core special-cases
  // nothing about conventions) — it just creates the bundle. `init` applies the default recipe
  // via the SAME generic machinery `recipe add` uses (decision 2: full self-hosting from day
  // one, now expressed as a product-surface commitment in the CLI, not an engine default).
  // Idempotent (expect-absent CAS per doc) — re-running `init` against an already-recipe'd bundle
  // is a no-op for each convention doc. `--recipe none` opts out to a bare bundle.
  const bundle = await initBundle(root, okfVersion ? { okfVersion } : {});
  const recipeRef = values.recipe?.trim() || DEFAULT_RECIPE_REF;
  let recipeApplied = "none";
  let selectedRecipeKinds: string[] = [];
  let warnings: unknown[] = [];
  if (recipeRef !== "none") {
    const loaded = await resolveRecipe(recipeRef);
    if (!loaded.ok) {
      throw new CliError("USAGE", loaded.error.message, { help: `${cliInvocation()} recipes` });
    }
    const result = await applyRecipe(bundle, loaded.recipe);
    recipeApplied = result.id;
    selectedRecipeKinds = loaded.recipe.governs;
    // Duplicate-`governs` against the TARGET bundle (approved §B decision 8(ii)), same as
    // `recipe add` — surfaced via the EXISTING `loadKinds` machinery, no new conflict machinery.
    const registry = await loadKinds(bundle);
    const dupWarnings = registry.warnings.filter((w) => w.code === "KIND_DUPLICATE_GOVERNS");
    warnings = [...result.warnings, ...dupWarnings];
  }

  const receipt: Record<string, unknown> = { init: "ok", root: bundle.root, recipe: recipeApplied };
  if (warnings.length > 0) receipt.warnings = warnings;
  // `init` always creates a local bundle. Inside a Git repo, an advisory fs-only hint distinguishes
  // joining an existing shared board from explicitly sharing this new one.
  if (insideGitRepo(root)) {
    receipt.hint =
      "this bundle is local until shared — if the project already shares a board, " +
      `\`${cliInvocation()} sync\` joins it (never init there, that mints a divergent second ` +
      `bundle); to start sharing this one, \`${cliInvocation()} sync --establish\``;
  }
  // A selected recipe may not install Context Note (or any kind at all). Never advertise a
  // mutation the resulting bundle cannot perform; use the recipe's parsed `governs` inventory to
  // offer the known Context Note shortcut or send the caller through the generic kind catalog.
  // When `--dir` selected a bundle outside the invocation cwd, retain that resolved target in every
  // follow-up. Otherwise a copy-pasted read can inspect a different bundle and `new` can mutate it.
  const target = values.dir === undefined ? "" : ` --dir ${shellArg(root)}`;
  const help: string[] = [];
  if (selectedRecipeKinds.includes("Context Note")) {
    help.push(`${cliInvocation()} new "Context Note" <id> --title <title>${target}`);
  } else if (selectedRecipeKinds.length > 0) {
    help.push(`${cliInvocation()} kinds${target}`);
  }
  help.push(`${cliInvocation()} recipes${target}`);
  receipt.help = help;

  stdout(render(receipt, resolveMode(values)));
}
