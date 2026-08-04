---
type: Context Note
title: Revision 3 R0 live rail skeptic review r6
actor: codex-precompact-v3-r0-live-rail-skeptic-r6
timestamp: '2026-08-04T17:21:23.485Z'
---
# Summary

Verdict: **FAIL** (confidence 1.00). **LIVE execution authorization: NO.** The claimed R0 structural repair is not ready for live Claude compaction testing.

Concrete blockers:

1. The installed PreCompact command cannot support a positive run. `isolated-settings.json` points PreCompact at `.r0-live/precompact/manifest.json`, but `r0-run-case.mjs` only writes `.r0-live/<case>/manifest.json`, and no documented command creates the fixed PreCompact or SessionStart manifests. More fundamentally, the runner has no `positive-precompact` mode: its positive modes fabricate SessionStart injection, while `negative-precompact` makes the hook block. A positive manual or automatic compaction therefore has no prepared PreCompact pass-through case.
2. The isolation procedure is prose, not an executable safe installation/restore mechanism. Copying the fixture into a temporary `CLAUDE_CONFIG_DIR` replaces settings rather than merging/preserving foreign hooks, and the runbook supplies no byte-for-byte backup, merge, verification, or restore commands.
3. The settings hook commands are cwd-dependent (`node scripts/...` and `.r0-live/...`). The runbook names `/Users/brian/.local/bin/claude` but provides no exact invocation vector, version/digest evidence, or enforced repository cwd. This is not the reviewed, reproducible path required for LIVE authorization.
4. Raw/stdout evidence requirements are unimplemented. `r0-inert-hook.mjs` reads stdin and emits a response, but it does not capture the raw input/output bytes while preserving the sole stdout response to Claude. `r0-rail-collector.mjs` is a STATIC manifest generator; its exported `verdict` is not called and merely checks that several fields are strings and stdout is nonempty. There is no live collector/adjudicator proving sentinel presence, ordering, schema acceptance, effects, or artifact digests.
5. STATIC remains able to produce LIVE-shaped evidence. `r0-run-case.mjs` is labeled STATIC but writes `mode: "LIVE"` manifests/evidence beneath `.r0-live/`. Labels in comments/runbook do not make STATIC artifacts mechanically ineligible for LIVE adjudication.
6. The claimed cleanup is false in the reviewed worktree: `.r0-live/` is present and untracked (`git status --short` shows `?? .r0-live/`).
7. The six targeted tests do not close these blockers. They do not exercise the settings fixture, positive PreCompact pass-through, fixed manifest preparation, foreign-hook preservation/restore, raw stdout capture, STATIC/LIVE provenance enforcement, stale artifact rejection, or the four-case live matrix. The existing positive tests use fabricated SessionStart events; the purported mismatch test only checks that the negative-session output contains its sentinel.

What survived this review: the settings fixture now has distinct PreCompact and SessionStart command entries, and the runbook states the intended isolation, reviewed Claude path, raw evidence, and STATIC/LIVE rules. Those are useful design declarations, but the load-bearing mechanisms remain absent.

Exact reviewed SHA-256 values:

- `packages/cli/test/fixtures/r0/isolated-settings.json`: `75ab7af4eca31dc60b5eb150b2fc9ffc57d40da900cca6d587a98f9218a64ee9`
- `scripts/r0-run-case.mjs`: `ef0c6ce2524c278b46046ecbf50742898bf4cd97c362828cb4a6b98b597f0f2e`
- `scripts/r0-inert-hook.mjs`: `0abed1959b9a3e6eb3b4fc64028e20d5e81a9201f0a33dac57f8a22b8a3a4621`
- `scripts/r0-rail-collector.mjs`: `1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0`
- `packages/cli/test/r0-collector.test.ts`: `e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe`
- `packages/cli/test/r0-live-rail.test.ts`: `384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8`
- `packages/cli/test/support/r0-live-rail.ts`: `87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd`
- `docs/r0-live-rail-runbook.md`: `44a488af7fc00122cecea011cf12adfdd6a74e01f19ef68c631e52656c77bafe`

No code or test files were edited by this review.
