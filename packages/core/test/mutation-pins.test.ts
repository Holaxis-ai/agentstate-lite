/**
 * Mutation-survivor pins with no existing topical test home (core-survivor-triage unit):
 * versioning's pure helpers (`stripETagWrapper`, `defaultActor`). Every "kills:" line was
 * red-proven against the exact Stryker survivor from the first full core mutation report
 * (run 29628092134): mutant applied → test fails; real code → passes.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { stripETagWrapper, defaultActor } from "../src/versioning.js";

// kills: versioning.ts:74:11 MethodExpression #3160
// kills: versioning.ts:76:7 LogicalOperator #3168
// kills: versioning.ts:76:7 ConditionalExpression #3169
// kills: versioning.ts:76:7 ConditionalExpression #3171
// kills: versioning.ts:76:7 EqualityOperator #3172
// kills: versioning.ts:76:24 MethodExpression #3174
// kills: versioning.ts:76:37 StringLiteral #3175
// kills: versioning.ts:76:45 MethodExpression #3176
// kills: versioning.ts:76:56 StringLiteral #3177
test("pin: stripETagWrapper strips ONLY a full RFC 7232 wrapper — trimmed, both-quotes, length-2 minimum", () => {
  assert.equal(stripETagWrapper('  "abc"  '), "abc");
  assert.equal(stripETagWrapper('""'), "");
  assert.equal(stripETagWrapper('abc"'), 'abc"');
  assert.equal(stripETagWrapper('"abc'), '"abc');
  assert.equal(stripETagWrapper('"'), '"');
  assert.equal(stripETagWrapper('W/"v1"'), "v1");
  assert.equal(stripETagWrapper("sha256:bare"), "sha256:bare");
});

// kills: versioning.ts:81:40 BlockStatement #3180
// kills: versioning.ts:83:5 ConditionalExpression #3181
// kills: versioning.ts:83:5 ConditionalExpression #3182
// kills: versioning.ts:83:5 MethodExpression #3188
// kills: versioning.ts:83:5 OptionalChaining #3189
// kills: versioning.ts:84:5 MethodExpression #3190
// kills: versioning.ts:84:5 OptionalChaining #3191
// kills: versioning.ts:85:5 MethodExpression #3192
// kills: versioning.ts:85:5 OptionalChaining #3193
// kills: versioning.ts:86:5 StringLiteral #3194
test("pin: defaultActor trims each of USER/USERNAME/LOGNAME in order and falls back to 'local'", () => {
  const saved = {
    USER: process.env.USER,
    USERNAME: process.env.USERNAME,
    LOGNAME: process.env.LOGNAME,
  };
  const setEnv = (values: Record<string, string | undefined>) => {
    for (const key of ["USER", "USERNAME", "LOGNAME"]) {
      const value = values[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
  try {
    setEnv({});
    assert.equal(defaultActor(), "local");
    setEnv({ USER: "alice" });
    assert.equal(defaultActor(), "alice");
    setEnv({ USER: "   ", LOGNAME: "zed" });
    assert.equal(defaultActor(), "zed", "whitespace-only USER must fall through");
    setEnv({ USERNAME: "   " });
    assert.equal(defaultActor(), "local", "whitespace-only USERNAME must fall through");
    setEnv({ LOGNAME: "   " });
    assert.equal(defaultActor(), "local", "whitespace-only LOGNAME must fall through");
  } finally {
    setEnv(saved);
  }
});
