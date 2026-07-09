---
type: Roadmap Item
title: >-
  Link model: preserve links across body edits (managed block + first-class link
  remove)
status: queued
description: >-
  The PROPER fix for the body-drops-links class (tasks/body-update-drops-links).
  Mike's pick after review: Option 1 — a body write PRESERVES the doc's outbound
  links by default. Must ship as a COHESIVE unit, because preserve-by-default
  cannot ship alone: there is no 'link remove' today, so the only current
  removal path is omitting a link from a body rewrite — which preserve would
  kill. So this unit is THREE parts together: (1) a dedicated tool-managed links
  block (deterministic re-append, clean diffs — links stop being scattered
  inline); (2) preserve-by-default on doc update/write --body (re-append
  outbound links the new body dropped, idempotent), with --replace-links to opt
  out; (3) first-class 'link remove' so removal is not nuclear. OPTION 4 (move
  links to frontmatter/sidecar) was CONSIDERED AND REJECTED: in-body markdown
  links are load-bearing — OKF conformance (gate 2, the reference graph builder
  counts body markdown links as edges), 'plain markdown any conformant tool
  reads' (README), and the viewer renders the graph from them. Frontmatter links
  would abandon the standards-clean OKF thesis. A short-term GUARD (refuse
  --body-that-drops-links unless --replace-links, mirroring --blank-body) ships
  first as the stop-gap; this roadmap item is the real fix that supersedes it.
  Queued + unsequenced = candidate/committed-direction, sequence when ready.
actor: mike/claude
timestamp: '2026-07-09T23:55:38.705Z'
---
The PROPER fix for the body-drops-links class (tasks/body-update-drops-links). Mike's pick after review: Option 1 — a body write PRESERVES the doc's outbound links by default. Must ship as a COHESIVE unit, because preserve-by-default cannot ship alone: there is no 'link remove' today, so the only current removal path is omitting a link from a body rewrite — which preserve would kill. So this unit is THREE parts together: (1) a dedicated tool-managed links block (deterministic re-append, clean diffs — links stop being scattered inline); (2) preserve-by-default on doc update/write --body (re-append outbound links the new body dropped, idempotent), with --replace-links to opt out; (3) first-class 'link remove' so removal is not nuclear. OPTION 4 (move links to frontmatter/sidecar) was CONSIDERED AND REJECTED: in-body markdown links are load-bearing — OKF conformance (gate 2, the reference graph builder counts body markdown links as edges), 'plain markdown any conformant tool reads' (README), and the viewer renders the graph from them. Frontmatter links would abandon the standards-clean OKF thesis. A short-term GUARD (refuse --body-that-drops-links unless --replace-links, mirroring --blank-body) ships first as the stop-gap; this roadmap item is the real fix that supersedes it. Queued + unsequenced = candidate/committed-direction, sequence when ready.

ADDENDUM (body-guard review, 2026-07-09): the short-term guard covers doc update/write --body channels only. A SECOND silent-drop path exists — `promote <file> --doc-key <id>.md --expected-version <token>` overwrites a doc and drops its links (exit 0). It is a DELIBERATE CAS overwrite (bare promote over an existing doc is ALREADY_EXISTS exit 5; the .md route needs the exact current version token), and promote already applies kind validation like doc write — so a link guard there would be consistent. The proper preserve-by-default fix in THIS unit should cover the promote .md route too, not just the doc verbs.
