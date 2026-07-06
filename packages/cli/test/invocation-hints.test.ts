/**
 * A3 — invocation-correct hints (AXI §7/§10).
 *
 * A3.guard: a source-scan guard that locks the audit finding — every emitted `help:` field
 * (an error's fixing command, or a success `help[]` entry) must be built from `cliInvocation()`/
 * `deps.invocation()`, never a bare hardcoded bin name. Cheap (string scan, no runtime).
 *
 * A3.whoami: the one emitted-MESSAGE bypass the audit found (`whoami.ts`'s `AUTH_REQUIRED`
 * message used to hardcode `agentstate-lite login …` in prose even though its `help:` field was
 * already correctly resolved) is fixed — the message no longer names a bin at all.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, mkdtemp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

import { whoami } from "../src/commands/whoami.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(here, "../src");

// HERMETIC CWD (found live, 2026-07-06): `whoami` peeks at the project binding by walking UP
// from the cwd — an ambient `.agentstate.json` above the repo changes the offline listing.
// Module-top chdir into a binding-free temp dir; this file's other paths are import.meta-based.
process.chdir(await mkdtemp(path.join(tmpdir(), "aslite-hermetic-hints-")));

const BARE_BIN = /\b(agentstate-lite|aslite)\b/;
const PHANTOM_DIST = /dist\/agentstate-lite\.mjs/;

/** Every `help:` field written as a template literal (optionally inside a `[...]` array). */
const HELP_TEMPLATE = /help:\s*\[?\s*`([^`]*)`/g;

async function listTsFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listTsFiles(full)));
    } else if (entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

/** Strip `${...}` interpolations out of a template-literal body, leaving only the LITERAL text. */
function literalPortions(templateBody: string): string {
  return templateBody.replace(/\$\{[^}]*\}/g, "");
}

test("A3.guard: no emitted help: field hardcodes a bare bin name or a phantom dist path", async () => {
  const files = await listTsFiles(SRC_DIR);
  const offenders: string[] = [];
  for (const file of files) {
    const src = await readFile(file, "utf8");
    for (const match of src.matchAll(HELP_TEMPLATE)) {
      const literal = literalPortions(match[1] ?? "");
      if (BARE_BIN.test(literal) || PHANTOM_DIST.test(literal)) {
        offenders.push(`${path.relative(SRC_DIR, file)}: ${match[0]}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `found hardcoded bin literal(s) in an emitted help: field:\n${offenders.join("\n")}`);
});

test("whoami (offline, no login): a definitive empty state at exit 0 (not AUTH_REQUIRED); help points at the remote path", async () => {
  // Local-first: no stored login is a legitimate ANSWER (§5), not a failure — whoami reports
  // {logged_in:false} at exit 0, consistent with `home`'s logged-out report, rather than throwing
  // AUTH_REQUIRED (exit 4) for a tool that needs no login to work against a local --dir bundle.
  let out = "";
  await whoami(["--json"], {
    loadCreds: async () => null,
    stdout: (s) => (out += s),
  });
  const rec = JSON.parse(out) as { logged_in: boolean; remotes: string[]; help: string[] };
  assert.equal(rec.logged_in, false);
  assert.deepEqual(rec.remotes, []);
  assert.ok(
    rec.help.some((h) => h.includes("whoami --remote")),
    `help should point at the remote identity path: ${JSON.stringify(rec.help)}`,
  );
});

test("whoami (offline) lists the remote origins you hold a stored key for, never the key value (maturity: workspace discovery)", async () => {
  let out = "";
  await whoami([], {
    loadCreds: async () => ({ remotes: { "https://ex.workers.dev": { api_key: "secret-key-value" } } }),
    stdout: (s) => (out += s),
  });
  assert.match(out, /remotes/);
  assert.match(out, /ex\.workers\.dev/); // the origin an agent can reach with --remote
  assert.doesNotMatch(out, /secret-key-value/); // the key value is never printed
});
