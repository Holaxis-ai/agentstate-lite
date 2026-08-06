---
type: Context Note
title: PR207 housekeeping exact re-review at 4e394db
actor: codex-pr207-housekeeping-reviewer
timestamp: '2026-08-06T00:02:59.324Z'
---
# Summary

## Verdict

**PASS** at exact repaired PR #210 head `4e394db65346d957676e590d7ca287d20b39dafb`, reviewed in a fresh detached worktree with failed predecessor `cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4` as the repair delta.

The cross-prefix npm Node/package false positive is closed at the owning classifier and through every host lifecycle consumer. No new finding survived the repair-delta, structural, lexical-regression, or OpenCode receipt review.

Adversarial install/uninstall byte-preservation QA is **unblocked for exact SHA `4e394db65346d957676e590d7ca287d20b39dafb` only**. Any source change requires a new exact-SHA review before QA.

## Prior blocking case is closed

The prior counterexample now classifies `unmanaged` as both a command and exact host entry:

```text
/opt/runtime-a/bin/node /opt/npm-b/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start
```

Independent pure and freshly built probes established:

- Pure status reports absent/unmanaged rather than installed/current.
- Pure install reconciliation preserves the foreign entry and appends a managed entry when none exists; with an already-current managed control present, no Claude/Codex rewrite is needed.
- Pure uninstall returns `changed:false` and the original settings object.
- Built status reports Claude, Codex, and the exact-template OpenCode file as unmanaged.
- Built install with an already-current control preserves Claude, Codex, and OpenCode bytes exactly, then refuses the unmanaged OpenCode target as designed.
- Built uninstall returns `changed:false`, preserves all three host files byte-identically, and reports the preserved unmanaged OpenCode path in `hook.notes`.

The old exact SHA was used as a red probe: the same `unmanaged` assertion fails there with actual state `current`; it passes at `4e394db`.

## Structural review

The repair is one owning-classifier change, not a consumer patch:

1. `stableNpmRuntimePair` remains the only current npm Node/package branch and requires the exact common prefix before `/bin/node` and `/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`.
2. The later generic absolute-Node branch computes the executable layout once and admits only `local_dev` or `marketplace`.
3. An npm-shaped entry that fails `stableNpmRuntimePair` has no fallback and reaches `unmanaged`.
4. Status, install reconciliation/deduplication, uninstall, update prompting, and OpenCode exact-source reconstruction continue to consume the shared classifier.

The semantic matrix retains both same-prefix npm variants and independently located local-dev, Codex/Claude plugin-cache, and repository marketplace launches as current. Cross-prefix npm permutations and the historical unscoped npm package inside a Node pair remain unmanaged. Historical direct executable, bare-bin, legacy npx, and pre-session-start forms remain owned with their previous compatibility states.

## Lexical and OpenCode regression audit

- The closed safe-unquoted alphabet and exact raw-token round-trip remain unchanged.
- Whole-token current single quoting, canonical embedded apostrophes, and the one provenance-backed historical JSON double-quoted direct executable still round-trip.
- Empty quotes, partial/mixed quote segmentation, Unicode escapes, glob/question/bracket/brace syntax, tilde/history syntax, parameter/command/arithmetic expansion, operators, redirects, controls, and historical double-quoted Node layouts remain unmanaged.
- An independent deterministic lexical probe passed 141 writer values and 20 hostile forms.
- Built samples preserved the noncanonical lexical matrix and shell-expansion taxonomy byte-identically and still removed canonical current/historical forms.
- The marker-bearing authored OpenCode fixture remains unmanaged through status/install/uninstall, its bytes remain exact, and the additive uninstall note remains truthful. Exact generated OpenCode source remains owned.

## Evidence

- Detached HEAD is exactly `4e394db65346d957676e590d7ca287d20b39dafb`; failed predecessor ancestry and `git diff --check` pass.
- Repair delta is five files, 185 insertions and one deletion; the runtime change is three lines in the shared classifier.
- Fresh `npm ci` and root `npm run build` passed.
- Source-focused hook compatibility/reconciliation suite passed 17/17.
- A sampled built/session-start subset passed 5/5: writer round-trip, noncanonical preservation, canonical convergence, shell taxonomy preservation, and the cross-host mismatched-pair repair.
- Independent pure+built cross-prefix reproduction passed across status/install/uninstall and Claude/Codex/OpenCode; both built install and uninstall preservation maps were true for all hosts.
- The predecessor-vs-repair red probe failed at `cf3b8ab` with `current` and passed at `4e394db` with `unmanaged`.
- The builder's 81/81 focused claim is consistent with the reviewed test topology and sampled evidence; this reviewer did not rerun the entire focused battery or the full repository gate.
- Review worktree remained clean. No source was edited, no GitHub action was taken, and the bundle was not synced.

## Goals and next dependency

Ultimate goal: make agentstate-lite installable and self-orienting without ever claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal achieved: the repaired semantic classifier now requires generated npm runtime/package provenance after lexical provenance and retains only the enumerated local-dev/marketplace alternatives.

Next dependency: adversarial install/uninstall byte-preservation QA at exact SHA `4e394db65346d957676e590d7ca287d20b39dafb`, followed by the repository gate if QA passes.

[reviews task](../tasks/hook-compatibility-ownership.md)
