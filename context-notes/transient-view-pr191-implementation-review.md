---
type: Context Note
title: 'Post-merge implementation review of transient active Views (PR #191)'
tags: 'review,transient-views,mcp-app'
actor: openai/codex
timestamp: '2026-08-02T19:34:51.996Z'
---
# Summary

A post-merge inspection reviewed PR #191 at merge commit `333f0b4` against the approved [unification design](../designs/transient-durable-view-unification.md), its [design review](../reviews/transient-durable-view-unification.md), and the shipped [launch task](../tasks/transient-active-view-launch.md). This inspection occurred after the independent pre-merge review recorded on the task and found follow-up issues that were not recorded there.

The core implementation is sound and should not be reverted. Transient HTML has a discriminated identity with no synthetic registration, exact admitted-byte hashing, bundle-scoped authorization identity, bounded process-local launch storage, authorization before bundle data, and the shared active iframe, bridge, polling, suspension, resume, renderer, and recovery path. The MCP adapter injects a separate `SessionViewAuthorizationStore`; its integration test proves the persistent registered-View store receives zero transient calls. Existing registered and generated behavior remains intact, and CI was green on the merged PR.

The highest-priority finding is at the human trust boundary. The authorization dialog uses static registered-View prose for every active View: `This registered View contains executable HTML.` A transient View is agent-authored and process-local, so this copy misstates its provenance exactly when the human decides whether to grant `bundle-read`. The source field does say `Transient process-local View`, but the contradictory body fails the approved design requirement for honest transient approval UX. Fix this immediately in a small follow-up by using source-aware copy, explicitly describing transient HTML as agent-authored and process-local, and add a UI-level regression test.

A medium-priority runtime API footgun remains. `PageBridgeLaunchAuthority` defaults its transient authorization store to the registered authorization store. The current MCP path is safe because it passes a separate session store, and the CLI persistent store rejects transient subjects, but the shared authority does not make process-local transient approval mandatory. A future host or generic persistent store could accidentally retain transient approvals. Require an explicit transient store or have the authority own a session-only transient store before another host adopts this source kind.

The lower-priority hardening issue is that `PageLaunchRegistry` copies input bytes but returns and resolves the same mutable launch object. Metadata and the `Uint8Array` remain mutable even though the design calls for an immutable, hash-addressed in-memory source record. Currentness checks reduce the immediate risk and the MCP boundary does not expose the object, but immutable launch state should be enforced, preferably alongside exact-byte save if that stays a small coherent change.

Recommended order: correct the approval prompt now; harden authorization-store construction before any second transient-capable host; fold launch immutability into exact-byte save when practical. The inspection was performed against the immutable merge commit and did not alter or test the dirty exact-byte-save working branch.
