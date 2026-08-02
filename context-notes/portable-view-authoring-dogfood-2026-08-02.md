---
type: Context Note
title: Fresh-agent portable View authoring dogfood — successful cross-host proof
actor: openai/codex
timestamp: '2026-08-02T17:43:01.626Z'
---
# Summary

A fresh agent with no AgentState repository-source context authored and promoted one durable
`Latest documents` View in the separate `holaxis-strategy` bundle using only the installed
AgentState skill and shipped View contract. No live protocol coaching was required.

The same registered View was then proved through both shipped host adapters:

- registry id: `views-registry/latest-documents`
- HTML blob: `views/latest-documents.html`
- HTML version: `sha256:2d80a0c98a6b9b0f9407222788b376ea9059081ade65c161d8908b260523691d`
- registry version: `sha256:c990d5c00fdffe09d46ea85078115df118a57fc63fc0c9cd63001a8add43bdf2`
- access: `bundle-read`

# What was proved

- The local web host loaded the View after exact-byte approval, returned all 68 matching rows,
  sorted the fetched window by timestamp, and rendered a selected document through the standard
  `render-document` bridge result.
- The selected body preserved canonical headings, lists, inline code, and inert concept markers.
- At a 480px viewport the View switched to a single-document layout with an explicit back-to-list
  affordance; at 1440px it showed list and selected document together.
- The installed 1.0.141 CLI launched the exact same registered source version over real stdio MCP,
  authorized it, and rendered the same canonical document/version.
- The View contains no local Markdown parser and no web/MCP source fork.

# Observed friction

## Stale PATH executable won skill resolution

The installed skill resolver selected `/opt/homebrew/bin/agentstate-lite`, which was old enough to
reject the skill's documented `version` command, even though the current 1.0.141 skill-bundled shim
was available. The agent recovered by locating and using that shim. This is empirical evidence for
[skill compatibility and stable MCP launch](../tasks/skill-mcp-compatibility.md), not a reason to
add a partial PATH-precedence patch outside the approved npm identity/update contract: a proper fix
must compare compatibility, not merely whether one historical command happens to exist.

## Bounded query precedes client-side timestamp ordering

The bridge guarantees a deterministic bounded query and total `count`, but not timestamp ordering
before applying `limit`. The View therefore requests at most 100 rows, sorts that returned window,
and explicitly tells the human when matches were omitted before sorting. This is honest and fully
useful in the 68-document trial bundle. A server-side sort contract should be considered only when
a real larger-bundle journey requires globally latest-N selection; the proof does not justify that
new mechanic yet.

## Optional presentation field absent from this bundle's convention

The target bundle's older View convention does not declare `presentation`. The agent correctly
omitted it and implemented adaptive behavior in the portable HTML/CSS. Runtime eligibility and
usability were unaffected.

# Decision

The portable authoring guidance is sufficient for this journey. No View-runtime code change is
justified by the proof. Close
[portable View authoring guidance and dogfood](../tasks/mcp-view-authoring-guidance.md); route the
only material product bug to the already-approved npm skill-compatibility unit.

[roadmap](../roadmap-items/conversational-mcp-views.md)
