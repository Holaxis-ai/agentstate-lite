---
type: Roadmap Item
title: >-
  Radical simplification: single-tier local-first — peel the remote/hosted stack
  (CANDIDATE)
status: queued
description: >-
  CANDIDATE — pending the founder call to reverse the two-tier (OSS + hosted)
  framing into a SINGLE tier (local-first + git). *** THE GIT TIER IS KEPT: sync
  (board-branch sharing, the SessionStart hook, git-based collaboration) is NOT
  peeled — it is the REPLACEMENT for the hosted tier and the whole reason this
  is possible. *** The word 'remote' is ambiguous: what's peeled is the
  WIRE/hosted remote (agentstate-lite --remote <url> talking to the Cloudflare
  worker), NOT the git remote (origin) that sync pushes to. REMOVE:
  RemoteBackend, packages/worker (D1R2/Cloudflare), packages/server (wire
  reference server), the wire protocol, --remote/serve/ui --remote, and the
  identity surface (login/join/whoami/invite/member/key). KEEP: the
  StorageBackend seam + FilesystemBackend + MemoryBackend (non-fs proof) + sync
  / the ENTIRE git tier + everything local-first. Instances: (1) viewer->pages
  consolidation (retire packages/viewer + view/viz.html; see
  designs/page-model-and-viewer-deprecation), in flight; (2) the Cloudflare/wire
  peeling. Optionality stays cheap (the seam makes a future remote a plug-in not
  a rewrite; the wire spec can be a parked doc). Committing it is a CORE.md
  scope change (FROZEN->REMOVED) + a North-Star edit. Next (not started): verify
  pass (prod worker holds nothing unique + removal-surface map) + a peeling plan
  doc.
actor: mike/claude
timestamp: '2026-07-12T01:14:28.394Z'
---
[contains](../tasks/deprecate-static-viewer.md)

[decision record](../tasks/positioning.md)
