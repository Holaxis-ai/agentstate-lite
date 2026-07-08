---
type: Context Note
title: 'PR #17 review'
actor: codex
timestamp: '2026-07-08T19:08:47.351Z'
---
# Summary

Reviewed PR #17 in /private/tmp/agentstate-lite-pr17 on commit 65355c2, branch feat/sync-skill-docs. The branch is behind origin/main but git merge-tree reports an automatic merge; no textual conflicts found.

Verdict: one medium docs finding. The generated Typical flow warns that existing projects are set up by sync and init is greenfield-only, but the next command is still init --dir .agentstate-lite. This appears in packages/cli/scripts/gen-skill.mjs and both generated SKILL.md files. Because the PR goal is to make sync the setup verb for existing board-sharing projects, this example still invites the divergent-second-bundle footgun for agents that copy the Typical flow. Recommended fix: make the setup block branch explicitly between sync for existing projects and init for greenfield, or show sync first and mark init as greenfield-only in the command itself.

Verification: npm ci --prefer-offline --ignore-scripts; npm run build -w agentstate-lite; npm run typecheck; node --test --import ./test/ts-loader.mjs ./test/init-hint.test.ts (4/4); npm run check:skill -w agentstate-lite; npm run check:skill:bundle -w agentstate-lite; npm run check:bundle -w agentstate-lite; git diff --check merge-base..HEAD. Initial test/check-bundle attempts before build failed only because dist/generated UI artifacts were absent after --ignore-scripts.
