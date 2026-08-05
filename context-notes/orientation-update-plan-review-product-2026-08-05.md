---
type: Context Note
title: Product review of N4 implementation plan
actor: codex-orientation-product-architect
timestamp: '2026-08-05T20:57:05.488Z'
---
# Summary

Focused re-review verdict: **ONE REMAINING REQUIRED CORRECTION** on amended plan `sha256:85b231826a247f3f973697cb4527fcdcfe50fb9016057dda600806cffd84dd89`.

F2–F6 are fully closed. F1's original defect—an unavailable result permitting a new attempt on every later orientation—is substantively closed by the same-path `active | cooldown` union and original 24-hour attempt-window expiry. The remaining issue is a literal invariant mismatch in the quarantine transition, not the prior success-only-cache defect.

Ultimate goal: preserve an installable, local-first orientation surface whose background release awareness is bounded and cannot interfere with agent work.

Proximate goal: ensure the coordination mechanism claims exactly what its race protocol can prove before Builder encodes it.

# F1 disposition — substantive daily throttle closed; literal start-count claim still mismatched

The amended Decision/protocol/plan now preserve the 24-hour window after unavailable checks and interruption:

- `active` includes both 30-second authority and the original 24-hour cooldown expiry;
- unavailable transitions to same-path cooldown;
- stale active retains the original attempt window;
- live active/cooldown prevents another authorized refresh;
- expired cooldown is cleanup-only, with acquisition deferred to a later visit;
- successful cache TTL prevents a new attempt after active removal.

That closes the original F1 failure path.

However, the protocol still says “At most one eligible process starts one worker per attempt window,” while the plan explicitly accepts this quarantine race: the fixed entry is renamed away, a successor may publish during the gap, and that successor may then be captured/lose authority. Token revalidation can prove that the captured successor performs no U3/cache work, but the detached process may already have been spawned. In a tighter schedule it may pass its pre-network check before capture and begin U3 as well; the plan needs the barrier test to establish which outcome is actually guaranteed rather than assuming the capture always wins.

Required correction—choose one:

1. Amend Decision/protocol/plan language to the mechanically supportable invariant: **at most one matching, unexpired worker is authorized to perform U3/cache work per attempt window; any raced detached invocation that loses the fixed token exits zero-work**. The controlled race test must prove the network/check spy is called once, not merely that the eventual cache is singular; or
2. Replace the gap-producing transition with a mechanism that genuinely proves one detached process start per window.

The first option is the smaller proportional change and preserves the product requirement: no repeated registry attempts, no duplicate cache authority, and no render delay. Until the wording/test oracle agrees, the Builder has two incompatible definitions of “one worker start.”

# F2–F6 disposition

- **F2 closed:** worker revalidates matching unexpired active authority before U3 and immediately before cache commit; parent best-effort releases only matching active state on spawn throw/error; controlled quarantine races are in the battery.
- **F3 closed:** exact notice order is frozen immediately after `agentstate-lite`; no-notice/JSON/ordinary/MCP/unrelated errors retain bytes; only narrow flag/privacy help and generated-skill changes are authorized.
- **F4 closed:** exact-token prescan precedes forgiving parsing, near-matches do not suppress, bare/global routing is named, normal tests/harnesses globally suppress, and focused invocation includes `ASLITE_NO_UPDATE_CHECK=1` with isolated opt-in tests.
- **F5 closed:** canonical round-trip instants, recursive exact keys, symmetric 65,536/4,096 reader+serializer bounds, handle-based no-follow/nonblocking bounded reads, safe missing-directory creation, and unsafe-existing-directory refusal are explicit.
- **F6 closed:** malformed/missing hidden tokens are silent zero-cache/lease/network/public-render exits; exact Node/current-entry argv and private non-registration are pinned.

# Other disposition

- Architecture ownership, exact current-entry worker launch, fixed U3 request/privacy boundary, 64 KiB proportionality, docs scope, and Review → QA → repository-gate ordering are approved.
- Any repair after exact-SHA Review correctly invalidates the verdict and returns to Review before QA.

# Confidence

High (0.93). The only remaining question is whether the contract intends “worker start” to mean OS process spawn or post-token authorized refresh work. The current prose uses the former while the accepted race can prove only the latter.
