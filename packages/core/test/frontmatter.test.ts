import test from "node:test";
import assert from "node:assert/strict";
import matter from "gray-matter";

import { parseMarkdown, stringifyDoc, stringifyWithData } from "../src/frontmatter.js";
import { contentVersion, versionOfBytes } from "../src/versioning.js";
import type { Frontmatter, OkfDocument } from "../src/types.js";

const ordinaryCases: Array<{ name: string; data: Record<string, unknown>; body: string }> = [
  { name: "empty data and body", data: {}, body: "" },
  { name: "empty data with body", data: {}, body: "body" },
  { name: "scalars lists and nested maps", data: { type: "Note", count: 3, tags: ["a", "b"], nested: { state: "open" } }, body: "text" },
  { name: "timestamp and number-like strings", data: { timestamp: "2026-07-01T00:00:00.000Z", padded: "001", truthy: "true" }, body: "" },
  { name: "multiline body", data: { type: "Note" }, body: "first\nsecond" },
  { name: "body already ends in newline", data: { type: "Note" }, body: "first\nsecond\n" },
];

test("stringifyWithData ordinary-input bytes match gray-matter stringify", () => {
  for (const entry of ordinaryCases) {
    assert.equal(stringifyWithData(entry.data, entry.body), matter.stringify(entry.body, entry.data), entry.name);
  }
});

test("stringifyDoc round-trips prototype-looking keys as exact own properties", () => {
  const frontmatter = { type: "Special" } as Record<string, unknown>;
  const expected = new Map<string, unknown>([
    ["__proto__", "proto-value"],
    ["constructor", "ctor-value"],
    ["toString", ["first", "second"]],
  ]);
  for (const [key, value] of expected) {
    Object.defineProperty(frontmatter, key, { value, enumerable: true, configurable: true, writable: true });
  }

  const serialized = stringifyDoc(frontmatter as Frontmatter, "body");
  const parsed = parseMarkdown(serialized);
  for (const [key, value] of expected) {
    assert.equal(Object.prototype.hasOwnProperty.call(parsed.frontmatter, key), true, key);
    assert.deepEqual((parsed.frontmatter as Record<string, unknown>)[key], value, key);
  }
  assert.equal(Object.getPrototypeOf(parsed.frontmatter), Object.prototype);
});

test("contentVersion preserves ordinary hashes and hashes emitted special-key bytes", () => {
  for (const entry of ordinaryCases) {
    const document: OkfDocument = { id: entry.name, frontmatter: entry.data as Frontmatter, body: entry.body };
    assert.equal(contentVersion(document), versionOfBytes(matter.stringify(entry.body, entry.data)), entry.name);
  }

  const frontmatter = { type: "Special" } as Record<string, unknown>;
  Object.defineProperty(frontmatter, "__proto__", {
    value: "proto-value",
    enumerable: true,
    configurable: true,
    writable: true,
  });
  const document: OkfDocument = { id: "special", frontmatter: frontmatter as Frontmatter, body: "body" };
  const serialized = stringifyDoc(document.frontmatter, document.body);
  assert.match(serialized, /^__proto__: proto-value$/m);
  assert.equal(contentVersion(document), versionOfBytes(serialized));
});

test("pin: parseMarkdown normalizes the legacy timestamp while preserving date-only and nested timestamp scalar shapes", () => {
  const parsed = parseMarkdown(`---
type: Note
timestamp: 2026-07-16T00:00:00Z
due: 2026-01-02
generated:
  at: 2026-07-16T00:00:00Z
sources:
  - resource: https://example.test/source
    last_modified: 2026-01-01
priority: 2
---
body
`);
  assert.equal(typeof parsed.frontmatter.timestamp, "string");
  assert.equal(parsed.frontmatter.timestamp, "2026-07-16T00:00:00.000Z");
  assert.equal(parsed.frontmatter.due, "2026-01-02");
  assert.deepEqual(parsed.frontmatter.generated, { at: "2026-07-16T00:00:00Z" });
  assert.deepEqual(parsed.frontmatter.sources, [{
    resource: "https://example.test/source",
    last_modified: "2026-01-01",
  }]);
  assert.equal(parsed.frontmatter.priority, 2, "non-timestamp numbers stay numbers");

  const reparsed = parseMarkdown(stringifyDoc(parsed.frontmatter, parsed.body));
  assert.equal(reparsed.frontmatter.due, "2026-01-02");
  assert.deepEqual(reparsed.frontmatter.generated, { at: "2026-07-16T00:00:00Z" });
  assert.deepEqual(reparsed.frontmatter.sources, parsed.frontmatter.sources);

  const numeric = parseMarkdown("---\ntype: Note\ntimestamp: 1720915200000\n---\n");
  assert.equal(numeric.frontmatter.timestamp, new Date(1720915200000).toISOString());
});
