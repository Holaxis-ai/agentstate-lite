---
type: Task
title: 'Bug: bound sharing-chip staleness after git-only state changes'
status: done
priority: high
description: >-
  Bug: Git-only sharing-state changes can leave the Home sharing chip stale
  indefinitely. Observed after merge of PR #137.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-22T23:22:19.823Z'
---
# Problem

Sharing state can change through Git without changing bundle documents. Document SSE invalidation therefore cannot be the only refresh trigger.

# Acceptance criteria

- The client schedules config re-evaluation from an explicit server-provided sharing refresh contract.
- A cached response near expiry schedules the next request from the classification as_of time, not blindly from response time.
- Remote hosted mode does not poll unnecessarily.
- Deterministic fake-time tests prove a git-only state change is observed after the TTL without an SSE document event.

# Outcome

Fixed on branch fix/home-truth-followups at commit 6418972c1f4225dae7034708496090f51e5e359d. The classifier now owns and publishes refresh_after_ms; the UI schedules the next config read from as_of plus that lifetime, with bounded timing and interceptor-aware terminal stops. Hosted mode remains non-polling.

# Verification

- Independent exact-SHA review: PASS, high confidence, no findings.
- Independent exact-SHA QA: PASS, high confidence, no issues.
- Elevated unpiped npm run check: exit 0, including 18/18 Playwright tests.
- Fake-time tests cover Git-only refresh without SSE, cached remaining lifetime, expired/future/invalid/oversized values, and interceptor terminal states.
