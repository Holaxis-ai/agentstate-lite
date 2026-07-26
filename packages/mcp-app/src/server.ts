import {
  assertSafeConceptId,
  readDocVersioned,
  versionOfBytes,
  type Bundle,
  type Frontmatter,
  type Version,
} from "@agentstate-lite/core";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { MCP_VIEW_HTML } from "./generated/view-html.generated.js";

export const MCP_VIEW_RESOURCE_URI = "ui://agentstate/view-host/v0.html";
export const SHOW_VIEW_TOOL_NAME = "show_view";
export const MAX_VIEW_PRESENTATION_BYTES = 256 * 1024;
export const MAX_VIEW_OBJECTS = 20;
export const MAX_VIEW_DATA_BYTES = 1024 * 1024;

const inputSchema = {
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
    .describe("Exact AgentState document IDs to expose to this View. Select them with the normal CLI first."),
};

const outputSchema = z.object({
  schemaVersion: z.literal("agentstate.view-launch.v0"),
  title: z.string(),
  presentation: z.object({ html: z.string(), css: z.string(), contentHash: z.string() }),
  selection: z.object({ objectIds: z.array(z.string()) }),
  objects: z.array(
    z.object({
      id: z.string(),
      version: z.string(),
      frontmatter: z.record(z.string(), z.unknown()),
      body: z.string(),
    }),
  ),
});

export interface ShowViewInput {
  title: string;
  html: string;
  css?: string;
  objectIds: string[];
}

export interface ViewObjectSnapshot {
  id: string;
  version: Version;
  frontmatter: Frontmatter;
  body: string;
}

export interface ViewLaunchPayload {
  schemaVersion: "agentstate.view-launch.v0";
  title: string;
  presentation: { html: string; css: string; contentHash: Version };
  selection: { objectIds: string[] };
  objects: ViewObjectSnapshot[];
}

export async function resolveViewLaunch(bundle: Bundle, input: ShowViewInput): Promise<ViewLaunchPayload> {
  const css = input.css ?? "";
  const presentationBytes = Buffer.byteLength(input.html, "utf8") + Buffer.byteLength(css, "utf8");
  if (presentationBytes > MAX_VIEW_PRESENTATION_BYTES) {
    throw new Error(
      `generated HTML/CSS is ${presentationBytes} bytes; the experimental limit is ${MAX_VIEW_PRESENTATION_BYTES}`,
    );
  }
  if (input.objectIds.length === 0 || input.objectIds.length > MAX_VIEW_OBJECTS) {
    throw new Error(`select between 1 and ${MAX_VIEW_OBJECTS} object IDs`);
  }
  if (new Set(input.objectIds).size !== input.objectIds.length) {
    throw new Error("objectIds must not contain duplicates");
  }
  for (const id of input.objectIds) assertSafeConceptId(id);

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
    schemaVersion: "agentstate.view-launch.v0",
    title: input.title,
    presentation: {
      html: input.html,
      css,
      contentHash: versionOfBytes(JSON.stringify({ html: input.html, css })),
    },
    selection: { objectIds: [...input.objectIds] },
    objects,
  };
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
}

export function createMcpAppServer(options: CreateMcpAppServerOptions): McpServer {
  const server = new McpServer({
    name: "AgentState Lite Conversational Views",
    version: options.version ?? "0.0.1",
  });

  registerAppTool(
    server,
    SHOW_VIEW_TOOL_NAME,
    {
      title: "Show AgentState View",
      description:
        "Use this after selecting exact document IDs with the AgentState Lite CLI. It renders agent-authored HTML over current authoritative snapshots; it does not mutate the bundle.",
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
        const payload = await resolveViewLaunch(options.bundle, input);
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
