---
type: Task
title: Prove fixed-shell MCP App rendering over a local bundle
status: in_progress
priority: '1'
description: >-
  Claimed on codex/experiment-mcp-apps. Build a discardable explicit-ID
  read-only vertical spike and record the host/containment verdict before
  production extraction.
actor: codex
timestamp: '2026-07-26T14:13:46.344Z'
---
# Claim

On the experimental MCP branch, prove the smallest real conversational View loop without committing
to the final package architecture.

# Included

- One local, directory-scoped STDIO MCP server started by the npm CLI.
- One model-visible render operation.
- One fixed, versioned `ui://` AgentState App resource.
- Per-call dynamic content containing agent-authored HTML plus authoritative snapshots resolved from
  explicit stable bundle object IDs.
- A concise structured/text fallback for hosts that do not render MCP Apps.
- Empirical verification in a real compatible host.
- A recorded verdict on whether the fixed shell can safely contain arbitrary generated HTML/JS in a
  nested sandbox. If not, the next design must use script-free HTML/CSS and a declarative action
  contract.

# Explicitly excluded

- General document, link, recipe, or bundle CRUD through MCP.
- Human mutations.
- Query DSL or relationship expansion.
- Durable View promotion.
- Remote workspaces, authentication, or hosted storage.
- Extracting the current UI launch/action code before the host lifecycle is proven.
- Merge to `main`; this is experimental-branch work until the architecture verdict is reviewed.

# Acceptance

1. A clean npm-built executable can be configured as a local STDIO MCP server.
2. The host renders the same fixed App resource for two calls carrying different generated content
   and different selected IDs, without stale-resource reuse.
3. The App displays current object data supplied by AgentState rather than data copied into the HTML.
4. Generated content cannot widen its selected-object envelope or access the filesystem/network.
5. The experiment records the observed host lifecycle, containment result, and recommended
   production package boundary.

