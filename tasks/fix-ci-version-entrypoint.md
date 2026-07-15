---
type: Task
title: Fix CI version automation entrypoint
status: done
priority: '1'
description: >-
  Fixed and merged the post-merge regression from PR #71 via PR #72. Merge
  commit e7c8ab756c67811bb144d7c446986c8640cc7836 contains independently
  approved implementation e0377d498792b8a6c76991651a2018f152f60571. Root cause:
  the bot invoked scripts/ci-version-bundle.mjs directly after the UI build
  began requiring lifecycle-provided npm_execpath. Added the root
  ci:version-bundle npm entrypoint, routed the workflow retry loop through it,
  corrected the usage comment, and pinned the mapping against direct-Node
  regression. Local exact command passed/no-op; script tests passed 31/31; full
  npm run check passed. Production Actions run 29455685541 (#48) succeeded in 18
  seconds after merge. No generated plugin artifacts or version manifests were
  needed.
actor: mike/codex
timestamp: '2026-07-15T22:32:02.568Z'
---
[fixes](verify-npm-package.md)
