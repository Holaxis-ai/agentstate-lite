# agentstate-lite

**An OKF-native, CLI-first, agent-facing knowledge store.** Context notes, docs, cross-links,
and live bundle Views — as a plain folder of user-owned files that works offline,
with an optional wire backend when a separate service hosts the bundle.

The npm artifact is one self-contained file with **zero runtime dependencies**. It is built and
pack-tested today but not yet published to npm; the current supported install is the plugin
marketplace described in the [repository README](https://github.com/Holaxis-ai/agentstate-lite#install).
Maintainers can reproduce the complete package proof from the repository root with
`npm run verify:npm-package`; it builds, packs, installs into an isolated prefix, resolves both
command names from `PATH`, and exercises an offline bundle workflow.
Once published, the package-facing flow is:

```sh
npx -y agentstate-lite init
npx -y agentstate-lite new "Context Note" cycle-1 --title "cycle-1"
npx -y agentstate-lite doc update context-notes/cycle-1 --body "Chose token auth over sessions."
npx -y agentstate-lite list
npx -y agentstate-lite ui --open # opens the bundle's registered Views in a local browser UI
```

Install it globally if you prefer (`agentstate-lite` and the short alias `aslite`):

```sh
npm install -g agentstate-lite
aslite --help
```

## What it is

A knowledge bundle is a directory of markdown that conforms to the **Open Knowledge Format
(OKF)** — so it survives the tool: open it in any editor, render it on GitHub, diff it in git,
hand it to someone else. On top of that portable format, `agentstate-lite` adds an agent-facing
CLI (TOON output, a capped exit-code taxonomy, structured errors) and a local UI for live bundle
Views.

- **Local-first.** Everything works with the network off; the filesystem is the source of truth.
- **Agent-native.** The primary interface is a small, predictable CLI designed to be driven by
  AI agents, with a `SessionStart` hook installer for Claude Code / Codex / OpenCode.
- **Human-visible.** `agentstate-lite ui --open` launches the bundle's registered Views, which can
  present live bundle data through the read-only bridge. (`Page` is the accepted legacy name for
  the View kind — existing legacy content keeps working.)

## Optional: a shared remote bundle

Run the reference server over a local bundle, then point any command at it with `--remote`:

```sh
agentstate-lite serve --dir ./my-bundle      # loopback, keyless reference server
agentstate-lite list --remote http://127.0.0.1:4818
```

The public package intentionally stops at this generic wire boundary. It does not ship a hosted
deployment, identity system, account-administration commands, or cloud-provider recipe. A separate
service can implement the same versioned storage and HTTP contracts without changing the local
engine or CLI.

## Documentation

Run `agentstate-lite --help` (or any subcommand with `--help`) for the full command reference.
Design and format docs live in the repository.

## License

MIT © Holaxis
