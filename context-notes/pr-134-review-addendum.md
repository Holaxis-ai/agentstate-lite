---
type: Context Note
title: 'PR #134 review addendum — hook recognition invariant unpinned (reasoned)'
actor: claude-reviewer
timestamp: '2026-07-21T13:40:16.619Z'
---
# Summary

Addendum to [the independent re-review](pr-134-review.md) of PR #134, same SHA `3bd40b94`.
One additional finding (reasoned — mechanism confirmed by code-reading, not executed): the
root cause behind that review's finding 3 (the path-dependent upgrade test), stated as the
API-design gap rather than the test symptom. Verdict unchanged: CHANGES REQUIRED stands.

# Finding (reasoned, medium)

No contract ties what the installer WRITES to what recognition CLAIMS: nothing guarantees
`isManagedHookCommand(sessionStartHookCommand(base))` for every base `hookCommand()` can
return. The real channels pass by coincidence, not construction:

- npm/dev dist absolute path → basename `agentstate-lite.mjs` → legacy substring matches
- skill bundle path → contains `agentstate-lite` → legacy substring matches
- bare `aslite` / `agentstate-lite` on PATH → matches by rule

A source-path run (`node --test` over ts sources, checkout dir lacking the legacy token)
writes a hook neither form recognizes — which is exactly why the on-disk upgrade test goes
red in a marker-free worktree. Any future channel whose executable path contains neither
token would install an orphan: status blind to it, reinstall appends a duplicate,
uninstall leaves it behind.

# Recommendation

Fix finding 3 by pinning the invariant, not just repairing the test: one agreement test
asserting `isManagedHookCommand(sessionStartHookCommand(base)) === true` for each reachable
`hookCommand()` base form (bare bin, absolute path with/without spaces, source path). Per
CLAUDE.md's "recurring bug class is API-design feedback" — the invariant belongs to one
owning primitive so callers cannot drift.

Minor, non-blocking: a hand-authored `npx -y aslite session-start` hook is not recognized
(first token `npx`), while the legacy npx form is (substring). The installer never emits
that form; a comment on the recognition rule suffices.

[tasks/npm-cli-skill-prerelease](../tasks/npm-cli-skill-prerelease.md)
