/**
 * Board "shape" seam (isolation note, team lead, mid-flight 2026-07-06): everywhere the Board
 * would otherwise hardcode the Task kind or its status enum (the type filter, the column list,
 * valid transitions), it goes through THIS one module instead — components consume {@link
 * BoardShape} (`docType`/`enumField`/`values`), never the literals. Rationale: kind capabilities
 * are GENERIC in this repo (`core/src/kinds.ts` is the ONE registry; the deleted bespoke `note`
 * command is the standing cautionary tale for baking one specific kind into a component) — a
 * follow-up unit generalizing the board to any kind declaring an enum field should be a swap of
 * {@link fetchBoardShape}, not a rewrite of `Board.tsx`.
 *
 * Derivation is CHEAP over the wire the Board already has: `GET .../docs?prefix=conventions/&
 * type=Convention&fields=frontmatter` returns every kind-convention doc's frontmatter as
 * already-parsed JSON (core parses the YAML server-side — nothing here parses YAML), and
 * `fields.values` is a `fieldName -> allowed values` map (`core/src/kinds.ts`'s `KindFields`), so
 * the Task convention's `status` enum is read directly off it, no bundle-specific code needed.
 * A bundle that hasn't applied `recipe add work-tracking` (or any conventions-free bundle) has
 * no matching convention doc, so {@link fetchBoardShape} falls back to {@link
 * DEFAULT_BOARD_SHAPE} — the board must never break because a bundle didn't opt in to the
 * kind-conventions mechanism (CLAUDE.md gate 3: "usage is opt-in per bundle").
 */
import { listAllHeads } from "../api/client.js";

export interface BoardShape {
  /** The frontmatter `type` value the board queries/filters on. */
  docType: string;
  /** The frontmatter field whose enum values define the board's columns. */
  enumField: string;
  /** The enum's declared values, in column display order. */
  values: string[];
}

/**
 * Fallback when no bundle-declared convention governs `docType` — mirrors
 * `packages/cli/src/recipes.ts`'s `TASK_KIND` literally (that IS the built-in recipe this
 * defaults to). This is the "hardcoded Task default" the isolation note allows for this slice;
 * {@link fetchBoardShape} is the swap point once a future unit generalizes past it.
 */
export const DEFAULT_BOARD_SHAPE: BoardShape = {
  docType: "Task",
  enumField: "status",
  values: ["todo", "in_progress", "blocked", "done", "canceled"],
};

/** `snake_case` -> sentence case — the generic display-label fallback for an enum value: kind conventions declare no label field, only the raw allowed values, so labels are ALWAYS derived, never a per-kind hardcoded map. */
export function humanizeEnumValue(value: string): string {
  const spaced = value.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isNonEmptyStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string");
}

/**
 * Derive the board's shape from the bundle's OWN `conventions/` docs, falling back to {@link
 * DEFAULT_BOARD_SHAPE} on anything short of a fully-formed match (no convention governs `Task`,
 * a malformed/absent `fields.values`, or a transport failure) — this must never throw or leave
 * the board unrenderable, so every failure mode collapses to the same safe default.
 */
export async function fetchBoardShape(): Promise<BoardShape> {
  try {
    const conventions = await listAllHeads({ prefix: "conventions/", type: "Convention" });
    const match = conventions.find((c) => c.frontmatter.governs === DEFAULT_BOARD_SHAPE.docType);
    const fields = match?.frontmatter.fields as { values?: Record<string, unknown> } | undefined;
    const valuesEntry = fields?.values && typeof fields.values === "object" ? Object.entries(fields.values)[0] : undefined;
    if (valuesEntry) {
      const [enumField, values] = valuesEntry;
      if (enumField && isNonEmptyStringArray(values)) {
        return { docType: DEFAULT_BOARD_SHAPE.docType, enumField, values };
      }
    }
  } catch {
    // A network hiccup or a malformed convention doc must not break the board — fall through.
  }
  return DEFAULT_BOARD_SHAPE;
}
