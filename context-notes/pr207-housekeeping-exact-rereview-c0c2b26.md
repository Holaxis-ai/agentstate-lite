---
type: Context Note
title: PR207 housekeeping exact re-review at c0c2b26
actor: codex-pr207-housekeeping-exact-review
timestamp: '2026-08-05T21:14:19.391Z'
---
# Summary

## Verdict

**FAIL** at exact repair SHA `c0c2b26f19827750f54a320bd6796df641ee7353`, with failed SHA `e2a337bd3e0992df5655dc916df08c7425989910` as the repair delta and original base `164ba7edb89c31678856020ee794f80530e6c276`.

The requested POSIX pathname-expansion repair is correct for unquoted `*`, `?`, `[`, and `]`, but an additional shell-expansion near-match remains inside uninstall authority: unquoted brace expansion.

## Blocking finding — unquoted brace expansion is still owned and removed

Both of these foreign command strings are classified owned:

```
/tmp/{a,b}/packages/cli/dist/agentstate-lite.mjs session-start
/opt/{a,b}/bin/node /opt/{a,b}/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start
```

The direct form reports `legacy_path_bound`; the absolute-Node form reports `current`. On this machine, `/bin/sh`, Bash, and zsh expand `{real,other}` into multiple argv entries, so neither string names one exact literal generated executable token. `computeHookUninstall` removed both forms. A scratch settings file exercised through the freshly built CLI also reported `changed:true` and deleted the brace form while preserving an adjacent `echo keep` entry.

This violates the exact generated-compatible semantic ownership and foreign-preservation invariants. The tokenizer's stated boundary is a deliberately small POSIX-shell subset; accepting a widely implemented non-POSIX expansion also makes host behavior shell-dependent.

Repair direction: reject unquoted `{` and `}` (and cover direct plus absolute-Node forms) while retaining quoted literal brace paths if those are intentionally supported by the writer/recognizer contract. Add classification and built-uninstall byte-preservation tests.

## Requested repair checks that pass

- Unquoted `*`, `?`, and bracket-expression direct-executable forms classify `unmanaged`.
- The same three families in absolute-Node launch forms classify `unmanaged`.
- Built uninstall preserves all six named forms byte-for-byte in both Claude and Codex settings and reports `changed:false`.
- Quoted literal `*`, `?`, and bracket-expression direct paths remain recognized; a quoted same-prefix wildcard Node pair remains `current`.
- The `"\\u0061slite"` Unicode near-match remains unmanaged.
- The unmanaged OpenCode plugin is preserved byte-for-byte and the additive uninstall `hook.notes` receipt remains exact.

## Evidence

- Remote branch resolved exactly to `c0c2b26f19827750f54a320bd6796df641ee7353`; ancestry from both named prior SHAs and `git diff --check` passed.
- Repair delta is limited to three files: tokenizer source and two focused test files. Whole housekeeping range remains five files.
- Fresh detached worktree, `npm ci`, and root build passed.
- Focused hook/authority/session-start suite passed 71/71.
- A local `npm run check` audit was started with redirected output but intentionally not awaited to completion after the deterministic destructive finding returned the unit to repair; the builder's full-check claim is therefore neither contradicted nor independently promoted here.

## Goals

Ultimate goal: make agentstate-lite a safe, durable shared memory and coordination substrate across agent harnesses.

Proximate goal: prove that the PR207 housekeeping repair cannot acquire mutation authority over shell-expanding foreign hook configuration. This serves the ultimate goal by keeping automatic configuration cleanup fail-closed and trustworthy.

[reviews task](../tasks/hook-compatibility-ownership.md)
