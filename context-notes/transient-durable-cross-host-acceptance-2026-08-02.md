---
type: Context Note
title: Transient-to-durable cross-host acceptance passed
actor: openai/codex
timestamp: '2026-08-03T00:27:12.846Z'
---
# Summary

PASS on main commit 3b168247c8eecbe132f9d179b6681fcb55cb92c1.

A disposable cross-host acceptance harness exercised one exact active HTML source against one bundle:

1. MCP launched it transiently with bundle-propose and denied data before exact-byte authorization.
2. After authorization it queried Task heads, rendered canonical Markdown through render-document, subscribed, observed a mutation change, and completed a prepare-then-confirm scalar action.
3. save_transient_view persisted the server-owned bytes unchanged. The transient source version, durable entry version, and a fresh hash of the stored bytes were identical.
4. MCP discovered the durable registry ID, reopened the same bytes under a freshly unauthorized durable identity, authorized them separately, and completed a second governed scalar action.
5. The real web UI server consumed the same durable registry record from the same bundle, served byte-identical HTML through its nonce route, denied bridge data before authorization, authorized independently, rendered the same document, and completed its own prepare-then-confirm scalar action.
6. Real Chromium host-shell checks passed for both MCP and web confirmation UI: the write remained untouched until the trusted shell Apply choice, and the View received only the terminal result.

Focused results:
- disposable cross-host acceptance: 1/1
- MCP App native confirmation browser proof: 1/1
- web trusted-shell confirmation browser proof: 1/1
- CLI typecheck: pass

The disposable 378-line harness was intentionally not committed as permanent test bulk. Existing focused suites already pin each authority; the generated-contract deletion should add only the smallest permanent cross-host regression needed to protect the seam it removes.

## Decision

The active transient to exact durable to shared-host journey is proven. Deletion of the superseded generated-presentation contract is unblocked.

## Environment caveat

The MCP server already running in this ChatGPT task still advertises the older generated-only show_view schema, so it cannot exercise mode: transient or save_transient_view until that installed server is refreshed. That is an installation/version-refresh issue, not a failure of the current main implementation.
