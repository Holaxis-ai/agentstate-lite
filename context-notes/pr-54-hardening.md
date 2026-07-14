---
type: Context Note
title: 'PR #54 hardening state'
actor: codex-main
timestamp: '2026-07-14T16:48:53.772Z'
---
# Summary

PR #54 hardening is active on branch `codex/portable-recipe-packages`, based on stable head `e27e231`. The implementation now uses one dependency-free `@agentstate-lite/core/page` contract in both recipe parsing and the UI. Registry ids must be runtime-discoverable concept ids under `pages-registry/`; entry keys must be storage-safe blobs under `pages/`. Both reject hidden/dot segments and non-portable spellings, entry validation composes the core blob guard (including `.md` segments at any depth), and recipe declarations reject case-folded duplicate targets while preserving the exact accepted spelling.

The review-workflow recipe now carries the canonical Page Kind Convention byte-for-byte. Its skill distribution is protected by an exact recursive `(src, dest)` inventory test, and clean-room installation asserts one Page definition, both expected Kinds, and zero Review Request instances. The CLI bundler has an explicit source alias for the new core subpath; this was required because its package-root alias otherwise incorrectly resolved the subpath as `index.ts/page`.

The first exact-SHA review correctly failed commit `c4245d9` on raw-vs-normalized disagreements: padded Page registry `entry` frontmatter survived recipe parsing but failed UI parsing, and padded `content_policy` was normalized by the parser while the filesystem reader selected legacy partial inventory. The second review failed `635520d` because manifest `pages[].registry` and `pages[].entry` were still trimmed before validation. All four fields are now exact-string contracts with reproducing regression tests. The corrected unit is commit `7804a87`.

Focused validation is green after the corrections: root build; four core Page-contract tests; four UI registry tests; 34 recipe-source tests; 13 skill-distribution tests; and the clean-room Review Workflow test. A third fresh reviewer is now attacking the whole unit at exact SHA `7804a87` in a new detached worktree. Full QA remains gated on that verdict; the remaining unverified assumptions are the fresh exact-SHA review and full repository gate.

The accepted [hardening plan](../plans/pr-54-hardening.md) passed independent Architect/PO review with high confidence and no blockers. Authority remains the [portable recipe design](../designs/portable-recipe-packages.md), [portable recipe task](../tasks/portable-recipe-packages-v1.md), and [initial PR review](./pr-54-review.md).

AgentState MCP tools are unavailable in this harness, so the existing local `.agentstate-lite` board remains the sole persistent record. It is dirty and behind `origin/board`; do not sync it until unrelated pending edits can be reconciled safely.
