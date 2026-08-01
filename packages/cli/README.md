# @holaxis/aslite

**An OKF-native, CLI-first, agent-facing knowledge store.** Context notes, docs, cross-links,
and live bundle Views — as a plain folder of user-owned files that works offline,
with an optional wire backend when a separate service hosts the bundle. `aslite` is the
[agentstate-lite](https://github.com/Holaxis-ai/agentstate-lite) project's CLI, published under
the interim npm coordinate `@holaxis/aslite` (the installed commands stay `aslite` and
`agentstate-lite`).

The npm artifact ships one self-contained executable file with **zero runtime dependencies**,
plus the generated Agent Skill (`SKILL.md` and its `references/` folder — installable into host
skill folders with `aslite skill install`). The public prerelease is the recommended test-user
channel; the older marketplace bundle remains temporarily available only as a rollback path while
the npm upgrade journey is proven. Maintainers can reproduce the complete package proof from the
repository root with `npm run verify:npm-package`; it builds, packs, installs into an isolated
prefix, resolves both command names from `PATH`, and exercises an offline bundle workflow. This
developer proof deliberately stamps `local-dev`, so it works on an in-progress/dirty checkout;
`prepublishOnly` runs the same journey in strict `npm-package` mode and refuses unless Git proves
an exact clean source commit.
The zero-install trial flow is:

```sh
npx -y @holaxis/aslite@next init
npx -y @holaxis/aslite@next new "Context Note" cycle-1 --title "cycle-1"
npx -y @holaxis/aslite@next doc update context-notes/cycle-1 --body "Chose token auth over sessions."
npx -y @holaxis/aslite@next list
npx -y @holaxis/aslite@next ui --open # opens a browser window: read the bundle's docs + launch its Views
```

Install it globally if you prefer (installs both the `aslite` command and the long-form alias
`agentstate-lite`):

```sh
npm install -g @holaxis/aslite@next
aslite --version
aslite skill install --scope global # optional guidance for Claude Code + Codex
```

## What it is

A knowledge bundle is a directory of markdown that conforms to the **Open Knowledge Format
(OKF)** — so it survives the tool: open it in any editor, render it on GitHub, diff it in git,
hand it to someone else. On top of that portable format, `aslite` adds an agent-facing
CLI (TOON output, a capped exit-code taxonomy, structured errors) and a local UI for live bundle
Views.

- **Local-first.** Everything works with the network off; the filesystem is the source of truth.
- **Agent-native.** The primary interface is a small, predictable CLI designed to be driven by
  AI agents, with a `SessionStart` hook installer for Claude Code / Codex / OpenCode.
- **Human-visible.** `aslite ui --open` opens a local browser window over the bundle: read its
  docs as rendered pages (cross-links you can follow, derived backlinks), see a live activity
  feed and the bundle's sharing status, and launch its registered Views — which present live data
  through the read-only v0 bridge or propose one human-confirmed local scalar action through v1.
  (`Page` is the retired legacy name for the View kind — legacy-named content no longer
  registers; `aslite status` flags it and the repo's migration script renames it in place.)

## Optional: a shared remote bundle

Run the reference server over a local bundle, then point any command at it with `--remote`:

```sh
aslite serve --dir ./my-bundle      # loopback, keyless reference server
aslite list --remote http://127.0.0.1:4818
```

The public package intentionally stops at this generic wire boundary. It does not ship a hosted
deployment, identity system, account-administration commands, or cloud-provider recipe. A separate
service can implement the same versioned storage and HTTP contracts without changing the local
engine or CLI.

## Documentation

Run `aslite --help` (or any subcommand with `--help`) for the full command reference.
Design and format docs live in the repository.

## License

MIT © Holaxis
