---
type: Plan
title: 'Implementation plan — PR #137 post-merge home truth fixes'
actor: codex-main-home-truth
timestamp: '2026-07-21T22:00:06.175Z'
---
# Goal

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe memory through which agents retain and share knowledge, with a home surface humans can trust.

Proximate goal: repair the three post-merge PR #137 truth gaps so the home never applies local privacy copy to hosted state, sharing-state freshness is bounded without document activity, and indeterminate Git evidence never becomes a private claim.

# Domain model

- Runtime mode: dir serves a local bundle; remote proxies a hosted origin. Mode, not root shape, is the authority for local-only behavior.
- Bundle root: a filesystem identity used for local orientation persistence. remoteUrl identifies a hosted server; it is not proof of a local root even if the config currently mirrors it into root.
- Sharing summary: a server-owned plain-data state with classification kind, evidence timestamp as_of, and an optional refresh_after_ms supplied by the classifier owner.
- Classification cache: protects the config endpoint from repeated synchronous Git probes. Its TTL bounds probe frequency, not UI truth by itself.
- Refresh scheduler: the SPA schedules the next config request from the summary evidence timestamp plus the server-provided interval. SSE remains an eager invalidation path, not the only path.
- Interceptor state: unauthorized, session_expired, and rate_limited are terminal for every query poll. A per-query sharing scheduler must compose this global stop condition rather than override it.
- Detailed repository probe: a new non-breaking board-git result distinguishes repo, not_repo, and unavailable. The legacy repoTopLevel wrapper keeps its current fail-soft null behavior for heterogeneous sync, repair, autopull, home, and session callers. The sharing classifier opts into the detailed result because its privacy claim requires stronger evidence.

# Invariants and acceptance

1. Remote orientation: local privacy onboarding is eligible only when mode is dir and a local root exists. The remote disclosure remains usable.
2. Bounded freshness: dir-mode sharing summaries returned by createSharingLoader expose refresh_after_ms equal to their positive cache TTL; hosted summaries omit it and do not poll.
3. Scheduler safety: any non-ok interceptor state disables the config interval. With an ok interceptor, a missing, non-finite, or nonpositive refresh_after_ms disables polling. A valid interval is clamped to a five-minute maximum. Invalid or missing as_of schedules from response time at the clamped interval; a future as_of has zero age; an already-expired response retries at a positive 250ms floor. A normal cached response schedules only its remaining lifetime, so receiving cached evidence cannot restart a full TTL.
4. Failure truth: the detailed repository probe returns not_repo only when no enclosing Git marker exists. A nonzero rev-parse with an enclosing marker returns unavailable with a bounded reason. classifySharing maps that result to unavailable. The legacy repoTopLevel contract and its callers remain unchanged.
5. Every regression is red-pinned with deterministic tests. The repository gate remains green.

# Implementation sequence and ownership

1. Builder codex-main-home-truth implements [remote orientation](../tasks/home-remote-orientation-truth.md) by gating Launcher orientation state and rendering on dir mode plus local root. Launcher tests cover remote config with a non-null root and normal local first run.
2. Builder adds optional refresh_after_ms to the ui-server SharingSummary shape; createSharingLoader attaches its TTL to every cached result. A pure SPA sharingRefreshDelay function implements the exact scheduler rules above, including getInterceptorStatus as a hard stop, and drives TanStack dynamic refetchInterval. Unit tests pin every guard row and each terminal interceptor state; a fake-time Launcher test proves a changed result for [sharing freshness](../tasks/home-sharing-chip-refresh.md) is fetched after TTL without any SSE event.
3. Builder adds a non-breaking detailed repository probe beside repoTopLevel in board-git, with marker-aware failure classification. Existing repoTopLevel delegates while preserving null-on-any-non-repo-result semantics. The sharing classifier consumes the detailed probe. Board-git and CLI tests pin malformed-repository unavailable plus true no-repository private for [Git probe failure truth](../tasks/home-git-probe-failure-truth.md).
4. Independent Reviewer audits the exact implementation SHA after the targeted tests and build pass. Any blocking finding returns to the Builder.
5. Independent QA runs only after Review approval, samples each acceptance criterion, then runs npm run check from the isolated worktree.
6. Builder commits any review corrections as a new exact SHA, repeats Review before QA if behavior changed, pushes a descriptive feature branch, and closes all three Task docs with commit and gate evidence.

# Dependencies and parallelism

The three code fixes are behaviorally independent but share config and Launcher types, so one Builder integrates them serially to avoid type-contract collisions. Review depends on the committed implementation. QA depends on Review approval. Bundle task closure depends on the final pushed SHA and passing QA.

# Non-goals

No global repoTopLevel behavior change, no plugin manifest bump, no committed plugin-bundle rebuild, no PR creation, no change to hosted policy, and no removal of the remote location disclosure.
