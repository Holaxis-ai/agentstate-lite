---
type: Context Note
title: Adversarial build identity QA orientation at 723ea52
actor: openai/codex-qa-build-identity
timestamp: '2026-07-31T22:24:27.933Z'
---
# Summary

QA target: exact reviewed commit 723ea5234b0677a55e81e8f68d83628cf2390694. No code edits or full repository gate are authorized.

Ultimate goal: make agentstate-lite reliable local-first shared memory whose executable and integrations are truthfully diagnosable.

Proximate goal: independently verify that the explicit production-entry registration repairs source executable path and SHA truth without causing any launch-confidence overclaim or regression in bundled identity projections.

System model: src/index.ts is the sole production entry and synchronously registers its canonical import.meta path before dispatch. Bundled registration names the emitted single-file mjs; source registration names src/index.ts. Invocation, build identity, home, hook, skill, PATH comparison, and MCP projections consume the same resolver. Helper-only imports retain a fallback because production entry registration never occurs.

Highest-risk assumptions: registration ordering precedes version dispatch; canonical symlink and PATH evidence remain correct; npx and source layout remain inferred rather than certain; missing or conflicting registration fails closed; reported SHA matches actual entry bytes. The former rejected command is the first oracle.

Context read: tasks/version-build-identity, designs/version-update-protocols section 1, Plan I1, the prior QA rejection, context-notes/version-build-identity-executable-path-system-model, and approved exact-SHA review context-notes/version-build-identity-code-review-723ea52. The task progress text still says Review is in progress, but the later commit-keyed review note explicitly records approval; this QA follows the later evidence.

Next: detached exact-SHA worktree, former source reproduction, compact built evidence matrix, registration boundary tests, optional MCP handshake, then immediate PASS or REJECT note and sync.
