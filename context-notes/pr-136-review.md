---
type: Context Note
title: 'PR #136 independent review'
actor: codex-reviewer
timestamp: '2026-07-21T16:38:39.979Z'
---
# Summary

Ultimate goal: make AgentState Lite a local-first, conflict-safe, human-visible Markdown knowledge bundle and agent CLI whose distribution remains coherent and independently verifiable.

Proximate goal: independently review PR #136 at exact SHA `1c76855e80a7ec2a352d6c08ea7b4ae51e3c7869` and determine whether the npm-carried Agent Skill plus explicit installer safely fulfills `tasks/npm-cli-skill-prerelease`; this serves the ultimate goal by validating the new sole distribution boundary before merge.

Verdict: CHANGES REQUESTED. The exact-SHA GitHub run `29847504490` is green on Node 22/26 plus the Node 20 built-CLI smoke. In a detached exact-SHA worktree, `npm ci`, the root build, 49 focused skill/hook/distribution tests, `git diff --check`, and the installed-tarball proof all passed; the tarball proof reported 30 files, one CLI implementation, zero runtime dependencies, and a successful offline workflow. The clean-path artifact and host-install behavior therefore survived review.

Four adversarial findings remain and are not in `tasks/skill-installer-followups`:

1. `installIntoDir` sweeps owned-base-shaped temp debris before establishing that a folder is managed. A pre-existing unmanaged folder containing `SKILL.md.tmp-123-abc-def` plus a foreign file is refused, but the temp file is deleted first. Probe result: `{refused:true, foreignSurvived:true, tempSurvived:false}`. This violates the documented nothing-written-or-deleted-on-refusal boundary.
2. Upgrade transaction ordering advances the manifest to the new file set before asset writes and before removed old files are deleted. A post-manifest write failure left the v2 manifest, the v1 removed asset, and an incomplete v2 asset; subsequent install and uninstall both refused. Probe result: `{firstFailed:true, manifestAdvanced:true, oldAssetRemains:true, reinstallRefused:true, uninstallRefused:true}`. A crash at the same point has the same permanent state, contradicting the self-healing interruption claim.
3. The npm renderer emits literal shell arguments such as `references/views/...`, described as relative to SKILL.md. Host-installed skills execute from the project working directory, so the generated copy-paste command cannot find the file. After a real project-scope install, running the exact generated `cat references/views/references/view-authoring-v0.md` from the project root exited 1; the actual asset was under `.claude/skills/aslite/` or `.codex/skills/aslite/`.
4. A stale managed file replaced by an empty directory is invisible to `listFilesRelative`, then `readFileSync`/`rmSync(force)` fail on the directory. Status reports stale, but both reinstall and uninstall refuse. Probe result: `{status:"stale", reinstallFailed:true, uninstallFailed:true}`. This contradicts the convergent stale-state contract.

Progress: review complete; no source changes and no GitHub review were posted. The task remains in progress pending fixes and exact-SHA revalidation.

[reviews](../tasks/npm-cli-skill-prerelease.md)
