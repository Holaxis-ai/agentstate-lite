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
timestamp: '2026-07-17T21:18:32.356Z'
---
PR #86 (branch ci-test-workflow) GREEN — all three CI jobs pass on 597adb7: gate (node 22), gate (node 26), built-CLI smoke on the engines floor (node 20). Verified by log content: every gate phase executed on the runner (workspace suites, test:scripts, verify:npm-package, check:skill, e2e 14/14). Awaiting merge.

Commit chain: e47e96a (workflow, [20,25]) -> 22e63f3 (review response: matrix [22,26] + smoke-node-20 job; hermetic git identity in cli test script; delete.test.ts FS-case fix) -> 4e2d8e8 (comment precision: unflagged type stripping = 22.18) -> 597adb7 (external-core proof: --offline -> --prefer-offline; npm ci never caches packuments, so range resolution failed ENOTCACHED on cold caches — reproduced red under npm_config_cache=<empty>, green after, incl. cold verify:npm-package).

Pattern worth keeping (feeds plan items 2-5): CI failures unmasked SERIALLY — identity failures hid the cold-cache failure, which hid everything downstream. Standing CI ends that masking. Three latent portability defects found by the first real runs: git-identity hermeticity, FS case dependence, warm-cache dependence. All were invisible to the single-mac gate.

Reviews: e47e96a and 22e63f3 independently reviewed (PASS); 597adb7 shipped under the trivial tier (test-only, red/green validated) with a parallel delta review in flight. Codex team review (request-changes on e47e96a) fully addressed.
