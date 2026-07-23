---
type: Task
title: >-
  Rename the View registry 'bridge' field: it names the mechanism, not the
  permission it grants
status: in_progress
priority: '2'
assignee: claude-builder-rename
description: >-
  FILED 2026-07-23 (Brian's naming critique, adjudicated in session).


  DIAGNOSIS: 'bridge' does two jobs and is only right for one. The MECHANISM —
  the postMessage channel between the sandboxed frame and the trusted shell — is
  genuinely a bridge; keep that name everywhere it means the channel. The
  FRONTMATTER FIELD on a View registry doc declares what the view is PERMITTED
  (none | bundle-read | bundle-propose) — naming it 'bridge' is naming a visa
  field 'border'. The internals already use the right word: the type is
  BridgeCapability, the resolver resolveBridgeCapability. Only the author-facing
  field name hides it.


  CANDIDATES (final call at build time, Brian's): 'access' (lean — short,
  self-evident, values already carry the bundle- prefix so 'access: bundle-read'
  reads clean; frontmatter is authored by people/agents, not the type system),
  'capability' (matches internal vocabulary exactly),
  'permissions'/'bundle-permissions' (considered; plural-for-single-enum
  awkward, and the long form says bundle twice).


  MIGRATION PATTERN (proven in-repo by the Page->View kind rename): accept the
  legacy form during the MIGRATION WINDOW, emit the new one, migrate existing
  docs in phase 2 (see decisions/legacy-deprecation-path). Concretely:
  parseRegistration/resolveBridgeCapability read the new field first and fall
  back to 'bridge'; everything that WRITES (the shipped convention,
  view-authoring-v0.md, the skill, the review-workflow recipe, new/view-create)
  emits the new name; the 8 live registry docs in this bundle and all external
  bundles keep working untouched.


  SIZED: ~28 source files reference the field across core/ui/ui-server/cli, 8
  live registry docs, plus the references/recipes corpus. npm is at 0.1.0-pre.1
  — near-zero external surface. This is the cheapest the rename will ever be.


  SEQUENCING (the reason for the dependency edge from
  tasks/cli-view-create-verb): if 'view create' ships with a --bridge flag, the
  old name gets baked into a brand-new CLI surface. The rename lands BEFORE or
  WITH that verb, never after.


  REVIEW TIER: this field is the security-relevant one (decides bundle-data
  access) and the change touches parseRegistration/resolveBridgeCapability — the
  fail-closed boundary. High-risk tier: Builder -> independent review ->
  adversarial QA, with the pins that (a) a legacy 'bridge'-only doc still
  resolves identically, (b) a doc carrying BOTH fields resolves
  deterministically (decide and pin which wins), (c) an unrecognized value in
  EITHER field still fail-closes to none.


  DONE WHEN: the new field name is read everywhere the old one was, the old name
  still works on every existing doc, all shipped writers emit the new name, and
  the three adversarial pins above are in the same reviewed unit.


  CORRECTION 2026-07-23: the earlier 'forever/never migrate' phrasing overstated
  the design. Legacy acceptance is TRANSITIONAL per
  decisions/legacy-deprecation-path — dual-read now, migrate the known bundles
  (tasks/migrate-legacy-page-bridge-stock), then remove legacy paths
  (tasks/remove-legacy-page-bridge-support).
actor: claude-main-viewauthoring
timestamp: '2026-07-23T23:09:49.851Z'
---
[context-notes/review-access-rename-rounds](../context-notes/review-access-rename-rounds.md)
