import { renderToStaticMarkup } from "react-dom/server";
import {
  renderMarkdown,
  type RenderedMarkdown,
  type RenderOptions,
} from "./index.js";

export interface StaticRenderOptions {
  fromId: string;
  titleFor?: RenderOptions["titleFor"];
  limits?: RenderOptions["limits"];
}

export interface StaticRenderedMarkdown extends Omit<RenderedMarkdown, "element"> {
  html: string;
}

/** Serialize the shared renderer's inert profile for transport into an opaque-origin View. */
export function renderMarkdownToStaticHtml(
  body: string,
  options: StaticRenderOptions,
): StaticRenderedMarkdown {
  const rendered = renderMarkdown(body, {
    ...options,
    profile: "inert",
    onNavigateDoc: () => {},
  });
  const html = renderToStaticMarkup(
    <div data-aslite-rendered-document="">{rendered.element}</div>,
  );
  return { html, bounded: rendered.bounded, limits: rendered.limits };
}
