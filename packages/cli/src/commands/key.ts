// `agentstate-lite key mint|list|revoke` — manage API keys for a remote bundle's
// multi-human auth (Stage-2 auth Part A: `POST /v0/keys`, `GET /v0/keys`, `DELETE
// /v0/keys/{id}` — `packages/worker/src/auth-routes.ts`, the ENDPOINT CONTRACT this
// command consumes). Two mint shapes: a bare `key mint` mints a NEW key for the CALLER
// (self-mint; any member may do this — no admin role required); `--agent <label>` is
// admin-only and creates a brand-new synthetic agent user + its first key. There is no way
// to mint a key for an EXISTING other user — impersonation is structurally unreachable
// through this endpoint; a human joins via an invite ONLY (see `join`).
//
// The minted secret is printed EXACTLY ONCE, in the mint receipt, with storage guidance.
// Unlike `join`, it is NEVER auto-saved to the local credentials file: the `--agent` case
// mints it for a brand-new principal that may not even be the LOCAL caller, and a bare
// self-mint may be requested precisely to hand the key to a different machine/process —
// auto-storing would guess wrong in both cases. `key list` never returns the secret (the
// server's own SELECT list excludes `key_hash`; the wire response carries only
// prefix/last_four).
import { parseArgs } from "node:util";
import {
  authRequest,
  resolveAuthContext,
  type MintKeyResponse,
  type ListKeysResponse,
  type RevokeKeyResponse,
} from "../auth-client.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

export const KEY_USAGE = `agentstate-lite key — mint, list, or revoke API keys for a remote bundle

Usage:
  agentstate-lite key mint   --remote <url> [--label <s>]
  agentstate-lite key mint   --remote <url> --agent <name> [--label <s>]
  agentstate-lite key list   --remote <url> [--fields <a,b,... | all>]
  agentstate-lite key revoke --remote <url> <key_id>

A bare 'key mint' mints a key for the CALLER (self-mint; any member may do this).
'key mint --agent <name>' is admin-only: it creates a brand-new synthetic agent user and
mints its first key — there is no way to mint a credential for an EXISTING user (a human
joins via an invite only; see 'join').

The minted secret is printed EXACTLY ONCE in the mint receipt and is NEVER stored
automatically — save it yourself, e.g. via
'agentstate-lite login --remote <url> --api-key <key>' (substituting the printed value),
or your own secret store. 'key list' never shows the secret (prefix/last_four only).
'key revoke' is idempotent (changed:false if already revoked or absent).

Options:
  --label <s>     Human-readable label for the minted key
  --fields <a,b|all>  [list] Add columns to the minimal {id,key_prefix,label,status} row, or 'all'
                  for the full record (last_four, user_id, created_by, created_at, …) — never the secret
  --agent <name>  Mint a NEW agent user's first key (admin-only)
  --remote <url>  Base URL of the auth-gated remote deployment
                  (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json          Emit compact JSON instead of TOON
  -h, --help      Show this help
`;

export interface KeyCliDeps {
  stdout: (s: string) => void;
}

export async function key(argv: string[], deps: Partial<KeyCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "mint") return keyMint(rest, stdout);
  if (sub === "list") return keyList(rest, stdout);
  if (sub === "revoke") return keyRevoke(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(KEY_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown key subcommand: ${sub} (expected mint|list|revoke)`, {
    help: `${cliInvocation()} key --help`,
  });
}

async function keyMint(argv: string[], stdout: (s: string) => void): Promise<void> {
  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          label: { type: "string" },
          agent: { type: "string" },
          remote: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "key mint",
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }

  const label = values.label?.trim();
  const agent = values.agent?.trim();
  const { base, authToken } = await resolveAuthContext(values.remote);

  let result: MintKeyResponse;
  try {
    result = await authRequest<MintKeyResponse>(base, "/v0/keys", {
      method: "POST",
      authToken,
      body: {
        ...(agent ? { new_agent_label: agent } : {}),
        ...(label ? { label } : {}),
      },
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }

  const rec: Record<string, unknown> = {
    id: result.id,
    user_id: result.user_id,
    label: result.label,
    key_prefix: result.key_prefix,
    last_four: result.last_four,
    api_key: result.api_key,
    note:
      "save this key now — it will not be shown again. Store it with " +
      `'${cliInvocation()} login --remote <url> --api-key <key>' (substitute the real url/key) ` +
      "or your own secret store.",
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}

/** The minimal default row for `key list` (AXI §2) — never the secret; the rest is opt-in. */
const KEY_DEFAULT_COLS = ["id", "key_prefix", "label", "status"];
const KEY_ALL_COLS = [
  ...KEY_DEFAULT_COLS,
  "last_four",
  "user_id",
  "created_by",
  "created_at",
  "revoked_at",
];

/** Which columns `--fields` selects: default minimal; `all`/`*` → every column; else default + extras. */
function keyCols(fieldsFlag: string | undefined): string[] {
  if (fieldsFlag === undefined) return KEY_DEFAULT_COLS;
  const req = fieldsFlag.trim().toLowerCase();
  if (req === "all" || req === "*") return KEY_ALL_COLS;
  const extra = fieldsFlag
    .split(",")
    .map((f) => f.trim())
    .filter((f) => f && !KEY_DEFAULT_COLS.includes(f));
  return [...KEY_DEFAULT_COLS, ...extra];
}

async function keyList(argv: string[], stdout: (s: string) => void): Promise<void> {
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
    "key list",
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: ListKeysResponse;
  try {
    result = await authRequest<ListKeysResponse>(base, "/v0/keys", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }

  // Minimal default row (§2); full record via `--fields all`. `status` folds the revoked_at pair;
  // the secret (`key_hash`) is never on the wire record at all — only prefix/last_four ever appear.
  const cols = keyCols(values.fields);
  const rows = result.keys.map((k) => {
    const full: Record<string, unknown> = {
      id: k.id,
      key_prefix: k.keyPrefix,
      label: k.label ?? "",
      status: k.revokedAt ? "revoked" : "active",
      last_four: k.lastFour,
      user_id: k.userId,
      created_by: k.createdBy,
      created_at: k.createdAt,
      revoked_at: k.revokedAt ?? "",
    };
    const row: Record<string, unknown> = {};
    for (const c of cols) if (c in full) row[c] = full[c];
    return row;
  });

  const rec: Record<string, unknown> = { count: result.count, keys: rows };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  rec.help =
    result.count === 0
      ? [`no API keys yet — mint one with \`${cliInvocation()} key mint --remote ${remote}\``]
      : [
          `${cliInvocation()} key revoke --remote ${remote} <key_id>`,
          `pass \`--fields all\` for the full record (user_id, created_at, …)`,
        ];
  stdout(render(rec, resolveMode(values)));
}

async function keyRevoke(argv: string[], stdout: (s: string) => void): Promise<void> {
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
    "key revoke",
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "key revoke requires a <key_id> positional", {
      help: `${cliInvocation()} key revoke --remote <url> <key_id>`,
    });
  }

  const { base, authToken } = await resolveAuthContext(values.remote);
  let result: RevokeKeyResponse;
  try {
    result = await authRequest<RevokeKeyResponse>(base, `/v0/keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken,
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  stdout(render({ id: result.id, changed: result.changed }, resolveMode(values)));
}
