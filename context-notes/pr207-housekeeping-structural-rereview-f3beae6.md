---
type: Context Note
title: PR207 housekeeping structural re-review at f3beae6
actor: codex-pr207-housekeeping-exact-review
timestamp: '2026-08-05T21:34:28.673Z'
---
# Summary

## Verdict

**FAIL** at exact structural-repair SHA `f3beae6dad93de9acbee3bfcfdae54ab150c6a86`, with failed SHA `c0c2b26f19827750f54a320bd6796df641ee7353` as the repair delta and original base `164ba7edb89c31678856020ee794f80530e6c276` as context.

The shared closed unquoted alphabet is correct, but the recognizer still accepts quote envelopes that neither the current writer nor the historical writer emitted. Shell quote removal and concatenation turn those foreign strings into owned argv, and uninstall deletes them.

## Blocking finding — recognizer quote language remains broader than writer history

The current writer emits either one wholly unquoted safe token or one whole-token POSIX single-quoted argument (with only the writer's apostrophe splice). The historical writer used one whole-token JSON double quote when its executable contained whitespace. Neither writer emits empty quote injection or arbitrary partial quote segmentation.

These foreign forms nevertheless classify `legacy_path_bound` and are removed:

```
a''slite session-start
a""slite session-start
aslite s''ession-start
'/tmp/x'/packages/cli/dist/agentstate-lite.mjs session-start
"/tmp/x"/packages/cli/dist/agentstate-lite.mjs session-start
```

The equivalent partially quoted same-prefix Node pair classifies `current` and is also removed:

```
'/opt/x'/bin/node '/opt/x'/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start
```

`/bin/sh` empirically produced `aslite | session-start` for both empty-quote forms and the exact managed direct path plus `session-start` for both partial-quote forms. Pure uninstall reported `changed:true`; a freshly built CLI removed all four seeded direct/bare entries from scratch settings and preserved only the adjacent `echo keep` hook.

This violates the system model's requirement that the tokenizer recognize only strings a current or explicitly enumerated historical writer could have emitted. Decoded argv equality is necessary but is not generated provenance.

Repair direction: define and parse exact token envelopes, not arbitrary POSIX quote concatenation. Accept a whole safe unquoted token, the exact current whole-token single-quote/apostrophe-splice encoding, and the explicitly supported historical whole-token double-quote encoding. Reject empty quote segments and partial mixed quoted/unquoted tokens outside the apostrophe splice.

## Structural checks that pass

- `isSafeUnquotedHookToken` is one shared writer/recognizer predicate over `[A-Za-z0-9_@%+=:,./-]+`.
- The printable-ASCII boundary test proves every character outside that alphabet fails closed when unquoted; space, Unicode, newline, and tab are separately rejected.
- Current writer round-trips the printable alphabet, apostrophes, backslashes, Unicode, spaces, expansion syntax, and representative same-prefix Node pairs.
- The 26-case taxonomy covers parameter/command/arithmetic expansion, operators/redirection, comments, pathname/brace/tilde/history expansion, malformed quotes, escapes, Unicode, and Node variants.
- Built uninstall preserves that taxonomy byte-for-byte in both Claude and Codex settings.
- The Unicode `"\\u0061slite"` near-match remains unmanaged.
- The unmanaged OpenCode source remains byte-preserved and its additive receipt note remains exact.
- Additional assignment-prefix and `command`/`exec` wrapper attacks remain unmanaged and survive pure uninstall, showing those two non-taxonomy transformation categories fail closed.

## Evidence

- Remote branch resolved exactly to `f3beae6dad93de9acbee3bfcfdae54ab150c6a86`; ancestry from both named prior SHAs and `git diff --check` passed.
- Structural repair delta is five files; the whole housekeeping range is six files.
- Fresh detached worktree, `npm ci`, and root build passed.
- Focused hook/authority/session-start suite passed 75/75.
- A local full-check audit was started with redirected output but intentionally stopped at the orchestrator's request once the deterministic destructive counterexample returned the unit to Builder. The Builder's full-check claim is not contradicted, but it is not independently promoted by this failed review.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without ever claiming or deleting host configuration it did not generate.

Proximate goal: prove that destructive hook ownership is bounded by the exact current and historical writer languages. This serves the ultimate goal by making uninstall authority provenance-based rather than a resemblance heuristic.

[reviews task](../tasks/hook-compatibility-ownership.md)
