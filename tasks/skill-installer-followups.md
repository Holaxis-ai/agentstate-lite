---
type: Task
title: 'Follow-ups: skill/hook installer known limitations (post-aslite prerelease)'
status: todo
priority: '3'
actor: anthropic/claude
timestamp: '2026-07-21T04:44:46.686Z'
---
# Behavioral claim

Known limitations and deferred hardening from the aslite prerelease unit (PR1 + PR2), each
deliberately excluded from those PRs. None causes data loss; all were found by the review/QA
ladder and recorded rather than silently absorbed.

# Ledger

1. **Concurrent same-target `skill install` races (QA R2).** ~25% of simultaneous same-user
   runs exit 1 with a transient structured refusal (in-flight tmp seen as extra, or sweep
   deleting a live sibling's tmp → wrapped ENOENT). Final state always coherent; retry always
   succeeds. Real fix = cross-process serialization on the skill folder — the FilesystemBackend
   runtime lock is the natural primitive. Design decision, not a patch.
2. **Hand-authored `npx -y aslite …` / env-prefixed hook commands are not recognized as
   managed** (install can't emit them; only hand-written ones are affected — install would
   append a second hook it can't see, uninstall would miss it).
3. **Unmanaged-OpenCode-plugin partial failure exits 0** — reported only in the success
   envelope's `errors[]`; scripts can't detect it by exit code (contrast: malformed-settings
   refusals exit 1).
4. **Ignorable OS metadata (`.DS_Store`, `Thumbs.db`) trips the extras refusal** on skill
   install/uninstall — deliberate fail-closed; if real-world friction appears, a tiny
   deletable-metadata allowlist is the safe relaxation.
5. **Manifest `package`/`installed_by` fields unvalidated** (any safe `files[]` is treated as
   ours within `skills/aslite`); marginal exposure, noted for completeness.
6. **Windows unproven**: hook-command regex and atomic-rename semantics are POSIX-scoped by
   the repo's documented stance; no Windows CI exists.
7. **Codex project-scope skill discovery** is a documented-convention assumption (global scope
   verified against codex 0.144.x); help text carries the hedge. Verify end-to-end when
   convenient.

[emerged from](npm-cli-skill-prerelease.md)
