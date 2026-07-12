/**
 * Lightweight HTTP client for the Stage-2 multi-human auth surface: `POST /v0/join`
 * (unauthenticated) and the authenticated `GET /v0/whoami`, `/v0/invites*`,
 * `/v0/members*`, `/v0/keys*` routes (`packages/worker/src/auth-routes.ts` — the ENDPOINT
 * CONTRACT this module consumes). The request/response wire shapes themselves live in
 * `@agentstate-lite/core`'s `auth-wire.ts` (the SHARED WIRE CONTRACT the worker's response
 * bodies are `satisfies`-checked against) and are re-exported below, unchanged, so every
 * command file keeps importing them from "./auth-client.js".
 *
 * These routes are NOT bundle-scoped (no `/v0/bundles/{bundle}/...` prefix — they live at
 * the deployment root, `/v0/...`), so they sit outside `RemoteBackend`'s `StorageBackend`
 * contract (`@agentstate-lite/core`'s `remote-backend.ts`, which only speaks the
 * bundle-scoped doc/blob/reserved wire surface). This is a separate, deliberately thin
 * client for the deployment-identity surface — it shares `RemoteBackend`'s error-mapping
 * convention (throwing a `RemoteError` from `@agentstate-lite/core` on any non-2xx) so
 * `errors.ts`'s existing `classifyBundleError`/`toExit` classify a failure from THIS module
 * exactly the same way they classify one from a bundle command: `AUTH_REQUIRED` -> exit 4,
 * `RUNTIME`/`VERSION_MISSING` -> exit 1, everything else -> USAGE/exit 2 — without
 * duplicating that classification logic here.
 *
 * Auth: mirrors `bundle.ts`'s `openRemoteBundle` API-key sourcing exactly —
 * `AGENTSTATE_LITE_API_KEY` env var first, else the origin-keyed credentials-file entry
 * (`AGENTSTATE_LITE_API_KEY`, or an already-provisioned stored per-origin key). `POST
 * /v0/join` is the ONE route in this module that sends NO `Authorization` header (the
 * invite token in the request body IS the credential).
 *
 * Deliberately NOT the same wording as `bundle.ts`'s `wrapTransportErrors` "run `serve`"
 * hint on a transport failure: these commands talk to a DEPLOYED remote (a Cloudflare
 * Worker), not the local reference `serve()`, so suggesting `serve --dir <path>` would be
 * actively wrong here. The message names the unreachable URL instead.
 */
import { RemoteError } from "@agentstate-lite/core";
import { CliError } from "./errors.js";
import { cliInvocation } from "./invocation.js";
import { normalizeServer } from "./config.js";
import { getApiKeyForOrigin } from "./credentials.js";
import { API_KEY_ENV_VAR, resolveRemoteFlag } from "./bundle.js";

// ── wire response shapes ────────────────────────────────────────────────────────────────
//
// The `ROLES`/`Role`/`isRole` runtime + the 15 auth-route request/response interfaces are
// the SHARED WIRE CONTRACT for this surface (`packages/worker/src/auth-routes.ts` is the
// endpoint contract that PRODUCES them; the future UI is a third consumer) — they now live
// in `@agentstate-lite/core`'s `auth-wire.ts` (core is the one package both the CLI and the
// worker already depend on) so the worker and this client cannot silently drift apart.
// Re-exported here, unchanged, so every command file below keeps importing them from
// "./auth-client.js" without a second edit pass.
export { ROLES, isRole } from "@agentstate-lite/core";
export type {
  Role,
  JoinResponse,
  MembershipWire,
  WhoamiResponse,
  ListBundlesResponse,
  InviteRecordWire,
  CreateInviteResponse,
  ListInvitesResponse,
  RevokeInviteResponse,
  MemberRecordWire,
  ListMembersResponse,
  SetMemberRoleResponse,
  RemoveMemberResponse,
  MintKeyResponse,
  ApiKeyRecordWire,
  ListKeysResponse,
  RevokeKeyResponse,
} from "@agentstate-lite/core";

// ── remote/credential resolution ────────────────────────────────────────────────────────

/**
 * Resolve a `--remote <url>` flag into `{base, origin}` for the auth-route surface: the
 * SAME "explicit beats ambient" `AGENTSTATE_LITE_REMOTE`/project-binding fallback every
 * other remote-capable command uses (`bundle.ts`'s `resolveRemoteFlag`, called here with no
 * `--dir` concept to suppress), then the same http(s) URL discipline the `--remote` bundle
 * commands apply (`config.ts`'s `normalizeServer`). Throws a USAGE
 * CliError (exit 2) when no remote can be resolved at all, or when the resolved value is a
 * malformed/non-http(s) URL.
 */
export async function resolveRemoteOnly(remoteFlag: string | undefined): Promise<{ base: string; origin: string }> {
  const remote = await resolveRemoteFlag(remoteFlag, undefined);
  if (!remote) {
    throw new CliError("USAGE", "--remote <url> is required (or set AGENTSTATE_LITE_REMOTE)", {
      help: `${cliInvocation()} <command> --remote <url>`,
    });
  }
  try {
    const resolved = normalizeServer(remote);
    return { base: resolved.base, origin: resolved.resource };
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} <command> --remote https://your-worker.example.workers.dev`,
    });
  }
}

/** Source a bearer token for `origin`: `AGENTSTATE_LITE_API_KEY` env var first, else the stored per-origin key. `undefined` if neither. */
export async function resolveAuthToken(origin: string): Promise<string | undefined> {
  const envKey = process.env[API_KEY_ENV_VAR]?.trim();
  if (envKey) return envKey;
  return getApiKeyForOrigin(origin);
}

export interface ResolvedAuthContext {
  base: string;
  origin: string;
  authToken?: string;
}

/** {@link resolveRemoteOnly} + {@link resolveAuthToken} in one call — the shape every AUTHENTICATED command in this surface needs (everything except `join`, which has no key yet). */
export async function resolveAuthContext(remoteFlag: string | undefined): Promise<ResolvedAuthContext> {
  const { base, origin } = await resolveRemoteOnly(remoteFlag);
  const authToken = await resolveAuthToken(origin);
  return { base, origin, authToken };
}

// ── transport ────────────────────────────────────────────────────────────────────────────

/** The wire-protocol JSON error envelope (matches `RemoteBackend`'s own local copy — see that module). */
interface ErrorEnvelope {
  error: { code: string; message: string; details?: Record<string, unknown> };
}

/**
 * Send a pre-built `Request` (never a bare `(url, init)` pair) through `globalThis.fetch` —
 * matching `RemoteBackend.send`'s exact shape (`core/src/remote-backend.ts`), so the SAME
 * "inject a router function AS the transport" idiom that module's tests use
 * (`createRouter(bundle)` returns exactly the `(req: Request) => Promise<Response>` shape a
 * monkey-patched `globalThis.fetch` needs) also works for this client's tests, with no
 * sockets involved either way.
 */
async function safeFetch(request: Request): Promise<Response> {
  try {
    return await globalThis.fetch(request);
  } catch (err) {
    throw new CliError(
      "RUNTIME",
      `could not reach ${request.url} (${err instanceof Error ? err.message : String(err)})`,
    );
  }
}

/** Parse a non-2xx response into a `RemoteError` — the SAME mapping `RemoteBackend.toError` uses for the bundle-scoped surface (no 412/VersionConflict case here: none of these routes are CAS-guarded). */
async function toRemoteError(res: Response): Promise<RemoteError> {
  let envelope: ErrorEnvelope | null = null;
  try {
    envelope = (await res.json()) as ErrorEnvelope;
  } catch {
    envelope = null;
  }
  const message = envelope?.error?.message ?? `request failed with status ${res.status}`;
  const code =
    envelope?.error?.code ?? (res.status === 401 ? "AUTH_REQUIRED" : res.status >= 500 ? "RUNTIME" : "USAGE");
  return new RemoteError(message, code, res.status);
}

export interface AuthRequestOptions {
  method?: string;
  body?: unknown;
  /** Bearer token; omit for the one unauthenticated route (`POST /v0/join`). */
  authToken?: string;
}

/** Call one `/v0/...` auth route and parse its JSON success body as `T`. Throws a `RemoteError` on any non-2xx, or a `CliError("RUNTIME", …)` on a transport failure. */
export async function authRequest<T>(base: string, path: string, options: AuthRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.authToken) headers["Authorization"] = `Bearer ${options.authToken}`;

  const request = new Request(`${base}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const res = await safeFetch(request);
  if (!res.ok) throw await toRemoteError(res);
  return (await res.json()) as T;
}
