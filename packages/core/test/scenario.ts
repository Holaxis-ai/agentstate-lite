/**
 * Shared fixture for the tri-backend contract tests: a representative sequence of
 * core operations, reduced to a plain comparable object, plus the fixed instants that
 * make the reduction deterministic across backends.
 *
 * Deliberately NOT a `*.test.ts` file (so `node --test`'s glob does not pick it up as
 * its own test file) and registers NO `test(...)` calls — `dual-backend.test.ts` and
 * `wire-protocol.test.ts` both import it. Node's test runner isolates each matched
 * `*.test.ts` file in its own process; if either test file imported the OTHER
 * directly, that file's top-level `test(...)` registrations would re-execute in the
 * importer's process, silently double-running its tests. Routing the shared fixture
 * through this plain helper module (no `test()` calls to re-run) avoids that.
 */
import { writeDoc, query, list, readDoc, backlinks } from "../src/bundle.js";
import { freshness } from "../src/freshness.js";
import type { Bundle } from "../src/types.js";

// Fixed instants so writes are deterministic and identical across backends.
export const T_DOC = "2026-06-01T09:00:00.000Z";
export const T_NOTE = "2026-06-15T12:00:00.000Z";
export const NOW = new Date("2026-07-01T12:00:00.000Z");
export const NOTE_ID = "context-notes/agentstate-lite/claude-orchestrator/cycle-dual";

/**
 * A representative sequence of core operations, reduced to a plain comparable object.
 * Every timestamp is pinned so the reduction is identical regardless of backend.
 */
export async function scenario(bundle: Bundle): Promise<unknown> {
  await writeDoc(bundle, {
    id: "concepts/alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body. See [Beta](beta.md).",
  });
  await writeDoc(bundle, {
    id: "concepts/beta",
    frontmatter: { type: "Concept", title: "Beta", timestamp: T_DOC },
    body: "Beta body.",
  });
  await writeDoc(bundle, {
    id: "tables/users",
    frontmatter: { type: "BigQuery Table", title: "Users", timestamp: T_DOC },
    body: "A table. Related: [Alpha](../concepts/alpha.md).",
  });

  await writeDoc(bundle, {
    id: NOTE_ID,
    frontmatter: {
      type: "Context Note",
      title: "cycle-dual",
      timestamp: T_NOTE,
      tags: ["claude-orchestrator", "agentstate-lite", "cycle-dual"],
    },
    body: "# Summary\n\nProving the seam over two backends.\n\nSee [Alpha](/concepts/alpha.md).",
  });

  const all = await query(bundle);
  const concepts = await list(bundle, { type: "Concept" });
  const alpha = await readDoc(bundle, "concepts/alpha");
  const betaBacklinks = await backlinks(bundle, "concepts/beta");
  const alphaBacklinks = await backlinks(bundle, "concepts/alpha");
  const noteDoc = await readDoc(bundle, NOTE_ID);
  const noteFreshness = freshness(noteDoc, { now: NOW });

  return {
    queryIds: all.map((d) => ({ id: d.id, type: d.frontmatter.type, ts: d.frontmatter.timestamp })),
    conceptIds: concepts.map((d) => d.id),
    // The markdown adapter's read-back body carries gray-matter's trailing newline;
    // a structural (non-serializing) backend stores the body verbatim. That byte-level
    // artifact is normalized here — the ENGINE-observable content must be identical.
    alpha: { id: alpha.id, frontmatter: alpha.frontmatter, body: alpha.body.replace(/\s+$/, "") },
    betaBacklinks,
    alphaBacklinks,
    note: { id: noteDoc.id, frontmatter: noteDoc.frontmatter, body: noteDoc.body.replace(/\s+$/, "") },
    freshness: noteFreshness.verdict,
  };
}
