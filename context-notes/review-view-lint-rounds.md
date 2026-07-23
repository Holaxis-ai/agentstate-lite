---
type: Context Note
title: 'Review record: View-surface status lints (2 rounds, exact SHAs)'
actor: codex-reviewer-lint
timestamp: '2026-07-23T23:09:49.453Z'
---
# Review record: dangling/invalid View lint (rounds 1+2, Codex, exact SHAs c4328e0 / 7a92837)

Recorded by the orchestrator on the reviewers' behalf (sandbox EPERM blocked their own board writes).

## Round 1 (c4328e0) — REQUEST CHANGES
VERDICT: REQUEST CHANGES

goal_context:
- ultimate_goal: Preserve a trustworthy, local-first OKF store whose health report makes bundle failures legible.
- proximate_goal: Adversarially verify that c4328e0 exposes View/Page entry failures without changing established output or backend behavior.
- progress: Review complete at exact SHA c4328e0eb70bda9e66f805965b023234be3b327d.

findings:
1. [P2] [EMPIRICAL] Reachable first-party View authoring failures are still invisible to every View-specific lint. `status.ts:407-408` discards every `type: View`/`Page` document for which `parseRegistration` returns null, and `status.test.ts:823-825` deliberately encodes that omission. This is not confined to arbitrary external files: with the repository's canonical View convention installed, both of these strict `new` operations succeeded with no warnings:
   - a normally prefixed View with `entry: other/missing.html`;
   - a View created with `--no-prefix` at `notes/offpath`, with an existing `views/offpath.html` blob.
   The resulting `status --json` reported `kind_warnings: 0`, `conformance_debt: 0`, and omitted `dangling_view_entries` entirely. Its only signal was the generic `orphan_docs` list, which does not identify an invalid or unusable View. This happens because generic kind validation checks required fields/enums/sections but not registration path grammar (`packages/core/src/kinds.ts:670-725`), while `new --no-prefix` intentionally permits a noncanonical id (`packages/cli/src/commands/new.ts:531-535`). The launcher and server consume the same `parseRegistration` predicate, so these accepted documents are not launchable or servable either. The builder's "different gap" boundary therefore leaves a real authoring mistake with no actionable diagnostic, even though the read-side rationale in this change explicitly includes hand-written and externally-authored documents. Add a separate invalid-registration finding (or equivalent) for View/Page-typed documents that fail the core registration predicate, using core-owned grammar rather than reimplementing it, and cover malformed entry plus off-prefix id through the first-party authoring path. This need not conflate invalid registrations with the dangling-blob counter.

2. [P3] [EMPIRICAL] The claimed `--limit` behavior for the new row block is implemented but not regression-pinned. I mutated `const danglingViewEntries = cap(danglingViewEntryRows, limit)` to pass `0` (unlimited) only for this category. All three new dangling-entry tests and the generic `--limit` test still passed (focused run exit 0, 4/4), because the generic limit fixture contains no View registrations (`status.test.ts:916-932`). Add a dangling-entry assertion for `--limit 1` and `--limit 0` so a category-local cap regression is caught.

survived_attacks:
- Replaced the blob-existence branch with an always-false condition. The targeted test failed with exit 1 (`0 !== 2`), so the suite caught loss of dangling detection.
- Skipped registrations whose parsed type was legacy `Page`. The targeted test failed with exit 1 (`1 !== 2`), so the suite caught loss of legacy coverage.
- Suppressed `dangling_view_entries` when the total was zero. The present-at-zero test failed with exit 1 (`undefined !== 0`), so the output-shape contract is pinned.

compatibility_and_remote:
- The exact TOON/JSON byte-identity literals were already present in `HEAD^`; this commit did not introduce or edit them.
- Freshly built HEAD output for `examples/sample-bundle` was byte-identical to the unchanged committed plugin artifact: TOON 174 bytes, SHA-256 `fd3231018f1e1881dc305223554dede2d8764dbb425ebc01e99b5719aab7ecca`; JSON 187 bytes, SHA-256 `4d9dcff38536f2d4c74abcc2e193da1a76014da869fccbd1421a6176d2bdc1c0`.
- A dedicated remote-specific View fixture is not required for this implementation. The local status fixture exercises registration parsing and membership logic; the no-socket wire contracts exercise non-empty prefix-filtered `RemoteBackend.listBlobs` plus cursor/prefix behavior (2 focused tests, exit 0); and the full gate's existing local/remote status parity test passed. The implementation composes those existing backend contracts without remote branching.

repo_conventions:
- Diff is one coherent unit: only `packages/cli/src/commands/status.ts` and `packages/cli/test/status.test.ts`.
- No changes under `plugins/`, `.claude-plugin/`, or `packages/cli/SKILL.md`.
- Commit message contains no `Co-Authored-By` or other AI-attribution trailer.
- Worktree was clean at the exact reviewed SHA after all mutations were restored.

gates:
- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 0

review_environment:
- The project board was not materialized in this isolated worktree. The required join attempt failed with `EPERM` while trying to chmod `/Users/brian/.agentstate`; no divergent local bundle was initialized.

## Round 2 (7a92837) — APPROVE
VERDICT: APPROVE

findings: []

round1_closure:
1. [P2] CLOSED — EMPIRICAL. Re-ran both exact first-party paths against the freshly built `7a92837` CLI with the repository's canonical View convention promoted into a scratch bundle:
   - `new "View" wrong-entry --entry other/missing.html ...` wrote `views-registry/wrong-entry`.
   - `new "View" notes/offpath --no-prefix --entry views/offpath.html ...` wrote `notes/offpath`; `views/offpath.html` existed.
   `status --json` then reported `kind_warnings: 0`, `conformance_debt: 0`, `dangling_view_entries: 0`, and `invalid_view_registrations: 2`, with rows `{id:"notes/offpath",problem:"id"}` and `{id:"views-registry/wrong-entry",problem:"entry"}`. The previously invisible states now have an actionable View-specific signal.
2. [P3] CLOSED — EMPIRICAL. Re-applied the exact round-1 mutation `cap(danglingViewEntryRows, limit)` → `cap(danglingViewEntryRows, 0)`. The new focused limit test failed with exit 1 at `dangling_view_entries_rows: shown respects --limit 1` (`2 !== 1`). Restored the source; the targeted five-test View-surface set and full repository suite passed.

survived_attacks:
- Shared presence gate: an invalid-only View bundle emitted `dangling_view_entries: 0` beside the invalid counter. The new gate cannot hide an old signal because every valid `parseRegistration` result necessarily has a `View`/`Page` type and therefore increments `viewTypedCount`.
- Zero-View output/scoping: a `type: Widget` doc placed at `views-registry/not-view` emitted neither View counter nor either View row block. This is sound: type is the semantic claim, registry-prefix residence alone does not make a View, and the launcher/server likewise query accepted types before applying `parseRegistration`.
- Leg naming: built-CLI/engine scratch cases produced `entry` for valid id + invalid entry, `id` for invalid id + valid entry, `id+entry` when both failed, and `entry` when the field was absent. These are exactly the legs used by core's `parseRegistration`; after the type prefilter, an invalid registration cannot produce an empty problem.
- Byte identity: all three pre-existing byte-identity tests passed in `npm test`. Changing the sample-bundle TOON pin from `docs: 4` to `docs: 5` made the focused test fail with exit 1; the test and tree were restored.
- Limit enforcement: the exact category-local cap mutation failed as above. The restored targeted View-surface tests passed 5/5 with exit 0, including `--limit 1` and `--limit 0` over both row blocks.
- Worktree restoration: `git status --short` was empty and `HEAD` remained `7a92837748d0280d305511fb9c121b509798a0ec` after all probes and gates.

gates:
- `npm run build`: exit 0
- `npm run typecheck`: exit 0
- `npm test`: exit 0
