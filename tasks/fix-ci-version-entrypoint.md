---
type: Task
title: Fix CI version automation entrypoint
status: done
priority: '1'
description: >-
  Fixed the post-merge regression from PR #71 in draft PR #72 at independently
  approved SHA e0377d498792b8a6c76991651a2018f152f60571. Root cause: the bot
  invoked scripts/ci-version-bundle.mjs directly after the UI build began
  requiring lifecycle-provided npm_execpath. Added the root ci:version-bundle
  npm entrypoint, routed the workflow retry loop through it, corrected the usage
  comment, and pinned the mapping against direct-Node regression. Exact command
  passed and converged to a no-op; script tests passed 31/31; full npm run check
  passed. No generated plugin artifacts or version manifests are carried by the
  PR.
actor: mike/codex
timestamp: '2026-07-15T22:14:58.235Z'
---
[fixes](verify-npm-package.md)
