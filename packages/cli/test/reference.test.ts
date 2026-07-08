// Tests for src/reference.ts's `--help` index renderer (help-index-readability task).
//
// Round context: field feedback (external-agent session) found the top-level `--help` crammed every
// group's commands into a single TOON-encoded string-array value per group — an agent had to grep a
// giant escaped line rather than read it — while subcommand help (`new --help`) is plain prose and
// was praised. `helpIndexText()` replaces the TOON rendering with grouped plain text, one command per
// physical line; `commandReference()`/`COMMAND_GROUPS` (the registry) are UNCHANGED — only the
// renderer cli.ts's `--help` calls is new. These tests pin the NEW shape and guard against the OLD
// TOON-array shape regressing.
import test from "node:test";
import assert from "node:assert/strict";
import { COMMAND_GROUPS, DESCRIPTION, helpIndexText, remoteEnvPointer, wrapText } from "../src/reference.js";

const INV = "agentstate-lite";

/** Escape a string for embedding in a `new RegExp(...)` pattern. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("helpIndexText: no TOON array shape survives — no `Group[n]:` header, no comma-quote array-item join", () => {
  const text = helpIndexText(INV);
  assert.doesNotMatch(text, /\[\d+\]:/, "must not contain a TOON array-length header like `Bundle[3]:`");
  assert.doesNotMatch(text, /","/, "must not contain TOON's comma-quote array-item separator");
});

test("helpIndexText: every group renders as its own plain-text heading line", () => {
  const text = helpIndexText(INV);
  for (const { group } of COMMAND_GROUPS) {
    assert.match(text, new RegExp(`(^|\\n)${escapeRegExp(group)}:\\n`), `missing "${group}:" heading`);
  }
});

test("helpIndexText: one command per physical line — each command's usage+summary is its own line, not comma-joined with siblings", () => {
  const text = helpIndexText(INV);
  const lines = text.split("\n");
  for (const { commands } of COMMAND_GROUPS) {
    for (const { usage, summary } of commands) {
      const expected = `  ${usage} — ${summary}`;
      assert.ok(
        lines.includes(expected),
        `expected "${usage}" to render on its own line, got:\n${text}`,
      );
    }
  }
});

test("helpIndexText: carries the tool description and a usage line (context subcommand help already had, index lacked)", () => {
  const text = helpIndexText(INV);
  assert.match(text, new RegExp(`^${escapeRegExp(INV)} — ${escapeRegExp(DESCRIPTION)}$`, "m"));
  assert.match(text, new RegExp(`^Usage: ${escapeRegExp(INV)} <command> \\[options\\]$`, "m"));
  assert.match(text, /full reference/);
});

test("helpIndexText: the kinds + bundle-resolution footer pointers still appear, as wrapped prose (not one giant unbroken line)", () => {
  const text = helpIndexText(INV);
  assert.match(text, /kinds are declared per-bundle/);
  assert.match(text, /bundle resolution, in order/);
  // The raw remoteEnvPointer() is authored as ONE long line (no embedded newlines) — if it still
  // appeared verbatim in the rendered text, the footer would not actually be wrapped.
  assert.ok(!text.includes(remoteEnvPointer()), "remoteEnvPointer must be wrapped across lines, not embedded unbroken");
});

test("helpIndexText: is invocation-parameterized (no hardcoded bin name)", () => {
  const text = helpIndexText("some-other-bin");
  assert.match(text, /^some-other-bin — /m);
  assert.doesNotMatch(text, /\bagentstate-lite\b/);
});

test("wrapText: wraps long prose at existing spaces without breaking words, and leaves short text on one line", () => {
  assert.equal(wrapText("short line"), "short line");

  const long = Array.from({ length: 20 }, (_, i) => `word${i}`).join(" ");
  const wrapped = wrapText(long, 20);
  const lines = wrapped.split("\n");
  assert.ok(lines.length > 1, "expected the long text to wrap onto multiple lines");
  for (const line of lines) {
    assert.ok(line.length <= 20, `line exceeds requested width: "${line}"`);
  }
  // No word was split or dropped: rejoining the wrapped lines with spaces reproduces the input.
  assert.equal(lines.join(" "), long);
});
