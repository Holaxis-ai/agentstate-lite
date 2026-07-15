// One inventory owns auxiliary contracts, portable recipes, examples, and fixtures. A channel is
// only a projection target; it is never the source of truth. Today the skill projects these files
// under its references/ folder while npm deliberately projects none. Future npm packaging adds an
// npm target here instead of inventing a second copy manifest.

export const DISTRIBUTION_CHANNELS = ["skill", "npm"] as const;
export type DistributionChannel = (typeof DISTRIBUTION_CHANNELS)[number];

export const RESOURCE_ROLES = [
  "operating-reference",
  "portable-recipe",
  "worked-example",
  "interop-fixture",
] as const;
export type ResourceRole = (typeof RESOURCE_ROLES)[number];

export interface DistributionResource {
  /** Repo-root-relative authority. Generated plugin files are never authorities. */
  src: string;
  role: ResourceRole;
  /** Destination within each channel's optional auxiliary-resource root. */
  targets: Partial<Record<DistributionChannel, string>>;
}

export interface ProjectedResource {
  src: string;
  dest: string;
}

type SourceDestination = readonly [src: string, dest: string];

function skillOnly(role: ResourceRole, entries: readonly SourceDestination[]): DistributionResource[] {
  return entries.map(([src, dest]) => ({ src, role, targets: { skill: dest } }));
}

export const DISTRIBUTION_RESOURCES: DistributionResource[] = [
  ...skillOnly("operating-reference", [
    ["examples/pages/references/page-authoring-v0.md", "pages/references/page-authoring-v0.md"],
  ]),

  // Bundle Page worked examples. Page-bearing recipes carry their own required operating model.
  ...skillOnly("worked-example", [
    ["examples/pages/pulse.html", "pages/pulse.html"],
    ["examples/pages/roadmap.html", "pages/roadmap.html"],
    ["examples/pages/about.html", "pages/about.html"],
    ["examples/pages/conventions/page.md", "pages/conventions/page.md"],
    ["examples/pages/pages-registry/pulse.md", "pages/pages-registry/pulse.md"],
    ["examples/pages/pages-registry/roadmap.md", "pages/pages-registry/roadmap.md"],
    ["examples/pages/pages-registry/about.md", "pages/pages-registry/about.md"],
  ]),

  // Installable definitions: the Claims example and the complete Review Workflow package.
  ...skillOnly("portable-recipe", [
    ["examples/recipes/claims/recipe.md", "recipes/claims/recipe.md"],
    ["examples/recipes/claims/conventions/claim.md", "recipes/claims/conventions/claim.md"],
    ["examples/recipes/review-workflow/recipe.md", "recipes/review-workflow/recipe.md"],
    [
      "examples/recipes/review-workflow/conventions/review-request.md",
      "recipes/review-workflow/conventions/review-request.md",
    ],
    ["examples/recipes/review-workflow/conventions/page.md", "recipes/review-workflow/conventions/page.md"],
    [
      "examples/recipes/review-workflow/pages-registry/review-workflow-reviews.md",
      "recipes/review-workflow/pages-registry/review-workflow-reviews.md",
    ],
    [
      "examples/recipes/review-workflow/pages/review-workflow/reviews.html",
      "recipes/review-workflow/pages/review-workflow/reviews.html",
    ],
    [
      "examples/recipes/review-workflow/references/page-authoring-v0.md",
      "recipes/review-workflow/references/page-authoring-v0.md",
    ],
  ]),

  // Externally-shaped OKF interoperability fixture; never installed into an ordinary bundle.
  ...skillOnly("interop-fixture", [
    ["examples/sample-bundle/index.md", "sample-bundle/index.md"],
    ["examples/sample-bundle/log.md", "sample-bundle/log.md"],
    ["examples/sample-bundle/concepts/index.md", "sample-bundle/concepts/index.md"],
    ["examples/sample-bundle/concepts/link-graph.md", "sample-bundle/concepts/link-graph.md"],
    ["examples/sample-bundle/concepts/okf-alignment.md", "sample-bundle/concepts/okf-alignment.md"],
    ["examples/sample-bundle/context-notes/index.md", "sample-bundle/context-notes/index.md"],
    [
      "examples/sample-bundle/context-notes/cycle-okf-lite-vision.md",
      "sample-bundle/context-notes/cycle-okf-lite-vision.md",
    ],
    ["examples/sample-bundle/references/index.md", "sample-bundle/references/index.md"],
    ["examples/sample-bundle/references/okf-spec.md", "sample-bundle/references/okf-spec.md"],
  ]),
];

export function projectResources(channel: DistributionChannel): ProjectedResource[] {
  return DISTRIBUTION_RESOURCES.flatMap(({ src, targets }) => {
    const dest = targets[channel];
    return dest === undefined ? [] : [{ src, dest }];
  });
}

/** Current plugin projection. npm remains intentionally empty until its resource UX is chosen. */
export const SKILL_RESOURCES = projectResources("skill");

// NOT DISTRIBUTED: the wire-protocol v0.1 contract currently lives only as project-bundle doc
// `docs/wire-protocol`. Shipping it requires a tracked distribution-neutral source or a
// bundle-aware release input; neither belongs in this ownership-only unit.

/**
 * Every command NAME (as {@link commandName} in reference.ts would extract it from a usage
 * string) mapped to the SKILL_RESOURCES `dest`s its advertised capability depends on. `[]` means
 * self-contained — true of most commands. Checked for exhaustiveness against COMMAND_GROUPS by
 * test/skill-distribution.test.ts.
 */
export const SKILL_COMMAND_RESOURCES: Record<string, string[]> = {
  "bundle locate": [],
  catalog: [],
  init: [],
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
  ui: ["pages/references/page-authoring-v0.md"],
  sync: [],
  "session-start": [],
  "hook install|status|uninstall": [],
};

/** One prose-level tripwire over the rendered skill projection. */
export interface SkillCapabilityPattern {
  pattern: RegExp;
  requires: string[];
}

/**
 * Checked against the ACTUAL rendered skill-target SKILL.md by test/skill-distribution.test.ts,
 * which fails on a DEAD pattern (one that matches nothing in the rendered text) as well as on a
 * `requires` entry missing from SKILL_RESOURCES.
 *
 * Honest limit: this cannot recognize a semantically novel capability described in prose that no
 * pattern below anticipates — command-shaped coverage comes from SKILL_COMMAND_RESOURCES' exhaustiveness
 * check above; adding a pattern row here is the same one-table discipline extended to free prose.
 */
export const SKILL_CAPABILITY_PATTERNS: SkillCapabilityPattern[] = [
  {
    pattern: /type:\s*Page|bundle page|postMessage|sandboxed iframe/i,
    requires: ["pages/references/page-authoring-v0.md"],
  },
  {
    pattern: /recipe/i,
    requires: ["recipes/claims/recipe.md", "recipes/review-workflow/recipe.md"],
  },
];
