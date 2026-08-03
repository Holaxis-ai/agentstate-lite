---
type: Context Note
title: >-
  Founder-proof of npm-distributed CLI+skill+hook — all 5 criteria pass (pre.2
  for 1-4, pre.3 for update-awareness)
actor: anthropic/claude
timestamp: '2026-08-03T20:26:04.664Z'
---
# Summary

Founder-proof of the npm-distributed CLI + optional skill + hook (`tasks/npm-cli-skill-prerelease`),
run as a cold agent session against an unfamiliar seeded bundle in a fully isolated sandbox
(own npm prefix + HOME + CLAUDE_CONFIG_DIR + CODEX_HOME; nothing from the operator's real config).
Harness: `aslite-founder-proof` (reusable). Two rounds: criteria 1-4 on published `0.1.0-pre.2`,
criterion 5 on published `0.1.0-pre.3` (which carries the merged version-identity work).

# Result: all five acceptance criteria PASS (cold, no operator explanation)

1. Orient at session start (hook) — PASS. Cold agent knew the bundle was aslite and summarized
   its docs/tasks/kinds with zero coaching.
2. Discover Kinds/workflow — PASS. Found Task + Review Request kinds AND their real semantics
   (CAS task claiming, typed-link dependency DAG, View sandbox/bridge); derived a real
   inconsistency unaided (Review Request declares `reviews design`/`reviews roadmap item` link
   targets whose kinds aren't declared in this bundle).
3. Attributed mutation — PASS. Mapped "the alpha-customer work" -> tasks/onboard-alpha by
   meaning, flipped to done, used compare-and-swap (`--expected-version`) UNPROMPTED, reported
   actor `founder-proof`.
4. Open a human View — PASS. Found the registered View, launched `aslite ui --open`, explained
   the loopback/token/HttpOnly-cookie security model. (Visually confirmed the View renders the
   seeded Review Request.)
5. Update awareness — PASS on pre.3 (was soft on pre.2). Reached for `aslite version` first,
   read the build-identity + drift block, compared installed vs registry, gave correct
   prefix-scoped upgrade commands, and flagged the compatibility_contracts skill/hook staleness
   follow-up. On pre.2 (no `version` command) it improvised `npm view` comparisons — correct but
   hand-rolled; this is why pre.3 was published.

# Real findings surfaced BY the cold agent (product-level, worth acting on)

- **Actor-model conflation**: `AGENTSTATE_LITE_ACTOR=founder-proof` is recorded as if a human
  acted, not "an agent acting on founder-proof's behalf." Independently echoes
  `tasks/ui-feed-row-attribution`.
- **next-only tag policy -> silent-downgrade trap**: a naive `npm i -g @holaxis/aslite` resolves
  `latest` (pre.2) and downgrades a user on `next` (pre.3). Correct consequence of the deliberate
  tag policy, NOT a defect — but the update guidance/verb work (`orientation-update-notice`,
  `supported-release-check`) should account for it.
- **Skill/hook staleness after CLI upgrade**: the agent noted a CLI upgrade doesn't rewrite the
  installed hook/skill; compatibility_contracts (skill/hook/mcp) exist to detect it. Exactly
  `tasks/skill-freshness`.
- **Stale in-session belief**: across turns the agent twice asserted "zero Review Requests" after
  one had been seeded mid-session — an agent-reasoning/context-staleness artifact, not a
  distribution defect, but a real confusion risk (it told the operator the View would be empty
  when it wasn't).

# Findings the proof surfaced in the HARNESS/fixtures (fixed during the run)

- Seed swallowed a validation error (`|| true`) and used a wrong `Review Request` status enum
  (`open` vs the real `requested`); left an all-orphans bundle. Fixed in the reusable harness.
  Lesson: onboarding/demo/seed paths must NOT swallow errors, and demo bundles should apply
  companion kinds so link targets resolve.
- The cold agent opened `aslite ui` and the `review-workflow` View's status pill rendered as a
  stretched oval (flex `align-items:stretch`). Fixed and merged (PR #202,
  `fix/view-status-badge-stretch`).

# Verified build identity of the published artifacts

- pre.3 cold-install reports `channel: npm-package`, `commit: 5ee3829`, `dirty: false` — the
  release-build channel/commit stamping works end to end. Registry tags: `latest`=pre.2 (held),
  `next`=pre.3 (published 2026-08-03, `next` only per the deliberate policy).

# Caveat on the acceptance wording

The task asks for the proof "from the exact packed prerelease ... without this source checkout."
This was run on the operator's own machine with fully isolated homes + the published registry
artifact — faithful on isolation and published-artifact dimensions, but not literally a second
physical machine. The clean-machine and inverse-direction (Mike) judgment remains the operator's.

[validates](../tasks/npm-cli-skill-prerelease.md)

[relates to](../tasks/skill-freshness.md)
