// `agentstate-lite doc write|update|read` — the generic OKF concept-document command.
//
// `doc write <id>` builds an OKF concept ({ type, title?, description?, resource?, tags?, timestamp? }
// frontmatter + a markdown body) and persists it via core `writeDoc` (which enforces the non-empty
// `type` rule, rejects reserved ids, and guarantees a `timestamp`). The body is taken from `--body`,
// `--body-file <path>` (byte ingress — the promote pattern retargeted to the local bundle), or piped
// stdin. Usability finding F1 (P1, data loss): `doc write` on an EXISTING doc with a non-empty body,
// given NO body source at all, used to silently persist an EMPTY body (a blind overwrite). It now
// reads the existing doc first and REFUSES (USAGE) unless a body source was actually given (--body,
// --body-file, or a real, NON-EMPTY stdin pipe) or `--blank-body` opts in explicitly. A NEW doc with
// no body source is unaffected (an empty body is a valid creation).
//
// Stdin detection cannot rely on `process.stdin.isTTY` alone. In an agent harness stdin is commonly
// a character device with `isTTY === undefined` (neither `true` nor a real pipe), which the old logic
// read as "there's a pipe" and consumed as `""` — an EXPLICIT empty body source that walked straight
// past the F1 guard, reproducing the exact silent body-blanking F1 was meant to close. `defaultReadStdin`
// now fstats fd 0 and only reads when it is a FIFO (a shell pipe), a regular file (`< file`
// redirection), or a connected socket (a Node `child_process` "pipe" is a socketpair rather than a
// POSIX FIFO on some platforms — see `hasRealStdinInput`'s own comment for why this matters); a TTY,
// a character device, or an fstat error all resolve to `undefined` (no input). Belt-and-braces on top
// of that: even a REAL pipe resolving to an EMPTY string no longer counts as an explicit body source
// — only non-empty piped content does. `--body ""` is now the one unambiguous explicit-empty channel;
// `--blank-body` remains the deliberate opt-in for blanking a non-empty body.
//
// `doc update <id>` is the field-level PATCH verb this finding's fix also motivated: read the existing
// doc (versioned), apply ONLY the fields actually passed (--title/--description/--tag [replaces the
// whole tag set]/--type/--body|--body-file), preserve everything else (including the body when neither
// body flag is given), refresh `timestamp` by default (`--keep-timestamp` preserves it — same policy
// `link add` settled on), and write back via compare-and-swap with a bounded conflict retry (the same
// versioned read -> mutate -> CAS-write shape `link add` proves). Kind-aware like `doc write`: a
// governing kind convention validates the RESULT and attaches `warnings[]` (warn-by-default,
// `--strict` upgrades to a rejecting USAGE error).
//
// The character-device check only closes the false-positive "there's a pipe" case. It does
// NOT help when fd 0 genuinely IS a FIFO/socket/file (so `hasRealStdinInput` correctly says "real
// data source") but its write end is held open with nothing ever written and never closed — the shape
// many agent harnesses hand a spawned process by default. Reading such an fd to EOF blocks forever.
// `doc update <id> --title … --description …` (a FIELD-ONLY patch, no --body/--body-file) reproduced
// this live: it has no need to guess a body from stdin at all, yet unconditionally tried to read it.
// Fixed by gating the stdin fallback in `doc update` on there being NOTHING ELSE to patch (title/
// description/tag/type/kind fields all absent) — the only case that still legitimately needs stdin as
// the sole patch source is `cat body.md | … doc update <id>` with no other flags. A patch that already
// has a field to apply via flags now never touches stdin. `doc write` shares the identical
// `defaultReadStdin` call and would hang the same way if invoked with no --body/--body-file and a
// held-open stdin — but there stdin is the PRIMARY, documented body channel even combined with other
// flags (`echo "# Notes" | … doc write id --type Note --title Scratch`), so gating it the same way
// would silently defeat real piped intent instead of erroring; left unchanged (see the fix's report).
//
// `doc read <id>` prints the parsed doc, OR with `--out <path>` writes the doc's RAW markdown bytes to
// disk (the pull pattern retargeted locally) so large docs never enter the model context window;
// `--out -` streams the raw bytes to stdout with the receipt on stderr (byte stream stays pure).
// `--body-out <path|->` is the composable edit channel: it writes only the parsed body and returns
// the version from that same read for a follow-up `doc update --body-file --expected-version`.
// Usability finding F3 (P2, bundle pollution): for a LOCAL bundle, an `--out` path that resolves
// INSIDE the open bundle's root gets silently re-ingested as a new concept doc on the next bundle
// walk. The write is still allowed (a deliberate in-bundle copy is conceivable) but the receipt now
// carries a loud `warning` field when this is detected; not applicable to `--out -` (no file is
// written) or to a `--remote` bundle (its "root" is a URL, not a filesystem path).
//
// This file is the THIN dispatcher — the per-verb bodies live in `./doc/*.ts` (write/update/read/
// history/delete), with the shared surface (DOC_USAGE, DocCliDeps, stdin detection, error
// classification) in `./doc/common.ts`. Re-exports below preserve this module's prior public surface
// for other importers (`./pull.ts`, `test/doc.test.ts`, …) unchanged.
import { CliError } from "../errors.js";
import { cliInvocation } from "../invocation.js";
import { DOC_USAGE, type DocCliDeps } from "./doc/common.js";
import { docWrite } from "./doc/write.js";
import { docUpdate } from "./doc/update.js";
import { docRead } from "./doc/read.js";
import { docHistory } from "./doc/history.js";
import { docDelete } from "./doc/delete.js";

export { DOC_USAGE, type DocCliDeps, readErrorToCliError } from "./doc/common.js";
export { inBundlePollutionWarning } from "./doc/read.js";

export async function doc(argv: string[], deps: Partial<DocCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);

  if (sub === "write") return docWrite(rest, deps);
  if (sub === "update") return docUpdate(rest, deps);
  if (sub === "read") return docRead(rest, deps);
  if (sub === "history") return docHistory(rest, deps);
  if (sub === "delete") return docDelete(rest, deps);
  if (sub === "-h" || sub === "--help" || sub === undefined) {
    stdout(DOC_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown doc subcommand: ${sub} (expected write|update|read|history|delete)`, {
    help: `${cliInvocation()} doc --help`,
  });
}
