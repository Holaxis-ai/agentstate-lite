/**
 * Regression test for the stored-XSS finding (external review, P2): a shared
 * `viz.html` renders another author's markdown bodies, so those bodies are
 * untrusted input. Two independent defenses are exercised against the SAME
 * production code paths (`renderTemplate` / `embedJson` / `VIZ_JS`) — no
 * second implementation of either is introduced here:
 *
 *  1. The embedded JSON payload must not let a body's `</script>` sequence
 *     break out of the inline data `<script>` block (this was already handled
 *     by `embedJson`'s `</` -> `<\/` escape; this test locks that in).
 *  2. The client runtime must sanitize `marked.parse(...)` output through
 *     `DOMPurify.sanitize` before it is ever assigned to `.innerHTML` — this
 *     test asserts the shipped runtime is wired that way (a real headless
 *     browser / jsdom execution was judged to be heavier infra than this
 *     fix warrants; see the handback for the tradeoff).
 */
import test from "node:test";
import assert from "node:assert/strict";

import { renderTemplate } from "../src/template.js";
import { VIZ_JS } from "../src/assets.js";
import type { BundleData } from "../src/bundle.js";

/** A markdown body carrying both attack vectors: a closing-script-tag
 * breakout attempt AND inline event-handler / script payloads that must
 * never execute unsanitized once rendered client-side. */
const MALICIOUS_BODY =
  "Evil note</script><script>window.__pwned = 1;</script>" +
  '<img src="x" onerror="window.__pwned = 2">' +
  "<script>window.__pwned = 3;</script>" +
  "<a href=\"javascript:window.__pwned=4\">click</a>";

function makeBundle(body: string): BundleData {
  return {
    name: "xss-fixture",
    nodes: [
      { id: "evil", type: "Note", title: "Evil", description: "", resource: "", tags: [], size: body.length },
    ],
    edges: [],
    bodies: { evil: body },
  };
}

test("template: a malicious body cannot break out of the embedded-JSON <script> block", () => {
  const html = renderTemplate(makeBundle(MALICIOUS_BODY));

  // The document must contain exactly the 5 legitimate `</script>` closings:
  // 3 CDN <script src=...></script> tags, the data-assignment <script>, and
  // the runtime <script>. If the malicious body's 3 embedded "</script>"
  // breakout attempts were not neutralized, this count would be higher and/or
  // a real new <script> element would exist in the page outside the two
  // intended blocks.
  const closingScriptCount = html.split("</script>").length - 1;
  assert.equal(closingScriptCount, 5, "unescaped </script> in a body must not create extra script elements");

  // The raw attack strings must still be recoverable as inert DATA inside the
  // window.__BUNDLE__ JSON blob (round-trip fidelity — escaping must not
  // corrupt the body), proving they never became live markup elsewhere.
  const bundleAssignment = html.slice(html.indexOf("window.__BUNDLE__"), html.indexOf(";</script>"));
  const embedded = JSON.parse(bundleAssignment.slice(bundleAssignment.indexOf("=") + 1).trim());
  assert.equal(embedded.bodies.evil, MALICIOUS_BODY);
});

test("template: the payload's embedded script content never spills past the data block", () => {
  const html = renderTemplate(makeBundle(MALICIOUS_BODY));
  // Locate the data-assignment block's TRUE end the way a browser's HTML
  // tokenizer would: content model of <script> is raw text, so it reads until
  // the first literal "</script>" sequence. Because embedJson escaped every
  // "</" in the payload, that first real "</script>" is the template's own
  // closing tag — not one of the 3 breakout attempts inside MALICIOUS_BODY.
  const start = html.indexOf("window.__BUNDLE__");
  const dataBlockEnd = html.indexOf("</script>", start) + "</script>".length;
  const dataBlock = html.slice(start, dataBlockEnd);
  const rest = html.slice(0, start) + html.slice(dataBlockEnd);

  // All four attack markers are present (round-trip fidelity)...
  const pwnedCount = (MALICIOUS_BODY.match(/__pwned/g) || []).length;
  assert.equal((dataBlock.match(/__pwned/g) || []).length, pwnedCount);
  // ...but confined entirely to inert JSON text inside that ONE data block —
  // none of them leaked into a second, browser-created <script> element.
  assert.equal((rest.match(/__pwned/g) || []).length, 0);
});

test("client runtime: marked output is routed through DOMPurify.sanitize before reaching innerHTML", () => {
  // Structural guard on the SHIPPED runtime source (the same VIZ_JS string
  // that template.ts inlines into every generated viz.html): the sanitize
  // call must wrap the parsed markdown, and that sanitized value — not the
  // raw parser output — must be what gets concatenated and assigned.
  assert.match(VIZ_JS, /window\.DOMPurify\.sanitize\(window\.marked\.parse\(rawBody\)\)/);
  assert.match(VIZ_JS, /panel\.innerHTML = h/);

  // The unsanitized fallback path only ever produces escaped text, never the
  // raw marked/DOMPurify-less HTML — i.e. there is no code path that assigns
  // `window.marked.parse(...)` straight into `h` without the sanitize guard.
  const rawAssignPattern = /h \+= .*window\.marked\.parse\(rawBody\)/;
  assert.doesNotMatch(VIZ_JS, rawAssignPattern);
});

test("template: a benign body round-trips unchanged and keeps the same 5-script baseline", () => {
  const html = renderTemplate(makeBundle("Just a **normal** note with a [link](other.md)."));
  const scriptOpenTagCount = (html.match(/<script[ >]/g) || []).length;
  assert.equal(scriptOpenTagCount, 5);
});
