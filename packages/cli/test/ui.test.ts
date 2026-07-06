/**
 * `agentstate-lite ui` — the CLI command that boots the local web UI (plans/ui-v1.md rev 3.2).
 * Runs the command function in-process against a real temp filesystem bundle, mirroring
 * `serve.test.ts`'s pattern exactly (injectable `bootUiServer`/`waitForShutdown`, no real OS
 * signals, no lingering listener after a test exits).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer, type Server } from "node:net";

import { initBundle } from "@agentstate-lite/core";
import { ui } from "../src/commands/ui.js";
import { bootUiServer } from "../src/ui/server.js";
import { CliError } from "../src/errors.js";

async function makeFixtureBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-test-"));
  await initBundle(dir);
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

async function bindThrowawayListener(): Promise<{ port: number; close: () => Promise<void> }> {
  const server: Server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (addr === null || typeof addr === "string") throw new Error("failed to bind a throwaway TCP address");
  return { port: addr.port, close: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}

test("ui --help: prints usage and does not boot a server", async () => {
  let out = "";
  let booted = false;
  await ui(["--help"], {
    stdout: (s) => (out += s),
    bootUiServer: async (opts) => {
      booted = true;
      return bootUiServer(opts);
    },
    waitForShutdown: () => Promise.resolve(),
    openBrowser: () => {},
  });
  assert.match(out, /agentstate-lite ui/);
  assert.equal(booted, false);
});

test("ui --port abc: USAGE (exit 2), not a bare parse crash", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    await assert.rejects(
      () => ui(["--dir", dir, "--port", "abc"], { bootUiServer, waitForShutdown: () => Promise.resolve(), openBrowser: () => {} }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("ui --dir <not-a-bundle>: NOT_FOUND (exit 6), delegated from openBundle", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-empty-"));
  try {
    await assert.rejects(
      () => ui(["--dir", dir], { bootUiServer, waitForShutdown: () => Promise.resolve(), openBrowser: () => {} }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "NOT_FOUND");
        assert.equal(err.exitCode, 6);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("ui --dir x --remote y: USAGE — mutually exclusive, same as every other remote-capable command", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    await assert.rejects(
      () =>
        ui(["--dir", dir, "--remote", "http://127.0.0.1:4818"], {
          bootUiServer,
          waitForShutdown: () => Promise.resolve(),
          openBrowser: () => {},
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("ui --port <in-use>: maps a real EADDRINUSE to a structured RUNTIME envelope (exit 1)", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  const listener = await bindThrowawayListener();
  try {
    await assert.rejects(
      () =>
        ui(["--dir", dir, "--port", String(listener.port)], {
          bootUiServer,
          waitForShutdown: () => Promise.resolve(),
          openBrowser: () => {},
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "RUNTIME");
        assert.equal(err.exitCode, 1);
        assert.match(err.help ?? "", /--port 0/);
        return true;
      },
    );
  } finally {
    await listener.close();
    await cleanup();
  }
});

test("ui --dir: prints a tokenized receipt, boots a real listener enforcing the session gate, then closes cleanly on shutdown", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    let out = "";
    let opened: string | undefined;
    let resolveShutdown!: () => void;
    const shutdown = new Promise<void>((resolve) => {
      resolveShutdown = resolve;
    });

    const run = ui(["--dir", dir, "--port", "0", "--json", "--open"], {
      stdout: (s) => (out += s),
      bootUiServer,
      waitForShutdown: () => shutdown,
      openBrowser: (url) => {
        opened = url;
      },
    });

    while (!out) await new Promise((r) => setTimeout(r, 5));
    const receipt = JSON.parse(out);
    assert.equal(receipt.ui, "listening");
    assert.equal(receipt.mode, "dir");
    assert.equal(receipt.root, dir);
    assert.match(receipt.url, /^http:\/\/127\.0\.0\.1:\d+\/\?token=[\w-]+$/);
    assert.equal(opened, receipt.url);

    const origin = new URL(receipt.url).origin;

    // No credentials at all -> 403, both for an asset request and a /v0 request.
    assert.equal((await fetch(origin + "/")).status, 403);
    assert.equal((await fetch(origin + "/v0/bundles/default/docs")).status, 403);

    // The tokenized receipt URL authenticates AND exchanges the token for a session cookie.
    const first = await fetch(receipt.url);
    assert.equal(first.status, 200);
    assert.match(first.headers.get("content-security-policy") ?? "", /default-src 'self'/);
    const setCookie = first.headers.get("set-cookie") ?? "";
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Strict/);
    const cookie = setCookie.split(";")[0];

    const withCookie = await fetch(origin + "/v0/bundles/default/docs", { headers: { cookie: cookie ?? "" } });
    assert.equal(withCookie.status, 200);

    // A mutation still needs X-Requested-With even with a valid cookie.
    const mutationNoHeader = await fetch(origin + "/v0/bundles/default/docs/tasks/x", {
      method: "PUT",
      headers: { cookie: cookie ?? "", "content-type": "application/json" },
      body: JSON.stringify({ frontmatter: { type: "Task" }, body: "" }),
    });
    assert.equal(mutationNoHeader.status, 403);

    resolveShutdown();
    await run;
    await assert.rejects(() => fetch(origin + "/v0/bundles/default/docs"));
  } finally {
    await cleanup();
  }
});
