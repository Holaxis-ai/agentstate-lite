// `agentstate-lite join` — redeem an invite token to become a member of a remote bundle.
//
// The headline onboarding verb for Stage-2 multi-human auth (`POST /v0/join`,
// `packages/worker/src/auth-routes.ts`'s `handleJoin` — the ONE unauthenticated route: the
// invite token itself IS the credential). On success the server mints a fresh user + a
// brand-new API key and returns it ONCE; this command stores that key into the
// ORIGIN-KEYED credentials file (the same `saveApiKeyForOrigin` path `login --remote
// --api-key` uses) so every subsequent `--remote <url>` command against this origin
// authenticates automatically — the key itself is NEVER printed.
//
// `join` requires explicit `--remote`, like every other remote-capable command, but does NOT go
// through `openBundle`/
// `RemoteBackend`: there is no bundle to open yet, and the caller isn't a member of
// anything until this call succeeds — it is a NEW top-level command (like `login`), not a
// bundle subcommand.
import { parseArgs } from "node:util";
import { RemoteError } from "@agentstate-lite/core";
import { authRequest, resolveRemoteOnly, type JoinResponse } from "../auth-client.js";
import { saveApiKeyForOrigin } from "../credentials.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const JOIN_USAGE = `agentstate-lite join — redeem an invite token to join a remote bundle

Usage:
  agentstate-lite join --remote <url> --invite <token> [--display <name>]

On success, the returned API key is stored in the local credentials file, keyed to the
remote's origin — it is NEVER printed. Every subsequent --remote command against this
origin then authenticates automatically (the same lookup 'login --remote --api-key' uses).

Options:
  --remote <url>    Base URL of the auth-gated remote deployment (required explicitly)
  --invite <token>  The invite token to redeem                              [required]
  --display <name>  Display name to record for the new user
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;

export interface JoinCliDeps {
  saveApiKey: (origin: string, apiKey: string) => Promise<void>;
  stdout: (s: string) => void;
}

export async function join(argv: string[], deps: Partial<JoinCliDeps> = {}): Promise<void> {
  const saveApiKey = deps.saveApiKey ?? ((origin: string, apiKey: string) => saveApiKeyForOrigin(origin, apiKey));
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          remote: { type: "string" },
          invite: { type: "string" },
          display: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "join",
  );
  if (values.help) {
    stdout(JOIN_USAGE);
    return;
  }

  const inviteToken = values.invite?.trim();
  if (!inviteToken) {
    throw new CliError("USAGE", "--invite <token> is required", {
      help: `${cliInvocation()} join --remote <url> --invite <token>`,
    });
  }
  const { base, origin } = await resolveRemoteOnly(values.remote);
  const display = values.display?.trim();

  let result: JoinResponse;
  try {
    result = await authRequest<JoinResponse>(base, "/v0/join", {
      method: "POST",
      body: { invite_token: inviteToken, ...(display ? { display } : {}) },
    });
  } catch (err) {
    if (err instanceof CliError) throw err;
    // The server is deliberately ORACLE-FREE here: unknown / expired / revoked / already-used
    // all produce the IDENTICAL INVITE_INVALID envelope (see handleJoin's doc comment) — this
    // is the one place that generic message is worth a friendlier, actionable rewrite.
    if (err instanceof RemoteError && err.code === "INVITE_INVALID") {
      throw new CliError("USAGE", `${err.message} — ask an admin for a new invite`);
    }
    throw classifyBundleError(err, values.remote);
  }

  await saveApiKey(origin, result.api_key);

  stdout(
    render(
      {
        joined: true,
        remote: origin,
        user_id: result.user_id,
        role: result.role,
        bundle: result.bundle,
        key_prefix: result.key_prefix,
        help: [`${cliInvocation()} whoami --remote ${origin}`],
      },
      resolveMode(values),
    ),
  );
}
