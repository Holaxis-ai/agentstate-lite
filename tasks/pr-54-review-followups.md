---
type: Task
title: >-
  PR #54 review follow-ups: .md segments in Page grammar; fail-fast dot entries
  in recipe walk
status: in_progress
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — both findings empirically reproduced] (1) node
  --input-type=module against the built packages/core/dist/page.js:
  isPageRegistryId('pages-registry/x.md/y') === true while
  isPageEntryKey('pages/x.md/y') === false — the divergence is unchanged.
  isRegistryIdUnder (core/src/page.ts:57) and isEntryKeyUnder now share the SAME
  hasSafePageSegments helper, but isRegistryIdUnder still calls
  assertSafeConceptId (paths.ts:52, no mid-path .md check) while isEntryKeyUnder
  calls assertSafeBlobKey (paths.ts:91-116, which DOES reject any segment ending
  in .md at any depth) — so the fix has not been applied to the concept-id side.
  (2) packages/cli/src/recipe-source-filesystem.ts's walkRecipeFiles (lines
  38-63) still has no dot-prefixed-entry check before recursing (line 50-51) or
  reading a file's bytes as UTF-8 (line 61) — a .git/ dir inside a recipe root
  is still read object-by-object before any grammar rejection. Original text
  preserved: Two non-blocking findings from the independent PR #54 review: Page
  grammar accepts mid-path .md segments (doc/dir collision); portable-recipe
  walk reads dot-prefixed entries (.git contents) before rejecting them. Close
  the two non-blocking findings from the independent PR #54 review (merged as
  288e989); details and empirical probes in the review note
  (context-notes/pr-54-independent-review.md).
actor: mike/claude
timestamp: '2026-07-19T14:10:07.926Z'
---
# Objective

Close the two non-blocking findings from the independent PR #54 review (merged as 288e989); details and empirical probes in [the review note](../context-notes/pr-54-independent-review.md).

1. **Reject mid-path `.md` segments in the Page grammar.** `isPageRegistryId('pages-registry/x.md/y')` currently returns true while `isPageEntryKey` rejects the same shape under `pages/`. Installing such a registry doc creates an on-disk directory `x.md` that blocks a future doc write to `pages-registry/x` — the collision `assertSafeBlobKey` documents. Fix: reject case-insensitive `.md` segments in `hasSafePageSegments` (core/src/page.ts) for BOTH prefixes; extend core + UI grammar tests.

2. **Fail fast on dot-prefixed entries in the portable-recipe walk.** `walkRecipeFiles` reads every file (a `.git/` dir inside a recipe root is read object-by-object as UTF-8) before the parser rejects it as undeclared. The grammar can never accept a dot-prefixed path, so reject dot-prefixed directory/file entries at walk time with a clear error — same strictness, no wasted reads. (`.DS_Store` rejection stays; the error already names the file.)

# Acceptance

- Grammar tests pin `pages-registry/x.md/y` and `pages/x.MD/y.html` rejected in core AND ui.
- A portable recipe containing a dot-prefixed directory fails without reading its contents.
