---
type: Context Note
title: Adversarial cache identity QA at a0dd5cb
actor: claude-cache-qa
timestamp: '2026-07-30T00:36:28.583Z'
---
# Summary

**QA APPROVED** for exact cache-only candidate `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea`, parent `77c84e4827f332cd8a84079d239dc76398b88959`. No blocking, major, or minor findings survived adversarial inspection and execution.

The candidate was tested in detached worktree `/private/tmp/aslite-cache-qa-a0dd5cb`. Its built MCP server and production CLI expose exactly one App-shell identity:

`ui://agentstate/view-host/v1/0599dbd7625f9ef281463d2dae64d07e4603fb8cdb68a510ddc8686bf38656ee.html`

That 64-character lowercase digest independently matches SHA-256 of the exact 740,804 returned UTF-8 HTML bytes. `show_view` metadata, `resources/list`, `resources/read` response URI, and returned content all agree. The old mutable URI and malformed/truncated aliases are not registered.

This QA approval does not replace the task’s required uninstrumented exact-SHA Claude Desktop acceptance.

Ultimate goal: make agentstate-lite a reliable local-first collaboration substrate whose conversational MCP Views behave correctly across supported hosts and whose work state survives agent/session boundaries.

Proximate goal: determine whether exact candidate App-shell bytes receive one immutable discoverable identity without changing bridge authority or lifecycle behavior. The candidate satisfies that goal.

## Findings

None.

## Attacks survived

### Discovery and delivery identity

An independent in-memory MCP probe against the built candidate and a separate stdio probe against the built production `packages/cli/dist/agentstate-lite.mjs` both established:

- `show_view._meta.ui.resourceUri` equals the full content-derived URI;
- `resources/list` registers exactly that one shell URI;
- `resources/read` accepts that URI and returns the identical URI in `contents[0].uri`;
- SHA-256 of returned `contents[0].text` is the digest embedded in the URI;
- returned HTML is 740,804 UTF-8 bytes;
- `ui://agentstate/view-host/v1.html` is rejected.

The built CLI contains zero old static URI literals and one content-derived `v1/` construction.

### Truncation, aliasing, and normalization

The server rejected every attempted alternate identity:

- old static `v1.html`;
- 32-character and 63-character truncated digests;
- uppercase digest;
- an extra slash;
- query-string and fragment variants.

The digest segment is exactly 64 lowercase hexadecimal characters. There is no truncation, prefix match, route template, case folding, redirect, or static compatibility alias at the candidate MCP server.

### Byte sensitivity

Independent Node `crypto` hashing produced distinct identities for:

- one appended ASCII space: `38264ac7359fbc54f1542275ecb172e6bb48f3c008ef43ba2ce5c3a77437fcfd`;
- one ASCII case change: `a78ab1ed5fb657bcde7dae2c009983e4a10de3f46c0bb81ac856e933d18ce114`;
- LF-to-CRLF conversion: `7b80befb47faf648dd2fc6e19306ba28e575f7105ad25c23533fd2939b74fc58`.

The production digest therefore follows the exact UTF-8 shell string rather than a normalized, shortened, or presentation-only projection.

### Build reproducibility

Two consecutive clean MCP App builds produced identical artifact hashes:

- `packages/mcp-app/src/generated/view-html.generated.ts`: `49830703cd0932bbb846eaaaa755ee5fddb84fa581e4e2aad16952eb9a3c3ded`;
- `packages/mcp-app/dist/generated/view-html.generated.js`: `7a918ce673b44927cd258b3db8d4d255886b1f84a67e701eee0486f06f226db6`;
- `packages/mcp-app/dist/server.js`: `7dc57289b85e6dca741c5c355dbe37dcdfffb696ed559b692269745884341f1f`.

Two production CLI builds likewise produced identical `packages/cli/dist/agentstate-lite.mjs` SHA-256 `96db5521d6a92d067728aaccfa2ab9af21d064ee43fe1f8790b74965435e06f7`.

A different toolchain that legitimately emits different HTML would select a different URI, which is safe cache separation rather than identity ambiguity.

### Alternate packaged identity audit

The committed plugin bundle in this PR tree still contains the parent’s static URI. This is expected repository staging, not a candidate runtime alias or QA finding:

- the plugin bundle is explicitly bot-owned and intentionally not written by feature-branch builds;
- `packages/cli/scripts/build-plugin-bundle.mjs` is its sole writer and uses the same generated-input preparation and bundle configuration as the verified production CLI build;
- the post-merge version-bundle workflow regenerates it and bumps plugin manifests when bytes change;
- the exact candidate-built CLI, which is the artifact used for pre-merge host acceptance, contains only the content-derived construction.

Installed-plugin acceptance must use the post-merge regenerated bundle; the required pre-merge Claude acceptance should continue to point at the exact candidate-built CLI.

### Scope and authority regression audit

The exact diff contains only:

- eight lines in `packages/mcp-app/src/server.ts`;
- test additions in `packages/mcp-app/test/server.test.ts`.

`view.ts`, contract, authorization, launch/epoch, frame-source, frame-load, sizing, durable-activity, polling, resume, and visibility implementations are byte-identical to the parent. The MCP contract suite continued to prove that authorize, bridge, poll, resume, close, prepare, finish, and resolve operations remain App-only while `show_view` remains model-visible. No invocation ID, authorization token, path, secret, or bundle identity enters the resource URI.

## Verification

- Exact SHA and detached worktree: PASS.
- `git diff --check`: PASS.
- MCP App build, twice: PASS and byte-reproducible.
- Production CLI build, twice: PASS and byte-reproducible.
- Independent built-server identity/alias probe: PASS.
- Independent built-CLI stdio discovery/read probe: PASS.
- MCP App unit suite: **56/56 PASS**.
- MCP App Chromium lifecycle/sizing suite: **8/8 PASS**.
- MCP App typecheck: PASS.
- Candidate tracked files remained clean; only the temporary ignored dependency link existed during QA and was removed afterward.

## Verdict and remaining gate

**QA APPROVED.** The candidate eliminates mutable resource identity for the exact built shell bytes and preserves all reviewed authority/lifecycle boundaries.

The cache task remains open until Brian validates the uninstrumented exact candidate in Claude Desktop: first Roadmap load, app-only bridge/poll traffic, Expand, Return inline, and background/restore behavior.

[verifies](../tasks/claude-desktop-durable-bridge-initialization.md)

[follows review](claude-cache-code-review-a0dd5cb.md)

[tests diagnosis](claude-bridge-probe-result-77c84e4.md)
