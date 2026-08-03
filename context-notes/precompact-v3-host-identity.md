---
type: Context Note
title: Revision 3 installed Claude host identity
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:25:08.824Z'
---
# Summary

Pinned installed-host identity for revision-3 compaction acceptance.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets. Proximate goal: bind lifecycle evidence to a reproducible installed Claude artifact; this serves the ultimate goal by preventing support claims from drifting across opaque host upgrades.

## Observed host tuple

- resolved launcher: `/Users/brian/.local/bin/claude` -> `/Users/brian/.local/share/claude/versions/2.1.220`
- reported version: `2.1.220 (Claude Code)`
- resolved executable SHA-256: `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`
- executable format: Mach-O 64-bit arm64
- platform / architecture: `Darwin` / `arm64`
- size / mode: `256908272` bytes / executable `-rwxr-xr-x`

The earlier probe's source commit is supplemental provenance but is not exposed by the installed `claude --version` command. Revision 3 readiness and manifests therefore key exact-host verification on resolved executable digest, reported version, platform, and architecture. Any difference is `installed_unverified`, not proven support.

## Evidence commands

Read-only checks on 2026-08-03: `command -v claude`, `claude --version`, `readlink`, `shasum -a 256` on the resolved target, `file`, `stat`, `uname -s`, and `uname -m`.

## Progress

Host tuple recorded. Next action: require this tuple in the revised plan gate and candidate manifest, then re-run independent lifecycle and skeptic review before implementation.
