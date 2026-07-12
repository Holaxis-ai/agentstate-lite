---
type: Roadmap Item
title: >-
  Radical simplification: single-tier local-first — peel the remote/hosted stack
  (CANDIDATE)
status: queued
description: >-
  CANDIDATE — pending the founder call to reverse the two-tier (OSS + hosted)
  framing into a SINGLE tier (local-first + git). Theme: the git tier (sync) has
  turned a lot of machinery into dead weight; peel it back. Two concrete
  instances: (1) viewer->pages consolidation — retire packages/viewer + the
  view/viz.html command (see designs/page-model-and-viewer-deprecation), IN
  FLIGHT; (2) Cloudflare/remote peeling — remove RemoteBackend, packages/worker
  (D1R2), packages/server (reference server), the wire protocol,
  --remote/serve/ui --remote, and the identity surface
  (login/join/whoami/invite/member/key), now that the board runs on the git
  tier. KEEP the StorageBackend seam + MemoryBackend (non-fs proof) + sync;
  optionality stays cheap (the seam makes a future remote a plug-in not a
  rewrite; the wire spec can be a parked doc). This REVERSES the current North
  Star + tasks/positioning two-tier framing, so committing it is a CORE.md scope
  change (FROZEN -> REMOVED) + a North-Star edit, not just a build task. Next
  (not started): a verify pass (prod worker holds nothing unique +
  removal-surface map) + a peeling plan doc.
actor: mike/claude
timestamp: '2026-07-12T01:11:54.697Z'
---
[contains](../tasks/deprecate-static-viewer.md)

[decision record](../tasks/positioning.md)
