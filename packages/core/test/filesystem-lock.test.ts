import test from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { promises as fs } from "node:fs";
import { hostname, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FilesystemBackend } from "../src/backend.js";
import {
  acquireFilesystemMutationLock,
  FilesystemMutationLockError,
  filesystemMutationLockPath,
  filesystemMutationLockRoot,
} from "../src/filesystem-lock.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LOADER = path.join(HERE, "ts-loader.mjs");
const CAS_CHILD = path.join(HERE, "fixtures", "filesystem-cas-child.ts");

async function tempDir(): Promise<string> {
  return fs.mkdtemp(path.join(tmpdir(), "aslite-fs-lock-"));
}

async function eventually<T>(promise: Promise<T>, timeoutMs = 3_000): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

interface ChildHarness {
  child: ChildProcess;
  attempting: Promise<void>;
  result: Promise<Record<string, unknown>>;
  hasResult: () => boolean;
}

function spawnCasChild(
  root: string,
  expectedVersion: string,
  body: string,
  tmpdirOverride?: string,
): ChildHarness {
  const child = spawn(process.execPath, ["--import", LOADER, CAS_CHILD, root, expectedVersion, body], {
    stdio: ["ignore", "pipe", "pipe", "ipc"],
    env: tmpdirOverride
      ? { ...process.env, TMPDIR: tmpdirOverride, TMP: tmpdirOverride, TEMP: tmpdirOverride }
      : process.env,
  });
  let resultSeen = false;
  let resolveAttempting!: () => void;
  let resolveResult!: (value: Record<string, unknown>) => void;
  let rejectAttempting!: (err: Error) => void;
  let rejectResult!: (err: Error) => void;
  const attempting = new Promise<void>((resolve, reject) => {
    resolveAttempting = resolve;
    rejectAttempting = reject;
  });
  const result = new Promise<Record<string, unknown>>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });
  let stderr = "";
  child.stderr?.setEncoding("utf8");
  child.stderr?.on("data", (chunk: string) => (stderr += chunk));
  child.on("message", (message: unknown) => {
    if (!message || typeof message !== "object") return;
    const value = message as Record<string, unknown>;
    if (value.type === "attempting") resolveAttempting();
    if (value.type === "result") {
      resultSeen = true;
      resolveResult(value);
    }
  });
  child.on("error", (err) => {
    rejectAttempting(err);
    rejectResult(err);
  });
  child.on("exit", (code, signal) => {
    if (!resultSeen) {
      const err = new Error(
        `CAS child exited before a result (code=${String(code)}, signal=${String(signal)}): ${stderr}`,
      );
      rejectAttempting(err);
      rejectResult(err);
    }
  });
  return { child, attempting, result, hasResult: () => resultSeen };
}

test("filesystem mutation lock uses private external runtime state and removes it on release", async () => {
  const root = await tempDir();
  try {
    const target = path.join(root, "nested", "doc.md");
    const release = await acquireFilesystemMutationLock(target);
    const canonicalTarget = path.join(await fs.realpath(path.dirname(target)), path.basename(target));
    const lockPath = filesystemMutationLockPath(canonicalTarget);

    assert.equal(path.dirname(lockPath), filesystemMutationLockRoot());
    assert.ok(path.relative(root, lockPath).startsWith(".."), "runtime lock must be outside the bundle");
    assert.equal((await fs.stat(filesystemMutationLockRoot())).mode & 0o777, 0o700);
    assert.equal((await fs.stat(lockPath)).mode & 0o777, 0o700);
    assert.equal((await fs.stat(path.join(lockPath, "owner.json"))).mode & 0o777, 0o600);
    const owner = JSON.parse(await fs.readFile(path.join(lockPath, "owner.json"), "utf8")) as {
      pid: number;
      hostname: string;
      target: string;
      token: string;
    };
    assert.equal(owner.pid, process.pid);
    assert.equal(owner.hostname, hostname());
    assert.equal(owner.target, canonicalTarget);
    assert.ok(owner.token.length > 0);

    await release();
    await assert.rejects(() => fs.stat(lockPath), (err: unknown) => {
      assert.equal((err as NodeJS.ErrnoException).code, "ENOENT");
      return true;
    });
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("filesystem mutation lock waits, times out with its live owner, and never steals", async () => {
  const root = await tempDir();
  try {
    const target = path.join(root, "doc.md");
    const canonicalTarget = path.join(await fs.realpath(path.dirname(target)), path.basename(target));
    const lockPath = filesystemMutationLockPath(canonicalTarget);
    const release = await acquireFilesystemMutationLock(target);

    await assert.rejects(
      () => acquireFilesystemMutationLock(target, { waitMs: 30, pollMs: 5 }),
      (err: unknown) => {
        assert.ok(err instanceof FilesystemMutationLockError);
        assert.equal(err.lockPath, lockPath);
        assert.equal(err.owner?.pid, process.pid);
        assert.equal(err.stale, false);
        assert.equal(err.malformed, false);
        return true;
      },
    );
    assert.equal((await fs.stat(lockPath)).isDirectory(), true);

    await release();
    const releaseAgain = await acquireFilesystemMutationLock(target, { waitMs: 30, pollMs: 5 });
    await releaseAgain();
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("filesystem mutation lock canonicalizes symlinked parent paths to one physical lock", async () => {
  const root = await tempDir();
  try {
    const realDir = path.join(root, "real");
    const aliasDir = path.join(root, "alias");
    await fs.mkdir(realDir);
    await fs.symlink(realDir, aliasDir, "dir");
    const release = await acquireFilesystemMutationLock(path.join(realDir, "doc.md"));

    await assert.rejects(
      () => acquireFilesystemMutationLock(path.join(aliasDir, "doc.md"), { waitMs: 20, pollMs: 5 }),
      (err: unknown) => err instanceof FilesystemMutationLockError && err.owner?.pid === process.pid,
    );
    await release();
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("filesystem mutation lock root stays outside an explicitly broad portable tree", async () => {
  const portableRoot = await fs.realpath(tmpdir());
  const lockRoot = filesystemMutationLockRoot(portableRoot);
  assert.ok(path.relative(portableRoot, lockRoot).startsWith(".."));
  assert.ok(
    path
      .relative(
        portableRoot,
        filesystemMutationLockPath(path.join(portableRoot, "doc.md"), portableRoot),
      )
      .startsWith(".."),
  );
});

test("filesystem mutation lock uses the real directory-entry spelling on insensitive filesystems", async (t) => {
  const root = await tempDir();
  try {
    const canonical = path.join(root, "Doc.md");
    const alias = path.join(root, "doc.md");
    await fs.writeFile(canonical, "x");
    try {
      await fs.lstat(alias);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        t.skip("filesystem is case-sensitive");
        return;
      }
      throw err;
    }

    const release = await acquireFilesystemMutationLock(canonical);
    await assert.rejects(
      () => acquireFilesystemMutationLock(alias, { waitMs: 20, pollMs: 5 }),
      (err: unknown) => err instanceof FilesystemMutationLockError && err.owner?.pid === process.pid,
    );
    await release();
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("filesystem mutation lock diagnoses stale and malformed leftovers without removing them", async (t) => {
  const cases = [
    {
      name: "stale",
      owner: {
        pid: 999_999,
        hostname: hostname(),
        created_at_ms: Date.now() - 60_000,
        token: "dead-owner",
        target: "unused",
      },
      stale: true,
      malformed: false,
    },
    { name: "malformed", owner: null, stale: false, malformed: true },
  ] as const;

  for (const fixture of cases) {
    await t.test(fixture.name, async () => {
      const root = await tempDir();
      try {
        const target = path.join(root, "doc.md");
        const canonicalTarget = path.join(await fs.realpath(path.dirname(target)), path.basename(target));
        const lockPath = filesystemMutationLockPath(canonicalTarget);
        await fs.mkdir(filesystemMutationLockRoot(), { recursive: true, mode: 0o700 });
        await fs.mkdir(lockPath, { recursive: true });
        if (fixture.owner) {
          await fs.writeFile(path.join(lockPath, "owner.json"), JSON.stringify(fixture.owner));
        }

        await assert.rejects(
          () => acquireFilesystemMutationLock(target, { waitMs: 20, pollMs: 5 }),
          (err: unknown) => {
            assert.ok(err instanceof FilesystemMutationLockError);
            assert.equal(err.stale, fixture.stale);
            assert.equal(err.malformed, fixture.malformed);
            return true;
          },
        );
        assert.equal((await fs.stat(lockPath)).isDirectory(), true, "timeout must not steal the lock");

        // Recovery is deliberately explicit: after the caller verifies the diagnosis, removing
        // the leftover makes the next claim succeed. The lock primitive never does this itself.
        await fs.rm(lockPath, { recursive: true });
        const release = await acquireFilesystemMutationLock(target, { waitMs: 20, pollMs: 5 });
        await release();
      } finally {
        await fs.rm(root, { recursive: true, force: true });
      }
    });
  }
});

test("two independent processes with different POSIX TMPDIR values share one CAS lock", async () => {
  const root = await tempDir();
  const children: ChildHarness[] = [];
  try {
    const backend = new FilesystemBackend(root);
    const initialVersion = await backend.write("shared", {
      id: "shared",
      frontmatter: { type: "Concept", timestamp: "2026-07-16T00:00:00.000Z" },
      body: "initial",
    });
    const release = await acquireFilesystemMutationLock(path.join(root, "shared.md"), {
      portableRoot: root,
    });
    const childTmpA = path.join(root, "session-tmp-a");
    const childTmpB = path.join(root, "session-tmp-b");
    await fs.mkdir(childTmpA);
    await fs.mkdir(childTmpB);
    children.push(
      spawnCasChild(
        root,
        initialVersion,
        "writer-a",
        process.platform === "win32" ? undefined : childTmpA,
      ),
    );
    children.push(
      spawnCasChild(
        root,
        initialVersion,
        "writer-b",
        process.platform === "win32" ? undefined : childTmpB,
      ),
    );

    await eventually(Promise.all(children.map((child) => child.attempting)).then(() => undefined));
    await new Promise((resolve) => setTimeout(resolve, 75));
    assert.equal(children.some((child) => child.hasResult()), false, "children must honor the parent process's lock");

    await release();
    const results = await eventually(Promise.all(children.map((child) => child.result)));
    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const conflicts = results.filter((result) => result.status === "conflict");
    assert.equal(fulfilled.length, 1);
    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0]?.expected, initialVersion);
    assert.equal(conflicts[0]?.actual, fulfilled[0]?.version);

    const final = await backend.read("shared");
    assert.equal(final.version, fulfilled[0]?.version);
    assert.equal(final.doc.body.trimEnd(), fulfilled[0]?.body);
  } finally {
    for (const harness of children) {
      if (harness.child.exitCode === null && harness.child.signalCode === null) harness.child.kill();
    }
    await fs.rm(root, { recursive: true, force: true });
  }
});
