---
type: Context Note
title: PR 207 exact-SHA review at 9b6b114
actor: codex-pr207-review
timestamp: '2026-08-04T23:27:01Z'
---
# Summary

Reviewed PR 207 at exact head `9b6b114d481a9fbfd447f89e7d302156d969cb95` against base `d058d735ce4f6179ed07d74a7ddbfc38491e7980`.

Verdict: changes requested. The durable npm-prefix launcher and install-authority proof are well tested, but the new shared classifier crosses the intended ownership boundary in two independently reproducible ways:

1. `tokenizeGeneratedHookCommand` treats every JavaScript whitespace character as a token separator, so `aslite\nsession-start` is classified `current` even though a POSIX shell executes it as two commands. The catch-all Node form also accepts bare `node /tmp/agentstate-lite.mjs session-start` as `current`, although the generated PATH-independent form requires an absolute Node runtime. `computeHookUninstall` removes both entries.
2. Once a command is recognized, `classifyHookEntry` treats every wrong location, matcher, type, or timeout as owned `stale`. Reproductions with matcher `tool` and with entry type `prompt` are removed by uninstall, despite not being enumerated generated/historical shapes. The normative design requires the expected timeout/shape and says non-exact hand-authored near-matches are unmanaged.

A separate medium migration gap remains: historical `aslite session-start` hooks are deliberately classified `current`, so `hookNeedsUpdate` is false even when that bare command exits 127 under the minimal GUI PATH this PR addresses. The normative design currently makes the same classification, so this is a design/implementation completeness issue rather than an implementation divergence. Existing affected installs need an upgrade signal distinct from ownership.

Evidence:

- Focused local tests: 69/69 passed (`hook-compatibility`, `hook-reconciliation`, `install-authority`, `session-start`).
- Adversarial pure-function reproductions returned `current`/`stale` and `uninstallChanged: true` for all four cases above.
- An independent ownership skeptic confirmed both high-severity findings and the historical-upgrade gap.
- `git diff --check` passed and the review worktree remained clean.
- GitHub CI passed on Node 20 smoke and Node 22/26 gates; PR head remained exact and merge state was clean.

Recommended repair boundary: enumerate only byte/semantic command grammar and host entry shapes actually emitted historically or currently. Reject CR/LF and other shell separators outside supported quotes, require absolute Node for the PATH-independent Node form, and make unknown matcher/type/location/timeout combinations unmanaged unless individually documented as historical generated output. Add install and uninstall byte-preservation regressions for each counterexample.

Ultimate goal: make agentstate-lite a safe, durable context and coordination substrate across harnesses. Proximate goal: independently verify that PR 207 makes SessionStart hooks durable without gaining mutation authority over foreign configuration; this serves the ultimate goal by keeping upgrade automation trustworthy.
