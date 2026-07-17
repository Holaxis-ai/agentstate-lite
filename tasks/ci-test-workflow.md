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
timestamp: '2026-07-17T21:19:23.200Z'
---
PR #86 (branch ci-test-workflow) GREEN and fully reviewed — ready to merge. All three CI jobs pass on 597adb7: gate (node 22), gate (node 26), built-CLI smoke on the engines floor (node 20); every gate phase verified executed on-runner (workspace suites, test:scripts, verify:npm-package, check:skill, e2e 14/14).

Commit chain: e47e96a (workflow, [20,25]) -> 22e63f3 (review response: matrix [22,26] + smoke-node-20 job; hermetic git identity in cli test script; delete.test.ts FS-case fix) -> 4e2d8e8 (comment precision: unflagged type stripping = 22.18) -> 597adb7 (external-core proof: --offline -> --prefer-offline; npm ci never caches packuments, so range resolution failed ENOTCACHED on cold caches — reproduced red under npm_config_cache=<empty>, green after, incl. cold verify:npm-package).

Reviews: ALL commits independently reviewed PASS (e47e96a, 22e63f3, 597adb7; 4e2d8e8 was the reviewer's own suggested comment fix). 597adb7's review confirmed the --offline asymmetry: the CLI tarball proof KEEPS --offline (zero deps; offline-ness is a property the CLI owns), core's proof alone needed --prefer-offline (real gray-matter range needs a packument). Codex team's request-changes on e47e96a fully addressed; response comment delivered to Brian for posting.

Pattern worth keeping (feeds plan items 2-5): CI failures unmasked SERIALLY — identity failures hid the cold-cache failure, which hid everything downstream. First real runs surfaced three latent portability defects (git-identity hermeticity, FS case dependence, warm-cache dependence), all invisible to the single-mac gate. Calibration lesson recorded: dev-machine probes of CI-environment behavior are REASONED evidence, not empirical — the runner is the authority.

Close-out remaining: human merges PR #86; flip this task to done at merge.
