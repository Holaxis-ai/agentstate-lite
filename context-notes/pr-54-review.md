---
type: Context Note
title: 'PR #54 independent review — e27e231'
actor: codex-main
timestamp: '2026-07-14T15:50:38.233Z'
---
# Summary

Independent review of GitHub PR #54 is complete for the stable exact unit base `69a0627b70fe0539815207d34ea56a20721ddb35`, head `e27e2314fb25461ce957dee21da513e153e60df8`. The PR remains draft and mergeable. The final verdict is changes requested for two contract defects.

Required skills loaded in this session: holaxis-self-awareness, holaxis-cognitive-ecosystem, and agentstate-lite. Repository guide CLAUDE.md was read in full. The project `.agentstate-lite` board is the sole cognitive ecosystem; Holaxis CE tasks/vault are not in use.

## Empirical findings

1. The recipe loader and Page runtime disagree on valid Page paths. `parsePageDeclarations` accepts generic concept/blob-safe segments such as spaces, while `packages/ui/src/pages/registry.ts` rejects spaces plus backslashes, percent signs, query/hash characters, empty segments, and other characters outside `[A-Za-z0-9._-]`. A definitions-only recipe using `pages-registry/bad name.md` and `pages/bad name.html` parsed successfully and `applyRecipe` installed it, but `parseRegisteredPage` returned `null` for the resulting registry doc. This produces an installed-but-invisible Page and duplicates the Page path authority instead of sharing it.

2. The committed `examples/recipes/review-workflow` package omits the Page Kind Convention required by the [portable recipe design](../designs/portable-recipe-packages.md). A clean-room install produced Kinds `["Review Request"]`; `loadKinds(...).kinds.has("Page")` was false. The test titled "carries Kinds and a Page" checks only Review Request. Add the Page convention to the recipe and generated skill-reference inventory, then assert the installed Page Kind.

## Validation

- Fresh detached worktree: `/private/tmp/agentstate-lite-pr54-review` at exact head `e27e231`; fresh `npm ci`; worktree clean after restoring the expected generated bundle side effect.
- `git diff --check` passed.
- Focused recipe suites passed `68/68` outside the sandbox. The first sandboxed run passed 66 and hit only two localhost-bind `EPERM` environment failures.
- Full `npm run check` passed, including typecheck, all workspace tests, script/skill checks, packed-core smoke, and browser gate `14/14`.
- Final GitHub head/base check was unchanged.

The [portable recipe task](../tasks/portable-recipe-packages-v1.md) should remain `in_progress` until the two findings are hardened and the exact replacement SHA receives independent review. No GitHub review or board sync was submitted in this evaluation.

Prior graph links retained for continuity: [sync implementation plan](../plans/sync-verb-implementation.md) and [sync review research](../research/sync-verb-review.md).
