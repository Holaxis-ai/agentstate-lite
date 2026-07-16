---
type: Task
title: 'board-git PR C: in-tree read-side mode'
status: done
priority: '4'
description: >-
  SHIPPED: PR #80 merged (reviewed candidate b468e24). In-tree is a supported
  read-side board mode: act-time detection wired in sync/session-start
  (establish keeps its own fail-closed live-fetch gates); intree.ts upstream
  decision table (tracking config or honest no-comparison-basis; fetch only the
  tracked remote, time-boxed, tree-untouched); cursor tier git-intree with
  non-vacuous mode-flip isolation both directions; selfActors via post-persist
  onPersisted hook (both modes; write-safety proven under unwritable state
  dirs); prefix-stripped ids incl. reserved + non-ASCII; write verbs refuse
  USAGE exit 2 with details.state; --pull-only fetch-and-reports;
  --show-incoming upstream-scoped, never fetches; no autopull (pinned); home
  local-evidence probe renders only previously-null states; pre-share no-origin
  copy fixed; SKILL regenerated. Review APPROVE-WITH-NITS: parity = disclosed
  deltas ONLY (remoteless->in-tree exit 2 accepted; verified-dual->dual arm
  accepted, unverifiable byte-identical; attribution delta intended);
  provisioned bare sync gained ZERO network calls (spawn-counted). Nits N1
  (remoteless remedy dead-end, copy-only) + N3/N4/N5 ->
  tasks/board-git-seam-nits. Separate QA waived: review performed QA-grade
  attacks; read-side tier.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T05:52:23.068Z'
---
[depends on](board-git-b-channel-detection.md)
