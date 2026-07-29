import assert from "node:assert/strict";
import { test } from "node:test";

import {
  describeEmptySelection,
  distinctTypes,
  isRepresentableFilterValue,
  suggestType,
} from "../src/empty-selection.js";

const head = (type, extra = {}) => ({ frontmatter: { type, ...extra } });
const LIMIT = 20;
const describe = (context) => describeEmptySelection({ limit: LIMIT, ...context });

test("a type miss names the bundle's types with a case/plural nearest-match hint", () => {
  const message = describe({
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
  const message = describe({ query: { type: "nope" }, typeMatched: [], bundleTypes: types });
  assert.match(message, /'Type11' \(8 more\)/);
  assert.ok(!message.includes("Type12"));
});

test("an empty type+prefix INTERSECTION is reported as a conjunction, never as two axis claims", () => {
  // PR #179 P2: Task documents exist elsewhere; archive/ holds other types. Neither axis is empty.
  const message = describe({
    query: { type: "Task", prefix: "archive/" },
    typeMatched: [],
    bundleTypes: ["Design", "Task"],
  });
  assert.match(
    message,
    /no documents of type 'Task' under prefix 'archive\/' — that type exists elsewhere in this bundle/,
  );
  assert.ok(
    !/no documents under prefix 'archive\/'/.test(message),
    "an empty intersection is no evidence that the prefix axis is empty",
  );
  assert.ok(
    !/no documents of type 'Task';/.test(message),
    "an empty intersection is no evidence that the type axis is empty",
  );
});

test("a type absent from the whole bundle is asserted outright, even alongside a prefix", () => {
  const message = describe({
    query: { type: "tasks", prefix: "archive/" },
    typeMatched: [],
    bundleTypes: ["Task"],
  });
  assert.match(message, /no documents of type 'tasks' under prefix 'archive\/' — did you mean 'Task'\?/);
});

test("a filter miss reports the pre-filter match count and observed field values", () => {
  const message = describe({
    query: { type: "Task", field: "priority=9" },
    typeMatched: [head("Task", { priority: "1" }), head("Task", { priority: "2" }), head("Task", { priority: "1" })],
    bundleTypes: [],
  });
  assert.match(message, /3 document\(s\) matched type 'Task' before filters/);
  assert.match(message, /field 'priority' values in the first 3 matched document\(s\): '1', '2'/);
});

test("field evidence never reaches past the launch's document bound", () => {
  // PR #179 P1 (the reviewer's 25-row probe): a value present only beyond the frozen envelope
  // must not surface, even though values are sorted globally for display.
  const rows = [
    ...Array.from({ length: 24 }, () => head("Task", { status: "todo" })),
    head("Task", { status: "aaa-only-in-row-25" }),
  ];
  const message = describe({ query: { type: "Task", field: "status=nope" }, typeMatched: rows, bundleTypes: [] });
  assert.match(message, /25 document\(s\) matched type 'Task' before filters/);
  assert.match(message, /field 'status' values in the first 20 matched document\(s\): 'todo'/);
  assert.ok(
    !message.includes("aaa-only-in-row-25"),
    "a value outside the bounded selection envelope must never be disclosed",
  );
});

test("only values usable in a retry filter are advertised; the rest are counted", () => {
  // PR #179 P3: the filter grammar comma-splits and trims members, and matching is exact — so
  // padded, comma-bearing, empty, and over-long values cannot round-trip.
  const message = describe({
    query: { type: "Task", field: "label=nope" },
    typeMatched: [
      head("Task", { label: "high" }),
      head("Task", { label: " padded " }),
      head("Task", { label: "a,b" }),
      head("Task", { label: "" }),
      head("Task", { label: "x".repeat(200) }),
    ],
    bundleTypes: [],
  });
  assert.match(message, /field 'label' values in the first 5 matched document\(s\): 'high' \(4 not expressible as a filter value\)/);
  for (const unusable of [" padded ", "a,b", "x".repeat(200)]) {
    assert.ok(!message.includes(unusable), `must not advertise unusable value ${JSON.stringify(unusable)}`);
  }
});

test("a field whose every observed value is unusable says so instead of dangling a bad hint", () => {
  const message = describe({
    query: { type: "Task", field: "label=nope" },
    typeMatched: [head("Task", { label: "a,b" })],
    bundleTypes: [],
  });
  assert.match(
    message,
    /field 'label' is present in the first 1 matched document\(s\), but no observed value can be expressed as a filter value/,
  );
});

test("isRepresentableFilterValue mirrors the filter grammar's member rules", () => {
  assert.equal(isRepresentableFilterValue("high"), true);
  assert.equal(isRepresentableFilterValue(""), false, "empty members are rejected by the grammar");
  assert.equal(isRepresentableFilterValue(" high "), false, "members are trimmed, so padding cannot match");
  assert.equal(isRepresentableFilterValue("a,b"), false, "members are comma-split");
  assert.equal(isRepresentableFilterValue("x".repeat(81)), false, "cannot be printed losslessly");
});

test("an absent field and the open filter are both named", () => {
  const message = describe({
    query: { type: "Task", field: "severity=high", open: true },
    typeMatched: [head("Task", { status: "done" })],
    bundleTypes: [],
  });
  assert.match(message, /field 'severity' is absent from the first 1 matched document\(s\)/);
  assert.match(message, /open: true excludes documents in a declared terminal state/);
});

test("distinctTypes dedupes, trims, sorts, and drops blank types", () => {
  assert.deepEqual(
    distinctTypes([head("Task"), head(" Task "), head("Design"), head(""), head(undefined)]),
    ["Design", "Task"],
  );
});
