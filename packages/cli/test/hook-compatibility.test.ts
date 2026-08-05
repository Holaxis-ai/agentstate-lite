import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyHookCommand,
  classifyHookEntry,
  isOwnedHookCompatibility,
  tokenizeGeneratedHookCommand,
} from "../src/hook-compatibility.js";

const stable =
  "'/opt/aslite/bin/node' '/opt/aslite/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs' 'session-start'";

test("generated command tokenizer accepts emitted quoting and rejects shell behavior", () => {
  assert.deepEqual(tokenizeGeneratedHookCommand(stable), [
    "/opt/aslite/bin/node",
    "/opt/aslite/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs",
    "session-start",
  ]);
  assert.deepEqual(tokenizeGeneratedHookCommand('"/Users/a b/bin/aslite" session-start'), [
    "/Users/a b/bin/aslite",
    "session-start",
  ]);
  assert.deepEqual(tokenizeGeneratedHookCommand(String.raw`"\u0061slite" session-start`), [
    String.raw`\u0061slite`,
    "session-start",
  ]);
  assert.deepEqual(tokenizeGeneratedHookCommand(String.raw`"aslite\nsession-start"`), [
    String.raw`aslite\nsession-start`,
  ]);
  for (const command of [
    "aslite session-start && echo owned",
    "aslite\nsession-start",
    "aslite\rsession-start",
    "aslite\tsession-start",
    "'aslite\nsession-start'",
    "aslite  session-start",
    "$(which aslite) session-start",
    "aslite; session-start",
    "aslite 'unterminated",
  ]) {
    assert.equal(tokenizeGeneratedHookCommand(command), undefined, command);
  }
  assert.deepEqual(tokenizeGeneratedHookCommand("echo agentstate-lite"), ["echo", "agentstate-lite"]);
});

test("command compatibility recognizes exact generated history and rejects near-matches", () => {
  const table: Array<[string, string]> = [
    [stable, "current"],
    ["aslite session-start", "legacy_path_bound"],
    ["agentstate-lite session-start", "legacy_path_bound"],
    ["aslite", "stale"],
    ["/usr/local/bin/aslite session-start", "unmanaged"],
    ["/x/packages/cli/dist/agentstate-lite.mjs session-start", "legacy_path_bound"],
    ["/opt/node/bin/node /x/packages/cli/dist/agentstate-lite.mjs session-start", "current"],
    ["node /tmp/agentstate-lite.mjs session-start", "unmanaged"],
    ["/tmp/bin/node /tmp/agentstate-lite.mjs session-start", "unmanaged"],
    ["npx -y agentstate-lite session-start", "legacy_path_bound"],
    ["npx -y agentstate-lite", "stale"],
    ["npx -y @holaxis/aslite session-start", "unmanaged"],
    ["echo agentstate-lite", "unmanaged"],
    ["agentstate-lite backup", "unmanaged"],
    ["aslite2 session-start", "unmanaged"],
    [String.raw`"\u0061slite" session-start`, "unmanaged"],
    [String.raw`"aslite\/" session-start`, "unmanaged"],
    ["some-tool --aslite", "unmanaged"],
  ];
  for (const [command, state] of table) {
    assert.equal(classifyHookCommand(command).state, state, command);
  }
});

test("entry compatibility owns only exact current and explicitly historical host shapes", () => {
  const current = classifyHookEntry({
    entry: { type: "command", command: stable, timeout: 10 },
    location: "SessionStart",
    matcher: "",
    timeoutSeconds: 10,
  });
  assert.equal(current.state, "current");
  const historical = classifyHookEntry({
    entry: { type: "command", command: "aslite session-start", timeout: 10 },
    location: "session_start",
    timeoutSeconds: 10,
  });
  assert.equal(historical.state, "stale");
  assert.equal(isOwnedHookCompatibility(historical), true);

  for (const changed of [
    { location: "SessionStart" as const, matcher: "tool", type: "command", timeout: 10 },
    { location: "SessionStart" as const, matcher: "", type: "prompt", timeout: 10 },
    { location: "SessionStart" as const, matcher: "", type: "command", timeout: 9 },
  ]) {
    const compatibility = classifyHookEntry({
      entry: { type: changed.type, command: stable, timeout: changed.timeout },
      location: changed.location,
      matcher: changed.matcher,
      timeoutSeconds: 10,
    });
    assert.equal(compatibility.state, "unmanaged");
    assert.equal(isOwnedHookCompatibility(compatibility), false);
  }
});
