// Shared surface for the `doc` verb modules (write/update/read/history/delete): the help text, the
// deps interface, the stdin-detection helper, and the error-classification helper used by ≥2 verbs.
// Verb modules import from HERE, never from `../doc.js` (the thin entry re-exports FROM here, and a
// verb importing back from the entry would create a circular import).
import { fstatSync } from "node:fs";
import { parseLinks, type Bundle, type OkfDocument } from "@agentstate-lite/core";
import { CliError, classifyBundleError } from "../../errors.js";
import { cliInvocation } from "../../invocation.js";

/** The common flags every `doc` verb accepts — appended to each verb's focused help (§10). */
const COMMON_OPTIONS = `Common options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help`;

/**
 * The FAMILY INDEX — printed only for a bare `doc`/`doc --help`. Each verb has its OWN focused help
 * (below), so a `doc read --help` no longer dumps the write/update/delete manual too (AXI §10).
 */
export const DOC_USAGE = `agentstate-lite doc — write, patch, read, or delete a generic OKF concept document

Usage:
  agentstate-lite doc write   <id> --type <t> [options]        Create/overwrite a concept doc
  agentstate-lite doc update  <id> [options]                   Patch given fields of an existing doc
  agentstate-lite doc read    <id> [--out (<path> | -)]        Read a doc (or pull its raw bytes)
  agentstate-lite doc history <id>                             Show a doc's attributed version chain
  agentstate-lite doc delete  <id> [--expected-version <v>]    Hard-delete a doc (idempotent)

Run 'agentstate-lite doc <verb> --help' for a verb's full options.

${COMMON_OPTIONS}
`;

export const DOC_WRITE_USAGE = `agentstate-lite doc write — create or overwrite a generic OKF concept document

Usage:
  agentstate-lite doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [options]

Idempotent: re-writing a doc with identical frontmatter + body is a no-op (exit 0, no error, no
duplication — a plain overwrite that converges to the same on-disk state).

Options:
  --type <t>           OKF concept type (non-empty)                          [required]
  --title <t>          Display title
  --description <d>    One-sentence summary
  --resource <uri>     Canonical URI of the underlying asset
  --tag <t>            A tag (repeatable)
  --timestamp <iso>    ISO-8601 last-change time (default: now)
  --body <s>           Markdown body inline
  --body-file <path>   Read the markdown body from a file (else: piped stdin)
  --blank-body         Required to deliberately overwrite an EXISTING doc's non-empty body with an
                       empty one when no other body source is given. --body (even --body "") and
                       --body-file always count as an explicit source; piped stdin counts ONLY when
                       it carries NON-EMPTY content — an empty pipe, a character device, or an
                       interactive TTY all count as "nothing given" here (pass --body "" to blank
                       explicitly instead). A NEW doc with no body source is always allowed — see
                       'doc update' to patch other fields while preserving the body.
  --replace-links      Required to overwrite an EXISTING doc's body when the new body would silently
                       DROP one or more of its outbound cross-links (links live in the body — OKF).
                       Without it, a body replace that drops a link is refused (exit 2, naming the
                       dropped link(s)); a new body that still contains the same link(s) never needs
                       this flag. SHORT-TERM guard — see 'link add'/'link show' to manage links.
  --strict             If a kind convention governs --type, reject (exit 2) instead of writing with
                       warnings when the doc does not satisfy it (default: warn-and-write, exit 0 —
                       see 'agentstate-lite kinds')
  --actor <name>       Attribute this write: persisted as the doc's own 'actor' frontmatter field
                       (the per-doc attribution sync and its receipts read) and recorded in version
                       history by a persisting backend. Note doc write is a FULL replace: omitting
                       --actor on an overwrite drops any existing actor field (reported in
                       dropped_fields). A present-but-blank value is a USAGE error (exit 2).
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc write concepts/auth --type Concept --title "Auth flow" --body "How login works"
  echo "# Notes" | agentstate-lite doc write notes/x --type Note --title "Scratch"
`;

export const DOC_UPDATE_USAGE = `agentstate-lite doc update — patch given fields of an EXISTING concept document

Usage:
  agentstate-lite doc update <id> [--<field> <value> ...] [--body <s> | --body-file <p>] [options]

Only the fields you pass change; everything else — including the body when no body source is given —
is preserved verbatim. Idempotent: a patch that changes NOTHING (ignoring the auto-refreshed
timestamp) converges to changed:false (no write, no timestamp refresh).

Options:
  --title <t>            Replace the title
  --description <d>      Replace the description
  --tag <t>              Replace the WHOLE tag set (repeatable; passing --tag at all replaces every
                         existing tag rather than adding to them). It cannot CLEAR the set to empty.
  --type <t>             Replace the type
  --body <s>             Replace the body inline
  --body-file <path>     Replace the body, read from a file. If NEITHER --body nor --body-file is
                         given AND no other field flag is given either (e.g. 'cat body.md | ...
                         doc update <id>' with nothing else), piped stdin is used as the body — same
                         non-empty rule doc write's F1 guard uses (an empty pipe does not count). A
                         patch that DOES pass another field flag (--title/--description/--tag/--type/
                         a kind field) never reads stdin, even without --body/--body-file: it patches
                         only the given fields and leaves the body untouched.
  --replace-links         Required when a --body/--body-file replace would silently DROP one or more
                         of the doc's existing outbound cross-links (links live in the body — OKF).
                         Without it, such a replace is refused (exit 2, naming the dropped link(s));
                         a new body that still contains the same link(s) — the ordinary read-edit-
                         update cycle — never needs this flag. SHORT-TERM guard — see 'link add'/
                         'link show' to manage links.
  --keep-timestamp       Preserve the existing timestamp (default: refresh to now, since a patch is
                         a meaningful change — matches 'link add's policy)
  --strict               If a kind convention governs the resulting type, reject (exit 2) instead of
                         writing with warnings (default: warn-and-write, exit 0)
  --<field> <value>      Set a kind-declared field of the doc's type (e.g. --status done). The field
                         MUST be declared by the kind governing the doc's type — run 'agentstate-lite
                         kinds' to see them. An unknown field, or an out-of-enum value, is rejected
                         (exit 2, no write). Use 'doc write' to rewrite the whole doc if you must set
                         a not-yet-declared value.
  --expected-version <v> Optimistic compare-and-swap: patch ONLY if the doc still matches this token
                         (from a prior read/write/history receipt) — a conflict is STALE_HEAD (exit
                         5), NOT retried. Omit for a normal (auto-retrying) update. A present-but-
                         blank value is a USAGE error (exit 2), not "no CAS".
  --actor <name>         Attribute this write: sets the doc's 'actor' frontmatter field (overwriting
                         a previous actor; omitted = the existing actor is preserved verbatim) and
                         threads to version history (see 'doc history'). Not a patch by itself —
                         pass it alongside the field(s) you are changing. A present-but-blank value
                         is a USAGE error (exit 2).

Passing NO patchable field at all is a USAGE error (exit 2) — there is nothing to do.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc update tasks/42 --status done
  agentstate-lite doc update concepts/auth --title "Auth v2" --expected-version sha256:...
`;

export const DOC_READ_USAGE = `agentstate-lite doc read — read a concept document (or pull its raw markdown bytes)

Usage:
  agentstate-lite doc read <id> [--out (<path> | -)] [options]

The default (no --out) render shows EVERY frontmatter field — the standard keys plus any
kind-declared fields like status/priority — and truncates a large body (pointing at --out).

Options:
  --out <path>         Write the doc's raw markdown bytes to a file (bypasses context).
                       Use --out - to stream raw bytes to stdout (the receipt goes to stderr).
                       Over --remote, bytes are the canonical OKF re-serialization (no raw-bytes
                       wire endpoint yet — see docs/WIRE-PROTOCOL.md open questions).
                       For a local (--dir) bundle, a resolved --out path landing INSIDE the bundle
                       root gets a loud 'warning' field on the receipt: a non-reserved .md path
                       will be re-ingested as a concept doc on the next bundle walk; a reserved
                       filename (index.md/log.md) will instead CLOBBER that file outright; any
                       other (non-.md) path is inert (no warning) — the write still proceeds in
                       every case; not applicable to --out - or to --remote.
  --field <name>       Print ONE frontmatter field's raw value to stdout, newline-terminated, no
                       TOON envelope and no other output — for scripting, e.g. capturing
                       head_version for a follow-up --expected-version write. A scalar prints
                       as-is (no quotes); an array/object prints as compact JSON. id/type/
                       head_version work too (head_version is the store's CAS token, not
                       frontmatter). An absent field, or a missing doc, reports the error to
                       STDERR instead (stdout stays reserved for the raw value); an absent field's
                       error lists the fields that DO exist. Mutually exclusive with --out (both
                       reserve stdout).
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc read concepts/auth
  agentstate-lite doc read concepts/auth --out ./auth.md
  agentstate-lite doc read concepts/auth --field head_version
`;

export const DOC_HISTORY_USAGE = `agentstate-lite doc history — show a doc's attributed version chain (newest first)

Usage:
  agentstate-lite doc history <id> [options]

Lists version + actor + timestamp (and agent, when recorded) per revision, with a count. A
history-keeping backend (a remote deployment) returns the full chain and the real per-write
--actor; on an AUTH'D remote, actor is your authenticated principal (server-set, unforgeable) and
agent is the --actor label you declared under it. A local --dir bundle keeps no history, so it
returns just the single current revision and reports the file's OS owner as the actor (the
filesystem backend keeps no per-write history for --actor; the doc's own 'actor' frontmatter
field — which every write path persists when --actor is given — is where per-doc attribution
lives). The newest version is the token to pass to --expected-version for an optimistic doc
update/delete.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc history concepts/auth
`;

export const DOC_DELETE_USAGE = `agentstate-lite doc delete — hard-delete a concept document (idempotent)

Usage:
  agentstate-lite doc delete <id> [--expected-version <v>] [options]

Hard-delete (no tombstone) and idempotent: deleting an ABSENT id is SUCCESS (deleted:false, exit 0),
never an error. Reserved ids (index.md/log.md) are rejected (USAGE, exit 2). Non-cascading: it does
NOT touch other docs' links to/from the id (backlinks are derived — a dangling reference simply
stops resolving on the next graph walk) and does NOT append a log.md entry.

Options:
  --expected-version <v>  Compare-and-swap token from a prior read/write receipt (a stale token is a
                          CONFLICT, exit 5; omit for an unconditional delete)
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc delete notes/scratch
  agentstate-lite doc delete concepts/auth --expected-version sha256:...
`;

/** AXI §3 body-preview cap for `doc read` (no --out): beyond this, truncate + point at the byte channel. */
export const BODY_PREVIEW_LIMIT = 1000;

export interface DocCliDeps {
  stdout: (s: string) => void;
  stderr: (s: string) => void;
  writeStdoutBytes: (data: Uint8Array) => void;
  /**
   * Resolves to the piped stdin content, or `undefined` when there is no real stdin data source at
   * all. The default impl (`defaultReadStdin`) fstats fd 0 and only reads when it is a FIFO, a
   * regular file, or a connected socket — an interactive TTY, a character device (notably an agent
   * harness's redirected-but-dataless stdin, which reports `isTTY === undefined`, not `true`), or an
   * fstat error all resolve to `undefined` without reading. The F1 body-source guard below
   * additionally treats an EMPTY resolved string the SAME as `undefined`: only a NON-EMPTY piped body
   * counts as "a body source was given" via this channel — `--body ""` is the one unambiguous
   * explicit-empty channel.
   */
  readStdin: () => Promise<string | undefined>;
}

/**
 * True when fd 0 (stdin) is a real data source — a FIFO (a shell pipe), a regular file (input
 * redirection, `< file`), or a connected socket — as opposed to an interactive TTY, a character
 * device (e.g. `/dev/null`, or the redirected-but-dataless stdin many agent harnesses hand a spawned
 * process), or an fd that can't be fstat'd at all. `process.stdin.isTTY` alone is NOT sufficient: in
 * an agent harness stdin is commonly a character device with `isTTY === undefined`, which the old
 * `defaultReadStdin` read as "there's a pipe, consume it" — reading `""` and handing the F1 guard an
 * EXPLICIT empty body source, bypassing it in exactly the harness shape a fresh-agent reviewer
 * reproduced live.
 *
 * `isSocket()` is included alongside `isFIFO()`/`isFile()` for a platform-specific reason found while
 * building this fix's own integration test: on macOS (unlike Linux), libuv implements Node's
 * `child_process` "pipe" stdio via an `AF_UNIX` socketpair, not a POSIX FIFO — so a Node-based agent
 * harness piping a REAL body into a spawned `agentstate-lite` (`spawn(cli, { stdio: ["pipe", …] })`,
 * exactly the mechanism many such harnesses use) hands this process a stdin that `fstat`s as a
 * socket, not a FIFO. Excluding sockets would silently defeat legitimate piped input for that entire
 * class of caller — reopening a DIFFERENT variant of the very bug this fix exists to close. A
 * character device (the actual false-positive this fix targets) is a distinct fstat file type from a
 * socket, so this addition does not reopen the original gap.
 */
function hasRealStdinInput(): boolean {
  try {
    const stats = fstatSync(0);
    return stats.isFIFO() || stats.isFile() || stats.isSocket();
  } catch {
    return false;
  }
}

export async function defaultReadStdin(): Promise<string | undefined> {
  if (!hasRealStdinInput()) return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Data-loss guard (SHORT-TERM — see `roadmap-items/link-model-body-safe` for the proper
 * preserve-by-default fix this is standing in for): OKF cross-links are markdown links stored IN a
 * doc's body, so a `--body`/`--body-file` FULL-BODY REPLACE (`doc write`/`doc update`) silently drops
 * every outbound link the old body carried unless the new body happens to repeat it — the product's
 * signature graph feature, lost with no error and no trace. Fires ONLY on REAL loss: an existing link
 * survives (no refusal) when `nextBody` still contains ANY link to the SAME resolved target — the
 * ordinary `doc read` -> edit -> `doc update --body` round trip, since `doc read` returns the body
 * WITH its links, never fires here. Matches by resolved target ONLY (`to`, via core's ONE link
 * resolver `parseLinks` — never a second parser), mirroring `link add`'s own idempotency check
 * (`link.ts`'s `parseLinks(...).some(l => l.to === normalizedTo)`, also target-only). A RETEXT — the
 * new body relabels the same target under different display text — is NOT a drop: the guard's charter
 * is EDGE loss, and the edge (the target relationship) survives a retext. Over-firing on relabeling
 * would train agents to reflexively pass `--replace-links`, which hollows the guard for the drop case
 * that actually matters (review adjudication, round 2). `replaceLinks` (the caller's `--replace-links`
 * flag) opts into a real drop deliberately — no separate `link remove` needed, since a full-body
 * replace already performs removal.
 *
 * Called BEFORE any write happens (the F1 guard's existing conditional read supplies `existing`), so
 * a refusal here always leaves the stored doc byte-for-byte unchanged.
 */
export function guardDroppedLinks(
  bundle: Bundle,
  existing: OkfDocument,
  nextBody: string,
  replaceLinks: boolean,
): void {
  if (replaceLinks) return;
  const existingLinks = parseLinks(bundle, existing);
  if (existingLinks.length === 0) return; // nothing to lose
  const nextLinks = parseLinks(bundle, { ...existing, body: nextBody });
  const dropped = existingLinks.filter((el) => !nextLinks.some((nl) => nl.to === el.to));
  if (dropped.length === 0) return;
  const named = dropped.map((l) => `'${l.text}' -> ${l.to}`).join(", ");
  throw new CliError(
    "USAGE",
    `this body replace would silently drop ${dropped.length} outbound link(s) from '${existing.id}': ${named}. ` +
      `OKF cross-links live in the document body, so a full-body replace removes any link the new body ` +
      `doesn't repeat. Pass --replace-links to drop them deliberately, or keep them by including the same ` +
      `markdown link(s) in the new body, or re-add them afterward with ` +
      `'${cliInvocation()} link add ${existing.id} <to>'.`,
    {
      help: `${cliInvocation()} link add ${existing.id} <to>`,
      details: { dropped_links: dropped.map((l) => ({ to: l.to, text: l.text })) },
    },
  );
}

/** Map a filesystem ENOENT (missing concept file) to NOT_FOUND; classify anything else via `classifyBundleError`. */
export function readErrorToCliError(err: unknown, id: string, remoteUrl?: string): CliError {
  if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
    return new CliError("NOT_FOUND", `no concept document at id '${id}'`, {
      help: `${cliInvocation()} list`,
    });
  }
  // A corrupt document (unparseable YAML) → RUNTIME (exit 1), not the USAGE default: handled
  // centrally in classifyBundleError so read/write/update/history/link all agree (a valid
  // invocation hitting bad stored data is not a usage error).
  return classifyBundleError(err, remoteUrl);
}
