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
// real filesystem path, while still giving consumers a stable display identity (the
// tri-backend tests' `mem://…` roots are the same pattern). An EXPLICIT `--remote`
// flag and an EXPLICIT `--dir` flag remain mutually exclusive (a USAGE error) — that combination
// contradicts the caller's own stated intent and cannot be silently resolved either way.
//
// HTTP activation is explicit: only `--remote <url>` produces a RemoteBackend. The retired
// `AGENTSTATE_LITE_REMOTE` variable is detected after explicit flags and rejected with migration
// guidance; an explicit `--dir` or `--remote` remains authoritative and suppresses that legacy
// ambient state.
//
// `.agentstate.json` (item 43 follow-on — the "project-binding resolution rung") is a COMMITTED,
// project-scoped LOCAL pointer: `{ "bundle": "<path>" }` at a project root, discovered by walking
// UP from the cwd (nearest ancestor wins — same shape `findBundleRoot` uses for `index.md`; see
// `resolveProjectBinding`). It sits between explicit flags and cwd discovery: explicit
// `--remote`/`--dir` -> the local project binding -> the cwd walk (which checks each ancestor's own
// `index.md` first, then its conventional `.agentstate-lite/index.md`). Explicit beats committed
// beats discovered, and within discovery an enclosing bundle beats the conventional project folder
// at the same level. A relative binding path resolves against the directory containing
// `.agentstate.json`, never the cwd, so committed pointers stay clone-portable. A malformed file
// (unreadable, invalid JSON, missing/empty/
// non-string `bundle`) is a USAGE CliError naming the file — never a silent fallthrough to the next
// rung, because a committed-but-broken binding is a real repo mistake the user must see.
//
// URL-valued bindings are rejected at the parser with an explicit-`--remote` migration hint. Local
// bindings are consumed by `openBundle`'s cwd-discovery fallback, which keeps bare commands local.
//
// API-key sourcing for an explicitly gated remote: `openRemoteBundle` sources a bearer token for
// the resolved remote's ORIGIN in priority order — (1) the `AGENTSTATE_LITE_API_KEY` env var
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
  /** Absolute directory target; relative values resolve against the binding file's directory. */
  target: string;
}

/** How a local bundle target won the CLI's selection precedence. */
export type LocalBundleSelection = "explicit-dir" | "project-binding" | "discovery";

/**
 * The validated local target shared by bundle-opening commands and the public locator receipt.
 * It retains both the lexical root ordinary commands use and its canonical physical directory.
 */
export interface LocalBundleTarget {
  /** The lexical absolute root ordinary commands have historically operated through. */
  root: string;
  /** The same physical directory canonicalized for a stable machine receipt. */
  canonicalRoot: string;
  selectedBy: LocalBundleSelection;
  bindingFile?: string;
}

interface BindingUriIntent {
  detail: string;
  suggestedRemote?: string;
}

function bindingUriIntent(value: string): BindingUriIntent | null {
  if (/^[A-Za-z]:(?!\/\/)/.test(value)) return null;
  if (value.startsWith("//")) {
    return { detail: `protocol-relative URL ${value}` };
  }
  const match = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(value);
  if (!match) return null;
  const scheme = match[1]!.toLowerCase();
  if (scheme !== "http" && scheme !== "https") {
    return { detail: `unsupported URI scheme "${scheme}" in ${value}` };
  }
  try {
    const url = new URL(value);
    if (url.protocol === `${scheme}:`) return { detail: `remote URL ${value}`, suggestedRemote: value };
  } catch {
    // The scheme establishes URI intent even when the URL itself is malformed.
  }
  return { detail: `invalid ${scheme} URL ${value}` };
}

/**
 * Discover + parse + validate the nearest `.agentstate.json` walking up from `startDir` (default
 * cwd) — nearest ancestor wins. Returns `null` when none exists anywhere up-tree (the common case;
 * NOT an error). When one IS found, it is read and validated immediately: an unreadable file (a
 * TOCTOU race between the walk's `exists` check and the read), invalid JSON, or a missing/empty/
 * non-string `bundle` field is a real committed mistake — thrown as a USAGE CliError (exit 2)
 * naming the file, never swallowed into a silent `null`. A URL value is rejected: remote access
 * requires an explicit `--remote`. A filesystem path is resolved against the binding file's OWN
 * directory (never the cwd — see the module header on clone-portability).
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
      `malformed project binding ${file}: "bundle" must be a non-empty filesystem path`,
      { help: `fix or remove ${file}` },
    );
  }
  const trimmed = rawBundle.trim();
  const uriIntent = bindingUriIntent(trimmed);
  if (uriIntent) {
    const remote = uriIntent.suggestedRemote ?? "<url>";
    throw new CliError(
      "USAGE",
      `project binding ${file} cannot use ${uriIntent.detail}; URL bindings no longer activate remotes — pass --remote ${remote} explicitly or replace "bundle" with a filesystem path`,
      { help: `${cliInvocation()} <command> --remote ${remote}` },
    );
  }
  return { file, target: path.resolve(dir, trimmed) };
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

/** Retired remote-default environment variable, retained only for an actionable migration error. */
export const REMOTE_ENV_VAR = "AGENTSTATE_LITE_REMOTE";

/**
 * Resolve the effective `--remote` value. Only an explicit flag can return a URL. An explicit
 * `--dir` wins locally. With neither flag, a present legacy `AGENTSTATE_LITE_REMOTE` is rejected
 * with migration guidance, and a reached project binding is parsed solely to reject malformed or
 * URL-valued bindings before local discovery consumes a valid path binding.
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
  if (remoteFlag !== undefined) return remoteFlag;
  if (dirFlag !== undefined) return undefined; // explicit --dir wins over legacy ambient state
  if (process.env[REMOTE_ENV_VAR] !== undefined) {
    const legacy = process.env[REMOTE_ENV_VAR]?.trim();
    throw new CliError(
      "USAGE",
      `${REMOTE_ENV_VAR} ambient remote selection is retired; pass --remote <url> explicitly`,
      { help: `${cliInvocation()} <command> --remote ${legacy || "<url>"}` },
    );
  }
  await resolveProjectBinding();
  return undefined;
}

async function canonicalBundleRoot(
  root: string,
  notFoundMessage: string,
  help: string,
): Promise<string> {
  if (!(await exists(path.join(root, "index.md")))) {
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
  try {
    return await fs.realpath(root);
  } catch {
    // The target may have disappeared between validation and canonicalization. Keep that race in
    // the same user-facing class as an initially missing bundle rather than leaking a raw fs error.
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
}

/**
 * Resolve exactly one local bundle using the CLI's established precedence and retain why it won.
 * This is the sole local target-selection primitive: {@link openBundle} consumes it, and
 * `bundle locate` only projects its result.
 */
export async function resolveLocalBundleTarget(
  dirFlag: string | undefined,
  startDir: string = process.cwd(),
): Promise<LocalBundleTarget> {
  if (dirFlag !== undefined) {
    const requested = path.resolve(startDir, dirFlag);
    const canonicalRoot = await canonicalBundleRoot(
      requested,
      `no OKF bundle at ${requested} (no index.md)`,
      `${cliInvocation()} init --dir ${dirFlag}`,
    );
    return { root: requested, canonicalRoot, selectedBy: "explicit-dir" };
  }

  const binding = await resolveProjectBinding(startDir);
  if (binding) {
    const canonicalRoot = await canonicalBundleRoot(
      binding.target,
      `no OKF bundle at ${binding.target} (no index.md) — from project binding ${binding.file}`,
      `${cliInvocation()} init --dir ${binding.target}`,
    );
    return {
      root: binding.target,
      canonicalRoot,
      selectedBy: "project-binding",
      bindingFile: binding.file,
    };
  }

  const discovered = await findBundleRoot(startDir);
  if (!discovered) {
    throw new CliError(
      "NOT_FOUND",
      `no OKF bundle found (no index.md, and no ${CONVENTIONAL_BUNDLE_DIR_NAME}/index.md, in the current directory or its ancestors)`,
      { help: `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}` },
    );
  }
  const canonicalRoot = await canonicalBundleRoot(
    discovered,
    `no OKF bundle at ${discovered} (no index.md)`,
    `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}`,
  );
  return { root: discovered, canonicalRoot, selectedBy: "discovery" };
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
 * Callers pass `remoteFlag` through {@link resolveRemoteFlag} first, so any truthy value here is an
 * explicit `--remote` flag and the mutual-exclusion error below is unambiguous.
 */
export async function openBundle(dirFlag: string | undefined, remoteFlag?: string): Promise<Bundle> {
  if (remoteFlag !== undefined) {
    if (dirFlag !== undefined) {
      throw new CliError(
        "USAGE",
        "--remote and --dir are mutually exclusive",
        { help: `${cliInvocation()} <command> --remote <url>` },
      );
    }
    return openRemoteBundle(remoteFlag);
  }
  const target = await resolveLocalBundleTarget(dirFlag);
  return { root: target.root };
}
