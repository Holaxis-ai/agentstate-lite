---
type: Context Note
title: >-
  Challenge: core's import-direction allowlist must be derived from the
  manifest, not enumerated
description: >-
  Amends the core import-direction gate finding (its two-name allowed set was
  commit-local) and retracts two PR #224 claims
actor: devin
timestamp: '2026-08-08T14:02:07.936Z'
---
# Summary

This note challenges one load-bearing detail in
[the core import-direction gate finding](../findings/core-import-direction-gate-investigation.md)
and [the synthesis](../findings/architectural-smell-investigation-synthesis.md) that consumes it,
and separately retracts two claims from the PR #224 architectural-smell report that do not survive
current-main verification. It is written by the author of PR #224 after reading the review of that
report through the bundle.

The challenge is narrow and does not disturb the synthesis's verdict. Both promoted units
(registered-View launch authority, core import-direction gate) and both non-promotions (core/server
test dependency, CLI type-only cycles) are accepted as correct, as is the promotion rule that
metric magnitude alone does not create work.

# Challenge: core's allowed external set is commit-local and must be derived, not enumerated

The gate finding's Fact 1 and Fact 6 state that production core's allowed non-builtin imports are
`gray-matter` and `js-yaml`, "exactly matching its two runtime dependencies", and the acceptance
evidence asks for "green cases for ... both declared externals". That is true at the finding's
evidence commit `5806ece` and true on current `origin/main`. It was **not** true one day earlier.

- At `31921ce` (PR #224's survey target), `packages/core/package.json` declared exactly one runtime
  dependency, `gray-matter`, and `packages/core/src` contained zero `js-yaml` import statements —
  only comment mentions in `bundle.ts` and `frontmatter.ts`.
- `6838c45` (`fix(core): preserve YAML date-only scalar shape`, 2026-08-07) added the
  `js-yaml` dependency and `packages/core/src/frontmatter.ts:11`'s `import yaml from "js-yaml"` to
  reach the safe schema's timestamp type directly.
- `6838c45` is an ancestor of `5806ece` but not of `31921ce`.

Verification:

```bash
for c in 31921ce 5806ece; do git show $c:packages/core/package.json | grep -c js-yaml; done   # 0, then 2
git grep -n 'from "js-yaml"' 31921ce -- packages/core/src   # no results
git grep -n 'from "js-yaml"' origin/main -- packages/core/src   # frontmatter.ts:11
```

The consequence is a design constraint on the promoted task, not a defect in its promotion. Core's
allowed external set changed inside a 24-hour window, driven by an ordinary correctness fix, and the
new dependency was added by the same commit that started importing it. A gate whose allowlist is a
literal two-name list would therefore have gone stale within a day of being written, and — worse —
would keep passing an import of a package that the manifest no longer declares, which is precisely
the failure the packed-core external proof also does not catch.

The gate must therefore read `packages/core/package.json` `dependencies` at test time and treat that
set as the allowlist, so that adding an import without declaring it fails and declaring a dependency
without importing it is at most a lint. The finding's minimal-scope item 3 ("pin the runtime manifest
to the intentional dependency set") is compatible with this, but its Fact 1/Fact 6 wording and its
acceptance evidence read as an enumeration and should be restated as a derivation. Recommended
acceptance additions: an import of an undeclared-but-installed package (`js-yaml` at `31921ce`, any
hoisted transitive today) must fail red, and the gate must not hardcode any package name.

This is offered as an amendment to an accepted task, not as a reason to reopen its promotion.

# Retraction 1: the recipe-cycle remedy in PR #224 is stale

PR #224 recommended relocating `LoadedRecipe` into a leaf module to break the recipe SCC.
[The CLI type-only cycles finding](../findings/cli-type-only-cycles-investigation.md) is right that
this is stale: `RecipeFile`, `LoadedRecipe`, and `RecipeSource` already live in the leaf
`packages/cli/src/recipe-parser.ts` (lines 27, 49, 82), and `recipe-source.ts` only re-exports them.
The residual source edge is one internal import in `packages/cli/src/recipes.ts:46` still going
through the facade. The finding's verdict — observe, do not schedule — is accepted, and the report's
proposed remedy should not be executed as written.

# Retraction 2: PR #224's "undocumented mutation-policy violation" framing was wrong

PR #224 characterized `packages/server/src/router.ts`'s `PUT /docs/{id}` as an undocumented bypass of
`mutateDocument`. That framing is withdrawn.
[The mutation-boundary audit](../designs/mutation-boundary-audit.md) already classifies this posture
and explicitly rejects a ceremonial funnel, and the code documents its own scope honestly: the
module header enumerates exactly what routing through `writeDocVersioned` does and does not enforce
(§9.2 non-empty `type`, id safety, reserved-file rejection), and `writeDocVersioned`
(`packages/core/src/bundle.ts:129-155`) performs no kind validation and claims none. Shipped remote
clients still apply document policy client-side before the wire call, so no shipped surface diverges.
The reconciliation addendum's disposition is accepted.

# Methodological concession

The reconciliation addendum is correct that PR #224's `ts-morph` measurements were not reproducible:
the script was written outside the repository and never published, so the clone and complexity counts
cited in `CLI-PR224-OBS-02` and `OBS-03` rest on author attestation. Those numbers should keep the
PR-supplied attribution they were given, and should not be upgraded without either publishing the
script or re-deriving the counts from tooling that is checked in. The two disclosed metric
distortions — nested callbacks counted inside their containing function, and optional chaining
counted as a branch — are real and inflate the largest scores most.
