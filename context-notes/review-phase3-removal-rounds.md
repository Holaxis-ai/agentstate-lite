---
type: Context Note
title: 'Review record: phase-3 legacy removal, high-risk tier (4 rounds, exact SHAs)'
actor: codex-reviewer-phase3
timestamp: '2026-07-24T20:15:02.590Z'
---
# Summary

Review record: Phase 3 legacy-name removal, high-risk tier (4 rounds, Codex, exact SHAs 8192269 / 132ad95 / 74a7610 / e271d20). Findings per round: 4 (3 P1 + 1 P2) -> 1 P1 -> 1 P2 -> 0. Recorded by the orchestrator.

## Round 1 (8192269) — REQUEST CHANGES: stale keep-working help; historical reference left behind; stale-convention silent scaffolding; bridge-only branch unpinned
VERDICT: REQUEST CHANGES

findings:

1. P1 EMPIRICAL — A shipped CLI surface still teaches a removed behavior as current. `packages/cli/src/commands/ui.ts:29` says “legacy type: Page docs keep working,” and the rebuilt `./aslite ui --help` prints that sentence verbatim. They do not keep working after this commit. This directly fails the north-star requirement that no aslite surface teach or silently accept legacy names. The existing help-source test misses the defect because it treats any line containing the word “legacy” as acceptable without checking the claim's meaning.

2. P1 EMPIRICAL — The prescribed upgrade path leaves first-party legacy teaching behind, silently. I seeded the complete historical Review Workflow fixture, including its declared `references/page-authoring-v0`, reapplied the renamed recipe, and ran the real `scripts/migrate-legacy-view-names.mjs`. The registration and convention migrated, but both references remained: the new `references/view-authoring-v0` and the old `references/page-authoring-v0`. Reading the old reference still teaches “Bundle Page authoring,” `type: Page`, and `bridge` as the live authoring contract. After migration, `status` reports only legacy locations informationally and gives no call to action for this stale teaching. The post-removal test fixture is incomplete: `seedLegacyV1Install` in `packages/cli/test/recipes.test.ts:1524-1543` omits the historical fixture's reference, while the migration script has no reference cleanup or retirement step.

3. P1 EMPIRICAL — A legacy convention by itself creates a reachable silent-scaffolding path. With only a `type: Convention` document whose `governs` is `Page`, reapplying the current Review Workflow recipe skipped `conventions/view` as `legacy_present`, installed a working current View card, and produced no `legacy_naming` finding because status only scans Page-typed docs and legacy `bridge` fields. `aslite kinds` continued to advertise Page, and `aslite new Page ... --bridge bundle-read` succeeded and wrote a Page-typed document that the runtime ignores. This violates the explicit no-scaffolding/no-silent-acceptance criterion. The responsible alias skip is at `packages/cli/src/recipes.ts:431-480`; the status scan at `packages/cli/src/commands/status.ts:397-409` does not diagnose `governs: Page`.

4. P2 EMPIRICAL — The newest loudness branch lacks a bridge-only regression pin. I temporarily changed `namesPresent` to depend only on `pageTyped.total`, which downgrades a View document with only an own legacy `bridge` field from the loud FINDING/help branch to the informational/no-help branch. All 15 focused `legacy-page.test.ts` tests still passed. The current implementation behaves correctly, but this high-risk silence boundary can regress undetected: the bridge-only test asserts the section/count/row, while the help assertion is exercised only by a mixed Page-plus-bridge fixture.

attack_first_results:

1. Status fork — The intended name/location fork held for the probed document shapes. An own `bridge` field with no type and one on a non-View kind were ignored; a View-kind document with own `bridge` was flagged; a names-plus-locations bundle selected the loud FINDING with the migration command; and a locations-only bundle selected the informational note without the call to action. The View-kind scope for `hasLegacyBridgeField` is sound: `bridge` is not a globally reserved field, and neither a missing-type nor a non-View document was ever a View registration. The convention-only state in finding 3 is the uncovered straggler.

2. Legacy-alias recipe skip — Confirmed: a complete unmigrated legacy install reapplies successfully but has zero working View cards until migration. `status` is loud when the install includes its Page-typed registration. Refusing to create a duplicate current pair is the right underlying policy, but the command currently reports a successful skip instead of an explicit migration-required refusal, and the convention-only variant is silent.

3. Remote registry heads — The reshape is honest. The code performs one `type=View` query. With an injected 503 on the first response, a 502 on a later pagination response, and a malformed/null document response, `remoteRegistryHeads` rejected with an error rather than returning an empty or partial registry. Full loopback/server tests also passed, including error propagation.

policy_opinion:

Keep the refuse-until-migrated policy; do not install a duplicate current registry/blob pair by default. Installing the new pair restores a card immediately but creates two logical copies after the in-place migration, with ambiguous identity and cleanup. Make the refusal explicit and actionable: `recipe add` should fail or return a distinct non-success `migration_required` outcome naming `scripts/migrate-legacy-view-names.mjs`, rather than reporting a successful `legacy_present` skip. Also reject kind-aware `new Page` when a stale Page convention exists. An opt-in integrated migration could improve usability, but silent duplicate installation should not.

checks_that_held:

- Exact commit and scope matched the review request: HEAD `8192269`, 44 files, +909/-403.
- A fresh bundle built with the shipped CLI from `init` plus `work-tracking`, `roadmap`, and `review-workflow` contained no independently detected `type: Page`, `governs: Page`, or legacy `bridge` teaching as current; `status` was clean.
- Replacing the exact current Review Workflow reference with `HEAD^` text made the NORTH STAR test fail; restoring the current text made it pass.
- Temporarily restoring Page acceptance made the core Page rejection suite fail in three places. Temporarily restoring the `bridge` fallback made it fail in one place. Both changes were restored.
- Current runtime predicates reject Page and ignore `bridge`; direct `launchIsCurrent` probes rejected current-version Page and bridge-only propose registrations, while accepting current View/access registrations.
- Serve-time currentness and nonce revalidation tests passed; revoked or changed registrations fail closed rather than serving stale authority.
- The migration script's structural post-removal pin passed: Page became View, own `bridge` became `access`, and legacy locations remained recognized.
- Status row caps, the mixed loud branch, and the location-only informational branch behaved as claimed.
- `plugins/` and `.claude-plugin/` were untouched by the commit; generated SKILL verification passed; no AI attribution was present; and `scripts/prior-shipped-view-conventions/5-2901497-phase2a-transitional.md` matched commit `2901497` in real history byte-for-byte.
- All temporary source/test mutations were restored. Final `git status --short` and `git diff --check` were clean.

gates:

- `npm run build`: 0
- `npm run typecheck`: 0
- `npm test`: 0
- `npm run test:scripts`: 0
- `npm run check:skill -w @holaxis/aslite`: 0
- `npm run verify:npm-package`: 0

## Round 2 (132ad95) — F1-F4 closed; mid-vintage residual RULED REQUIRED (P1): 'a small cohort does not make an official migration's known-input postcondition optional'
VERDICT: REQUEST CHANGES

round1_closure:

- F1: CLOSED. Rebuilt `./aslite ui --help` exited 0 and says legacy `type: Page` docs are not
  registered, with `status` and `migrate-legacy-view-names` as remedies. Temporarily restoring the
  exact old `legacy type: Page docs keep working` clause made the new acceptance-claim test fail
  at `src/commands/ui.ts:29` (exit 1); restoring the fix made that test pass (exit 0).
  The pin scans both rendered SKILL channels, authored CLI teaching sources/usage strings,
  `CLAUDE.md`, READMEs, and examples. Valid location claims remain present (`pages-registry/` and
  `pages/` “stay recognized”).

- F2: CLOSED for the round-1 historical-install finding. I seeded a complete pre-rename install
  from `packages/cli/test/fixtures/review-workflow-legacy-v1` and ran the real
  `scripts/migrate-legacy-view-names.mjs`. Its exit-0 receipt reported one Page type flip, one
  bridge rename, canonical View convention creation, `conventions/page` deletion, historical
  Review Request refresh, canonical `references/view-authoring-v0` creation, and
  `references/page-authoring-v0` deletion, with no warnings. An independent recursive sweep over
  all five remaining Markdown files found zero transitional acceptance phrases, zero unlabeled
  Page-kind teaching lines, and zero unlabeled inline-code `bridge` field lines.

- F3: CLOSED.
  - F3(a): a bundle whose only legacy signal is `conventions/page` produced
    `page_typed_docs: 0`, `bridge_field_docs: 0`, `page_convention_docs: 1`, a loud `FINDING`,
    the exact row, and migration-script help. `kinds` still honestly showed the occupant.
  - F3(b): `./aslite new "Page" ... --bridge none` against the known shipped form refused before
    writing (exit 2) and named `scripts/migrate-legacy-view-names.mjs`. The frozen signature
    tripwire passed.
  - F3(c): reapplying the current Review Workflow recipe to a complete legacy install reported
    `migration_required: 2`, `legacy_present: 0`, with per-convention and per-View-pair fields plus
    two `MIGRATION_REQUIRED` warnings naming the script. After the real migration, reapply reported
    `migration_required: 0`, `legacy_present: 1` for the registering View kept at the legacy
    location.

- F4: CLOSED. I applied the round-1 reviewer’s exact
  `const namesPresent = pageTyped.total > 0` mutation. The legacy-page suite exited 1 with exactly
  two failures: the bridge-only state and the governs:Page-convention-only state (18/20 passed).
  Restoring the fixed expression returned the worktree to a clean diff.

attack_results:

- 2(a), shape-equality boundary: SURVIVED AS DESIGNED. Starting from the frozen shipped Page
  convention and adding exactly one optional `owner` field caused the strict shipped-form matcher
  not to fire. `new Page` exited 0 and scaffolded a Page doc, but its immediate receipt explicitly
  warned that Page is no longer registered and named the migration script; `status` simultaneously
  reported the Page doc, bridge field, Page convention, and legacy location as a loud finding.
  Ruling: acceptable no-overreach boundary, not a silent hole. Widening refusal to “similar”
  shapes would also capture genuinely custom kinds named Page, contrary to the stated compatibility
  boundary; the mutation-time hint and bundle-health diagnostic keep this state explicit.

- 2(b), unreadable doc plus replacement-id occupant: SURVIVED. The real script saw a malformed
  `notes/broken`, a legacy Reference at `references/page-authoring-v0`, and a non-Reference Note
  occupying `references/view-authoring-v0`. It exited 0 with `reference_created: false`,
  `legacy_references_deleted: []`, no changed docs, the malformed doc in `skipped_docs`, and a
  warning that the legacy reference was kept because unreadable stock was skipped. SHA-256 hashes
  for the legacy reference, replacement occupant, and malformed doc were identical before/after.
  The receipt reports the causal short-circuit honestly; it does not enumerate the dormant second
  blocker, but makes no success or replacement-present claim.

- 3, mid-vintage residual: REQUIRED COVERAGE. I extracted the known shipped
  `references/view-authoring-v0` from `8192269^`, installed it at its already-renamed id, and ran
  the real migration script. The script exited 0 with no warnings and no changes. The post-run
  document still said Page docs “still resolve during the migration window,” removal was a
  “planned later phase,” and legacy `bridge` was “honored at runtime” / “still resolves today.”
  The same independent teaching sweep failed with six rows. A small cohort does not make an
  official migration’s known-input postcondition optional.

findings:

- P1 — Known shipped mid-vintage View-authoring reference remains factually false after the
  migration script reports success. `migrateBundle` refreshes a known prior Review Request
  convention and creates `references/view-authoring-v0` only when absent, but treats any existing
  Reference at that id as sufficient and never classifies/refreshes the known transitional form.
  Consequently, bundles installed during the rename-to-removal window finish the official
  migration still teaching removed runtime behavior, while the new end-to-end assertion passes
  only because its chosen historical path creates/installs the current reference before the
  sweep. Freeze the known mid-vintage View-reference bytes, refresh an exact known-shipped match
  to the canonical reference under CAS, preserve and warn on customized content, and add a
  real-script mid-vintage fixture whose full-doc teaching sweep must pass.

gates:

- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 0
- `npm run test:scripts`: exit 0
- `npm run check:skill -w @holaxis/aslite`: exit 0
- `npm run verify:npm-package`: exit 0

worktree:

- Temporary F1 and F4 source mutations were restored.
- Final `git diff --exit-code`: exit 0.
- Final `git status --short`: empty.

## Round 3 (74a7610) — P1 closed (7 frozen forms, provenance byte-verified); guard extension ruled OVER-BLOCK (P2)
VERDICT: REQUEST CHANGES

closure: CLOSED

evidence:

- The exact Round-2 mid-vintage fixture, frozen as
  `7-2901497-phase2a-transitional.md` from the `8192269^` era and installed at
  `references/view-authoring-v0`, was run through the real migration subprocess. The receipt
  reported `reference_refreshed: "swapped"` with no warnings. An independent recursive sweep
  inspected every remaining Markdown document (`index.md` and the refreshed Reference) and found
  zero transitional acceptance phrases, unlabeled Page-kind teaching, or bare legacy `bridge`
  field teaching.
- The earliest shipped form, `1-cf4f0d3-initial-view-teaching.md`, passed the same end-to-end
  probe: `reference_refreshed: "swapped"`, no warnings, and zero findings across every remaining
  Markdown document.
- Historical provenance held for all seven frozen forms, not just a sample: for each named source
  commit (`cf4f0d3`, `ae1dd32`, `c6bcd0d`, `fc9474c`, `850a5dc`, `5d04732`, `2901497`),
  `git cat-file -e <commit>:examples/views/references/view-authoring-v0.md` and bytewise `cmp`
  both exited 0. Their SHA-256 values also matched the committed tripwire literals.
- A body-edited transitional Reference reported
  `reference_refreshed: "skipped_customized"`, emitted the customized/left-untouched warning,
  and remained byte-identical. The same shipped form with only its timestamp changed reported
  `reference_refreshed: "swapped"` and ended semantically identical to the canonical Reference.
- Temporary-change proof: I changed the known-shipped Review Request branch to suppress its
  refresh. The focused real historical-install test exited 1 at the assertion
  `false !== "swapped"`. I restored the source; final `git diff --exit-code` and
  `git diff --check` both exited 0, and `git status --short` was empty.

guard_extension_ruling: OVER-BLOCK. The unified guard is appropriate for destructive
retirement/deletion, where an unreadable document may hide stock relevant to whether removal is
safe. It is not appropriate for a directly readable, exact-known-shipped document at a fixed id:
classification is already certain, the replacement is canonical, and the write is CAS-guarded.
In the combined probe, an unrelated malformed `notes/broken` caused both dry-run and real receipts
to report `review_request_swapped: false`, list the skipped document, and warn
`shipped-teaching refresh skipped`; the refreshable Review Request stayed byte-identical and kept
teaching “The Page is a projection.” Removing only the unrelated malformed document made the
unchanged known-shipped convention refresh immediately with `review_request_swapped: "swapped"`.
The receipt is honest, but the policy needlessly strands a safe refresh.

findings:

- P2 — EMPIRICAL — An unrelated unreadable document now blocks the safe known-shipped
  `conventions/review-request` refresh. This extends the global stock-readability guard beyond the
  destructive operations that need it and preserves known false teaching despite complete
  certainty at the target id. Keep the unreadable-stock guard for deletion/retirement, but allow
  known-shipped Review Request and View-authoring Reference refreshes to proceed under their
  existing classify-and-CAS machinery.

gates:

- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 0
- `npm run test:scripts`: exit 0
- `npm run check:skill -w @holaxis/aslite`: exit 0
- `npm run verify:npm-package`: exit 0

## Round 4 (e271d20) — closure CLOSED, zero findings; approval withheld only on sandbox-environment gates
VERDICT: REQUEST CHANGES

closure: CLOSED — At e271d20, the independent combined fixture passed through the real script in both modes (dry-run exit 0: `would_swap`/`would_swap`; real exit 0: `swapped`/`swapped`). Both modes retained `references/page-authoring-v0` and `conventions/page` with explicit unreadable-stock warnings. The commit changes exactly the two claimed files and contains only the guard split, rationale, combined dry/real pin, and superseded blocked-refresh-test removal. Re-unifying the refresh guard failed the split pin (exit 1); removing the retirement guard failed the block pin (exit 1). After restoration, the focused pin exited 0 and `git diff --exit-code` exited 0.

findings:

gates:
- `npm run build`: 0
- `npm run typecheck`: 0
- `npm test`: 130 — interrupted after socket tests failed with `listen EPERM: operation not permitted 127.0.0.1` and the serve suite remained hung; no natural exit was obtainable in this sandbox.
- `npm run test:scripts`: 1 — the migration suite, including the Round-3 split pin, passed; two packaging proofs failed opening `/Users/brian/.npm/_cacache` with sandbox `EPERM`.
- `npm run check:skill -w @holaxis/aslite`: 0
- `npm run verify:npm-package`: 1 — sandbox `EPERM` opening `/Users/brian/.npm/_cacache`.
- Supplemental writable-cache rerun of `npm run verify:npm-package`: 0.

No source change is requested. Approval is withheld only until the mandatory failing/interrupted gates are rerun in an environment that permits loopback listeners and a writable npm cache.

## Gate completion (orchestrator, per round-4's condition)
The three environmentally-failed gates were rerun at exact SHA e271d20 on the host (loopback + writable npm cache available): npm test exit 0 (board-git 120, cli 1164, core 404, server 5, ui-server 35, ui vitest all green), npm run test:scripts exit 0, npm run verify:npm-package exit 0. The reviewer's withholding condition is satisfied; no source change was requested.
