---
type: Context Note
title: 'PR #152 exact-SHA review'
actor: codex-reviewer-152
timestamp: '2026-07-23T01:22:47.642Z'
---
# Summary

Ultimate goal: make AgentState Lite a local-first, conflict-safe, human-visible Markdown knowledge bundle and agent CLI through which agents retain knowledge and humans can understand and steer the work.

Proximate goal: independently review PR #152 at exact SHA `b5c686eba6eac51c641d19f41a552194d6bc77be` and determine whether its injectable markdown-render budgets eliminate the CI timeout without weakening production bounds, opening an unbounded runtime path, or allowing tests to pass through the wrong limit; this serves the ultimate goal by keeping the human-readable UI reliably bounded and its verification fast enough to remain dependable.

Current state: PR #152 targets `main` at `60914d52d679d3acd2e01d298794bba800e52ddc`, changes only `packages/ui/src/views/markdown.tsx` and its test, and is linked to the completed `tasks/ui-markdown-bounds-test-timeout`. The diagnosed failure was a real `packages/ui` Vitest timeout caused by fixtures scaled to production `MAX_NODES`, not the separately recorded watcher hypothesis. Review will inspect every limit consumer, adversarial option shapes, the test red-probe independence claim, exact-SHA CI, and focused runtime behavior in a detached worktree.

Progress: review complete at exact head `b5c686eba6eac51c641d19f41a552194d6bc77be`. Fresh `npm ci`, root build, UI typecheck, focused markdown tests (23/23 in 369 ms), full UI tests (161/161), and `git diff --check` passed in detached worktree `/private/tmp/aslite-pr152-review.i1MThI`. Exact-SHA CI run 29971274564 is green on the Node 20 built-CLI smoke and Node 22/26 repository gates.

Finding: request changes because the new suite does not pin the production `maxNodes` default wiring. The constants test at `markdown.test.tsx:262-265` proves only that `MAX_NODES` still equals 20,000; both node-flood tests pass an injected `maxNodes`, while the sole no-limit flood exercises only `MAX_BODY_CHARS`. Mutation probe: changing `const maxNodes = options.limits?.maxNodes ?? MAX_NODES` to `?? Infinity` left all 23 markdown tests green (209 ms), proving a regression that disables the production walk bound is invisible to this suite. The mutation was reverted and the worktree returned clean. Add a cheap test or structural seam that exercises/resolves the omitted `maxNodes` path without parsing and mounting a 20K-node fixture.

Additional review note: `RenderOptions.limits` is an exported production option and accepts arbitrary numbers, including `Infinity`/`NaN`, so it can relax or disable a security/resource bound even though the comment calls it a test seam. Current `DocPage` omits the option, so this is not presently user-controlled; hardening it so overrides can only lower the production maxima would make the boundary self-enforcing rather than caller-disciplined. Treat as a design recommendation unless the team considers the exported renderer API part of the enforced security boundary.

Verdict: request changes for the unpinned production `maxNodes` default. No GitHub review was posted.

[reviews](../tasks/ui-markdown-bounds-test-timeout.md)
