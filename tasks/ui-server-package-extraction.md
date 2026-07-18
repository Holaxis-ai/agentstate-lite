---
type: Task
title: Extract the loopback UI server behind a typed workspace boundary
status: done
priority: '2'
description: >-
  SHIPPED: PR #91 merged as cd471d3 from independently reviewed exact head
  26f15c4. The loopback UI runtime now lives in private
  @agentstate-lite/ui-server; CLI policy remains in the CLI, and the UI restart
  harness uses a typed workspace dependency instead of reaching into CLI source.
  Hosted CI passed on Node 20/22/26. After PR #92 landed, the exact #91 head was
  merged locally into current main and the full combined npm run check passed,
  including all workspaces, npm artifact proof, skill drift, and Playwright
  14/14. No trusted View mutation capability was introduced.
actor: mike/codex
timestamp: '2026-07-18T13:07:50.474Z'
---
# Why

The loopback HTTP host behind `agentstate-lite ui` is a coherent runtime subsystem, but it currently lives inside CLI source. The UI package's SSE restart E2E needs the same `bootUiServer` seam and therefore reaches into `packages/cli/src/ui/server.js` through a deliberately non-literal dynamic import so the UI TypeScript program will not typecheck the CLI's Node-oriented source. That is a real reverse dependency and an unchecked package boundary.

# Sequence

Do this only after the board-git A1 workspace-package extraction has merged. Both units change the workspace dependency graph, root build ordering, esbuild aliases, and npm artifact proof; serializing them keeps integration failures attributable.

# Scope

Create a private workspace package for the reusable loopback UI server runtime. Move the cohesive server implementation behind its existing `bootUiServer` contract:

- loopback listener and request routing;
- proxy behavior;
- session/cookie checks;
- Page nonce/CSP handling;
- SSE hub and bundle watcher;
- Host validation;
- generic asset-serving behavior.

The CLI and UI E2E harness become normal, type-checked package consumers.

# Boundary

Keep CLI policy and adapters in `packages/cli`:

- `commands/ui.ts` argument handling, receipts, port selection, browser opening, and shutdown UX;
- `ui/url-file.ts` plus credentials/home-directory policy;
- generated embedded UI asset ownership;
- CLI-specific bundle display-name derivation.

Before moving files, add narrow injected seams for:

- the asset provider/table;
- the live bundle-display-name resolver.

Do not move all of `packages/cli/src/ui/*` blindly: `assets.ts`, `server.ts`, and `url-file.ts` currently cross those CLI-owned boundaries.

# Non-goals

- No user-visible `ui` behavior change.
- No session, cookie, Host, CSP, Page nonce, proxy, watcher, or SSE semantic change.
- No new network-exposed host mode.
- No requirement to publish the workspace package independently.
- No runtime dependency added to the packed CLI; esbuild must continue producing one self-contained artifact.

# Acceptance

- `packages/ui` imports `bootUiServer` through a declared workspace dev dependency; the non-literal CLI-source import is deleted.
- The extracted package has no imports from CLI source.
- An import-direction gate enforces that boundary with no allowlist.
- Existing CLI unit tests and UI restart/resilience/security E2E remain behaviorally equivalent.
- Root build/typecheck order and the esbuild source alias include the new workspace package explicitly.
- `verify:npm-package` still proves the packed CLI is one zero-runtime-dependency artifact and works offline.
- Full `npm run check` passes.

# Estimated size

Medium: roughly 1,060 runtime lines move, while approximately 100–250 lines should be genuinely new adapter, package, build, and boundary-test code. Prefer two reviewable units: introduce the injection seams first, then perform the package move and import rewiring.

[depends on](board-git-a1-extraction.md)
