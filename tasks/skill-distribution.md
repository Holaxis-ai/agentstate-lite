---
type: Task
title: >-
  Skill distribution: axi-skills packaging + worker deploy kit
  (channel-agnostic; external = public repo w/ marketplace.json)
status: done
priority: '2'
description: >-
  SHIPPED + FULLY VERIFIED (2026-07-06, commits c821da4 + 230ebbf). The public
  repo IS its own marketplace (Claude .claude-plugin/marketplace.json + Codex
  parity manifests; skill relocated to the required
  plugins/agentstate-lite/skills/ shape carrying the self-contained 598KB CLI;
  drift gates green; README install one-liners). VERIFICATION LADDER, all
  passed: (1) cold-clone from GitHub —
  manifests/shape/no-symlinks/CLI-runs/zero-gitignore-leakage; (2) Codex
  end-to-end from the public URL — cache carries plugin.json + SKILL.md +
  executable CLI which runs against a real bundle; (3) Claude Code end-to-end BY
  THE HUMAN — /plugin marketplace add Holaxis-ai/agentstate-lite -> install ->
  reload -> the agentstate-lite skill appeared in the orchestrating session's
  OWN skill list, and the cache-installed CLI listed this very board (20 tasks)
  from production. The distribution loop closed on the product's own tracking
  surface. Residual moved to its own future scope: the worker DEPLOY KIT +
  deterministic 'deploy' command (was this task's other half; belongs with the
  self-host story when it's prioritized); optional internal-marketplace listing.
  Hermeticity side-fix recorded in 230ebbf.
timestamp: '2026-07-06T19:50:17.260Z'
---

