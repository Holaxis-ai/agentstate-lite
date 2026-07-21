---
type: Plan
title: 'Implementation plan — PR #137 post-merge home truth fixes'
actor: codex-main-home-truth
timestamp: '2026-07-21T21:50:17.794Z'
---
# Goal

Ultimate goal: make agentstate-lite the plain-text, local-first, conflict-safe memory through which agents retain and share knowledge, with a home surface humans can trust.

Proximate goal: repair the three post-merge PR #137 truth gaps so the home never applies local privacy copy to hosted state, sharing-state freshness is bounded without document activity, and indeterminate Git evidence never becomes a private claim.

# Domain model

- Runtime mode: dir serves a local bundle; remote proxies a hosted origin. Mode, not root shape, is the authority for local-only behavior.
- Bundle root: a filesystem identity used for local orientation persistence. remoteUrl identifies a hosted server; it is not proof of a local root even if the config currently mirrors it into root.
- Sharing summary: a server-owned plain-data state with classification kind, evidence timestamp as_of, and optional re-evaluation interval supplied by the classifier owner.
- Classification cache: protects the config endpoint from repeated synchronous Git probes. Its TTL bounds probe frequency, not UI truth by itself.
- Refresh scheduler: the SPA schedules the next config request from the summary evidence timestamp plus the server-provided interval. SSE remains an eager invalidation path, not the only path.
- Repository discovery: no Git marker means no repository; a failed Git probe with an enclosing marker is indeterminate and must surface as unavailable.

# Invariants and acceptance

1. Remote orientation: local privacy onboarding is eligible only when mode is dir and a local root exists. The remote disclosure remains usable.
2. Bounded freshness: dir-mode sharing summaries expose their refresh interval; the SPA derives remaining time from as_of so a cached response cannot restart a full TTL. Hosted summaries do not cause polling.
3. Failure truth: repoTopLevel returns null only when no enclosing Git marker exists. A nonzero probe inside an apparent repository throws; classifySharing catches it and returns unavailable.
4. Every regression is red-pinned with deterministic tests. The repository gate remains green.

# Implementation sequence and ownership

1. Builder codex-main-home-truth implements [remote orientation](../tasks/home-remote-orientation-truth.md) in Launcher state gating and Launcher tests.
2. Builder adds an optional refresh_after_ms field to the ui-server sharing shape, populates it from createSharingLoader, derives a pure SPA refresh-delay function from as_of plus that interval, wires dynamic query refetch, and covers [sharing freshness](../tasks/home-sharing-chip-refresh.md) with fake-time/unit tests.
3. Builder strengthens board-git repository discovery and adds board-git plus CLI classifier regression tests for [Git probe failure truth](../tasks/home-git-probe-failure-truth.md).
4. Independent Reviewer audits the exact implementation SHA after the targeted tests and build pass. Any blocking finding returns to the Builder.
5. Independent QA runs only after Review approval, samples each acceptance criterion, then runs npm run check from the isolated worktree.
6. Builder commits any review corrections as a new exact SHA, repeats Review before QA if behavior changed, pushes a descriptive feature branch, and closes all three Task docs with commit and gate evidence.

# Dependencies and parallelism

The three code fixes are behaviorally independent but share config and Launcher types, so one Builder integrates them serially to avoid type-contract collisions. Review depends on the committed implementation. QA depends on Review approval. Bundle task closure depends on the final pushed SHA and passing QA.

# Non-goals

No plugin manifest bump, no committed plugin-bundle rebuild, no PR creation, no change to hosted policy, and no removal of the remote location disclosure.
