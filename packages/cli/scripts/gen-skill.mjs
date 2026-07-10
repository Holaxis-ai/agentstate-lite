// Generate a SKILL.md from the CLI's single source of truth (src/reference.ts COMMAND_GROUPS,
// rendered by src/skill-render.ts), and — for --target skill — sync this skill's `references/`
// folder from its declared manifest (src/skill-references.ts SKILL_REFERENCES): a byte-for-byte
// copy of each source file, with any stray file under references/ NOT named in the manifest
// deleted. Idempotent/convergent, same discipline as the SKILL.md write itself.
//
// AXI §7 "single source of truth": every installable channel's command reference is DERIVED from
// the same COMMAND_GROUPS the home view + `--help` render, so it can never drift. Two TARGETS:
//
//   --target npm   (default) → packages/cli/SKILL.md, examples prefixed `npx -y agentstate-lite`
//                    (the published-package channel; installed with no bin-on-PATH assumption).
//                    Carries no references/ sync — the npm tarball doesn't ship them yet (a known
//                    parked gap; see src/skill-references.ts's header comment).
//   --target skill            → plugins/agentstate-lite/skills/agentstate-lite/SKILL.md +
//                    .../references/, examples prefixed `"$ASLITE"` (the self-contained
//                    committed-bundle channel; see the resolver section it generates — the bundle
//                    is not on PATH, so examples reference the resolved shim path via the shell
//                    variable convention).
//
// The `## Commands` loop is IDENTICAL between targets (rendered by the same renderCommandsSection
// helper, parameterized only by the invocation prefix) — the two SKILL.md files can describe
// different distribution channels but can never list different commands.
//
//   node scripts/gen-skill.mjs [--target npm|skill]           → (re)write the target's SKILL.md
//                                                                (+ sync references/ for skill)
//   node scripts/gen-skill.mjs [--target npm|skill] --check   → exit 1 if stale (CI drift gate)
//
// src/skill-render.ts (which transitively pulls in reference.ts + src/skill-references.ts) is pure
// data + pure projections (no runtime imports), so we bundle it in-memory with esbuild and import
// the result as a data: URL — no temp files, no pre-build.
import { build } from "esbuild";
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, sep, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const skillRenderTs = resolve(here, "../src/skill-render.ts");
// packages/cli/scripts -> repo root
const repoRoot = resolve(here, "../../..");

const targetArgIdx = process.argv.indexOf("--target");
const TARGET = targetArgIdx !== -1 ? process.argv[targetArgIdx + 1] : "npm";
if (TARGET !== "npm" && TARGET !== "skill") {
  console.error(`--target must be "npm" or "skill" (got "${TARGET}")`);
  process.exit(2);
}

const skillPath =
  TARGET === "npm"
    ? resolve(here, "../SKILL.md")
    // packages/cli/scripts -> repo root -> plugins/agentstate-lite/skills/agentstate-lite/SKILL.md
    : resolve(here, "../../../plugins/agentstate-lite/skills/agentstate-lite/SKILL.md");
// packages/cli/scripts -> repo root -> plugins/agentstate-lite/skills/agentstate-lite/references
const referencesDir = resolve(here, "../../../plugins/agentstate-lite/skills/agentstate-lite/references");

async function loadSkillRender() {
  const out = await build({
    entryPoints: [skillRenderTs],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const code = out.outputFiles[0].text;
  return import(`data:text/javascript,${encodeURIComponent(code)}`);
}

// ---------------------------------------------------------------------------------------------
// references/ sync — skill target only. One manifest (SKILL_REFERENCES), read via the same bundle
// as the renderer, so a --check run and a real regen can never disagree about what "the manifest"
// currently is.
// ---------------------------------------------------------------------------------------------

/** All files under `dir`, recursively, as absolute paths (empty array if `dir` doesn't exist). */
async function listFilesRecursive(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFilesRecursive(full)));
    else out.push(full);
  }
  return out;
}

/** Copy every manifest entry byte-for-byte into `referencesDir`, then delete any file under it not named in the manifest. */
async function syncReferences(SKILL_REFERENCES) {
  for (const { src, dest } of SKILL_REFERENCES) {
    const bytes = await readFile(resolve(repoRoot, src));
    const destPath = resolve(referencesDir, dest);
    await mkdir(dirname(destPath), { recursive: true });
    await writeFile(destPath, bytes);
  }
  const wanted = new Set(SKILL_REFERENCES.map((r) => r.dest));
  for (const file of await listFilesRecursive(referencesDir)) {
    const rel = relative(referencesDir, file).split(sep).join("/");
    if (!wanted.has(rel)) await rm(file);
  }
}

/** --check's references-side: every manifest file must byte-match, and nothing extra may exist. */
async function checkReferences(SKILL_REFERENCES) {
  const problems = [];
  for (const { src, dest } of SKILL_REFERENCES) {
    const srcPath = resolve(repoRoot, src);
    const destPath = resolve(referencesDir, dest);
    let wantBytes;
    try {
      wantBytes = await readFile(srcPath);
    } catch (err) {
      problems.push(`manifest source is missing: ${srcPath} (${err.message})`);
      continue;
    }
    const haveBytes = await readFile(destPath).catch(() => null);
    if (haveBytes === null || !wantBytes.equals(haveBytes)) {
      problems.push(`${destPath} is stale or missing`);
    }
  }
  const wanted = new Set(SKILL_REFERENCES.map((r) => r.dest));
  for (const file of await listFilesRecursive(referencesDir)) {
    const rel = relative(referencesDir, file).split(sep).join("/");
    if (!wanted.has(rel)) problems.push(`${file} is not in the manifest (stray file)`);
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------

const { renderNpm, renderSkill, SKILL_REFERENCES } = await loadSkillRender();
const content = TARGET === "npm" ? renderNpm() : renderSkill();

if (process.argv.includes("--check")) {
  let ok = true;
  let current = "";
  try {
    current = await readFile(skillPath, "utf8");
  } catch {
    /* missing → stale */
  }
  if (current !== content) {
    console.error(`${skillPath} is stale — run \`node scripts/gen-skill.mjs --target ${TARGET}\` to regenerate.`);
    ok = false;
  }
  if (TARGET === "skill") {
    for (const problem of await checkReferences(SKILL_REFERENCES)) {
      console.error(problem);
      ok = false;
    }
    if (!ok) console.error(`run \`node scripts/gen-skill.mjs --target skill\` to regenerate references/.`);
  }
  if (!ok) process.exit(1);
  console.log(`${skillPath} is up to date.`);
} else {
  await writeFile(skillPath, content);
  console.log(`wrote ${skillPath}`);
  if (TARGET === "skill") {
    await syncReferences(SKILL_REFERENCES);
    console.log(`synced ${referencesDir}`);
  }
}
