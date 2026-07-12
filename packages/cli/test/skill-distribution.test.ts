/**
 * Distribution-completeness gate: every capability the skill-target SKILL.md advertises must ship
 * a backing contract/example under `references/` — see src/skill-references.ts's module doc for
 * the manifest shape (SKILL_REFERENCES / COMMAND_CONTRACTS / CAPABILITY_PATTERNS).
 *
 * Runs in `npm test -w agentstate-lite`, hence `npm run check` — PR-side is the right layer here
 * because a gap is a SOURCE defect (a new command that never declares its shipped-contract
 * surface, or new prose that points at a file nobody added to the manifest): the bot that
 * regenerates plugins/ on merge to main would otherwise ship the gap FIRST, and only a human
 * diff-reading the generated output after the fact would ever catch it.
 *
 * Five checks, in order: (1) exhaustiveness — COMMAND_CONTRACTS covers every COMMAND_GROUPS
 * command name, no more, no less; (2)+(3) validity — every dest a contract/pattern names, and
 * every src it copies from, actually exists; (4) the capability sweep — render the skill-target
 * SKILL.md in memory and confirm every CAPABILITY_PATTERNS tripwire both fires AND is satisfied;
 * (5) no orphans/no phantom pointers — the manifest and the rendered prose agree on what's shipped
 * in both directions.
 *
 * Honest limit (see src/skill-references.ts's CAPABILITY_PATTERNS doc comment): this cannot
 * recognize a semantically NOVEL capability described in prose that no pattern below anticipates —
 * check (1) covers the command-shaped majority; adding a pattern row is the same one-table
 * discipline extended to free prose.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { COMMAND_GROUPS, commandName } from "../src/reference.js";
import { SKILL_REFERENCES, COMMAND_CONTRACTS, CAPABILITY_PATTERNS } from "../src/skill-references.js";
import { renderSkill } from "../src/skill-render.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../..");

const ALL_COMMAND_NAMES = [
  ...new Set(COMMAND_GROUPS.flatMap(({ commands }) => commands.map((c) => commandName(c.usage)))),
];
const MANIFEST_DESTS = new Set(SKILL_REFERENCES.map((r) => r.dest));

// ---------------------------------------------------------------------------------------------
// (1) Exhaustiveness — the ratchet. Both directions: a new command with no key, and a stale key
// left behind by a removed/renamed command, are both a drift a human should reconcile by hand.
// ---------------------------------------------------------------------------------------------

test("COMMAND_CONTRACTS has a key for every COMMAND_GROUPS command name", () => {
  for (const name of ALL_COMMAND_NAMES) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(COMMAND_CONTRACTS, name),
      `new command \`${name}\` must declare its shipped-contract surface in src/skill-references.ts ([] if self-contained).`,
    );
  }
});

test("COMMAND_CONTRACTS has no stale key for a command that no longer exists", () => {
  const names = new Set(ALL_COMMAND_NAMES);
  for (const key of Object.keys(COMMAND_CONTRACTS)) {
    assert.ok(names.has(key), `COMMAND_CONTRACTS has a stale key \`${key}\` — no COMMAND_GROUPS command produces this name.`);
  }
});

// ---------------------------------------------------------------------------------------------
// (2)+(3) Validity — every dest a contract/pattern names must be a REAL manifest entry, and every
// manifest entry's src must be a real file (from the repo root).
// ---------------------------------------------------------------------------------------------

test("every COMMAND_CONTRACTS dest names a real SKILL_REFERENCES entry", () => {
  for (const [name, dests] of Object.entries(COMMAND_CONTRACTS)) {
    for (const dest of dests) {
      assert.ok(MANIFEST_DESTS.has(dest), `command \`${name}\` requires \`${dest}\`, which is not in SKILL_REFERENCES.`);
    }
  }
});

test("every CAPABILITY_PATTERNS.requires dest names a real SKILL_REFERENCES entry", () => {
  for (const { pattern, requires } of CAPABILITY_PATTERNS) {
    for (const dest of requires) {
      assert.ok(MANIFEST_DESTS.has(dest), `capability pattern ${pattern} requires \`${dest}\`, which is not in SKILL_REFERENCES.`);
    }
  }
});

test("every SKILL_REFERENCES.src exists on disk (from the repo root)", () => {
  for (const { src, dest } of SKILL_REFERENCES) {
    assert.ok(
      existsSync(path.join(REPO_ROOT, src)),
      `manifest entry dest=\`${dest}\` names a source that does not exist: ${src}`,
    );
  }
});

test("the shipped Page examples include capability-independent navigation from a content Page", () => {
  for (const dest of ["pages/about.html", "pages/pages-registry/about.md", "pages/BRIDGE.md"]) {
    assert.ok(MANIFEST_DESTS.has(dest), `Page navigation reference missing from SKILL_REFERENCES: ${dest}`);
  }
});

// ---------------------------------------------------------------------------------------------
// (4)+(5) Render the skill-target SKILL.md in memory and check it against the manifest in BOTH
// directions: every capability pattern fires and is backed (dead pattern = fail), every shipped
// file is mentioned (orphan = fail), and every `$REFS/…` path mentioned resolves to something
// actually shipped (phantom pointer = fail).
// ---------------------------------------------------------------------------------------------

const rendered = renderSkill();

test("actor guidance distinguishes advisory labels from backend-owned attribution", () => {
  assert.match(
    rendered,
    /no advisory actor label is stored in frontmatter or sent as an agent label/,
  );
  assert.match(rendered, /backend history still reports its own principal/);
  assert.match(rendered, /local OS owner or an\s+authenticated remote user/);
});

test("no CAPABILITY_PATTERNS entry is dead — each must match somewhere in the rendered SKILL.md", () => {
  for (const { pattern, requires } of CAPABILITY_PATTERNS) {
    assert.ok(
      pattern.test(rendered),
      `capability pattern ${pattern} matches nothing in the rendered skill-target SKILL.md — dead tripwire, fix or remove it.`,
    );
    for (const dest of requires) {
      assert.ok(MANIFEST_DESTS.has(dest), `capability pattern ${pattern} requires \`${dest}\`, missing from SKILL_REFERENCES.`);
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
  for (const { src, dest } of SKILL_REFERENCES) {
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
  for (const dest of MANIFEST_DESTS) {
    if (dest === normalized || dest.startsWith(`${normalized}/`)) return true;
  }
  return false;
}

test("no phantom pointers — every $REFS/… path in the rendered SKILL.md resolves to a shipped dest or dir-prefix", () => {
  const phantoms = [...new Set(extractRefsPaths(rendered).filter((p) => !resolvesToManifest(p)))];
  assert.deepEqual(phantoms, [], `phantom $REFS/ path(s) — point nowhere in SKILL_REFERENCES: ${phantoms.join(", ")}`);
});
