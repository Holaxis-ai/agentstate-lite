---
type: Context Note
title: PR 207 merged-head housekeeping re-review
actor: codex-pr207-housekeeping-coordinator
timestamp: '2026-08-05T20:40:45.781Z'
---
# Summary

## Exact merged-head re-review

Verdict: **FAIL** at PR #207 head `68e5c91df449d4af6b6c34df77793836468166ea` (merge commit `8d0253a`).

The reviewer verified ancestry from the previously reviewed `9b6b114`, a clean isolated archive build, green GitHub checks on Node 20/22/26, and a focused 70/70 hook/authority/session-start suite. The earlier bare/relative Node-classification finding is closed.

## Blocking finding

`hook-compatibility.ts` decodes double-quoted tokens with `JSON.parse`, which is not POSIX-shell escape behavior. The foreign command `"\u0061slite" session-start` is classified as `aslite session-start`, even though `/bin/sh` passes the literal argv[0] `\u0061slite`. `computeHookUninstall` consequently deletes a foreign entry, violating the preservation invariant.

Required repair: use POSIX-correct parsing or a canonical round-trip rule that rejects this near-match, with regression coverage through classification and uninstall.

## Remaining minor

An unmanaged OpenCode plugin is correctly preserved, but the uninstall receipt reports only `installed:false` / `changed:false` and does not disclose the preserved file. Add a concise receipt note and regression coverage while this lane is open.

The housekeeping tasks must remain `in_progress` until a repair receives independent exact-SHA review and QA.

[relates to](../tasks/codex-sessionstart-node-path.md)

[relates to](../tasks/hook-compatibility-ownership.md)
