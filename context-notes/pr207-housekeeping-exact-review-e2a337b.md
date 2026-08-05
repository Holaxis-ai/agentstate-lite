---
type: Context Note
title: PR207 housekeeping exact review at e2a337b
actor: codex-pr207-housekeeping-exact-review
timestamp: '2026-08-05T21:00:19.321Z'
---
# Summary

## Verdict

**FAIL** at exact repair SHA `e2a337bd3e0992df5655dc916df08c7425989910`, reviewed against exact base `164ba7edb89c31678856020ee794f80530e6c276` from remote branch `fix/pr207-hook-ownership-housekeeping`.

The repair correctly closes the reported JSON-vs-POSIX double-quote bug and adds a truthful, additive uninstall receipt for a preserved unmanaged OpenCode plugin. One blocking destructive-ownership counterexample remains, so the task must return to repair before adversarial QA.

## Blocking finding — unquoted pathname expansion is claimed as owned

`tokenizeGeneratedHookCommand` still accepts unquoted POSIX pathname-expansion syntax (`*`, `?`, and bracket expressions). `managedExecutableLayout` then recognizes those token strings solely by their suffix. For example:

```
/private/tmp/aslite-glob-probe/*/packages/cli/dist/agentstate-lite.mjs session-start
```

classifies `legacy_path_bound`. With a matching directory present, `/bin/sh` expands that argv[0] to `/private/tmp/aslite-glob-probe/real/packages/cli/dist/agentstate-lite.mjs`; the classifier therefore did not parse an exact literal executable token. Both `computeHookUninstall` and the freshly built CLI removed this foreign entry (`changed:true`), while preserving an adjacent `echo keep` hook. Equivalent `?`, `[ab]`, and Node-launch wildcard forms are also classified owned and removed.

This violates the normative exact semantic ownership rule and the foreign byte-preservation invariant. It also contradicts the tokenizer test's claim that shell behavior is rejected.

Repair direction: preserve quote provenance and reject unquoted pathname-expansion tokens, or conservatively reject glob metacharacters everywhere and fail closed on exotic literal paths. Add classifier and end-to-end uninstall preservation regressions for `*`, `?`, and bracket expressions, while retaining writer/recognizer coverage for supported quoted historical/current paths.

## Closed prior findings

- `"\\u0061slite" session-start` now tokenizes to a literal `\\u0061slite` executable, classifies `unmanaged`, and remains outside uninstall authority. The double-quote parser correctly consumes backslashes only before `$`, backtick, `"`, and backslash; other backslashes remain literal.
- An exact-source mismatch in the OpenCode plugin is still byte-preserved, and JSON uninstall output now adds `hook.notes: ["preserved unmanaged OpenCode plugin: <path>"]`. Existing top-level receipt fields remain unchanged; the field is omitted when there is no note.

## Evidence

- Remote branch resolved exactly to `e2a337bd3e0992df5655dc916df08c7425989910`; base ancestry and `git diff --check` passed.
- Diff scope is four files: the hook parser, uninstall receipt, and their two focused test files.
- Clean detached worktree; root `npm ci` and `npm run build` passed.
- Focused hook/authority/session-start suite passed 70/70.
- The commit currently has no GitHub check runs, so no exact-SHA CI claim is made.
- Deterministic pure-function probes and a built-CLI scratch uninstall reproduced the glob deletion.

## Goals

Ultimate goal: make agentstate-lite a safe, durable shared memory and coordination substrate across agent harnesses.

Proximate goal: prove that the PR207 housekeeping repair cannot acquire mutation authority over foreign hook configuration. This review serves the ultimate goal by keeping automated hook upgrades trustworthy.

[reviews task](../tasks/hook-compatibility-ownership.md)
