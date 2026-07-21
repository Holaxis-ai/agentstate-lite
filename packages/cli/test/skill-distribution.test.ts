/**
 * Distribution-completeness gate: every capability the skill-target SKILL.md advertises must ship
 * a backing contract/example under `references/` — the skill is one projection of the
 * distribution-neutral inventory in src/distribution-resources.ts.
 *
 * Runs in `npm test -w @holaxis/aslite`, hence `npm run check` — PR-side is the right layer here
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
  NPM_RESOURCES,
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
const NPM_DESTS = new Set(NPM_RESOURCES.map((r) => r.dest));

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

test("the npm projection mirrors the skill projection dest-for-dest, and the tarball ships it", () => {
  // One dest namespace serves the command/capability tables for both channels — a resource added
  // to one channel but not the other is a deliberate decision, not an accident, so make it loud.
  assert.deepEqual(
    [...NPM_DESTS].sort(),
    [...SKILL_DESTS].sort(),
    "npm and skill projections must ship the same reference dest set",
  );
  const packageJson = JSON.parse(readFileSync(path.join(REPO_ROOT, "packages/cli/package.json"), "utf8"));
  assert.deepEqual(packageJson.files, ["dist", "SKILL.md", "references"]);
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

const CHANNEL_DESTS: Record<string, Set<string>> = { skill: SKILL_DESTS, npm: NPM_DESTS };

test("every SKILL_COMMAND_RESOURCES dest names a real projection in BOTH channels", () => {
  for (const [channel, dests] of Object.entries(CHANNEL_DESTS)) {
    for (const [name, required] of Object.entries(SKILL_COMMAND_RESOURCES)) {
      for (const dest of required) {
        assert.ok(dests.has(dest), `command \`${name}\` requires \`${dest}\`, which is not ${channel}-projected.`);
      }
    }
  }
});

test("every SKILL_CAPABILITY_PATTERNS requirement names a real projection in BOTH channels", () => {
  for (const [channel, dests] of Object.entries(CHANNEL_DESTS)) {
    for (const { pattern, requires } of SKILL_CAPABILITY_PATTERNS) {
      for (const dest of requires) {
        assert.ok(dests.has(dest), `capability pattern ${pattern} requires \`${dest}\`, which is not ${channel}-projected.`);
      }
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

test("no SKILL_CAPABILITY_PATTERNS entry is dead — each fires and is backed in BOTH rendered channels", () => {
  const renderedByChannel: Record<string, string> = { skill: rendered, npm: renderedNpm };
  for (const [channel, text] of Object.entries(renderedByChannel)) {
    for (const { pattern, requires } of SKILL_CAPABILITY_PATTERNS) {
      assert.ok(
        pattern.test(text),
        `capability pattern ${pattern} matches nothing in the rendered ${channel}-target SKILL.md — dead tripwire, fix or remove it.`,
      );
      for (const dest of requires) {
        assert.ok(
          CHANNEL_DESTS[channel]!.has(dest),
          `capability pattern ${pattern} requires \`${dest}\`, missing from ${channel} projection.`,
        );
      }
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
// The npm channel under the SAME (4)+(5) discipline: its rendered SKILL.md addresses the shipped
// tree by plain `references/…` paths relative to the installed file (no $REFS resolver — the npm
// channel has none by design), so the orphan/phantom sweep runs over that pointer form.
// ---------------------------------------------------------------------------------------------

test("npm: bare-aslite channel identity — no npx examples, no retired coordinate, no marketplace-cache resolver", () => {
  // Skill IDENTITY stays the bare `aslite` bin; only install/npx text carries the scoped coordinate.
  assert.match(renderedNpm, /^---\nname: aslite\n/);
  // Examples run the bare bin; `npx -y @holaxis/aslite` survives only as the explicit no-install fallback.
  assert.match(renderedNpm, /## If `aslite` is not on PATH/);
  assert.match(renderedNpm, /npm install -g @holaxis\/aslite/);
  assert.match(renderedNpm, /npx -y @holaxis\/aslite/);
  assert.ok(!renderedNpm.includes("npx -y agentstate-lite"), "retired npm coordinate must not appear");
  assert.ok(!renderedNpm.includes("npx -y aslite"), "retired unscoped npx coordinate must not appear");
  assert.ok(!renderedNpm.includes("npm install -g aslite"), "retired unscoped install coordinate must not appear");
  assert.ok(!renderedNpm.includes("plugins/cache"), "npm channel must not teach marketplace-cache discovery");
  assert.ok(!renderedNpm.includes('ASLITE="$('), "npm channel must not carry the skill-channel resolver");
});

test("npm: reference pointers ride $REFS set from the host-reported base dir — never bare cwd-relative paths", () => {
  // The PR #136 review's reproduction: a bare `cat references/…` fails from the project root
  // after a host install (shell paths resolve against the cwd, not SKILL.md's folder).
  assert.ok(
    renderedNpm.includes('REFS="<skill-base-dir>/references"'),
    "the npm channel must instruct setting $REFS from the skill base directory the host reports",
  );
  assert.match(renderedNpm, /base directory/i);
  assert.ok(!renderedNpm.includes('REFS="$('), "no discovery loop in the npm channel — the base dir is handed to the agent");
  for (const banned of ["cat references/", "promote references/", "references/views", "references/recipes", "references/sample-bundle"]) {
    assert.ok(!renderedNpm.includes(banned), `bare cwd-relative reference path in the npm render: ${banned}`);
  }
});

test("npm: no orphans — every npm-shipped file (or an enclosing directory) is mentioned as $REFS/… in the rendered npm SKILL.md", () => {
  for (const { src, dest } of NPM_RESOURCES) {
    const mentioned = destMentionCandidates(dest).some((candidate) => renderedNpm.includes(`$REFS/${candidate}`));
    assert.ok(
      mentioned,
      `\`${dest}\` (from ${src}) is npm-shipped but never mentioned in the rendered npm-target SKILL.md — an orphaned reference nobody points at.`,
    );
  }
});

test("npm: no phantom pointers — every $REFS/… path in the rendered npm SKILL.md resolves to a shipped dest or dir-prefix", () => {
  const resolves = (refPath: string): boolean => {
    const normalized = refPath.endsWith("/") ? refPath.slice(0, -1) : refPath;
    for (const dest of NPM_DESTS) {
      if (dest === normalized || dest.startsWith(`${normalized}/`)) return true;
    }
    return false;
  };
  const phantoms = [...new Set(extractRefsPaths(renderedNpm).filter((p) => !resolves(p)))];
  assert.deepEqual(phantoms, [], `phantom $REFS/ path(s) — point nowhere in the npm projection: ${phantoms.join(", ")}`);
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

test("the npm-target SKILL teaches Views canonically — legacy Page appears exactly once, as the legacy note", () => {
  assert.match(renderedNpm, /live\s+bundle Views/);
  assert.match(renderedNpm, /## Bundle views — ship a live UI as bundle content/);
  // The npm channel now carries the same authoring section as the skill channel, so it inherits
  // the same rule: one accepted-legacy sentence, no legacy authoring guidance.
  const legacyMentions = renderedNpm.match(/type: Page/g) ?? [];
  assert.equal(legacyMentions.length, 1, "exactly one `type: Page` mention (the legacy note) may remain");
  assert.match(renderedNpm, /`Page` is the accepted legacy name/);
  assert.doesNotMatch(renderedNpm, /bundle Pages/);
  assert.doesNotMatch(renderedNpm, /--doc-key pages\//);
  assert.doesNotMatch(renderedNpm, /--doc-key pages-registry\//);
  assert.doesNotMatch(renderedNpm, /conventions\/page\.md/);
  assert.doesNotMatch(renderedNpm, /page-authoring-v0/);
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
