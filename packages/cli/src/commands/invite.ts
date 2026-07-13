// `agentstate-lite invite create|list|revoke` — manage join invites for a remote bundle's
// multi-human auth (Stage-2 auth Part A: `POST /v0/invites`, `GET /v0/invites`, `DELETE
// /v0/invites/{id}` — `packages/worker/src/auth-routes.ts`, the ENDPOINT CONTRACT this
// command consumes). Requires an admin membership on the target bundle (or the root
// bootstrap identity) — a non-admin caller gets the server's 403 FORBIDDEN, which (like
// any code `classifyBundleError` doesn't special-case) surfaces as USAGE/exit 2.
import { parseArgs } from "node:util";
import {
  authRequest,
  resolveAuthContext,
  isRole,
  ROLES,
  type CreateInviteResponse,
  type ListInvitesResponse,
  type RevokeInviteResponse,
} from "../auth-client.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const INVITE_USAGE = `agentstate-lite invite — create, list, or revoke join invites for a remote bundle

Usage:
  agentstate-lite invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]
  agentstate-lite invite list   --remote <url> [--fields <a,b,... | all>]
  agentstate-lite invite revoke --remote <url> <invite_id>

Requires an admin membership on the target remote (or the root bootstrap identity).
'invite create' prints the invite TOKEN once — it is the shareable secret; anyone holding
it can run 'join' to redeem it (unlike an API key, printing it here is correct: the
token IS meant to be handed to the intended joiner). 'invite revoke' is idempotent
(changed:false if already revoked or absent).

Options:
  --role <r>             Role the redeemer receives: admin | writer | reader  [create; required]
  --fields <a,b|all>     [list] Add columns to the minimal {id,role,expires_at,status} row, or 'all'
                         for the full record (bundle, created_by, redeemed_by, redeemed_at, …)
  --expires-in <hours>   Invite lifetime in hours (default: server default, one week)
  --display-hint <s>     Suggested display name shown to the redeemer
  --remote <url>         Base URL of the auth-gated remote deployment (required explicitly)
  --json                 Emit compact JSON instead of TOON
  -h, --help             Show this help
`;

export interface InviteCliDeps {
  stdout: (s: string) => void;
}

export async function invite(argv: string[], deps: Partial<InviteCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "create") return inviteCreate(rest, stdout);
  if (sub === "list") return inviteList(rest, stdout);
  if (sub === "revoke") return inviteRevoke(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(INVITE_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown invite subcommand: ${sub} (expected create|list|revoke)`, {
    help: `${cliInvocation()} invite --help`,
  });
}

async function inviteCreate(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          role: { type: "string" },
          "expires-in": { type: "string" },
          "display-hint": { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "invite create",
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }

  const role = values.role?.trim();
  if (!role || !isRole(role)) {
    throw new CliError("USAGE", `--role <r> is required and must be one of: ${ROLES.join(", ")}`, {
      help: `${cliInvocation()} invite create --remote <url> --role writer`,
    });
  }
  let expiresInHours: number | undefined;
  if (values["expires-in"] !== undefined) {
    const n = Number(values["expires-in"]);
    if (!Number.isFinite(n) || n <= 0) {
      throw new CliError("USAGE", "--expires-in <hours> must be a positive number", {
        help: `${cliInvocation()} invite create --remote <url> --role ${role} --expires-in 24`,
      });
    }
    expiresInHours = n;
  }
  const displayHint = values["display-hint"]?.trim();

  const { base, origin, authToken } = await resolveAuthContext(values.remote);

  let result: CreateInviteResponse;
  try {
    result = await authRequest<CreateInviteResponse>(base, "/v0/invites", {
      method: "POST",
      authToken,
      body: {
        role,
        ...(expiresInHours !== undefined ? { expires_in_hours: expiresInHours } : {}),
        ...(displayHint ? { display_hint: displayHint } : {}),
      },
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }

  const rec: Record<string, unknown> = {
    invite_id: result.invite_id,
    bundle: result.bundle,
    role: result.role,
    expires_at: result.expires_at,
    token: result.token,
    help: [`${cliInvocation()} join --remote ${origin} --invite ${result.token}`],
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}

/** The minimal default row for `invite list` (AXI §2) — the rest is opt-in via `--fields`. */
const INVITE_DEFAULT_COLS = ["id", "role", "expires_at", "status"];
const INVITE_ALL_COLS = [
  ...INVITE_DEFAULT_COLS,
  "bundle",
  "created_by",
  "redeemed_by",
  "redeemed_at",
  "display_hint",
];

/** Derived lifecycle status (the fold that lets the wide redeemed/revoked columns drop by default). */
function inviteStatus(inv: {
  revokedAt: string | null;
  redeemedAt: string | null;
  redeemedBy: string | null;
}): string {
  if (inv.revokedAt) return "revoked";
  if (inv.redeemedAt || inv.redeemedBy) return "redeemed";
  return "pending";
}

/** Which columns `--fields` selects: default minimal; `all`/`*` → every column; else default + extras. */
function inviteCols(fieldsFlag: string | undefined): string[] {
  if (fieldsFlag === undefined) return INVITE_DEFAULT_COLS;
  const req = fieldsFlag.trim().toLowerCase();
  if (req === "all" || req === "*") return INVITE_ALL_COLS;
  const extra = fieldsFlag
    .split(",")
    .map((f) => f.trim())
    .filter((f) => f && !INVITE_DEFAULT_COLS.includes(f));
  return [...INVITE_DEFAULT_COLS, ...extra];
}

async function inviteList(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          fields: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "invite list",
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: ListInvitesResponse;
  try {
    result = await authRequest<ListInvitesResponse>(base, "/v0/invites", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }

  // Minimal default row (§2) — full record via `--fields all` (or named extras). Each invite folds
  // its redeemed/revoked pair into one derived `status`.
  const cols = inviteCols(values.fields);
  const rows = result.invites.map((inv) => {
    const full: Record<string, unknown> = {
      id: inv.id,
      role: inv.role,
      expires_at: inv.expiresAt,
      status: inviteStatus(inv),
      bundle: inv.bundle,
      created_by: inv.createdBy,
      redeemed_by: inv.redeemedBy ?? "",
      redeemed_at: inv.redeemedAt ?? "",
      display_hint: inv.displayHint ?? "",
    };
    const row: Record<string, unknown> = {};
    for (const c of cols) if (c in full) row[c] = full[c];
    return row;
  });

  const rec: Record<string, unknown> = { count: result.count, invites: rows };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  rec.help =
    result.count === 0
      ? [`no invites yet — create one with \`${cliInvocation()} invite create --remote ${remote} --role writer\``]
      : [
          `${cliInvocation()} invite revoke --remote ${remote} <invite_id>`,
          `pass \`--fields all\` for the full record (created_by, redeemed_by, …)`,
        ];
  stdout(render(rec, resolveMode(values)));
}

async function inviteRevoke(argv: string[], stdout: (s: string) => void): Promise<void> {
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
    "invite revoke",
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "invite revoke requires an <invite_id> positional", {
      help: `${cliInvocation()} invite revoke --remote <url> <invite_id>`,
    });
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: RevokeInviteResponse;
  try {
    result = await authRequest<RevokeInviteResponse>(base, `/v0/invites/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken,
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec: Record<string, unknown> = { invite_id: result.invite_id, changed: result.changed };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}
