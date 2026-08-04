import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import { classifyPersistentInstallAuthority } from "../src/install-authority.js";

function durableFixture(overrides: Record<string, unknown> = {}) {
  const prefix = "/opt/aslite-npm";
  const executable = `${prefix}/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`;
  const bin = `${prefix}/bin/aslite`;
  const realpaths = new Map<string, string>([
    [prefix, prefix],
    [bin, executable],
    [executable, executable],
  ]);
  return {
    artifact_channel: "npm-package" as const,
    executable_path: executable,
    env: { PATH: `${prefix}/bin:/usr/bin` },
    platform: "linux",
    npm_prefix_global: () => prefix,
    realpath: (candidate: string) => realpaths.get(path.normalize(candidate)),
    ...overrides,
  };
}

test("npm-package authority requires a supported durable npm-global layout", () => {
  const result = classifyPersistentInstallAuthority(durableFixture());
  assert.equal(result.allowed, true);
  assert.equal(result.state, "durable_global");
  assert.equal(result.evidence.bin_path, "/opt/aslite-npm/bin/aslite");
  assert.equal(result.evidence.npm_prefix, "/opt/aslite-npm");
});

test("durable npm-package proof fails closed for every missing or transient fact", () => {
  const shadowed = durableFixture({
    env: { PATH: "/tmp/shadow:/opt/aslite-npm/bin" },
    realpath: (candidate: string) => {
      if (candidate === "/opt/aslite-npm") return candidate;
      if (candidate === "/tmp/shadow/aslite") return "/tmp/foreign.mjs";
      if (candidate === "/opt/aslite-npm/bin/aslite") {
        return "/opt/aslite-npm/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs";
      }
      if (candidate.endsWith("/dist/agentstate-lite.mjs")) return candidate;
      return undefined;
    },
  });
  const cases = [
    durableFixture({ platform: "win32" }),
    durableFixture({ npm_prefix_global: () => undefined }),
    durableFixture({ npm_prefix_global: () => "relative/prefix" }),
    durableFixture({ env: { PATH: "/usr/bin" } }),
    durableFixture({ env: { PATH: "/opt/aslite-npm/bin", npm_command: "exec" } }),
    durableFixture({ env: { PATH: "/opt/aslite-npm/bin", npm_lifecycle_event: "npx" } }),
    durableFixture({ executable_path: "/tmp/_npx/123/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs" }),
    durableFixture({
      executable_path: "/tmp/copied-agentstate-lite.mjs",
      realpath: (candidate: string) =>
        candidate === "/opt/aslite-npm" ? candidate : "/tmp/copied-agentstate-lite.mjs",
    }),
    shadowed,
  ];
  for (const fixture of cases) {
    const result = classifyPersistentInstallAuthority(fixture as never);
    assert.equal(result.allowed, false);
    assert.equal(result.state, "unknown");
    assert.ok(result.reason.length > 0);
  }
});

test("local-dev and marketplace legacy policies remain explicit while unknown fails closed", () => {
  assert.deepEqual(
    classifyPersistentInstallAuthority({ ...durableFixture(), artifact_channel: "local-dev" }),
    {
      allowed: true,
      state: "local_dev",
      reason: "developer build",
      evidence: { npm_prefix: null, bin_path: null, executable_path: durableFixture().executable_path },
    },
  );
  assert.equal(
    classifyPersistentInstallAuthority({ ...durableFixture(), artifact_channel: "marketplace-legacy" }).state,
    "marketplace_legacy",
  );
  assert.equal(
    classifyPersistentInstallAuthority({ ...durableFixture(), artifact_channel: "unknown" }).allowed,
    false,
  );
});
