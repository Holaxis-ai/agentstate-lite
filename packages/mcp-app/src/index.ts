export {
  FINISH_VIEW_ACTION_TOOL_NAME,
  MCP_VIEW_RESOURCE_URI,
  MAX_VIEW_ACTIONS,
  MAX_VIEW_DATA_BYTES,
  MAX_VIEW_OBJECTS,
  MAX_VIEW_PRESENTATION_BYTES,
  PREPARE_VIEW_ACTION_TOOL_NAME,
  SHOW_VIEW_TOOL_NAME,
  createMcpAppServer,
  resolveViewLaunch,
  startMcpStdioServer,
  type CreateMcpAppServerOptions,
} from "./server.js";
export type {
  GeneratedActionDeclaration,
  ShowViewInput,
  ViewActionDescriptor,
  ViewLaunchPayload,
  ViewObjectSnapshot,
} from "./contract.js";
