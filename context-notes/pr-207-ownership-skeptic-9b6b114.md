---
type: Context Note
title: PR 207 ownership skeptic review at 9b6b114
actor: codex-pr207-ownership-skeptic
timestamp: '2026-08-04T23:27:02.985Z'
---
# Summary

Verdict: **CHANGES REQUESTED** for PR 207 exact head `9b6b114d481a9fbfd447f89e7d302156d969cb95`.

Proximate goal: determine whether hook ownership and durable launch classification fail closed across status, install, uninstall, and historical-upgrade signaling. This serves the ultimate agentstate-lite goal by keeping session-boundary memory reliable without adopting or deleting foreign host configuration.

## Findings

### High — the command tokenizer/classifier owns shell programs and arbitrary paths that the generator did not emit

Empirical. `packages/cli/src/hook-compatibility.ts:51-56` treats every JavaScript `\s` character as interchangeable token whitespace. An unquoted newline is a POSIX shell command separator, not an argv separator, so `aslite\nsession-start` runs two commands but is classified `current`. In addition, `packages/cli/src/hook-compatibility.ts:105-110` and `:170-177` accept any absolute file named `agentstate-lite.mjs` behind any program whose basename is `node`; `node /tmp/agentstate-lite.mjs session-start` is therefore classified `current`. The direct-executable branch likewise classifies `/tmp/foreign/agentstate-lite.mjs session-start` as owned `legacy_path_bound`.

This conflicts with the normative design's exact generated-compatible semantic-shape boundary, its requirement to reject control operators and foreign near-matches, and its enumeration of known generated absolute/plugin-cache forms. Because `computeHookUninstall` removes every owned classification at `packages/cli/src/commands/hook.ts:283-300`, an explicit uninstall deletes these foreign entries; install may adopt/rewrite them through the same authority.

Repro from the exact worktree:

```text
classifyHookCommand("aslite\nsession-start")
=> { state: "current", reason: "recognized historical generated bare-bin session-start command" }

classifyHookCommand("node /tmp/agentstate-lite.mjs session-start")
=> { state: "current", reason: "recognized generated PATH-independent Node launch" }

classifyHookCommand("/tmp/foreign/agentstate-lite.mjs session-start")
=> { state: "legacy_path_bound", ... }
```

Required direction: reject unquoted newlines/control syntax and constrain absolute-path compatibility to the enumerated generated layouts/forms rather than basename alone. Add install and uninstall byte-preservation rows for both cases.

### High — every non-current matcher/type/timeout is promoted to stale-owned and then deleted

Empirical. After command recognition, `packages/cli/src/hook-compatibility.ts:183-197` maps any matcher other than `""`, any type other than `"command"`, and any timeout other than `10` to `stale`. `isOwnedHookCompatibility` at `:199-201` then treats all such entries as owned. This does not distinguish enumerated historical shapes from arbitrary hand-authored near-matches. The test at `packages/cli/test/hook-compatibility.test.ts:56-78` explicitly locks this over-broad behavior in, including `type: "prompt"` and matcher `"tool"`.

The normative design says non-exact/near-match hand-authored forms are `unmanaged`; only exact historically generated old shapes/timeouts may be `stale`. `computeHookUninstall` at `packages/cli/src/commands/hook.ts:291` therefore deletes foreign entries, and install can move/rewrite them.

Exact-worktree repro: each of these entries classified `stale`, `changed` was `true`, and the returned `SessionStart` array was empty after `computeHookUninstall`:

```text
{ matcher: "startup", type: "command", command: "aslite session-start", timeout: 10 }
{ matcher: "", type: "prompt", command: "aslite session-start", timeout: 10 }
{ matcher: "", type: "command", command: "aslite session-start", timeout: 86400 }
```

Required direction: enumerate the exact historical host shapes and timeout values. Anything else must remain `unmanaged` and byte-preserved by install/uninstall.

### Medium — pre-PR bare hooks remain PATH-dependent but are reported current with no upgrade signal

Empirical. The pre-PR installer normally emitted `aslite session-start` (or the legacy alias) when the bin was on the installer's PATH. `packages/cli/src/hook-compatibility.ts:144-146` labels that historical form `current`, and `hookNeedsUpdate` only signals installed states other than current at `packages/cli/src/commands/hook.ts:791-799`.

Exact-worktree fixture result:

```text
status.compatibility.state: current
status.command: aslite session-start
hookNeedsUpdate([fixture]): false
```

Yet the actual historical command under the reproduced GUI environment fails:

```text
env -i PATH=/usr/bin:/bin /bin/sh -c 'aslite session-start'
=> /bin/sh: aslite: command not found
=> exit 127
```

The normative table currently also labels this form `current` with no remedy, so this is a design/implementation migration gap: new installs are durable, but the affected installed base is told it is current and receives no prompt to run the explicit convergence step. The compatibility or the separate upgrade signal must distinguish "supported historical ownership" from "durable current launch".

## Verification and limits

- Confirmed worktree HEAD: `9b6b114d481a9fbfd447f89e7d302156d969cb95`; worktree was clean before review.
- Focused command: `node --test --import ./packages/cli/test/ts-loader.mjs packages/cli/test/hook-compatibility.test.ts packages/cli/test/hook-reconciliation.test.ts packages/cli/test/install-authority.test.ts` — 13/13 passed. This does not clear the findings; one test positively asserts the over-broad shape ownership.
- Ran pure temp-fixture repros only. No source edits, GitHub comments, board sync, product-task mutations, or host-global installation/config mutation.
- Did not rerun the full repository/package gate. Durable npm-prefix authority was statically inspected and its focused tests passed; no additional authority/path finding survived beyond the historical migration signal above.

## Survived attacks

- Marker-only and ordinary substring OpenCode lookalikes are preserved by byte-exact source comparison.
- `npm exec`/npx cache evidence, unsupported platform, missing prefix/runtime, PATH shadowing, and mismatched prefix Node fail closed in the focused authority suite.
- Properly generated current entries share one classifier across status/install/uninstall; malformed JSON install paths refuse writes.
