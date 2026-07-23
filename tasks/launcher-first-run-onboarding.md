---
type: Task
title: >-
  Launcher first-run: orient a new user (the UI teaches what they can do with
  AS)
description: >-
  DONE 2026-07-21 — Unit 1 of designs/home-surface shipped whole as PR #135
  (80ba7e9: flat badged grid, first-run orientation, live activity feed, token
  gate) + PR #137 (affecd8: sharing chip over a 10-state evidence-gated truth
  table, where-is-this disclosure, collapsed workspaces block, CLI->ui-server
  injection seam). Both PRs: founder-built (Mike+Claude), independently reviewed
  at exact SHAs (135: APPROVE clean; 137: APPROVE after one fix round that
  killed two plan-inherited wrong-shared fabrications — records
  context-notes/pr-135-review + pr-137-review), CI green, visually smoked over
  the real built CLI incl. the repo own board rendering
  shared·Holaxis-ai/agentstate-lite. DoD met: fresh-bundle ui orients a newcomer
  (what/try-it/privacy promise), the surface pulses live, and identity tells the
  truth. STILL OPEN on the roadmap item (not this task): the naming decision
  (home vs launcher — test users), doc-reader Unit 2 decision, tier-2 switching,
  catalog privacy flag unit, accepted residuals in pr-137-review.


  REFINED 2026-07-22 — PR #151 (merged e5fd15e, 9 commits): first-run copy pass
  over this unit's three surfaces. Orientation names ASLite and moves OKF behind
  a learn-more disclosure (designs/home-surface's no-OKF-jargon requirement is
  now an EXECUTABLE pin, not a remembered rule). Empty Views rewritten for a
  first-time reader, authoring mechanics behind learn-more, and all three bridge
  capability modes explained against the exported BRIDGE_BADGES the cards render
  from. Empty Activity says what the feed is for. Fixed a REAL BUG: the no-agent
  fallback advertised 'npx -y aslite', the UNSCOPED name we do not own (registry
  404s); it now points at skill/hook install from the project root.
  Independently reviewed by codex-reviewer-151 at exact SHA 6362679 (record:
  context-notes/pr-151-review) — 4 findings (2 P1, 2 P2), all verified against
  code, all fixed in appended commits. Every changed pin probed red. CI green
  after one re-run of the known tasks/ui-server-watcher-flake-teardown flake
  (32/32 tests passed, exit 1 from a teardown fetch rejection; node 20+26 green
  on the same SHA). OPEN, NOT FIXED HERE: the activity feed's actor is the LAST
  WRITER, not creator/claimer/assignee — an unattributed write keeps the
  previous name and a link add overwrites it; brand form is inconsistent (ASLite
  vs aslite).
actor: claude-main-firstrun
status: done
priority: '1'
timestamp: '2026-07-23T00:07:55.699Z'
---
[the launcher IS the visual endpoint of 'productive'](npm-quickstart-onboarding.md)

[the first recipe's launcher a new user sees](../roadmap-items/personal-task-system-recipe.md)

[boundary: this is onboarding polish, NOT the ui-rethink redesign](../roadmap-items/ui-rethink.md)
