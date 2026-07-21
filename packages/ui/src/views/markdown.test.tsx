/**
 * The doc reader's injection battery + rendering pins (designs/doc-reader rev 2). THE INVARIANT
 * (HIGH-2) first: anchor attributes are BUILT from the resolver's output — a raw markdown
 * href/src NEVER reaches a DOM attribute. Scheme vectors are first-class alongside the raw-HTML
 * set; gfm tables/task-lists render; raw HTML renders as literal TEXT; bounds degrade honestly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MAX_BODY_CHARS, MAX_NODES, renderMarkdown } from "./markdown.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("markdown renderer", () => {
  let container: HTMLDivElement;
  let root: Root;
  const onNavigateDoc = vi.fn();

  beforeEach(() => {
    onNavigateDoc.mockClear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  async function render(body: string, fromId = "tasks/alpha"): Promise<{ bounded: boolean }> {
    const result = renderMarkdown(body, { fromId, onNavigateDoc });
    await act(async () => {
      root.render(<div className="doc-body">{result.element}</div>);
    });
    return { bounded: result.bounded };
  }

  /** Every attribute of every element — the invariant's audit surface. */
  function allAttributes(): Array<{ tag: string; name: string; value: string }> {
    const out: Array<{ tag: string; name: string; value: string }> = [];
    for (const el of container.querySelectorAll("*")) {
      for (const attr of el.attributes) {
        out.push({ tag: el.tagName.toLowerCase(), name: attr.name, value: attr.value });
      }
    }
    return out;
  }

  const SCHEME_VECTORS = [
    "<javascript:alert(1)>",
    "[x](javascript:alert(1))",
    "[x](javascript:alert(1).md)",
    "[x](vbscript:msgbox(1))",
    "[x](data:text/html,<script>alert(1)</script>)",
    "[x](&#106;avascript:alert(1))",
    "[x](java\tscript:alert(1))",
    "[x](JaVaScRiPt:alert(1))",
    "<data:text/html;base64,PHNjcmlwdD4=>",
  ].join("\n\n");

  it("THE INVARIANT: no raw href reaches an attribute — every anchor href is a ?view=doc route", async () => {
    await render(SCHEME_VECTORS);
    for (const { tag, name, value } of allAttributes()) {
      const lowered = value.toLowerCase().replace(/\s/g, "");
      expect(lowered, `${tag}[${name}]`).not.toContain("javascript:");
      expect(lowered, `${tag}[${name}]`).not.toContain("vbscript:");
      expect(lowered, `${tag}[${name}]`).not.toContain("data:");
      if (tag === "a" && name === "href") {
        expect(value).toMatch(/^\?view=doc&id=/);
      }
    }
    // `javascript:alert(1).md` RESOLVES to an internal concept id → a safe route, never the scheme.
    const anchors = [...container.querySelectorAll("a")];
    for (const a of anchors) expect(a.getAttribute("href")).toMatch(/^\?view=doc&id=/);
  });

  const RAW_HTML_VECTORS = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)></svg>',
    '<math><mtext></mtext></math>',
    '<iframe src="https://evil.example"></iframe>',
    '<style>*{background:url(https://evil.example)}</style>',
    "<!-- --><img src=x onerror=alert(2)> -->",
    "<template><img src=x onerror=alert(3)></template>",
    "<noscript><img src=x onerror=alert(4)></noscript>",
  ].join("\n\n");

  it("reference-style links and footnotes with hostile targets stay inert (review completeness LOW-1)", async () => {
    await render(
      [
        "A [ref link][evil] and a [footnote][^1].",
        "",
        "[evil]: javascript:alert(1)",
        "[^1]: javascript:alert(2)",
      ].join("\n"),
    );
    for (const { tag, name, value } of allAttributes()) {
      const lowered = value.toLowerCase().replace(/\s/g, "");
      expect(lowered, `${tag}[${name}]`).not.toContain("javascript:");
      if (tag === "a" && name === "href") expect(value).toMatch(/^\?view=doc&id=/);
    }
    expect(container.querySelector("script")).toBeNull();
  });

  it("raw HTML renders as LITERAL TEXT — no elements, no handlers, visibly source", async () => {
    await render(RAW_HTML_VECTORS);
    for (const tag of ["script", "img", "svg", "math", "iframe", "style", "template", "noscript"]) {
      expect(container.querySelector(tag), `<${tag}> must not exist`).toBeNull();
    }
    for (const { name } of allAttributes()) {
      expect(name.startsWith("on"), `event-handler attribute ${name}`).toBe(false);
    }
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });

  it("frontmatter-adjacent text nodes stay text (React escapes children)", async () => {
    await render('# <img src=x onerror=alert(1)>\n\n**<script>x</script>**');
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("h1")!.textContent).toContain("<img");
  });

  it("resolved links navigate through the shell, never through the raw href", async () => {
    await render("[design](../designs/home-surface.md) and [ext](https://example.com/x)");
    const anchor = container.querySelector("a")!;
    expect(anchor.getAttribute("href")).toBe("?view=doc&id=designs%2Fhome-surface");
    await act(async () => {
      anchor.click();
    });
    expect(onNavigateDoc).toHaveBeenCalledWith("designs/home-surface");
    // The external link is inert text, not an anchor.
    const inert = container.querySelector(".doc-link-inert")!;
    expect(inert.textContent).toBe("ext");
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });

  it("images are inert in v1 (figures are the next PR; raster images a recorded deferral)", async () => {
    await render("![diagram](../views/chart.html) ![photo](x.png)");
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("[image: diagram]");
  });

  it("gfm renders: tables (with alignment classes), strikethrough, task lists", async () => {
    await render(
      "| a | b |\n|:--|--:|\n| 1 | 2 |\n\n~~gone~~\n\n- [x] done\n- [ ] open",
    );
    const table = container.querySelector(".doc-table-wrap table");
    expect(table, "table renders").not.toBeNull();
    expect(table!.querySelectorAll("th")).toHaveLength(2);
    expect(table!.querySelector("td.doc-cell-right")).not.toBeNull();
    expect(container.querySelector("del")!.textContent).toBe("gone");
    const checks = [...container.querySelectorAll("input[type=checkbox]")] as HTMLInputElement[];
    expect(checks).toHaveLength(2);
    expect(checks.every((c) => c.disabled)).toBe(true);
    expect(checks[0]!.checked).toBe(true);
  });

  it("ordinary structure renders: headings, code fences, blockquotes, lists, rules", async () => {
    await render("# H\n\n```ts\nconst x = 1;\n```\n\n> q\n\n1. one\n2. two\n\n---\n");
    expect(container.querySelector("h1")!.textContent).toBe("H");
    expect(container.querySelector("pre.doc-code code")!.textContent).toContain("const x = 1;");
    expect(container.querySelector("blockquote")).not.toBeNull();
    expect(container.querySelectorAll("ol li")).toHaveLength(2);
    expect(container.querySelector("hr")).not.toBeNull();
  });

  it("bounds degrade honestly: oversized bodies and node floods report bounded", async () => {
    const oversized = "a".repeat(MAX_BODY_CHARS + 10);
    expect((await render(oversized)).bounded).toBe(true);

    const flood = Array.from({ length: MAX_NODES + 100 }, (_, i) => `p${i}`).join("\n\n");
    expect((await render(flood)).bounded).toBe(true);
  });
});
