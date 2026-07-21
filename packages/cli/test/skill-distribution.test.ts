/**
 * Distribution-completeness gate: every capability the skill-target SKILL.md advertises must ship
 * a backing contract/example under `references/` — the skill is one projection of the
 * distribution-neutral inventory in src/distribution-resources.ts.
 *
 * Runs in `npm test -w aslite`, hence `npm run check` — PR-side is the right layer here
 * because a gap is a SOURCE defect (a new command that never declares its shipped-contract
 * surface, or new prose that points at a file nobody added to the manifest): the bot that
 * regenerates plugins/ on merge to main would otherwise ship the gap FIRST, and only a human
 * diff-reading the generated output after the fact would ever catch it.
 *
 * Checks include inventory ownership and channel intent, then skill-projection exhaustiveness.
 * SKILL_COMMAND_RESOURCES covers every COMMAND_GROUPS
 * command name, no more, no less; (2)+(3) validity — every dest a contract/pattern names, and
 * every src it copies from, actually exists; (4) the capability sweep — render the skill-target
 * SKILL.md in memory and confirm every SKILL_CAPABILITY_PATTERNS tripwire both fires AND is satisfied;
 * (5) no orphans/no phantom pointers — the manifest and the rendered prose agree on what's shipped
 * in both directions.
 *
 * Honest limit (see distribution-resources.ts's pattern doc comment): this cannot
 * recognize a semantically NOVEL capability described in prose that no pattern below anticipates —
 * check (1) covers the command-shaped majority; adding a pattern row is the same one-table
 * discipline extended to free prose.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { COMMAND_GROUPS, commandName } from "../src/reference.js";
import {
  DISTRIBUTION_CHANNELS,
  DISTRIBUTION_RESOURCES,
  RESOURCE_ROLES,
  SKILL_CAPABILITY_PATTERNS,
  SKILL_COMMAND_RESOURCES,
  SKILL_RESOURCES,
  projectResources,
} from "../src/distribution-resources.js";
import { renderNpm, renderSkill } from "../src/skill-render.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../..");

const ALL_COMMAND_NAMES = [
  ...new Set(COMMAND_GROUPS.flatMap(({ commands }) => commands.map((c) => commandName(c.usage)))),
];
const SKILL_DESTS = new Set(SKILL_RESOURCES.map((r) => r.dest));

// ---------------------------------------------------------------------------------------------
// Inventory ownership — resources are repo-owned and classified before any channel projects them.
// ---------------------------------------------------------------------------------------------

test("distribution resources have unique repo authorities, declared roles, and at least one target", () => {
  const sources = new Set<string>();
  const seenRoles = new Set<string>();
  for (const resource of DISTRIBUTION_RESOURCES) {
    assert.ok(!sources.has(resource.src), `duplicate distribution authority: ${resource.src}`);
    sources.add(resource.src);
    assert.doesNotMatch(resource.src, /^plugins\//, "generated plugin content cannot be a resource authority");
    assert.ok(RESOURCE_ROLES.includes(resource.role), `unknown resource role: ${resource.role}`);
    seenRoles.add(resource.role);
    assert.ok(Object.keys(resource.targets).length > 0, `${resource.src} has no distribution target`);
  }
  assert.deepEqual([...seenRoles].sort(), [...RESOURCE_ROLES].sort());
});

test("each channel projection has unique destinations backed by real repo sources", () => {
  for (const channel of DISTRIBUTION_CHANNELS) {
    const destinations = new Set<string>();
    for (const { src, dest } of projectResources(channel)) {
      assert.ok(!destinations.has(dest), `${channel} projects two resources to ${dest}`);
      destinations.add(dest);
      assert.ok(existsSync(path.join(REPO_ROOT, src)), `${channel} projects missing source ${src}`);
    }
  }
});

test("npm auxiliary resources remain an explicit empty projection in this no-behavior-change unit", () => {
  assert.deepEqual(projectResources("npm"), []);
  const packageJson = JSON.parse(readFileSync(path.join(REPO_ROOT, "packages/cli/package.json"), "utf8"));
  assert.deepEqual(packageJson.files, ["dist"]);
});

// ---------------------------------------------------------------------------------------------
// (1) Exhaustiveness — the ratchet. Both directions: a new command with no key, and a stale key
// left behind by a removed/renamed command, are both a drift a human should reconcile by hand.
// ---------------------------------------------------------------------------------------------

test("SKILL_COMMAND_RESOURCES has a key for every COMMAND_GROUPS command name", () => {
  for (const name of ALL_COMMAND_NAMES) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(SKILL_COMMAND_RESOURCES, name),
      `new command \`${name}\` must declare its skill-resource surface ([] if self-contained).`,
    );
  }
});

test("SKILL_COMMAND_RESOURCES has no stale key for a command that no longer exists", () => {
  const names = new Set(ALL_COMMAND_NAMES);
  for (const key of Object.keys(SKILL_COMMAND_RESOURCES)) {
    assert.ok(names.has(key), `SKILL_COMMAND_RESOURCES has a stale key \`${key}\` — no command produces this name.`);
  }
});

// ---------------------------------------------------------------------------------------------
// (2)+(3) Validity — every dest a contract/pattern names must be a REAL manifest entry, and every
// manifest entry's src must be a real file (from the repo root).
// ---------------------------------------------------------------------------------------------

test("every SKILL_COMMAND_RESOURCES dest names a real skill projection", () => {
  for (const [name, dests] of Object.entries(SKILL_COMMAND_RESOURCES)) {
    for (const dest of dests) {
      assert.ok(SKILL_DESTS.has(dest), `command \`${name}\` requires \`${dest}\`, which is not skill-projected.`);
    }
  }
});

test("every SKILL_CAPABILITY_PATTERNS requirement names a real skill projection", () => {
  for (const { pattern, requires } of SKILL_CAPABILITY_PATTERNS) {
    for (const dest of requires) {
      assert.ok(SKILL_DESTS.has(dest), `capability pattern ${pattern} requires \`${dest}\`, which is not skill-projected.`);
    }
  }
});

test("every skill-projected source exists on disk", () => {
  for (const { src, dest } of SKILL_RESOURCES) {
    assert.ok(
      existsSync(path.join(REPO_ROOT, src)),
      `manifest entry dest=\`${dest}\` names a source that does not exist: ${src}`,
    );
  }
});

test("the shipped View examples include capability-independent navigation from a content View", () => {
  for (const dest of [
    "views/about.html",
    "views/views-registry/about.md",
    "views/references/view-authoring-v0.md",
  ]) {
    assert.ok(SKILL_DESTS.has(dest), `View navigation reference is not skill-projected: ${dest}`);
  }
});

function relativeFileInventory(root: string, prefix = ""): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory()
      ? relativeFileInventory(path.join(root, entry.name), relative)
      : [relative];
  });
}

test("the shipped review-workflow references exactly mirror the complete recipe folder", () => {
  const sourcePrefix = "examples/recipes/review-workflow/";
  const destPrefix = "recipes/review-workflow/";
  const inventory = relativeFileInventory(path.join(REPO_ROOT, sourcePrefix)).sort();
  const expected = inventory.map((relative) => ({
    src: `${sourcePrefix}${relative}`,
    dest: `${destPrefix}${relative}`,
  }));
  const actual = SKILL_RESOURCES
    .filter(({ src, dest }) => src.startsWith(sourcePrefix) || dest.startsWith(destPrefix))
    .sort((a, b) => a.src.localeCompare(b.src));
  assert.deepEqual(actual, expected);
});

test("the portable recipe carries the canonical View convention byte-for-byte", () => {
  const canonical = readFileSync(path.join(REPO_ROOT, "examples/views/conventions/view.md"));
  const portable = readFileSync(path.join(REPO_ROOT, "examples/recipes/review-workflow/conventions/view.md"));
  assert.deepEqual(portable, canonical);
});

test("the portable recipe carries the canonical bundle-native View authoring reference byte-for-byte", () => {
  const canonical = readFileSync(path.join(REPO_ROOT, "examples/views/references/view-authoring-v0.md"));
  const portable = readFileSync(
    path.join(REPO_ROOT, "examples/recipes/review-workflow/references/view-authoring-v0.md"),
  );
  assert.deepEqual(portable, canonical);
});

test("the View authoring reference documents hello grants for both read and proposal capabilities", () => {
  const reference = readFileSync(
    path.join(REPO_ROOT, "examples/views/references/view-authoring-v0.md"),
    "utf8",
  );
  assert.match(reference, /hello\.result\.grant.*`"read"` for `bundle-read`.*`"propose"` for `bundle-propose`/);
});

// ---------------------------------------------------------------------------------------------
// (4)+(5) Render the skill-target SKILL.md in memory and check it against the manifest in BOTH
// directions: every capability pattern fires and is backed (dead pattern = fail), every shipped
// file is mentioned (orphan = fail), and every `$REFS/…` path mentioned resolves to something
// actually shipped (phantom pointer = fail).
// ---------------------------------------------------------------------------------------------

const rendered = renderSkill();
const renderedNpm = renderNpm();

test("npm and plugin skill channels share the authenticated-remote access contract", () => {
  for (const text of [renderedNpm, rendered]) {
    assert.match(text, /## Remote bundle access \(--remote, serve\)/);
    assert.match(text, /AGENTSTATE_LITE_API_KEY/);
    assert.match(text, /already-provisioned\s+stored per-origin credential/);
    assert.match(text, /provisioning is outside the default CLI surface/);
    assert.doesNotMatch(text, /\b(?:login|join|whoami)\s+--remote\b/);
    assert.doesNotMatch(text, /\b(?:invite|member|key)\s+(?:create|list|revoke|set-role|remove|mint)\b/);
  }
});

test("actor guidance distinguishes advisory labels from backend-owned attribution", () => {
  assert.match(
    rendered,
    /no advisory actor label is stored in frontmatter or sent as an agent label/,
  );
  assert.match(rendered, /backend history still reports its own principal/);
  assert.match(rendered, /local OS owner or an\s+authenticated remote user/);
});

test("no SKILL_CAPABILITY_PATTERNS entry is dead", () => {
  for (const { pattern, requires } of SKILL_CAPABILITY_PATTERNS) {
    assert.ok(
      pattern.test(rendered),
      `capability pattern ${pattern} matches nothing in the rendered skill-target SKILL.md — dead tripwire, fix or remove it.`,
    );
    for (const dest of requires) {
      assert.ok(SKILL_DESTS.has(dest), `capability pattern ${pattern} requires \`${dest}\`, missing from skill projection.`);
    }
  }
});

/** `dest` itself, plus every directory prefix of it (trailing slash) — any of which counts as "mentioned". */
function destMentionCandidates(dest: string): string[] {
  const parts = dest.split("/");
  const candidates = [dest];
  for (let i = 1; i < parts.length; i++) candidates.push(`${parts.slice(0, i).join("/")}/`);
  return candidates;
}

test("no orphans — every shipped file (or an enclosing directory of it) is mentioned in the rendered SKILL.md", () => {
  for (const { src, dest } of SKILL_RESOURCES) {
    const mentioned = destMentionCandidates(dest).some((candidate) => rendered.includes(candidate));
    assert.ok(
      mentioned,
      `\`${dest}\` (from ${src}) is shipped but never mentioned in the rendered skill-target SKILL.md — an orphaned reference nobody points at.`,
    );
  }
});

/** Every `$REFS/<path>` token in `text` — the path segment up to the first char outside a bare path shape. */
function extractRefsPaths(text: string): string[] {
  return [...text.matchAll(/\$REFS\/([A-Za-z0-9._/-]+)/g)].map((m) => m[1]!);
}

/** Whether `refPath` is itself a manifest dest, or a (possibly bare, no trailing slash) directory prefix of one. */
function resolvesToManifest(refPath: string): boolean {
  const normalized = refPath.endsWith("/") ? refPath.slice(0, -1) : refPath;
  for (const dest of SKILL_DESTS) {
    if (dest === normalized || dest.startsWith(`${normalized}/`)) return true;
  }
  return false;
}

test("no phantom pointers — every $REFS/… path in the rendered SKILL.md resolves to a shipped dest or dir-prefix", () => {
  const phantoms = [...new Set(extractRefsPaths(rendered).filter((p) => !resolvesToManifest(p)))];
  assert.deepEqual(phantoms, [], `phantom $REFS/ path(s) — point nowhere in the skill projection: ${phantoms.join(", ")}`);
});

// ---------------------------------------------------------------------------------------------
// Teaching-channel pins (plans/rename-page-kind-to-view, Unit 3): View is CANONICAL in every
// regenerated teaching surface; Page appears only as the accepted legacy name. These pins are
// red-on-old — each failed against the pre-rename render.
// ---------------------------------------------------------------------------------------------

test("the rendered skill teaches View authoring canonically (views paths, type: View, View convention)", () => {
  assert.match(rendered, /## Bundle views — ship a live UI as bundle content/);
  assert.match(rendered, /`type: View` registry doc/);
  assert.ok(rendered.includes("--doc-key views/my-view.html"), "authoring step 2 must promote under views/");
  assert.ok(rendered.includes("--doc-key views-registry/my-view.md"), "authoring step 3 must target views-registry/");
  assert.ok(rendered.includes('promote "$REFS/views/conventions/view.md" --doc-key conventions/view.md'), "authoring step 4 must install the View convention");
  assert.ok(rendered.includes('cat "$REFS/views/references/view-authoring-v0.md"'), "the shipped contract pointer must be the View authoring reference");
});

test("the rendered skill mentions legacy Page exactly once — the legacy note, never authoring guidance", () => {
  // The single accepted-legacy sentence. Any other `type: Page` occurrence is stale teaching.
  const legacyMentions = rendered.match(/type: Page/g) ?? [];
  assert.equal(legacyMentions.length, 1, "exactly one `type: Page` mention (the legacy note) may remain");
  assert.match(rendered, /`Page` is the accepted legacy name/);
  // No authoring guidance may target the legacy prefixes.
  assert.doesNotMatch(rendered, /--doc-key pages\//);
  assert.doesNotMatch(rendered, /--doc-key pages-registry\//);
  assert.doesNotMatch(rendered, /conventions\/page\.md/);
  assert.doesNotMatch(rendered, /page-authoring-v0/);
});

test("the npm-target SKILL teaches Views, with zero stale Page vocabulary", () => {
  assert.match(renderedNpm, /live\s+bundle Views/);
  assert.doesNotMatch(renderedNpm, /type: Page/);
  assert.doesNotMatch(renderedNpm, /bundle Pages/);
  assert.doesNotMatch(renderedNpm, /pages-registry\//);
});

test("no CLI teaching source (usage/help strings included) says Page except as a legacy note", () => {
  // The render pins above can't see prose that never reaches a render — --help/usage strings and
  // command summaries live as literals in source (the fix-round's finding class). Scan the
  // teaching sources directly: any line with the standalone word `Page`/`Pages` must be a legacy
  // note (contain "legacy"). Identifiers (PageTypeName, PAGE_*, pageId, open-page, …) don't
  // survive a \bPages?\b word-boundary match, so no allowlist is needed.
  const teachingSources = [
    "src/reference.ts",
    "src/skill-render.ts",
    ...readdirSync(path.join(here, "../src/commands"))
      .filter((f) => f.endsWith(".ts"))
      .map((f) => `src/commands/${f}`),
  ];
  for (const relative of teachingSources) {
    const lines = readFileSync(path.join(here, "..", relative), "utf8").split("\n");
    lines.forEach((line, i) => {
      if (/\bPages?\b/.test(line) && !/legacy/i.test(line)) {
        assert.fail(`${relative}:${i + 1} teaches canonical Page (no "legacy" on the line): ${line.trim()}`);
      }
    });
  }
});

test("examples markdown teaches only View — the word Page appears solely in legacy notes", () => {
  const examplesRoot = path.join(REPO_ROOT, "examples");
  const mdFiles = relativeFileInventory(examplesRoot).filter((f) => f.endsWith(".md"));
  for (const relative of mdFiles) {
    const lines = readFileSync(path.join(examplesRoot, relative), "utf8").split("\n");
    lines.forEach((line, i) => {
      if (/\bPages?\b/.test(line) && !/legacy/i.test(line)) {
        assert.fail(`examples/${relative}:${i + 1} teaches canonical Page (no "legacy" on the line): ${line.trim()}`);
      }
    });
  }
});

test("repo-level teaching docs (published README/package.json, root CLAUDE.md/README/AGENTS/STATUS) say Page only as a legacy note", () => {
  // Fix-round-2 finding class: teaching surfaces OUTSIDE the cli package's src tree — the
  // published npm README + package description, and the repo-root orchestrator guidance every
  // agent session auto-reads. Same per-line rule as above. plugins/ is deliberately EXCLUDED:
  // its SKILL.md + references tree is regenerated by the merge bot (scripts/ci-version-bundle.mjs
  // snapshots and rewrites them), so it is generated output, not an authored teaching source.
  const repoLevelSources = [
    "packages/cli/README.md",
    "packages/cli/package.json",
    "CLAUDE.md",
    "README.md",
    "AGENTS.md",
    "STATUS.md",
  ];
  for (const relative of repoLevelSources) {
    const filePath = path.join(REPO_ROOT, relative);
    if (!existsSync(filePath)) continue; // optional repo docs may come and go
    const lines = readFileSync(filePath, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (/\bPages?\b/.test(line) && !/legacy/i.test(line)) {
        assert.fail(`${relative}:${i + 1} teaches canonical Page (no "legacy" on the line): ${line.trim()}`);
      }
    });
  }
});
