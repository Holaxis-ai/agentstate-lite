---
type: Context Note
title: 'PR #54 hardening state'
actor: codex-main
timestamp: '2026-07-14T17:59:23.104Z'
---
# Summary

PR #54 hardening is active on branch `codex/portable-recipe-packages`, based on stable head `e27e231`. The implementation now uses one dependency-free `@agentstate-lite/core/page` contract in both recipe parsing and the UI. Registry ids must be runtime-discoverable concept ids under `pages-registry/`; entry keys must be storage-safe blobs under `pages/`. Both reject hidden/dot segments and non-portable spellings, entry validation composes the core blob guard (including `.md` segments at any depth), and recipe declarations reject case-folded duplicate targets while preserving the exact accepted spelling.

The review-workflow recipe now carries the canonical Page Kind Convention byte-for-byte. Its skill distribution is protected by an exact recursive `(src, dest)` inventory test, and clean-room installation asserts one Page definition, both expected Kinds, and zero Review Request instances. The CLI bundler has an explicit source alias for the new core subpath; this was required because its package-root alias otherwise incorrectly resolved the subpath as `index.ts/page`.

The first exact-SHA review correctly failed commit `c4245d9` on raw-vs-normalized disagreements: padded Page registry `entry` frontmatter survived recipe parsing but failed UI parsing, and padded `content_policy` was normalized by the parser while the filesystem reader selected legacy partial inventory. The second review failed `635520d` because manifest `pages[].registry` and `pages[].entry` were still trimmed before validation. All four fields are now exact-string contracts with reproducing regression tests. The corrected unit is commit `7804a87`.

Focused validation is green after the corrections: root build; four core Page-contract tests; four UI registry tests; 34 recipe-source tests; 13 skill-distribution tests; and the clean-room Review Workflow test. A third fresh reviewer reviewed the whole unit at exact SHA `7804a87` and returned PASS with high confidence (`0.96`) and no findings.

QA is complete. Root `npm run check` exited 0, covering build, typecheck, all workspace tests, script/package proofs, skill drift, and the Playwright gate. Two pre-existing browser security checks timed out on their first attempt and passed on retry; a targeted rerun again showed the connect-src check flaky-once/pass-on-retry while the navigation check passed first attempt. The final built-CLI clean-room smoke installed exactly the `Page` and `Review Request` Kinds, one Page definition, and zero Review Request instances. The builder worktree is clean at `7804a87`.

Commit `7804a87d55e374c2ae913622cb36417c5e93bfe9` was pushed to `origin/codex/portable-recipe-packages` and GitHub PR #54 now reports that exact head, OPEN, draft, and MERGEABLE. No merge was performed. The remote PR currently reports no hosted status checks.

The accepted [hardening plan](../plans/pr-54-hardening.md) passed independent Architect/PO review with high confidence and no blockers. Authority remains the [portable recipe design](../designs/portable-recipe-packages.md), [portable recipe task](../tasks/portable-recipe-packages-v1.md), and [initial PR review](./pr-54-review.md).

AgentState MCP tools are unavailable in this harness, so the existing local `.agentstate-lite` board remains the sole persistent record. It is dirty and behind `origin/board`; do not sync it until unrelated pending edits can be reconciled safely.

[ORCHESTRATION-REFLECTION]
workflow: plan review -> tests-first build -> exact-SHA review -> correction loops -> final review -> QA -> push
pattern_used: Sequential Pipeline + Generator-Critic
agents_used: Architect/PO plan reviewer; two failing exact-SHA reviewers; one final whole-unit reviewer
what_worked: Independent adversarial review caught three raw-vs-normalized contract gaps that the initial regression matrix missed, before QA or push.
what_didnt: The first correction addressed the reviewer headline but missed its adjacent manifest-path observation, causing one avoidable extra review loop.
would_change: Convert every reviewer finding and adjacent example into explicit tests before issuing the replacement SHA, then audit all fields crossing the same normalization seam as one class.
[/ORCHESTRATION-REFLECTION]

## Merge receipt

PR #54 merged into `main` at `2026-07-14T17:21:24Z`. GitHub reports merge commit
`288e989dd47962236de311896fcb5058b6fc8161`; the reviewed PR head was
`7804a87d55e374c2ae913622cb36417c5e93bfe9`. The portable-recipe task is complete.
