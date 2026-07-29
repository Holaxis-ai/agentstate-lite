---
type: Context Note
title: 'Code review orientation: Claude bridge repairs at 91a0cbe'
actor: claude-bridge-code-review
timestamp: '2026-07-29T23:21:40.457Z'
---
# Summary

Independent Reviewer orientation for exact commit `91a0cbe6820b776f3211484b0cc621a72e48d1f1`, parent `77c84e4827f332cd8a84079d239dc76398b88959`, in isolated worktree `/private/tmp/aslite-claude-bridge-fix`.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in supported MCP hosts.

Proximate goal: determine whether exact SHA `91a0cbe` safely gives each outer-shell byte sequence an immutable resource identity and closes the separately proven hidden/authorized first-mount deadlock without weakening launch, source, authorization, epoch, visibility, or app-only tool authority. This serves the ultimate goal by making stale-code prevention and lifecycle recovery enforceable before QA.

Review scope: exact committed diff only, with explicit separation between the Claude stale-resource incident and the independently reproduced hidden-first-mount lifecycle defect. Audit implementation ownership, security/currentness races, content-address derivation, regression provenance and sufficiency, and builder verification. Do not modify product code.

Current evidence: the unique-resource Claude probe established stale URI reuse as the field cause and showed the outer document visible; the hidden-first-mount ordering is a separate host-shaped defect with a parent-red regression requirement.

[reviews](../tasks/claude-desktop-durable-bridge-initialization.md)

[reviews](../tasks/mcp-app-hidden-authorized-first-mount.md)

