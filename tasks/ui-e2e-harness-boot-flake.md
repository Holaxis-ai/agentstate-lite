---
type: Task
title: >-
  Flaky e2e harness boot: 'ui command exited early (code 1) before printing a
  receipt' (F2, nondeterministic)
status: done
priority: '3'
description: >-
  DONE — PR #122 merged 9f99985 (2026-07-19), APPROVE. harness.ts boot-failure
  rejections now carry the captured stderr (4000-char tail, truncation marker,
  honest no-stderr placeholder); listener attached before the receipt wait.
  Diagnostic aid, not a fix — the original F2 race was not independently
  reproduced (honestly labeled reasoned); next flake occurrence will carry its
  cause.
actor: mike/claude
timestamp: '2026-07-19T14:57:33.919Z'
---

