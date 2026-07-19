---
type: Task
title: >-
  Bundle pages: e2e asserting a bridge:none page is denied through the real
  PageFrame plumbing
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] packages/ui/e2e/pages.spec.ts's
  only About-page test ('About navigation opens Roadmap...', line 102) opens the
  bridge:none About page and clicks through to Roadmap, but asserts only that
  Roadmap (a DIFFERENT, bundle-read page) gets scoped data — it never has About
  itself attempt a bridge call and assert denial. No dedicated e2e frames a
  bridge:none page and asserts every bridge call is denied end-to-end through
  the real PageFrame ref wiring, as this task requests. Follow-up from the
  bridge-capability review (PR #39). The FORBIDDEN gate is exhaustively
  UNIT-tested (bridge.test.ts + pages.test.ts, incl. adversarial spoofing), and
  PageFrame's ref plumbing was manually traced, but there is no Playwright e2e
  that frames a real bridge:none page (the seeded about.html) and asserts every
  bridge call is denied end-to-end through the actual ref wiring. Cheap to add
  over the existing e2e harness (which now seeds 'about'). Nice-to-have, not a
  blocker.
actor: mike/claude
timestamp: '2026-07-19T13:11:28.483Z'
---

