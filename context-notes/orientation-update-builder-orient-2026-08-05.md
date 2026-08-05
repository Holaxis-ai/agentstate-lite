---
type: Context Note
title: Orientation update builder orientation
actor: codex-orientation-builder
timestamp: '2026-08-05T21:02:57.613Z'
---
# Summary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: implement the frozen N4 cached, nonblocking update-orientation contract without registry latency, protocol-output drift, or unsafe private-state/process mechanics. This serves the ultimate goal by removing founder-mediated supported-release awareness from ordinary return sessions.

## Restored system model

- The approved protocol is `designs/version-update-protocols` at `sha256:720d83897f47d02770bc575ada66668a1f71ab34bf7625cc2c179d1d7e29fd1d`.
- The approved plan is `plans/orientation-update-notice-implementation` at `sha256:93142a9c4bce5306038c643015efa1b3d50804ec4d7fc827d4d132f2a6c31c7f`.
- Eligible work is default bare/home/session-start only. JSON, MCP, ordinary commands, and every suppressor path must perform zero passive state/process work.
- One private owner must implement strict cache/check/lease schemas, handle-based hostile reads, exact permissions, atomic cache writes, hard-link no-replace active claims, continuous active-to-cooldown replacement, token-validated quarantine removal, detached exact-entry launch, and worker token revalidation before network and commit.
- Parent post-claim cache revalidation and continuous stale-active replacement are load-bearing parts of the one-worker-start-per-attempt-window proof.
- The output change is one exact five-field `update_notice`, immediately after identity, only for upgrade/rollback/deprecated cached states.

## Assumptions to verify in source

- `writeFileAtomic0600`, `credentialsDir`, `checkSupportedRelease`, and `currentExecutableRealPath` have reusable contracts matching the plan.
- Node's `fs.linkSync` gives the required atomic no-replace publication for same-directory temp and fixed path.
- POSIX owner/mode invariants can fail closed on supported platforms without weakening Windows behavior outside the promised boundary.
- Existing home/session-start injection seams can prove exact byte preservation and zero calls in JSON/suppressed paths.

No implementation or source mutation had occurred when this note was written. The separate init-target-safety-guard lane remains untouched.
