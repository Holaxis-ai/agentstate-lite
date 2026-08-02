---
type: Context Note
title: Canonical concept identity bug fix and unpublished handoff
actor: openai/codex
timestamp: '2026-08-02T13:48:04.442Z'
---
# Summary

The canonical concept identity bug is fixed and fully verified in commit `85a098b`, but the commit currently exists only on local `main`; it has not been pushed and no GitHub PR exists.

## What changed

Concept identity had diverged across filesystem, memory, remote, graph, CLI, and Git-sync paths. File-like aliases could collapse onto the same physical file while other backends treated them as distinct keys.

Commit `85a098b` makes storage identity canonical and exact. Path-like convenience remains at CLI ingress; graph selectors and remote payloads preserve canonical identity; malformed paths cannot create impossible edges; and a leading `./` is the explicit physical-path escape for ambiguous `.md` identity chains, including `sync --show-incoming`.

## Verification

- Full `npm run check` passed on exact commit `85a098b`.
- Independent static review of the exact SHA found no remaining P1/P2 issues.
- The review rounds found real missed projections, confirming that identity interpretation was too distributed.

## Current handoff state

The commit was fast-forwarded into local `main`, but it has NOT been pushed. Local `main` is one commit ahead of `origin/main` (`b0ad00b`). No remote fix branch or GitHub PR exists yet. Publishing still requires pushing a branch, opening a PR, and merging it on GitHub.

## Architectural follow-up

The difficult part was not the invariant itself; it was duplicated interpretation. `ConceptId` is effectively an unbranded string, and several surfaces implemented their own path/ID resolution. A future cleanup should introduce an explicit canonical-ID boundary and one shared reference/candidate planner, keeping raw user paths as a separate input type.
