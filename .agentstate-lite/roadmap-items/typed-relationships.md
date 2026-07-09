---
type: Roadmap Item
title: >-
  Typed relationships: reading shipped; validation (rung c) gated on the joint
  ontology session
status: active
description: >-
  The typed-links ladder from the work-management trial, converged with Brian
  architecture map 2026-07-07. SHIPPED: rungs (a) backlinks carry link text and
  (b) link show --text (PR #3); the ratified carrier decision (a link is a typed
  edge iff its text matches a kind-declared type —
  decisions/typed-links-carrier); point-of-use teaching (per-kind help + receipt
  hints, PR #6); graph lints (link-type conformance warn + expects_inbound
  sweep, PR #7); one-step create+link (new --link, PR #23 pending). Rung (c) —
  REQUIRED/validated links, i.e. enforcement — DEMOTED per Mike 2026-07-09:
  parked, no longer gated on a scheduled ontology session. Rationale: all
  realized value came from the reading/teaching rungs; the one field case of
  demand was served by a required FIELD + documented procedure (its own verdict:
  ergonomic gap, not structural); enforcement forces the canonical-vocabulary
  governance question prematurely and violates warn-do-not-block. WAKE
  CONDITION: a second real user blocked where the required-field workaround
  genuinely cannot serve. Standing constraint for whenever it wakes (graph-query
  review 2026-07-07): OKF link text is overloaded (display text vs relationship
  carrier, ~6:1 prose on the real board) — declared vocabulary is the only
  viable carrier; undeclared text-as-type is not workable. Minimal package if
  built: outbound-only, at-least-one, dangling-satisfies,
  warn-by-default/--strict, sweep-backed.
actor: mike/claude
timestamp: '2026-07-09T01:46:28.126Z'
---
[contains](../tasks/typed-links-read-path.md)

[contains](../tasks/link-text-near-miss.md)

[decision](../decisions/typed-links-carrier.md)

[contains](../tasks/typed-links-discovery.md)

[contains](../tasks/link-vocab-point-of-use.md)

[contains](../tasks/graph-lints.md)

[contains](../tasks/status-terminal-declaration.md)

[contains](../tasks/new-link-flag.md)
