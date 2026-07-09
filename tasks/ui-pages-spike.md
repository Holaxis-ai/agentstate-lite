---
type: Task
title: >-
  UI pages spike: bundle-hosted HTML pages + sandboxed iframe bridge + live
  updates (evaluation build)
status: in_progress
priority: '1'
description: >-
  Gate-4 rethink direction, human-directed evaluation build (Mike, 2026-07-09):
  pages are bundle CONTENT — promoted HTML blobs under pages/, declared by a
  Page kind convention, listed by a launcher shell in the existing ui command,
  rendered in sandboxed iframes with a postMessage data bridge (page never holds
  a credential; read-only in v1), live-updating via fs-watch -> SSE -> bridge
  push (version-token delta refetch). Feature branch feat/ui-pages for Mike to
  TRY on the real board before a keep decision; full cold review + plan doc land
  at keep time. Builds on existing plumbing only: byte channel blobs, ui
  loopback server + token/CSP, wire query layer, kinds registry.
actor: mike/claude
timestamp: '2026-07-09T17:56:33.189Z'
---

