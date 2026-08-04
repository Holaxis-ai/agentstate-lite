// `aslite version [--json]` — the complete, local-only build/runtime identity envelope.
import { parseArgs } from "node:util";
import { parseOrUsage } from "../args.js";
import { buildIdentityEnvelope } from "../build-identity.js";
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";
import { render, resolveMode } from "../output.js";
import { STABLE_MCP_LAUNCH_GUIDANCE } from "../integration-guidance.js";

export const VERSION_USAGE = `agentstate-lite version — show the exact CLI build and runtime identity

Usage:
  agentstate-lite version [--json]

Reports the package version, source commit/dirty state baked at build time, artifact channel and
SHA-256, executable path and launch evidence, compatibility-contract generations, and any adjacent
package.json version drift. This command is entirely local and never contacts npm or another server.

${STABLE_MCP_LAUNCH_GUIDANCE}

Options:
  --json      Emit compact JSON instead of TOON
  -h, --help  Show this help
`;

export interface VersionCommandDeps {
  stdout: (text: string) => void;
  identity: () => ReturnType<typeof buildIdentityEnvelope>;
}

export async function versionCommand(
  argv: string[],
  deps: Partial<VersionCommandDeps> = {},
): Promise<void> {
  const stdout = deps.stdout ?? ((text: string) => void process.stdout.write(text));
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "version",
  );
  if (values.help) {
    stdout(VERSION_USAGE);
    return;
  }
  if (positionals.length > 0) {
    throw new CliError("USAGE", `unexpected positional argument: ${positionals[0]}`, {
      help: `${cliInvocation()} version --help`,
    });
  }
  stdout(render((deps.identity ?? buildIdentityEnvelope)(), resolveMode(values)));
}
