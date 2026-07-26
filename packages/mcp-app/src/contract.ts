import type { Frontmatter, Version } from "@agentstate-lite/core";
import type { ActionScalar } from "@agentstate-lite/view-runtime";

export interface GeneratedActionDeclaration {
  kind: "document.set-field";
  label: string;
  objectId: string;
  field: string;
  value: ActionScalar;
}

export interface ShowViewInput {
  title: string;
  html: string;
  css?: string;
  objectIds: string[];
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
  selection: { objectIds: string[] };
  objects: ViewObjectSnapshot[];
}

export interface ViewLaunchPayload extends ResolvedViewContent {
  launch: {
    launchId: string;
    actions: ViewActionDescriptor[];
  };
}
