---
type: Context Note
title: PR207 housekeeping exact review at cf3b8ab
actor: codex-pr207-housekeeping-reviewer
timestamp: '2026-08-05T23:23:17.228Z'
---
# Summary

## Verdict

**FAIL** at exact candidate `cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4`, reviewed against exact base `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071` in a fresh detached worktree.

The structural raw-token lexical-envelope repair is correct: the current writer and recognizer share one safe-unquoted alphabet; unsafe current values must use the exact whole-token POSIX single-quote encoding; the apostrophe splice round-trips; and the only accepted historical double-quoted envelope is one whitespace-triggered JSON-quoted direct executable followed by the exact unquoted `session-start`. Empty-quote injection, partial/mixed segmentation, Unicode escapes, shell-expansion syntax, and double-quoted Node layouts fail closed. The OpenCode preserved-unmanaged uninstall receipt is also correct.

One blocking destructive-ownership counterexample remains in the semantic Node-layout classifier, so adversarial byte-preservation QA is **not** unblocked.

## Blocking finding — a mismatched npm Node/package prefix is claimed as current

`stableNpmRuntimePair` correctly requires a common npm prefix, but the later generic absolute-Node branch accepts every managed executable layout, including `npm`. This command therefore bypasses the same-prefix rule:

```text
/opt/runtime-a/bin/node /opt/npm-b/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start
```

The command and exact generated host entry both classify `current` with reason `recognized generated PATH-independent Node launch`. That shape is not emitted by `buildHookLaunchSpec`: durable npm authority supplies `<prefix>/bin/node` and `<prefix>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs` from the same prefix. The normative protocol likewise enumerates the same-prefix npm Node launch separately from supported local-dev/plugin-cache Node launches.

The false positive reaches every shared lifecycle surface:

- Pure status reports installed/current.
- Pure install reconciliation treats it as owned and rewrites it.
- Pure uninstall removes it while retaining an adjacent `echo keep` entry.
- The freshly built CLI reports Claude, Codex, and a byte-exact OpenCode template carrying this mismatched pair as installed/current.
- Built install overwrites all three seeded foreign configurations; built uninstall rewrites Claude/Codex and deletes OpenCode. Byte-preservation is false for all three hosts.

This violates the exact generated-layout ownership rule and grants mutation authority over a hand-authored npm-looking Node pair that no current or historical writer emitted.

Repair direction: make the generic absolute-Node branch layout-specific. An `npm` executable layout must pass `stableNpmRuntimePair`; only the explicitly supported `local_dev` and `marketplace` layouts may use an independently located absolute Node runtime. Add a pure agreement row and built Claude/Codex/OpenCode install+uninstall byte-preservation regression for mismatched npm prefixes, while retaining positive rows for same-prefix npm and supported local-dev/plugin-cache Node launches.

## Lexical-language checks that pass

- The raw-token parser admits only exact render round-trips: safe unquoted, whole-token current single-quoted (including canonical embedded apostrophes), and the one historical double-quoted direct-executable form.
- Git provenance at `1a7960e` shows the historical writer used `JSON.stringify(base)` only when the direct command base contained whitespace. Independent probes confirmed JSON-exact `\"` and `\\` spellings are valid historical bytes; `$`, backticks, control escapes, alternate POSIX escaping, and a quoted subcommand are not.
- An independent deterministic probe covered 141 writer values across ASCII controls/printables, Unicode, spaces, apostrophes, backslashes, and expansion characters, plus 20 noncanonical hostile envelopes. All expected current/historical forms round-tripped and every hostile form remained unmanaged.
- The reviewed taxonomy covers parameter, command, process/arithmetic-adjacent delimiter syntax, operators, redirects, comments, pathname glob/question/bracket expansion, brace expansion, tilde/history syntax, malformed quotes, escapes, control characters, Unicode, and Node variants. The closed unquoted allowlist rejects every printable ASCII character outside `[A-Za-z0-9_@%+=:,./-]` before semantic classification.
- Current Node writer forms with whole-token single quotes, including apostrophes and literal shell metacharacters, remain recognized. Historical double-quoted Node layouts remain unmanaged.
- Built Claude/Codex uninstall preserves the shell and lexical-envelope foreign matrices byte-identically and removes canonical current/historical forms.
- OpenCode exact-source reconstruction still distinguishes owned source from a marker-bearing authored file. The unmanaged file survives status/install/uninstall byte-identically, and JSON uninstall adds only `hook.notes: ["preserved unmanaged OpenCode plugin: <path>"]`; exact generated source remains removable.

## Evidence

- Exact detached HEAD: `cf3b8abf802dcd3325ba72a91eb95e0cc7bfe9e4`; exact base is its ancestor; `git diff --check` passes. The task record, rather than this no-GitHub review, carries the remote-tip claim.
- Whole range: six files, 488 insertions and 39 deletions; commits `e2a337b`, `c0c2b26`, `f3beae6`, and `6fbe3ae` plus the merge of current main.
- Fresh `npm ci` and root `npm run build` passed.
- Sampled hook compatibility/reconciliation/session-start suite passed 75/75 at the exact SHA. This audits the builder's focused evidence without rerunning the full repository gate.
- Independent lexical/provenance probe passed after correcting one reviewer assumption: escaped quotes/backslashes are valid historical JSON writer output, not hostile alternate envelopes.
- Deterministic pure+built mismatched-prefix probe reproduced the blocking mutation on Claude, Codex, and OpenCode.
- Review worktree remained clean. No source was edited, no full repository gate was run, and no GitHub or sync action was taken.

## Goals and next dependency

Ultimate goal: make agentstate-lite installable and self-orienting without ever claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: prove that the complete reachable hook-command language grants mutation authority only to canonical current writer forms and explicitly enumerated history. This review serves the ultimate goal by stopping a semantic Node-layout false positive before adversarial QA.

Next dependency: Builder repairs npm-vs-local/plugin Node layout discrimination and publishes a new exact SHA; then a fresh exact-SHA re-review must cover the whole language and the new cross-host regression. QA remains blocked on this failed SHA.

[reviews task](../tasks/hook-compatibility-ownership.md)
