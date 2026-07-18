import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVENTION_TYPE,
  freshnessHorizonMs,
  isTerminal,
  kindConventionDoc,
  parseConventionDoc,
  splitSections,
  validateAgainstKind,
  type KindConvention,
} from "../src/kinds.js";
import type { Frontmatter, OkfDocument } from "../src/types.js";

const T = "2026-07-18T00:00:00.000Z";

function convention(frontmatter: Record<string, unknown>): OkfDocument {
  return {
    id: "conventions/adversarial",
    frontmatter: { type: CONVENTION_TYPE, governs: "Adversarial", timestamp: T, ...frontmatter },
    body: "",
  };
}

function minimalKind(overrides: Partial<KindConvention> = {}): KindConvention {
  return {
    id: "conventions/adversarial",
    title: "Adversarial",
    governs: "Adversarial",
    fields: {
      required: [],
      optional: [],
      values: {},
      valueDescriptions: {},
      terminal: {},
      descriptions: {},
    },
    ...overrides,
  };
}

test("malformed fields carriers warn precisely and reduce to a safe empty declaration", () => {
  const cases: Array<{
    fields: unknown;
    field: string;
    shape: string;
  }> = [
    { fields: null, field: "fields", shape: "null" },
    { fields: [], field: "fields", shape: "an array" },
    { fields: "required: title", field: "fields", shape: "string" },
    { fields: new Date(T), field: "fields", shape: "an object" },
    { fields: { required: null }, field: "fields.required", shape: "null" },
    { fields: { values: [] }, field: "fields.values", shape: "an array" },
  ];

  for (const entry of cases) {
    const parsed = parseConventionDoc(convention({ fields: entry.fields }));
    assert.equal(parsed.ok, true);
    if (!parsed.ok) continue;
    assert.deepEqual(parsed.kind.fields, {
      required: [],
      optional: [],
      values: {},
      valueDescriptions: {},
      terminal: {},
      descriptions: {},
    });
    assert.deepEqual(parsed.warnings, [{
      code: "KIND_CONVENTION_BAD_SHAPE",
      message: entry.field === "fields"
        ? `kind convention 'conventions/adversarial' has a non-map 'fields' key (${entry.shape}; expected a map with required/optional/values/value_descriptions/descriptions); ignoring it.`
        : entry.field === "fields.values"
          ? `kind convention 'conventions/adversarial' has a non-map 'fields.values' (${entry.shape}; expected a map of field name -> list of allowed values); ignoring it.`
          : `kind convention 'conventions/adversarial' has a non-list 'fields.required' (${entry.shape}; expected a list of strings); ignoring it.`,
      field: entry.field,
      severity: "warning",
    }]);
  }
});

test("non-scalar list members are dropped with a stable warning envelope", () => {
  const parsed = parseConventionDoc(convention({ fields: { required: [{ name: "title" }, ["status"]] } }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.kind.fields.required, []);
  assert.deepEqual(parsed.warnings, [
    {
      code: "KIND_CONVENTION_BAD_MEMBER",
      message: "kind convention 'conventions/adversarial' has a non-scalar member (an object) in 'fields.required'; skipping it.",
      field: "fields.required",
      severity: "warning",
    },
    {
      code: "KIND_CONVENTION_BAD_MEMBER",
      message: "kind convention 'conventions/adversarial' has a non-scalar member (an array) in 'fields.required'; skipping it.",
      field: "fields.required",
      severity: "warning",
    },
  ]);
});

test("plain null-prototype maps and scalar YAML members remain valid convention input", () => {
  const fields = Object.create(null) as Record<string, unknown>;
  fields.required = [42, true, false, "title"];
  const values = Object.create(null) as Record<string, unknown>;
  values.status = [1, true, false];
  fields.values = values;
  fields.optional = ["status"];

  const parsed = parseConventionDoc(convention({ fields }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.warnings, []);
  assert.deepEqual(parsed.kind.fields.required, ["42", "true", "false", "title"]);
  assert.deepEqual(parsed.kind.fields.optional, ["status"]);
  assert.deepEqual(parsed.kind.fields.values, { status: ["1", "true", "false"] });
});

test("splitSections accepts multiple heading spaces and trims the captured name", () => {
  assert.deepEqual(splitSections("#    Wide heading    \nbody\n\n# Next\nmore"), {
    "Wide heading": "body",
    Next: "more",
  });
});

test("parser trims user-facing scalar carriers and rejects empty governs deterministically", () => {
  const parsed = parseConventionDoc(convention({
    governs: "  Review Request  ",
    title: "  Human Review  ",
    description: "  Ask a human to decide.  ",
    path: "  review-requests/  ",
    freshness_horizon: "  24h  ",
    fields: { required: [], optional: [] },
  }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.kind.governs, "Review Request");
  assert.equal(parsed.kind.title, "Human Review");
  assert.equal(parsed.kind.description, "Ask a human to decide.");
  assert.equal(parsed.kind.path, "review-requests/");
  assert.equal(parsed.kind.freshnessHorizon, "24h");

  for (const governs of [undefined, null, 42, "", "   "]) {
    const malformed = parseConventionDoc(convention({ governs }));
    assert.deepEqual(malformed, {
      ok: false,
      reason: "missing or empty 'governs' field",
      warnings: [],
    });
  }
});

test("every deny-adjacent top-level enum spelling produces its own precise warning", () => {
  for (const key of ["enum", "enums", "values", "constraints"]) {
    const parsed = parseConventionDoc(convention({ [key]: ["todo", "done"] }));
    assert.equal(parsed.ok, true);
    if (!parsed.ok) continue;
    assert.equal(parsed.warnings.length, 1);
    assert.deepEqual(parsed.warnings[0], {
      code: "KIND_CONVENTION_MISPLACED_KEY",
      message: `kind convention 'conventions/adversarial' declares a top-level '${key}' key, which core does not read; enum constraints go under 'fields.values.<field>: [...]', not '${key}'.`,
      field: key,
      severity: "warning",
    });
  }
});

test("reserved field filtering covers every carrier and returns deterministic receipts", () => {
  const parsed = parseConventionDoc(convention({
    fields: {
      required: ["remote", "body-file", "title"],
      optional: ["dir"],
      values: { help: ["yes"], type: ["Task"] },
    },
  }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.kind.fields.required, ["title"]);
  assert.deepEqual(parsed.kind.fields.optional, []);
  assert.deepEqual(parsed.kind.fields.values, {});
  assert.deepEqual(parsed.reservedFieldsIgnored, ["body-file", "dir", "help", "remote", "type"]);
  assert.deepEqual(parsed.reservedFieldPaths, [
    "fields.optional.dir",
    "fields.required.body-file",
    "fields.required.remote",
    "fields.values.help",
    "fields.values.type",
  ]);
});

test("required-field presence distinguishes empty carriers from meaningful falsey values", () => {
  const kind = minimalKind({
    fields: {
      required: ["value"],
      optional: [],
      values: {},
      valueDescriptions: {},
      terminal: {},
      descriptions: {},
    },
  });
  const cases: Array<{ value: unknown; missing: boolean }> = [
    { value: undefined, missing: true },
    { value: null, missing: true },
    { value: "", missing: true },
    { value: "   ", missing: true },
    { value: [], missing: true },
    { value: 0, missing: false },
    { value: false, missing: false },
    { value: {}, missing: false },
    { value: [null], missing: false },
  ];

  for (const entry of cases) {
    const doc: OkfDocument = {
      id: "adversarial/value",
      frontmatter: { type: kind.governs, value: entry.value },
      body: "",
    };
    const warnings = validateAgainstKind(doc, kind);
    assert.deepEqual(warnings.map((warning) => warning.code), entry.missing ? ["KIND_FIELD_MISSING"] : []);
  }
});

test("enum validation treats explicitly nullish values as absent rather than invalid members", () => {
  const kind = minimalKind({
    fields: {
      required: [],
      optional: ["status"],
      values: { status: ["todo", "done"] },
      valueDescriptions: {},
      terminal: {},
      descriptions: {},
    },
  });

  for (const status of [undefined, null]) {
    const doc: OkfDocument = {
      id: "adversarial/status",
      frontmatter: { type: kind.governs, status },
      body: "",
    };
    assert.deepEqual(validateAgainstKind(doc, kind), []);
  }
});

test("validation warnings preserve the exact agent-facing field, code, severity, and explanation", () => {
  const kind = minimalKind({
    fields: {
      required: ["title"],
      optional: ["status"],
      values: { status: ["todo", "done"] },
      valueDescriptions: {},
      terminal: {},
      descriptions: {},
    },
    sections: ["Evidence"],
  });
  const doc: OkfDocument = {
    id: "adversarial/warnings",
    frontmatter: { type: kind.governs, title: " ", status: ["todo", "bad"] },
    body: "",
  };
  assert.deepEqual(validateAgainstKind(doc, kind), [
    {
      code: "KIND_FIELD_MISSING",
      message: "'Adversarial' requires a non-empty 'title' field (declared by conventions/adversarial).",
      field: "title",
      severity: "warning",
    },
    {
      code: "KIND_FIELD_ARITY",
      message: "'status' is enum-restricted and takes exactly ONE value for 'Adversarial'; got 2 (todo, bad).",
      field: "status",
      severity: "warning",
    },
    {
      code: "KIND_FIELD_VALUE",
      message: "'status' value 'bad' is not one of the allowed values for 'Adversarial': todo, done.",
      field: "status",
      severity: "warning",
    },
    {
      code: "KIND_SECTION_MISSING",
      message: "'Adversarial' expects a '# Evidence' body section (declared by conventions/adversarial).",
      field: "Evidence",
      severity: "warning",
    },
  ]);
});

test("terminal arrays use any-member semantics", () => {
  const kind = minimalKind({
    fields: {
      required: [],
      optional: ["status"],
      values: { status: ["doing", "done"] },
      valueDescriptions: {},
      terminal: { status: ["done"] },
      descriptions: {},
    },
  });
  assert.equal(isTerminal(kind, { type: kind.governs, status: ["doing", "done"] }), true);
  assert.equal(isTerminal(kind, { type: kind.governs, status: ["doing", "doing"] }), false);
});

test("freshness horizons reject prefixed and suffixed near-matches", () => {
  assert.equal(freshnessHorizonMs(minimalKind({ freshnessHorizon: "24h" })), 24 * 3_600_000);
  assert.equal(freshnessHorizonMs(minimalKind({ freshnessHorizon: "prefix24h" })), undefined);
  assert.equal(freshnessHorizonMs(minimalKind({ freshnessHorizon: "24h-suffix" })), undefined);
});

test("a complete convention survives serialize-parse with every declared carrier", () => {
  const kind: KindConvention = {
    id: "conventions/review-request",
    title: "Review Request",
    governs: "Review Request",
    description: "A decision requested from a human reviewer.",
    path: "review-requests/",
    fields: {
      required: ["title", "status"],
      optional: ["reviewer"],
      values: { status: ["requested", "approved"] },
      valueDescriptions: {
        status: {
          requested: "Awaiting a decision.",
          approved: "The reviewer accepted it.",
        },
      },
      terminal: { status: ["approved"] },
      descriptions: {
        title: "The decision being requested.",
        status: "The review lifecycle state.",
      },
    },
    links: { reviews: "Task" },
    linkDescriptions: { reviews: "The work being reviewed." },
    expectsInbound: { contains: "Roadmap Item" },
    sections: ["Requested decision", "Evidence"],
    freshnessHorizon: "24h",
  };

  const serialized = kindConventionDoc(kind, "Operating guidance.", T);
  const parsed = parseConventionDoc(serialized);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.warnings, []);
  assert.deepEqual(parsed.kind, kind);
});

test("serializer trims declared guidance and removes invalid programmatic entries", () => {
  const kind = minimalKind({
    description: "  Useful purpose.  ",
    fields: {
      required: ["status"],
      optional: [],
      values: { status: ["todo", "done"] },
      valueDescriptions: {
        status: {
          todo: "  Waiting.  ",
          done: "   ",
          rogue: "Not declared.",
          numeric: 42 as unknown as string,
        },
      },
      terminal: {},
      descriptions: {},
    },
    links: { reviews: "Task" },
    linkDescriptions: {
      reviews: "  The task under review.  ",
      blank: "   ",
      rogue: "Not declared.",
      numeric: 42 as unknown as string,
    },
  });
  const serialized = kindConventionDoc(kind, "", T);
  assert.equal(serialized.frontmatter.description, "Useful purpose.");
  assert.deepEqual((serialized.frontmatter.fields as Record<string, unknown>).value_descriptions, {
    status: { todo: "Waiting." },
  });
  assert.deepEqual(serialized.frontmatter.link_descriptions, {
    reviews: "The task under review.",
  });
});

test("empty optional convention carriers stay absent from parsed and serialized shapes", () => {
  const parsed = parseConventionDoc(convention({
    fields: { required: [], optional: [] },
    links: {},
    link_descriptions: {},
    expects_inbound: {},
    sections: [],
  }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const optionalKeys: Array<keyof KindConvention> = [
    "description",
    "path",
    "links",
    "linkDescriptions",
    "expectsInbound",
    "sections",
    "freshnessHorizon",
  ];
  for (const key of optionalKeys) {
    assert.equal(Object.prototype.hasOwnProperty.call(parsed.kind, key), false, key);
  }

  const serialized = kindConventionDoc(minimalKind({
    description: " ",
    links: {},
    linkDescriptions: {},
    expectsInbound: {},
    sections: [],
  }), "", T);
  assert.deepEqual(serialized.frontmatter, {
    type: CONVENTION_TYPE,
    title: "Adversarial",
    governs: "Adversarial",
    timestamp: T,
    fields: { required: [], optional: [] },
  } satisfies Frontmatter);
});
