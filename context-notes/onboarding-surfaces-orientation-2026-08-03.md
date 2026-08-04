---
type: Context Note
title: Onboarding surfaces scoping orientation and system model
actor: codex-onboarding-scope
timestamp: '2026-08-04T00:02:42.170Z'
---
# Summary

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the harness.

## Proximate goal

Revise [plans/onboarding-surfaces](../plans/onboarding-surfaces.md) so every claimed v1 behavior matches shipped mechanics, founder intent, and ownership boundaries. This serves the ultimate goal by preventing the guide from teaching unsafe or nonexistent behavior.

## Review outcome

A three-lens panel returned pass-with-caveats. It affirmed one journey, the Recipe delivery shape, clean coordination, separation from the interop fixture, and acknowledgement deferral. It found two high-impact model errors and several completeness gaps.

## Corrected system model

- A bundle-read View cannot create a document. The only View action is document.set-field on an existing governed document. Guide v1's first action must be a CLI aslite new write observed live in the read-only View; document creation through View authority remains out of scope.
- init does not fail closed on an existing or enclosing bundle. It can add a recipe to an existing bundle or create a nested bundle. A generic init target-safety guard is a real shared-code predecessor, not guide copy. Existing bundles continue to use recipe add.
- Bundle-free recipe inventory currently emits a cwd-targeting init command unless a target was already supplied. The guide's explicit safe destination must therefore be carried by no-bundle home/skill/README guidance unless a separate discovery-output behavior is approved.
- Founder intent requires proactive but stateless guide discovery: the Agent Skill and no-bundle front door name agentstate-guide and its exact explicit-destination command when the user identifies as new or asks how to start. Zero nag means no marker is needed; any future repeated prompting would reintroduce the identity prerequisite.
- The guide curriculum is ordered but has no completion state. Its order is a revisable, test-user-validated hypothesis.
- The phrase only two remaining units was too broad. The discovery-to-first-value slice has a generic init safety predecessor, the guide unit, and quickstart, while host connection, return/rediscovery, richer domain recipes, and later Journey stages remain adjacent work.
- The guide is the first named built-in expected to carry References and a View, so its build-time packaging and installed-tarball proof must be explicit.
- Brian assumed decision authority while Michael is unavailable; the exact Journey, quickstart,
  no-bundle-home, create-only, and roadmap boundaries are approved and recorded.

## Decision and final state

- Brian decided that `agentstate-guide` is outside the domain-Recipe deferral because it teaches
  existing AgentState Lite functionality rather than proposing a user operating model. The durable
  record is [decisions/agentstate-guide-outside-domain-recipe-deferral](../decisions/agentstate-guide-outside-domain-recipe-deferral.md).
- The Review Request is approved under Brian's authority; Personal Task System, Product Manager,
  and other domain Recipes remain deferred.
- The plan and guide task incorporate all review findings.
- tasks/init-target-safety-guard is a separate P1 generic `init --create-only` predecessor.
- npm quickstart now depends on that guard while retaining its separate `work-tracking` oracle.
- The Journey, guide stage, operating-model stage, and typed Roadmap containment graph are
  reconciled without advancing implementation readiness.
- tasks/onboarding-surface-scoping is done. No product code, P5A, release, update, marketplace,
  MCP-install, View-create-action, notice/identity, or deferred domain-Recipe work was performed.
- Brian approved `aslite guide` as the zero-decision public entry. The built-in Recipe remains
  embedded in the CLI package; first use materializes its separate per-user bundle through generic
  create-only safety, later use reopens it, and `--dir` affects only that bundle destination. This
  does not authorize npm postinstall writes or make the tutorial the ordinary `init` default.

## Next action

Begin implementation planning for the create-only safety unit and prototype the portable ordered
guide curriculum/View plus thin `aslite guide` facade in parallel. Built-in registration and the
facade's first-run materialization wait on create-only safety, fresh-user validation, independent
review, and installed-package gates—not on another product decision.
