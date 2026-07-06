/**
 * Unit tests for the pure (dependency-free) engine functions: path identity,
 * cross-link extraction/resolution, freshness derivation, the context-note
 * mapping, and the ported content_type inference.
 *
 * These modules import no filesystem or YAML runtime, so they run directly under
 * Node's built-in TypeScript stripping (see test/ts-loader.mjs).
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  conceptIdFromPath,
  pathFromConceptId,
  isReservedFile,
  assertSafeConceptId,
  assertSafeReservedDir,
} from "../src/paths.js";
import {
  extractMarkdownLinks,
  resolveConceptId,
  relativeHref,
  parseLinksFromDoc,
  isExternalHref,
} from "../src/links.js";
import { freshness, parseTimestamp } from "../src/freshness.js";
import {
  extensionOfDocKey,
  inferContentTypeFromDocKey,
  inferContentTypeForNewBlob,
} from "../src/content-type.js";
import type { OkfDocument } from "../src/types.js";

test("paths: conceptId <-> path round-trip and reserved detection", () => {
  assert.equal(conceptIdFromPath("tables/users.md"), "tables/users");
  assert.equal(conceptIdFromPath("./a/b.md"), "a/b");
  assert.equal(pathFromConceptId("tables/users"), "tables/users.md");
  assert.equal(pathFromConceptId("tables/users.md"), "tables/users.md"); // idempotent .md
  assert.ok(isReservedFile("index.md"));
  assert.ok(isReservedFile("datasets/log.md"));
  assert.ok(!isReservedFile("datasets/events.md"));
});

test("paths: assertSafeConceptId rejects traversal / absolute", () => {
  assert.doesNotThrow(() => assertSafeConceptId("a/b/c"));
  assert.throws(() => assertSafeConceptId("../escape"));
  assert.throws(() => assertSafeConceptId("/abs/path"));
  assert.throws(() => assertSafeConceptId(""));
  // A mixed sub + parent-dir-escape id (a legitimate-looking prefix that still climbs out).
  assert.throws(() => assertSafeConceptId("concepts/../../../etc/passwd"));
});

test("paths: assertSafeReservedDir rejects traversal / absolute but allows the bundle root", () => {
  assert.doesNotThrow(() => assertSafeReservedDir("")); // "" == bundle root, always valid
  assert.doesNotThrow(() => assertSafeReservedDir("a/b/c"));
  assert.throws(() => assertSafeReservedDir("../escape"));
  assert.throws(() => assertSafeReservedDir("/abs/dir"));
  assert.throws(() => assertSafeReservedDir("sub/../../../tmp")); // mixed sub + escape
});

test("links: extractMarkdownLinks skips images, keeps text links", () => {
  const links = extractMarkdownLinks("see [x](/a.md) and ![img](/p.png) and [y](./b.md)");
  assert.deepEqual(links, [
    { text: "x", href: "/a.md" },
    { text: "y", href: "./b.md" },
  ]);
});

test("links: resolveConceptId handles absolute, relative, parent, anchors, external", () => {
  assert.equal(resolveConceptId("tables/events", "/references/metrics/m.md"), "references/metrics/m");
  assert.equal(resolveConceptId("tables/events", "./users.md"), "tables/users");
  assert.equal(resolveConceptId("tables/events", "../references/m.md"), "references/m");
  assert.equal(resolveConceptId("tables/events", "/a/b.md#section"), "a/b");
  assert.equal(resolveConceptId("a/b", "https://example.com/x.md"), null); // external
  assert.equal(resolveConceptId("a/b", "./notes.txt"), null); // non-.md
  assert.equal(isExternalHref("mailto:x@y.com"), true);
});

test("links: parseLinksFromDoc keeps broken links, drops non-concept links", () => {
  const doc: OkfDocument = {
    id: "notes/a",
    frontmatter: { type: "Note" },
    body: "[live](/notes/b.md) [broken](/notes/ghost.md) [ext](https://x.io)",
  };
  const links = parseLinksFromDoc(doc);
  assert.deepEqual(
    links.map((l) => l.to),
    ["notes/b", "notes/ghost"],
  );
  assert.equal(links[0]!.from, "notes/a");
});

test("links: resolveConceptId returns null for a reserved-filename target (index.md/log.md), any directory level, any href form", () => {
  // Bundle-root reserved files, relative form.
  assert.equal(resolveConceptId("notes/a", "index.md"), null);
  assert.equal(resolveConceptId("notes/a", "log.md"), null);
  assert.equal(resolveConceptId("notes/a", "./log.md"), null);
  // Bundle-root reserved files, absolute form.
  assert.equal(resolveConceptId("notes/a", "/index.md"), null);
  assert.equal(resolveConceptId("notes/a", "/log.md"), null);
  // Nested reserved files (§3.1: reserved at ANY directory level), relative + absolute.
  assert.equal(resolveConceptId("notes/a", "../log.md"), null);
  assert.equal(resolveConceptId("concepts/a", "./sub/index.md"), null);
  assert.equal(resolveConceptId("notes/a", "/concepts/sub/index.md"), null);
  // A relative traversal that lands back on a reserved file at the resolved directory.
  assert.equal(resolveConceptId("a/b/c", "../../index.md"), null);
  // Anchors/queries on a reserved target still resolve to null (anchor stripped first).
  assert.equal(resolveConceptId("notes/a", "/log.md#section"), null);
  // A normal, non-reserved sibling target is unaffected by the guard.
  assert.equal(resolveConceptId("notes/a", "./sibling.md"), "notes/sibling");
  assert.equal(resolveConceptId("notes/a", "/concepts/sub/notindex.md"), "concepts/sub/notindex");
});

test("links: parseLinksFromDoc drops reserved-target links from the edge set entirely (not surfaced as broken either)", () => {
  const doc: OkfDocument = {
    id: "notes/a",
    frontmatter: { type: "Note" },
    body:
      "[home](index.md) [changelog](log.md) [nested](./sub/index.md) " +
      "[real](./sibling.md) [broken](./ghost.md)",
  };
  const links = parseLinksFromDoc(doc);
  assert.deepEqual(
    links.map((l) => l.to),
    ["notes/sibling", "notes/ghost"],
  );
});

test("links: relativeHref emits bundle-relative form (and passes external URLs through)", () => {
  // Same directory → bare basename.
  assert.equal(relativeHref("concepts/okf-alignment", "concepts/link-graph"), "link-graph.md");
  // Sibling directory → `../`.
  assert.equal(
    relativeHref("context-notes/cycle-x", "concepts/okf-alignment"),
    "../concepts/okf-alignment.md",
  );
  // Accepts an absolute-or-.md target and still emits relative.
  assert.equal(relativeHref("a/b/c", "/a/x.md"), "../x.md");
  // External URLs are not rewritten.
  assert.equal(relativeHref("a/b", "https://example.com/x"), "https://example.com/x");
  // A relative link round-trips through the resolver back to the full concept id.
  const href = relativeHref("context-notes/cycle-x", "concepts/okf-alignment");
  assert.equal(resolveConceptId("context-notes/cycle-x", href), "concepts/okf-alignment");
});

test("freshness: empty / fresh / stale-by-age / stale-by-dependency", () => {
  const now = new Date("2026-07-01T12:00:00Z");
  const mk = (ts?: string): OkfDocument => ({ id: "x", frontmatter: { type: "T", timestamp: ts }, body: "" });

  assert.equal(freshness(mk(undefined), { now }).verdict, "empty");
  assert.equal(parseTimestamp("not-a-date"), null);
  // Belt-and-suspenders: parseTimestamp tolerates a raw Date / epoch-ms number.
  assert.equal(parseTimestamp(new Date("2026-07-01T12:00:00Z")), Date.parse("2026-07-01T12:00:00Z"));
  assert.equal(parseTimestamp(1_700_000_000_000), 1_700_000_000_000);
  assert.equal(parseTimestamp(new Date("invalid")), null);

  const recent = freshness(mk("2026-07-01T11:00:00Z"), { now, maxAgeMs: 2 * 3600_000 });
  assert.equal(recent.verdict, "fresh");
  assert.equal(recent.ageMs, 3600_000);

  const old = freshness(mk("2026-06-01T12:00:00Z"), { now, maxAgeMs: 24 * 3600_000 });
  assert.equal(old.verdict, "stale");

  const dep = freshness(mk("2026-07-01T10:00:00Z"), {
    now,
    dependsOn: ["2026-07-01T11:00:00Z"], // dependency newer than the note
  });
  assert.equal(dep.verdict, "stale");
  assert.match(dep.reason ?? "", /dependency/);
});

test("content-type: extension inference + warning policy", () => {
  assert.equal(extensionOfDocKey("a/b/c.HTML"), "html");
  assert.equal(extensionOfDocKey("a/b/.gitignore"), undefined);
  assert.equal(inferContentTypeFromDocKey("x.md"), "text/markdown; charset=utf-8");
  assert.equal(inferContentTypeFromDocKey("x.unknownext"), undefined);

  const promoted = inferContentTypeForNewBlob("page.html", "application/octet-stream");
  assert.equal(promoted.contentType, "text/html; charset=utf-8");
  assert.equal(promoted.inferred, true);
  assert.equal(promoted.warning?.code, "CONTENT_TYPE_INFERRED");

  const same = inferContentTypeForNewBlob("x.md", "text/markdown; charset=utf-8");
  assert.equal(same.warning, undefined); // no behavior change -> no warning

  const unknown = inferContentTypeForNewBlob("x.weird", "application/octet-stream");
  assert.equal(unknown.contentType, "application/octet-stream");
  assert.equal(unknown.warning?.code, "CONTENT_TYPE_INFER_FALLBACK");

  const noext = inferContentTypeForNewBlob("README", "text/plain");
  assert.equal(noext.warning, undefined);
});
