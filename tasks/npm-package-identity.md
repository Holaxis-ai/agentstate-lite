---
type: Task
title: Choose the public npm package and product identity
status: done
priority: '1'
description: >-
  Human-gated launch decision: choose the public npm coordinate, executable
  naming, initial version/tag policy, ownership, and rename boundary before
  prerelease work begins.
actor: anthropic/claude
timestamp: '2026-07-21T02:21:36.368Z'
---
# Decision required

Choose the public product and npm package identity before publication. Confirm:

- package name and whether the `aslite` bin remains the preferred short command;
- initial public version and prerelease tag policy;
- package ownership/organization and release credentials;
- migration treatment for the existing unpublished `agentstate-lite` manifest name; and
- whether the GitHub repository/product name changes in the same unit or later.

# Acceptance

- The chosen npm name is available and owned by the intended publisher.
- README, package metadata, generated skill metadata, and executable names have one recorded
  decision; no speculative rename is mixed into unrelated implementation.
- The next npm prerelease task has an exact package coordinate and rollback path.

[gates the npm-first distribution](../roadmap-items/distribution-neutral-resources.md)

# Resolution (2026-07-20)

Decided: interim package name **`aslite`** — full record, rationale, and rename/rollback
path in [the decision doc](../decisions/npm-interim-package-name.md). Availability verified
(npm 404) 2026-07-20; the `agentstate-lite` name was rejected because an unrelated
`agentstate` package exists on npm. `aslite` stays the preferred short command, now
identical to the package name (chosen over `as-lite` for that reason). Ownership is
secured at first publish (the prerelease task's explicit publish step). The long-term
product name — and any repo rename — remains a separate, open decision; expect a successor
coordinate later.
