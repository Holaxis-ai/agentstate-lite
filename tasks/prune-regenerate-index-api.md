---
type: Task
title: >-
  Prune unused high-level index.md API (readIndex/regenerateIndex) — sibling of
  the log prune
description: >-
  Sibling of tasks/prune-unused-log-api (codex, in_progress). SAME species:
  reserved-file derived-body maintenance that's built + exported + tested but
  has ZERO production callers. VERIFIED this session by grep: readIndex
  (bundle.ts:528) and regenerateIndex (bundle.ts:617) each appear ONLY at their
  own definition — no production caller anywhere; index.md is written by NO code
  path except init, and init writes the root okf_version stub DIRECTLY through
  the generic seam (backend.readReserved/writeReserved at bundle.ts:76,88), NOT
  through these functions. So index.md never gets directory-listing
  regeneration, consistent with OKF only REQUIRING the root okf_version
  declaration. PRUNE: readIndex, regenerateIndex, their core exports (the
  index.ts:145 line 'export { readIndex, readLog, appendLog, regenerateIndex
  }'), their helper-specific tests, and any doc/comment implying automatic
  index.md maintenance/regeneration. PRESERVE (mirrors the log task's boundary
  exactly): index.md as a reserved OKF filename; the init okf_version-stub
  write; the generic readReserved/writeReserved CAS + wire + sync support; the
  reserved-file guards; the shared versioned-mutation primitive (mutation.ts) —
  index.md init and the wire API still use it. DoD: the two functions + exports
  + helper tests removed; init/build/typecheck/full-suite green (init's index.md
  write untouched — pin it); no doc claims auto-regeneration; ts-prune/knip
  optional confirmation that nothing else referenced them. COORDINATION
  (important): this and tasks/prune-unused-log-api edit the SAME two spots —
  bundle.ts's reserved-file section and the SINGLE index.ts:145 export line (log
  task strips readLog/appendLog off it; this strips readIndex/regenerateIndex,
  emptying the line). As separate PRs they WILL conflict there (cf. the
  #124/#125 LINK_USAGE collision). Cleanest = fold both into ONE
  reserved-file-family prune PR, or sequence this AFTER the log prune merges and
  rebase the trivial export-line conflict. Provenance: this session's
  dead-surface audit + tasks/coherence-drift (which flagged 'regenerateIndex
  zero callers').
actor: mike/claude
status: todo
timestamp: '2026-07-20T00:47:03.900Z'
---
Root cause shared with the log half: OKF-spec-described mechanisms (§6 index regeneration, §7 log provenance) implemented for completeness, never wired to a product workflow. The versioning/CAS/history surface built the same 'ahead of use' way DID earn its consumers (link add, doc history, mutateDocument, trusted View actions) — so this is the narrow exception, not a pervasive habit.

[sibling prune; sequence after (shared bundle.ts + index.ts export line)](prune-unused-log-api.md)
