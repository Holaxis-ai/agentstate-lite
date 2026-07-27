// `agentstate-lite mcp [--dir <path>] [--actor <name>]` — run the local MCP Apps adapter over one
// AgentState bundle. The command uses stdio as its transport, so stdout belongs exclusively to MCP
// protocol frames after startup; diagnostics and human receipts must never be written there.
import { parseArgs } from "node:util";
import { startMcpStdioServer } from "@agentstate-lite/mcp-app";
import type { Bundle } from "@agentstate-lite/core";
import type { ViewAuthorizationStore } from "@agentstate-lite/view-runtime";
import { parseOrUsage } from "../args.js";
import { resolveActor } from "../actor.js";
import { openBundle } from "../bundle.js";
import { deriveBundleDisplayName } from "../bundle-name.js";
import { asHandled, CliError, toExit } from "../errors.js";
import { cliInvocation } from "../invocation.js";
import { renderErrorEnvelope } from "../output.js";
import { LocalViewAuthorizationStore } from "../ui/view-authorizations.js";

export const MCP_USAGE = `agentstate-lite mcp — expose invocation-specific AgentState Views to an MCP Apps host

Usage:
  agentstate-lite mcp [--dir <path>] [--actor <name>]

Options:
  --dir <path>          Local bundle directory (default: discovered from the cwd)
  --actor <name>        Attribute confirmed human actions (overrides AGENTSTATE_LITE_ACTOR)
  -h, --help            Show this help

The experimental server uses stdio and exposes one model-visible tool: show_view. An agent can
provide an exact registered View ID to launch its current HTML unchanged through the shared
read-only bundle bridge, after trusted-shell approval of those exact bytes. Or the agent can select
exact document IDs or supply one bounded launch-time query, then add script-free HTML/CSS with
declarative data-aslite-text or data-aslite-markdown bindings over frozen authoritative snapshots.
Queries reuse the bundle View's type/prefix/field/open semantics, resolve in deterministic ID order,
and expose at most 20 documents per launch.
Optional document.set-field declarations become trusted-shell controls; generated HTML cannot
write directly, and every action requires explicit human confirmation plus a current version.
The server does not save generated HTML, accept remote targets, or expose arbitrary filesystem paths.
`;

export interface McpCliDeps {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  openBundle: (dir: string | undefined) => Promise<Bundle>;
  startServer: (options: {
    bundle: Bundle;
    version?: string;
    actor?: string;
    bundleName?: string;
    viewAuthorization?: ViewAuthorizationStore;
  }) => Promise<void>;
}

export async function mcp(argv: string[], deps: Partial<McpCliDeps> = {}): Promise<void> {
  const stderr = deps.stderr ?? ((text: string) => void process.stderr.write(text));
  // Reserve the JSON-RPC channel before parsing args or discovering a bundle: every failure path
  // must be routed once to stderr, then marked handled so the outer AXI wrapper emits no stdout.
  try {
    await mcpInner(argv, deps);
  } catch (error) {
    const { envelope, handled } = toExit(error);
    if (!handled) stderr(renderErrorEnvelope(envelope));
    throw handled ? error : asHandled(error);
  }
}

async function mcpInner(argv: string[], deps: Partial<McpCliDeps>): Promise<void> {
  const stdout = deps.stdout ?? ((text: string) => void process.stdout.write(text));
  const open = deps.openBundle ?? ((dir: string | undefined) => openBundle(dir));
  const start = deps.startServer ?? startMcpStdioServer;
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          actor: { type: "string" },
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
  const actor = resolveActor(values.actor, {
    help: `${cliInvocation()} mcp --actor <name>`,
  });
  const bundleName = (await deriveBundleDisplayName(bundle)).name;
  await start({
    bundle,
    actor,
    bundleName,
    viewAuthorization: new LocalViewAuthorizationStore(bundle.root),
  });
}
