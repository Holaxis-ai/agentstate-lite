# agentstate-lite

> A markdown knowledge bundle in your repo, plus a CLI built for agents.

Coding agents forget everything between sessions, overwrite each other's work, and keep
what they know invisible to the humans they work for. `agentstate-lite` gives them
shared, versioned, conflict-safe memory in plain text — offline-first, standards-based,
owned by you.

**Status: early and experimental.** This is a young project moving fast: it is not yet
published to npm, formats and commands will change without ceremony, and some of its
biggest ideas are still bets under test. The honest breakdown is below — read it before
depending on anything.

## Install

This repo is its own plugin marketplace — the skill carries a self-contained build of
the CLI, so agents get the tool and the knowledge of how to use it in one install:

```sh
# Claude Code
/plugin marketplace add Holaxis-ai/agentstate-lite   # then install via /plugin

# Codex
codex plugin marketplace add Holaxis-ai/agentstate-lite
codex plugin add agentstate-lite@agentstate-lite
```

(An npm package is planned but not yet published.)

## Quickstart

```sh
aslite init                      # create a bundle (seeds the context-notes recipe)
aslite recipe add work-tracking  # install the Task kind — a task board, as data
aslite hook install              # agents orient automatically at session start
                                 # (Claude Code, Codex, OpenCode)
# commit .agentstate.json — every agent on every machine now finds the bundle
```

Then, day to day:

```sh
aslite new "Task" ship-parser --title "Ship the parser" --status todo
aslite list --type Task
aslite doc update tasks/ship-parser --status in_progress --actor claude
aslite doc history tasks/ship-parser   # who changed what, when
aslite ui                              # the bundle, rendered — local server, no cloud
```

## How it works

- **Everything is a typed markdown document.** One required frontmatter field —
  `type` — plus whatever fields its schema declares. New concepts are new types, not
  new subsystems.
- **Schemas are documents too.** A "kind" is declared by a convention doc inside the
  bundle; validation fires at write time (warn by default, `--strict` to reject). The
  bundle describes itself.
- **Relationships are links; backlinks are always derived, never stored.**
- **Writes are compare-and-swap.** Every document state has a content-addressed
  version; a racing writer gets a typed conflict instead of silently losing an update.
  Every mutation is attributed.
- **Storage is a seam.** The engine holds all semantics; backends (filesystem by
  default; memory, wire, cloud) plug in underneath with byte-identical version tokens.
- **Recipes install capability as text.** A recipe is a folder of convention docs,
  applied idempotently — it seeds schemas, then the bundle owns them. Two ship built-in
  (`context-notes`, `work-tracking`); `examples/recipes/claims` is the worked example of
  an external recipe — a provenance/claims lifecycle installed via
  `aslite recipe add examples/recipes/claims`, and the template for writing your own.

Bundles are valid [Open Knowledge Format v0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)
— plain markdown any conformant tool can read.

## What's solid

- The engine and the storage seam: 750 tests across six workspaces, four backends
  pinned to byte-identical version tokens, and a versioning/CAS model ported from a
  design already proven in production.
- The CLI surface, built agent-first: structured output, counts and truncation with
  escape hatches, idempotent mutations, a small stable exit-code taxonomy.
- The byte channel (`promote`/`pull`) for artifacts that should never enter a model's
  context window.
- Project discovery: a committed `.agentstate.json` resolves the bundle for any agent
  on any machine with zero prior context.

## What's early or experimental

- **Everything is pre-1.0.** Breaking changes are likely; nothing is on npm yet.
- **Recipes as composition** is a thesis under test, not a result — two recipes exist
  and both are first-party. The first external-recipe experiment (a claims/provenance
  system) is in flight, with declared success criteria; "cookbooks" (composed recipes
  with typed-link glue) are design intent only.
- **The web UI**: the serving and security plumbing is production-grade; the current
  views are a placeholder pending a design rethink. Treat `ui` as a preview.
- **The hosted multi-user deployment** exists (Cloudflare, enforced CAS, API keys,
  invites/roles) but is single-bundle and deliberately frozen in scope while the
  local-first product solidifies.
- **Wire protocol v0.1** is evolving. One recorded caveat: a document's raw bytes
  re-serialize to canonical form over the wire; blobs are the byte-exact channel.
- **Filesystem CAS is best-effort across processes** (atomic within one). For multiple
  concurrent local agents, run `aslite serve` and point them at the loopback head —
  that restores full enforcement with zero cloud.
- **Typed relationships** (first-class provenance edges) are an open design question —
  today links are untyped.
- OKF itself is a weeks-old spec; we track it as it evolves.

## Where the deep documentation lives

This project dogfoods itself: the plans, research, design docs, product statement, and
the full change history live in the project's own agentstate-lite bundle, which the
team develops against daily. The repo deliberately carries only this README,
`CLAUDE.md` (agent-orchestrator conventions), and the code.

## License

MIT © 2026 Holaxis
