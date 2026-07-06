// `agentstate-lite sync` — STUB for the future remote-sync layer.
//
// agentstate-lite is filesystem-first: a bundle is a plain folder of markdown. `sync` is reserved for
// the eventual push/pull of a bundle against a remote (the mechanism is undecided — NOT the removed
// legacy bearer store). Until it lands, it fails LOUD as NOT_IMPLEMENTED (exit 2) rather than silently
// no-op'ing — so an agent never believes a sync happened when none did.
import { parseArgs } from "node:util";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";

export const SYNC_USAGE = `agentstate-lite sync — sync the bundle with a remote (NOT YET IMPLEMENTED)

Usage:
  agentstate-lite sync [--dir <path>]

Status:
  agentstate-lite is filesystem-first; remote sync is a planned fast-follow. This command is a
  deliberate stub — it exits 2 (NOT_IMPLEMENTED) so no caller mistakes a no-op for a real sync.
`;

export interface SyncCliDeps {
  stdout: (s: string) => void;
}

export async function sync(argv: string[], deps: Partial<SyncCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "sync",
  );
  if (values.help) {
    stdout(SYNC_USAGE);
    return;
  }

  throw new CliError(
    "NOT_IMPLEMENTED",
    "sync is not implemented yet — agentstate-lite is filesystem-first; remote sync is a planned fast-follow",
    { help: "the bundle is a plain folder; version it with git, or copy the directory, until sync lands" },
  );
}
