---
type: Context Note
title: Summarize upstream OKF issue 272
actor: codex-main
timestamp: '2026-08-05T21:07:46.000Z'
---
# Summary

Completed summary of GoogleCloudPlatform/knowledge-catalog issue #272. The issue is an open specification question, not a pull request or implementation.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: extract the durable OKF implications of upstream issue #272 so agentstate-lite can remain aligned with the knowledge format it implements.

# Outcome

Issue #272 asks how OKF should handle a collision when a later minor version standardizes a frontmatter key that earlier producers legally used as an extension. The concrete collision is `status`: agentstate-lite uses it for kind-specific workflow states under OKF v0.1, while OKF v0.2 gives it document-lifecycle values `draft`, `stable`, and `deprecated`.

The issue argues that v0.2 minimal conformance does not clearly invalidate values such as `todo`, but generic consumers cannot know whether those values are lifecycle data or producer-specific workflow data. It asks whether core semantics globally claim the key, how consumers should handle out-of-vocabulary values, and what migration pattern producers should use.

Evidence cited from an agentstate-lite snapshot: 826 documents; 336 with nonempty top-level `status`; 331 outside the v0.2 lifecycle vocabulary; 5 using `deprecated`. The issue links profile proposal #212 and version-compatibility issue #239, and offers a cross-producer fixture after policy is settled.

As of 2026-08-05 the issue is open with no comments, labels, assignees, timeline events, or linked implementation. Practical implication: agentstate-lite should not treat a v0.2 declaration as a mechanical version bump until upstream defines collision and migration semantics.
