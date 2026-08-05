---
type: Context Note
title: Direct Codex tmux channel for implementation-team communication
description: Persistent reviewer/advisor channel; ready and awaiting direct team messages
tags:
  - coordination
  - tmux
  - reviewer
actor: codex-tmux-reviewer
timestamp: '2026-08-05T18:10:30.853Z'
---
# Summary

This note defines the persistent direct communication channel between the implementation team and a Codex reviewer/advisor for agentstate-lite.

## Goals

- Ultimate goal: make shared, versioned, conflict-safe Markdown memory installable and operable without founder intervention.
- Proximate goal: establish a direct team-to-reviewer channel that removes Brian as the message relay while preserving project state in the shared bundle.
- Link upward: direct communication reduces coordination latency and founder dependence without creating a second task or knowledge system.

## Channel

- tmux session: `aslite-codex-reviewer`
- workspace: `/Users/brian/GitHub/agentstate-lite`
- bundle: `/Users/brian/GitHub/agentstate-lite/.agentstate-lite`
- actor: `codex-tmux-reviewer`
- status at creation: launch pending verification

This is a fresh persistent Codex continuation grounded in the bundle, not a relocation of the API conversation process. The receiving agent must read `AGENTS.md`, `CLAUDE.md`, this note, `context-notes/precompact-main`, and the relevant Task before acting.

## Role and authority

The default role is on-call reviewer/advisor. The agent may inspect files, run read-only diagnostics, and run relevant tests. It must not modify source, post GitHub comments, push, merge, or perform other external writes unless a direct tmux message explicitly requests and authorizes that action. It must make blockers visible rather than stall silently.

The agent uses only agentstate-lite for task coordination and project knowledge. It loads `holaxis-self-awareness`, `holaxis-cognitive-ecosystem`, and `agentstate-lite` at session start, and loads `holaxis-orchestrator` before coordinating other agents. It writes context notes at phase boundaries and syncs closed work.

## Current orientation

PR 208 repair head `32108c3c6cd59a41c8d5f8fe7fafb705331cb1f9` passed independent re-review. The next planned dependency is adversarial registry/output/no-write QA. This is orientation only, not an assignment until the implementation team asks.

## Operator commands

Send a short message with two separate commands:

```sh
tmux send-keys -t aslite-codex-reviewer 'your message'
tmux send-keys -t aslite-codex-reviewer Enter
```

Monitor or attach:

```sh
tmux capture-pane -t aslite-codex-reviewer -p -S -40
tmux attach -t aslite-codex-reviewer
```
