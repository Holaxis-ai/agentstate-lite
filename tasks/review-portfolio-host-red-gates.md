---
type: Task
title: Create host edge-selector red gates
status: done
priority: '1'
assignee: bridge-host-builder
actor: bridge-host-builder
timestamp: '2026-08-08T17:59:54.859Z'
---
# Objective

Create and run failing regressions for the v0 edge-selector/source defects before production edits.

# Acceptance

Pin core exact nonblank ID and relation-text semantics; parser raw UTF-8, scalar/array, 1/32/33, blank rejection, and `reviews/ ` exact-not-prefix behavior; service/core agreement; and bounded v0-only invalid-request correlation with zero launch/bundle work. Preserve bounded failing receipts, then hand off to the host repair.

[governed by](../plans/review-portfolio-bridge-identity-repair.md)

# Outcome

Red-first host gates were added without production edits.

- Root build on unchanged production source passed.
- Core contract command passed 35/35, pinning exact nonblank concept IDs, boundary-space selectors, exact relation text, and duplicate-selector behavior.
- View-runtime command failed 3/28 exactly on the intended defects: selector trimming, service/core disagreement for boundary-space selectors, and lost valid v0 request-id correlation.
- Bounded receipt: `/private/tmp/review-portfolio-host-red.log`.
- No launch resolution, configuration load, renderer call, or bundle read is needed by the asserted rejected-envelope path; the new test will keep that ingress ordering pinned.

This completes B1 and unblocks the minimal owning repair in B2.
