---
type: Context Note
title: Cross-recipe composition is already free — "cookbook" is likely a dead word
description: The typed-relationships work revealed there is no mechanical difference between intra- and cross-recipe glue; the vocabulary collapses to conventions + recipes, pending one observational test.
tags:
  - vocabulary
  - recipes
  - typed-links
timestamp: "2026-07-07T19:35:00.000Z"
---

# Summary

Pulling on Mike's question ("don't we already have cross-recipe composition?") collapsed a
concept the roadmap had been carrying. Three facts, each verified against the code this week:

1. **Kinds live in one flat namespace and carry no recipe identity.** Seed-then-own erases
   which recipe installed a convention the moment it lands; a `links` declaration references
   its target kind by name-as-string. There is NO mechanical difference between intra-recipe
   glue (work-management's `contains: Roadmap Item → Task`) and cross-recipe glue
   (`evidences: Claim → Task` relating two recipes' kinds). The former is live on this board;
   the latter would work identically, today, with one declaration line.
2. **Conformance checking doesn't even need the target kind to be governed.** The graph-lint
   check (PR #7, in flight as of this note) compares a target doc's `type` STRING against the
   declared kind name — a declaration targeting a kind with no convention in the bundle still
   checks cleanly. The "soft dependency question" for recipes declaring links to kinds they
   don't ship mostly answers itself: nothing resolves, nothing errors, lint posture covers the
   rest.
3. **Therefore "cookbook" (composed recipes with typed-link glue as a distinct mechanism
   layer) is probably a word without a referent** — not because composition failed, but
   because it is too frictionless to need naming. Final vocabulary, pending one test:
   **conventions** (schemas + link types + expectations, as data) and **recipes** (versioned
   sets of conventions, installed idempotently). Nothing else was ever mechanically real.

**The one remaining test (observational, not a build):** when a live claims workflow first
wants "this claim evidences that task," write the `evidences` declaration + one edge and
watch for friction. If none appears (expected), delete the README line "cookbooks (composed
recipes with typed-link glue) are design intent only" — the kill-the-word-with-evidence
outcome the work-management trial (research/work-management-trial) set up on 2026-07-06.

## Session context (for the next agent)

Today's arc: typed-edge reading merged (PR #3), vocabulary discovery (PR #4), skill default
moved to the committed `.agentstate-lite/` project folder (Brian's PR #5 + follow-up), the
board ported INTO the public repo (write-time scrub discipline now applies), point-of-use
link teaching (PR #6), and the graph-lints unit building as PR #7 (write-time type
conformance + the `expects_inbound` status sweep — decisions/typed-links-carrier addendum
pending at review). Typed-relationships is nearly closed; graph-query remains parked with
wake conditions (plans/graph-query-v0); the proposed work-coordination roadmap item awaits
Mike's call. UI brief and sync design wait for Brian in plans/.
