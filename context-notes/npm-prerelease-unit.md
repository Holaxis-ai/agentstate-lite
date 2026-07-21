---
type: Context Note
title: npm prerelease unit — orchestration state
actor: anthropic/claude
timestamp: '2026-07-21T02:34:56.314Z'
---
# State: npm prerelease unit in flight (2026-07-20 evening)

Ultimate goal: npm-first distribution (designs/npm-bundle-bootstrap). Proximate goal: deliver
tasks/npm-cli-skill-prerelease as TWO PRs — it serves the ultimate goal by making npm the
authoritative channel carrying CLI + skill together.

- Identity resolved: interim npm name **aslite** (decisions/npm-interim-package-name);
  tasks/npm-package-identity done.
- Plan: plans/npm-cli-skill-prerelease (incl. "Review amendments" — READ THAT SECTION; it has
  the two high-severity traps: HOOK_MARKER won't match `aslite session-start` → marker fix must
  co-locate with BIN_NAMES reorder; skill-render PKG is shared by both channels → split it,
  plugin channel keeps agentstate-lite identity).
- In flight: Builder agent on branch feat/aslite-npm-coordinate (PR1: rename + marker fix) in an
  isolated worktree. After it returns: independent review (exact SHA, worktree, npm ci), then QA
  focused on hook-marker dual-form semantics, then push + paste-ready PR text (Brian opens PRs;
  no AI attribution anywhere).
- Next: PR2 = skill carry (npm references projection + files allowlist + renderNpm bare-aslite
  + missing-CLI guidance) + `skill install|status|uninstall` (manifest-scoped uninstall, refuse
  unmanifested folders, HOST_CONFIG_ROOTS, OpenCode excluded) + verify-npm-package extensions
  (exact tarball set, ONE executable, skill round-trip, hook writes `aslite session-start`).
  PR2 branches from PR1's tip, rebase onto main after PR1 merges, regenerate prose at rebase.
- Publish itself stays HUMAN-gated (Brian's npm account; dist-tag next, 0.x.y-pre.N).
- Skills loaded this session: holaxis-self-awareness, holaxis-cognitive-ecosystem,
  agentstate-lite, holaxis-orchestrator.
