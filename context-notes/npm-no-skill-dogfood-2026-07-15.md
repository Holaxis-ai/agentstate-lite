---
type: Context Note
title: Clean-room npm/no-skill dogfood succeeded
actor: mike/codex
timestamp: '2026-07-16T00:54:31.819Z'
---
# Summary

On 2026-07-15, a fresh evaluator successfully used AgentState Lite from an isolated npm tarball installation with no AgentState skill, plugin cache, source checkout, or prior project context. The evaluator received only the prompt: “Use the AgentState bundle in this project and show me its UI.”

Verdict: the installed CLI is already self-describing enough for this core journey. No product defect was demonstrated, so this run creates no implementation task.

## Environment

- Built and packed `agentstate-lite@0.1.0` from current main.
- Installed the tarball into an isolated user prefix; both `agentstate-lite` and `aslite` resolved from that prefix.
- Used an isolated `HOME` with no AgentState plugin or skill.
- Prepared an unfamiliar conventional bundle outside the repository.
- Installed the `review-workflow` operating model from a standalone copied recipe folder. The recipe installed its Review Request Kind, registered Page, Page HTML, and bundle-native Page-authoring reference.
- Created one Review Request and its linked Design as representative data.

## Fresh-agent journey

Without being told specific commands, the evaluator:

1. Ran `agentstate-lite --help` and inferred that `ui` launches bundle-authored Pages.
2. Ran `agentstate-lite ui --help`.
3. Ran `agentstate-lite bundle locate` and correctly found the conventional bundle through local discovery.
4. Ran `agentstate-lite list --type Page --limit 50` and found the registered **Review requests** Page.
5. Ran `agentstate-lite ui --json`, received a tokenized loopback URL, and kept the serving process active.
6. Verified the shell returned `200 OK`, the Page registry API returned the expected Page, Page minting returned `200`, and the minted iframe returned HTML containing the expected `Review requests` title and heading.
7. Terminated the server and verified the saved URL was removed and the port stopped accepting connections.

The Page registration resolved to `pages-registry/review-workflow-reviews` with entry `pages/review-workflow/reviews.html` and `bridge: bundle-read`.

## Observed friction

The root URL serves a small SPA shell, so a plain headless HTTP fetch cannot directly prove that the launcher visibly renders the Page. To verify browser-visible registration without opening a graphical browser, the evaluator inspected the served client asset to discover the internal query and Page-mint endpoints.

This is test-harness friction, not demonstrated user or agent-product friction: the CLI clearly described `ui`, printed the URL, documented that the process remains active, and a human would simply open the URL. Do not add a public internal-endpoint contract merely to simplify this one probe; the repository's existing browser E2E suite is the appropriate executable proof.

## Implications

- Runtime CLI independence is substantially proven for discovery, conventional bundle resolution, Page discovery, and UI launch.
- Portable recipes already carry the operating knowledge needed by their installed capability; the evaluator did not need the skill's reference directory.
- The remaining transition work is publication/release policy, an install/upgrade path, and eventually thinning the plugin—not a new CLI bootstrap framework.
- Keep the plugin-bundled executable until a real founder-to-founder npm installation has been used in an ordinary session, but do not create additional ceremony around this result.

[supports](../roadmap-items/distribution-neutral-resources.md)

[validates](../tasks/verify-npm-package.md)

[implements operating model from](../tasks/bundle-native-reference-docs.md)
