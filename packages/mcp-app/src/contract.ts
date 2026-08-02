import type { Frontmatter, Version } from "@agentstate-lite/core";
import type { QuerySelectionParams } from "@agentstate-lite/core/query-selection";
import type { ActionScalar } from "@agentstate-lite/view-runtime";

export interface GeneratedActionDeclaration {
  kind: "document.set-field";
  label: string;
  objectId: string;
  field: string;
  value: ActionScalar;
}

export interface GeneratedShowViewInput {
  title: string;
  html: string;
  css?: string;
  objectIds?: string[];
  query?: ViewQuerySelection;
  actions?: GeneratedActionDeclaration[];
}

export interface DurableShowViewInput {
  viewId: string;
}

export interface TransientShowViewInput {
  mode: "transient";
  title: string;
  html: string;
}

export type ShowViewInput =
  | GeneratedShowViewInput
  | DurableShowViewInput
  | TransientShowViewInput;

export type ViewQuerySelection = QuerySelectionParams;

export interface ResolvedShowViewInput extends GeneratedShowViewInput {
  title: string;
  html: string;
  css?: string;
  objectIds: string[];
  query?: ViewQuerySelection;
  matchedCount?: number;
  actions?: GeneratedActionDeclaration[];
}

export interface ViewObjectSnapshot {
  id: string;
  version: Version;
  frontmatter: Frontmatter;
  body: string;
}

export interface ViewActionDescriptor {
  actionId: string;
  label: string;
  targetId: string;
}

export interface ResolvedViewContent {
  schemaVersion: "agentstate.view-launch.v1";
  title: string;
  presentation: { html: string; css: string; contentHash: Version };
  selection: {
    objectIds: string[];
    query?: ViewQuerySelection;
    /** Total rows matching the launch-time query before its limit was applied. */
    matchedCount?: number;
  };
  objects: ViewObjectSnapshot[];
}

export interface ViewLaunchPayload extends ResolvedViewContent {
  launch: {
    launchId: string;
    actions: ViewActionDescriptor[];
  };
}

export interface DurableViewLaunchPayload {
  schemaVersion: "agentstate.durable-view-launch.v1";
  title: string;
  source: {
    viewId: string;
    entry: string;
    html: string;
    contentType: string;
    contentVersion: Version;
  };
  launch: {
    launchId: string;
    authorization: {
      required: boolean;
      authorized: boolean;
    };
  };
}

export interface TransientViewLaunchPayload {
  schemaVersion: "agentstate.transient-view-launch.v1";
  title: string;
  source: {
    kind: "transient";
    html: string;
    contentType: string;
    contentVersion: Version;
  };
  launch: {
    launchId: string;
    authorization: {
      required: boolean;
      authorized: boolean;
    };
  };
}

export type ActiveViewLaunchPayload =
  | DurableViewLaunchPayload
  | TransientViewLaunchPayload;

export type McpViewPayload = ViewLaunchPayload | ActiveViewLaunchPayload;
