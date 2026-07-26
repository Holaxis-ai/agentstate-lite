import DOMPurify from "dompurify";

export interface ViewObject {
  id: string;
  version: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface ViewPayload {
  schemaVersion: "agentstate.view-launch.v0";
  title: string;
  presentation: { html: string; css: string; contentHash: string };
  selection: { objectIds: string[] };
  objects: ViewObject[];
}

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
    const path = element.dataset.asliteText;
    if (!path) throw new Error("data-aslite-text must name a supported binding.");
    element.removeAttribute("data-aslite-text");
    element.textContent = textValue(bindingValue(payload, path));
  }
  return template.innerHTML;
}

function safeCss(css: string): string {
  // A style element is raw-text HTML. Escaping every `<` as a CSS code point keeps a supplied
  // `</style>` from breaking back into markup without changing ordinary selectors/declarations.
  return css.replaceAll("<", "\\3c ");
}

export function containedDocument(html: string, css: string): string {
  // The fixed shell materializes data as text before this document exists. The nested child gets no
  // script execution and no navigation/network-bearing elements or attributes.
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; media-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
  <style>${safeCss(css)}</style>
</head>
<body>${html}</body>
</html>`;
}
