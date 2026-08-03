import {
  AppBridge,
  PostMessageTransport,
} from "@modelcontextprotocol/ext-apps/app-bridge";

type DisplayMode = "inline" | "fullscreen";

interface DurablePayload {
  schemaVersion: "agentstate.durable-view-launch.v1";
  title: string;
  source: {
    viewId: string;
    entry: string;
    html: string;
    contentType: string;
    contentVersion: string;
  };
  launch: {
    launchId: string;
    access: "bundle-read" | "bundle-propose";
    authorization: {
      required: boolean;
      authorized: boolean;
    };
  };
}

interface TransientPayload {
  schemaVersion: "agentstate.transient-view-launch.v1";
  title: string;
  source: {
    kind: "transient";
    html: string;
    contentType: string;
    contentVersion: string;
  };
  launch: {
    launchId: string;
    access: "bundle-read" | "bundle-propose";
    authorization: {
      required: boolean;
      authorized: boolean;
    };
  };
}

const appFrame = document.querySelector<HTMLIFrameElement>("#app");
if (!appFrame?.contentWindow) throw new Error("Missing MCP App frame.");

const source = {
  viewId: "pages-registry/roadmap",
  entry: "pages/roadmap.html",
  html: `<!doctype html><html><head><style>
    html, body { margin: 0; }
    main { min-height: 1200px; }
  </style></head><body><main><button id="inside">Roadmap control</button></main></body></html>`,
  contentType: "text/html; charset=utf-8",
  contentVersion: `sha256:${"1".repeat(64)}`,
};

function payload(launchId: string, authorized: boolean): DurablePayload {
  return {
    schemaVersion: "agentstate.durable-view-launch.v1",
    title: "Roadmap",
    source,
    launch: {
    launchId,
      access: "bundle-read",
      authorization: { required: true, authorized },
    },
  };
}

function transientPayload(launchId: string): TransientPayload {
  return {
    schemaVersion: "agentstate.transient-view-launch.v1",
    title: "Agent-authored task summary",
    source: {
      kind: "transient",
      html: source.html,
      contentType: source.contentType,
      contentVersion: `sha256:${"2".repeat(64)}`,
    },
    launch: {
      launchId,
      access: "bundle-read",
      authorization: { required: true, authorized: false },
    },
  };
}

function actionPayload(authorized: boolean): TransientPayload {
  return {
    schemaVersion: "agentstate.transient-view-launch.v1",
    title: "Task action",
    source: {
      kind: "transient",
      html: `<!doctype html><button id="propose">Mark complete</button><output id="result"></output><script>
        document.querySelector('#propose').addEventListener('click', () => parent.postMessage({
          bridge: 'v1', type: 'action.propose', requestId: 'action-1',
          action: { kind: 'document.set-field', docId: 'tasks/alpha', field: 'status', value: 'done', expectedVersion: 'sha256:target' }
        }, '*'));
        addEventListener('message', (event) => {
          if (event.data?.bridge === 'v1' && event.data?.type === 'action.result') {
            document.querySelector('#result').textContent = event.data.result?.status ?? 'invalid';
          }
        });
      </script>`,
      contentType: source.contentType,
      contentVersion: `sha256:${"3".repeat(64)}`,
    },
    launch: {
      launchId: "launch-action",
      access: "bundle-propose",
      authorization: { required: true, authorized },
    },
  };
}

let displayMode: DisplayMode = "inline";
let nextLaunch = 1;
let releaseDisplayRequest: (() => void) | null = null;
let releaseResumeRequest: (() => void) | null = null;
let releaseCloseRequest: (() => void) | null = null;
let releaseFinishRequest: (() => void) | null = null;

window.__displayRequests = [];
window.__resumeRequests = [];
window.__closedLaunches = [];
window.__preparedActions = [];
window.__finishedActions = [];
window.__holdDisplayRequest = false;
window.__holdResumeRequest = false;
window.__holdCloseRequest = false;
window.__holdFinishRequest = false;
window.__displayResponseMode = null;
window.__displayRequestError = null;
window.__suppressDisplayContextOnResolve = false;
window.__teardownSettled = false;
window.__releaseDisplayRequest = () => {
  releaseDisplayRequest?.();
  releaseDisplayRequest = null;
};
window.__releaseResumeRequest = () => {
  releaseResumeRequest?.();
  releaseResumeRequest = null;
};
window.__releaseCloseRequest = () => {
  releaseCloseRequest?.();
  releaseCloseRequest = null;
};
window.__releaseFinishRequest = () => {
  releaseFinishRequest?.();
  releaseFinishRequest = null;
};

const context = () => ({
  displayMode,
  availableDisplayModes: ["inline", "fullscreen"] as DisplayMode[],
  containerDimensions: { width: 640, height: 288 },
});

const bridge = new AppBridge(
  null,
  { name: "AgentState lifecycle test host", version: "1.0.0" },
  { serverTools: {} },
  { hostContext: context() },
);
window.__emitDisplayMode = (mode) => {
  displayMode = mode;
  bridge.setHostContext(context());
};
window.__replayOriginalResult = async () => {
  await bridge.sendToolResult({
    content: [{ type: "text", text: "Roadmap replay" }],
    structuredContent: payload("launch-inline", true),
  });
};
window.__showTransientResult = async () => {
  await bridge.sendToolResult({
    content: [{ type: "text", text: "Transient View ready" }],
    structuredContent: transientPayload("launch-transient"),
  });
};
window.__showActionResult = async () => {
  await bridge.sendToolResult({
    content: [{ type: "text", text: "Action View ready" }],
    structuredContent: actionPayload(false),
  });
};
window.__startTeardown = () => {
  window.__teardownSettled = false;
  void bridge.teardownResource({}).then(() => {
    window.__teardownSettled = true;
  });
};

bridge.oncalltool = async ({ name, arguments: args }) => {
  const launchId =
    typeof args?.launchId === "string" ? args.launchId : "invalid-launch";
  if (name === "authorize_durable_view") {
    return {
      content: [{ type: "text", text: "authorized" }],
      structuredContent: {
        view: launchId === "launch-action" ? actionPayload(true) : payload(launchId, true),
      },
    };
  }
  if (name === "resume_durable_view") {
    window.__resumeRequests.push(launchId);
    if (window.__holdResumeRequest) {
      await new Promise<void>((resolve) => {
        releaseResumeRequest = resolve;
      });
    }
    return {
      content: [{ type: "text", text: "resumed" }],
      structuredContent: {
        view: payload(`launch-resumed-${nextLaunch++}`, true),
      },
    };
  }
  if (name === "close_durable_view") {
    window.__closedLaunches.push(launchId);
    if (window.__holdCloseRequest) {
      await new Promise<void>((resolve) => {
        releaseCloseRequest = resolve;
      });
    }
    return {
      content: [{ type: "text", text: "closed" }],
      structuredContent: { closed: true },
    };
  }
  if (name === "durable_view_bridge") {
    return {
      content: [{ type: "text", text: "bridge" }],
      structuredContent: {
        outcome: {
          reply: {
            bridge: "v0",
            id: "test",
            type: "result",
            result: { ok: true },
          },
        },
      },
    };
  }
  if (name === "poll_durable_view") {
    return {
      content: [{ type: "text", text: "unchanged" }],
      structuredContent: { poll: { status: "unchanged" } },
    };
  }
  if (name === "prepare_view_action") {
    window.__preparedActions.push(args ?? {});
    return {
      content: [{ type: "text", text: "prepared" }],
      structuredContent: {
        result: {
          status: "prepared",
          approvalToken: "approval-1",
          expiresAt: Date.now() + 60_000,
          confirmation: {
            source: {
              kind: "transient",
              id: "transient:sha256:source",
              title: "Task action",
              version: "sha256:source",
              contentVersion: "sha256:source",
            },
            target: { docId: "tasks/alpha", title: "Alpha", kind: "Task", version: "sha256:target" },
            field: "status",
            before: "todo",
            after: "done",
            actor: "openai/codex",
            timestamp: "2026-08-02T12:00:00.000Z",
          },
        },
      },
    };
  }
  if (name === "finish_view_action") {
    window.__finishedActions.push(args ?? {});
    if (window.__holdFinishRequest) {
      await new Promise<void>((resolve) => {
        releaseFinishRequest = resolve;
      });
    }
    return {
      content: [{ type: "text", text: "committed" }],
      structuredContent: {
        result: {
          status: args?.decision === "commit" ? "committed" : "cancelled",
          action: "document.set-field",
          docId: "tasks/alpha",
          field: "status",
          changed: args?.decision === "commit",
          confirmed: args?.decision === "commit",
        },
      },
    };
  }
  throw new Error(`Unexpected App tool '${name}'.`);
};

bridge.onrequestdisplaymode = async ({ mode }) => {
  window.__displayRequests.push(mode);
  if (window.__holdDisplayRequest) {
    await new Promise<void>((resolve) => {
      releaseDisplayRequest = resolve;
    });
  }
  if (window.__displayRequestError) {
    throw new Error(window.__displayRequestError);
  }
  const resolvedMode =
    window.__displayResponseMode ??
    (mode === "fullscreen" ? "fullscreen" : "inline");
  if (!window.__suppressDisplayContextOnResolve) {
    displayMode = resolvedMode;
    bridge.setHostContext(context());
  }
  return { mode: resolvedMode };
};

bridge.oninitialized = () => {
  void (async () => {
    await bridge.sendToolInput({
      arguments: { viewId: "pages-registry/roadmap" },
    });
    await bridge.sendToolResult({
      content: [{ type: "text", text: "Roadmap ready" }],
      structuredContent: payload("launch-inline", false),
    });
    window.__hostInitialized = true;
  })();
};

void bridge.connect(
  new PostMessageTransport(appFrame.contentWindow, appFrame.contentWindow),
);

declare global {
  interface Window {
    __closedLaunches: string[];
    __preparedActions: unknown[];
    __finishedActions: unknown[];
    __displayRequestError: string | null;
    __displayResponseMode: DisplayMode | null;
    __displayRequests: string[];
    __resumeRequests: string[];
    __holdCloseRequest: boolean;
    __holdFinishRequest: boolean;
    __holdDisplayRequest: boolean;
    __holdResumeRequest: boolean;
    __hostInitialized?: boolean;
    __suppressDisplayContextOnResolve: boolean;
    __teardownSettled: boolean;
    __emitDisplayMode: (mode: DisplayMode) => void;
    __replayOriginalResult: () => Promise<void>;
    __releaseCloseRequest: () => void;
    __releaseFinishRequest: () => void;
    __releaseDisplayRequest: () => void;
    __releaseResumeRequest: () => void;
    __startTeardown: () => void;
    __showTransientResult: () => Promise<void>;
    __showActionResult: () => Promise<void>;
  }
}
