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
  // Point the child's HOME at a throwaway dir so its `~/.agentstate/ui-url` write (0600 re-entry
  // pointer) lands in an isolated home, never the real one.
  const fakeHome = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-home-"));
  const child = spawn(process.execPath, [CLI_DIST, "ui", ...args, "--port", "0", "--json"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, HOME: fakeHome, USERPROFILE: fakeHome },
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
      })
        .finally(() => {
          if (stderr.trim()) console.error(`[ui stderr]\n${stderr}`);
        })
        .finally(() => rm(fakeHome, { recursive: true, force: true })),
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

/**
 * Seed a fresh temp bundle with the given Tasks AND the two seed pages
 * (`examples/pages/{pulse,roadmap}.html` blobs + their `type: Page` registry docs) — the
 * fixture for the pages-spike e2e (tasks/ui-pages-spike). The tasks are wired into a single
 * `roadmap-items/spike` doc via `contains` links, so the Roadmap page's `edges` request and
 * rollup bar have real data to render. Returns the bundle dir.
 */
export async function seedPagesBundle(seedTasks: SeedTask[]): Promise<string> {
  const { initBundle, writeDoc, writeBlob } = await import("@agentstate-lite/core");
  const { readFile } = await import("node:fs/promises");
  const examples = path.resolve(here, "../../../examples/pages");
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-pages-e2e-"));
  await initBundle(dir);
  // The Task convention makes `doc update --status` patchable (the live-update driver) and gives
  // the Pulse/Roadmap pages their status badges — mirrors this repo's own board.
  await writeDoc(
    { root: dir },
    {
      id: "conventions/task",
      frontmatter: {
        type: "Convention",
        title: "Task",
        governs: "Task",
        path: "tasks/",
        fields: {
          required: ["title", "status"],
          optional: ["priority", "assignee", "description"],
          values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] },
          terminal: { status: ["done", "canceled"] },
        },
      },
      body: "# Task",
    },
  );
  for (const task of seedTasks) {
    await writeDoc({ root: dir }, { id: task.id, frontmatter: task.frontmatter, body: task.body });
  }
  // One Roadmap Item `contains`-linking every seeded task (relative link, sibling directory) — the
  // fixture the Roadmap page's `edges({ text: "contains" })` request and rollup bar render against.
  const containsLinks = seedTasks.map((t) => `[contains](../${t.id}.md)`).join("\n\n");
  await writeDoc(
    { root: dir },
    { id: "roadmap-items/spike", frontmatter: { type: "Roadmap Item", title: "Spike work", status: "active" }, body: containsLinks },
  );
  await writeDoc(
    { root: dir },
    {
      id: "pages-registry/pulse",
      frontmatter: { type: "Page", title: "Pulse — activity feed", entry: "pages/pulse.html", description: "Live document feed.", bridge: "bundle-read" },
      body: "",
    },
  );
  await writeDoc(
    { root: dir },
    {
      id: "pages-registry/roadmap",
      frontmatter: { type: "Page", title: "Roadmap", entry: "pages/roadmap.html", description: "Roadmap items and their contained tasks.", bridge: "bundle-read" },
      body: "",
    },
  );
  await writeBlob({ root: dir }, "pages/pulse.html", await readFile(path.join(examples, "pulse.html")), "text/html; charset=utf-8");
  await writeBlob({ root: dir }, "pages/roadmap.html", await readFile(path.join(examples, "roadmap.html")), "text/html; charset=utf-8");
  return dir;
}

/** Boot the real CLI's `ui --dir` over a freshly seeded pages bundle (see {@link seedPagesBundle}). */
export async function bootUiOverPagesBundle(seedTasks: SeedTask[]): Promise<RunningUi & { dir: string; cleanup: () => Promise<void> }> {
  const dir = await seedPagesBundle(seedTasks);
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

/** The slice of the CLI's `UiServerHandle` the resilience spec drives (local mirror — see the import note below). */
export interface InProcessUiServer {
  host: string;
  port: number;
  token: string;
  close(): Promise<void>;
}

/**
 * Boot the ui server IN-PROCESS (the same `bootUiServer` the CLI command wraps) with an INJECTED
 * session secret and port — the test seam the server exports for exactly this. Only the
 * SSE-resilience spec uses it: proving recovery across a server restart requires the restarted
 * instance to honor the browser's existing cookie (same secret, same port), which the real CLI —
 * correctly — makes impossible from the outside (the secret rotates every boot).
 */
export async function bootUiServerInProcess(opts: { dir: string; port?: number; sessionSecret: string }): Promise<InProcessUiServer> {
  // Non-literal specifier ON PURPOSE: a literal would pull the CLI's node-typed sources into THIS
  // package's DOM-flavored tsc program (typecheck breakage in a file this package doesn't own);
  // Playwright's loader still resolves the .js -> .ts source at runtime.
  const uiServerModule = "../../cli/src/ui/server.js";
  const { bootUiServer } = (await import(uiServerModule)) as {
    bootUiServer: (options: Record<string, unknown>) => Promise<InProcessUiServer>;
  };
  const { createRouter } = await import("@agentstate-lite/server");
  const bundle = { root: opts.dir };
  return bootUiServer({
    mode: "dir",
    port: opts.port ?? 0,
    router: createRouter(bundle),
    bundle,
    sessionSecret: opts.sessionSecret,
  });
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
