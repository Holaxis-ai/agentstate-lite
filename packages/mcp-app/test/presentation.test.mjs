import assert from "node:assert/strict";
import { test } from "node:test";

import { JSDOM } from "jsdom";

const browser = new JSDOM("<!doctype html><html><body></body></html>");
Object.defineProperty(globalThis, "window", { configurable: true, value: browser.window });
Object.defineProperty(globalThis, "document", { configurable: true, value: browser.window.document });

const { containedDocument, materializePresentation } = await import("../src/presentation.js");

const payload = {
  schemaVersion: "agentstate.view-launch.v1",
  title: "Containment proof",
  presentation: { html: "", css: "", contentHash: "sha256:presentation" },
  selection: { objectIds: ["tasks/alpha"] },
  objects: [
    {
      id: "tasks/alpha",
      version: "sha256:object",
      frontmatter: { type: "Task", title: "<img src=x onerror=globalThis.pwned=true>" },
      body: "<script>globalThis.pwned=true</script>",
    },
  ],
  launch: { launchId: "launch", actions: [] },
};

test("generated HTML is inert and authoritative values materialize only as text", () => {
  const html = materializePresentation(
    [
      '<main><h1 data-aslite-text="objects.0.frontmatter.title"></h1>',
      '<section data-aslite-markdown="objects.0.body"></section>',
      "<script>globalThis.pwned=true</script>",
      '<div onclick="globalThis.pwned=true">click</div>',
      '<img src="https://example.invalid/image" onerror="globalThis.pwned=true">',
      '<meta http-equiv="refresh" content="0;url=https://example.invalid/leak">',
      '<style>@import "https://example.invalid/style.css";</style>',
      '<a href="https://example.invalid/leak" target="_top">escape</a>',
      '<form action="https://example.invalid/leak"><button>send</button></form>',
      '<iframe src="https://example.invalid/frame"></iframe></main>',
    ].join(""),
    payload,
  );
  const rendered = new JSDOM(html);
  const document = rendered.window.document;

  assert.equal(document.querySelector("h1")?.textContent, payload.objects[0].frontmatter.title);
  assert.equal(document.querySelector("section")?.textContent, payload.objects[0].body);
  assert.equal(document.querySelector("script,style,meta,img,form,button,iframe"), null);
  assert.equal(document.querySelector("a")?.getAttribute("href"), null);
  assert.equal(document.querySelector("a")?.getAttribute("target"), null);
  assert.equal(document.querySelector("[onerror],[onclick]"), null);
  assert.equal(document.querySelector("[data-aslite-text]"), null);
  assert.equal(document.querySelector("[data-aslite-markdown]"), null);
});

test("bindings cannot read outside the selected envelope or supported fields", () => {
  assert.throws(
    () => materializePresentation('<p data-aslite-text="objects.1.body"></p>', payload),
    /outside this View's envelope/,
  );
  assert.throws(
    () => materializePresentation('<p data-aslite-text="objects.0.constructor"></p>', payload),
    /Unsupported data-aslite-text binding/,
  );
  const prototypeBinding = materializePresentation(
    '<p data-aslite-text="objects.0.frontmatter.__proto__"></p>',
    payload,
  );
  assert.equal(new JSDOM(prototypeBinding).window.document.querySelector("p")?.textContent, "");
  assert.throws(
    () => materializePresentation('<section data-aslite-markdown="objects.1.body"></section>', payload),
    /outside this View's envelope/,
  );
  assert.throws(
    () => materializePresentation('<section data-aslite-markdown="objects.0.frontmatter.title"></section>', payload),
    /Unsupported data-aslite-markdown binding/,
  );
  assert.throws(
    () =>
      materializePresentation(
        '<section data-aslite-text="objects.0.body" data-aslite-markdown="objects.0.body"></section>',
        payload,
      ),
    /cannot bind both text and Markdown/,
  );
});

test("Markdown binding reuses the bounded reader renderer and strips child navigation", () => {
  const markdownPayload = {
    ...payload,
    objects: [
      {
        ...payload.objects[0],
        body: [
          "# Heading",
          "",
          "**Strong** and [internal](../designs/x.md) and [external](https://example.invalid/x).",
          "",
          "- one",
          "- two",
          "",
          "<script>globalThis.pwned=true</script>",
        ].join("\n"),
      },
    ],
  };
  const html = materializePresentation(
    '<article data-aslite-markdown="objects.0.body"></article>',
    markdownPayload,
  );
  const document = new JSDOM(html).window.document;

  assert.equal(document.querySelector("h1")?.textContent, "Heading");
  assert.equal(document.querySelector("strong")?.textContent, "Strong");
  assert.equal(document.querySelectorAll("li").length, 2);
  assert.equal(document.querySelector("script"), null);
  assert.match(document.body.textContent ?? "", /<script>globalThis\.pwned=true<\/script>/);
  assert.equal(document.querySelector("a")?.getAttribute("href"), null);
  assert.equal(document.querySelector(".doc-link-inert")?.textContent, "external");
  assert.equal(document.querySelector("[data-aslite-markdown]"), null);
});

test("generated CSS cannot break out of the trusted style element", () => {
  const html = containedDocument(
    "<h1>Safe</h1>",
    'body{color:green;background:url("https://example.invalid/leak")}</style><script>globalThis.pwned=true</script><style>h1{color:red}',
  );
  const rendered = new JSDOM(html, { runScripts: "dangerously" });
  const csp =
    rendered.window.document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute("content") ??
    "";

  assert.equal(rendered.window.document.querySelectorAll("script").length, 0);
  assert.equal(rendered.window.document.querySelector("h1")?.textContent, "Safe");
  assert.equal(rendered.window.pwned, undefined);
  assert.equal(rendered.window.location.href, "about:blank");
  assert.match(rendered.window.document.querySelector("style")?.textContent ?? "", /\\3c \/style>/);
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /script-src 'none'/);
  assert.match(csp, /img-src data:/);
  assert.match(csp, /connect-src 'none'/);
});
