---
type: Task
title: Prove one unchanged durable View through the MCP host
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #173 at 9ad9e58 proves the shipped Roadmap HTML runs from unchanged current
  bytes through the shared launch authority and read-only BridgeService in the
  MCP App. The exact-SHA review findings from 7e22fcc are fixed: hidden state
  now advances the durable activity epoch and the shared active predicate
  rejects hidden, suspended, or stale-epoch bridge/poll completions; UTF-8
  decoding preserves an initial BOM so approved valid UTF-8 bytes round-trip
  exactly into the executed Blob; and the guard test imports through the source
  TS loader so package-only testing no longer depends on prebuilt dist.
  Regression evidence: delayed bridge, delayed poll, and BOM round-trip tests;
  MCP package 23/23 both normally and with its dist directory absent; npm run
  check green including browser E2E 19/19, npm packaging, and skill parity. The
  executable-code trust wording, static shell CSP fallback, child CSP,
  navigation retirement, generated Views, and web UI remain intact. Remaining
  merge gates: renewed independent exact-SHA review, adversarial QA, and one
  real conversational-host dogfood launch.
actor: openai/codex
timestamp: '2026-07-27T03:12:15.985Z'
---

