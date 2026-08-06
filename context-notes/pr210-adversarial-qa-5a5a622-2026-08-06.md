---
type: Context Note
title: PR 210 adversarial QA at 5a5a622
actor: codex-pr210-adversarial-qa
timestamp: '2026-08-06T19:34:57.877Z'
---
# Summary

Fresh adversarial QA began on detached exact SHA `5a5a6229c840992e94cf26e91bd1f82b4bf18488`. Source is read-only for this stage; QA will attempt to falsify generated-hook ownership, writer self-recognition, and install-authority fail-closed behavior through built lifecycle and independent scratch probes.

## Goals

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: independently falsify or validate the exact repaired SHA across foreign-path byte preservation, supported-writer positive controls, installed local-dev authority failures, and complete installed-tarball behavior. This serves the ultimate goal by testing the destructive boundary from persisted host state and physical install evidence rather than trusting source-level labels.

## Status

In progress. Next action is to establish clean exact-SHA and plugin-tree baselines, build from the repository root, then execute the adversarial lifecycle matrix. Verdict and complete evidence will replace this section before handoff.

[tracks](../tasks/hook-compatibility-ownership.md)

[review input](pr210-exact-review-5a5a622-2026-08-06.md)
