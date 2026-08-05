---
type: Task
title: Publish AgentState OKF v0.2 producer evidence upstream
status: in_progress
priority: '2'
description: >-
  Published the status/extension compatibility issue as upstream #272;
  date-scalar, verification, and maintainer-response follow-up remain.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-05T11:54:46.250Z'
---
# Objective

Publish a concise, evidence-backed producer report to OKF upstream before proposing broad format
changes.

# Report contents

- The global v0.2 `status` lifecycle collides with a real producer's type-specific workflow states.
- A meaningful mutation needs a clear rule connecting `generated.at` and historical `verified`
  events without equating mutation actor with provenance identity.
- Date-only YAML scalars must survive a read/write cycle without becoming datetimes; connect the
  finding to upstream issue #240 rather than duplicating it.
- AgentState's generic body links and unknown-field preservation already interoperate, so the report
  should distinguish demonstrated gaps from optional product features.

# Deliverable

Open or comment on the smallest appropriate upstream issue(s), link the public evidence, and record
maintainer guidance back in AgentState. Do not publish private bundle contents or represent
AgentState as v0.2-conformant.

# Evidence

Use [the audit](../research/okf-v0-2-compatibility-audit.md) as the source of truth.

[draft issue](../drafts/okf-v0-2-status-field-collision.md)

# Publication status

The forward-compatibility finding was published as
[GoogleCloudPlatform/knowledge-catalog#272](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/272)
on 2026-08-05 by `mikec-ai`, after independent skeptical review and a final duplicate/specification
check. The task remains open for the date-scalar contribution, verification feedback, and maintainer
response.
