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
      authorization: { required: true, authorized },
    },
  };
}

let displayMode: DisplayMode = "inline";
let nextLaunch = 1;
let releaseDisplayRequest: (() => void) | null = null;
let releaseResumeRequest: (() => void) | null = null;
let releaseCloseRequest: (() => void) | null = null;

window.__displayRequests = [];
window.__resumeRequests = [];
window.__closedLaunches = [];
window.__holdDisplayRequest = false;
window.__holdResumeRequest = false;
window.__holdCloseRequest = false;
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
      structuredContent: { view: payload(launchId, true) },
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
    __displayRequestError: string | null;
    __displayResponseMode: DisplayMode | null;
    __displayRequests: string[];
    __resumeRequests: string[];
    __holdCloseRequest: boolean;
    __holdDisplayRequest: boolean;
    __holdResumeRequest: boolean;
    __hostInitialized?: boolean;
    __suppressDisplayContextOnResolve: boolean;
    __teardownSettled: boolean;
    __emitDisplayMode: (mode: DisplayMode) => void;
    __replayOriginalResult: () => Promise<void>;
    __releaseCloseRequest: () => void;
    __releaseDisplayRequest: () => void;
    __releaseResumeRequest: () => void;
    __startTeardown: () => void;
  }
}
