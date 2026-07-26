import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { containedDocument, materializePresentation, type ViewPayload } from "./presentation.js";

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
