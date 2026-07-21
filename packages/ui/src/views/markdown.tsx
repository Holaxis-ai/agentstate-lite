/**
 * The doc reader's render pipeline (designs/doc-reader rev 2) — the SECURITY BOUNDARY: untrusted
 * bundle markdown renders in the SHELL ORIGIN. Three belts, each independently sufficient for its
 * class:
 *
 *  1. `mdast-util-from-markdown` (+gfm) parses with dangerous HTML OFF — a raw-HTML run in the
 *     body becomes an mdast `html` node, which this module renders as ESCAPED TEXT, never markup.
 *  2. CLOSED CONSTRUCTION: mdast nodes map DIRECTLY to React elements — there is no HTML-string
 *     intermediate, no DOM-parsing of content, and no direct HTML injection (React's dangerous
 *     inner-HTML prop is banned by the grep gate in markdown-render-gate.test.ts). The
 *     "allowlist" is the closed switch below; unknown node types render as their text content.
 *     React auto-escapes children and attributes.
 *  3. The shell's own asset CSP (`ui-server/src/assets.ts`, `script-src 'self'`) blocks inline
 *     script, event-handler attributes, and `javascript:` navigation even under a hypothetical
 *     bypass of belts 1–2.
 *
 * THE INVARIANT (review HIGH-2, pinned red by markdown.test.tsx): anchor attributes are BUILT
 * from `resolveConceptId`'s output ONLY — a raw markdown href/src NEVER reaches a DOM attribute.
 * A resolved doc link becomes the `?view=doc&id=…` route; everything the resolver rejects
 * (external URLs, `javascript:`/`data:`/any scheme, non-`.md`, reserved files) renders as inert
 * text. Images are inert in v1 (figures arrive in the next unit PR; raster images are a recorded
 * conscious deferral — designs/doc-reader decision 5).
 *
 * RESOURCE BOUNDS: body bytes capped ({@link MAX_BODY_CHARS}, with an honest truncation notice —
 * the AXI `read` truncation's human analog) and the walk bounded ({@link MAX_NODES} nodes,
 * {@link MAX_DEPTH} depth) — a pathological doc degrades, never hangs the trusted tab.
 */
import type { ReactNode } from "react";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import type { AlignType, Node, Parent, RootContent } from "mdast";
import { resolveConceptId } from "@agentstate-lite/core/links";

/** Body cap before parsing (chars ≈ bytes for the ASCII-dominant common case; honest notice on cut). */
export const MAX_BODY_CHARS = 262_144;
/** Maximum mdast nodes rendered before the walk stops with a notice. */
export const MAX_NODES = 20_000;
/** Maximum nesting depth rendered before a subtree collapses to text. */
export const MAX_DEPTH = 40;

export interface RenderedMarkdown {
  element: ReactNode;
  /** True when the body was cut at {@link MAX_BODY_CHARS} or the walk hit {@link MAX_NODES}. */
  bounded: boolean;
}

export interface RenderOptions {
  /** The doc whose body this is — the resolver's `fromId` basis for relative links. */
  fromId: string;
  /** Shell navigation for a RESOLVED doc link (the only thing a link can do). */
  onNavigateDoc: (id: string) => void;
}

/** Flatten a node's text content — the inert fallback for unknown/rejected constructs. */
function textOf(node: Node): string {
  if (node.type === "text" || node.type === "inlineCode" || node.type === "html") {
    return (node as { value?: string }).value ?? "";
  }
  const children = (node as Partial<Parent>).children;
  if (!Array.isArray(children)) return "";
  return children.map((child) => textOf(child)).join("");
}

/** A fenced block's language, admitted only in a strictly-shaped class name (never arbitrary). */
function safeLanguageClass(lang: unknown): string | undefined {
  return typeof lang === "string" && /^[\w+-]{1,24}$/.test(lang) ? `doc-code-${lang}` : undefined;
}

interface WalkState {
  count: number;
  bounded: boolean;
  options: RenderOptions;
}

function renderChildren(node: Parent, state: WalkState, depth: number): ReactNode[] {
  return node.children.map((child, index) => renderNode(child, state, depth + 1, index));
}

/** One table row of `th`/`td` cells with gfm alignment mapped to a class, never a style string. */
function renderTableRow(row: Parent, state: WalkState, depth: number, index: number, header: boolean, align: AlignType[]): ReactNode {
  return (
    <tr key={index}>
      {row.children.map((cell, cellIndex) => {
        const Tag = header ? "th" : "td";
        const alignment = align[cellIndex];
        return (
          <Tag key={cellIndex} className={alignment ? `doc-cell-${alignment}` : undefined}>
            {renderChildren(cell as Parent, state, depth + 1)}
          </Tag>
        );
      })}
    </tr>
  );
}

function renderNode(node: RootContent | Node, state: WalkState, depth: number, index: number): ReactNode {
  if (state.count >= MAX_NODES) {
    state.bounded = true;
    return null;
  }
  state.count++;
  if (depth > MAX_DEPTH) return textOf(node);

  switch (node.type) {
    case "text":
      return (node as { value: string }).value;
    case "paragraph":
      return <p key={index}>{renderChildren(node as Parent, state, depth)}</p>;
    case "heading": {
      const level = Math.min(Math.max((node as { depth: number }).depth, 1), 6);
      const Tag = `h${level}` as "h1";
      return <Tag key={index}>{renderChildren(node as Parent, state, depth)}</Tag>;
    }
    case "emphasis":
      return <em key={index}>{renderChildren(node as Parent, state, depth)}</em>;
    case "strong":
      return <strong key={index}>{renderChildren(node as Parent, state, depth)}</strong>;
    case "delete":
      return <del key={index}>{renderChildren(node as Parent, state, depth)}</del>;
    case "inlineCode":
      return (
        <code key={index}>{(node as { value: string }).value}</code>
      );
    case "code": {
      const language = safeLanguageClass((node as { lang?: unknown }).lang);
      return (
        <pre key={index} className="doc-code">
          <code className={language}>{(node as { value: string }).value}</code>
        </pre>
      );
    }
    case "blockquote":
      return <blockquote key={index}>{renderChildren(node as Parent, state, depth)}</blockquote>;
    case "list": {
      const ordered = (node as { ordered?: boolean }).ordered === true;
      const start = (node as { start?: number }).start;
      return ordered ? (
        <ol key={index} start={typeof start === "number" ? start : undefined}>
          {renderChildren(node as Parent, state, depth)}
        </ol>
      ) : (
        <ul key={index}>{renderChildren(node as Parent, state, depth)}</ul>
      );
    }
    case "listItem": {
      const checked = (node as { checked?: boolean | null }).checked;
      return (
        <li key={index} className={typeof checked === "boolean" ? "doc-task-item" : undefined}>
          {typeof checked === "boolean" && <input type="checkbox" disabled checked={checked} readOnly />}
          {renderChildren(node as Parent, state, depth)}
        </li>
      );
    }
    case "thematicBreak":
      return <hr key={index} />;
    case "break":
      return <br key={index} />;
    case "link": {
      // THE INVARIANT: the href below is BUILT from the resolver's output. `node.url` (raw
      // markdown) is consulted only as resolver INPUT and never reaches an attribute.
      const resolved = resolveConceptId(state.options.fromId, (node as { url?: string }).url ?? "");
      const children = renderChildren(node as Parent, state, depth);
      if (resolved === null) {
        return (
          <span key={index} className="doc-link-inert" title="external or unresolved target">
            {children}
          </span>
        );
      }
      const onNavigateDoc = state.options.onNavigateDoc;
      return (
        <a
          key={index}
          href={`?view=doc&id=${encodeURIComponent(resolved)}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigateDoc(resolved);
          }}
        >
          {children}
        </a>
      );
    }
    case "image":
      // v1: images are inert (figures are the next unit PR; raster images a recorded deferral).
      return (
        <span key={index} className="doc-link-inert" title="images render in a later version">
          [image{(node as { alt?: string }).alt ? `: ${(node as { alt?: string }).alt}` : ""}]
        </span>
      );
    case "table": {
      const align = ((node as { align?: (AlignType | null)[] }).align ?? []) as AlignType[];
      const rows = (node as Parent).children;
      return (
        <div key={index} className="doc-table-wrap">
          <table>
            {rows.length > 0 && <thead>{renderTableRow(rows[0] as Parent, state, depth, 0, true, align)}</thead>}
            <tbody>
              {rows.slice(1).map((row, rowIndex) => renderTableRow(row as Parent, state, depth, rowIndex + 1, false, align))}
            </tbody>
          </table>
        </div>
      );
    }
    case "html":
      // Belt 1: raw HTML is DATA. Rendered as literal text (React escapes it), never parsed.
      return (
        <span key={index} className="doc-raw-html">
          {(node as { value: string }).value}
        </span>
      );
    default:
      // Unknown/unmapped node type (footnotes, definitions, future extensions): inert text.
      return textOf(node);
  }
}

/** Parse + render a doc body to React elements under the module's bounds. Pure aside from the callbacks. */
export function renderMarkdown(body: string, options: RenderOptions): RenderedMarkdown {
  let bounded = false;
  let source = body;
  if (source.length > MAX_BODY_CHARS) {
    source = source.slice(0, MAX_BODY_CHARS);
    bounded = true;
  }
  const tree = fromMarkdown(source, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });
  const state: WalkState = { count: 0, bounded: false, options };
  const element = <>{tree.children.map((child, index) => renderNode(child, state, 1, index))}</>;
  return { element, bounded: bounded || state.bounded };
}
