---
type: Plan
title: >-
  Test-suite confidence: measure the suite, widen the environments, test the
  agreements
actor: brian
timestamp: '2026-07-17T16:18:14.013Z'
---
## Why (Brian, 2026-07-17)

The review pipeline keeps catching pre-existing defects adjacent to changes —
serendipity, not assurance. Diagnosis: the suite's misses cluster into five
structural classes: (1) parallel surfaces drifting (each tested alone, never for
AGREEMENT — launcher-vs-server predicate, toExit-vs-classifyBundleError, CLI-vs-
bridge limit semantics); (2) else-branch blindness (unknown wire codes -> USAGE);
(3) environmental properties (node-25 gzip bytes; load-sensitive e2e) — untestable
on our single-environment gates, and EMPIRICALLY THE REPO HAS NO TEST CI AT ALL
(only the version-bundle bot); (4) lifecycle/concurrency (three shutdown bugs);
(5) assertion-free green tests (the changed-is-a-boolean case).

The program converts review-catches into standing automated classes, and — the
centerpiece — MEASURES the suite instead of trusting it.

## The five items (each a claimable task)

1. tasks/ci-test-workflow — GitHub Actions on every PR + main: npm ci, build,
   typecheck, npm test --workspaces, test:scripts, check:skill, on a Node {20, 25}
   matrix (ubuntu; the e2e chromium lane included — it is deterministic since #69's
   drain fix). Catches the environmental class; ends the single-machine monoculture.
   FIRST — everything else reports into it.
2. tasks/mutation-testing — automated mutation runs (Stryker for TS), scoped to
   packages/core/src + packages/cli/src, scheduled/on-demand (compute-heavy, not
   per-PR): seeds artificial defects, measures the suite's kill rate, and files
   survivors as named gaps. This is the direct answer to "does our suite actually
   flag defects" — a number, not a feeling. Our red-on-old/revert-experiment review
   convention is hand-rolled mutation testing; this automates it and uniquely
   catches assertion-free-green tests.
3. tasks/agreement-test-convention — the rule (one contract with N surfaces -> one
   table-driven agreement test, per-row) as a CLAUDE.md line, PLUS a one-time
   inventory pass finding parallel surfaces lacking one. Known templates: the
   quad-backend parity suite, the error-boundary matrix. Known first target:
   bridge-vs-CLI query semantics (the limit:0 bug's class).
4. tasks/branch-coverage-audit — one c8/istanbul run as a MAP, not a metric:
   enumerate untested else/error branches in core+cli, file the worst as tasks.
   Explicitly not a coverage-percentage goal.
5. tasks/property-grammar-tests — fast-check property tests for the id/prefix
   grammars, frontmatter parse, and wire envelopes — generalizing the hand-written
   attack tables from cases-we-thought-of to cases-the-generator-finds.

## Sequencing + parallelism

Item 1 first (S-M; independent files: .github/workflows/). Items 2-5 independent of
each other and of in-flight product work (distinct files), safe for a parallel
session: claim the task first (the CAS write IS the claim), read this plan, ship via
the normal branch->review->PR pipeline. Gates note: concurrent full-check runs on
one machine contend for CPU; CI (item 1) removes that constraint once merged.

[contains](../tasks/ci-test-workflow.md)

[contains](../tasks/mutation-testing.md)

[contains](../tasks/agreement-test-convention.md)

[contains](../tasks/branch-coverage-audit.md)

[contains](../tasks/property-grammar-tests.md)
