---
type: Context Note
title: Onboarding surfaces scoping orientation and system model
actor: codex-onboarding-scope
timestamp: '2026-08-03T23:30:14.162Z'
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
- Michael's sign-off must name the exact Journey records, ask whether the recipe deferral covers agentstate-guide, and authorize any edits to the completed discovery/home surface.

## Records to revise

- plans/onboarding-surfaces
- tasks/guidance-bundle-onboarding
- review-requests/onboarding-surfaces-mike-signoff
- create tasks/init-target-safety-guard as a scoped predecessor
- tasks/onboarding-surface-scoping returns to done after validation and sync

Openai/codex-owned task, Journey, Journey Stage, and Roadmap Item records remain unchanged until Michael approves.
