---
type: Task
title: >-
  Automated mutation testing (Stryker, core+cli): measure the suite's kill rate,
  file survivors
status: in_progress
priority: '2'
description: >-
  Part of plans/test-suite-confidence (Brian's suite-assurance program,
  2026-07-17). Read the plan doc for the full rationale and scope before
  claiming.
actor: claude-fable-5
assignee: claude-fable-5
timestamp: '2026-07-17T23:52:17.666Z'
---
Branch mutation-testing (commit 8e58859, cut from post-#86 main) pushed; independent review in flight; PR pending human open.

What shipped: Stryker 9.6.1 + tap-runner riding the repo's OWN node --test ts-loader invocation (no second test framework). Per-package stryker.config.json (core, cli); npm scripts mutation:core / mutation:cli / mutation:survivors; inPlace mode (workspace-hoisted deps + the cli build's sibling-src aliases break sandbox copying). cli's buildCommand runs node build.mjs ONCE post-instrumentation — the bundle builds from source, so mutation switching reaches even the dist-spawning tests (env spread propagates the active-mutant var). scripts/stryker-cwd-pin.cjs preloads before the tap hook so chdir-ing tests (home.test.ts hermetic cwd) can't break the hook's relative-path exit write — found empirically, fixed by exit-handler registration order. scripts/mutation-survivors.mjs (+3 tests in test:scripts) extracts the named-gap rows from mutation.json. Workflow .github/workflows/mutation-tests.yml: weekly cron + workflow_dispatch (target core|cli|both, optional mutate glob, force), incremental state cached, reports as artifacts, survivors to job summary — DELIBERATELY not a PR gate.

Validation: real scoped runs green both packages — core src/paths.ts: 135 mutants, score 76.30, 26 survivors + 6 no-coverage (the suite's first measured number; real gaps already visible); cli src/actor.ts: 29 mutants, score 75.86. Sources restored byte-and-mode clean; npm run check exit 0.

Caveats/hazards recorded: run mutation ONLY via the npm scripts (a root-cwd npx stryker run once dropped the plugin bundle's exec bit during inPlace restore — recovered via git checkout; the -w scripts pin cwd); full-suite cli mutation cost is unmeasured (scoped smoke only) — first scheduled CI run will size it; survivor FILING is a manual step fed by the job summary, not automated.
