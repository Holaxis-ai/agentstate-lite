---
type: Context Note
title: 'PR #54 independent review (Fable, 2026-07-14): PASS, 2 minor findings'
actor: claude-fable
timestamp: '2026-07-14T17:16:56.566Z'
---
# Summary

Independent review of PR #54 at exact SHA 7804a87 — PASS with two minor non-blocking findings.

Reviewer: claude-fable (session 2026-07-14), isolated detached worktree, `npm ci` + root build.

Empirical verification: typecheck 0; core page tests 8/8; CLI recipe-source + recipes + skill-distribution 87/87; UI registry 4/4; built-CLI probe of both findings below.

Findings (both empirical, both non-blocking):

1. **Registry-id grammar allows mid-path `.md` segments** — `isPageRegistryId('pages-registry/x.md/y')` returns true while `isPageEntryKey('pages/x.md/y.html')` is rejected. Installing such a registry doc creates an on-disk directory `x.md` that blocks a future doc write to `pages-registry/x` (the exact collision `assertSafeBlobKey` documents). Pre-existing property of concept ids and of the old UI grammar, so not a regression — but `page.ts` is new and its sibling entry-key grammar rejects exactly this, so the asymmetry is conspicuous. Suggest rejecting case-insensitive `.md` segments in `hasSafePageSegments` for both prefixes.

2. **Full-inventory walk reads then rejects OS/VCS junk** — a `.DS_Store` in a portable recipe root hard-fails `recipe add` (clear error naming the file; verified). By design under definitions-only strictness, but a `.git/` dir inside the recipe root would be read file-by-file as UTF-8 before rejection. Suggest rejecting dot-prefixed entries at walk time (fail fast, no reads) since the grammar can never accept them anyway.

Survived attacks: symlink escapes (conventions, full walk, recipe.md itself), padded/normalized field spellings on all four exact-string contracts, case-folded duplicate targets, undeclared instance data, conflicting pre-existing blob/registry (preflight leaves bundle untouched), remote-parity idempotency.
