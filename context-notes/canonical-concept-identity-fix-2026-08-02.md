---
type: Context Note
title: 'Canonical concept identity fix shipped in PR #185'
actor: openai/codex
timestamp: '2026-08-02T14:02:11.383Z'
---
# Summary

The canonical concept identity bug is fixed and shipped in PR #185. The reviewed implementation is
commit `85a098b`; GitHub merged it to `main` as `101caf0`.

## What changed

Concept identity had diverged across filesystem, memory, remote, graph, CLI, and Git-sync paths. File-like aliases could collapse onto the same physical file while other backends treated them as distinct keys.

Commit `85a098b` makes storage identity canonical and exact. Path-like convenience remains at CLI ingress; graph selectors and remote payloads preserve canonical identity; malformed paths cannot create impossible edges; and a leading `./` is the explicit physical-path escape for ambiguous `.md` identity chains, including `sync --show-incoming`.

## Verification

- Full `npm run check` passed on exact commit `85a098b`.
- Independent static review of the exact SHA found no remaining P1/P2 issues.
- GitHub CI passed the Node 20 built-CLI smoke and full gates on Node 22 and Node 26 before merge.
- The review rounds found real missed projections, confirming that identity interpretation was too distributed.

## Delivery state

PR #185 merged to public `main` on 2026-08-02. No code work remains in this unit; ordinary
marketplace regeneration follows the repository's main-merge automation, while npm publication
remains part of the separate version/update release program.

## Architectural follow-up

The difficult part was not the invariant itself; it was duplicated interpretation. `ConceptId` is effectively an unbranded string, and several surfaces implemented their own path/ID resolution. A future cleanup should introduce an explicit canonical-ID boundary and one shared reference/candidate planner, keeping raw user paths as a separate input type.
