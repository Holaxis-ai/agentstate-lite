---
type: Task
title: Assess agent-relay install and runtime risk boundaries
description: >-
  Assess install/run risks and define a defensible sandbox profile for
  agent-relay@11.2.0 using manifest and source evidence.
actor: codex-relay-security
status: in_progress
assignee: codex-relay-security
timestamp: '2026-07-26T18:15:09.977Z'
---
# Objective

Assess lifecycle, dependency, native-code, network, telemetry, update, credential, filesystem, process-spawn, broker, and cloud boundaries for the exact package.

Parent: [comparative evaluation](../tasks/agent-relay-comparative-evaluation.md).

Inputs: [domain model](../research/agent-relay-comparison-domain-model.md) and [evaluation plan](../plans/agent-relay-comparative-evaluation.md).

Deliverable: structured Specialist Result Envelope with severity-ranked risks, evidence paths, safe experiment profile, gaps, and confidence. Do not execute untrusted package code or edit source.
