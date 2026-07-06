/**
 * E2E harness: boot the REAL, BUILT `agentstate-lite ui` command as a child process (never a
 * dev server — plans/ui-v1.md rev 3.2 "E2E: Playwright against the REAL `ui` command server").
 * Readiness/teardown ride the port-0 TOON/JSON receipt, exactly as the CLI's own `serve`
 * command's tests do (`packages/cli/test/serve.test.ts`).
 */
import { spawn, type ChildProcessByStdio } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Readable } from "node:stream";
import type { Frontmatter } from "@agentstate-lite/core";

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/ui/e2e -> repo root -> packages/cli/dist/agentstate-lite.mjs
export const CLI_DIST = path.resolve(here, "../../cli/dist/agentstate-lite.mjs");

/** The exact stdio shape `bootUi` spawns with (`stdio: ["ignore", "pipe", "pipe"]`) — stdin is `null` since it's ignored. */
type UiChild = ChildProcessByStdio<null, Readable, Readable>;

/** A Task doc to seed a temp bundle with before booting `ui` over it. */
export interface SeedTask {
  id: string;
  frontmatter: Frontmatter;
  body: string;
}

export interface UiReceipt {
  ui: string;
  url: string;
  mode: string;
  root: string;
  auth: string;
  help: string[];
}

export interface RunningUi {
  receipt: UiReceipt;
  /** The tokenized URL fresh from the receipt — the FIRST navigation must use this to exchange the token for a session cookie. */
  url: string;
  stop: () => Promise<void>;
}

function waitForReceipt(child: UiChild): Promise<UiReceipt> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let buf = "";
    const timeout = setTimeout(() => settle(() => reject(new Error("timed out waiting for the ui command's receipt"))), 15_000);
    function settle(fn: () => void) {
      if (settled) return; // an exit AFTER a successful resolve is an ordinary later shutdown, not a failure
      settled = true;
      clearTimeout(timeout);
      fn();
    }
    const onData = (chunk: Buffer) => {
      buf += chunk.toString("utf8");
      const nl = buf.indexOf("\n");
      if (nl === -1) return;
      const line = buf.slice(0, nl);
      child.stdout.off("data", onData);
      settle(() => {
        try {
          resolve(JSON.parse(line) as UiReceipt);
        } catch (err) {
          reject(new Error(`ui command's first stdout line was not valid JSON: ${line} (${String(err)})`));
        }
      });
    };
    child.stdout.on("data", onData);
    child.once("error", (err) => settle(() => reject(err)));
    child.once("exit", (code) => settle(() => reject(new Error(`ui command exited early (code ${code}) before printing a receipt`))));
  });
}

async function bootUi(args: string[]): Promise<RunningUi> {
  const child = spawn(process.execPath, [CLI_DIST, "ui", ...args, "--port", "0", "--json"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (c: Buffer) => {
    stderr += c.toString("utf8");
  });
  const receipt = await waitForReceipt(child);
  return {
    receipt,
    url: receipt.url,
    stop: () =>
      new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.kill("SIGTERM");
        // Belt-and-braces: force-kill if it doesn't exit promptly (a real hang here would
        // otherwise stall the whole spec file rather than just this one test).
        setTimeout(() => {
          if (!child.killed) child.kill("SIGKILL");
        }, 3_000).unref();
      }).finally(() => {
        if (stderr.trim()) console.error(`[ui stderr]\n${stderr}`);
      }),
  };
}

/** Boot `ui --dir <fresh temp bundle>`, seeded with the given Task docs' frontmatter/body. Returns the running instance plus a cleanup that stops the process AND removes the temp dir. */
export async function bootUiOverDirBundle(seedTasks: SeedTask[]): Promise<RunningUi & { dir: string; cleanup: () => Promise<void> }> {
  const { initBundle, writeDoc } = await import("@agentstate-lite/core");
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-e2e-"));
  await initBundle(dir);
  for (const task of seedTasks) {
    await writeDoc({ root: dir }, { id: task.id, frontmatter: task.frontmatter, body: task.body });
  }
  const running = await bootUi(["--dir", dir]);
  return {
    ...running,
    dir,
    cleanup: async () => {
      await running.stop();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

/** Boot a local, keyless reference `serve()` instance, then `ui --remote <that url>` proxying it — proves conditional (absent) Bearer injection with zero cloud, per rev 3.2. */
export async function bootUiOverRemote(seedTasks: SeedTask[]) {
  const { initBundle, writeDoc } = await import("@agentstate-lite/core");
  const { serve } = await import("@agentstate-lite/server");
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-e2e-remote-"));
  await initBundle(dir);
  for (const task of seedTasks) {
    await writeDoc({ root: dir }, { id: task.id, frontmatter: task.frontmatter, body: task.body });
  }
  const referenceServer = await serve({ bundle: { root: dir }, port: 0 });
  const remoteUrl = `http://${referenceServer.host}:${referenceServer.port}`;
  const running = await bootUi(["--remote", remoteUrl]);
  return {
    ...running,
    dir,
    remoteUrl,
    cleanup: async () => {
      await running.stop();
      await referenceServer.close();
      await rm(dir, { recursive: true, force: true });
    },
  };
}
