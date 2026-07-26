import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import DOMPurify from "dompurify";

interface ViewObject {
  id: string;
  version: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

interface ViewPayload {
  schemaVersion: "agentstate.view-launch.v0";
  title: string;
  presentation: { html: string; css: string; contentHash: string };
  selection: { objectIds: string[] };
  objects: ViewObject[];
}

type HostContext = NonNullable<ReturnType<App["getHostContext"]>>;

const statusEl = document.getElementById("status")!;
const frame = document.getElementById("generated-view") as HTMLIFrameElement;

function isViewPayload(value: unknown): value is ViewPayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ViewPayload>;
  return (
    candidate.schemaVersion === "agentstate.view-launch.v0" &&
    typeof candidate.title === "string" &&
    typeof candidate.presentation?.html === "string" &&
    typeof candidate.presentation?.css === "string" &&
    typeof candidate.presentation?.contentHash === "string" &&
    Array.isArray(candidate.selection?.objectIds) &&
    Array.isArray(candidate.objects)
  );
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
  return object.frontmatter[match[3]!];
}

function textValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function materializePresentation(html: string, payload: ViewPayload): string {
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

function containedDocument(html: string, css: string): string {
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

function renderPayload(payload: ViewPayload): void {
  try {
    const presentation = materializePresentation(payload.presentation.html, payload);
    statusEl.dataset.kind = "ready";
    statusEl.textContent = `${payload.title} · ${payload.objects.length} authoritative object${payload.objects.length === 1 ? "" : "s"}`;
    frame.title = payload.title;
    frame.srcdoc = containedDocument(presentation, payload.presentation.css);
  } catch (error) {
    statusEl.dataset.kind = "error";
    statusEl.textContent = error instanceof Error ? error.message : String(error);
    frame.removeAttribute("srcdoc");
  }
}

function renderResult(result: CallToolResult): void {
  if (!isViewPayload(result.structuredContent)) {
    statusEl.dataset.kind = "error";
    statusEl.textContent = "This tool result did not contain a valid AgentState View payload.";
    frame.removeAttribute("srcdoc");
    return;
  }
  renderPayload(result.structuredContent);
}

function applyHostContext(context: HostContext): void {
  if (context.theme) applyDocumentTheme(context.theme);
  if (context.styles?.variables) applyHostStyleVariables(context.styles.variables);
  if (context.styles?.css?.fonts) applyHostFonts(context.styles.css.fonts);
}

void (async () => {
  const app = new App({ name: "AgentState View Host", version: "0.0.1" });
  app.ontoolresult = renderResult;
  app.onhostcontextchanged = applyHostContext;
  app.onteardown = async () => {
    frame.removeAttribute("srcdoc");
    return {};
  };
  await app.connect();
  const context = app.getHostContext();
  if (context) applyHostContext(context);
})();
