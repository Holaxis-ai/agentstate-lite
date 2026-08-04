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
  for (const command of [
    "aslite session-start && echo owned",
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
    ["aslite session-start", "current"],
    ["agentstate-lite session-start", "current"],
    ["aslite", "stale"],
    ["/usr/local/bin/aslite session-start", "legacy_path_bound"],
    ["/x/packages/cli/dist/agentstate-lite.mjs session-start", "legacy_path_bound"],
    ["npx -y agentstate-lite session-start", "legacy_path_bound"],
    ["npx -y agentstate-lite", "stale"],
    ["npx -y @holaxis/aslite session-start", "unmanaged"],
    ["echo agentstate-lite", "unmanaged"],
    ["agentstate-lite backup", "unmanaged"],
    ["aslite2 session-start", "unmanaged"],
    ["some-tool --aslite", "unmanaged"],
  ];
  for (const [command, state] of table) {
    assert.equal(classifyHookCommand(command).state, state, command);
  }
});

test("entry compatibility includes location, matcher, type, and timeout in ownership state", () => {
  const current = classifyHookEntry({
    entry: { type: "command", command: stable, timeout: 10 },
    location: "SessionStart",
    matcher: "",
    timeoutSeconds: 10,
  });
  assert.equal(current.state, "current");
  for (const changed of [
    { location: "session_start" as const, matcher: undefined, type: "command", timeout: 10 },
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
    assert.equal(compatibility.state, "stale");
    assert.equal(isOwnedHookCompatibility(compatibility), true);
  }
});
