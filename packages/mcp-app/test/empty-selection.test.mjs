import assert from "node:assert/strict";
import { test } from "node:test";

import {
  describeEmptySelection,
  distinctTypes,
  suggestType,
} from "../src/empty-selection.js";

const head = (type, extra = {}) => ({ frontmatter: { type, ...extra } });

test("a type miss names the bundle's types with a case/plural nearest-match hint", () => {
  const message = describeEmptySelection({
    query: { type: "task" },
    typeMatched: [],
    bundleTypes: ["Context Note", "Design", "Task"],
  });
  assert.match(message, /^query matched no AgentState documents/);
  assert.match(message, /no documents of type 'task' — did you mean 'Task'\?/);
  assert.match(message, /this bundle's types: 'Context Note', 'Design', 'Task'/);
});

test("suggestType matches case- and trailing-plural-insensitively, never echoing the input", () => {
  assert.equal(suggestType("tasks", ["Task", "Design"]), "Task");
  assert.equal(suggestType("TASK", ["Task"]), "Task");
  assert.equal(suggestType("Task", ["Task"]), null, "an exact match needs no suggestion");
  assert.equal(suggestType("roadmap", ["Task"]), null);
});

test("the type list is bounded with an honest remainder", () => {
  const types = Array.from({ length: 20 }, (_, i) => `Type${String(i).padStart(2, "0")}`);
  const message = describeEmptySelection({ query: { type: "nope" }, typeMatched: [], bundleTypes: types });
  assert.match(message, /'Type11' \(and 8 more\)/);
  assert.ok(!message.includes("Type12"));
});

test("a filter miss reports the pre-filter match count and observed field values", () => {
  const message = describeEmptySelection({
    query: { type: "Task", field: "priority=9" },
    typeMatched: [head("Task", { priority: "1" }), head("Task", { priority: "2" }), head("Task", { priority: "1" })],
    bundleTypes: [],
  });
  assert.match(message, /3 document\(s\) matched type 'Task' before filters/);
  assert.match(message, /field 'priority' observed values: '1', '2'/);
});

test("an absent field and the open filter are both named", () => {
  const message = describeEmptySelection({
    query: { type: "Task", field: "severity=high", open: true },
    typeMatched: [head("Task", { status: "done" })],
    bundleTypes: [],
  });
  assert.match(message, /field 'severity' is absent on every matched document/);
  assert.match(message, /open: true excludes documents in a declared terminal state/);
});

test("distinctTypes dedupes, trims, sorts, and drops blank types", () => {
  assert.deepEqual(
    distinctTypes([head("Task"), head(" Task "), head("Design"), head(""), head(undefined)]),
    ["Design", "Task"],
  );
});
