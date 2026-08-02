import { renderMarkdownToStaticHtml } from "@agentstate-lite/markdown-renderer/static";
import DOMPurify from "dompurify";
import type { ViewLaunchPayload } from "./contract.js";
import {
  frameSizingScriptTag,
  type FrameSizingSession,
} from "./frame-sizing.js";

export type ViewPayload = ViewLaunchPayload;

function bindingValue(payload: ViewPayload, path: string): unknown {
  const match = /^objects\.(\d+)\.(id|version|body|frontmatter\.([A-Za-z0-9_-]+))$/.exec(path);
  if (!match) {
    throw new Error(
      `Unsupported data-aslite-text binding "${path}". Use objects.<index>.id, version, body, or frontmatter.<field>.`,
    );
  }
  const object = payload.objects[Number(match[1])];
  if (!object) throw new Error(`Binding "${path}" selects an object outside this View's envelope.`);
  if (match[2] === "id") return object.id;
  if (match[2] === "version") return object.version;
  if (match[2] === "body") return object.body;
  const field = match[3]!;
  return Object.hasOwn(object.frontmatter, field) ? object.frontmatter[field] : undefined;
}

function textValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function markdownSource(payload: ViewPayload, path: string): { body: string; fromId: string } {
  const match = /^objects\.(\d+)\.body$/.exec(path);
  if (!match) {
    throw new Error(
      `Unsupported data-aslite-markdown binding "${path}". Use objects.<index>.body.`,
    );
  }
  const object = payload.objects[Number(match[1])];
  if (!object) throw new Error(`Binding "${path}" selects an object outside this View's envelope.`);
  return { body: object.body, fromId: object.id };
}

function renderContainedMarkdown(body: string, fromId: string): DocumentFragment {
  const rendered = renderMarkdownToStaticHtml(body, { fromId });
  const template = document.createElement("template");
  template.innerHTML = rendered.html;
  if (rendered.bounded) {
    const notice = document.createElement("p");
    notice.className = "aslite-markdown-bounded";
    notice.textContent = "Document rendering stopped at the safety limit.";
    template.content.firstElementChild?.append(notice);
  }
  return template.content;
}

export function materializePresentation(html: string, payload: ViewPayload): string {
  const sanitized = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOW_DATA_ATTR: true,
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "frame",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "option",
      "meta",
      "base",
      "link",
      "svg",
      "math",
      "audio",
      "video",
      "source",
      "track",
      "img",
    ],
    FORBID_ATTR: [
      "href",
      "src",
      "srcset",
      "action",
      "formaction",
      "target",
      "ping",
      "download",
    ],
  });
  const template = document.createElement("template");
  template.innerHTML = sanitized;
  for (const element of template.content.querySelectorAll<HTMLElement>("[data-aslite-text]")) {
    if (element.hasAttribute("data-aslite-markdown")) {
      throw new Error("A generated element cannot bind both text and Markdown.");
    }
    const path = element.dataset.asliteText;
    if (!path) throw new Error("data-aslite-text must name a supported binding.");
    element.removeAttribute("data-aslite-text");
    element.textContent = textValue(bindingValue(payload, path));
  }
  for (const element of template.content.querySelectorAll<HTMLElement>("[data-aslite-markdown]")) {
    const path = element.dataset.asliteMarkdown;
    if (!path) throw new Error("data-aslite-markdown must name a supported binding.");
    element.removeAttribute("data-aslite-markdown");
    const source = markdownSource(payload, path);
    element.replaceChildren(renderContainedMarkdown(source.body, source.fromId));
  }
  return template.innerHTML;
}

function safeCss(css: string): string {
  // A style element is raw-text HTML. Escaping every `<` as a CSS code point keeps a supplied
  // `</style>` from breaking back into markup without changing ordinary selectors/declarations.
  return css.replaceAll("<", "\\3c ");
}

export function containedDocument(
  html: string,
  css: string,
  sizing: FrameSizingSession,
): string {
  // Agent-authored active content is removed before this document exists. The only executable code
  // is the nonce-bound, product-owned intrinsic-size reporter.
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${sizing.nonce}'; style-src 'unsafe-inline'; img-src data:; font-src data:; media-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
  <style>${safeCss(css)}</style>
</head>
<body>${html}${frameSizingScriptTag(sizing, { nonce: sizing.nonce })}</body>
</html>`;
}
