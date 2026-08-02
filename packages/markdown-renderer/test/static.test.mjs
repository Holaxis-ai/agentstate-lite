import assert from "node:assert/strict";
import { test } from "node:test";

import { JSDOM } from "jsdom";

import {
  renderDocumentToStaticHtml,
  renderMarkdownToStaticHtml,
} from "../dist/static.js";

function parsed(markdown, options = {}) {
  const rendered = renderMarkdownToStaticHtml(markdown, {
    fromId: "tasks/alpha",
    ...options,
  });
  return { rendered, document: new JSDOM(rendered.html).window.document };
}

test("the inert profile constructs only passive markup and normalized concept-id markers", () => {
  const { document } = parsed([
    "# Heading",
    "",
    "[internal](../designs/x.md) [missing](../tasks/missing.md) [scheme-shaped](javascript:alert(1).md) [external](https://example.invalid/x)",
    "",
    "- [x] done",
    "- [ ] open",
    "",
    "![remote](https://example.invalid/image.png)",
    "",
    "<script>globalThis.pwned=true</script>",
  ].join("\n"));

  assert.ok(document.querySelector("[data-aslite-rendered-document]"));
  assert.equal(document.querySelector("a,input,form,button,img,script,style,iframe,object,embed"), null);
  assert.deepEqual(
    [...document.querySelectorAll("[data-aslite-doc-id]")].map((node) => node.getAttribute("data-aslite-doc-id")),
    ["designs/x", "tasks/missing", "tasks/javascript:alert(1)"],
  );
  assert.equal(document.querySelectorAll(".doc-task-marker").length, 2);
  assert.match(document.body.textContent ?? "", /<script>globalThis\.pwned=true<\/script>/);

  const root = document.querySelector("[data-aslite-rendered-document]");
  assert.ok(root);
  assert.doesNotMatch(root.outerHTML, /https:\/\/example\.invalid/);
  const allowedTags = new Set([
    "blockquote", "br", "code", "del", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
    "hr", "li", "ol", "p", "pre", "span", "strong", "table", "tbody", "td", "th", "thead", "tr", "ul",
  ]);
  for (const element of [root, ...root.querySelectorAll("*")]) {
    assert.ok(allowedTags.has(element.tagName.toLowerCase()), `${element.tagName.toLowerCase()} is outside the inert tag allowlist`);
    for (const attribute of element.attributes) {
      assert.ok(
        attribute.name === "class" ||
          attribute.name === "start" ||
          attribute.name === "aria-hidden" ||
          attribute.name.startsWith("data-aslite-"),
        `${element.tagName.toLowerCase()}[${attribute.name}] is outside the inert attribute allowlist`,
      );
    }
  }
});

test("bare relationship rows use the same inert normalized-id contract", () => {
  const { document } = parsed("[contains](../tasks/one.md)\n\n[depends on](../tasks/two.md)", {
    fromId: "roadmap-items/alpha",
    titleFor: (id) => id === "tasks/one" ? "One" : undefined,
  });
  const rows = [...document.querySelectorAll(".doc-edge-row")];
  assert.equal(rows.length, 2);
  assert.equal(rows[0].getAttribute("data-aslite-doc-id"), "tasks/one");
  assert.equal(rows[0].querySelector(".doc-edge-target")?.textContent, "One");
  assert.equal(rows[1].getAttribute("data-aslite-doc-id"), "tasks/two");
  assert.equal(rows[1].querySelector(".doc-edge-target")?.textContent, "tasks/two");
  assert.equal(document.querySelector("a"), null);
});

test("static rendering reports the shared bounds it enforces", () => {
  const { rendered, document } = parsed("one two three four", {
    limits: { maxBodyChars: 7, maxNodes: 10 },
  });
  assert.equal(rendered.bounded, true);
  assert.deepEqual(rendered.limits, { maxBodyChars: 7, maxNodes: 10 });
  assert.equal(document.querySelector("[data-aslite-rendered-document]")?.textContent, "one two");
});

test("the document adapter preserves only the bridge's presentation contract", () => {
  const rendered = renderDocumentToStaticHtml({
    id: "docs/one",
    body: "# One",
  });
  assert.deepEqual(Object.keys(rendered).sort(), ["bounded", "html"]);
  assert.match(rendered.html, /data-aslite-rendered-document/);
  assert.match(rendered.html, /<h1>One<\/h1>/);
  assert.equal(rendered.bounded, false);
});

test("deep nesting collapses at the shared depth limit without introducing active markup", () => {
  const { document } = parsed(`${"> ".repeat(45)}deep`);
  assert.equal(document.querySelectorAll("blockquote").length, 40);
  assert.equal(document.querySelector("[data-aslite-rendered-document]")?.textContent, "deep");
  assert.equal(document.querySelector("a,input,form,button,img,script,style,iframe,object,embed"), null);
});
