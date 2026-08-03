---
type: Task
title: Complete open-page navigation parity in the MCP View host
status: todo
priority: '1'
actor: openai/codex
timestamp: '2026-08-03T01:28:49.318Z'
---
# Behavioral claim

A registered or transient active View running in the MCP host can emit the existing `open-page` bridge request for a registered View ID, and the trusted fixed shell replaces the source launch with a fresh target launch inside the same MCP App resource. The same View bundle therefore has the same navigation behavior in web and MCP without invoking the model.

# Existing authorities to reuse

- Reuse `BridgeService` in `packages/view-runtime` for request parsing, bounds, and the validated `openPageId` target intent. Do not add a second parser, command spelling, or View-side protocol.
- Reuse the shared View catalog and registration/admission authority to decide whether the target ID exists and is launchable.
- Reuse the existing MCP registered-View launch, currentness, approval, and bundle-read lifecycle rather than building a navigation-only launch path.
- Use the completed [web navigation task](ui-page-navigation.md) and `PageFrame` tests as the behavioral precedent for one-shot navigation, stale-source fencing, and independent target authorization. Reuse semantics, not web-router implementation details.
- Follow the governing [portable View model](../designs/unified-portable-view-model.md) and [MCP View security model](../designs/mcp-view-security-model-unification.md).
- If the fixed MCP shell needs a server round trip to resolve the target, add the narrowest app-only lifecycle transport necessary to request and receive a fresh target launch. Do not add a model-visible `open_page` tool and do not route navigation through the generated presentation contract.

# Required lifecycle and security behavior

- The source View receives no target HTML, metadata, nonce, approval state, or launch authority.
- Target authorization is independent: source approval never approves the target.
- Fence or revoke the source launch epoch before awaiting target resolution.
- Consume at most one navigation request per source generation.
- Delayed, duplicate, stale, or concurrent navigation responses cannot replace a newer launch.
- Deletion, entry retargeting, content change, access downgrade, expiry, teardown, and an unsupported or missing target fail closed and leave the shell in a clean state.
- Both registered and transient source Views can navigate, but the target must be a currently registered, launchable View.
- The MCP host swaps launch state within its fixed App resource; browser URL/history parity is not required.

# Acceptance criteria

- A shared agreement fixture exercises the same source bundle and registered target ID in web and MCP, with both hosts selecting the same target.
- In MCP, `open-page` switches the fixed shell to a fresh target launch without a model call.
- A target requiring approval presents its own approval flow, and target bundle bytes are unavailable until that approval succeeds.
- Once navigation begins, the retired source cannot act, poll, navigate again, or affect the target through delayed messages or responses.
- Malformed, missing, deleted, downgraded, expired, or otherwise unlaunchable targets produce a bounded bridge error and never expose target data.
- The model-visible MCP tool inventory is unchanged.
- Automated tests cover one-shot consumption, independent authorization, stale-source fencing, concurrent navigation, delayed target responses, teardown, and currentness failures.
- Repository typecheck, lint, unit, lifecycle, generated-artifact, and browser verification gates pass.
- Because this changes trust and lifecycle mechanics, obtain an independent exact-SHA review plus adversarial QA before merge.

# Non-goals

- Arbitrary URL navigation.
- `open-doc` behavior.
- Nested View execution.
- Passing arguments or source data to the target.
- Deleting or redesigning the generated presentation contract.
- Adding a model-visible navigation tool.
- Exact browser-history behavior in MCP.

# Design status

No new design is required. The portable View and MCP security designs already decide the host boundary, target-intent contract, independent authorization, and lifecycle fencing. If implementation reveals an unresolved authority or transport decision that would change those semantics, stop and amend the governing design before coding around it.
