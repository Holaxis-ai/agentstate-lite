---
type: Task
title: >-
  Agents cannot verify a bundle View renders without a browser (blocks
  generate-views-on-demand)
status: todo
priority: '1'
assignee: ''
description: >-
  FOUND 2026-07-23 via a live end-to-end test: a fresh agent, given only the
  aslite skill + shipped references and the prompt 'create a view showing every
  open task, grouped by whom it is assigned to', DID produce a valid, registered
  View — but could not confirm its JavaScript actually renders. It
  reverse-engineered the shell's HTTP routes by grepping the MINIFIED SPA bundle
  (fragile across releases), verified the DATA path (list/query returns the
  right tasks) and the blob wiring (mint+serve byte-identical), but reported the
  render itself as 'reasoned, not empirically executed'.


  VERIFIED: no headless/view-test/preview command exists (grepped
  commands/ui.ts, serve.ts). An agent can verify what a View WILL QUERY (aslite
  list --type Task --open) but not what it RENDERS.


  WHY THIS IS P1: the chosen strategy (2026-07-23, with Brian) is to guide users
  to GENERATE views on demand rather than ship canned ones. That strategy's
  load-bearing assumption is that a generated view reliably works. If the
  generator cannot check its own output, every generated view arrives unverified
  and the human becomes the test harness — exactly the failure that discredits
  the capability at first contact. THREE separate agents in one day (two Codex
  reviewers + this test agent) independently reported 'no browser, cannot verify
  visually'.


  PROPOSED SOLUTION: 'aslite view check <id>' — load the View's HTML in a
  headless DOM (jsdom/happy-dom, already the ui test-harness dependency),
  execute its JS against the real read-only bridge over the in-process router,
  and report: console errors, whether the bridge handshake completed, and
  whether the view produced DOM nodes (a non-empty render). Not a pixel check —
  a 'does it run and draw anything against real bundle data' smoke. Secondary:
  document the stable bridge/HTTP surface so no agent ever greps minified JS
  again.


  DONE WHEN: an agent can run one command that fails loudly on a view that
  throws, hangs on the bridge, or renders nothing — with no browser.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T17:43:20.435Z'
---

