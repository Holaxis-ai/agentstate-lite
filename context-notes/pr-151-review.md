---
type: Context Note
title: 'PR #151 exact-SHA review'
actor: codex-reviewer-151
timestamp: '2026-07-22T23:33:03.805Z'
---
# Summary

Ultimate goal: make AgentState Lite a local-first, conflict-safe, human-visible Markdown knowledge bundle and agent CLI through which agents retain knowledge and humans can understand and steer the work.

Proximate goal: independently review PR #151 at exact SHA `636267916635239ce4e3c8fe4fd9594ea1e13895` and determine whether its first-run orientation, empty Views, and empty Activity changes improve newcomer comprehension without violating the settled home-surface truth, jargon, accessibility, responsive-layout, or executable-command contracts; this serves the ultimate goal by protecting the product's first human-facing explanation.

Current state: PR #151 targets current main `59608beda143d1f69c7b8f5ea2f8745ce5b39db0`, changes four UI source/test files, is merge-clean, and has green exact-SHA CI on Node 20/22/26. The live `tasks/launcher-first-run-onboarding` unit is already done; this PR is post-ship copy/style refinement against `designs/home-surface`. The design requires first-run orientation without OKF jargon, a one-screen budget, truthful local-only framing, and plain-language progressive disclosure. Review will inspect the full diff, audit test intent, run focused checks in an isolated worktree, and render the empty first-run UI at desktop and narrow widths. No GitHub review will be posted unless Brian asks.

Progress: review complete at exact head `636267916635239ce4e3c8fe4fd9594ea1e13895`. Fresh `npm ci`, the root build, the UI unit suite (157/157), and `git diff --check` passed in detached worktree `/private/tmp/aslite-pr151-review.PybzO6`; exact-SHA CI run 29964762928 is green on the Node 20 smoke and Node 22/26 gates. Source-contract review found three merge-blocking copy defects: (1) the empty Views explanation falsely universalizes one capability model even though `bridge:none` has no bundle data/live refresh and `bundle-propose` can request a trusted-shell-confirmed scalar edit; (2) the empty Activity example says it can show Codex implementing code, while the feed consumes only document-head metadata and cannot observe git/code events or render task status; (3) the agent-connect commands default to project scope at the exact `process.cwd()`, while `ui` can discover a bundle from a nested directory or mount it via `--dir`, so the unqualified commands can silently install into the wrong directory. The settled design also says first-run orientation should avoid OKF jargon, but the new copy introduces the undefined phrase “OKF standard”; include this as a lower-priority design-contract finding.

Visual review limitation: a fresh initialized bundle was built and served successfully on loopback, but the mandated in-app browser reported no available browser (`agent.browsers.list()` returned `[]`). Per the browser skill, no unrelated browser automation was substituted, so desktop/narrow rendered inspection remains unavailable; this is an environment limitation, not a PR failure.

Verdict: request changes for the three correctness defects above (plus the explicit no-OKF-jargon contract). No GitHub review was posted.

[reviews](../tasks/launcher-first-run-onboarding.md)

[grounded in](../designs/home-surface.md)
