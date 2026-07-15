---
type: Task
title: >-
  Every conventional bundle displays as '.agentstate-lite' — infer and show the
  PROJECT's name
status: in_progress
priority: '2'
description: >-
  Brian's field report (2026-07-15, screenshot from a second project's ui): the
  launcher shows 'agentstate-lite' (brand) twice and '.agentstate-lite' (the
  folder) as the bundle title — the project's own name appears NOWHERE, and this
  caused real instance confusion (the DIR path was the only identity signal).
  Root cause: bundle display name = root basename, which the conventional-folder
  convention made identical ('.agentstate-lite') for every project. INFERENCE
  CHAIN (proposed): (1) explicit name in a small committed bundle doc —
  editable, syncs to teammates; NOTE the OKF constraint: bundle-root index.md
  frontmatter is reserved solely for okf_version, so the name needs its own doc;
  (2) default when root basename is the conventional dir: PARENT folder name
  (offline, no git needed); (3) root basename for standalone bundles (current
  behavior). GitHub remote name demoted to a seeding role: sync --establish may
  seed the explicit doc from the remote at publish time (the one moment it
  definitionally exists). SURFACES to fix once the derivation is central: ui
  shell header + bundle title, bridge hello.bundle.name, home/session-start
  render, sync receipts.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-15T17:26:04.285Z'
---

