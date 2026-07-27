import {
  applyQuerySelectionFilters,
  assertSafeConceptId,
  loadKinds,
  queryHeads,
  readDocVersioned,
  versionOfBytes,
  type Bundle,
} from "@agentstate-lite/core";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import {
  BridgeService,
  PageBridgeLaunchAuthority,
  PageLaunchRegistry,
  SessionViewAuthorizationStore,
  TrustedActionService,
  launchIsCurrent,
  mintActiveViewLaunch,
  pageLaunchAuthorizationSubject,
  type ActionTerminalResult,
  type PageLaunch,
  type ViewAuthorizationStore,
} from "@agentstate-lite/view-runtime";
import { z } from "zod";
import type {
  DurableShowViewInput,
  DurableViewLaunchPayload,
  GeneratedShowViewInput,
  McpViewPayload,
  ResolvedViewContent,
  ResolvedShowViewInput,
  ShowViewInput,
  ViewLaunchPayload,
  ViewObjectSnapshot,
} from "./contract.js";
import { MCP_VIEW_HTML } from "./generated/view-html.generated.js";
import { McpViewLaunchRegistry } from "./launches.js";

export const MCP_VIEW_RESOURCE_URI = "ui://agentstate/view-host/v1.html";
export const SHOW_VIEW_TOOL_NAME = "show_view";
export const PREPARE_VIEW_ACTION_TOOL_NAME = "prepare_view_action";
export const FINISH_VIEW_ACTION_TOOL_NAME = "finish_view_action";
export const AUTHORIZE_DURABLE_VIEW_TOOL_NAME = "authorize_durable_view";
export const DURABLE_VIEW_BRIDGE_TOOL_NAME = "durable_view_bridge";
export const POLL_DURABLE_VIEW_TOOL_NAME = "poll_durable_view";
export const CLOSE_DURABLE_VIEW_TOOL_NAME = "close_durable_view";
export const MAX_VIEW_PRESENTATION_BYTES = 256 * 1024;
export const MAX_VIEW_OBJECTS = 20;
export const MAX_VIEW_ACTIONS = 8;
export const MAX_VIEW_DATA_BYTES = 1024 * 1024;

const actionScalarSchema = z.union([z.string().max(4096), z.number().finite(), z.boolean()]);
const fieldSelectionSchema = z
  .string()
  .trim()
  .min(3)
  .max(1024)
  .refine((value) => {
    const eq = value.indexOf("=");
    if (eq <= 0 || !value.slice(0, eq).trim()) return false;
    const members = value
      .slice(eq + 1)
      .split(",")
      .map((member) => member.trim());
    return members.length > 0 && members.every(Boolean);
  }, "field must be '<name>=<value>[,<value>...]' with no empty members");
const querySelectionSchema = z
  .object({
    type: z.string().trim().min(1).max(256).optional(),
    prefix: z.string().trim().min(1).max(512).optional(),
    field: fieldSelectionSchema.optional(),
    open: z.boolean().optional(),
    limit: z
      .number()
      .refine(
        (value) => Number.isInteger(value) && value >= 1 && value <= MAX_VIEW_OBJECTS,
        `query limit must be an integer between 1 and ${MAX_VIEW_OBJECTS}`,
      )
      .optional(),
  })
  .strict()
  .refine(
    (query) => Boolean(query.type || query.prefix || query.field || query.open === true),
    "query must declare at least one of type, prefix, field, or open:true",
  );
const generatedActionSchema = z
  .object({
    kind: z.literal("document.set-field"),
    label: z.string().trim().min(1).max(80),
    objectId: z.string().trim().min(1).max(512),
    field: z.string().trim().min(1).max(128),
    value: actionScalarSchema,
  })
  .strict();

const generatedInputSchema = z
  .object({
    title: z.string().trim().min(1).max(120).describe("Short human-facing title for this generated View."),
    html: z
      .string()
      .min(1)
      .describe(
        "Script- and style-free HTML fragment. Insert authoritative scalar values with data-aslite-text=\"objects.<index>.id|version|body|frontmatter.<field>\"; render a selected document body with data-aslite-markdown=\"objects.<index>.body\". Active elements and navigation attributes are removed by the trusted shell.",
      ),
    css: z
      .string()
      .optional()
      .describe("Optional CSS for the generated fragment. External resource loads are blocked."),
    objectIds: z
      .array(z.string().trim().min(1).max(512))
      .min(1)
      .max(MAX_VIEW_OBJECTS)
      .refine((ids) => new Set(ids).size === ids.length, "objectIds must not contain duplicates")
      .optional()
      .describe(
        "Exact AgentState document IDs to expose. Pass either objectIds or query, never both.",
      ),
    query: querySelectionSchema
      .optional()
      .describe(
        `Bounded launch-time selection using the same type/prefix/field/open semantics as bundle Views. Results are id-sorted, capped at ${MAX_VIEW_OBJECTS}, and frozen as exact versioned snapshots for this launch. Pass either query or objectIds, never both.`,
      ),
    actions: z
      .array(generatedActionSchema)
      .max(MAX_VIEW_ACTIONS)
      .optional()
      .describe(
        "Optional governed scalar actions rendered by the trusted shell. Every objectId must already be selected; generated HTML remains read-only.",
      ),
  })
  .strict()
  .refine(
    (input) => (input.objectIds === undefined) !== (input.query === undefined),
    "pass exactly one selection mode: objectIds or query",
  );

const durableInputSchema = z
  .object({
    viewId: z
      .string()
      .trim()
      .min(1)
      .max(512)
      .describe(
        "Exact ID of an existing registered bundle View to run unchanged through the shared read-only bridge.",
      ),
  })
  .strict();

const inputSchema = z
  .object({
    viewId: durableInputSchema.shape.viewId.optional(),
    title: generatedInputSchema.shape.title.optional(),
    html: generatedInputSchema.shape.html.optional(),
    css: generatedInputSchema.shape.css,
    objectIds: generatedInputSchema.shape.objectIds,
    query: generatedInputSchema.shape.query,
    actions: generatedInputSchema.shape.actions,
  })
  .strict()
  .describe(
    "Pass exactly viewId for a registered durable View, or title/html plus exactly one generated selection mode.",
  );

const generatedOutputSchema = z.object({
  schemaVersion: z.literal("agentstate.view-launch.v1"),
  title: z.string(),
  presentation: z.object({ html: z.string(), css: z.string(), contentHash: z.string() }),
  selection: z.object({
    objectIds: z.array(z.string()),
    query: querySelectionSchema.optional(),
    matchedCount: z.number().int().nonnegative().optional(),
  }),
  objects: z.array(
    z.object({
      id: z.string(),
      version: z.string(),
      frontmatter: z.record(z.string(), z.unknown()),
      body: z.string(),
    }),
  ),
  launch: z.object({
    launchId: z.string(),
    actions: z.array(
      z.object({
        actionId: z.string(),
        label: z.string(),
        targetId: z.string(),
      }),
    ),
  }),
});

const durableOutputSchema = z.object({
  schemaVersion: z.literal("agentstate.durable-view-launch.v1"),
  title: z.string(),
  source: z.object({
    viewId: z.string(),
    entry: z.string(),
    html: z.string(),
    contentType: z.string(),
    contentVersion: z.string(),
  }),
  launch: z.object({
    launchId: z.string(),
    authorization: z.object({
      required: z.boolean(),
      authorized: z.boolean(),
    }),
  }),
});

const outputSchema = z.object({
  schemaVersion: z.string(),
  title: z.string(),
  presentation: generatedOutputSchema.shape.presentation.optional(),
  selection: generatedOutputSchema.shape.selection.optional(),
  objects: generatedOutputSchema.shape.objects.optional(),
  source: durableOutputSchema.shape.source.optional(),
  launch: z.object({
    launchId: z.string(),
    actions: generatedOutputSchema.shape.launch.shape.actions.optional(),
    authorization: durableOutputSchema.shape.launch.shape.authorization.optional(),
  }),
});

function parseShowViewInput(input: unknown): ShowViewInput {
  const outer = inputSchema.parse(input);
  if (outer.viewId !== undefined) return durableInputSchema.parse(outer);
  return generatedInputSchema.parse(outer);
}

async function resolveShowViewInput(
  bundle: Bundle,
  rawInput: GeneratedShowViewInput,
): Promise<ResolvedShowViewInput> {
  const input: GeneratedShowViewInput = generatedInputSchema.parse(rawInput);
  if (input.objectIds) {
    const objectIds = input.objectIds;
    for (const id of objectIds) assertSafeConceptId(id);
    return { ...input, objectIds: [...objectIds], query: undefined };
  }

  const query = input.query!;
  const rows = await queryHeads(bundle, { type: query.type, prefix: query.prefix });
  const registry = query.open ? await loadKinds(bundle) : undefined;
  const selected = applyQuerySelectionFilters(
    rows,
    { ...query, limit: query.limit ?? MAX_VIEW_OBJECTS },
    registry ? [...registry.kinds.values()] : [],
  );
  if (selected.rows.length === 0) {
    throw new Error("query matched no AgentState documents");
  }
  return {
    ...input,
    objectIds: selected.rows.map((row) => row.id),
    query,
    matchedCount: selected.count,
  };
}

async function resolveViewContent(
  bundle: Bundle,
  input: ResolvedShowViewInput,
): Promise<ResolvedViewContent> {
  const css = input.css ?? "";
  const presentationBytes = Buffer.byteLength(input.html, "utf8") + Buffer.byteLength(css, "utf8");
  if (presentationBytes > MAX_VIEW_PRESENTATION_BYTES) {
    throw new Error(
      `generated HTML/CSS is ${presentationBytes} bytes; the experimental limit is ${MAX_VIEW_PRESENTATION_BYTES}`,
    );
  }
  const objects = await Promise.all(
    input.objectIds.map(async (id): Promise<ViewObjectSnapshot> => {
      const { doc, version } = await readDocVersioned(bundle, id);
      return {
        id: doc.id,
        version,
        frontmatter: doc.frontmatter,
        body: doc.body,
      };
    }),
  );
  const dataBytes = Buffer.byteLength(JSON.stringify(objects), "utf8");
  if (dataBytes > MAX_VIEW_DATA_BYTES) {
    throw new Error(`selected object data is ${dataBytes} bytes; the experimental limit is ${MAX_VIEW_DATA_BYTES}`);
  }
  return {
    schemaVersion: "agentstate.view-launch.v1",
    title: input.title,
    presentation: {
      html: input.html,
      css,
      contentHash: versionOfBytes(JSON.stringify({ html: input.html, css })),
    },
    selection: {
      objectIds: [...input.objectIds],
      ...(input.query ? { query: { ...input.query }, matchedCount: input.matchedCount } : {}),
    },
    objects,
  };
}

export async function resolveViewLaunch(
  bundle: Bundle,
  input: GeneratedShowViewInput,
  launches = new McpViewLaunchRegistry(),
): Promise<ViewLaunchPayload> {
  const resolvedInput = await resolveShowViewInput(bundle, input);
  return launches.mint(resolvedInput, await resolveViewContent(bundle, resolvedInput));
}

function durablePayload(
  launch: PageLaunch,
  authorized: boolean,
): DurableViewLaunchPayload {
  return {
    schemaVersion: "agentstate.durable-view-launch.v1",
    title: launch.registryTitle,
    source: {
      viewId: launch.registryId,
      entry: launch.entryKey,
      html: new TextDecoder("utf-8", { fatal: true }).decode(launch.bytes),
      contentType: launch.contentType,
      contentVersion: launch.contentVersion,
    },
    launch: {
      launchId: launch.launchId,
      authorization: {
        required: launch.capability !== "none",
        authorized,
      },
    },
  };
}

export async function resolveDurableViewLaunch(
  bundle: Bundle,
  input: DurableShowViewInput,
  launches = new PageLaunchRegistry(),
  authorizations: ViewAuthorizationStore = new SessionViewAuthorizationStore(),
): Promise<DurableViewLaunchPayload> {
  const parsed = durableInputSchema.parse(input);
  const launch = await mintActiveViewLaunch(bundle, launches, parsed.viewId);
  if (launch.capability !== "bundle-read") {
    launches.revoke(launch.launchId);
    throw new Error(
      `View '${parsed.viewId}' declares '${launch.capability}' access; the durable MCP proof accepts bundle-read Views only`,
    );
  }
  return durablePayload(
    launch,
    await authorizations.isAuthorized(pageLaunchAuthorizationSubject(launch)),
  );
}

async function refreshViewLaunch(
  bundle: Bundle,
  launches: McpViewLaunchRegistry,
  launchId: string,
): Promise<ViewLaunchPayload | null> {
  const input = launches.input(launchId);
  if (!input) return null;
  try {
    return launches.refresh(launchId, await resolveViewContent(bundle, input));
  } catch {
    // The action result is authoritative even when a selected sibling vanished afterward.
    // Retire the incomplete launch instead of replacing a commit/conflict receipt with refresh noise.
    launches.revoke(launchId);
    return null;
  }
}

function fallbackText(payload: McpViewPayload): string {
  if (payload.schemaVersion === "agentstate.durable-view-launch.v1") {
    return payload.launch.authorization.authorized
      ? `Prepared registered AgentState View "${payload.title}" (${payload.source.viewId}) from its exact current bundle bytes.`
      : `Registered AgentState View "${payload.title}" (${payload.source.viewId}) is ready for local approval of its exact current bytes before it can read bundle data.`;
  }
  const rows = payload.objects.map((object) => {
    const title =
      typeof object.frontmatter.title === "string" && object.frontmatter.title.trim()
        ? object.frontmatter.title.trim()
        : object.id;
    const type = typeof object.frontmatter.type === "string" ? object.frontmatter.type : "Document";
    return `- ${title} (${type}, ${object.id})`;
  });
  return [`Prepared interactive View "${payload.title}" over ${payload.objects.length} current AgentState object(s):`, ...rows].join("\n");
}

export interface CreateMcpAppServerOptions {
  bundle: Bundle;
  version?: string;
  actor?: string;
  bundleName?: string;
  viewAuthorization?: ViewAuthorizationStore;
}

export function createMcpAppServer(options: CreateMcpAppServerOptions): McpServer {
  const server = new McpServer({
    name: "AgentState Lite Conversational Views",
    version: options.version ?? "0.0.1",
  });
  const launches = new McpViewLaunchRegistry();
  const actions = new TrustedActionService(options.bundle, launches, options.actor);
  const durableLaunches = new PageLaunchRegistry();
  const durableAuthorizations =
    options.viewAuthorization ?? new SessionViewAuthorizationStore();
  const durableBridge = new BridgeService({
    bundle: options.bundle,
    launches: new PageBridgeLaunchAuthority(
      options.bundle,
      durableLaunches,
      durableAuthorizations,
    ),
    config: async () => ({
      root: null,
      name: options.bundleName ?? "AgentState bundle",
      mode: "local-mcp",
    }),
    allowActionProtocol: false,
    enablePolling: true,
  });

  registerAppTool(
    server,
    SHOW_VIEW_TOOL_NAME,
    {
      title: "Show AgentState View",
      description:
        "Render either agent-authored script-free HTML over current authoritative AgentState snapshots, or one existing registered bundle View by exact viewId. A registered View runs from its unchanged current bytes through the shared read-only bridge and requires trusted-shell approval before bundle data is exposed.",
      inputSchema,
      outputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ui: { resourceUri: MCP_VIEW_RESOURCE_URI, visibility: ["model"] } },
    },
    async (input): Promise<CallToolResult> => {
      try {
        const parsed = parseShowViewInput(input);
        const payload =
          "viewId" in parsed
            ? await resolveDurableViewLaunch(
                options.bundle,
                parsed,
                durableLaunches,
                durableAuthorizations,
              )
            : await resolveViewLaunch(options.bundle, parsed, launches);
        return {
          content: [{ type: "text", text: fallbackText(payload) }],
          structuredContent: { ...payload },
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Could not render the AgentState View: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );

  registerAppTool(
    server,
    AUTHORIZE_DURABLE_VIEW_TOOL_NAME,
    {
      title: "Authorize registered AgentState View",
      description:
        "Record the trusted shell's local approval for the exact current registered View bytes and return the revalidated launch.",
      inputSchema: z
        .object({ launchId: z.string().min(1).max(128) })
        .strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId }): Promise<CallToolResult> => {
      const launch = durableLaunches.resolveLaunch(launchId);
      if (
        !launch ||
        launch.capability !== "bundle-read" ||
        !(await launchIsCurrent(options.bundle, launch))
      ) {
        if (launch) durableBridge.revoke(launch.launchId);
        return {
          isError: true,
          content: [{ type: "text", text: "The registered View changed or expired before approval." }],
        };
      }
      const subject = pageLaunchAuthorizationSubject(launch);
      await durableAuthorizations.authorize(subject);
      if (
        !(await launchIsCurrent(options.bundle, launch)) ||
        !(await durableAuthorizations.isAuthorized(subject))
      ) {
        durableBridge.revoke(launch.launchId);
        return {
          isError: true,
          content: [{ type: "text", text: "The registered View changed while approval was being recorded." }],
        };
      }
      const view = durablePayload(launch, true);
      return {
        content: [{ type: "text", text: `Approved exact current bytes for "${view.title}".` }],
        structuredContent: { view },
      };
    },
  );

  registerAppTool(
    server,
    DURABLE_VIEW_BRIDGE_TOOL_NAME,
    {
      title: "Run registered AgentState View bridge request",
      description:
        "Forward one bounded read-only bridge request from the current approved registered View.",
      inputSchema: z
        .object({
          launchId: z.string().min(1).max(128),
          request: z.unknown(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId, request }): Promise<CallToolResult> => {
      const outcome = await durableBridge.handle(launchId, request);
      return {
        content: [{ type: "text", text: "Processed one registered View bridge request." }],
        structuredContent: { outcome },
      };
    },
  );

  registerAppTool(
    server,
    POLL_DURABLE_VIEW_TOOL_NAME,
    {
      title: "Poll registered AgentState View changes",
      description:
        "Poll the server-owned subscription baseline for the current registered View.",
      inputSchema: z
        .object({
          launchId: z.string().min(1).max(128),
          acknowledgeGeneration: z.string().min(1).max(128).optional(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId, acknowledgeGeneration }): Promise<CallToolResult> => {
      const poll = await durableBridge.poll(launchId, acknowledgeGeneration);
      return {
        content: [{ type: "text", text: `Registered View poll: ${poll.status}.` }],
        structuredContent: { poll },
      };
    },
  );

  registerAppTool(
    server,
    CLOSE_DURABLE_VIEW_TOOL_NAME,
    {
      title: "Close registered AgentState View",
      description:
        "Revoke one process-local registered View launch and discard its subscription state.",
      inputSchema: z
        .object({ launchId: z.string().min(1).max(128) })
        .strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId }): Promise<CallToolResult> => {
      durableBridge.revoke(launchId);
      return {
        content: [{ type: "text", text: "Closed the registered AgentState View launch." }],
        structuredContent: { closed: true },
      };
    },
  );

  registerAppTool(
    server,
    PREPARE_VIEW_ACTION_TOOL_NAME,
    {
      title: "Prepare AgentState View action",
      description: "Prepare one trusted-shell action from the current View for explicit human confirmation.",
      inputSchema: {
        launchId: z.string().min(1).max(256),
        actionId: z.string().min(1).max(256),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId, actionId }): Promise<CallToolResult> => {
      const action = launches.action(launchId, actionId);
      const result = action
        ? await actions.prepare(launchId, action)
        : ({
            status: "rejected",
            action: "document.set-field",
            message: "the action is unknown, expired, or outside this View",
          } satisfies ActionTerminalResult);
      let view = launches.payload(launchId);
      if (result.status === "conflict") {
        view = await refreshViewLaunch(options.bundle, launches, launchId);
      }
      return {
        content: [
          {
            type: "text",
            text:
              result.status === "prepared"
                ? `Prepared a ${result.confirmation.field} change for human confirmation.`
                : `AgentState action ${result.status}: ${"message" in result && result.message ? result.message : result.status}`,
          },
        ],
        structuredContent: { result, view },
      };
    },
  );

  registerAppTool(
    server,
    FINISH_VIEW_ACTION_TOOL_NAME,
    {
      title: "Finish AgentState View action",
      description: "Commit or cancel an action after the trusted MCP App shell collects the human decision.",
      inputSchema: {
        launchId: z.string().min(1).max(256),
        approvalToken: z.string().min(1).max(256),
        decision: z.enum(["commit", "cancel"]),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId, approvalToken, decision }): Promise<CallToolResult> => {
      let result: ActionTerminalResult;
      let view: ViewLaunchPayload | null = launches.payload(launchId);
      if (!view) {
        result = {
          status: "rejected",
          action: "document.set-field",
          message: "the View is unknown or expired",
        };
      } else {
        result =
          decision === "commit"
            ? await actions.commit(approvalToken, launchId)
            : actions.cancel(approvalToken, launchId);
        if (
          decision === "commit" &&
          (result.status === "committed" ||
            result.status === "unchanged" ||
            result.status === "conflict")
        ) {
          view = await refreshViewLaunch(options.bundle, launches, launchId);
        }
      }
      return {
        content: [
          {
            type: "text",
            text:
              result.status === "committed"
                ? `Committed the confirmed ${result.field ?? "field"} change.`
                : `AgentState action ${result.status}: ${result.message ?? result.status}`,
          },
        ],
        structuredContent: { result, view },
      };
    },
  );

  registerAppResource(
    server,
    "AgentState View Host",
    MCP_VIEW_RESOURCE_URI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: "Fixed trusted shell for invocation-specific AgentState Views.",
    },
    async (): Promise<ReadResourceResult> => ({
      contents: [
        {
          uri: MCP_VIEW_RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: MCP_VIEW_HTML,
          _meta: {
            ui: {
              csp: {
                connectDomains: [],
                resourceDomains: [],
                // Invocation content stays in a sandboxed opaque-origin child. A blob URL keeps
                // registered source byte-derived and avoids a host-specific frame origin.
                frameDomains: ["blob:"],
                baseUriDomains: [],
              },
              prefersBorder: false,
            },
          },
        },
      ],
    }),
  );

  return server;
}

export async function startMcpStdioServer(options: CreateMcpAppServerOptions): Promise<void> {
  await createMcpAppServer(options).connect(new StdioServerTransport());
}
