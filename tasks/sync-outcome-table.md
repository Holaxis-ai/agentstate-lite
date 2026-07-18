---
type: Task
title: 'Sync outcome table: one enumerable authority for refusal/guidance states'
status: done
priority: '2'
assignee: mike/claude
description: >-
  SHIPPED: PR #92 merged as 07b2851 after independent review and fixup 9d317da.
  It consolidates 59 sync-family refusal/guidance outcomes behind the CLI
  outcome catalog, with 70 byte-frozen variants and closed agreement coverage;
  package-owned factories remain their package-side authority. Post-merge
  promise resolved: mutation run 29628092134 completed core successfully but
  GitHub canceled the CLI Stryker job at the five-hour timeout and produced no
  CLI artifact, so there was no survivor map to inspect. The full current-main +
  PR #91 combined repository gate subsequently passed. No corrective #92 change
  is indicated; future CLI mutation-runtime tuning belongs to the
  mutation-testing infrastructure, not this closed unit.
actor: mike/codex
timestamp: '2026-07-18T13:07:50.651Z'
---

