// `agentstate-lite member list|set-role|remove` — manage membership roles for a remote
// bundle's multi-human auth (Stage-2 auth Part A: `GET /v0/members`, `PUT
// /v0/members/{user_id}/role`, `DELETE /v0/members/{user_id}` —
// `packages/worker/src/auth-routes.ts`, the ENDPOINT CONTRACT this command consumes).
// Admin-only (root, or a real admin membership on the target bundle).
import { parseArgs } from "node:util";
import {
  authRequest,
  resolveAuthContext,
  isRole,
  ROLES,
  type ListMembersResponse,
  type SetMemberRoleResponse,
  type RemoveMemberResponse,
} from "../auth-client.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const MEMBER_USAGE = `agentstate-lite member — list, change the role of, or remove a remote bundle's members

Usage:
  agentstate-lite member list     --remote <url>
  agentstate-lite member set-role --remote <url> <user_id> <role>
  agentstate-lite member remove   --remote <url> <user_id>

Requires an admin membership on the target remote (or the root bootstrap identity).
'member set-role' and 'member remove' are idempotent (changed:false on a repeat that
changes nothing). 'member remove' also revokes EVERY API key the removed user holds,
deployment-wide (single-bundle scope today) — see the returned revoked_keys count. The
server also refuses to demote or remove the LAST admin of a bundle (409, surfaced here as
a USAGE error — see 'invite'/'member' usage text for the deployment's single-bundle scope).

Options:
  --remote <url>   Base URL of the auth-gated remote deployment (required explicitly)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;

export interface MemberCliDeps {
  stdout: (s: string) => void;
}

export async function member(argv: string[], deps: Partial<MemberCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "list") return memberList(rest, stdout);
  if (sub === "set-role") return memberSetRole(rest, stdout);
  if (sub === "remove") return memberRemove(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(MEMBER_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown member subcommand: ${sub} (expected list|set-role|remove)`, {
    help: `${cliInvocation()} member --help`,
  });
}

async function memberList(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "member list",
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: ListMembersResponse;
  try {
    result = await authRequest<ListMembersResponse>(base, "/v0/members", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec: Record<string, unknown> = { count: result.count, members: result.members };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  // Contextual next steps (§9): the members list's natural follow-ups are role change / removal.
  if (result.count > 0) {
    rec.help = [
      `${cliInvocation()} member set-role --remote ${remote} <user_id> <role>`,
      `${cliInvocation()} member remove --remote ${remote} <user_id>`,
    ];
  }
  stdout(render(rec, resolveMode(values)));
}

async function memberSetRole(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "member set-role",
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }
  const userId = positionals[0]?.trim();
  const role = positionals[1]?.trim();
  if (!userId || !role) {
    throw new CliError("USAGE", "member set-role requires <user_id> and <role> positionals", {
      help: `${cliInvocation()} member set-role --remote <url> <user_id> <role>`,
    });
  }
  if (!isRole(role)) {
    throw new CliError("USAGE", `<role> must be one of: ${ROLES.join(", ")}`, {
      help: `${cliInvocation()} member set-role --remote <url> ${userId} writer`,
    });
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: SetMemberRoleResponse;
  try {
    result = await authRequest<SetMemberRoleResponse>(base, `/v0/members/${encodeURIComponent(userId)}/role`, {
      method: "PUT",
      authToken,
      body: { role },
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec: Record<string, unknown> = {
    user_id: result.user_id,
    bundle: result.bundle,
    role: result.role,
    changed: result.changed,
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}

async function memberRemove(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values, positionals } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "member remove",
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }
  const userId = positionals[0]?.trim();
  if (!userId) {
    throw new CliError("USAGE", "member remove requires a <user_id> positional", {
      help: `${cliInvocation()} member remove --remote <url> <user_id>`,
    });
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: RemoveMemberResponse;
  try {
    result = await authRequest<RemoveMemberResponse>(base, `/v0/members/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      authToken,
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec: Record<string, unknown> = {
    user_id: result.user_id,
    bundle: result.bundle,
    changed: result.changed,
    revoked_keys: result.revoked_keys,
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}
