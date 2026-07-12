// Bundle discovery for the `axi` CLI.
//
// Every OKF command operates on ONE Knowledge Bundle. Locally that's a directory tree rooted at
// the folder that holds the reserved `index.md`; this module turns a `--dir <path>` flag (or the
// cwd) into the `Bundle` handle the core engine consumes ({ root }). Discovery walks UP from the
// cwd to the nearest ancestor containing `index.md`, mirroring how `git` finds `.git` — so an
// agent can run `axi` from anywhere inside a bundle. `init` uses `resolveTargetDir` instead (it
// CREATES the bundle, so the dir need not already exist).
//
// `--remote <url>` (Stage 1 Unit 3 part B) is the OTHER way to resolve a bundle: it produces a
// `{ root: <url>, backend: RemoteBackend }` handle wired to a `docs/WIRE-PROTOCOL.md` v0 server
// (`agentstate-lite serve`). The sentinel `root` is the URL itself — it can never collide with a
// real filesystem path, and the viewer's `baseName()` fallback then derives a sane display label
// from it (the tri-backend tests' `mem://…` roots are the same pattern). An EXPLICIT `--remote`
// flag and an EXPLICIT `--dir` flag remain mutually exclusive (a USAGE error) — that combination
// contradicts the caller's own stated intent and cannot be silently resolved either way.
//
// `AGENTSTATE_LITE_REMOTE` (Stage-1 Unit 2a Part C, A9; semantics finalized in the post-ship
// review) is a session-wide fallback for `--remote` — but ONLY when NEITHER `--remote` NOR `--dir`
// was passed explicitly. An explicit `--dir` ALWAYS wins over the ambient env default (silently,
// no error) — explicit beats ambient. See `resolveRemoteFlag` below. Every remote-capable command
// resolves its `--remote` value through that function (passing its OWN `--dir` value too) before
// calling `openBundle` — `init`/`serve` are the two deliberate exceptions.
//
// `.agentstate.json` (item 43 follow-on — the "project-binding resolution rung") is a COMMITTED,
// project-scoped pointer: `{ "bundle": "<url-or-path>" }` at a project root, discovered by walking
// UP from the cwd (nearest ancestor wins — same shape `findBundleRoot` uses for `index.md`; see
// `resolveProjectBinding`). It sits BETWEEN the env var and cwd discovery in the precedence chain:
// explicit `--remote`/`--dir` flags -> `AGENTSTATE_LITE_REMOTE` env -> the project binding file ->
// the cwd walk (which checks each ancestor's own `index.md` FIRST, then its conventional
// `.agentstate-lite/index.md` — see `CONVENTIONAL_BUNDLE_DIR_NAME`/`findBundleRoot`). Explicit
// beats ambient beats committed beats discovered, and within discovery an enclosing bundle beats
// the conventional project folder at the same level. The
// binding's `bundle` value is EITHER an http(s) URL (resolved exactly like `--remote <url>`) OR a
// filesystem path (resolved exactly like `--dir <path>`; a RELATIVE path resolves against the
// DIRECTORY CONTAINING `.agentstate.json`, never the cwd — a committed pointer must be
// clone-portable, and the cwd is not). A malformed file (unreadable, invalid JSON, missing/empty/
// non-string `bundle`) is a USAGE CliError naming the file — never a silent fallthrough to the next
// rung, because a committed-but-broken binding is a real repo mistake the user must see.
//
// The two halves of the binding are consumed at TWO DIFFERENT points, deliberately not one:
//   - A URL-type binding is consumed by `resolveRemoteFlag` (below), the SAME function that already
//     resolves the env-var ambient default — so it is picked up by every command that already calls
//     `resolveRemoteFlag`, and by NONE of the three that deliberately don't (`init`, `serve`, and
//     `home`'s local dashboard read) for the exact reason those three already skip the env default:
//     `serve` can only ever boot a server over a FILESYSTEM bundle (a URL binding here would be
//     nonsensical — there is nothing local to serve), and `home`'s zero-arg dashboard has a hardened
//     OFFLINE GUARANTEE (`commands/home.ts`) that must never silently start fetching just because a
//     committed file happens to name a URL. Both instead peek at `resolveProjectBinding` themselves,
//     where relevant, purely to ANNOTATE their output — never to change whether they fetch.
//   - A DIRECTORY-type binding is consumed by `openBundle`'s OWN cwd-discovery fallback (below),
//     reached only when neither an explicit/ambient/committed `--remote` NOR an explicit `--dir`
//     applies — so it benefits EVERY caller that reaches that fallback, `serve`/`home`/`ui`'s local
//     branch included, because picking a different LOCAL directory is always network-free. If that
//     same fallback happens to find a URL-type binding instead (only possible for the three callers
//     above, since everyone else already had it consumed by `resolveRemoteFlag` first), it is
//     silently ignored and cwd discovery proceeds as if no binding existed at all — never promoted
//     to a `RemoteBackend` there, which would violate `serve`/`home`'s local-only contract.
//
// API-key sourcing (Stage-1 Unit 2b Part C — the Cloudflare Worker deployment's `withApiKey`
// gate, `packages/worker/src/auth.ts`): `openRemoteBundle` sources a bearer token for the
// resolved remote's ORIGIN in priority order — (1) the `AGENTSTATE_LITE_API_KEY` env var
// (a session-wide override, no credentials-file write needed for scripts/CI), then (2) the
// already-provisioned origin-keyed entry stored (`credentials.ts`'s
// `getApiKeyForOrigin`). Neither is required: the reference `serve()` ignores the
// `Authorization` header entirely (no auth enforced there), so an ungated local bundle works
// exactly as before with no key configured.
import { promises as fs } from "node:fs";
import path from "node:path";
import { RemoteBackend, RemoteError, type Bundle, type FetchLike } from "@agentstate-lite/core";
import { CliError } from "./errors.js";
import { cliInvocation } from "./invocation.js";
import { normalizeServer } from "./config.js";
import { getApiKeyForOrigin } from "./credentials.js";

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

/** The directory `init` should create/open: the explicit `--dir`, else the cwd. */
export function resolveTargetDir(dirFlag: string | undefined): string {
  return path.resolve(dirFlag ?? process.cwd());
}

/**
 * Walk up from `start` to the nearest ancestor containing `filename`; null if none — the shape
 * both `index.md` bundle discovery and `.agentstate.json` binding discovery share (mirroring how
 * `git` finds `.git`).
 */
async function findAncestorWithFile(start: string, filename: string): Promise<string | null> {
  let dir = path.resolve(start);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (await exists(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * The conventional project-scoped bundle directory name: a bundle at
 * `<project-root>/.agentstate-lite/` is discovered by the cwd walk with NO configuration —
 * the folder alone is enough, the way `git` treats `.git`. It is the DEFAULT home for a
 * project's workspace bundle (committed, so it collaborates across clones), while
 * `.agentstate.json` remains the explicit override for anything unconventional (a remote
 * URL, an out-of-tree directory) and — being an explicit committed pointer — beats it.
 */
export const CONVENTIONAL_BUNDLE_DIR_NAME = ".agentstate-lite";

/**
 * Walk up from `start` to the nearest bundle root; null if none. At EACH level, the
 * directory's own `index.md` is checked first (standing inside a bundle keeps winning),
 * then the conventional `.agentstate-lite/index.md` — so the nearest level wins overall,
 * and within a level an enclosing bundle beats the conventional folder. EXPORTED for
 * session-start's `--dir` bridge (home.ts `discoverSummarizeBundle`): its `--dir` names a
 * PROJECT directory, so the dashboard needs THIS walk, not `openBundle`'s literal-root reading
 * of an explicit dir.
 */
export async function findBundleRoot(start: string): Promise<string | null> {
  let dir = path.resolve(start);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (await exists(path.join(dir, "index.md"))) return dir;
    const conventional = path.join(dir, CONVENTIONAL_BUNDLE_DIR_NAME);
    if (await exists(path.join(conventional, "index.md"))) return conventional;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** The committed project-scoped pointer filename (see the module header). */
export const PROJECT_BINDING_FILE_NAME = ".agentstate.json";

/**
 * A resolved `.agentstate.json` binding — see the module header for the full precedence story.
 */
export interface ProjectBinding {
  /** Absolute path to the `.agentstate.json` file this was read from (surfaced in errors/notes). */
  file: string;
  /**
   * The resolved target: the raw URL string when `isRemote`, else an ABSOLUTE directory path (a
   * relative `bundle` value in the file is resolved against `file`'s own directory, not the cwd).
   */
  target: string;
  /** true when `target` is an http(s) URL (resolve like `--remote`); false when a directory (`--dir`). */
  isRemote: boolean;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Discover + parse + validate the nearest `.agentstate.json` walking up from `startDir` (default
 * cwd) — nearest ancestor wins. Returns `null` when none exists anywhere up-tree (the common case;
 * NOT an error). When one IS found, it is read and validated immediately: an unreadable file (a
 * TOCTOU race between the walk's `exists` check and the read), invalid JSON, or a missing/empty/
 * non-string `bundle` field is a real committed mistake — thrown as a USAGE CliError (exit 2)
 * naming the file, never swallowed into a silent `null`. A well-formed `bundle` value is classified
 * as a remote URL (`isHttpUrl`) or else treated as a filesystem path and resolved against the
 * binding file's OWN directory (never the cwd — see the module header on clone-portability).
 */
export async function resolveProjectBinding(startDir: string = process.cwd()): Promise<ProjectBinding | null> {
  const dir = await findAncestorWithFile(startDir, PROJECT_BINDING_FILE_NAME);
  if (!dir) return null;
  const file = path.join(dir, PROJECT_BINDING_FILE_NAME);

  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (err) {
    throw new CliError(
      "USAGE",
      `could not read project binding ${file}: ${err instanceof Error ? err.message : String(err)}`,
      { help: `fix or remove ${file}` },
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new CliError(
      "USAGE",
      `malformed project binding ${file}: invalid JSON (${err instanceof Error ? err.message : String(err)})`,
      { help: `fix or remove ${file}` },
    );
  }
  const rawBundle = (parsed as Record<string, unknown> | null)?.bundle;
  if (typeof rawBundle !== "string" || rawBundle.trim() === "") {
    throw new CliError(
      "USAGE",
      `malformed project binding ${file}: "bundle" must be a non-empty string (an http(s) URL or a filesystem path)`,
      { help: `fix or remove ${file}` },
    );
  }
  const trimmed = rawBundle.trim();
  if (isHttpUrl(trimmed)) {
    return { file, target: trimmed, isRemote: true };
  }
  return { file, target: path.resolve(dir, trimmed), isRemote: false };
}

/**
 * Wrap a fetch-like transport so a transport-level failure (ECONNREFUSED, DNS, timeout — `fetch`
 * rejects with a plain `TypeError` for all of these) surfaces as a `CliError("RUNTIME", …)` with a
 * `serve` hint BEFORE it reaches command code. Without this, a command's catch-all (e.g. `link`'s,
 * `doc write`'s) would misclassify an unreachable server as a USAGE error (exit 2) instead of a
 * retryable RUNTIME fault (exit 1) — wrong-but-plausible, since both look like "a plain Error" to
 * a generic catch. HTTP-level failures (404/412/5xx) are UNCHANGED: they still resolve to a normal
 * `Response` that `RemoteBackend` maps itself (see `core/src/remote-backend.ts`).
 */
function wrapTransportErrors(remote: string): FetchLike {
  return async (request: Request): Promise<Response> => {
    try {
      return await globalThis.fetch(request);
    } catch (err) {
      throw new CliError(
        "RUNTIME",
        `could not reach the remote bundle at ${remote} (${err instanceof Error ? err.message : String(err)})`,
        { help: `${cliInvocation()} serve --dir <path>` },
      );
    }
  };
}

/** Session-wide override for the `--remote` API key (Stage-1 Unit 2b Part C). See {@link openRemoteBundle}. */
export const API_KEY_ENV_VAR = "AGENTSTATE_LITE_API_KEY";

/**
 * Resolve a `--remote <url>` bundle: a `RemoteBackend` wired to the wire-protocol v0 reference
 * server, using the same http(s) URL discipline `config.ts`'s `normalizeServer` applies to
 * remote credential lookup (a malformed/non-http(s) URL is a USAGE error, exit 2). The bundle-path segment
 * is a fixed `"default"` — the single-bundle reference router ignores it; meaningful only for a
 * future multi-bundle deployment (no `--bundle` flag exists yet; out of scope).
 *
 * Sources a bearer `authToken` for the resolved origin: `AGENTSTATE_LITE_API_KEY` env var first,
 * else an already-provisioned origin-keyed credentials-file entry. Neither
 * is required — an ungated bundle (the reference `serve()`) ignores the header either way.
 */
async function openRemoteBundle(remoteFlag: string): Promise<Bundle> {
  let base: string;
  let origin: string;
  try {
    const resolved = normalizeServer(remoteFlag);
    base = resolved.base;
    origin = resolved.resource;
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} <command> --remote http://127.0.0.1:4818`,
    });
  }
  const envKey = process.env[API_KEY_ENV_VAR]?.trim();
  const authToken = envKey || (await getApiKeyForOrigin(origin));
  const backend = new RemoteBackend({
    baseUrl: base,
    bundle: "default",
    fetchImpl: wrapTransportErrors(base),
    authToken,
  });
  return { root: base, backend };
}

/** The session-wide remote-default environment variable (A9). See {@link resolveRemoteFlag}. */
export const REMOTE_ENV_VAR = "AGENTSTATE_LITE_REMOTE";

/**
 * Resolve the effective `--remote` value for a remote-capable command: an explicit `--remote` flag
 * always wins outright. Otherwise, EXPLICIT BEATS AMBIENT (design resolution, Stage-1 Unit 2a
 * post-ship review — supersedes an earlier draft where an ambient env default could conflict with
 * an explicit `--dir`): if the caller passed `--dir` themselves, that is a deliberate, explicit
 * choice to go local, and BOTH the `AGENTSTATE_LITE_REMOTE` env fallback AND the project-binding
 * fallback (below) are SUPPRESSED — no conflict, no error, `--dir` just wins silently, exactly as
 * if neither existed. Absent an explicit `--dir`, the env fallback applies next (so a caller who
 * already ran `serve` doesn't have to repeat `--remote <url>` on every subsequent bare command —
 * A9, reversing Unit 3's skipped implementer's-call); a blank/whitespace-only env value is treated
 * as unset. Only once BOTH are absent does a committed `.agentstate.json` binding apply (item 43
 * follow-on — see the module header): if the nearest one up-tree names an http(s) URL, it resolves
 * exactly like an ambient `--remote` default; a directory-type binding is NOT a remote value at
 * all, so this returns `undefined` for one (it is `openBundle`'s cwd-discovery fallback that
 * consumes that half — see below). This function is async specifically so that fs-backed check can
 * run; a malformed binding file throws a USAGE CliError here rather than silently falling through.
 *
 * `openBundle`'s `--remote`/`--dir` mutual-exclusion check therefore only ever fires for an
 * explicit `--remote` FLAG (not an env- or binding-derived one) alongside an explicit `--dir` — the
 * one combination that is a genuine, unresolvable contradiction of the caller's own stated intent.
 * Every remote-capable command calls THIS (passing its OWN `dirFlag` too) before `openBundle`, never
 * `openBundle` directly with a raw `values.remote` — except `init` (explicitly rejects `--remote`,
 * no create-bundle endpoint exists) and `serve` (always boots over a LOCAL bundle; picking up an
 * ambient remote default there would be actively wrong, not a convenience), which must NOT call this.
 * `home`'s local dashboard read is a THIRD such exception, for the same reason it already skips the
 * env default (see the module header's URL-binding note).
 */
export async function resolveRemoteFlag(
  remoteFlag: string | undefined,
  dirFlag: string | undefined,
): Promise<string | undefined> {
  if (remoteFlag) return remoteFlag;
  if (dirFlag) return undefined; // explicit --dir wins over an ambient env/binding default, no conflict
  const env = process.env[REMOTE_ENV_VAR]?.trim();
  if (env) return env;
  const binding = await resolveProjectBinding();
  return binding?.isRemote ? binding.target : undefined;
}

/**
 * Resolve the {@link Bundle} an OKF command should operate on: `--remote <url>` wins (mutually
 * exclusive with `--dir`, checked here — a USAGE error, exit 2, if both are given); otherwise the
 * existing filesystem discovery applies. With `--dir`, that directory is used verbatim (and must
 * already be a bundle). Without either, a committed `.agentstate.json` directory-type binding
 * applies next (item 43 follow-on — see the module header); only then does discovery walk up from
 * the cwd. Throws a NOT_FOUND CliError (exit 6) when no LOCAL bundle is found — the fixing command
 * points at `axi init`.
 *
 * Callers pass `remoteFlag` through {@link resolveRemoteFlag} first, which already suppresses the
 * `AGENTSTATE_LITE_REMOTE` env fallback (and the project-binding fallback) whenever `dirFlag` is
 * set — so by the time `remoteFlag` reaches HERE truthy alongside a truthy `dirFlag`, it can only be
 * because the caller passed an EXPLICIT `--remote` flag (not an ambient default), and the
 * mutual-exclusion error below is accurate without needing to know which source it came from.
 */
export async function openBundle(dirFlag: string | undefined, remoteFlag?: string): Promise<Bundle> {
  if (remoteFlag) {
    if (dirFlag) {
      throw new CliError(
        "USAGE",
        "--remote and --dir are mutually exclusive",
        { help: `${cliInvocation()} <command> --remote <url>` },
      );
    }
    return openRemoteBundle(remoteFlag);
  }
  if (dirFlag) {
    const root = path.resolve(dirFlag);
    if (!(await exists(path.join(root, "index.md")))) {
      throw new CliError("NOT_FOUND", `no OKF bundle at ${root} (no index.md)`, {
        help: `${cliInvocation()} init --dir ${dirFlag}`,
      });
    }
    return { root };
  }
  // Neither an explicit/ambient/committed --remote NOR an explicit --dir applies: a directory-type
  // project binding wins over plain cwd discovery (see the module header). A URL-type binding found
  // HERE (only possible for a caller that never calls `resolveRemoteFlag` at all — `serve`, `home`'s
  // local read, `ui`'s local branch — since every other caller already had it consumed above) is
  // silently ignored rather than promoted to a `RemoteBackend`, which would violate those callers'
  // local-only contract; cwd discovery proceeds exactly as if no binding existed.
  const binding = await resolveProjectBinding();
  if (binding && !binding.isRemote) {
    const root = binding.target;
    if (!(await exists(path.join(root, "index.md")))) {
      throw new CliError(
        "NOT_FOUND",
        `no OKF bundle at ${root} (no index.md) — from project binding ${binding.file}`,
        { help: `${cliInvocation()} init --dir ${root}` },
      );
    }
    return { root };
  }
  const root = await findBundleRoot(process.cwd());
  if (!root) {
    throw new CliError(
      "NOT_FOUND",
      `no OKF bundle found (no index.md, and no ${CONVENTIONAL_BUNDLE_DIR_NAME}/index.md, in the current directory or its ancestors)`,
      { help: `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}` },
    );
  }
  return { root };
}
