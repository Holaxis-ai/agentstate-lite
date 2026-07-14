---
type: Review Request
title: 'Product review: personal bundle catalog'
status: requested
reviewer: Michael Collier
requested_by: Michael Collier
question: >-
  Should the personal bundle catalog move into active implementation as a small
  CLI-first product slice for finding, targeting, and opening independent
  bundles?
actor: codex
timestamp: '2026-07-14T20:47:37.112Z'
---
# Context

You are already working across multiple AgentState bundles. The individual bundles preserve useful
project, privacy, and domain boundaries, but finding and reopening the right one now creates real
friction.

The proposed personal bundle catalog is a private orientation layer. It lets you name the bundles
you use, see which are available, and open or target one deliberately. It does not merge their
knowledge or become a new central authority.

The linked product brief presents the experience visually. The linked detailed design contains the
implementation and safety decisions and has already passed an independent design review.

# Requested decision

Decide whether this product direction should move from a queued idea into active implementation,
starting with a small CLI-first catalog that can add, list, resolve, rename, remove, and open local
bundle references.

# Acceptance criteria

- The user journey would materially reduce the friction of juggling multiple bundles today.
- The agent journey is understandable: locate one named bundle, then use ordinary AgentState
  operations against that explicit destination.
- The boundary feels trustworthy: the catalog is a private map, while each bundle remains an
  independent authority.
- The first slice is valuable without cross-bundle aggregation, automatic discovery, hosted
  accounts, or remote infrastructure.
- The capability should be owned by the CLI and remain usable through a future npm installation;
  a skill may teach it but is not required.

# Reviewer response

Please record one of: approve the product direction, request changes to the journey or boundary, or
defer implementation. Capture the reason and any change that would make the first slice more useful.

[reviews design](../designs/personal-bundle-catalog.md)

[reviews roadmap item](../roadmap-items/personal-bundle-catalog.md)

[explained by](../pages-registry/personal-bundle-catalog-review.md)
