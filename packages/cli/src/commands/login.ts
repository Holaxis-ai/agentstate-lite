// `agentstate-lite login` — store an API key for a GATED wire-protocol remote.
//
// `--remote <url> --api-key <key>` (Stage-1 Unit 2b Part C): stores the key for the Cloudflare Worker
// deployment (`packages/worker`'s `withApiKey`) keyed by the remote's ORIGIN, so multiple gated
// remotes (e.g. staging + production) can each carry their own key. `--remote`-resolving commands
// (`bundle.ts`'s `openBundle`) read this back to source `RemoteBackend`'s `authToken`. The reference
// `serve()` never checks it (no auth there), so logging in against a local `serve()` is harmless, just
// unnecessary. (The OAuth/PKCE flow and the legacy `login --token` bearer store are both gone.)
//
// A plain offline credential write (0600 atomic, via credentials.ts). Key VALUES are never printed.
import { parseArgs } from "node:util";
import { normalizeServer } from "../config.js";
import { saveApiKeyForOrigin } from "../credentials.js";
import { CliError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const LOGIN_USAGE = `agentstate-lite login — store an API key for a gated remote (offline write)

Usage:
  agentstate-lite login --remote <url> --api-key <key>

Stores an API key for a gated wire-protocol remote (a Cloudflare Worker deployment), keyed by the
remote's ORIGIN — one key per remote, so a staging and a production deployment can each carry their
own. The key is sent as Authorization: Bearer <key> on every --remote request to this origin. A
subsequent 'login --remote <url> --api-key' for the SAME origin overwrites only that origin's key;
every other stored origin survives. (To JOIN a bundle via an invite instead, use 'join'.)

Options:
  --remote <url>   Base URL of the gated remote (required)
  --api-key <key>  Opaque API key, stored verbatim (required)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;

/** Injectable seam so flag parsing can be unit-tested without touching disk. */
export interface LoginCliDeps {
  saveApiKey: (origin: string, apiKey: string) => Promise<void>;
  stdout: (s: string) => void;
}

/** CLI entry: parse flags, store the per-origin API key offline. */
export async function login(argv: string[], deps: Partial<LoginCliDeps> = {}): Promise<void> {
  const saveApiKey = deps.saveApiKey ?? ((origin: string, apiKey: string) => saveApiKeyForOrigin(origin, apiKey));
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          remote: { type: "string" },
          "api-key": { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "login",
  );
  if (values.help) {
    stdout(LOGIN_USAGE);
    return;
  }

  const remote = values.remote?.trim();
  const apiKey = values["api-key"]?.trim();
  if (!remote || !apiKey) {
    throw new CliError("USAGE", "login requires --remote <url> and --api-key <key>", {
      help: `${cliInvocation()} login --remote <url> --api-key <key>`,
    });
  }

  // normalizeServer throws on a malformed URL — surface it as a USAGE error (exit 2).
  let origin: string;
  try {
    origin = normalizeServer(remote).resource;
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} login --remote http://127.0.0.1:4818 --api-key <key>`,
    });
  }
  await saveApiKey(origin, apiKey);
  stdout(
    render(
      { login: "ok", remote: origin, help: [`${cliInvocation()} list --remote ${origin}`] },
      resolveMode(values),
    ),
  );
}
