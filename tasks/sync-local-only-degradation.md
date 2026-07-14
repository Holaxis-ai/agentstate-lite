---
type: Task
title: >-
  Local-only first-class: graceful degradation + clear communication when no
  remote exists (founders' requirement)
status: done
priority: '2'
description: >-
  DONE — merged 2026-07-14 (the long-lived branch finally landed). Shipped: the
  boardless empty-state split (pinned local-only message + establish-routing
  note, supported-mode framing), the degradation matrix with honest wording at
  every no-remote surface, and the skill's local-only/join/establish trilogy
  through the shared renderer. Survived three reconciliation rounds (post-#36
  respin, #37 generator-extraction port [PORT-FAITHFUL, byte-identical generated
  SKILL], post-#52 rebase [exact-SHA confirmed, range-diff delta = #45's
  attribution paragraph only]) and five review passes. Lesson institutionalized
  en route: an approved-but-unopened PR is invisible and loses every merge race.
  Open questions A (sync commits locally) and B (local awareness) remain carried
  for founder adjudication. Follow-ups live on sync-receipt-edge-polish items
  9-12.
actor: brian
assignee: brian-claude
timestamp: '2026-07-14T17:13:50.458Z'
---
## Audit findings (empirical, 2026-07-09, built CLI over a local-only git repo)

WORKS with zero remote: the entire engine surface (init/doc/list/link/status/view/kinds/
recipes — git itself optional per sync rule 1); `sync` exits 0; `session-start` exits 0,
renders home, no hangs. The principle ("Local-first = network AND git can both be
absent", plans/sync-verb rule 1) holds STRUCTURALLY. The gaps are communicative.

## In-scope fixes (the committed work)

1. SPLIT THE EMPTY STATE (third application of the P4 lesson): `sync` in a git repo with
   a bundle but no board branch anywhere says bare "nothing to sync" — even with fresh
   local board changes present. Give the boardless-repo case its own honest message:
   the board is local-only, changes stay on this machine, and the one-line path to
   sharing if ever wanted. Distinct from no-repo ("nothing to sync") and from
   clean+shared ("already up to date").
2. DEGRADATION MATRIX, documented: every remote-requiring surface — provisioning-from-
   origin, sync pull/push, --show-incoming (reads the fetched origin/board ref),
   cursor advancement — states its no-remote behavior in help/receipts where a user
   meets it. Each already fails structurally (no hangs); the work is the words.
3. SKILL line: the Workspaces section states plainly that a board without a remote is a
   supported mode (private/local-only), what works (everything local), and what
   sharing adds.

## Open design questions (carried, NOT committed scope — founders adjudicate)

A. Should `sync` gain a commit-locally degradation mode ("committed 2 docs locally — no
   remote configured, nothing to share", exit 0) so the flagship verb serves local-only
   users instead of ignoring them? Today they hand-commit per the skill. Touches the
   sync flow's shape; adjudicate before building.
B. Should awareness ride LOCAL commits when no remote exists? The cursor advances only
   on successful pulls, so local-only users — including the real multi-agent
   single-machine case — never get since-lines for their own machine's changes.
   Plausible: cursor advances on sync-commit too in local-only mode. Bigger design;
   needs its own look if demand is real.

## Evidence trail

Requirement from the founders' call 2026-07-09 (Mike via Brian). Audit run against the
built CLI at main (post-#24). Relates: plans/sync-verb rule 1; the P4 empty-state
principle (research/sync-verb-ux-review); U1's ffPull swallow matrix (the structural
half, already shipped).
