// `agentstate-lite bundle locate` — expose the exact local bundle target the CLI would use.
import { parseArgs } from "node:util";
import { parseOrUsage } from "../args.js";
import { resolveLocalBundleTarget } from "../bundle.js";
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";
import { render, resolveMode } from "../output.js";

export const BUNDLE_USAGE = `agentstate-lite bundle — inspect local bundle targeting

Usage:
  agentstate-lite bundle locate [--dir <path>]

Commands:
  locate                  Resolve the exact local bundle this invocation would use

Options:
  --dir <path>            Resolve this literal bundle root instead of project context
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help

Resolution preserves normal CLI precedence: explicit --dir, then the nearest project binding,
then local discovery. A successful receipt contains a canonical absolute local path suitable for
passing back to ordinary commands with --dir. This command never reads or selects an HTTP remote.
`;

export interface BundleCliDeps {
  stdout: (s: string) => void;
  cwd: () => string;
}

export async function bundleCommand(argv: string[], deps: Partial<BundleCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const cwd = deps.cwd ?? (() => process.cwd());
  const parsed = parseOrUsage(
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
    "bundle locate",
  );

  if (parsed.values.help || parsed.positionals.length === 0) {
    stdout(BUNDLE_USAGE);
    return;
  }
  const [subcommand, ...extra] = parsed.positionals;
  if (subcommand !== "locate" || extra.length > 0) {
    throw new CliError("USAGE", `unknown bundle subcommand: ${subcommand ?? ""}`, {
      help: `${cliInvocation()} bundle locate --help`,
    });
  }

  const target = await resolveLocalBundleTarget(parsed.values.dir, cwd());
  stdout(
    render(
      {
        schema_version: 1,
        locator: { kind: "local-path", path: target.canonicalRoot },
        selected_by: target.selectedBy,
        ...(target.bindingFile ? { binding_file: target.bindingFile } : {}),
        available: true,
      },
      resolveMode(parsed.values),
    ),
  );
}
