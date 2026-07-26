import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ActionConfirmation, ActionTerminalResult } from "@agentstate-lite/view-runtime";
import type { ViewLaunchPayload } from "./contract.js";
import { containedDocument, materializePresentation } from "./presentation.js";

type HostContext = NonNullable<ReturnType<App["getHostContext"]>>;
type PrepareResult =
  | {
      status: "prepared";
      approvalToken: string;
      expiresAt: number;
      confirmation: ActionConfirmation;
    }
  | ActionTerminalResult;

const statusEl = document.getElementById("status")!;
const frame = document.getElementById("generated-view") as HTMLIFrameElement;
const actionsEl = document.getElementById("actions")!;
const actionButtonsEl = document.getElementById("action-buttons")!;
const confirmationBackdrop = document.getElementById("confirmation-backdrop")!;
const confirmationApply = document.getElementById("confirmation-apply") as HTMLButtonElement;
const confirmationCancel = document.getElementById("confirmation-cancel") as HTMLButtonElement;

let app: App;
let currentPayload: ViewLaunchPayload | null = null;
let pending: { launchId: string; approvalToken: string } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isViewPayload(value: unknown): value is ViewLaunchPayload {
  if (!isRecord(value)) return false;
  const presentation = value.presentation;
  const selection = value.selection;
  const launch = value.launch;
  return (
    value.schemaVersion === "agentstate.view-launch.v1" &&
    typeof value.title === "string" &&
    isRecord(presentation) &&
    typeof presentation.html === "string" &&
    typeof presentation.css === "string" &&
    typeof presentation.contentHash === "string" &&
    isRecord(selection) &&
    Array.isArray(selection.objectIds) &&
    Array.isArray(value.objects) &&
    isRecord(launch) &&
    typeof launch.launchId === "string" &&
    Array.isArray(launch.actions)
  );
}

function structuredResult(result: CallToolResult): Record<string, unknown> | null {
  return isRecord(result.structuredContent) ? result.structuredContent : null;
}

function resultMessage(result: unknown): string {
  if (!isRecord(result) || typeof result.status !== "string") return "The action returned an invalid result.";
  if (typeof result.message === "string" && result.message) return `${result.status}: ${result.message}`;
  if (result.status === "committed") return "The confirmed change was committed.";
  if (result.status === "cancelled") return "The proposed change was cancelled.";
  if (result.status === "conflict") return "The document changed after this View loaded. Refresh before trying again.";
  return `AgentState action: ${result.status}.`;
}

function scalarLabel(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return typeof value === "string" ? value : String(value);
}

function setConfirmationField(id: string, value: unknown): void {
  document.getElementById(id)!.textContent = scalarLabel(value);
}

function closeConfirmation(): void {
  confirmationBackdrop.hidden = true;
  pending = null;
}

function openConfirmation(
  launchId: string,
  approvalToken: string,
  confirmation: ActionConfirmation,
): void {
  pending = { launchId, approvalToken };
  setConfirmationField("confirmation-document", `${confirmation.target.title} (${confirmation.target.docId})`);
  setConfirmationField("confirmation-kind", confirmation.target.kind);
  setConfirmationField("confirmation-field", confirmation.field);
  setConfirmationField("confirmation-before", confirmation.before);
  setConfirmationField("confirmation-after", confirmation.after);
  setConfirmationField("confirmation-actor", confirmation.actor);
  confirmationApply.disabled = true;
  confirmationBackdrop.hidden = false;
  window.setTimeout(() => {
    if (pending?.approvalToken === approvalToken) confirmationApply.disabled = false;
  }, 350);
}

async function prepareAction(launchId: string, actionId: string, button: HTMLButtonElement): Promise<void> {
  button.disabled = true;
  statusEl.dataset.kind = "working";
  statusEl.textContent = "Preparing the exact change for confirmation…";
  try {
    const response = await app.callServerTool({
      name: "prepare_view_action",
      arguments: { launchId, actionId },
    });
    const structured = structuredResult(response);
    if (structured && isViewPayload(structured.view)) renderPayload(structured.view);
    const result = structured?.result as PrepareResult | undefined;
    if (result?.status === "prepared") {
      openConfirmation(launchId, result.approvalToken, result.confirmation);
      statusEl.dataset.kind = "ready";
      statusEl.textContent = "Review the trusted AgentState confirmation.";
    } else {
      statusEl.dataset.kind = result?.status === "conflict" ? "error" : "ready";
      statusEl.textContent = resultMessage(result);
    }
  } catch (error) {
    statusEl.dataset.kind = "error";
    statusEl.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    button.disabled = false;
  }
}

function renderActions(payload: ViewLaunchPayload): void {
  actionButtonsEl.replaceChildren();
  for (const descriptor of payload.launch.actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = descriptor.label;
    button.addEventListener("click", () => {
      void prepareAction(payload.launch.launchId, descriptor.actionId, button);
    });
    actionButtonsEl.append(button);
  }
  actionsEl.hidden = payload.launch.actions.length === 0;
}

function renderPayload(payload: ViewLaunchPayload): void {
  try {
    const presentation = materializePresentation(payload.presentation.html, payload);
    currentPayload = payload;
    statusEl.dataset.kind = "ready";
    statusEl.textContent = `${payload.title} · ${payload.objects.length} authoritative object${payload.objects.length === 1 ? "" : "s"}`;
    frame.title = payload.title;
    frame.srcdoc = containedDocument(presentation, payload.presentation.css);
    renderActions(payload);
  } catch (error) {
    currentPayload = null;
    statusEl.dataset.kind = "error";
    statusEl.textContent = error instanceof Error ? error.message : String(error);
    frame.removeAttribute("srcdoc");
    actionsEl.hidden = true;
  }
}

function renderResult(result: CallToolResult): void {
  const structured = structuredResult(result);
  if (isViewPayload(structured)) {
    renderPayload(structured);
    return;
  }
  if (structured && isViewPayload(structured.view)) {
    renderPayload(structured.view);
    return;
  }
  if (!currentPayload) {
    statusEl.dataset.kind = "error";
    statusEl.textContent = "This tool result did not contain a valid AgentState View payload.";
    frame.removeAttribute("srcdoc");
  }
}

async function finishAction(decision: "commit" | "cancel"): Promise<void> {
  const selected = pending;
  if (!selected) return;
  confirmationApply.disabled = true;
  confirmationCancel.disabled = true;
  try {
    const response = await app.callServerTool({
      name: "finish_view_action",
      arguments: {
        launchId: selected.launchId,
        approvalToken: selected.approvalToken,
        decision,
      },
    });
    const structured = structuredResult(response);
    if (structured && isViewPayload(structured.view)) renderPayload(structured.view);
    statusEl.dataset.kind =
      isRecord(structured?.result) && structured.result.status === "conflict" ? "error" : "ready";
    statusEl.textContent = resultMessage(structured?.result);
  } catch (error) {
    statusEl.dataset.kind = "error";
    statusEl.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    confirmationApply.disabled = false;
    confirmationCancel.disabled = false;
    closeConfirmation();
  }
}

function applyHostContext(context: HostContext): void {
  if (context.theme) applyDocumentTheme(context.theme);
  if (context.styles?.variables) applyHostStyleVariables(context.styles.variables);
  if (context.styles?.css?.fonts) applyHostFonts(context.styles.css.fonts);
}

confirmationApply.addEventListener("click", () => void finishAction("commit"));
confirmationCancel.addEventListener("click", () => void finishAction("cancel"));

void (async () => {
  app = new App({ name: "AgentState View Host", version: "0.0.1" });
  app.ontoolresult = renderResult;
  app.onhostcontextchanged = applyHostContext;
  app.onteardown = async () => {
    closeConfirmation();
    frame.removeAttribute("srcdoc");
    return {};
  };
  await app.connect();
  const context = app.getHostContext();
  if (context) applyHostContext(context);
})();
