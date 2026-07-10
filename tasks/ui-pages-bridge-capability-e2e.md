---
type: Task
title: >-
  Bundle pages: e2e asserting a bridge:none page is denied through the real
  PageFrame plumbing
status: todo
priority: '3'
description: >-
  Follow-up from the bridge-capability review (PR #39). The FORBIDDEN gate is
  exhaustively UNIT-tested (bridge.test.ts + pages.test.ts, incl. adversarial
  spoofing), and PageFrame's ref plumbing was manually traced, but there is no
  Playwright e2e that frames a real bridge:none page (the seeded about.html) and
  asserts every bridge call is denied end-to-end through the actual ref wiring.
  Cheap to add over the existing e2e harness (which now seeds 'about').
  Nice-to-have, not a blocker.
actor: mike/claude
timestamp: '2026-07-10T19:59:56.620Z'
---

