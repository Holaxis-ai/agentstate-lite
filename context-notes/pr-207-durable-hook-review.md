---
type: Context Note
title: >-
  Review of PR #207 at 9b6b114 — approved; ownership tightening verified
  empirically; 2 minor findings
actor: claude/reviewer
timestamp: '2026-08-04T23:25:08.185Z'
---
# Summary

Independent review of PR #207 (`feat/durable-npm-hook-install`) at exact SHA
`9b6b114d481a9fbfd447f89e7d302156d969cb95`. APPROVED — two minor non-blocking findings.
This is the hook-install follow-up flagged in [[pr-205-skill-compatibility-review]]; it closes
that gap the right way (same authority primitive, extended with a stable-runtime proof).

CI green on the exact SHA (gate node 22/26 + engines smoke). Verified in an isolated worktree at
the SHA: focused hook/authority/session-start suites 69/69, plus adversarial probes below.

# Empirical verification

- Ownership boundary probe (classifier): all ten hostile near-matches stay unmanaged, including
  `my-backup --tool agentstate-lite`, `echo agentstate-lite`, `npx -y some-other-tool
  agentstate-lite` (all three CLAIMED by the old substring rule), plus command-chained forms
  (`&& rm -rf ~`, `; curl evil`) rejected by the deliberately small tokenizer grammar. All
  historical generated forms classify owned with the right state.
- End-to-end GUI-PATH proof: installed the hook via the built CLI, executed the written command
  with `env -i PATH=/usr/bin:/bin` — exit 0, home render produced. The PR's headline claim holds.
- Foreign-hook preservation: a foreign SessionStart entry containing the marker substring
  SURVIVED uninstall while the managed entry was removed (old code would have deleted it).
- OpenCode exact-source ownership: an edit that only changes a generated CONSTANT (timeout) still
  reconstructs byte-exact -> correctly owned/stale; a LOGIC edit fails reconstruction ->
  unmanaged: uninstall preserves the file, status reports unmanaged, reinstall refuses loudly
  (exit 1, structured refusal).

# Findings (minor, non-blocking)

## N1 — generic node-launch rule classifies PATH/cwd-dependent commands as "current"

`classifyHookCommand`'s last owned rule requires only `basename(tokens[0]) === "node"` — probe
confirmed `node /abs/.../agentstate-lite.mjs session-start` AND `./node /tmp/agentstate-lite.mjs
session-start` classify `current`. Neither is PATH-independent, so `hookNeedsUpdate` will never
prompt a re-install for them, and "current" mislabels exactly the fragility this PR fixes. No
shipped generator emits these forms (local-dev uses absolute `process.execPath`), so only
hand-authored commands hit it. Fix direction: require `isAbsolute(tokens[0])`; a bare/relative
`node` form should be at most `stale`.

## N2 — uninstall receipt omits a preserved unmanaged plugin

Uninstall over a logic-edited (unmanaged) OpenCode plugin correctly preserves the file, but the
receipt reports only `installed:false, changed:...` without naming the preserved file. Status
reports it honestly and reinstall refuses loudly, so the gap is narrow — a one-line receipt note
would close it.

# Notes

- The Volta/asdf shim refusal from the #205 review now applies to hooks too, and the new
  stable-runtime check adds one more refusal axis (running node != prefix/bin/node). Fail-closed
  and correct for v1; expect the same class of support reports.
- CLAUDE.md gate-1 hook bullet updated to match the new truth — the guide's code-wins discipline
  honored in the same unit.
- The npm-package proof now models the POSIX global layout (prefix/bin/node symlink +
  npm_config_prefix) so the durable authority is exercised in the installed-tarball proof, not
  just unit fixtures.

Worktree removed after review; probes cleaned up.

[reviews](../tasks/pr-207-exact-sha-review.md)

[reviews](../tasks/hook-compatibility-ownership.md)
