// `agentstate-lite mcp [--dir <path>]` — run the local, read-only MCP Apps adapter over one
// AgentState bundle. The command uses stdio as its transport, so stdout belongs exclusively to MCP
// protocol frames after startup; diagnostics and human receipts must never be written there.
import { parseArgs } from "node:util";
import { startMcpStdioServer } from "@agentstate-lite/mcp-app";
import type { Bundle } from "@agentstate-lite/core";
import { parseOrUsage } from "../args.js";
import { openBundle } from "../bundle.js";
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";

export const MCP_USAGE = `agentstate-lite mcp — expose read-only, invocation-specific AgentState Views to an MCP Apps host

Usage:
  agentstate-lite mcp [--dir <path>]

Options:
  --dir <path>          Local bundle directory (default: discovered from the cwd)
  -h, --help            Show this help

The experimental server uses stdio and exposes one tool: show_view. An agent selects exact document
IDs with the normal CLI, supplies script-free HTML/CSS with declarative data-aslite-text bindings,
and the host renders it over current authoritative snapshots. It does not mutate the bundle, save
the generated HTML, accept remote targets, or expose arbitrary filesystem paths.
`;

export interface McpCliDeps {
  stdout: (text: string) => void;
  openBundle: (dir: string | undefined) => Promise<Bundle>;
  startServer: (options: { bundle: Bundle; version?: string }) => Promise<void>;
}

export async function mcp(argv: string[], deps: Partial<McpCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((text: string) => void process.stdout.write(text));
  const open = deps.openBundle ?? ((dir: string | undefined) => openBundle(dir));
  const start = deps.startServer ?? startMcpStdioServer;
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "mcp",
  );
  if (values.help) {
    stdout(MCP_USAGE);
    return;
  }
  if (positionals.length > 0) {
    throw new CliError("USAGE", `unexpected positional argument: ${positionals[0]}`, {
      help: `${cliInvocation()} mcp --help`,
    });
  }

  const bundle = await open(values.dir);
  await start({ bundle });
}
