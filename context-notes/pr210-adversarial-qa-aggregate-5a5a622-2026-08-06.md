---
type: Context Note
title: PR 210 adversarial QA aggregate PASS at 5a5a622
description: >-
  Primary matrix plus fresh OpenCode and installed-authority supplements close
  every QA leg with no product counterexample.
tags:
  - pr210
  - qa
  - hook-ownership
actor: codex-pr210-orchestrator
timestamp: '2026-08-06T19:53:56.752Z'
---
# Summary

Adversarial QA for PR #210 is PASS at exact SHA `5a5a6229c840992e94cf26e91bd1f82b4bf18488` after the primary matrix and two fresh bounded supplements were combined. No product mutation, provenance, authority, or byte-preservation counterexample was found.

The primary QA run itself stopped on an incorrect scratch-harness assumption about the uninstall receipt. That checkpoint remains useful evidence but is not the controlling verdict. The missing OpenCode and installed-artifact/JSON-history legs were assigned to fresh agents, completed independently, and passed.

## Goal linkage

Ultimate goal: make agentstate-lite installable and self-orienting without claiming, rewriting, or deleting host configuration it did not generate.

Proximate goal: falsify the repaired hook ownership and installed-authority claims through black-box, all-host, exact-byte lifecycle probes. This serves the ultimate goal by treating foreign-state preservation as an observed lifecycle property rather than a classifier-only assertion.

## Aggregate evidence

- Fresh install/build and exact detached tree: clean.
- Focused source classifier/reconciliation/authority: 22/22 passed.
- Freshly built lifecycle selection: 4/4 passed.
- Independent 37-case Claude/Codex matrix: status, uninstall, reinstall, append, bytes, modes, and whole-tree preservation passed.
- OpenCode supplement: existing all-host matrix 1/1 and OpenCode reconciliation 2/2 passed; six independent negative sources preserved exact bytes and mode through status/install/uninstall; one canonical positive was removed.
- Pure persistent-authority matrix: 12/12 passed (one allowed control and eleven refusals).
- Hook and skill preflight no-write controls: 1/1 each.
- Actual offline-installed local-dev tarball refusals: wrong npm prefix, both PATH aliases shadowed, and missing stable prefix Node, each tested through hook and skill install (six trials total). Every command returned structured exit 1 and every fresh project tree remained empty.
- Supported installed positive: hook and skill install succeeded; the persisted hook used the stable same-prefix `<prefix>/bin/node <prefix>/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start`; uninstall removed generated state and preserved a foreign sibling.
- Corrected historical/current JSON matrix: eleven generated forms were recognized on both JSON hosts and removed while the sentinel and mode were preserved. The primary scratch row `npx -y agentstate-lite home` was correctly identified as foreign, not a historical generated hook.
- Complete installed-package proof passed (30 files, both bins, hook and skill lifecycles, stable prefix Node).
- Poisoned npm-environment regression passed.
- Committed plugin trees were unchanged; Git status and diff remained clean.

## Gate result

Adversarial QA verdict: PASS. No source repair is requested. The exact SHA may advance to runtime/repository CI gates.

Evidence notes:

- [primary checkpoint](pr210-adversarial-qa-5a5a622-2026-08-06.md)
- [OpenCode supplement](pr210-opencode-qa-5a5a622-2026-08-06.md)
- [authority and history supplement](pr210-authority-qa-5a5a622-2026-08-06.md)

[tracks](../tasks/hook-compatibility-ownership.md)
