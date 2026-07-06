// `doc history <id>` — see `../doc.ts`'s header comment for the CAS-token / attribution rationale.
import { parseArgs } from "node:util";
import { docVersions, type VersionInfo } from "@agentstate-lite/core";
import { openBundle, resolveRemoteFlag } from "../../bundle.js";
import { CliError } from "../../errors.js";
import { parseOrUsage } from "../../args.js";
import { render, resolveMode } from "../../output.js";
import { cliInvocation } from "../../invocation.js";
import { DOC_HISTORY_USAGE, type DocCliDeps, readErrorToCliError } from "./common.js";

export async function docHistory(argv: string[], deps: Partial<DocCliDeps>): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          dir: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "doc history",
  );
  if (values.help) {
    stdout(DOC_HISTORY_USAGE);
    return;
  }

  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc history requires a concept <id> positional", {
      help: `${cliInvocation()} doc history <id>`,
    });
  }

  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  let versions: VersionInfo[];
  try {
    versions = await docVersions(bundle, id);
  } catch (err) {
    throw readErrorToCliError(err, id, values.remote);
  }

  if (versions.length === 0) {
    // Definitive empty state (AXI §5): no history means the concept has never been written here — NOT
    // an error (exit 0), so an agent gets a clear "nothing to CAS against" rather than re-querying.
    stdout(
      render(
        {
          id,
          count: 0,
          versions: [],
          help: `no version history for '${id}' — it has not been written to this bundle`,
        },
        resolveMode(values),
      ),
    );
    return;
  }

  // Attributed history, newest-first (a history-keeping backend returns the full chain; the plain
  // filesystem keeps none, so honestly returns just the single current revision). The newest token is
  // offered inline as a ready-to-paste `--expected-version` for an optimistic update.
  stdout(
    render(
      {
        id,
        count: versions.length,
        versions: versions.map((v) =>
          v.agent === undefined
            ? { version: v.version, actor: v.actor, timestamp: v.timestamp }
            : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent },
        ),
        help: [`${cliInvocation()} doc update ${id} --expected-version ${versions[0]!.version}`],
      },
      resolveMode(values),
    ),
  );
}
