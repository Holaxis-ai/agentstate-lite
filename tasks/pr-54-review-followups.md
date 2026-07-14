---
type: Task
title: >-
  PR #54 review follow-ups: .md segments in Page grammar; fail-fast dot entries
  in recipe walk
status: todo
priority: '3'
description: >-
  Two non-blocking findings from the independent PR #54 review: Page grammar
  accepts mid-path .md segments (doc/dir collision); portable-recipe walk reads
  dot-prefixed entries (.git contents) before rejecting them.
actor: claude-fable
timestamp: '2026-07-14T17:23:56.606Z'
---
# Objective

Close the two non-blocking findings from the independent PR #54 review (merged as 288e989); details and empirical probes in [the review note](../context-notes/pr-54-independent-review.md).

1. **Reject mid-path `.md` segments in the Page grammar.** `isPageRegistryId('pages-registry/x.md/y')` currently returns true while `isPageEntryKey` rejects the same shape under `pages/`. Installing such a registry doc creates an on-disk directory `x.md` that blocks a future doc write to `pages-registry/x` — the collision `assertSafeBlobKey` documents. Fix: reject case-insensitive `.md` segments in `hasSafePageSegments` (core/src/page.ts) for BOTH prefixes; extend core + UI grammar tests.

2. **Fail fast on dot-prefixed entries in the portable-recipe walk.** `walkRecipeFiles` reads every file (a `.git/` dir inside a recipe root is read object-by-object as UTF-8) before the parser rejects it as undeclared. The grammar can never accept a dot-prefixed path, so reject dot-prefixed directory/file entries at walk time with a clear error — same strictness, no wasted reads. (`.DS_Store` rejection stays; the error already names the file.)

# Acceptance

- Grammar tests pin `pages-registry/x.md/y` and `pages/x.MD/y.html` rejected in core AND ui.
- A portable recipe containing a dot-prefixed directory fails without reading its contents.
