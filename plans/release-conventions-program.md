---
type: Plan
title: >-
  Release-conventions program: recorded + enforced conventions, cadence
  decision, first-stable path (orchestrated)
actor: anthropic/claude
timestamp: '2026-08-08T13:46:59.974Z'
---
# Goal

Drive the release-conventions program to done: aslite's versioning/dist-tag conventions are
RECORDED, ENFORCED by CI (violations fail, not "someone remembers"), and the release cadence
question (per-merge prereleases vs on-demand) is DECIDED and implemented. Orchestrator:
anthropic/claude (Brian delegated ownership 2026-08-07). Ultimate goal served: npm as the
trustworthy primary distribution channel.

# Ground truth (mapper report, 2026-08-07 — evidence in the report)

- A ratified contract exists (decisions/version-update-contract) + an EXECUTABLE policy state
  machine (`scripts/release-state.mjs resolveTags`) — tested but wired to NOTHING in production.
- Staged release workflows exist (candidate->draft->stage; separately-dispatched finalize),
  fail-closed behind an environment/variable that DOES NOT EXIST yet (P5S is unstarted).
- `prepublish-guard.mjs` now REFUSES bare `npm publish`: there is currently NO working publish
  path end to end. pre.1..pre.3 were manual publishes predating this machinery.
- RECORDS-REALITY DRIFT: contract says pre.2 canonical; registry latest==next==pre.3 (published
  2026-08-03 without the contract code). R6A (first contract release) must retarget pre.4.
- ENFORCEMENT GAP: dist-tag + version-scheme adherence is entirely manual — nothing observes the
  registry; resolveTags has zero production consumers.
- `ci-version-bundle.yml` (marketplace rollback channel, merge-triggered) red 12 consecutive
  merges (vite: unresolved `@agentstate-lite/view-runtime/action-bridge`; sibling dists not
  built before buildPluginBundle). Unowned until now.
- Ownership: 9 of 10 open release-cluster tasks carry placeholder actor openai/codex, unclaimed.
  P5S + dist-tag promotions are irreducibly human (Brian/Mike, npm 2FA).

# Critical path (owned sequence)

1. **Fix ci-version-bundle.yml** — build sibling workspaces first. [DISPATCHED 2026-08-07,
   builder in flight; ordinary PR tier]
2. **Records reconciliation** — amend contract/domain-model/R6A/E7A wording to the pre.3 world
   (registry state, canonical version, R6A->pre.4). Coordinate with the codex-npm owners rather
   than unilateral edits to their ratified docs. [next]
3. **Cadence decision (the recorded proposal)** — per-merge prerelease publishing. Options
   drafted for ratification (see decision doc); amends 4 contract clauses; requires Brian (+Mike?)
   sign-off. [drafting now; blocked on Brian input Q1/Q2]
4. **Enforcement gate (target B)** — `release:audit-tags`: registry-observing CI check wiring
   resolveTags + version-scheme validator (reject 0.1.1-pre.N, N gaps/regressions) + source-vs-
   registry drift gate + a durable phase declaration. No dependency on live enablement; highest
   value per effort. [can start in parallel once 2 lands]
5. **p5a-pre-live-hardening** — split: the leading-dash assertToken one-liner now; the
   signed-receipt reconciler-as-gate design as its own unit. [coordinate with claude-main-p5a]
6. **P5B -> P5S** — bot/protection compatibility, then the human setup (environment, live flag,
   branch/tag protection, trusted publisher). P5S is Brian/Mike work to SCHEDULE.
7. **First-stable definition (target C)** — a `tasks/first-stable-release` with explicit
   readiness criteria; stable mechanics already encoded in resolveTags. [drafting criteria for
   Brian to edit; sits downstream of the prerelease proof program E7A/E7B]

# Decision points pending Brian (and Mike where noted)

- Q1 cadence: (a) full per-merge auto-publish to `next` (drops staged 2FA for that lane —
  supply-chain tradeoff, 4 contract clauses amended); (b) keep on-demand staged releases,
  raise cadence by tagging more often (no contract change); (c) hybrid — auto-STAGE per merge,
  humans finalize in batches (keeps the 2FA gate, adds automation). Mapper details in report.
- Q2 ratification: Brian alone vs Brian+Mike (contract is codex-program work; Mike co-owns npm).
- Q3 first-stable bar (deferrable): what earns 0.1.0.

# Status log

- 2026-08-07: roadmap recorded; mapper report delivered; CI-fix builder dispatched.

[grounded in](../decisions/version-update-contract.md)
- 2026-08-07: CI-fix BUILT — fix/ci-version-bundle-sibling-builds @ a384ae0 (owning-primitive fix
  in embed-ui-assets.mjs buildUiDist: exported ordered UI_DIST_PREREQUISITE_WORKSPACES; red
  reproduced, class-pinning test red-probed, all gates 0). Independent review dispatched on the
  exact SHA; PR text delivered to Brian. P5B note: after merge the bot reaches its direct
  push-to-main again — protection sequencing stays with release-protection-bot-bridge.
- 2026-08-07: CI-fix REVIEWED — APPROVE (empirical audit: boundary clean, completeness traced from
  real ui imports, core-first ordering proven load-bearing, red-probe caught the intended failure,
  129/129 scripts suite). One minor follow-up filed here: the coverage test scans only ui
  `dependencies`; core sits in devDependencies and is protected only by a hardcoded assertion — a
  future value-imported devDep could escape; harden by scanning both maps. Operational note for
  merge: the bot's FIRST green run will emit one larger catch-up commit (12 runs of artifact
  backlog incl. 1.0.147->1.0.148) — expected, not a malfunction. READY FOR BRIAN'S MERGE.
- 2026-08-08: Item 1 DONE — PR #214 merged; first green ci-version-bundle run in 13 pushes; bot
  catch-up commit 6c07070 (1.0.148) landed as forecast. Rollback channel alive again.
  Item 4 (enforcement gate) DISPATCHED: builder on feat/release-tag-audit — release:audit-tags
  wiring resolveTags to the live registry, version-scheme validator, source-drift gate, committed
  phase declaration; network-vs-violation distinction structural; NOT in the offline check chain.
  Item 2 (records reconciliation) next: drafting the pre.3 amendment as a Review Request to Mike.
- 2026-08-08: Q1/Q2 ANSWERED (Brian): model (c) continuous staging + batched finalize; joint
  Brian+Mike ratification. Proposal recorded (decisions/release-cadence-continuous-staging,
  PENDING) with exact four-clause amendment language; ratification RR filed to Mike
  (review-requests/cadence-continuous-staging). PR #219 (audit gate) open, review in flight.
- 2026-08-08: Audit-gate REVIEW: APPROVE WITH FINDINGS. Finding 1 (transition false-reds during
  promote/rollback windows) being fixed as appended commit on PR #219 before merge. Follow-ups
  recorded: post-stable removed-vs-collapsed next (recorded decision needed BEFORE 0.1.0 —
  feeds the cadence amendment's invariant redefinition); over-enforcement override hatches;
  buffering nit. Reviewer endorsed the packument-fetch design fork. PR #219 comment posted.
- 2026-08-08: Audit gate MERGE-READY — appended fix f44143d passed delta re-review (APPROVE, all
  probes empirical: boundedness, A/B/C green, fresh counter-probe red, at_rest byte-identical).
  PR #219 awaiting Brian's merge. Program state: item 4 done pending merge; awaiting Mike on both
  RRs (records reconciliation + cadence ratification); then implementation plan -> p5a -> P5B ->
  P5S (schedule Brian/Mike ~30min) -> enable continuous staging.
- 2026-08-08: EXTERNAL-TEAM review on PR #219 (head f44143d): REQUEST CHANGES, two blocking
  findings BOTH missed by the internal ladder — (1) phase declaration not cross-validated against
  source/kind (fabricated staged candidates pass green via unpublished-candidate collapse);
  (2) valid-JSON-malformed packuments escape the structural classification (null -> exit 2,
  {} -> exit 1; both should be exit 20). Fixes dispatched as appended commits; hold merge.
  Pattern note: cross-team review again caught a disjoint failure class (playbook rule 9).
- 2026-08-08: External findings CLOSED at 9fef1e3 (declaration cross-validation + one owning
  packument validator; their reproductions are now red tests; false-red timeline hunt clean;
  internal delta review APPROVE). PR #219 response posted; awaiting external re-review to lift
  REQUEST CHANGES. Merge held.
- 2026-08-08: Cadence decision RATIFIED by Brian alone (his call, superseding joint routing).
  Decision doc finalized; Mike's RR converted to informational (canceled w/ decision_summary);
  contract carries Amendment A1; implementation plan recorded
  (plans/continuous-staging-implementation) — build gated behind PR #219 merge -> p5a -> P5B ->
  P5S. Records-reconciliation RR to Mike still open (factual corrections, unaffected).
- 2026-08-08: PR #219 MERGED (2d86768); release-audit gate LIVE and green on main (first push
  run success) — target B operational. p5a claim verified STALE (todo, authorship-actor only,
  no activity since 08-03, no branches) -> claimed by anthropic/claude per convention; split per
  plan: (i) assertToken leading-dash ban dispatched now; (ii) signed-receipt reconciler-as-
  finalize-gate follows as its own reviewed unit.
