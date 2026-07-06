/**
 * `agentstate-lite login` — stores an origin-keyed API key for a gated wire-protocol remote (the
 * Cloudflare Worker deployment's `withApiKey` gate). The legacy `--token`/`--server` bearer mode was
 * removed; login now has ONE mode.
 *
 * Runs the `login` command function in-process against an injected `saveApiKey` dep (no disk I/O) —
 * mirrors this repo's existing command-test style (`link.test.ts`, `doc.test.ts`).
 */
import test from "node:test";
import assert from "node:assert/strict";

import { login } from "../src/commands/login.js";
import { CliError } from "../src/errors.js";

function fakeDeps() {
  const saved: { apiKeys: Array<{ origin: string; apiKey: string }> } = { apiKeys: [] };
  return {
    saved,
    deps: {
      saveApiKey: async (origin: string, apiKey: string) => {
        saved.apiKeys.push({ origin, apiKey });
      },
      stdout: (_s: string) => {},
    },
  };
}

test("login --remote <url> --api-key <key>: stores the key keyed by the remote's ORIGIN", async () => {
  const { saved, deps } = fakeDeps();
  await login(["--remote", "https://worker.example.workers.dev/", "--api-key", "secret123", "--json"], deps);
  assert.equal(saved.apiKeys.length, 1);
  assert.equal(saved.apiKeys[0]!.origin, "https://worker.example.workers.dev");
  assert.equal(saved.apiKeys[0]!.apiKey, "secret123");
});

test("login --remote without --api-key: USAGE (exit 2), nothing saved", async () => {
  const { saved, deps } = fakeDeps();
  await assert.rejects(
    () => login(["--remote", "https://worker.example.workers.dev", "--json"], deps),
    (err: unknown) => {
      assert.ok(err instanceof CliError);
      assert.equal(err.code, "USAGE");
      assert.equal(err.exitCode, 2);
      return true;
    },
  );
  assert.equal(saved.apiKeys.length, 0);
});

test("login --api-key without --remote: USAGE (exit 2)", async () => {
  const { deps } = fakeDeps();
  await assert.rejects(
    () => login(["--api-key", "secret123", "--json"], deps),
    (err: unknown) => err instanceof CliError && err.code === "USAGE",
  );
});

test("login: the removed legacy --token/--server flags are now unknown options → USAGE (exit 2)", async () => {
  const { saved, deps } = fakeDeps();
  await assert.rejects(
    () => login(["--token", "legacy", "--server", "https://x.example", "--json"], deps),
    (err: unknown) => err instanceof CliError && err.code === "USAGE",
  );
  assert.equal(saved.apiKeys.length, 0);
});

test("login --remote --api-key: a malformed remote URL is USAGE (exit 2)", async () => {
  const { deps } = fakeDeps();
  await assert.rejects(
    () => login(["--remote", "not-a-url", "--api-key", "k", "--json"], deps),
    (err: unknown) => err instanceof CliError && err.code === "USAGE",
  );
});

test("login --remote --api-key: a repeated login for the SAME origin overwrites only that origin's key", async () => {
  const { saved, deps } = fakeDeps();
  await login(["--remote", "https://a.example", "--api-key", "key-1", "--json"], deps);
  await login(["--remote", "https://a.example", "--api-key", "key-2", "--json"], deps);
  assert.equal(saved.apiKeys.length, 2);
  assert.equal(saved.apiKeys[1]!.origin, "https://a.example");
  assert.equal(saved.apiKeys[1]!.apiKey, "key-2");
});

test("login with no flags: USAGE (exit 2)", async () => {
  const { deps } = fakeDeps();
  await assert.rejects(
    () => login(["--json"], deps),
    (err: unknown) => err instanceof CliError && err.code === "USAGE",
  );
});

test("login --help: prints usage for the API-key mode (no --token), and writes nothing", async () => {
  const { saved, deps } = fakeDeps();
  let out = "";
  await login(["--help"], { ...deps, stdout: (s: string) => (out += s) });
  assert.match(out, /--remote/);
  assert.match(out, /--api-key/);
  assert.doesNotMatch(out, /--token/);
  assert.equal(saved.apiKeys.length, 0);
});
