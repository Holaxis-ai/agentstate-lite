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
  TrustedActionService,
  type ActionTerminalResult,
} from "@agentstate-lite/view-runtime";
import { z } from "zod";
import type {
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

const inputSchema = z
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

const outputSchema = z.object({
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

async function resolveShowViewInput(
  bundle: Bundle,
  rawInput: ShowViewInput,
): Promise<ResolvedShowViewInput> {
  const input: ShowViewInput = inputSchema.parse(rawInput);
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
  input: ShowViewInput,
  launches = new McpViewLaunchRegistry(),
): Promise<ViewLaunchPayload> {
  const resolvedInput = await resolveShowViewInput(bundle, input);
  return launches.mint(resolvedInput, await resolveViewContent(bundle, resolvedInput));
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

function fallbackText(payload: ViewLaunchPayload): string {
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
}

export function createMcpAppServer(options: CreateMcpAppServerOptions): McpServer {
  const server = new McpServer({
    name: "AgentState Lite Conversational Views",
    version: options.version ?? "0.0.1",
  });
  const launches = new McpViewLaunchRegistry();
  const actions = new TrustedActionService(options.bundle, launches, options.actor);

  registerAppTool(
    server,
    SHOW_VIEW_TOOL_NAME,
    {
      title: "Show AgentState View",
      description:
        "Render agent-authored HTML over current authoritative AgentState snapshots selected by exact IDs or one bounded launch-time query. Optional document.set-field declarations become trusted-shell controls; generated HTML remains read-only and every write requires human confirmation.",
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
        const payload = await resolveViewLaunch(options.bundle, input, launches);
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
                // The generated document is a sandboxed srcdoc child, so it needs no frame origin.
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
