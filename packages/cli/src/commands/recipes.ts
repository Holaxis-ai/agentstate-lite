// `agentstate-lite recipes` — list built-in recipes and whether each is already applied to this
// bundle.
//
// Mirrors `kinds.ts` (read-only, --dir/--remote, TOON, a `count`). A recipe bundles one or more
// kind-convention docs (with bodies) an agent can install onto a bundle in one shot; `recipe add
// <name-or-path>` is the apply verb (packages/cli/src/commands/recipe.ts). `init` applies the
// default recipe (`context-notes`) via the same generic machinery unless `--recipe none` is
// passed.
//
// Lists BUILT-INS ONLY (approved §B decision 9) — an external (path-addressed) recipe is not
// enumerable, since there is no registry of "every recipe folder that might exist on disk
// somewhere." A `recipes --path <dir>` inspect is reserved, not built.
import { parseArgs } from "node:util";
import { openBundle, resolveRemoteFlag } from "../bundle.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { appliedDocIds, isRecipeApplied } from "../recipes.js";
import { builtinNames, resolveRecipe, type LoadedRecipe } from "../recipe-source.js";

export const RECIPES_USAGE = `agentstate-lite recipes — list built-in recipes and whether each is applied

Usage:
  agentstate-lite recipes [--dir <path>] [--remote <url>]

A recipe is a folder ('recipe.md' manifest + 'conventions/*.md' docs) that 'recipe add
<name-or-path>' installs onto a bundle in one shot — idempotently (re-adding an already-applied
recipe is a changed:false no-op). A definitions-only portable recipe may also declare static
Reference docs and Page registry/HTML pairs without carrying instances. This command lists the
BUILT-IN recipes shipped with the CLI; an external recipe (a path) is not enumerated here, only
path-addressed via 'recipe add <path>'.
'init' applies the default recipe ('context-notes') automatically unless '--recipe none' is
passed. See 'agentstate-lite kinds' for the LIVE per-bundle registry a recipe's docs feed into.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;

export interface RecipesCliDeps {
  stdout: (s: string) => void;
}

/** Project one LoadedRecipe (+ whether it's applied) into the flat row shape `recipes` renders. */
function toRow(recipe: LoadedRecipe, applied: boolean): Record<string, unknown> {
  return {
    name: recipe.id,
    version: recipe.version,
    applied,
    summary: recipe.summary,
    docs: recipe.docs.map((d) => d.id),
  };
}

export async function recipes(argv: string[], deps: Partial<RecipesCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "recipes",
  );
  if (values.help) {
    stdout(RECIPES_USAGE);
    return;
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const appliedIds = await appliedDocIds(bundle);

  const rows: Record<string, unknown>[] = [];
  for (const name of builtinNames()) {
    const loaded = await resolveRecipe(name);
    // Every built-in name resolves by construction (parseRecipeFiles ran once already at module
    // load to build CONTEXT_NOTES_RECIPE) — but stay defensive rather than assume.
    if (!loaded.ok) continue;
    rows.push(toRow(loaded.recipe, isRecipeApplied(loaded.recipe, appliedIds)));
  }

  stdout(
    render(
      { count: rows.length, recipes: rows, help: [`${cliInvocation()} recipe add <name-or-path>`] },
      resolveMode(values),
    ),
  );
}
