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
timestamp: '2026-07-26T15:07:08.364Z'
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

# Implementation result

Implemented on `codex/experiment-mcp-apps`:

- private workspace package `@agentstate-lite/mcp-app`;
- `aslite mcp [--dir <path>]` using the official SDK's STDIO transport;
- one model-visible, read-only `show_view` tool and one fixed versioned App resource;
- explicit IDs only, capped at 20, with a 256 KiB combined generated-HTML/CSS limit and 1 MiB
  resolved-data limit;
- current frontmatter, body, and version snapshots resolved by core on every call;
- model-readable text fallback and structured App payload;
- fixed trusted shell plus sanitized, script-free nested `srcdoc` frame;
- declarative `data-aslite-text` bindings for object id, version, body, and frontmatter fields.

The first attempted containment mechanism—an opaque `blob:` child frame—rendered blank in the
official MCP Apps basic host. A nested `srcdoc` frame worked, but the first adversarial browser
probe was incomplete: generated JavaScript could not access the parent DOM or use `fetch`, yet it
could navigate its own child frame to an external URL and encode bundle data in that request.

The corrected implementation accepts script-free HTML and CSS as separate fields. The trusted shell
removes scripts, active elements, and navigation-bearing attributes; materializes only declared
text bindings from the selected envelope; escapes CSS raw-text breakouts; and loads the result in a
scriptless sandbox with `script-src 'none'`. In the official MCP Apps basic host, two successive
calls rendered distinct bound HTML, distinct CSS, and distinct object selections through the same
resource URI. A planted script and external link were absent in the rendered child, whose location
remained `about:srcdoc`. A separate `</style><script>…` CSS-breakout probe also produced zero script
elements and no navigation.

Repository verification passed with `npm run check`: the monorepo build/typecheck/test suites,
script gates, exact npm-tarball proof, generated-skill drift check, and browser E2E gate all exited
zero. The exact built CLI also completed a real SDK client connection over stdio in the committed
test suite.

# Recommended production boundary

Keep this branch experimental until independent review and a second real host proof. Preserve the
current narrow role: MCP renders conversational Views; the CLI remains the general agent data
surface. Do not add writes, queries, durable promotion, remote workspaces, or shared-runtime
extraction to this unit. Extract the existing trusted action/launch authorities only when the next
governed-action or durable-View slice has a real second consumer.
