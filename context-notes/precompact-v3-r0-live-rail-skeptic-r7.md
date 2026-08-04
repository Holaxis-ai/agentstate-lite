---
type: Context Note
title: Revision 3 R0 live rail skeptic review r7
actor: codex-precompact-v3-r0-live-rail-skeptic-r7
timestamp: '2026-08-04T17:28:19.264Z'
---
# Summary

Verdict: **FAIL** (confidence 1.00). **LIVE execution authorization: NO.** The R0 r6 bytes do not provide a valid or reproducible live compaction rail.

Concrete blockers:

1. The prepared positive PreCompact path emits the wrong event response. `scripts/r0-prepare.mjs` creates a PreCompact manifest with no `case_mode`. `scripts/r0-inert-hook.mjs` therefore takes its default branch and emits `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"<sentinel>"}}` for a valid `PreCompact/manual` input. An exact subprocess probe confirmed exit 0 with that stdout. This is neither a positive PreCompact pass-through nor a negative PreCompact block and can itself produce the schema failure R0 is supposed to eliminate.
2. The preparer and settings paths are not actually coupled. The preparer accepts any `<private-root>` and writes `<private-root>/{precompact,sessionstart}/manifest.json`; the settings fixture always reads repository-relative `.r0-live/{precompact,sessionstart}/manifest.json`. The runbook's claim that the preparer creates exactly the paths referenced by settings is false unless the operator supplies precisely `.r0-live` and launches Claude at precisely the repository cwd.
3. The settings installation and restoration rail remains prose-only. There is no executable backup/merge/verification/restore helper, no byte-for-byte restoration check, and no foreign-hook preservation test. Copying the isolated fixture as stated would overwrite rather than preserve an existing settings document.
4. The reviewed invocation is not exact. Hook commands use PATH-selected `node` and cwd-relative script/manifest paths. The runbook merely tells the operator to verify cwd and `/Users/brian/.local/bin/claude` version/SHA-256; it neither records nor enforces those values or supplies an exact command vector.
5. Required raw evidence and adjudication are absent. Neither hook nor preparer records raw stdin/stdout/stderr while preserving Claude's sole stdout response. `scripts/r0-rail-collector.mjs` remains a STATIC manifest generator; its exported `verdict` is never invoked and only checks string types plus nonempty stdout. Nothing enforces sentinel provenance, event order, schema acceptance, observed compaction/suppression effects, executable/settings/source digests, or stale-artifact rejection.
6. The STATIC/LIVE boundary is a comment and a manifest label, not a mechanical authorization boundary. STATIC hook/runner artifacts can contain the same sentinel and response shape that the runbook would treat as live evidence, and no live adjudicator exists to reject them. The hook deliberately accepts both `STATIC` and `LIVE`. `.r0-live/` also remains present and untracked with STATIC evidence in the candidate evidence namespace.
7. The reported `6/6` is cwd-dependent and is not the repository's package-test result. The targeted command passes 6/6 only when launched from repository root with `--import ./packages/cli/test/ts-loader.mjs`. From `packages/cli`, which is the cwd used by the package's `npm test` script, the same six tests produce 4 pass / 2 fail because `path.resolve("scripts/...")` resolves nonexistent `packages/cli/scripts/*`. In either cwd, the tests do not exercise the settings fixture, preparer, positive PreCompact response, settings preservation, raw capture, live adjudication, stale evidence, or actual Claude compaction. The test titled as rejecting a manifest/event mismatch still performs no mismatch assertion.
8. The intended four-case live matrix is not executable from these bytes. The preparer creates only one manual PreCompact manifest and one compact SessionStart manifest, with no automatic PreCompact case, no negative mode selection, no per-case evidence isolation, and no mechanism to correlate the same real session/transcript/cwd across event receipts.

What survived: the new preparer creates distinct manifest files with fresh 256-bit sentinels and restrictive file modes; the runner now labels its synthetic artifacts `STATIC`; the settings fixture has distinct PreCompact and SessionStart entries; and the targeted tests can report 6/6 under the special repository-root invocation. These do not satisfy LIVE authorization.

Exact reviewed SHA-256 values:

- `scripts/r0-prepare.mjs`: `5d249b6aed7aec5623589021ca6cacf1d02203ddfcb76a0dd7e25f6f9e9be9ad`
- `packages/cli/test/fixtures/r0/isolated-settings.json`: `75ab7af4eca31dc60b5eb150b2fc9ffc57d40da900cca6d587a98f9218a64ee9`
- `scripts/r0-inert-hook.mjs`: `9e1c3f60f37baf4332d10ce417baa89b593d80ab3be955420e567e25835d70d0`
- `scripts/r0-run-case.mjs`: `540f6cb86cba246712daabed690b23f1e662cc33abf539781e1c08733636a3d0`
- `scripts/r0-rail-collector.mjs`: `1321cb15782d837cbfc60878f72f8082f3d8188b5d80881c4ced6ff274cf0fa0`
- `docs/r0-live-rail-runbook.md`: `8253f9cb4a6c436ab4fbe5fc29784e096477d0914a78766d11aa3884aa661725`
- `packages/cli/test/r0-collector.test.ts`: `e33f6fd1cc73cb2ba18a67064355d3cd12afb219e10aa6cb020698a27d6fd2fe`
- `packages/cli/test/r0-live-rail.test.ts`: `384cee8c6eaa0f488735a5ba59b71d5bf837532d6e49acd6fb0150789f0a53d8`
- `packages/cli/test/support/r0-live-rail.ts`: `87bab4514bfd90ab1596dcada5ecba39fe5dbe971b042c433a24aad54d4fdafd`

Executed evidence:

- Repository-root targeted command: 6 tests, 6 pass, 0 fail.
- CLI-package-cwd targeted command: 6 tests, 4 pass, 2 fail (`MODULE_NOT_FOUND` for `packages/cli/scripts/r0-rail-collector.mjs` and `packages/cli/scripts/r0-run-case.mjs`).
- Exact prepared-hook probe: PreCompact/manual returned a SessionStart `hookSpecificOutput` response with the prepared sentinel; SessionStart/compact returned the same shape as expected.

The review made no code or test edits. The single `.r0-live` directory created by the repository-root test was removed, restoring the pre-review candidate artifact set.
