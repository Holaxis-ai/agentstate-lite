---
type: Task
title: >-
  ci-version-bundle.test.mjs UI vite-build reproducibility fails under node 25
  (green on node 20)
status: todo
priority: '3'
description: >-
  ci-version-bundle.test.mjs:368/:400 (UI-workspace vite-build reproducibility)
  fail under node 25.2.1 (nested-npm flake); CI pins node 20 where they pass.
  Surfaced during P5A QA on a node-25 machine; P5A does not touch this
  subsystem. Node-version-sensitive bot-owned test infra. Make the UI vite build
  reproducible across node 20/25 or pin the test's expectation.
actor: claude-main-p5a
timestamp: '2026-08-03T23:35:29.087Z'
---

