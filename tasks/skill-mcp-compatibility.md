---
type: Task
title: Add skill compatibility and prove stable MCP launch
status: done
priority: '1'
description: >-
  Completed at exact SHA 681e285 after PR 204 integration: independent review,
  adversarial QA, clean-checkout full gate, and GitHub Node 20/22/26 CI all
  PASS; PR 205 is ready for review.
actor: codex-c2s-orchestrator
assignee: codex-c2s
timestamp: '2026-08-04T19:47:26.185Z'
---
# Goal

Add additive skill compatibility receipts and prove the bounded stable MCP PATH/handshake contract without claiming arbitrary host-config inspection. This is C2S.

# Acceptance

- Exact Manifest v2 plus legacy parser/ownership compatibility; current state strings/top-level version retained.
- Asset bytes and skill contract—not informational provenance—decide compatibility.
- Persistent npm-package install requires fail-closed `durable_global` evidence; unmanaged targets are never overwritten/deleted.
- `aslite mcp` handshake reports the running release and generic legacy cache-path guidance is emitted only on bounded help/docs/receipt surfaces.

# Gate

Builder → independent exact-SHA Review → adversarial owned/unmanaged/legacy/partial/no-write QA → repository/package/MCP gates → Brian-owned PR/merge.

# Outcome

Completed on `feat/skill-mcp-compatibility` at exact SHA `681e285cd802c885f57a05d3109cf8eeb2fbe70d`, rebased onto PR 204's merge commit `c5c1876d14c9c7aeffdb0da37b598052f2fd1fa3`.

- Manifest v2 compatibility and legacy ownership parsing are additive; existing state strings and top-level version behavior remain intact.
- Persistent skill installation is fail-closed and requires durable-global runtime evidence; unmanaged, malformed, higher-contract, and unsafe-path targets remain untouched.
- The CLI help, generated npm/plugin skills, and human release-stage summary use one shared stable MCP launch-guidance authority.
- The immutable `aslite.stage-receipt.v2` JSON schema and release authorization chain are unchanged; guidance appears only in the human Markdown projection.
- Independent exact-SHA review: PASS with no findings.
- Adversarial QA: PASS, including authority agreement, unsafe-path/no-write probes, real receipt generation, built help, package proof, and literal-PATH MCP launch.
- Final clean-checkout `npm run check`: PASS, including all workspace tests, 127 script/release tests, offline npm-package proof, generated-skill check, 15 MCP browser tests, and 19 UI/security end-to-end tests.
- PR 205 is ready for review at the exact reviewed SHA. GitHub CI is green: Node 20 built-CLI smoke, Node 22 repository gate, and Node 26 repository gate all passed. Brian retains the merge gate.

[final exact-SHA review](../context-notes/c2s-exact-sha-review-681e285.md)

[final adversarial QA](../context-notes/c2s-adversarial-qa-681e285.md)

[release-receipt integration](../context-notes/c2s-release-receipt-integration-681e285.md)

[pre-integration exact-SHA review](../context-notes/c2s-exact-sha-rereview-cd3d330.md)

[pre-integration adversarial QA](../context-notes/c2s-adversarial-qa-cd3d330.md)

[implementation plan](../context-notes/c2s-implementation-plan-2026-08-03.md)

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](version-build-identity.md)
