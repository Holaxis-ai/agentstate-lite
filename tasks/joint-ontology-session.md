---
type: Task
title: Founders' joint ontology session (gates typed-relationships rung c)
status: todo
priority: '2'
description: >-
  The gate itself, as a board object (filed 2026-07-14 after Brian flagged that
  an undocumented blocker is untrackable). WHAT: Brian + Mike work session to
  align the shared link-type ontology — which relationship vocabulary the kinds
  declare, what rung-c write-time validation should enforce, and where
  convention beats enforcement. UNBLOCKS: roadmap-items/typed-relationships
  (validation rung c — currently queued on exactly this), and settles the parked
  rung-c enforcement wake condition. DONE WHEN: the session happens and its
  decisions land as a decisions/ doc; rung c then either becomes buildable tasks
  or is explicitly retired. Assignees: both founders (scheduling is the work).
actor: brian-claude
timestamp: '2026-07-14T17:37:16.699Z'
---
## The decision agenda (added 2026-07-14 after Brian asked what "decisions" means — each
## bullet is one decision; each lands as a decisions/ doc or an explicit deferral)

Current state the session starts from: five kinds declare link vocabularies (Claim
`supersedes`; Review `reviews design/task/roadmap item`; Roadmap `contains` Roadmap
Item; Roadmap Item `contains` Task; Task `depends on` Task + expects_inbound
`contains`). Free-text link labels are unrestricted everywhere. `status` already warns
on nonconforming links (soft enforcement, shipped); write-time enforcement (rung c) is
parked.

1. THE CANONICAL RELATIONSHIP SET. Today's vocabulary grew organically, one kind at a
   time. Decide: is this the blessed set, and what are each relation's semantics and
   DIRECTION conventions (contains: whole->part; depends on: dependent->dependency;
   supersedes: newer->older; reviews-*: reviewer->target)? Anything missing (e.g.
   blocks/gates — the joint-ontology-session task itself is a GATE, expressed today
   only as containment)? Anything to retire?
2. OPEN vs CLOSED WORLD. May authors freely invent new link texts (today's behavior —
   exploratory linking stays cheap), or does undeclared text on a vocabulary-declaring
   kind become a warning or an error? Where is the line between knowledge-graph
   freedom and task-DAG discipline?
3. RUNG-C ENFORCEMENT SHAPE, if woken. Reject-at-write (exit 2) vs write-with-warning
   (status lints = the shipped soft form)? Target-kind checking ('contains' must point
   at a Task)? Per-kind opt-in or bundle-wide? Or: explicitly retire rung c because
   the lints + point-of-use teaching already carry the value (Mike's demotion
   reasoning — confirm or overturn it as the standing answer).
4. WHERE THE ONTOLOGY LIVES. Per-kind declarations (today) vs a bundle-level ontology
   doc that kinds reference. Interacts directly with the active
   self-describing-domain-models item (#42/#51/#52 machine-readable descriptions).
5. THE LITE <-> HOLAXIS MAPPING. How lite's kinds/relationships map onto the broader
   Holaxis CE concept model (vault, tsk, canonical AgentState) — one shared vocabulary
   across the ecosystem, or deliberate independence with a translation table? (This is
   the half that genuinely needs BOTH founders and is why this is a session, not a PR.)
6. EXPECTS_INBOUND POLICY. Task expects containment today; decide which other kinds do
   (Decision? Research?), and whether orphan-noise is a bundle-wide lint or scoped.

DONE WHEN: each of the six is either decided (a decisions/ doc, linked from
roadmap-items/typed-relationships) or explicitly deferred with a wake condition; and
rung c consequently becomes buildable tasks, or is retired with the reasoning recorded
on the roadmap item.
