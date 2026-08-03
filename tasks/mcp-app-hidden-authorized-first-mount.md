---
type: Task
title: Resume an already-authorized MCP App View first delivered while hidden
status: done
priority: '1'
assignee: openai/codex
description: >-
  Merged in PR #200 as merge commit a2de6e58bb5e4e669316916508c08e7b5babbb6d.
  The fix prevents an already-authorized durable MCP App View first delivered
  while hidden from mounting executable child content; visible recovery rotates
  through resume_durable_view and mounts only the fresh launch. The committed
  Chromium regression is red on parent f85c80f and green on reviewed SHA
  90c186bf9c9d5b4b6db8e1347f756dde788f1c2f. Independent exact-SHA review
  approved with no findings; adversarial QA passed six additional lifecycle
  attacks; CI passed on Node 20, 22, and 26.
actor: openai/codex
timestamp: '2026-08-03T02:54:15.709Z'
---
# Problem

An already-authorized durable MCP App View can be delivered while the trusted outer document is already hidden. The current activation path clears suspension state and executes the registered child without checking current visibility. A one-shot child `hello`/`subscribe` is then rejected by the outer hidden gate, but no hidden transition occurred after activation to create the marker required by visible recovery. The View remains at its loading placeholders indefinitely.

This ordering is independently reproducible with the SDK-backed host and a contract-faithful one-shot child. It is not the ordering observed in Brian's Claude cache incident; it is a separate lifecycle defect discovered during that diagnosis.

# System model and invariants

The outer App owns visibility quarantine. Hidden durable launches must not execute or forward activity. Visible recovery must rotate through server-owned `resume_durable_view`; it must not reuse a hidden launch, synthesize child authority, retry on a timer, weaken exact `event.source`, or make app-only tools model-visible.

The safe activation rule is therefore: an authorized payload received while hidden becomes the current suspended launch but its child stays inert. On visible, the existing guarded resume path mints a fresh launch, closes the old launch, mounts the child, establishes hello/subscribe, and starts polling.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in supported MCP hosts.

Proximate goal: make durable first activation obey the same visibility quarantine and fresh-launch recovery invariants as a later hidden transition. This serves the ultimate goal by eliminating a deterministic host-ordering deadlock without weakening authority.

# Acceptance criteria

- A host-shaped test sets the outer document hidden before App initialization and delivers an already-authorized result.
- No child bridge request uses the hidden/original launch.
- Visible recovery invokes exactly one guarded `resume_durable_view`.
- The fresh child sends correlated one-shot `hello` and `subscribe`, receives both replies, starts polling, and becomes ready.
- The original launch closes and all bridge traffic uses the replacement launch.
- Existing fullscreen/inline, replay, stale response, teardown, sizing, server visibility, and repository gates stay green.
- Independent review precedes adversarial QA.

# Progress

The regression failed on the parent at the expected missing-resume assertion and passes with the provisional lifecycle repair. Focused and full repository gates are green. The task is claimed on the same adjacent MCP App branch; independent review and QA remain.

[discovered during](claude-desktop-durable-bridge-initialization.md)

[diagnostic separation](../context-notes/claude-bridge-probe-result-77c84e4.md)

[test model](../context-notes/claude-bridge-test-model-13fcc2c.md)

[depends on](claude-desktop-durable-bridge-initialization.md)
