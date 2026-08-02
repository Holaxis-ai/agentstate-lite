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
  PageActionLaunchAuthority,
  PageBridgeLaunchAuthority,
  PageLaunchRegistry,
  SessionViewAuthorizationStore,
  TransientViewSaveError,
  TrustedActionService,
  ViewNotFoundError,
  launchIsCurrent,
  listViewCatalogPage,
  mintActiveViewLaunch,
  mintTransientViewLaunch,
  pageLaunchAuthorizationSubject,
  saveTransientView,
  type ActionTerminalResult,
  type DocumentSetFieldAction,
  type PageLaunch,
  type RegisteredPageLaunch,
  type TransientPageLaunch,
  type ViewAuthorizationStore,
  type TrustedActionLaunchAuthority,
} from "@agentstate-lite/view-runtime";
import { renderDocumentToStaticHtml } from "@agentstate-lite/markdown-renderer/static";
import { z } from "zod";
import type {
  DurableShowViewInput,
  DurableViewLaunchPayload,
  GeneratedShowViewInput,
  McpViewPayload,
  ResolvedViewContent,
  ResolvedShowViewInput,
  ShowViewInput,
  TransientShowViewInput,
  TransientViewLaunchPayload,
  ViewLaunchPayload,
  ViewObjectSnapshot,
} from "./contract.js";
import { MCP_VIEW_HTML } from "./generated/view-html.generated.js";
import { randomBytes } from "node:crypto";
import { describeEmptySelection, distinctTypes } from "./empty-selection.js";
import { McpViewLaunchRegistry } from "./launches.js";
import { PendingLaunchRegistry } from "./pending-launches.js";

// MCP Apps hosts may preload/cache resources by URI. Keep one URI immutable to one exact shell
// byte sequence so a newly built server cannot silently execute stale trusted-shell code.
const MCP_VIEW_RESOURCE_DIGEST = versionOfBytes(MCP_VIEW_HTML).slice(
  "sha256:".length,
);
export const MCP_VIEW_RESOURCE_URI =
  `ui://agentstate/view-host/v1/${MCP_VIEW_RESOURCE_DIGEST}.html`;
export const SHOW_VIEW_TOOL_NAME = "show_view";
export const LIST_VIEWS_TOOL_NAME = "list_views";
export const PREPARE_VIEW_ACTION_TOOL_NAME = "prepare_view_action";
export const FINISH_VIEW_ACTION_TOOL_NAME = "finish_view_action";
export const AUTHORIZE_DURABLE_VIEW_TOOL_NAME = "authorize_durable_view";
export const DURABLE_VIEW_BRIDGE_TOOL_NAME = "durable_view_bridge";
export const POLL_DURABLE_VIEW_TOOL_NAME = "poll_durable_view";
export const CLOSE_DURABLE_VIEW_TOOL_NAME = "close_durable_view";
export const RESUME_DURABLE_VIEW_TOOL_NAME = "resume_durable_view";
export const RESOLVE_LAUNCH_TOOL_NAME = "resolve_launch";
export const SAVE_TRANSIENT_VIEW_TOOL_NAME = "save_transient_view";

/**
 * Claim marker carried in show_view's TEXT content — the channel Claude Desktop preserves when it
 * strips structuredContent (probe-established). Model-visible by construction; conveys no model
 * authority: resolve_launch is app-only, same-connection, bounded, one-shot, exact-match-only.
 */
export function formatClaimMarker(claimId: string): string {
  return `[agentstate-claim:v1:${claimId}]`;
}

function mintClaimId(): string {
  return randomBytes(16).toString("base64url");
}
export const MAX_VIEW_PRESENTATION_BYTES = 256 * 1024;
export const MAX_VIEW_OBJECTS = 20;
export const MAX_VIEW_ACTIONS = 8;
export const MAX_VIEW_DATA_BYTES = 1024 * 1024;
export const MAX_VIEW_CATALOG_PAGE = 20;
export const MAX_VIEW_CATALOG_SCAN = 40;

const listViewsInputSchema = z
  .object({
    cursor: z.string().trim().min(1).max(1024).optional(),
  })
  .strict();

const listViewsOutputSchema = z.object({
  views: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      access: z.enum(["bundle-read", "bundle-propose"]),
      presentation: z.enum(["workspace", "inline", "adaptive"]).optional(),
      timestamp: z.string().optional(),
    }),
  ),
  shown: z.number().int().nonnegative(),
  registeredTotal: z.number().int().nonnegative(),
  excluded: z.number().int().nonnegative(),
  invalidRegistrations: z.number().int().nonnegative(),
  pageUnavailableEntries: z.number().int().nonnegative(),
  skippedDocuments: z.number().int().nonnegative(),
  examined: z.number().int().nonnegative(),
  truncated: z.boolean(),
  nextCursor: z.string().optional(),
});

function encodeViewCursor(afterId: string): string {
  return Buffer.from(JSON.stringify({ v: 1, afterId }), "utf8").toString("base64url");
}

function decodeViewCursor(cursor: string | undefined): string | undefined {
  if (cursor === undefined) return undefined;
  let value: unknown;
  try {
    value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
  } catch {
    throw new Error("cursor is not a valid AgentState View catalog cursor");
  }
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    Object.keys(value).sort().join(",") !== "afterId,v" ||
    (value as { v?: unknown }).v !== 1 ||
    typeof (value as { afterId?: unknown }).afterId !== "string"
  ) {
    throw new Error("cursor is not a valid AgentState View catalog cursor");
  }
  return (value as { afterId: string }).afterId;
}

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
        "Exact ID of an existing registered bundle View to run unchanged through the standard active bridge.",
      ),
  })
  .strict();

const transientInputSchema = z
  .object({
    mode: z.literal("transient"),
    title: z.string().trim().min(1).max(120),
    html: z.string().min(1),
    access: z.enum(["bundle-read", "bundle-propose"]).optional(),
  })
  .strict();

const inputSchema = z
  .object({
    mode: z.literal("transient").optional(),
    viewId: durableInputSchema.shape.viewId.optional(),
    title: generatedInputSchema.shape.title.optional(),
    html: generatedInputSchema.shape.html.optional(),
    access: transientInputSchema.shape.access,
    css: generatedInputSchema.shape.css,
    objectIds: generatedInputSchema.shape.objectIds,
    query: generatedInputSchema.shape.query,
    actions: generatedInputSchema.shape.actions,
  })
  .strict()
  .describe(
    "Pass exactly viewId for a registered View; mode:transient plus title/html for an active process-local View; or title/html plus exactly one generated selection mode.",
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
    access: z.enum(["none", "bundle-read", "bundle-propose"]),
    authorization: z.object({
      required: z.boolean(),
      authorized: z.boolean(),
    }),
  }),
});

const transientOutputSchema = z.object({
  schemaVersion: z.literal("agentstate.transient-view-launch.v1"),
  title: z.string(),
  source: z.object({
    kind: z.literal("transient"),
    html: z.string(),
    contentType: z.string(),
    contentVersion: z.string(),
  }),
  launch: durableOutputSchema.shape.launch,
});

const saveTransientViewInputSchema = z
  .object({
    launchId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .describe("Exact transient launchId returned by show_view."),
    viewId: z
      .string()
      .trim()
      .min(1)
      .max(512)
      .describe("New durable registration id under views-registry/; its views/...html entry is derived."),
    description: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("Optional durable catalog description."),
  })
  .strict();

const saveTransientViewOutputSchema = z.object({
  saved: z.object({
    viewId: z.string(),
    entry: z.string(),
    title: z.string(),
    access: z.enum(["none", "bundle-read", "bundle-propose"]),
    sourceVersion: z.string(),
    entryVersion: z.string(),
    registryVersion: z.string(),
    entryCreated: z.boolean(),
    registryCreated: z.boolean(),
  }),
});

const outputSchema = z.object({
  schemaVersion: z.string(),
  title: z.string(),
  presentation: generatedOutputSchema.shape.presentation.optional(),
  selection: generatedOutputSchema.shape.selection.optional(),
  objects: generatedOutputSchema.shape.objects.optional(),
  source: z.union([durableOutputSchema.shape.source, transientOutputSchema.shape.source]).optional(),
  launch: z.object({
    launchId: z.string(),
    actions: generatedOutputSchema.shape.launch.shape.actions.optional(),
    access: z.enum(["none", "bundle-read", "bundle-propose"]).optional(),
    authorization: durableOutputSchema.shape.launch.shape.authorization.optional(),
  }),
});

function parseShowViewInput(input: unknown): ShowViewInput {
  const outer = inputSchema.parse(input);
  if (outer.viewId !== undefined) return durableInputSchema.parse(outer);
  if (outer.mode === "transient") return transientInputSchema.parse(outer);
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
  const limit = query.limit ?? MAX_VIEW_OBJECTS;
  const selected = applyQuerySelectionFilters(
    rows,
    { ...query, limit },
    registry ? [...registry.kinds.values()] : [],
  );
  if (selected.rows.length === 0) {
    // Self-describing empty selection (tasks/mcp-generated-view-type-discovery): the model's only
    // window into the bundle's vocabulary is this error, so name what exists. The full head scan
    // runs ONLY on the type/prefix-miss error path.
    const bundleTypes = rows.length === 0 ? distinctTypes(await queryHeads(bundle, {})) : [];
    throw new Error(describeEmptySelection({ query, typeMatched: rows, bundleTypes, limit }));
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
  launch: RegisteredPageLaunch,
  authorized: boolean,
): DurableViewLaunchPayload {
  return {
    schemaVersion: "agentstate.durable-view-launch.v1",
    title: launch.registryTitle,
    source: {
      viewId: launch.registryId,
      entry: launch.entryKey,
      html: new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(launch.bytes),
      contentType: launch.contentType,
      contentVersion: launch.contentVersion,
    },
    launch: {
      launchId: launch.launchId,
      access: launch.capability,
      authorization: {
        required: launch.capability !== "none",
        authorized,
      },
    },
  };
}

function transientPayload(
  launch: TransientPageLaunch,
  authorized: boolean,
): TransientViewLaunchPayload {
  return {
    schemaVersion: "agentstate.transient-view-launch.v1",
    title: launch.title,
    source: {
      kind: "transient",
      html: new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(launch.bytes),
      contentType: launch.contentType,
      contentVersion: launch.contentVersion,
    },
    launch: {
      launchId: launch.launchId,
      access: launch.capability,
      authorization: {
        required: launch.capability !== "none",
        authorized,
      },
    },
  };
}

function activePayload(
  launch: PageLaunch,
  authorized: boolean,
): DurableViewLaunchPayload | TransientViewLaunchPayload {
  return launch.sourceKind === "registered"
    ? durablePayload(launch, authorized)
    : transientPayload(launch, authorized);
}

export async function resolveTransientViewLaunch(
  bundle: Bundle,
  input: TransientShowViewInput,
  launches = new PageLaunchRegistry(),
  authorizations: ViewAuthorizationStore = new SessionViewAuthorizationStore(),
): Promise<TransientViewLaunchPayload> {
  const parsed = transientInputSchema.parse(input);
  const launch = mintTransientViewLaunch(bundle, launches, {
    title: parsed.title,
    html: parsed.html,
    capability: parsed.access,
  });
  return transientPayload(
    launch,
    await authorizations.isAuthorized(pageLaunchAuthorizationSubject(launch)),
  );
}

export async function resolveDurableViewLaunch(
  bundle: Bundle,
  input: DurableShowViewInput,
  launches = new PageLaunchRegistry(),
  authorizations: ViewAuthorizationStore = new SessionViewAuthorizationStore(),
): Promise<DurableViewLaunchPayload> {
  const parsed = durableInputSchema.parse(input);
  const launch = await mintActiveViewLaunch(bundle, launches, parsed.viewId);
  if (launch.capability !== "bundle-read" && launch.capability !== "bundle-propose") {
    launches.revoke(launch.launchId);
    throw new Error(
      `View '${parsed.viewId}' declares '${launch.capability}' access; active MCP Views require bundle-read or bundle-propose`,
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
  if (payload.schemaVersion === "agentstate.transient-view-launch.v1") {
    return payload.launch.authorization.authorized
      ? `Prepared transient AgentState View "${payload.title}" from its exact process-local bytes.`
      : `Transient AgentState View "${payload.title}" is ready for local approval of its exact process-local bytes before it can read bundle data.`;
  }
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
  const durableLaunches = new PageLaunchRegistry();
  const durableAuthorizations =
    options.viewAuthorization ?? new SessionViewAuthorizationStore();
  const transientAuthorizations = new SessionViewAuthorizationStore();
  const activeActionAuthority = new PageActionLaunchAuthority(
    options.bundle,
    durableLaunches,
    durableAuthorizations,
    transientAuthorizations,
  );
  const actionAuthority: TrustedActionLaunchAuthority = {
    async resolve(launchId) {
      return (await activeActionAuthority.resolve(launchId)) ?? launches.resolve(launchId);
    },
    revoke(launchId) {
      activeActionAuthority.revoke(launchId);
      launches.revoke(launchId);
    },
  };
  const actions = new TrustedActionService(options.bundle, actionAuthority, options.actor);
  const pendingLaunches = new PendingLaunchRegistry();
  const durableBridge = new BridgeService({
    bundle: options.bundle,
    launches: new PageBridgeLaunchAuthority(
      options.bundle,
      durableLaunches,
      durableAuthorizations,
      transientAuthorizations,
    ),
    config: async () => ({
      root: null,
      name: options.bundleName ?? "AgentState bundle",
      mode: "local-mcp",
    }),
    renderDocument: renderDocumentToStaticHtml,
    allowActionProtocol: true,
    enablePolling: true,
  });

  registerAppTool(
    server,
    LIST_VIEWS_TOOL_NAME,
    {
      title: "List registered AgentState Views",
      description:
        "List existing durable bundle Views that this MCP host can invoke by exact id with show_view. Results are deterministic and bounded; use nextCursor to continue.",
      inputSchema: listViewsInputSchema,
      outputSchema: listViewsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["model"] } },
    },
    async (input): Promise<CallToolResult> => {
      try {
        const { cursor } = listViewsInputSchema.parse(input);
        const afterId = decodeViewCursor(cursor);
        const catalog = await listViewCatalogPage(options.bundle, {
          ...(afterId ? { afterId } : {}),
          limit: MAX_VIEW_CATALOG_PAGE,
          scanLimit: MAX_VIEW_CATALOG_SCAN,
          access: ["bundle-read", "bundle-propose"],
        });
        const payload = {
          views: catalog.entries.map((entry) => ({
            id: entry.id,
            title: entry.title,
            ...(entry.description ? { description: entry.description } : {}),
            access: entry.access,
            ...(entry.presentation ? { presentation: entry.presentation } : {}),
            ...(entry.timestamp ? { timestamp: entry.timestamp } : {}),
          })),
          shown: catalog.entries.length,
          registeredTotal: catalog.registeredTotal,
          excluded: catalog.excludedAccess,
          invalidRegistrations: catalog.invalidRegistrations,
          pageUnavailableEntries: catalog.pageUnavailableEntries,
          skippedDocuments: catalog.skippedDocuments,
          examined: catalog.examined,
          truncated: catalog.truncated,
          ...(catalog.nextAfterId
            ? { nextCursor: encodeViewCursor(catalog.nextAfterId) }
            : {}),
        };
        return {
          content: [
            {
              type: "text",
              text: catalog.registeredTotal === 0
                ? "No registered active Views are available to this MCP host."
                : `Found ${catalog.registeredTotal} registered active View registration(s); showing ${catalog.entries.length} admitted View(s) from ${catalog.examined} examined.`,
            },
          ],
          structuredContent: payload,
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Could not list AgentState Views: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );

  registerAppTool(
    server,
    SHOW_VIEW_TOOL_NAME,
    {
      title: "Show AgentState View",
      description:
        "Render agent-authored script-free HTML over frozen snapshots, launch active process-local HTML with mode:transient, or run an existing registered bundle View by exact viewId. Active Views share the standard bridge and require the human to trust their exact executable bytes and declared access before bundle data is exposed.",
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
        const durable = "viewId" in parsed;
        const transient = "mode" in parsed && parsed.mode === "transient";
        const payload = durable
          ? await resolveDurableViewLaunch(
              options.bundle,
              parsed as DurableShowViewInput,
              durableLaunches,
              durableAuthorizations,
            )
          : transient
            ? await resolveTransientViewLaunch(
                options.bundle,
                parsed as TransientShowViewInput,
                durableLaunches,
                transientAuthorizations,
              )
          : await resolveViewLaunch(options.bundle, parsed as GeneratedShowViewInput, launches);
        // Claim ticket for hosts whose tool-result notifications strip structuredContent
        // (probe-established for Claude Desktop): the marker rides the preserved text channel
        // and the App redeems it — exact-match, one-shot — via the app-only resolve_launch.
        const claimId = mintClaimId();
        pendingLaunches.record(
          claimId,
          payload.launch.launchId,
          durable || transient ? "durable" : "generated",
        );
        return {
          content: [
            { type: "text", text: `${fallbackText(payload)}\n${formatClaimMarker(claimId)}` },
          ],
          structuredContent: { ...payload },
        };
      } catch (error) {
        const detail = error instanceof ViewNotFoundError
          ? `${error.message} Call list_views to discover the available View IDs.`
          : error instanceof Error
            ? error.message
            : String(error);
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Could not render the AgentState View: ${detail}`,
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
      title: "Authorize active AgentState View",
      description:
        "Record the trusted shell's local decision to trust exact active View bytes with their declared active access, then return the revalidated launch.",
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
      const authorizationStore = launch?.sourceKind === "transient"
        ? transientAuthorizations
        : durableAuthorizations;
      if (
        !launch ||
        (launch.capability !== "bundle-read" && launch.capability !== "bundle-propose") ||
        !(await launchIsCurrent(options.bundle, launch))
      ) {
        if (launch) durableBridge.revoke(launch.launchId);
        return {
          isError: true,
          content: [{ type: "text", text: "The active View changed or expired before approval." }],
        };
      }
      const subject = pageLaunchAuthorizationSubject(launch);
      await authorizationStore.authorize(subject);
      if (
        !(await launchIsCurrent(options.bundle, launch)) ||
        !(await authorizationStore.isAuthorized(subject))
      ) {
        durableBridge.revoke(launch.launchId);
        return {
          isError: true,
          content: [{ type: "text", text: "The active View changed while approval was being recorded." }],
        };
      }
      const view = activePayload(launch, true);
      return {
        content: [{ type: "text", text: `Approved exact current bytes for "${view.title}".` }],
        structuredContent: { view },
      };
    },
  );

  registerAppTool(
    server,
    SAVE_TRANSIENT_VIEW_TOOL_NAME,
    {
      title: "Save transient AgentState View",
      description:
        "Save an already locally approved transient active View as a durable registered bundle View without transforming its HTML. Pass only the transient launchId from show_view, a new views-registry/... id, and optional description; the server rereads its own immutable launch bytes and never accepts replacement HTML.",
      inputSchema: saveTransientViewInputSchema,
      outputSchema: saveTransientViewOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["model"] } },
    },
    async (input): Promise<CallToolResult> => {
      try {
        const parsed = saveTransientViewInputSchema.parse(input);
        const saved = await saveTransientView(
          options.bundle,
          durableLaunches,
          transientAuthorizations,
          parsed,
          { ...(options.actor ? { actor: options.actor } : {}) },
        );
        return {
          content: [
            {
              type: "text",
              text:
                `Saved exact transient View bytes as '${saved.viewId}' (${saved.entry}). ` +
                "Call show_view with that viewId to launch the durable identity; it requires its own local authorization.",
            },
          ],
          structuredContent: { saved },
        };
      } catch (error) {
        const retainedEntry =
          error instanceof TransientViewSaveError && error.retainedEntry
            ? ` The entry remains at '${error.retainedEntry.key}' (${error.retainedEntry.version}).`
            : "";
        const retainedRegistration =
          error instanceof TransientViewSaveError && error.retainedRegistration
            ? ` A registration also remains at '${error.retainedRegistration.id}' (${error.retainedRegistration.version}), but this operation did not report a successful exact save.`
            : " No successful registration was reported.";
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Could not save the transient AgentState View: ${error instanceof Error ? error.message : String(error)}${retainedEntry}${retainedRegistration}`,
            },
          ],
        };
      }
    },
  );

  registerAppTool(
    server,
    DURABLE_VIEW_BRIDGE_TOOL_NAME,
    {
      title: "Run active AgentState View bridge request",
      description:
        "Forward one bounded data bridge request from the current approved active View. Governed change proposals use the separate trusted confirmation tools.",
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
        content: [{ type: "text", text: "Processed one active View bridge request." }],
        structuredContent: { outcome },
      };
    },
  );

  registerAppTool(
    server,
    RESUME_DURABLE_VIEW_TOOL_NAME,
    {
      title: "Resume active AgentState View",
      description:
        "Mint a fresh active View launch after the trusted App quarantines an old visible mount. View identity and authorization are derived only from server-owned launch state.",
      inputSchema: z
        .object({ launchId: z.string().min(1).max(128) })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ launchId }): Promise<CallToolResult> => {
      const previous = durableLaunches.resolveLaunch(launchId);
      const authorizationStore = previous?.sourceKind === "transient"
        ? transientAuthorizations
        : durableAuthorizations;
      if (
        !previous ||
        (previous.capability !== "bundle-read" && previous.capability !== "bundle-propose") ||
        !(await authorizationStore.isAuthorized(
          pageLaunchAuthorizationSubject(previous),
        ))
      ) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "The suspended registered View is unknown, expired, or no longer authorized.",
            },
          ],
        };
      }
      try {
        const view = previous.sourceKind === "registered"
          ? await resolveDurableViewLaunch(
              options.bundle,
              { viewId: previous.registryId },
              durableLaunches,
              durableAuthorizations,
            )
          : await resolveTransientViewLaunch(
              options.bundle,
              {
                mode: "transient",
                title: previous.title,
                html: new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(previous.bytes),
                access: previous.capability,
              },
              durableLaunches,
              transientAuthorizations,
            );
        const stillCurrent = durableLaunches.resolveLaunch(launchId);
        if (
          stillCurrent !== previous ||
          !(await authorizationStore.isAuthorized(
            pageLaunchAuthorizationSubject(previous),
          ))
        ) {
          durableBridge.revoke(view.launch.launchId);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "The suspended registered View changed while its replacement was being minted.",
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `Minted a fresh current launch for "${view.title}".`,
            },
          ],
          structuredContent: { view },
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Could not resume the registered View: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );

  registerAppTool(
    server,
    POLL_DURABLE_VIEW_TOOL_NAME,
    {
      title: "Poll active AgentState View changes",
      description:
        "Poll the server-owned subscription baseline for the current active View.",
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
      title: "Close active AgentState View",
      description:
        "Revoke one process-local active View launch and discard its subscription state.",
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
      inputSchema: z.union([
        z.object({
          launchId: z.string().min(1).max(256),
          actionId: z.string().min(1).max(256),
        }).strict(),
        z.object({
          launchId: z.string().min(1).max(256),
          requestId: z.string().min(1).max(64),
          action: z.unknown(),
        }).strict(),
      ]),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async (input): Promise<CallToolResult> => {
      const { launchId } = input;
      const active = "action" in input;
      const action: DocumentSetFieldAction | null = active
        ? input.action as DocumentSetFieldAction
        : launches.action(launchId, input.actionId);
      const result = action
        ? await actions.prepare(launchId, action)
        : ({
            status: "rejected",
            action: "document.set-field",
            message: "the action is unknown, expired, or outside this View",
          } satisfies ActionTerminalResult);
      let view = active ? undefined : launches.payload(launchId);
      if (!active && result.status === "conflict") {
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
        structuredContent: { result, ...(active ? {} : { view }) },
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
      const activeLaunch = durableLaunches.resolveLaunch(launchId);
      if (!view && !activeLaunch) {
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
        if (view &&
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
        structuredContent: { result, ...(activeLaunch ? {} : { view }) },
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

  registerAppTool(
    server,
    RESOLVE_LAUNCH_TOOL_NAME,
    {
      title: "Resolve undelivered AgentState View launch",
      description:
        "Redeem the exact one-shot claim marker from a show_view result whose structured payload the host stripped. Returns the already-minted payload; unknown or reused claims fail closed.",
      inputSchema: { claim: z.string().min(8).max(256) },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ claim }): Promise<CallToolResult> => {
      const entry = pendingLaunches.consume(claim);
      if (!entry) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Unknown, expired, or already-redeemed AgentState View claim. Reopen the View.",
            },
          ],
        };
      }
      let payload: McpViewPayload | null = null;
      if (entry.kind === "generated") {
        payload = launches.payload(entry.launchId);
      } else {
        const launch = durableLaunches.resolveLaunch(entry.launchId);
        if (launch) {
          const authorizationStore = launch.sourceKind === "transient"
            ? transientAuthorizations
            : durableAuthorizations;
          payload = activePayload(
            launch,
            await authorizationStore.isAuthorized(pageLaunchAuthorizationSubject(launch)),
          );
        }
      }
      if (!payload) {
        return {
          isError: true,
          content: [
            { type: "text", text: "The pending View launch expired before it could be resolved. Reopen the View." },
          ],
        };
      }
      return {
        content: [{ type: "text", text: fallbackText(payload) }],
        structuredContent: { ...payload },
      };
    },
  );

  return server;
}

export async function startMcpStdioServer(options: CreateMcpAppServerOptions): Promise<void> {
  await createMcpAppServer(options).connect(new StdioServerTransport());
}
