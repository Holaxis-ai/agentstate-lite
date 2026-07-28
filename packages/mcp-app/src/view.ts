import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ActionConfirmation, ActionTerminalResult } from "@agentstate-lite/view-runtime";
import type {
  DurableViewLaunchPayload,
  McpViewPayload,
  ViewLaunchPayload,
} from "./contract.js";
import { mayForwardDurableActivity } from "./durable-activity.js";
import {
  RecoveryGuard,
  extractClaimId,
  extractViewPayload,
  firstResultText,
  isDurableViewPayload,
  isViewPayload,
} from "./result-recovery.js";
import { FrameLoadGuard } from "./frame-load-guard.js";
import {
  appendFrameSizingScript,
  clampFrameHeight,
  createFrameSizingSession,
  flexibleHostHeightLimit,
  hasFixedHostHeight,
  measureShellChromeHeight,
  readFrameSizeEvent,
  type FrameSizingSession,
} from "./frame-sizing.js";
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
const shell = frame.closest(".shell") as HTMLElement;
const actionsEl = document.getElementById("actions")!;
const actionButtonsEl = document.getElementById("action-buttons")!;
const confirmationBackdrop = document.getElementById("confirmation-backdrop")!;
const confirmationApply = document.getElementById("confirmation-apply") as HTMLButtonElement;
const confirmationCancel = document.getElementById("confirmation-cancel") as HTMLButtonElement;
const authorizationBackdrop = document.getElementById("authorization-backdrop")!;
const authorizationApply = document.getElementById("authorization-apply") as HTMLButtonElement;
const authorizationCancel = document.getElementById("authorization-cancel") as HTMLButtonElement;
const displayModeButton = document.getElementById("display-mode") as HTMLButtonElement;

let app: App;
let currentPayload: McpViewPayload | null = null;
let pending: { launchId: string; approvalToken: string } | null = null;
let frameEpoch = 0;
let pollTimer: number | null = null;
let pollAcknowledgement: string | undefined;
let suspendedDurableLaunch: string | null = null;
let frameObjectUrl: string | null = null;
let frameSizingSession: FrameSizingSession | null = null;
let requestedFrameHeight: number | null = null;
let currentHostContext: HostContext | null = null;
const frameLoadGuard = new FrameLoadGuard();

const ACTIVE_VIEW_CHILD_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src data:",
  "font-src data:",
  "connect-src 'none'",
  "frame-src 'none'",
  "child-src 'none'",
  "worker-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "object-src 'none'",
].join("; ");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  syncDialogState();
}

function stopPolling(): void {
  if (pollTimer !== null) window.clearTimeout(pollTimer);
  pollTimer = null;
  pollAcknowledgement = undefined;
}

function closeAuthorization(): void {
  authorizationBackdrop.hidden = true;
  authorizationApply.disabled = true;
  authorizationCancel.disabled = false;
  syncDialogState();
}

function closeDurableLaunch(launchId: string): void {
  void app
    .callServerTool({
      name: "close_durable_view",
      arguments: { launchId },
    })
    .catch(() => {});
}

function resetFrameSizing(): void {
  frameSizingSession = null;
  requestedFrameHeight = null;
  frame.style.removeProperty("height");
}

function setFrameDocument(
  html: string,
  sizing: FrameSizingSession,
  contentType = "text/html; charset=utf-8",
): void {
  resetFrameSizing();
  frameSizingSession = sizing;
  if (frameObjectUrl) URL.revokeObjectURL(frameObjectUrl);
  frameObjectUrl = URL.createObjectURL(new Blob([html], { type: contentType }));
  frame.removeAttribute("srcdoc");
  frameLoadGuard.expectNext();
  frame.src = frameObjectUrl;
}

function clearFrameDocument(): void {
  frameLoadGuard.reset();
  resetFrameSizing();
  frame.removeAttribute("srcdoc");
  frame.removeAttribute("src");
  if (frameObjectUrl) URL.revokeObjectURL(frameObjectUrl);
  frameObjectUrl = null;
}

function retirePayload(closeDurable = true): void {
  const previous = currentPayload;
  frameEpoch++;
  stopPolling();
  closeAuthorization();
  suspendedDurableLaunch = null;
  currentPayload = null;
  syncDisplayModeButton();
  clearFrameDocument();
  frame.setAttribute("sandbox", "");
  frame.removeAttribute("csp");
  actionButtonsEl.replaceChildren();
  actionsEl.hidden = true;
  if (
    closeDurable &&
    previous?.schemaVersion === "agentstate.durable-view-launch.v1"
  ) {
    closeDurableLaunch(previous.launch.launchId);
  }
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
  syncDialogState();
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
    else if (structured?.view === null) retirePayload();
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

function renderGeneratedPayload(payload: ViewLaunchPayload): void {
  try {
    const presentation = materializePresentation(payload.presentation.html, payload);
    const previous = currentPayload;
    frameEpoch++;
    stopPolling();
    closeAuthorization();
    suspendedDurableLaunch = null;
    currentPayload = payload;
    if (previous?.schemaVersion === "agentstate.durable-view-launch.v1") {
      closeDurableLaunch(previous.launch.launchId);
    }
    statusEl.dataset.kind = "ready";
    statusEl.textContent = `${payload.title} · ${payload.objects.length} authoritative object${payload.objects.length === 1 ? "" : "s"}`;
    frame.title = payload.title;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.removeAttribute("csp");
    const sizing = createFrameSizingSession(payload.launch.launchId, frameEpoch);
    setFrameDocument(
      containedDocument(presentation, payload.presentation.css, sizing),
      sizing,
    );
    renderActions(payload);
  } catch (error) {
    retirePayload();
    statusEl.dataset.kind = "error";
    statusEl.textContent = error instanceof Error ? error.message : String(error);
  }
}

function renderDurablePayload(payload: DurableViewLaunchPayload): void {
  const previous = currentPayload;
  const sameLaunch =
    previous?.schemaVersion === "agentstate.durable-view-launch.v1" &&
    previous.launch.launchId === payload.launch.launchId;
  frameEpoch++;
  stopPolling();
  closeAuthorization();
  suspendedDurableLaunch = null;
  currentPayload = payload;
  if (
    previous?.schemaVersion === "agentstate.durable-view-launch.v1" &&
    !sameLaunch
  ) {
    closeDurableLaunch(previous.launch.launchId);
  }
  actionButtonsEl.replaceChildren();
  actionsEl.hidden = true;
  frame.title = payload.title;
  if (!payload.launch.authorization.authorized) {
    clearFrameDocument();
    frame.setAttribute("sandbox", "");
    frame.removeAttribute("csp");
    statusEl.dataset.kind = "ready";
    statusEl.textContent = `Waiting for local approval of "${payload.title}"…`;
    setConfirmationField("authorization-view", payload.source.viewId);
    setConfirmationField("authorization-version", payload.source.contentVersion);
    authorizationBackdrop.hidden = false;
    syncDialogState();
    window.setTimeout(() => {
      if (
        currentPayload?.schemaVersion === "agentstate.durable-view-launch.v1" &&
        currentPayload.launch.launchId === payload.launch.launchId &&
        !currentPayload.launch.authorization.authorized
      ) {
        authorizationApply.disabled = false;
      }
    }, 500);
    return;
  }
  statusEl.dataset.kind = "ready";
  statusEl.textContent = `${payload.title} · exact registered View · live bundle-read bridge`;
  frame.setAttribute("sandbox", "allow-scripts");
  frame.setAttribute("csp", ACTIVE_VIEW_CHILD_CSP);
  const sizing = createFrameSizingSession(payload.launch.launchId, frameEpoch);
  setFrameDocument(
    appendFrameSizingScript(payload.source.html, sizing),
    sizing,
    payload.source.contentType,
  );
}

function renderPayload(payload: McpViewPayload): void {
  if (payload.schemaVersion === "agentstate.durable-view-launch.v1") {
    renderDurablePayload(payload);
  } else {
    renderGeneratedPayload(payload);
  }
  syncDisplayModeButton();
}

const recoveryGuard = new RecoveryGuard();

function renderResult(result: CallToolResult): void {
  const payload = extractViewPayload(result);
  if (payload) {
    renderPayload(payload);
    return;
  }
  if (currentPayload) return;
  if (result.isError === true) {
    statusEl.dataset.kind = "error";
    statusEl.textContent =
      firstResultText(result) ?? "The AgentState server reported an error for this View.";
    clearFrameDocument();
    return;
  }
  void recoverPayload(result);
}

// Probe-established (tasks/mcp-shell-payload-without-structuredcontent): some hosts rebuild
// tool-result notifications with prose only, stripping structuredContent while PRESERVING text —
// and proxy the App's own tools/call requests faithfully. The delivered text carries an exact
// one-shot claim marker; redeem it over the app channel. No marker means fail closed: guessing
// (e.g. most-recent fallback) could hand this panel another launch's payload (PR #178 review).
async function recoverPayload(result: CallToolResult): Promise<void> {
  const claim = extractClaimId(result);
  if (!claim) {
    reportUndeliveredPayload("the delivered result carried no claim marker");
    return;
  }
  if (!recoveryGuard.tryAcquire()) {
    reportUndeliveredPayload(null);
    return;
  }
  statusEl.dataset.kind = "ready";
  statusEl.textContent = "Recovering the View payload over the app channel…";
  try {
    const response = await app.callServerTool({
      name: "resolve_launch",
      arguments: { claim },
    });
    if (currentPayload) return;
    const payload = extractViewPayload(response);
    if (payload) {
      renderPayload(payload);
      return;
    }
    reportUndeliveredPayload(firstResultText(response));
  } catch (error) {
    reportUndeliveredPayload(error instanceof Error ? error.message : String(error));
  }
}

function reportUndeliveredPayload(detail: string | null): void {
  if (currentPayload) return;
  statusEl.dataset.kind = "error";
  statusEl.textContent = detail
    ? `This host delivered the tool result without its structured View payload, and recovery failed: ${detail}`
    : "This host delivered the tool result without its structured View payload, and recovery over the app channel was unavailable.";
  clearFrameDocument();
}

function durablePayloadFor(
  launchId: string,
  epoch: number,
): DurableViewLaunchPayload | null {
  const payload = currentPayload;
  return (
    mayForwardDurableActivity({
      operationEpoch: epoch,
      currentEpoch: frameEpoch,
      visibilityState: document.visibilityState,
      suspendedLaunchId: suspendedDurableLaunch,
    }) &&
    payload?.schemaVersion === "agentstate.durable-view-launch.v1" &&
    payload.launch.launchId === launchId &&
    payload.launch.authorization.authorized
  )
    ? payload
    : null;
}

function scheduleDurablePoll(launchId: string, epoch: number): void {
  if (!durablePayloadFor(launchId, epoch) || pollTimer !== null) return;
  pollTimer = window.setTimeout(() => {
    pollTimer = null;
    void pollDurableView(launchId, epoch);
  }, 1_000);
}

async function pollDurableView(launchId: string, epoch: number): Promise<void> {
  if (!durablePayloadFor(launchId, epoch)) return;
  try {
    const response = await app.callServerTool({
      name: "poll_durable_view",
      arguments: {
        launchId,
        ...(pollAcknowledgement
          ? { acknowledgeGeneration: pollAcknowledgement }
          : {}),
      },
    });
    if (!durablePayloadFor(launchId, epoch)) return;
    const poll = structuredResult(response)?.poll;
    if (!isRecord(poll) || typeof poll.status !== "string") {
      throw new Error("The durable View poll returned an invalid result.");
    }
    pollAcknowledgement = undefined;
    if (poll.status === "change") {
      if (
        typeof poll.generation !== "string" ||
        !isRecord(poll.message)
      ) {
        throw new Error("The durable View poll returned an invalid change.");
      }
      frame.contentWindow?.postMessage(poll.message, "*");
      pollAcknowledgement = poll.generation;
    } else if (poll.status === "reload-required") {
      const message =
        typeof poll.message === "string"
          ? poll.message
          : "the durable View lost continuity";
      retirePayload();
      statusEl.dataset.kind = "error";
      statusEl.textContent = `Reopen this View: ${message}`;
      return;
    } else if (poll.status !== "unchanged") {
      throw new Error(`Unsupported durable View poll status '${poll.status}'.`);
    }
    scheduleDurablePoll(launchId, epoch);
  } catch (error) {
    if (!durablePayloadFor(launchId, epoch)) return;
    retirePayload();
    statusEl.dataset.kind = "error";
    statusEl.textContent = `Reopen this View: ${error instanceof Error ? error.message : String(error)}`;
  }
}

function bridgeError(request: unknown, message: string): Record<string, unknown> | null {
  if (!isRecord(request) || typeof request.id !== "string") return null;
  return {
    bridge: typeof request.bridge === "string" ? request.bridge : "v0",
    id: request.id,
    type: "error",
    error: { code: "UNSUPPORTED", message },
  };
}

async function forwardDurableBridgeMessage(
  launchId: string,
  epoch: number,
  request: unknown,
): Promise<void> {
  try {
    const response = await app.callServerTool({
      name: "durable_view_bridge",
      arguments: { launchId, request },
    });
    if (!durablePayloadFor(launchId, epoch)) return;
    const outcome = structuredResult(response)?.outcome;
    if (!isRecord(outcome)) throw new Error("The durable View bridge returned an invalid outcome.");
    if (isRecord(outcome.reply)) {
      frame.contentWindow?.postMessage(outcome.reply, "*");
    }
    if (outcome.openPageId !== undefined) {
      const reply = bridgeError(
        request,
        "registered View navigation is not part of the read-only MCP proof",
      );
      if (reply) frame.contentWindow?.postMessage(reply, "*");
    }
    if (outcome.subscribed === true) scheduleDurablePoll(launchId, epoch);
  } catch (error) {
    if (!durablePayloadFor(launchId, epoch)) return;
    const reply = bridgeError(
      request,
      error instanceof Error ? error.message : String(error),
    );
    if (reply) frame.contentWindow?.postMessage(reply, "*");
  }
}

async function authorizeDurableView(): Promise<void> {
  const payload = currentPayload;
  if (
    payload?.schemaVersion !== "agentstate.durable-view-launch.v1" ||
    payload.launch.authorization.authorized ||
    authorizationApply.disabled
  ) {
    return;
  }
  const launchId = payload.launch.launchId;
  authorizationApply.disabled = true;
  authorizationCancel.disabled = true;
  statusEl.dataset.kind = "working";
  statusEl.textContent = "Verifying and recording approval for these exact View bytes…";
  try {
    const response = await app.callServerTool({
      name: "authorize_durable_view",
      arguments: { launchId },
    });
    const view = structuredResult(response)?.view;
    if (!isDurableViewPayload(view) || view.launch.launchId !== launchId) {
      throw new Error("The durable View changed or returned an invalid approved launch.");
    }
    renderDurablePayload(view);
  } catch (error) {
    retirePayload();
    statusEl.dataset.kind = "error";
    statusEl.textContent =
      error instanceof Error ? error.message : String(error);
  } finally {
    authorizationCancel.disabled = false;
  }
}

function cancelDurableAuthorization(): void {
  const payload = currentPayload;
  if (payload?.schemaVersion !== "agentstate.durable-view-launch.v1") return;
  retirePayload();
  statusEl.dataset.kind = "ready";
  statusEl.textContent = "The registered View was not authorized.";
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
    else if (structured?.view === null) retirePayload();
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
  currentHostContext = { ...(currentHostContext ?? {}), ...context };
  if (context.theme) applyDocumentTheme(context.theme);
  if (context.styles?.variables) applyHostStyleVariables(context.styles.variables);
  if (context.styles?.css?.fonts) applyHostFonts(context.styles.css.fonts);
  document.documentElement.toggleAttribute(
    "data-fixed-height",
    hasFixedHostHeight(currentHostContext.containerDimensions),
  );
  applyRequestedFrameHeight();
  syncDisplayModeButton();
}

function syncDialogState(): void {
  const open = !confirmationBackdrop.hidden || !authorizationBackdrop.hidden;
  document.body.toggleAttribute("data-dialog-open", open);
  if (!open) applyRequestedFrameHeight();
}

function shellChromeHeight(): number {
  return measureShellChromeHeight(
    shell.getBoundingClientRect().height,
    frame.getBoundingClientRect().height,
  );
}

function applyRequestedFrameHeight(): void {
  if (hasFixedHostHeight(currentHostContext?.containerDimensions)) {
    frame.style.removeProperty("height");
    return;
  }
  if (
    requestedFrameHeight === null ||
    document.body.hasAttribute("data-dialog-open")
  ) {
    return;
  }
  const chromeHeight = shellChromeHeight();
  const height = clampFrameHeight(requestedFrameHeight, {
    hostHeightLimit: flexibleHostHeightLimit(
      currentHostContext?.containerDimensions,
    ),
    shellChromeHeight: chromeHeight,
  });
  if (frame.style.height !== `${height}px`) {
    frame.style.height = `${height}px`;
  }
}

function requestedDisplayMode(): "inline" | "fullscreen" | null {
  if (!currentPayload) return null;
  const current = currentHostContext?.displayMode ?? "inline";
  const target = current === "fullscreen" ? "inline" : "fullscreen";
  return currentHostContext?.availableDisplayModes?.includes(target)
    ? target
    : null;
}

function syncDisplayModeButton(): void {
  const target = requestedDisplayMode();
  displayModeButton.hidden = target === null;
  if (target) {
    displayModeButton.textContent =
      target === "fullscreen" ? "Expand" : "Return inline";
  }
}

async function changeDisplayMode(): Promise<void> {
  const target = requestedDisplayMode();
  if (!target) return;
  displayModeButton.disabled = true;
  try {
    const result = await app.requestDisplayMode({ mode: target });
    if (currentHostContext) {
      currentHostContext = {
        ...currentHostContext,
        displayMode: result.mode,
      };
    }
    syncDisplayModeButton();
  } catch (error) {
    statusEl.dataset.kind = "error";
    statusEl.textContent =
      error instanceof Error
        ? `This host could not change the View display mode: ${error.message}`
        : "This host could not change the View display mode.";
  } finally {
    displayModeButton.disabled = false;
  }
}

confirmationApply.addEventListener("click", () => void finishAction("commit"));
confirmationCancel.addEventListener("click", () => void finishAction("cancel"));
authorizationApply.addEventListener("click", () => void authorizeDurableView());
authorizationCancel.addEventListener("click", cancelDurableAuthorization);
displayModeButton.addEventListener("click", () => void changeDisplayMode());

frame.addEventListener("load", () => {
  if (frameLoadGuard.accept()) return;
  const payload = currentPayload;
  if (
    payload?.schemaVersion !== "agentstate.durable-view-launch.v1" ||
    !payload.launch.authorization.authorized
  ) {
    return;
  }
  retirePayload();
  statusEl.dataset.kind = "error";
  statusEl.textContent =
    "This View navigated away from its approved document, so AgentState closed the launch. Reopen it to continue.";
});

window.addEventListener("message", (event) => {
  const payload = currentPayload;
  if (!payload) return;
  if (frameSizingSession) {
    const sizing = readFrameSizeEvent(
      event.data,
      event.source,
      frame.contentWindow,
      frameSizingSession,
      frameEpoch,
    );
    if (sizing.kind !== "other") {
      if (sizing.kind === "accepted") {
        requestedFrameHeight = sizing.height;
        applyRequestedFrameHeight();
      }
      return;
    }
  }
  if (
    document.visibilityState === "hidden" ||
    event.source !== frame.contentWindow ||
    payload.schemaVersion !== "agentstate.durable-view-launch.v1" ||
    !payload.launch.authorization.authorized
  ) {
    return;
  }
  void forwardDurableBridgeMessage(
    payload.launch.launchId,
    frameEpoch,
    event.data,
  );
});

document.addEventListener("visibilitychange", () => {
  const payload = currentPayload;
  if (
    document.visibilityState === "hidden" &&
    payload?.schemaVersion === "agentstate.durable-view-launch.v1" &&
    payload.launch.authorization.authorized
  ) {
    suspendedDurableLaunch = payload.launch.launchId;
    frameEpoch++;
    resetFrameSizing();
    stopPolling();
    return;
  }
  if (
    document.visibilityState === "visible" &&
    payload?.schemaVersion === "agentstate.durable-view-launch.v1" &&
    suspendedDurableLaunch === payload.launch.launchId
  ) {
    suspendedDurableLaunch = null;
    retirePayload();
    statusEl.dataset.kind = "error";
    statusEl.textContent =
      "Reopen this View after suspension so AgentState can establish a fresh subscription baseline.";
  }
});

void (async () => {
  app = new App(
    { name: "AgentState View Host", version: "0.0.1" },
    { availableDisplayModes: ["inline", "fullscreen"] },
  );
  app.ontoolresult = renderResult;
  app.onhostcontextchanged = applyHostContext;
  app.onteardown = async () => {
    closeConfirmation();
    retirePayload();
    return {};
  };
  await app.connect();
  const context = app.getHostContext();
  if (context) applyHostContext(context);
})();
