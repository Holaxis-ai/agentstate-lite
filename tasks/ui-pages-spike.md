---
type: Task
title: >-
  UI pages spike: bundle-hosted HTML pages + sandboxed iframe bridge + live
  updates (evaluation build)
status: done
priority: '1'
description: >-
  PAUSED 2026-07-09 (Mike): an external adversarial review of the hardened
  branch surfaced 4 severe P1 issues the two internal review passes missed
  (token-via-referrer, no revoke-on-registry-delete, SSE staleness, remote-poll
  overlap). Branch preserved, NOT killed. Full findings + launcher
  visual-system-only branding decision + resume plan in the body.
actor: mike/claude
timestamp: '2026-07-10T14:42:36.913Z'
---
# UI pages spike — PAUSED

PAUSED by Mike 2026-07-09 after an EXTERNAL adversarial review of the hardened branch
(feat/ui-pages, builder worktree /private/tmp/aslite-uipages) surfaced severe (P1) issues the
two internal review passes MISSED. NOT killed — paused; branch + worktree preserved.

The trial itself went well: an agent (this session) authored the "Pulse" page cold against
BRIDGE.md, live updates + one-click re-entry worked, and the architecture the internal review
DID test held — the external reviewer confirms nonce isolation, CSP fetch-blocking,
external-navigation blocking, mint confinement, and nonce caps all survived, and
build/typecheck/1036 tests/8 e2e are green. The gap was coverage, not construction: my directed
review never aimed at the four P1 classes below.

All findings are on the UNMERGED branch, so they are pre-merge and public by default (no
security advisory needed).

## Open P1 (severe)

1. **Session token leaks to the untrusted iframe via `document.referrer`** on a tokenized page
   deep-link — breaks the "page never holds a credential" invariant (CSP still blocks
   exfiltration, but defense-in-depth is broken). `cli/src/ui/assets.ts`. Fix: strip the token
   from the URL after the cookie exchange (history.replaceState) + `Referrer-Policy: no-referrer`
   + iframe `referrerpolicy="no-referrer"`.
2. **Deleting/retargeting an open Page registry doc does NOT revoke or reload its iframe** — it
   keeps reading through the bridge. `ui/src/views/PageFrame.tsx`. Fix: close/reload the frame on
   registry removal or retarget.
3. **SSE disconnect permanently stales an open page** — no reconnect, replay, or catch-up refresh.
   `ui/src/pages/pageEvents.ts`. Fix: reconnect with a full refresh on reconnect.
4. **Remote watcher polls overlap** — reproduced a snapshot regression C -> B -> C; in-flight
   requests also not canceled on shutdown. `cli/src/ui/watch.ts`. Fix: serialize polls, cancel
   on shutdown.

## Open P2

5. **`open: true` hardcodes done/canceled** in the bridge — a SECOND kind-schema implementation,
   violating the one-registry principle (gate 3). Read the bundle's terminal convention instead.
   `ui/src/pages/bridge.ts`.
6. **Remote nonce mint inspects only the first 500 Page docs** while the launcher paginates fully
   — page 501+ shows but cannot open (fails closed). `cli/src/ui/server.ts`. Same class as the
   earlier registeredPageEntries pagination note.
7. **`~/.agentstate/ui-url` persists a live tokenized URL** while an inline comment still claims
   the secret is not persisted. The receipt STRING was corrected in f3c94eb; check for a lingering
   `cli/src/commands/ui.ts` comment.
8. **CLI help + generated skill still advertise the removed board/detail/admin/graph views**
   instead of bundle pages. `cli/src/reference.ts` ui summary.

## Rebase / hygiene

Branch is ~18 commits behind current main with conflicts in `package.json` and the generated
plugin bundle. Per the now-merged CI bot-ownership rule (PR #25), DROP the committed-artifact
commits during the rebase — the bot owns them on main; the branch must carry none.

## Launcher branding decision (Mike, 2026-07-09)

Style the launcher with the Holaxis **VISUAL SYSTEM ONLY**: Paper/Ink light-first surfaces, the
type stack (Cormorant Garamond display / DM Sans UI / JetBrains Mono technical), the semantic
color rule (Signal Blue = structure, Ecosystem Teal = process, Signal Amber = the revealed
signal), 2px radius, a small chevron mark. **NO science messaging** ("Science accelerated",
scientists, discovery, the verification-stack/signal-from-noise motifs) — incoherent for a
general agent tool. Posture: visual-system skin, product keeps its own identity (the open-core
light-touch play). The launcher is thin trusted chrome; keep it minimal.

## Resume plan

Clean-rebase (drop artifact commits) -> fix the four P1s -> P2s -> launcher visual-system
branding -> independent re-review (aimed explicitly at referrer/credential exposure, doc
lifecycle revocation, connection resilience, and remote-path concurrency this time) -> then the
keep/merge decision.
