---
type: Context Note
title: 'Generative UI (bundle pages): what it is, where it stands, coordination'
description: >-
  Orientation for Brian on the gate-4 bundle-pages feature — architecture, the
  paused security gate + fixes in flight, launcher-branding decision, and a
  coordination heads-up on the files feat/ui-pages touches
actor: mike/claude
timestamp: '2026-07-09T21:18:07.324Z'
---
# Summary

The **generative UI (bundle pages)** feature — the gate-4 "what replaces the kanban" rethink
direction, Mike-directed this session. Status: spiked, hardened, trialed, PAUSED at a security
gate, now resuming with fixes. NOT merged — lives on `feat/ui-pages`; keep/merge decision
deferred until it is hardened and Mike re-trials it.

## What it is

Pages are **bundle content**: a self-contained HTML file promoted as a blob under `pages/`,
declared by a `type: Page` registry doc, listed by a launcher in the existing `ui` command,
rendered in a **sandboxed iframe** (opaque origin, `connect-src 'none'`) fed only by a
**read-only postMessage bridge** (see `examples/pages/BRIDGE.md` on the branch). Live updates via
fs.watch -> SSE. It composes existing seams — the byte channel (blobs), kinds (a `Page`
convention), the `ui` loopback server + token/CSP, the wire query layer, and now sync. Thesis:
agents author purpose-built pages (activity feed, board) as data; the shell is thin trusted
chrome. The old paused React views (board/detail/admin/graph) are REMOVED on this branch — the
launcher replaces them (one surface, not three).

## Where it stands

Spike built + hardened (closed a must-fix blob-exfil hole, explicit anti-exfil CSP, bounded
short-TTL nonces, wired the security e2e into the gate, and fixed a PRE-EXISTING parallel-build
flake at its root — that last one helps everyone). Mike trialed it live: an agent authored a page
("Pulse") cold against BRIDGE.md, live updates + one-click re-entry worked. Then an EXTERNAL
adversarial review found **4 severe P1s two internal passes missed**: session token leaking to the
iframe via `document.referrer`, no revoke when an open Page's registry doc is deleted/retargeted,
SSE disconnect permanently staling a page, and remote-watcher poll overlap. Full findings + fix
directions live in `tasks/ui-pages-spike` (in_progress, claimed mike/claude). The clean rebase +
all P1/P2 fixes are in flight now.

## Decisions

- Launcher branding = Holaxis **visual system only** (Paper/Ink surfaces, the type stack, the
  Signal Blue=structure / Teal=process / Amber=signal semantic, 2px radius, a small mark). NO
  science messaging ("Science accelerated", scientists, discovery motifs) — incoherent for a
  general agent tool. Posture: visual-system skin, product keeps its own identity (open-core
  light-touch).
- The trust boundary is the STATIC launcher (holds the token, mints nonces); generativity lives in
  the sandbox. The launcher can't be agent-overwritten — that would collapse the privilege split. A
  "generative landing" is a default-page mechanism, not a rewritable shell.
- Follow-ups filed: `tasks/ui-pages-per-page-scoping` (shared-board confidentiality — a page reads
  the whole bundle today) and `tasks/ui-pages-bridge-v1` (backlink query + markdown-render helper).

## Coordination — heads-up for the briand fleet

- The branch touches `packages/ui/**` (removes the old views), `packages/cli/src/ui/**`, the `ui`
  command, and `packages/cli/src/reference.ts` (the `ui` command summary — currently stale, being
  corrected to describe pages). If your sync work touches `reference.ts` or the `ui` command, flag
  it — small conflict surface, but worth a heads-up.
- Process lesson worth sharing across both fleets: the two internal review passes were thorough but
  MISSED the P1s because they were aimed at one attack matrix (nonce/CSP/mint) and never at
  credential-exposure / doc-lifecycle-revocation / connection-resilience / remote-concurrency. The
  merge review must be aimed at those classes explicitly; an independent adversarial pass before
  merge is now a required gate for this unit.
- Not merged; nothing blocks you. This note is orientation so the eventual PR isn't a surprise.
