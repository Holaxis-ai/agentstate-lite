---
type: Context Note
title: 'PR #177 grow-apply-shrink follow-up review — PASS'
actor: codex-pr177-followup-reviewer
timestamp: '2026-07-29T16:38:34.104Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a
Base artifact: 5f36f0e37425630f57d8720b49554863ca37834b
Red test commit: 69b2383

No blocking or non-blocking issue survived independent exact-SHA review. Exact ca6d6aa is safe for formal QA.

## Test validity and red proof

The Chromium feedback-loop test mounts a real iframe, receives each child report from that exact iframe window, synchronously applies every reported height to the iframe, then mutates 150 to 900 to 180. The final assertion records reports, applied iframe height, root and body scroll heights, root and body bounds, and actual content bounds.

The committed test was independently run against archived test commit 69b2383. It failed exactly on the intended contract: reports stopped at 150 and 900; iframeHeight and htmlScrollHeight remained 900; body scroll and bounds, root bounds, and content bounds were 180. This proves the test captures the applied-viewport root scroll floor rather than passing tautologically.

At exact ca6d6aa all three committed Chromium tests pass. The hidden-first-mount case mounts while the containing slot is hidden, reveals it without interaction, waits for the 220 report, then replaces the iframe with a new launch and epoch and waits for the new 220 report. The fixed-card case runs the real shell CSS at a 288 viewport, proves outer client and scroll height are both 288, proves the frame receives the remaining 236 pixels, and proves child scrolling advances to 400 while outer scroll stays zero.

## Fix audit

The production change reads root scroll height once and excludes it only when it exactly equals root client height. Equality is the browser viewport-floor signature reproduced by the red test. Root scroll height greater than client height remains genuine overflow and is retained. Body scroll height, root bounds, and body bounds remain independent fallbacks, including overflow confined by root behavior. The updated unit test pins both the 900-equals-900 exclusion and the 1000-greater-than-900 preservation row.

MutationObserver registration, shared animation-frame debounce, read-only geometry measurement, last-height suppression, launch ID, epoch, nonce, source-window validation, sandbox, CSP, flexible clamping, and fixed-host early return are unchanged from the prior reviewed SHA.

## Reproducibility and scope

The two commits change only eight expected files: root and MCP package manifests, lockfile, MCP Playwright config and browser suite, frame-sizing source and unit test, and the MCP test-results ignore. The MCP package declares the existing repository Playwright version. The lockfile records the workspace dependency. Root check runs the MCP browser suite before the existing UI browser gate. The line reporter avoids an HTML report, and MCP test-results are ignored. git diff --check passed and the source worktree remained clean.

## Evidence

- npm ci: passed
- npm run build: passed
- npm test --workspace @agentstate-lite/mcp-app: 54 of 54 passed
- Direct cached-browser command from packages/mcp-app: 3 of 3 Chromium tests passed
- Archived 69b2383 red probe: targeted flexible test failed with the exact 900 root-scroll floor
- The non-escalated playwright install step hung under the restricted reviewer sandbox even with cached Chromium. It was stopped after one minute and the exact Playwright test command was run against the cached browser. This is known environment behavior, not product behavior; CI preinstalls Chromium and the existing UI gate uses the same install pattern.

## Suggestions

A future cleanup could install Chromium once for both browser suites in the root gate instead of invoking the idempotent install from each package. This is an efficiency suggestion only.
