---
type: Context Note
title: Parallel work recommendation while PR 204 finishes
actor: codex-board-review
timestamp: '2026-08-04T00:37:10.642Z'
---
# Summary

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their
agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the
harness.

## Proximate goal

Select work that advances the highest-priority product path without colliding with the team fixing
PR 204. This serves the ultimate goal by preserving safe parallel throughput instead of creating
merge and ownership contention around release automation.

## Current state

- PR 204 implements P5A retained-artifact staged npm release automation. It is open, merge-clean,
  and CI-green, but the board still records changes requested and assigns the fix round to the
  Codex team.
- Its files are release workflows/scripts plus `packages/cli/build.mjs`, CLI/package manifests,
  and verifier/release tests.
- I1 (`tasks/version-build-identity`) is done.
- The approved distribution DAG explicitly permits C2H, C2S, U3, P5A, and P5B to proceed in
  parallel after I1.

## Recommendation

1. First choice: `tasks/skill-mcp-compatibility` (C2S). It is P1, ready after I1, and unblocks both
   the first contract release and npm quickstart. Keep the branch in skill/MCP ownership files and
   avoid `packages/cli/build.mjs`, package manifests, release scripts, and workflows while PR 204 is
   moving.
2. Best independent onboarding choice: `tasks/init-target-safety-guard`. It is P1, already assigned
   to Brian/Claude, has no P5A dependency, and unlocks the guide facade plus quickstart. Expected
   ownership is init/bundle target-resolution code and focused tests, outside PR 204's files.
3. Another release-critical sibling if capacity remains: `tasks/supported-release-check` (U3). It
   is P1, read-only, ready after I1, and unblocks N4 plus the first contract release. Its likely
   owner is the version command/registry client and focused tests, not release workflows.
4. Safe partial work: prototype the guide curriculum, Recipe source assets, read-only View, and
   fresh-user walkthrough. Defer built-in registration and `prepareCliBundleInputs`/build integration
   until PR 204 lands because PR 204 edits `packages/cli/build.mjs`.

## Do not start in this window

- P5B, P5S, P5A pre-live hardening, R6A, or other release workflow/protection units: they are
  adjacent to or downstream of PR 204 and increase coordination/file contention.
- npm quickstart: it still depends on C2S and the create-only guard.
- MCP install: its task explicitly waits for the durable compatibility unit.
- Full guide integration: its build-time embedding path is the one onboarding area with a likely
  collision against PR 204's CLI build changes.
- Any task already in progress on the board.

## Practical allocation

With one available implementation team, claim C2S. With two, run C2S and the create-only guard in
parallel. Treat guide content as a prototype/research lane until those safety and package seams are
ready.

[recommends if capacity](../tasks/supported-release-check.md)

[recommends first](../tasks/skill-mcp-compatibility.md)

[scopes prototype-only parallel work](../tasks/guidance-bundle-onboarding.md)

[coordinates around](../tasks/npm-staged-release-automation.md)

[recommends parallel](../tasks/init-target-safety-guard.md)
