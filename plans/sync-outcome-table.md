---
type: Plan
title: >-
  sync outcome table: one enumerable authority for the sync-family's
  refusal/guidance states
actor: mike/claude
timestamp: '2026-07-18T04:05:00.000Z'
---
# sync outcome table: one enumerable authority for refusal/guidance states

**Status: DRAFT v2 — v1 was reviewed needs-rework (independent design review, 2026-07-18);
every finding is folded in below (⟲ marks the deltas). Pending a resolution check before
promotion.**

## Why (the evidence — ⟲ narrowed per finding 5)

The journey defects of the last fortnight clustered in the establish/sync/window state
space. Honestly split: the **selection/guidance-drift class** — F5's two-hop guidance, the
remnant-arm routing, the marker receipt copy corners — is what an outcome table prevents
structurally. The **detection/mechanic class** (F2's adopt, F3's remnant probe, F1's
auto-clear) lived below the envelope layer and the table does not claim it. The narrower
claim is still sufficient: the selection layer now spans **~45 CliError sites in
sync-establish.ts alone** (⟲ corrected count; the "~30 branch points" figure was PR #78's
review speaking of the flow machines generally), plus sync.ts's window/in-tree/local-board
arms and home's board lines — three surfaces with hand-kept copy that drifts (F5 was
exactly that drift).

## The one claim

Every in-scope refusal/guidance envelope is constructed from ONE enumerable CLI-side
table; the package factories are its package-side rows; an agreement test enumerates every
row against **rendered-byte fixtures**; and behavior is byte-frozen — including today's
inconsistencies.

## Design (⟲ re-architected per findings 1, 2, 6, 7)

- **The table lives CLI-side**: `packages/cli/src/sync-outcomes.ts`. ⟲ v1 put it in
  board-git; that cannot express CliError("USAGE") states (BoardGitErrorCode has no USAGE;
  importing CliErrorCode would break the no-allowlist import gate; extending the package
  taxonomy is a coordinated change this unit must not smuggle). The package keeps what it
  has: `preShareWindowError`, `dualBoardError`, the window guidance — the table COMPOSES
  those as rows rather than absorbing them.
- **Rows are keyed internally, per-SITE where copy differs today.** ⟲ v1 claimed
  `details.state` as the existing universal key — false: it exists today only on the
  window/remnant, dual-board, in-tree (×2), no-repo, and detached-head arms (and the two
  detached-head emitters carry DIFFERENT details shapes — frozen as-is). Rows carry an
  internal key; `details.state` is emitted exactly where it is emitted today and nowhere
  new (details render into TOON — adding a key is an observable change). A follow-up task
  (filed, not folded) may later add discriminators as a DECLARED behavior change.
- **Row shape**: `{ key, code (CliErrorCode), message(params), help?(params),
  details?(params) }`. ⟲ NO exit field — exit derives solely through the CLI's one
  CODE_EXIT mapping; a per-row exit would fork it.
- **The freeze preserves today's inconsistencies**: bare-"sync" package strings vs
  "${inv} sync" CLI strings (⟲ v1 miscited `preShareWindowError` as taking `inv`; it does
  not — the package deliberately says bare "sync"); namespace-conflict copy differing
  between its two sites; marker-tree-unavailable's two wordings; detached-HEAD's three
  sites. Each is its own row. Copy unification is a FILED follow-up, never folded in.
- **Consumers**: sync.ts, sync-establish.ts, and home's board block construct in-scope
  envelopes/lines only via table lookup; the inline constructions are deleted in the same
  unit. ⟲ Test-import continuity: constants/helpers that existing suites import from the
  command modules keep their export paths via re-export shims, so "existing suites
  byte-unmodified" is achievable literally.

## Scope (⟲ corrected per finding 6)

**In**: the window family (pre-share pull-first — both windowNote variants — dual-board,
remnant, pre-share-no-origin); the marker states' ERROR/refusal arms (interrupted-offer
copy, lost-race note + CONFLICT, unverifiable-marker, clear-failure receipts' error text)
— ⟲ boundary: for marker strings that live inside `alreadyShared`'s exit-0 records, the
table supplies the STRING TEMPLATES for those fields only; record ASSEMBLY (which fields,
in what order) stays inline and out of scope;
in-tree refusals (write refusal USAGE, NO_UPSTREAM, no-comparison-basis lines); the
provisioning refusals with guidance — **all four** `messages[reason]` arms incl. `foreign`
and `foreign_checkout` — plus behind-origin, namespace (both sites), board-branch-conflict,
local_board arms, the ffSwallowToError family; home's board-block lines for shared states.

**Out (⟲ tightened)**: `alreadyShared`'s multi-field exit-0 RECORDS (receipt-shaped:
note/cleared/discard/cleanup_branch/next_steps — they do not fit the row shape and are
receipts, not refusals); success receipts and previews; establish's mutation steps and all
git mechanics; ~~establish-under-indeterminate~~ (⟲ does not exist — establish never
consults detection); any behavior change, new state, or copy improvement (filed instead);
`classifyBundleError`/`cliErrorFromBoardGit`/the code taxonomy (⟲ explicitly untouched —
the wire-error-classification thread builds on them); awareness/autopull; View-rename and
trusted-action files.

## The parity bar (⟲ hardened per finding 4)

Field order in TOON/JSON comes from construction order, and moving construction is exactly
what silently reorders it. Therefore: **per-row pre-refactor fixtures of the RENDERED
envelope bytes** (through `renderErrorEnvelope`, details and their order included), asserted
by the agreement test — not field-wise checks. Plus the reviewer's base-vs-head transcript
battery across the state matrix, on **all four surfaces**: sync, establish, home, AND
session-start's board-block rendering (⟲ added). The `--json` axis applies only to the
exit-0 guidance records and board blocks — error envelopes are ALWAYS TOON regardless of
`--json` (⟲ per the resolution check; no refusal-envelope `--json` surface exists). The
dual-board fixture may be produced via a constructed detection state with an injected
probe OR an additive export of the factory — builder's pick, both satisfy
"consumed, not duplicated." Existing pinned suites stay byte-unmodified as the outer bar.

## Inputs (⟲ corrected per finding 3)

The in-flight mutation run covers sync.ts/sync-establish.ts (cli config) but NOT
porcelain.ts — board-git has no Stryker config. Survivor seeding applies to the two CLI
files; the porcelain arms get a HAND-AUDIT of their pins instead. Optional separate
precursor (filed as its own small task, not a blocker): a board-git Stryker config.

## Sequencing + risk (⟲ finding 8: waiver replaced)

ONE PR if reviewable; split fallback = table + sync/establish first, home consumption
second (no two-authorities window: the freeze holds across both). **High-risk tier, full
ladder — QA is MANDATORY, scoped to state-construction and routing attacks**: construct
unenumerated and combination states (marker + shallow + window overlap, remnant + foreign
origin) and verify **routing equivalence** — base-vs-head behavior IDENTICAL in every
constructed state (⟲ routing stays caller-side branching under the freeze; there is no
dispatcher to "fail loudly," and adding one would itself be a behavior change).
Byte-parity only proves enumerated states; F1 and F3 were found by QA constructing
unenumerated ones — the QA stage exists for exactly the residual this refactor carries.

Coordination: this instantiates the agreement-test pattern — update
`tasks/agreement-test-convention` to record it as the first instance rather than silently
claiming it.

## Acceptance (⟲ de-contradicted)

- Every existing pinned test byte-unmodified and green; base-vs-head transcripts
  byte-identical across the four-surface state matrix (TOON + --json).
- The agreement test enumerates every table row against rendered-byte fixtures; a row
  without a fixture fails the suite.
- No inline construction remains for in-scope states (grep-provable); package factories
  are consumed, not duplicated.
- `details.state` emitted exactly where it is today — nowhere new, nowhere removed.
- Net line count across the three consumer files goes DOWN.
