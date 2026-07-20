---
type: Task
title: >-
  Publish-visibility safeguard: prevent accidental public disclosure of bundle
  content
description: >-
  Product-safety gap surfaced 2026-07-19 by a near-miss. A bundle INHERITS the
  enclosing git repo's visibility, so content authored in a bundle inside a
  PUBLIC repo is published publicly — and today the only thing catching a
  sensitive doc is an agent happening to notice and warn. As the sharing/publish
  path becomes the core value prop and more users author bundles in repos, this
  footgun scales: a user leaking their OWN sensitive content through the tool is
  a worse trust-killer than any bug. NOTE: this is a SELF-footgun (the author
  over-exposes their own content), NOT attacker-exploitable — so a normal public
  board task, not a security advisory. Options to weigh: private-by-default for
  certain doc types/content; a visibility check + explicit acknowledgment at
  publish/sync time when the enclosing repo is public; a sensitive-content
  heuristic warning; a per-bundle visibility declaration honored by the sharing
  path. DoD: decide the safeguard shape, then a guard that makes accidental
  public disclosure require an EXPLICIT acknowledgment rather than relying on an
  agent's chance observation. Parent: roadmap-items/local-first-loop (the
  board-in-git sharing loop where the risk lives).
actor: mike/claude
status: todo
timestamp: '2026-07-20T02:05:33.328Z'
---
[safety hardening on the git-sharing publish path](../roadmap-items/local-first-loop.md)
