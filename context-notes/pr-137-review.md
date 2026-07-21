---
type: Context Note
title: 'PR #137 exact-SHA review'
actor: codex-reviewer-137
timestamp: '2026-07-21T20:23:47.194Z'
---
# Summary

Ultimate goal: agentstate-lite is a shared, open, portable knowledge substrate where humans and agents co-create, with human visibility and mediation.

Proximate goal: close the pre-empted PR #137 review honestly and preserve actionable follow-up evidence. This serves the ultimate goal by preventing a stale partial review from being mistaken for a merge-gate verdict.

Outcome: PR #137 merged at affecd885f7de42a1791d54ab584098c9ee25103 on 2026-07-21T17:17:16Z before Codex delivered a verdict. The pinned review target was b3b10eea96a41c101a492d68e29d42359a8d5858; the PR head moved afterward to 66477a0f08bdb371b437dc4436d17a72b353261f. Therefore this review did not cover the merged exact head and must not be represented as an approval or rejection.

Verified on the earlier pinned head: root install and build passed; CLI sharing tests passed 11 of 11; ui-server config tests passed 4 of 4; Launcher, ActivityFeed, and format tests passed 25 of 25; the exact pinned SHA Node 20, 22, and 26 CI was green.

Post-merge follow-up risks confirmed statically to remain in final head 66477a0:

1. Remote onboarding contradiction: ui-server returns root equal to remoteBase in remote mode, while Launcher assumes remote config.root is null to suppress local-only first-run copy. A first-time remote user can therefore see the privacy promise beside a hosted state.
2. Sharing-chip freshness gap: the SPA has no periodic config refetch; it invalidates config only for document SSE changes or stream resync, while the sharing loader caches for 30 seconds. A git-only sharing-state change can emit no document event, and an invalidation inside the TTL can display old truth without a scheduled retry after expiry.
3. Git-probe failure can fabricate privacy: repoTopLevel collapses every nonzero git rev-parse result to null, and classifySharing maps null to private. Failures other than not-a-repo therefore become a privacy claim instead of unavailable, contrary to the stated truth rule.

Process diagnosis: the live review front-loaded orientation, durable setup, and bespoke proof construction. Two probe-edit attempts stalled, and no provisional blocker or no-blocker signal was delivered before the merge. In an asynchronous project where maintainers continue merging while the owner is away, review needs a bounded first-response protocol rather than depending on owner presence or an unbounded full review.
