---
type: Context Note
title: npm prerelease unit — orchestration state
actor: anthropic/claude
timestamp: '2026-07-21T04:45:00.875Z'
---
# Summary

npm prerelease unit: BOTH PRs delivered and pushed (2026-07-20 late evening).

- PR1 `feat/aslite-npm-coordinate` @ 3bd40b9 — aslite coordinate + two-form hook recognition
  + safe hook writes. PR2 `feat/aslite-skill-channel` @ 2308e66+3bbd57e, STACKED on PR1.
- Full ladder ran to convergence (plan review, build, review ×5 rounds total, adversarial QA
  ×5 rounds total across both PRs); QA final verdict SHIP; every finding either fixed or in
  tasks/skill-installer-followups.
- Delivery record on tasks/npm-cli-skill-prerelease. Plan at plans/npm-cli-skill-prerelease.
  Decision at decisions/npm-interim-package-name (interim name aslite; long-term name open).
- NEXT (whoever resumes): (1) after Brian merges PR1 → rebase PR2 onto main, run
  `npm run gen:skill -w aslite` + full gates, force-push the rebased branch; (2) npm publish
  is HUMAN-gated (Brian's account, 0.x.y-pre.N on dist-tag `next`); (3) founder-proof
  acceptance items on the task are post-publish human validation; (4) marketplace channel
  retirement is a LATER separate unit (design's transition step 6).
- Skills loaded this session: holaxis-self-awareness, holaxis-cognitive-ecosystem,
  agentstate-lite, holaxis-orchestrator.
