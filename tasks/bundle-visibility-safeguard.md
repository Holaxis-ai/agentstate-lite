---
type: Task
title: >-
  Board placement and visibility: explicit sharing choice and public-publish
  safeguard
description: >-
  Make every board placement and effective exposure explicit across local-only,
  in-tree, and dedicated board-branch modes. Init remains non-publishing;
  sharing receipts state inherited repository visibility; AgentState-owned
  public or unknown publication requires explicit acknowledgement, while
  ordinary Git paths receive honest warnings rather than false enforcement.
actor: openai/codex
status: todo
priority: '1'
timestamp: '2026-07-20T03:12:38.902Z'
---
# Problem

AgentState supports three materially different board states:

1. **Local-only** — the bundle exists on the machine and is not published by AgentState.
2. **In-tree** — the bundle is committed with the code on the current branch and is shared through ordinary Git operations.
3. **Dedicated board branch** — `sync --establish` creates and publishes a separate board branch.

Placement does not determine privacy. Both Git-backed modes inherit the repository's visibility; a dedicated board branch in a public repository is still public. The product does not yet present placement and effective exposure as one explicit decision, so users can mistake branch separation for privacy.

# Behavioral claim

Make board placement and effective exposure visible and actionable at setup and sharing boundaries without inventing an unenforceable visibility label.

`init` remains local and non-publishing. When AgentState owns the publication boundary, public or unknown exposure must be stated clearly and require the explicit acknowledgement chosen during design. When ordinary Git owns publication, AgentState must warn honestly rather than claim it can prevent a push.

# Required decision table

| Mode | Delivery path | Effective exposure | Product behavior |
| --- | --- | --- | --- |
| Local-only | None | Machine-private only when outside Git or untracked | State that nothing was published; offer local/external binding guidance |
| In-tree | Ordinary Git | Inherits repository visibility | State the detected visibility; warn that AgentState cannot intercept a later `git push` |
| Dedicated board branch | `sync --establish` | Inherits the same repository visibility | Preview remote/ref and visibility; enforce acknowledgement at the AgentState-owned publish boundary |
| Public code + private team board | Not first-class today | A board branch in the public repo remains public | Do not imply branch separation solves privacy; offer a machine-private external bundle today and record private remote sharing as separate product work |

# Scope

1. Audit the current `init`, home/status, and `sync --establish` receipts before changing behavior.
2. Keep `init`, including `init --recipe`, local-only: it must perform no network or Git publication.
3. Make post-init output present the available next paths explicitly: keep local, commit in-tree, or establish a dedicated board branch.
4. Make home/status show the detected placement mode and effective repository visibility, or `unknown`, compactly.
5. Make `sync --establish` preview the target remote/ref and detected public/private/unknown exposure before publication.
6. Require explicit acknowledgement for public or unknown publication through an AgentState-owned path; choose the exact non-interactive CLI contract during implementation design.
7. For in-tree bundles, explain that normal Git owns publication and AgentState cannot reliably block it.
8. Do not add a declarative `visibility: private` field unless that claim is mechanically enforced.
9. Keep visibility detection injectable, bounded, and offline-safe. Unknown visibility must never be rendered as private.
10. Keep recipe selection orthogonal: installing a product recipe must not silently choose placement or sharing policy.

# Acceptance criteria

- `init --recipe <name>` creates a local-only bundle and performs zero network or Git publication.
- A dedicated-board establishment preview for a public repository says the board will be public and requires explicit acknowledgement before AgentState publishes it.
- A private repository is described as inheriting private repository visibility.
- Failed or unavailable visibility detection is reported as unknown and never as private.
- A board branch in a public repository is never described as private merely because it is separate from the code branch.
- In-tree guidance warns about ordinary Git publication without pretending AgentState can prevent it.
- The local-machine-private path is documented for a public code repository through an external or untracked bundle binding.
- Deterministic tests cover local-only, in-tree, dedicated-branch, public, private, and unknown cases without requiring network access.
- Existing local-only, in-tree, and dedicated-branch behavior remains unchanged except for clearer receipts and the guard at an AgentState-owned publication boundary.

# Non-goals

- A general `main | branch` collaboration-placement abstraction.
- Intercepting arbitrary `git add`, `git commit`, or `git push` commands.
- Content scanning or secret detection.
- New authentication, encryption, hosting, or remote infrastructure.
- Letting a product recipe own the user's sharing policy.
- Silently relocating an existing bundle.

[reconciles current placement model](../designs/board-placement.md)

[safety hardening on the git-sharing publish path](../roadmap-items/local-first-loop.md)
