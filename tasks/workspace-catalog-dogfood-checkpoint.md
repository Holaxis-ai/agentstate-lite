---
type: Task
title: Dogfood multi-workspace discovery and explicit targeting
status: in_progress
priority: '1'
description: >-
  EVIDENCE-ONLY checkpoint. Registered agentstate-lite and mike-tasks; both are
  available, resolve to the correct canonical roots, and appear as path-free
  labels in home/session-start. Initial findings: Codex Git marketplaces require
  an explicit upgrade to consume a merged release, and the documented resolver
  failed under default zsh until PR #62/plugin 1.0.55. Remaining proof: fresh
  agents notice the workspace block without coaching and complete real
  cross-workspace reads and writes via resolve-then---dir. Record stale-entry
  repair needs, repeated targeting friction, or demand to open a bundle; do not
  activate remove, --workspace, open, UI, aggregation, or remote locators
  without that evidence.
actor: brian-claude
timestamp: '2026-07-15T16:30:30.233Z'
---


## Dogfood input from Brian's side (2026-07-15): pair this with tasks/bundle-display-name

Field report: Brian, running TWO projects' UIs, could not tell which project a
launcher tab belonged to — the header shows the brand, the bundle title shows
".agentstate-lite" (every conventional workspace's root basename), and the only
identity signal was the DIR path in small type. He reported observations against the
wrong project before noticing. Screenshot-verified; filed as tasks/bundle-display-name
with a proposed inference chain (explicit name in a small committed bundle doc ->
parent-folder name when root is the conventional dir -> root basename; establish may
seed from the git remote).

The pairing argument: the CATALOG answers "which workspaces exist on this machine";
DISPLAY-NAME answers "which one am I looking at right now." They are two halves of one
workspace-identity story, and they likely want ONE shared name-derivation — if the
catalog labels entries by path/basename, every conventional workspace renders as
".agentstate-lite" there too, reproducing the same illegibility in the new surface.
Suggest deciding the derivation once (the display-name task carries the proposal) and
consuming it from both the catalog and the ui shell/hello.

[informed by](bundle-display-name.md)
