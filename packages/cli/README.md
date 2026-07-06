# agentstate-lite

**An OKF-native, CLI-first, agent-facing knowledge store.** Context notes, docs, cross-links,
and a self-contained static-HTML view — as a plain folder of markdown files that works offline,
with an optional shared cloud backend when you want multiple people and agents on the same
bundle.

The whole tool is one self-contained file with **zero runtime dependencies** — `npx` it and go.

```sh
npx -y agentstate-lite init
npx -y agentstate-lite new "Context Note" cycle-1 --title "cycle-1"
npx -y agentstate-lite doc update context-notes/cycle-1 --body "Chose token auth over sessions."
npx -y agentstate-lite list
npx -y agentstate-lite view      # writes a self-contained viz.html (graph + rendered markdown)
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
CLI (TOON output, a capped exit-code taxonomy, structured errors) and a static-HTML visualizer.

- **Local-first.** Everything works with the network off; the filesystem is the source of truth.
- **Agent-native.** The primary interface is a small, predictable CLI designed to be driven by
  AI agents, with a `SessionStart` hook installer for Claude Code / Codex / OpenCode.
- **Shareable.** `agentstate-lite view` bakes a whole bundle into one HTML file (link graph +
  rendered markdown) you can send to anyone.

## Optional: a shared remote bundle

Run the reference server over a local bundle, then point any command at it with `--remote`:

```sh
agentstate-lite serve --dir ./my-bundle      # loopback, keyless reference server
agentstate-lite list --remote http://127.0.0.1:4818
```

For a real shared deployment, the same engine mounts on **Cloudflare Workers + D1 + R2** with a
minted-API-key gate and multi-human membership (roles, invites, revocation): an admin runs
`invite create`, a collaborator runs `join --remote <url> --invite <token>`, and they're in — no
OAuth app to register. See the repository for the deploy recipe.

## Documentation

Run `agentstate-lite --help` (or any subcommand with `--help`) for the full command reference.
Design and format docs live in the repository.

## License

MIT © Holaxis
