---
type: Task
title: >-
  CI test workflow on every PR + main (Node 20+25 matrix) — the repo currently
  has NO test CI
status: in_progress
priority: '1'
description: >-
  Part of plans/test-suite-confidence (Brian's suite-assurance program,
  2026-07-17). Read the plan doc for the full rationale and scope before
  claiming.
actor: claude-fable-5
assignee: claude-fable-5
timestamp: '2026-07-17T21:09:36.673Z'
---
PR #86 (branch ci-test-workflow) — review-response round pushed: e47e96a + 22e63f3 + 4e2d8e8 (comment precision only). Awaiting the PR's CI runs, then merge.

Round 2 (codex team requested changes on e47e96a; both live CI legs red — all three blockers confirmed against code + logs):
1. Node matrix [20,25] was obsolete/broken — harness needs module.registerHooks (22.15+) so Node 20 failed before any test; 20+25 EOL. Now [22,26], plus a NEW smoke-node-20 job driving the BUILT bundle (esbuild target=node20) on a real Node 20 runtime, keeping the engines>=20 claim tested.
2. cli suite was not hermetic: the real sync() commit path inherited ambient git identity (present in the dev global config, absent on runners — 'Author identity unknown', all 63 node-25 failures). Fixed at the owning primitive: GIT_AUTHOR_*/GIT_COMMITTER_* defaults in the cli test script. Red/green proven: bare-runner sim (config scrub + user.useConfigOnly=true, which defeats git's username@hostname auto-detect — the reason the earlier mac-side 'refutation' was wrong) makes unfixed sync red 9x with the exact CI error; fixed full cli suite 945/945 green under the same sim.
3. delete.test.ts depended on case-insensitive FS ('concepts/Mixed.MD' vs id 'concepts/mixed'); contract is suffix-only case-insensitivity, id case preserved. Now 'concepts/mixed.MD'. Linux CI supplies the final empirical proof.

Validation this round: full 'npm run check' exit 0 in a fresh worktree UNDER the bare-runner git sim; built bundle smoked on real node v20.19.4; independent re-review of exact SHA 22e63f3: PASS high confidence (verified attribution tests read frontmatter-derived subjects, never %an, so identity injection breaks nothing; 81 affected tests green under the sim; esbuild target=node20 makes the smoke job the right API-level check). Reviewer calibration lesson recorded: dev-machine probes of CI-environment behavior are REASONED evidence, not empirical — the runner is the authority.

Lesson for the plan (feeds items 2-5): the plan text's 'Node {20,25}' was stale at authoring; CI itself caught two latent portability defects (identity hermeticity, FS case) on its first run — exactly the environmental class it exists for.
