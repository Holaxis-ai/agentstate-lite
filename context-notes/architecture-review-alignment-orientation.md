---
type: Context Note
title: 'Architecture-review alignment: accepted scope and system model'
actor: codex-orchestrator
timestamp: '2026-08-08T14:22:11.674Z'
---
# Summary

The product's ultimate goal is a human-visible, conflict-safe, local-first shared memory. The accepted proximate goal is to make every architecture-review initiative discoverable through one canonical `Review` while preserving exact historical artifacts; this directly serves that goal by reducing duplicate authority and making verdicts findable.

Current system model: the bundle has 14 `Review` documents but no declared `Review` kind, six governed `Review Request` records, five atomic `Finding` records, and a legacy-prefix `pages-registry/reviews` View that presents requests rather than completed reviews. The CLI review family already has an approved canonical synthesis plus approval/addendum and must remain byte-frozen. Mike's architectural-smell family has a synthesis typed as `Finding`, four atomic Findings, a context-note handoff, claims, and remediation tasks, but no canonical `Review`. The accepted plan therefore adds a permissive Review convention, a versioned v1.1 template and approval, thin canonical wrappers only where no Review exists, and a portfolio View that exposes both requests and reports.

Unverified assumptions to test before implementation are: whether the proposed Review fields are sufficient for every existing family without invalidating legacy docs; whether any additional family lacks a single canonical synthesis; whether wrapper links can be added without manufacturing duplicate authority or remediation work; and whether the current View can be evolved safely or should be complemented by a new portfolio View. The first team phase is read-only and will challenge those assumptions from taxonomy, provenance/skeptic, and discovery/View perspectives before the plan is refined.

[implements](../plans/architecture-review-record-alignment.md)

[tracks](../tasks/architecture-review-record-alignment.md)
