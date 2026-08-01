import assert from "node:assert/strict";
import test from "node:test";

import {
  bundleContentEqual,
  normalizeBundleBuildSource,
} from "../packages/cli/scripts/bundle-identity-comparison.mjs";

function bundle({
  commit = "0123456789012345678901234567890123456789",
  dirty = false,
  name = "@holaxis/aslite",
  version = "0.1.0-pre.2",
  channel = "marketplace-legacy",
  code = "console.log('v1');",
} = {}) {
  return Buffer.from(
    `var x, define_ASLITE_BUILD_IDENTITY_default = { schema: "aslite.build-identity.v1", package: { name: ${JSON.stringify(name)}, version: ${JSON.stringify(version)} }, source: { commit: ${commit === null ? "null" : JSON.stringify(commit)}, dirty: ${dirty === null ? "null" : dirty} }, artifact: { channel: "${channel}" }, compatibility_contracts: { skill: 1, hook: 1, mcp: 1 } };\n${code}\n`,
  );
}

test("source commit and dirty facts normalize without changing the runtime artifact", () => {
  const clean = bundle();
  const dirty = bundle({ commit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd", dirty: true });
  assert.equal(bundleContentEqual(clean, dirty), true);
  assert.notDeepEqual(clean, dirty, "the user-visible artifacts must retain their distinct provenance bytes");
  assert.deepEqual(normalizeBundleBuildSource(clean), normalizeBundleBuildSource(dirty));
});

test("code, package identity, artifact channel, and legacy migration remain byte-significant", () => {
  const base = bundle();
  assert.equal(bundleContentEqual(base, bundle({ code: "console.log('v2');" })), false);
  assert.equal(bundleContentEqual(base, bundle({ name: "@holaxis/renamed" })), false);
  assert.equal(bundleContentEqual(base, bundle({ version: "0.1.0-pre.3" })), false);
  assert.equal(bundleContentEqual(base, bundle({ channel: "local-dev" })), false);
  assert.equal(bundleContentEqual(Buffer.from("console.log('legacy');\n"), base), false);
});

test("missing, malformed, and duplicate post-migration markers fail closed", () => {
  const legacy = Buffer.from("console.log('legacy');\n");
  assert.deepEqual(normalizeBundleBuildSource(legacy), legacy);

  const malformed = Buffer.from(
    'var define_ASLITE_BUILD_IDENTITY_default = { schema: "aslite.build-identity.v1", nope: true };\n',
  );
  assert.throws(() => normalizeBundleBuildSource(malformed), /assignment shape is invalid/);

  const duplicate = Buffer.concat([bundle(), bundle()]);
  assert.throws(() => normalizeBundleBuildSource(duplicate), /exactly one baked build identity marker/);
});
