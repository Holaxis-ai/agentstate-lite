---
type: Design
title: >-
  Dev CLI invocation ergonomics: kill the zsh-alias friction with a repo-root
  shim
description: >-
  The recurring cross-agent zsh word-splitting failure (aliasing the long
  built-CLI path) is API-design feedback, not a shell lesson. Root cause: the
  in-repo invocation is long AND the tool teaches the production path (npx -y
  agentstate-lite) in-repo, so agents improvise a fragile alias. npm install
  solves the USER invocation but NOT the dev workflow (you must run the
  freshly-built local dist). Recommendation: a committed repo-root ./aslite shim
  (shell-agnostic, doesn't ship, helps everyone) + one CLAUDE.md line. Full
  design in body.
actor: mike/claude
timestamp: '2026-07-20T02:13:38.571Z'
---
# Dev CLI invocation ergonomics

## Problem
Agents (and humans) working in the repo repeatedly hit a zsh failure: they alias the built CLI into a
shell variable — `B="node packages/cli/dist/agentstate-lite.mjs"` then `$B doc write ...` — which fails
in zsh because unquoted variable expansion is NOT word-split (unlike bash). The command becomes one
token, `node packages/.../agentstate-lite.mjs`, and errors "no such file or directory". This recurs
across multiple agent sessions and lines — a cross-agent friction, not a one-off.

## Root cause
Not the shell gotcha itself — the reason the alias gets reached for. Two things:
1. The in-repo invocation is a long path (`node packages/cli/dist/agentstate-lite.mjs`), so callers
   want a shortcut.
2. The tool TEACHES the wrong invocation in-repo: the SessionStart hook and skill emit
   `npx -y agentstate-lite ...` (the production path). In the dev repo that is unpublished and slow,
   so agents improvise — and the improvisation is the fragile alias.

Per this repo's own rule ("a recurring bug class is API-design feedback; move the invariant into one
owning primitive; don't patch consumers or add reminders"), the fix is to make the correct invocation
short and shell-agnostic — not to warn agents about zsh word-splitting.

## Does npm install solve it?
Partially — for END USERS, not for the DEV workflow (which is where we hit it):
- A global `npm install -g agentstate-lite` puts the real bins (`aslite`, `agentstate-lite`) ON PATH →
  bare `aslite doc write ...` works in any shell. Solves it for people using the published tool.
- But (a) the package is unpublished, so this does nothing today; and (b) more fundamentally, in the
  repo you must run the freshly-BUILT local dist to test your changes — a global install points at the
  PUBLISHED version, not your build. So developers/agents testing the repo still need the local dist
  and would still alias the long path.

Conclusion: npm publish is necessary for the user-facing invocation but does NOT address dev-repo
friction. Separate problems; solve both, not one via the other.

## Options
- **A. Repo-root `./aslite` shim (RECOMMENDED).** Two lines:
  ```sh
  #!/bin/sh
  exec node "$(dirname "$0")/packages/cli/dist/agentstate-lite.mjs" "$@"
  ```
  Short, shell-agnostic (a script, not a shell feature — zsh/bash/anything runs it), no alias
  temptation. Committed → helps every agent and human in the repo, permanently. Does NOT ship: the
  package `files: ["dist"]` excludes the repo root, so it never enters the tarball. Runs the
  freshly-built local dist — exactly the dev need.
- **B. `~/.zshrc` function** (`aslite() { node <abspath> "$@"; }`). Bare `aslite` in every session on
  ONE machine (the Bash tool sources the profile). Instant relief, but machine-specific, no repo
  benefit, needs the absolute path.
- **C. `npm link packages/cli`.** Real bin `aslite` on PATH pointing at the local dist — matches the
  production name (nice muscle-memory alignment), but global-link state and needs a build.
- **D. CLAUDE.md "don't alias in zsh" reminder — REJECTED.** Patches consumers / adds a reminder,
  exactly what the repo's rule says not to do; easily missed by the next fresh agent.

## Recommendation
Ship **Option A** (committed `./aslite`) plus one CLAUDE.md line teaching it as THE in-repo invocation.
This aligns what agents are TOLD with what actually works, killing the improvisation at the source.
Optionally document C (`npm link`) for anyone who wants bare `aslite`. Independent of the eventual npm
publish, which addresses the user-facing invocation on its own track.

## Non-goals
- Not a replacement for npm publish (different audience: users vs dev).
- Not shipped in the package (`files: ["dist"]`).
- Not a shell-portability lecture in CLAUDE.md.

## Risks / notes
- The shim needs the dist built (agents build anyway); if unbuilt, `./aslite` errors clearly and a
  build is the first step regardless.
- `verify:npm-package` proves the tarball allowlist is dist-only; a repo-root file cannot affect the
  tarball (confirmed: `files: ["dist"]`), so the shim is invisible to the published package.
