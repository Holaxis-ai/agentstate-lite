// The manifest of contract/example files this package SHIPS alongside its self-description, plus
// the two ratchets that keep the manifest honest — against COMMAND_GROUPS (reference.ts) and
// against the generated skill-target SKILL.md's own prose.
//
//   - SKILL_REFERENCES     — every {src, dest} byte-copy: `dest` is the path under the skill's
//                            `references/` folder; `src` is the repo-root-relative source of
//                            truth. gen-skill.mjs (`--target skill`) copies each one verbatim and
//                            deletes anything under `references/` NOT named here — one authority
//                            per file (the repo source), the shipped copy is a generated artifact.
//   - COMMAND_CONTRACTS    — every command NAME (as reference.ts's `commandName()` would extract
//                            it) mapped to the SKILL_REFERENCES dests its advertised capability
//                            depends on (`[]` when a command is fully self-contained — true of
//                            most). test/skill-distribution.test.ts checks this for EXHAUSTIVENESS
//                            against COMMAND_GROUPS — the ratchet that stops a newly added command
//                            from silently shipping no contract for a capability it advertises.
//   - CAPABILITY_PATTERNS  — a small number of prose-level tripwires: if the rendered skill-target
//                            SKILL.md talks about a capability in these terms, the file(s) backing
//                            it up must be in the manifest, AND the pattern must actually match
//                            something in the rendered text (a dead pattern is as much a bug as a
//                            missing file).
//
// Lives OUTSIDE reference.ts on purpose: reference.ts is a pure display registry paid for on EVERY
// --help/home invocation at runtime; this manifest is read only at skill-generation time
// (gen-skill.mjs) and by its own PR-side gate, so it must not tax the hot runtime path.
export interface SkillReference {
  /** Repo-root-relative path to the source of truth. */
  src: string;
  /** Path under the skill's `references/` folder this is shipped as. */
  dest: string;
}

export const SKILL_REFERENCES: SkillReference[] = [
  // Bundle pages — the postMessage-bridge contract + three worked examples (gate 4, tasks/ui-pages-spike).
  { src: "examples/pages/BRIDGE.md", dest: "pages/BRIDGE.md" },
  { src: "examples/pages/pulse.html", dest: "pages/pulse.html" },
  { src: "examples/pages/roadmap.html", dest: "pages/roadmap.html" },
  { src: "examples/pages/about.html", dest: "pages/about.html" },
  { src: "examples/pages/conventions/page.md", dest: "pages/conventions/page.md" },
  { src: "examples/pages/pages-registry/pulse.md", dest: "pages/pages-registry/pulse.md" },
  { src: "examples/pages/pages-registry/roadmap.md", dest: "pages/pages-registry/roadmap.md" },
  { src: "examples/pages/pages-registry/about.md", dest: "pages/pages-registry/about.md" },

  // Writing a custom recipe — a worked example (the Claim kind: event-lifecycle findings with
  // provenance), composed entirely from lite primitives.
  { src: "examples/recipes/claims/recipe.md", dest: "recipes/claims/recipe.md" },
  { src: "examples/recipes/claims/conventions/claim.md", dest: "recipes/claims/conventions/claim.md" },

  // A content-free cognitive ecosystem: one Kind plus its generic live Page, with no instances.
  // This is both a useful Review Workflow package and the reference for portable Page assets.
  { src: "examples/recipes/review-workflow/recipe.md", dest: "recipes/review-workflow/recipe.md" },
  {
    src: "examples/recipes/review-workflow/conventions/review-request.md",
    dest: "recipes/review-workflow/conventions/review-request.md",
  },
  {
    src: "examples/recipes/review-workflow/pages-registry/review-workflow-reviews.md",
    dest: "recipes/review-workflow/pages-registry/review-workflow-reviews.md",
  },
  {
    src: "examples/recipes/review-workflow/pages/review-workflow/reviews.html",
    dest: "recipes/review-workflow/pages/review-workflow/reviews.html",
  },

  // The interop fixture — an externally-shaped OKF bundle (unquoted timestamps, relative links,
  // wrapped bullets) — same one CLAUDE.md pins the round-trip contract against.
  { src: "examples/sample-bundle/index.md", dest: "sample-bundle/index.md" },
  { src: "examples/sample-bundle/log.md", dest: "sample-bundle/log.md" },
  { src: "examples/sample-bundle/concepts/index.md", dest: "sample-bundle/concepts/index.md" },
  { src: "examples/sample-bundle/concepts/link-graph.md", dest: "sample-bundle/concepts/link-graph.md" },
  { src: "examples/sample-bundle/concepts/okf-alignment.md", dest: "sample-bundle/concepts/okf-alignment.md" },
  { src: "examples/sample-bundle/context-notes/index.md", dest: "sample-bundle/context-notes/index.md" },
  {
    src: "examples/sample-bundle/context-notes/cycle-okf-lite-vision.md",
    dest: "sample-bundle/context-notes/cycle-okf-lite-vision.md",
  },
  { src: "examples/sample-bundle/references/index.md", dest: "sample-bundle/references/index.md" },
  { src: "examples/sample-bundle/references/okf-spec.md", dest: "sample-bundle/references/okf-spec.md" },

  // NOT SHIPPED THIS PASS: the wire-protocol v0.1 contract. Its former repo path
  // (`docs/WIRE-PROTOCOL.md`) was promoted into the project's OWN bundle and gitignored off `main`
  // (2026-07-09 board migration — see CLAUDE.md's "root /docs/ stays gitignored"); it now lives as
  // bundle doc `docs/wire-protocol` on the `board` branch, which a plain `main`-branch checkout
  // (including this repo's own CI bot) cannot read as a filesystem path — a manifest entry
  // pointing at it would throw ENOENT the moment the bot regenerates on merge. Shipping it needs
  // either a tracked repo copy (reversing the public-face scrub — an explicit call, not this
  // pass's to make) or a bundle-aware fetch in the generator. Follow-up, alongside the npm-tarball
  // gap noted in the distribution-completeness build spec.
];

/**
 * Every command NAME (as {@link commandName} in reference.ts would extract it from a usage
 * string) mapped to the SKILL_REFERENCES `dest`s its advertised capability depends on. `[]` means
 * self-contained — true of most commands. Checked for exhaustiveness against COMMAND_GROUPS by
 * test/skill-distribution.test.ts.
 */
export const COMMAND_CONTRACTS: Record<string, string[]> = {
  init: [],
  view: [],
  status: [],
  "doc write": [],
  "doc update": [],
  "doc read": [],
  "doc history": [],
  "doc delete": [],
  list: [],
  link: [],
  promote: [],
  pull: [],
  blobs: [],
  delete: [],
  new: [],
  kinds: [],
  "kind field": [],
  recipes: [],
  "recipe add": ["recipes/claims/recipe.md", "recipes/review-workflow/recipe.md"],
  serve: [],
  ui: ["pages/BRIDGE.md"],
  sync: [],
  "session-start": [],
  "hook install|status|uninstall": [],
};

/** One prose-level tripwire — see the module doc's CAPABILITY_PATTERNS bullet. */
export interface CapabilityPattern {
  pattern: RegExp;
  requires: string[];
}

/**
 * Checked against the ACTUAL rendered skill-target SKILL.md by test/skill-distribution.test.ts,
 * which fails on a DEAD pattern (one that matches nothing in the rendered text) as well as on a
 * `requires` entry missing from SKILL_REFERENCES.
 *
 * Honest limit: this cannot recognize a semantically novel capability described in prose that no
 * pattern below anticipates — command-shaped coverage comes from COMMAND_CONTRACTS' exhaustiveness
 * check above; adding a pattern row here is the same one-table discipline extended to free prose.
 */
export const CAPABILITY_PATTERNS: CapabilityPattern[] = [
  { pattern: /type:\s*Page|bundle page|postMessage|sandboxed iframe/i, requires: ["pages/BRIDGE.md"] },
  {
    pattern: /recipe/i,
    requires: ["recipes/claims/recipe.md", "recipes/review-workflow/recipe.md"],
  },
];
