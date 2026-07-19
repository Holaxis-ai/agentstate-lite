---
type: Task
title: >-
  PR #54 review follow-ups: .md segments in Page grammar; fail-fast dot entries
  in recipe walk
status: done
priority: '3'
description: >-
  DONE — PR #123 merged 638e2c6 (2026-07-19), APPROVE-WITH-NITS, both #54
  findings closed. (1) Grammar: mid-path .md segments now rejected by the ONE
  parseRegistration predicate all three consumers share (launcher/mint/serve can
  never disagree). DELIBERATE BREAKING TIGHTENING recorded per review: a wild
  doc with a mid-path-.md REGISTRY id and clean entry was servable before and is
  launcher-invisible after — the shape is the documented on-disk collision
  hazard, the doc stays readable, re-registering under a clean id recovers it.
  (2) Recipe walk: dot entries fail fast, rejection names the dot entry itself.
  Review settled the git-clone question EMPIRICALLY: base ALREADY rejected
  git-cloned folders (definitions-only policy, after reading .git
  object-by-object) — zero new unusability, clearer + faster refusal. Record
  correction: PR parent was 15a6f79 (an ancestor of merge-time main), not
  be5846a as the batch brief assumed — no overlap in the gap, verified.
actor: mike/claude
timestamp: '2026-07-19T14:57:34.029Z'
---
# Objective

Close the two non-blocking findings from the independent PR #54 review (merged as 288e989); details and empirical probes in [the review note](../context-notes/pr-54-independent-review.md).

1. **Reject mid-path `.md` segments in the Page grammar.** `isPageRegistryId('pages-registry/x.md/y')` currently returns true while `isPageEntryKey` rejects the same shape under `pages/`. Installing such a registry doc creates an on-disk directory `x.md` that blocks a future doc write to `pages-registry/x` — the collision `assertSafeBlobKey` documents. Fix: reject case-insensitive `.md` segments in `hasSafePageSegments` (core/src/page.ts) for BOTH prefixes; extend core + UI grammar tests.

2. **Fail fast on dot-prefixed entries in the portable-recipe walk.** `walkRecipeFiles` reads every file (a `.git/` dir inside a recipe root is read object-by-object as UTF-8) before the parser rejects it as undeclared. The grammar can never accept a dot-prefixed path, so reject dot-prefixed directory/file entries at walk time with a clear error — same strictness, no wasted reads. (`.DS_Store` rejection stays; the error already names the file.)

# Acceptance

- Grammar tests pin `pages-registry/x.md/y` and `pages/x.MD/y.html` rejected in core AND ui.
- A portable recipe containing a dot-prefixed directory fails without reading its contents.
