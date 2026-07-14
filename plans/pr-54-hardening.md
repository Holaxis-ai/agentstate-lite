---
type: Plan
title: 'PR #54 hardening: shared Page contract and complete reference recipe'
actor: codex-main
timestamp: '2026-07-14T16:26:00.233Z'
---
# PR #54 hardening plan

## Objective

Close the two independent-review blockers on PR #54 without widening its product claim: every Page path accepted by a definitions-only recipe must be usable by the Page runtime, and the shipped review-workflow package must transfer the complete self-describing domain model promised by the accepted design.

## Domain model / taxonomy

- **Recipe manifest Page declaration** — a pair of authored relative file paths: `registry` names a Markdown file and `entry` names an HTML file.
- **Page registry path** — the manifest's `pages-registry/...md` file path.
- **Page registry ID** — the installed concept ID derived from the registry path by removing `.md`; runtime discovery consumes this form.
- **Page entry key** — the installed `pages/...html` blob key referenced by the registry document and loaded by the browser shell.
- **Page path grammar** — the single shared predicate for usable registry IDs and entry keys: required prefix, non-empty nested segments, segments restricted to `[A-Za-z0-9._-]+`, with no dot-prefixed segment, and rejection of backslash, percent, query/hash characters, colon/non-ASCII/whitespace forms, dot traversal, and empty segments. It composes core's existing concept/blob guards so Page entries also inherit blob-namespace rules such as rejecting any `.md`-ending segment. Recipe-specific extension requirements remain at the recipe boundary.
- **Page registry document** — a `type: Page` instance carrying `title`, `entry`, and `bridge`; it is not the schema authority.
- **Page Kind Convention** — `conventions/page.md`, the schema/authoring authority for Page registry documents. A portable self-describing package must carry it alongside domain-specific conventions.
- **Reference recipe** — `examples/recipes/review-workflow`; the executable proof that Kinds plus one declared live Page transfer with zero Review Request or other user/project-state instances.
- **Skill reference inventory** — `SKILL_REFERENCES`, which must list every file needed to reproduce the shipped recipe outside the repository.

## Invariants

1. There is one browser-safe, pure Page path grammar authority in `packages/core/src/page.ts`, exported through the `@agentstate-lite/core/page` subpath and consumed by both CLI validation and browser runtime parsing; it may compose only core's dependency-free path guards.
2. `parseRecipeFiles` cannot materialize a Page the runtime would reject.
3. Recipe declarations still require registry `.md` and entry `.html` extensions in addition to the shared ID/key grammar.
4. The review-workflow recipe installs both `Review Request` and `Page` Kinds, exactly one declared Page registry definition, and zero user/project-state `Review Request` instances.
5. `examples/pages/conventions/page.md` remains the canonical Page convention source; the portable recipe carries a required byte-identical copy pinned by an executable parity test.
6. Generated plugin bundle/version files remain bot-owned and are not committed in this PR.

## Acceptance criteria

- Regression test: a definitions-only recipe with spaced or otherwise runtime-invalid Page paths is rejected before apply.
- Shared-validator unit tests prove valid nested IDs/keys and reject prefix-only, wrong-prefix, absolute, empty-segment, `.`/`..`, dot-prefixed, backslash, percent-encoded, query/hash, colon, whitespace, non-ASCII, and blob `.md`-segment forms.
- A valid declaration `pages-registry/reviews/architecture.v2.md` materializes registry ID `pages-registry/reviews/architecture.v2`; `pages/reviews/architecture.v2.html` remains the exact blob key.
- `parseRecipeFiles` rejects `pages-registry/x.md.md` after removing exactly one recipe-boundary `.md`, and rejects case-folded duplicate registry/entry targets so behavior does not depend on filesystem case sensitivity.
- UI Page parsing and bridge authorization continue consuming the same exported validator API.
- Clean-room recipe install asserts both `Review Request` and `Page` Kind contracts; Page declares path `pages-registry/`, required fields `title`, `entry`, `bridge`, and bridge values `none`, `bundle-read`. The installed bundle contains exactly one expected `type: Page` registry definition and zero `type: Review Request` instances.
- The recipe folder and `SKILL_REFERENCES` include `conventions/page.md`; a recursive inventory test proves the exact `SKILL_REFERENCES` `(src, dest)` pairs under `recipes/review-workflow/` map the recipe folder's complete relative-file inventory without omissions or misroutes, and a byte-equality test pins the recipe's Page convention to the canonical example convention.
- Focused tests pass, then an independent reviewer evaluates the exact commit SHA, then the full `npm run check` repository gate and built-CLI clean-room smoke pass.
- Final branch contains one coherent hardening commit on top of `e27e231`; no generated plugin bundle or manifest version changes.

## Dependency-ordered work

1. **Plan/domain review (Architect/PO, read-only)** — verify terms, ownership, acceptance, and that the fix remains within the accepted design.
2. **Builder (primary agent)** — add failing regression tests; implement the shared core path validator; switch CLI/UI consumers; add the Page convention and skill inventory entry; update existing expectations.
3. **Builder validation (primary agent)** — run root build plus focused core/UI/CLI suites and clean-room empirical probes; restore bot-owned generated artifacts.
4. **Commit (primary agent)** — create one descriptive commit on a local branch rooted at PR head.
5. **Independent review (Reviewer agent, read-only, exact detached SHA)** — review code, tests, package/reference completeness, and empirically attack both fixed chains. This is a hard dependency before QA or push.
6. **Review loop (primary agent + Reviewer)** — any review-driven code change returns to Builder validation, creates a replacement exact commit SHA, and receives a fresh independent review. No QA begins without exact-SHA approval.
7. **QA (primary agent)** — after approval run full `npm run check`, built-CLI clean-room install, diff/status checks, and final head comparison.
8. **Delivery (primary agent)** — push the reviewed commit to `codex/portable-recipe-packages`, verify PR head/check state, update AgentState records, and leave merge to the human/PR workflow.

## Authority

[accepted portable recipe design](../designs/portable-recipe-packages.md)

[portable recipe task](../tasks/portable-recipe-packages-v1.md)

[independent review findings](../context-notes/pr-54-review.md)
