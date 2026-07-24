---
type: Context Note
title: 'Review record: Phase 2a name migration, high-risk tier (4 rounds, exact SHAs)'
actor: claude-main-viewauthoring
timestamp: '2026-07-24T14:18:27.601Z'
---
# Review record: Phase 2a name-migration (4 rounds, Codex, exact SHAs)

Recorded by the orchestrator on the reviewers' behalf (reviewer sandboxes cannot write the board). Finding counts converged 6 -> 1 -> 1 -> 0.

## Round 1 (2901497) — REQUEST CHANGES, 6 findings
VERDICT: REQUEST CHANGES

findings:

1. P2 — EMPIRICAL — A malformed document makes the real migration abort after partial writes, with no receipt.

   `migrateBundle` initially scans with `onSkip` and records malformed docs, but after rewriting all readable candidates it calls a second unguarded `query(bundle, { type: "Page" })` at `scripts/migrate-legacy-view-names.mjs:184`. I created a real bundle containing a valid Page doc, a Page convention, and a raw `pages-registry/broken.md` whose YAML began with `type: Page` but had an unterminated flow sequence. Dry-run behaved honestly: it reported the broken doc in `skipped_docs`, projected the readable doc's rename, and kept the Page convention. The real CLI run then rewrote the valid doc to View, hit the second query, exited 1, emitted no stdout receipt, and printed a `MalformedDocumentError` stack to stderr. The malformed bytes and Page convention remained, but the bundle was left partially migrated.

   This directly contradicts the claimed “skipped with a warning and blocks Page-convention deletion” behavior and defeats the receipt precisely on the adversarial path. Make every post-write scan tolerate/report the same skipped docs (or derive the remaining stock without a second loud scan), and add a raw malformed-markdown fixture exercising both dry-run and the actual CLI mutation path.

2. P2 — EMPIRICAL — `--dir` does not verify that its target is a bundle before recursively rewriting it.

   `main` constructs `{ root: path.resolve(dir) }` directly at `scripts/migrate-legacy-view-names.mjs:278-282`, bypassing the repository's normal `resolveLocalBundleTarget`/`openBundle` check that requires `index.md`. I pointed the real script at an ordinary temporary directory with no `index.md` and one Page-typed Markdown file. It exited 0 and rewrote that file to View/access. A mistaken `--dir .` can therefore walk and mutate an arbitrary source tree (including nested package content), not merely the promised bundle.

   Require and canonicalize a real bundle root before the first scan. A special refusal for this repo's own `.agentstate-lite` is not needed—the board is an intended migration target—but generic bundle validation is necessary.

3. P2 — EMPIRICAL — The spec-directed View-convention overwrite has no adequate recovery disclosure or recoverable prior revision on a plain filesystem bundle.

   I installed a customized `conventions/view` that still validly governed View but added an `owner` requirement, a custom path, and recovery-critical body text. Dry-run returned only `convention_swapped: "would_swap"` with no warning; the real run returned only `"swapped"` with no warning and replaced the customization wholesale. `docVersions` then contained only the new revision because `FilesystemBackend` intentionally retains no history. Thus an external/local-only bundle not already protected by Git/board history loses the old content, and neither receipt tells the operator what was lost or how to recover it.

   The overwrite itself is spec-directed, but the high-risk interface needs a preflight warning that distinguishes a customized convention from the shipped/known-old form and either exports the old bytes, verifies recoverable history, or requires explicit confirmation. The occupied-but-not-View-governing case did behave safely: it left the unrelated `conventions/view` untouched and emitted the promised warning.

4. P2 — EMPIRICAL — The canonical-rewrite note omits a semantic timestamp mutation.

   `NORMALIZATION_NOTE` at `scripts/migrate-legacy-view-names.mjs:35-37` lists key order, quoting, and trailing-newline formatting. However, the selected engine write path guarantees a timestamp and defaults it to the current time (`packages/core/src/bundle.ts:100-140`). I placed a valid externally authored Page doc without `timestamp` in a real bundle; migration added a current timestamp while reporting no warning. This changes freshness semantics, not merely formatting, and can make old knowledge appear newly fresh.

   Preserve timestamp absence if the migration contract is intended to be a name-only rewrite, or explicitly report this semantic addition (preferably with a count/list) in dry-run and real receipts.

5. P3 — EMPIRICAL — The built `status --help` surface still says legacy content never migrates.

   My independent prose sweep found `packages/cli/src/commands/status.ts:129-132`: “all fully supported, nothing migrates.” Running the freshly built `./aslite status --help` prints that stale claim verbatim, while the runtime status receipt was updated to the transitional story. Correct the help text and add a pin for the permanence claim, not merely the number of Page mentions.

6. P3 — EMPIRICAL — The migration suite does not protect the negative scope of the `bridge` rewrite.

   As my independent mutation, I removed `&& isViewTyped(frontmatter)` from `hasOwnBridge`. All six migration-script tests still passed, meaning a regression that rewrites unrelated `bridge` fields on arbitrary document kinds is invisible to this high-risk suite. The current implementation is correct, and my independent rich fixture confirmed a Note's `bridge` remained untouched, but the committed matrix does not pin that invariant. Add a non-View/Page document with an own `bridge` field and assert byte/version stability.

attack_first_results:

1. Customized convention overwrite — EMPIRICAL. A valid hand-customized View convention was overwritten byte-for-byte with the shipped convention; dry-run said only `would_swap`, real run only `swapped`, neither warned, and the original was unrecoverable through FilesystemBackend history. This is finding 3. Separately, an occupied `conventions/view` governing `Widget` was left untouched with the promised warning; the Page doc was renamed and the Page convention deleted, exactly as the receipt stated.

2. Actually unparseable Page-shaped document — EMPIRICAL. I wrote malformed YAML containing `type: Page` and an unterminated `bridge` sequence. Dry-run was honest and non-mutating: it listed the skip and kept the Page convention in its projection. The real CLI run was not: it partially migrated a readable sibling, then the unguarded second query crashed with exit 1 and no receipt. This is finding 1.

3. Dummy delete token — REASONED, with concurrency support. The wart does not break retry semantics in this caller. A present mismatched version still raises `VersionConflict`, which `versionedMutation` retries from a fresh read; a concurrently absent target is an idempotent convergence under the delete contract. The returned pre-delete token makes `outcome.version` conceptually stale, but this caller discards it. A delete race may over-attribute which process performed the unlink, not corrupt the final state.

4. Two-process concurrency — EMPIRICAL. I launched two independent Node processes simultaneously over one 40-Page fixture. Both exited 0; across repeated runs they either split the documents or one converged after the other. Final state had zero Page types, zero own `bridge` fields, the shipped View convention, and no Page convention. A third run reported all mutation counts zero. The lock serializes each physical target, not the two whole scripts globally, but the resulting interleaving converged safely.

survived_attacks:

- Exact commit verified: `29014974c0a0be1fda56a5d6a4df2b2c3ff990a6`, one commit directly atop current `origin/main`.
- Rich independent fixture: Page registrations and off-prefix Page docs flipped; View/Page `bridge` values moved verbatim; invalid object capability copied and warned; `access` won when both fields existed; unrelated Note `bridge` stayed untouched; no ids/blob keys moved.
- Idempotence held empirically: after a rich first pass, a second pass reported zero type flips, bridge renames/removals, convention swaps, and convention deletions, with every remaining document version unchanged.
- CAS attack held: the committed competing-write test preserved the competitor's body and retried exactly once.
- Builder red probe 1 held: disabling the Page-to-View flip made all 6 migration tests fail (exit 1).
- Builder red probe 2 held: dropping the per-doc `expectedVersion` guard made the competing-write test fail (exit 1).
- My negative-scope mutation survived rather than held; it is recorded as finding 6. The mutation and both builder probes were restored.
- Fresh authoring held on the built CLI: `new "View" ... --access none` exited 0; the otherwise identical `--bridge none` invocation exited 2 with `USAGE`/unknown-field output.
- Convention/reference projections were byte-identical across their source and npm copies (matching SHA-256 values); `check:skill` independently confirmed generated `packages/cli/SKILL.md` was current.
- Repo conventions held: no `plugins/` or `.claude-plugin/` changes in the commit, no AI/co-author attribution, `git diff --check` clean, and the 24-file diff is one coherent migration/teaching/test unit. The committed plugin still contains old prose as expected for the bot-owned post-merge regeneration channel; it was not hand-edited here.
- Prose sweep used independent permanence patterns. Aside from the bot-owned plugin projection, it found the user-facing `status --help` survivor recorded as finding 5; no other non-plugin Page/bridge “forever” or “never needs migration” claim survived those patterns.
- No self-repo guard: acceptable as a specific policy because this repo's live board is the intended first runner target and `--dir` is explicit. The missing generic bundle-root validation and convention-recovery preflight are the actual safety gaps (findings 2 and 3).
- Final cleanup verified: `git diff --exit-code HEAD --` exited 0 and `git status --short --branch` showed only `## HEAD (no branch)`.

gates:

- `npm run build` — exit 0
- `npm run typecheck` — exit 0
- `npm test` — exit 0
- `npm run test:scripts` — exit 0
- `npm run check:skill -w @holaxis/aslite` — exit 0
- `npm run verify:npm-package` — exit 0

## Round 2 (6334830) — 6/6 closed; 1 new (timestamp disclosure)
VERDICT: REQUEST CHANGES

round1_closure:

- F1: CLOSED — EMPIRICAL. A raw `type: Page` document with an unterminated YAML flow sequence was exercised through the real CLI in both modes. Dry-run exited 0, reported exactly one deduplicated skipped doc, and planned `page_conventions_deleted: []`. The real run exited 0, emitted a complete parseable JSON receipt with all migration counters/lists, migrated the readable sibling, preserved the malformed bytes, and kept `conventions/page`. The receipt warned that the malformed doc was not migrated and named it as the deletion blocker.
- F2: CLOSED — EMPIRICAL. A plain temp directory with one Page-typed Markdown file but no `index.md` was refused with exit 2 and `not a bundle root (no index.md)`; the file stayed byte-identical. A second reproduction passed a valid bundle first and that invalid directory second; whole-run preflight still exited 2 before changing the valid bundle.
- F3: CLOSED — EMPIRICAL/REASONED. A customized, valid `conventions/view` was version-stable under the default run, which reported `skipped_customized` and explicitly instructed the operator to re-run with `--overwrite-custom-conventions`. With the flag, the receipt reported `swapped_customized` and named the sibling recovery file. The recovery file parsed as valid OKF Markdown and retained the custom required field and body. Its filesystem mtime preceded the swapped convention's mtime, consistent with the audited source order (export before CAS write). A forced post-export convention-write failure independently left the recovery file present while the original convention remained version-stable, proving the copy lands before a destructive swap.
- F4: CLOSED for the original absent-key reproduction — EMPIRICAL. A valid Page doc with no `timestamp` produced `timestamp_added: 1` and `timestamp_added_docs: ["pages-registry/no-time"]` in both dry-run and real receipts; the real document acquired an ISO timestamp. See the new P2 finding for empty/null timestamp values.
- F5: CLOSED — EMPIRICAL. Freshly built `./aslite status --help` exited 0, contained the transitional “migration window” wording, and contained neither `nothing migrates` nor `all fully supported`. The new wording regression test also passed in the exact-source `npm test` gate.
- F6: CLOSED — EMPIRICAL. Temporarily removing exactly `&& isViewTyped(frontmatter)` from `hasOwnBridge` made `npm run test:scripts` exit 1. The real and dry-run fixture assertions both observed `bridge_renamed: 4` instead of 3, proving the non-View bridge-field negative scope is owned by the suite. The source was restored to SHA-256 `47cfae335c4c7fcea9859b9776c22d491433be8f68eb96baf5fe7893f8031cd5`.

findings:

- [P2] [EMPIRICAL] Empty or null timestamp values are still replaced with the current time without receipt disclosure. Two valid raw Page docs were reproduced separately with `timestamp: ""` and YAML `timestamp:`. For each, dry-run reported `timestamp_added: 0`, the real receipt also reported `timestamp_added: 0`, and the persisted document contained a newly generated current ISO timestamp. `planDocChange` only reports the change when the `timestamp` property is absent, while `writeDocVersioned` defaults every non-string or blank timestamp. This is the same hidden freshness-semantic change the F4 receipt was intended to expose. Align the migration's disclosure predicate with the engine's usable-timestamp predicate and pin absent, empty-string, and null inputs in both dry-run and real receipts.

checks_that_held:

- A prior-shipped convention with only a trailing-space body reformat classified as `skipped_customized`, stayed version-stable, and told the operator to use `--overwrite-custom-conventions` to export and swap.
- Relative `--dir bundle/` with a trailing slash resolved to the correct canonical bundle. The receipt used the canonical absolute bundle path, and its sibling saved-copy path existed and parsed successfully.
- A forced early stop after export but before convention swap can leave a saved-copy file that no JSON receipt mentions. This is acceptable residual behavior for this patch: the original customized convention remained unchanged, so the only residue is a redundant, valid recovery copy rather than unreported data loss. Arbitrary process/I/O failure cannot guarantee a terminal receipt.
- Each frozen prior-form file is byte-identical to `examples/views/conventions/view.md` at its named historical commit (`cmp` exit 0):
  - `cf4f0d3`: `5f2eb23ca8778c1411d89f922621c19c6b0b9074189fab36c5d08dd499b3bed8`
  - `ae1dd32`: `d8aac1a8c61c73cddad85d2f2ac5cef1a57bee1a6762662df8ec60dc57abaf62`
  - `850a5dc`: `1f94d4d68ddb51b852432f5696510cccb3d975af9b66650385f8fd73e8c3b476`
  - `5d04732`: `7c452eba1bc03694c9996b451af49b6e3ebcb31f8daa0da599b2c525b25045dc`
- Independent suite-sensitivity probe: temporarily removing `receipt.skipped_docs.length === 0` from `pageStockGone` made `npm run test:scripts` exit 1 because the F1 dry-run wrongly planned deletion of `conventions/page`. The exact source was restored.
- CAS retry/idempotence, customized convention handling, malformed-doc tolerance, non-bundle refusal, and script CLI receipt tests all passed in the final exact-source script gate (45/45).
- After all temporary changes and gates, `git diff --exit-code` exited 0, `git status --short` was empty, and the migration script retained its original SHA-256.

gates:

- `npm run build` — exit 0
- `npm run typecheck` — exit 0
- `npm test` — exit 0
- `npm run test:scripts` — exit 0
- `npm run check:skill -w @holaxis/aslite` — exit 0
- `npm run verify:npm-package` — exit 0

goal_progress:

- Ultimate goal: preserve agentstate-lite as a plain-text, local-first, conflict-safe knowledge system whose bulk migrations are recoverable and legible.
- Proximate goal: complete — independently determine whether exact SHA `6334830` closes F1–F6 without introducing migration-safety regressions. It closes the original six reproductions, but the new P2 timestamp-disclosure variant prevents approval.
- The project-bundle goal/note could not be persisted because `agentstate-lite sync` exited 1 on sandbox `EPERM` while chmodding `/Users/brian/.agentstate`; orientation used the existing local `board` ref read-only and no second task/knowledge system was created.

## Round 3 (2c2094b) — closed; 1 new (third predicate copy in kinds.ts)
VERDICT: REQUEST CHANGES

closure: the round-2 finding: CLOSED

Re-run evidence: on a scratch valid bundle containing exactly two legacy `Page` docs, one with
`timestamp: ""` and one with bare `timestamp:`, the actual script reported
`timestamp_added: 2` and `timestamp_added_docs: ["bare-null", "empty"]` in both dry-run and
real receipts. The real run persisted both as `type: View` with non-empty ISO timestamp strings.
The committed fixture also pins absent, empty-string, and bare-null spellings as
`timestamp_added: 3` with all three ids in both modes.

findings:

- F1 — The single-predicate consolidation claim is incomplete. Empirical source inspection found
  `defaultTimestampAndValidateAgainstRegistry` in `packages/core/src/kinds.ts` still independently
  decides timestamp usability with
  `typeof doc.frontmatter.timestamp !== "string" || doc.frontmatter.timestamp.trim() === ""`.
  `mutateDocument` calls that function from `validateCandidate` for create-only, overwrite, and
  patch paths before their eventual `writeDocVersioned` call. Its condition is currently the exact
  negation of `isUsableTimestamp`, so behavior agrees today, but core still has two definitions and
  the fix claim “one shared definition, no local copy” is false. Replace the inline condition with
  `!isUsableTimestamp(doc.frontmatter.timestamp)` so the mutation/validation path consumes the
  owning primitive too.

checks_that_held:

- Exact commit reviewed: `2c2094b`; final `git status --short` and `git diff --check` were empty.
- `packages/core/src/frontmatter.ts` exports `isUsableTimestamp`; core's public index re-exports it;
  `writeDocVersioned` and `planDocChange` consume that same exported function.
- The old `writeDocVersioned` inline expression and `isUsableTimestamp` agreed on every probed edge:
  `undefined`, `null`, booleans, `0`, `1`, `NaN`, `Date`, object, array, empty string,
  whitespace-only strings, ordinary strings, padded non-empty strings, and an ISO string.
  All non-strings and empty/whitespace-only strings were unusable; non-empty strings were usable.
- Independent dry-run reproduction: exit 0, `timestamp_added: 2`, ids `bare-null` and `empty`.
- Independent real reproduction: exit 0, the identical receipt disclosure, and both persisted
  documents ended with usable generated timestamps.
- Required suite-sensitivity mutation: changing the migration predicate back to absence-only made
  `node --test scripts/migrate-legacy-view-names.test.mjs` exit 1 with three failures. Real,
  dry-run, and CLI receipt checks each observed `1 !== 3`.
- Additional mutation: changing the remaining `kinds.ts` predicate to absence-only made the
  targeted core run exit 1; 82/83 tests passed and the whitespace-defaulting pin failed. The
  mutation was restored.
- All temporary source mutations were restored before the final gates.

gates:

- `npm run build` — exit 0
- `npm run typecheck` — exit 0
- `npm test` — exit 0
- `npm run test:scripts` — exit 0
- `npm run check:skill -w @holaxis/aslite` — exit 0
- `npm run verify:npm-package` — exit 0

## Round 4 (bf4d0f7) — APPROVE, zero findings
VERDICT: APPROVE
closure: CLOSED — `git show HEAD` at `bf4d0f77ffe64f327e66722a56f2aaf4b25dab8f` contains only the `isUsableTimestamp` import and replacement of the inline `typeof`/`trim` condition in `defaultTimestampAndValidateAgainstRegistry` with `!isUsableTimestamp(...)`. A repo-wide audit of `packages/core/src` found no other inline write/defaulting timestamp-usability decision. The `frontmatter.ts` hit in `normalizeFrontmatter` converts a finite numeric epoch to ISO during parsing; it does not decide whether a write preserves or stamps a timestamp. `freshness.ts` performs the separate consumer-specific parseability decision (raw `Date`/number handling plus `Date.parse`), not the write/defaulting decision. Temporarily replacing the fixed call with an absence-only check made the core suite exit 1 with 403 passes and exactly one failure: the existing `packages/core/test/kinds.test.ts:1606` whitespace-defaulting pin. After restoration, `git diff --exit-code` exited 0, and the final `git status --short` was empty.
findings: []
gates:
  npm run build: 0
  npm run typecheck: 0
  npm test: 0
  npm run test:scripts: 0

## External round (bf4d0f7, second independent Codex team) — REQUEST CHANGES, 1 finding

[P2, EMPIRICAL] Page convention deletable while its View replacement could not be created: a
NON-Convention doc occupying conventions/view was invisible to the type-filtered planning query,
so dry-run reported would_create, the write-time refusal was silent, and conventions/page was
still deleted — migrated View docs left ungoverned, no warning. Reproduced with a type: Note
occupant + one Page convention + one Page registration. NOTE: the internal round-1 probe covered
the occupied case only with a Convention-TYPED occupant (visible to the filter) — a disjoint
fixture shape from a differently-configured team, the exact value dual review teams exist for.

## Round 5 (4400ec3, closure) — APPROVE, zero findings

Fix verified with the external reviewer's exact fixture in both modes (skipped_occupied, Page
convention kept with stated reason, occupant version-stable, no would_create reachable). The
mid-write race branch (refused_occupied) was made EMPIRICAL: a FilesystemBackend proxy injected a
competing occupant between plan and write, forcing VersionConflict; the retry took the
refused_occupied decision, kept the Page convention, and left the racer untouched. Suite
sensitivity re-probed red. Final tally: 5 commits, 6 review rounds across two independent teams,
findings 6 -> 1 -> 1 -> 0 -> 1 (external) -> 0.
