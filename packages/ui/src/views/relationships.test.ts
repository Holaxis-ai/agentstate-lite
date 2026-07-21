/**
 * Relationship grouping pins (plans/relationship-reader-build; the design review's three named
 * cases). The PREDICATE is the ratified carrier model (decisions/typed-links-carrier): a typed
 * group is an edge whose `text` EXACTLY matches a declared relationship verb; everything else —
 * descriptive prose, id-shaped, empty — is Related. Red-on-heuristic: the rejected first-draft
 * rule (declared verbs + id/path catch-all) would have made prose text its own named group.
 */
import { describe, expect, it } from "vitest";
import type { Edge } from "../api/types.js";
import type { KindConvention } from "@agentstate-lite/core/kinds";
import { declaredVocabulary, groupOutbound, RELATED_GROUP } from "./relationships.js";

function kind(governs: string, links?: Record<string, string>, expectsInbound?: Record<string, string>): KindConvention {
  return {
    id: `conventions/${governs}`,
    title: governs,
    governs,
    fields: { required: [], optional: [], values: {}, terminal: {}, descriptions: {} },
    links,
    expectsInbound,
  };
}
function edge(from: string, to: string, text: string): Edge {
  return { from, to, text };
}

const KINDS: KindConvention[] = [
  kind("Roadmap Item", { contains: "Task" }),
  kind("Task", { "depends on": "Task" }, { contains: "Roadmap Item" }),
  kind("Claim", { supersedes: "Claim" }),
];

describe("declaredVocabulary", () => {
  it("unions every kind's links + expectsInbound verbs", () => {
    expect([...declaredVocabulary(KINDS)].sort()).toEqual(["contains", "depends on", "supersedes"]);
  });
  it("a conventions-free registry has an empty vocabulary", () => {
    expect(declaredVocabulary([]).size).toBe(0);
  });
});

describe("groupOutbound", () => {
  const vocab = declaredVocabulary(KINDS);

  it("PREDICATE: declared-verb text groups under that verb; undeclared prose text lands in Related as text", () => {
    const groups = groupOutbound(
      [
        edge("a", "tasks/x", "contains"),
        edge("a", "tasks/y", "contains"),
        edge("a", "tasks/z", "depends on"),
        edge("a", "designs/d", "the design that informs this"), // descriptive prose — NOT a verb
        edge("a", "notes/n", "notes/n"), // id-shaped text — NOT a verb
      ],
      vocab,
    );
    const byRelation = Object.fromEntries(groups.map((g) => [g.relation, g.rows.map((r) => r.to)]));
    expect(byRelation["contains"]).toEqual(["tasks/x", "tasks/y"]);
    expect(byRelation["depends on"]).toEqual(["tasks/z"]);
    // Prose and id-shaped both fall to Related — never their own named group (the fragmentation the review caught).
    expect(byRelation[RELATED_GROUP]).toEqual(["designs/d", "notes/n"]);
    expect(groups.map((g) => g.relation)).toEqual(["contains", "depends on", RELATED_GROUP]);
    // Related rows keep their text (the human signal).
    const related = groups.find((g) => g.relation === RELATED_GROUP)!;
    expect(related.rows.find((r) => r.to === "designs/d")!.text).toBe("the design that informs this");
  });

  it("typed groups sort alpha; Related is always last", () => {
    const groups = groupOutbound(
      [edge("a", "b", "supersedes"), edge("a", "c", "contains"), edge("a", "d", "loose")],
      vocab,
    );
    expect(groups.map((g) => g.relation)).toEqual(["contains", "supersedes", RELATED_GROUP]);
  });

  it("conventions-free vocabulary → a SINGLE flat Related list (gate-3 degrade)", () => {
    const groups = groupOutbound([edge("a", "b", "contains"), edge("a", "c", "")], new Set());
    expect(groups).toHaveLength(1);
    expect(groups[0]!.relation).toBe(RELATED_GROUP);
    expect(groups[0]!.rows.map((r) => r.to)).toEqual(["b", "c"]);
  });

  it("dedupes identical (to, text) rows within a group; keeps distinct-text rows to the same target", () => {
    const groups = groupOutbound(
      [
        edge("a", "b", "contains"),
        edge("a", "b", "contains"), // exact duplicate — collapses
        edge("a", "b", "depends on"), // same target, different verb — distinct
      ],
      vocab,
    );
    expect(groups.find((g) => g.relation === "contains")!.rows).toEqual([{ to: "b", text: "contains" }]);
    expect(groups.find((g) => g.relation === "depends on")!.rows).toEqual([{ to: "b", text: "depends on" }]);
  });

  it("no edges → no groups", () => {
    expect(groupOutbound([], vocab)).toEqual([]);
  });
});
