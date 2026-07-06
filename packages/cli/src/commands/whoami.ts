// `agentstate-lite whoami` — show which remotes you hold a stored key for, or (with --remote) the
// live remote identity.
//
// Without --remote (and no AGENTSTATE_LITE_REMOTE default): OFFLINE — it reads
// ~/.agentstate/okf-config.json and lists the remote ORIGINS you hold a per-origin API key for
// (stored by `join` / `login --remote --api-key`), WITHOUT a network call and WITHOUT printing any
// key value. A definitive empty state (`logged_in:false`, exit 0) when none is stored.
//
// With --remote <url> (Stage-2 auth Part B — the CLI surface for `packages/worker/src/
// auth-routes.ts`'s multi-human identity): GETs /v0/whoami against the resolved remote,
// using the ORIGIN-KEYED API key stored by `join` or `login --remote --api-key` (or the
// AGENTSTATE_LITE_API_KEY env override — see auth-client.ts's `resolveAuthToken`), and
// reports the resolved identity, its per-bundle memberships, and whether it authenticated
// as the root bootstrap identity. This is a genuine network call, unlike the local path.
//
// A committed `.agentstate.json` naming an http(s) URL (item 43 follow-on, `bundle.ts`'s
// `resolveRemoteFlag`) is ALSO consumed here, exactly like the AGENTSTATE_LITE_REMOTE env
// default it sits alongside in the precedence chain — so a bare `whoami` in a bound project
// goes LIVE via that URL. The offline listing (reached only when no --remote/env/URL-binding
// resolved at all) additionally notes any DIRECTORY-type binding it finds — irrelevant to
// whoami's own job, but a courtesy so a cold agent isn't left wondering why a binding visibly
// committed in the repo didn't change this listing.
import { parseArgs } from "node:util";
import { loadCredentials, type Credentials } from "../credentials.js";
import { render, resolveMode, type OutputMode } from "../output.js";
import { CliError, classifyBundleError } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { cliInvocation } from "../invocation.js";
import { resolveRemoteFlag, resolveProjectBinding } from "../bundle.js";
import { authRequest, resolveRemoteOnly, resolveAuthToken, type WhoamiResponse } from "../auth-client.js";

export const WHOAMI_USAGE = `agentstate-lite whoami — show which remotes you hold a key for, or (with --remote) the live remote identity

Usage:
  agentstate-lite whoami [--remote <url>]

Without --remote (and no AGENTSTATE_LITE_REMOTE default): OFFLINE — lists the remote origins
you hold a stored key for, without a network call.

With --remote <url> (or an AGENTSTATE_LITE_REMOTE default): GETs /v0/whoami against the
gated remote, using the ORIGIN-KEYED API key stored by 'join' or 'login --remote
--api-key' (or AGENTSTATE_LITE_API_KEY) — reports the resolved identity, its role per
bundle membership, and whether it authenticated as the root bootstrap identity.

Options:
  --remote <url>   Show the LIVE remote identity instead of the local credential file
                   (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;

/** Injectable seam so the parse→load wiring is unit-testable without touching the real home dir. */
export interface WhoamiCliDeps {
  loadCreds: () => Promise<Credentials | null>;
  stdout: (s: string) => void;
}

/** CLI entry: local path lists the stored remote origins (never a key value); --remote GETs the live identity instead. */
export async function whoami(argv: string[], deps: Partial<WhoamiCliDeps> = {}): Promise<void> {
  const loadCreds = deps.loadCreds ?? loadCredentials;
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

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
    "whoami",
  );
  if (values.help) {
    stdout(WHOAMI_USAGE);
    return;
  }

  // Explicit --remote wins; otherwise AGENTSTATE_LITE_REMOTE (explicit beats ambient, same
  // rule every other remote-capable command follows — see bundle.ts's resolveRemoteFlag).
  // whoami has no --dir concept, so there is nothing for an ambient default to conflict with.
  const remote = await resolveRemoteFlag(values.remote, undefined);
  if (remote) {
    return whoamiRemote(remote, resolveMode(values), stdout);
  }

  // `whoami` (no --remote) is OFFLINE: it lists the remote origins you already hold a stored key for
  // (Stage-1 Unit 2b Part C / Stage-2 `join`) — the honest "which shared workspace can I reach?"
  // answer a cold agent needs (cold-start study C5 wished for exactly this). Never a network call;
  // never prints a key value.
  const creds = await loadCreds();
  const remoteOrigins = creds?.remotes ? Object.keys(creds.remotes).sort() : [];

  // A courtesy note (item 43 follow-on): `resolveRemoteFlag` above already consumed a URL-type
  // `.agentstate.json` binding (routing into `whoamiRemote` instead) — so ANY binding still found
  // at this point is necessarily the directory-type half, which is irrelevant to whoami's own
  // remote-identity job but worth surfacing so a cold agent isn't left wondering why a binding it
  // can see committed in the repo didn't change this listing. Best-effort: a malformed file would
  // already have been surfaced by `resolveRemoteFlag` above, so a throw here (a TOCTOU race) is not
  // fatal to this offline listing.
  let projectBinding: { file: string; target: string } | undefined;
  try {
    const found = await resolveProjectBinding();
    if (found) projectBinding = { file: found.file, target: found.target };
  } catch {
    /* see above — not fatal to the offline listing */
  }

  if (remoteOrigins.length === 0) {
    // "No login stored" is a legitimate ANSWER to the query, not a failed operation: this tool is
    // local-first (it works with the network off and needs no login for a --dir bundle), and the
    // offline whoami is discovery — "which shared workspace can I reach?" — not an auth gate. Render
    // a DEFINITIVE EMPTY STATE at exit 0 (AXI §5), matching `home`'s logged-out/exit-0 report for the
    // SAME underlying state, rather than throwing AUTH_REQUIRED (exit 4) — exit 4 read as "you must
    // authenticate" and pushed agents to (pointlessly) try to log in when nothing needs it.
    const rec: Record<string, unknown> = {
      logged_in: false,
      remotes: [],
      help: [
        `${cliInvocation()} whoami --remote <url>  (check a gated remote identity)`,
        `${cliInvocation()} join --remote <url> --invite <token>  (join a shared bundle)`,
      ],
    };
    if (projectBinding) rec.project_binding = projectBinding;
    stdout(render(rec, resolveMode(values)));
    return;
  }
  const rec: Record<string, unknown> = {
    logged_in: true,
    remotes: remoteOrigins,
    help: [`${cliInvocation()} whoami --remote ${remoteOrigins[0]}`],
  };
  if (projectBinding) rec.project_binding = projectBinding;
  stdout(render(rec, resolveMode(values)));
}

async function whoamiRemote(remoteFlag: string, mode: OutputMode, stdout: (s: string) => void): Promise<void> {
  const { base, origin } = await resolveRemoteOnly(remoteFlag);
  const authToken = await resolveAuthToken(origin);

  let body: WhoamiResponse;
  try {
    body = await authRequest<WhoamiResponse>(base, "/v0/whoami", { authToken });
  } catch (err) {
    const classified = classifyBundleError(err, remoteFlag);
    // whoami is usually the FIRST thing a never-joined caller runs against a fresh remote — the
    // generic classifyBundleError hint ("login --remote --api-key <key>") presumes a key already
    // exists somewhere to store; point at the actual onboarding path (an invite) too.
    if (classified.code === "AUTH_REQUIRED") {
      throw new CliError("AUTH_REQUIRED", classified.message, {
        help:
          `${cliInvocation()} join --remote ${origin} --invite <token>` +
          ` (or, if you already have a key: ${cliInvocation()} login --remote ${origin} --api-key <key>)`,
      });
    }
    throw classified;
  }

  const rec: Record<string, unknown> = {
    remote: origin,
    user_id: body.user_id,
    display: body.display,
    method: body.method,
    memberships: body.memberships,
  };
  if (body.bootstrap) {
    rec.bootstrap = true;
    // Gloss the bare flag: a cold agent that authenticates as admin with no login step needs to
    // know WHY (cold-start study — "am I even allowed to write?" was C4's most-unsure moment).
    rec.bootstrap_note =
      "no members are provisioned on this deployment yet — every valid key authenticates as the root admin; provision members (invite create / member set-role) to lock it down";
  }
  stdout(render(rec, mode));
}
