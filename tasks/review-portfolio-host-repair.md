---
type: Task
title: Repair v0 edge-selector identity and correlation
status: done
priority: '1'
assignee: bridge-host-builder
actor: bridge-host-builder
timestamp: '2026-08-08T18:02:24.130Z'
---
# Objective

Repair the owning v0 edge-selector parser and invalid-request liveness after red gates prove the defects.

# Acceptance

Preserve exact raw nonblank `from`, `to`, and `text`; retain all grammar/cardinality/byte/authorization limits; correlate rejected v0 envelopes only through the existing bounded request-id primitive; correct authoritative prose and npm projection; keep plugin-owned/generated outputs untouched; make all focused tests green.

[governed by](../plans/review-portfolio-bridge-identity-repair.md)

[depends on](review-portfolio-host-red-gates.md)

# Outcome

B2 is complete on the shared feature branch working tree.

- `packages/view-runtime/src/bridge.ts` now uses trimming only to detect all-whitespace edge selectors and retains the original nonblank `from`, `to`, and `text` strings within the existing raw UTF-8 byte/cardinality limits.
- Parse failures recover a request id only from a plain `bridge: "v0"` record with string `type`, through the existing 1–128-byte `requestId` helper. Full parsing still rejects the request, the reply stays generic, and this path remains before launch resolution or bundle work.
- The three authoritative example references now describe absent-only unrestricted facets, fail-closed blank handling, raw 1,024-byte limits, exact byte preservation, and the supplied 1–32 count including duplicates. Only npm-target references were regenerated.
- Root build passed; focused core tests passed 35/35; view-runtime passed 28/28; npm skill drift check passed.
- Bounded green receipt: `/private/tmp/review-portfolio-host-green.log`.

No candidate View/harness, plugin tree, plugin manifests/versions, committed bundle, commit, push, or board sync was changed by this lane.
