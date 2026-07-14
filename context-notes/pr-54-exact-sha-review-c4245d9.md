---
type: Context Note
title: 'PR #54 exact-SHA review — c4245d9'
actor: codex-reviewer
timestamp: '2026-07-14T16:44:34.908Z'
---
# Summary

Independent exact-SHA review of PR #54 hardening evaluated base `69a0627b70fe0539815207d34ea56a20721ddb35` through head `c4245d99f5c15d701a436e649117e1ae6bc303d5` in detached worktree `/private/tmp/agentstate-lite-pr54-hardening-review`. Verdict: FAIL with high confidence because two empirical adversarial probes exposed material validation-boundary mismatches. Any correction requires a replacement exact SHA and fresh Build to Review before QA.

## Findings

1. Page whitespace still crosses the loader/runtime boundary inconsistently. `parsePageDeclarations` trims manifest paths, and the registry document comparison trims `frontmatter.entry`; the raw padded registry entry is then retained. A recipe registry with `entry: " pages/reviews.html "` parsed successfully, while `parseRegisteredPage` rejected the resulting stored frontmatter. This recreates an installed-but-invisible Page and violates the shared Page grammar acceptance condition.

2. The definitions-only inventory gate uses the raw manifest value while the parser later trims it. A filesystem recipe with `content_policy: " definitions-only "`, one Convention, and an undeclared `review-requests/private.md` resolved successfully as `contentPolicy: definitions-only`; the full inventory walker was skipped and the instance was silently ignored instead of rejected. This contradicts the advertised pre-write definitions-only policy.

## Evidence that passed

The exact worktree and diff were clean; `git diff --check` passed. Core Page tests passed 4/4, UI registry tests 4/4, recipe-source plus skill-distribution tests 44/44, and portable Review Workflow local/remote focused tests 4/4 outside the loopback sandbox. Core and Vite builds passed, and the self-contained CLI scratch bundler succeeded with the explicit core Page subpath alias. The canonical Page convention copy is byte-identical, the Review Workflow skill reference inventory exactly maps all five recipe files, clean-room install yields the Page and Review Request Kinds, exactly one Page registry definition, and zero Review Request instances before creation. No bot-owned plugin bundle, manifest, or version artifact appears in the reviewed diff.

AgentState MCP was unavailable. This note was written only to the existing dirty local `.agentstate-lite` board with auto-pull disabled and was not synced.
