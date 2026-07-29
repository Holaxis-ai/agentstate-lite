/**
 * Self-describing empty-selection errors for generated show_view queries.
 *
 * Field evidence (tasks/mcp-generated-view-type-discovery): a Desktop model queried type "task",
 * got the bare "matched no documents" error, and dead-ended on a capitalization difference — it
 * has no other way to discover a bundle's types or field values (chat hosts carry no CLI/skill).
 * The error is the one surface guaranteed to reach the model at exactly the right moment, so it
 * names what DOES exist.
 *
 * Three disciplines this error owes the reader (PR #179 review):
 *
 * 1. EVIDENCE STAYS INSIDE THE ENVELOPE. A generated launch freezes at most `limit` documents in
 *    deterministic id order, so field evidence is drawn from that same bounded prefix — never from
 *    rows a successful query would not have selected — and is labeled with the count it examined.
 * 2. NO CLAIM WITHOUT EVIDENCE. An empty type+prefix INTERSECTION does not prove either axis is
 *    empty, so the conjunction is reported as a conjunction; the type axis is asserted only when
 *    the whole-bundle type list settles it.
 * 3. ONLY REPRESENTABLE VALUES ARE ADVERTISED. A retry filter is `<name>=<v>[,<v>…]` whose members
 *    are comma-split and trimmed, matched against the document value EXACTLY — so a value that is
 *    empty, padded, comma-bearing, or too long to print in full cannot round-trip. Those are
 *    counted, not shown, and never dangled as a suggestion that silently fails.
 */
import type { Frontmatter } from "@agentstate-lite/core";

const MAX_LISTED_TYPES = 12;
const MAX_LISTED_VALUES = 8;
/** Longest value printed in full; a longer one cannot be shown losslessly, so it is not advertised. */
const MAX_VALUE_CHARS = 80;

/**
 * Can this exact string be used as a retry filter member? Mirrors `fieldSelectionSchema` (members
 * comma-split and trimmed, non-empty) against `matchesFilter`'s exact comparison.
 */
export function isRepresentableFilterValue(value: string, maxChars = MAX_VALUE_CHARS): boolean {
  return value !== "" && value === value.trim() && !value.includes(",") && value.length <= maxChars;
}

/** Render a bounded, quoted list plus honest remainders for capped and unrepresentable entries. */
function advertise(
  values: readonly string[],
  cap: number,
  maxChars = MAX_VALUE_CHARS,
): { text: string; shownCount: number } {
  const usable = values.filter((value) => isRepresentableFilterValue(value, maxChars));
  const unusable = values.length - usable.length;
  const shown = usable.slice(0, cap);
  const notes: string[] = [];
  const capped = usable.length - shown.length;
  if (capped > 0) notes.push(`${capped} more`);
  if (unusable > 0) notes.push(`${unusable} not expressible as a filter value`);
  const suffix = notes.length > 0 ? ` (${notes.join("; ")})` : "";
  return {
    text: shown.map((value) => `'${value}'`).join(", ") + suffix,
    shownCount: shown.length,
  };
}

/** Distinct, sorted, non-empty `type` values from head rows. */
export function distinctTypes(rows: ReadonlyArray<{ frontmatter: Frontmatter }>): string[] {
  const types = new Set<string>();
  for (const row of rows) {
    const type = row.frontmatter.type;
    if (typeof type === "string" && type.trim()) types.add(type.trim());
  }
  return [...types].sort((a, b) => a.localeCompare(b));
}

/** Case- and trailing-plural-insensitive nearest match ("task" / "Tasks" -> "Task"). */
export function suggestType(requested: string, available: readonly string[]): string | null {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/s$/, "");
  const wanted = normalize(requested);
  if (!wanted) return null;
  for (const candidate of available) {
    if (normalize(candidate) === wanted && candidate !== requested) return candidate;
  }
  return null;
}

export interface EmptySelectionContext {
  query: { type?: string; prefix?: string; field?: string; open?: boolean };
  /** Rows that survived the storage-level type/prefix selection (before field/open filters). */
  typeMatched: ReadonlyArray<{ frontmatter: Frontmatter }>;
  /** Distinct bundle types — only consulted (and only computed) when typeMatched is empty. */
  bundleTypes: ReadonlyArray<string>;
  /** The launch's document bound; field evidence never reaches past this prefix of the matches. */
  limit: number;
}

function describeSelectionMiss(
  query: EmptySelectionContext["query"],
  bundleTypes: ReadonlyArray<string>,
): string[] {
  const parts: string[] = [];
  const { type, prefix } = query;
  const suggestion = type ? suggestType(type, bundleTypes) : null;
  const hint = suggestion ? ` — did you mean '${suggestion}'?` : "";
  const typeExistsElsewhere = type !== undefined && bundleTypes.includes(type);

  if (type && prefix) {
    // An empty INTERSECTION proves nothing about either axis on its own; only the whole-bundle
    // type list can settle the type axis, and nothing here settles the prefix axis.
    parts.push(
      typeExistsElsewhere
        ? `no documents of type '${type}' under prefix '${prefix}' — that type exists elsewhere in this bundle`
        : `no documents of type '${type}' under prefix '${prefix}'${hint}`,
    );
  } else if (type) {
    parts.push(`no documents of type '${type}'${hint}`);
  } else if (prefix) {
    parts.push(`no documents under prefix '${prefix}'`);
  }

  if (bundleTypes.length > 0) {
    const { text } = advertise(bundleTypes, MAX_LISTED_TYPES, 256);
    if (text) parts.push(`this bundle's types: ${text}`);
  }
  return parts;
}

function describeFilterMiss(
  query: EmptySelectionContext["query"],
  typeMatched: EmptySelectionContext["typeMatched"],
  limit: number,
): string[] {
  const parts: string[] = [];
  const scope = query.type ? `type '${query.type}'` : "the type/prefix selection";
  parts.push(`${typeMatched.length} document(s) matched ${scope} before filters`);

  if (query.field) {
    // Evidence comes only from the bounded prefix a successful launch would have frozen.
    const evidence = typeMatched.slice(0, limit);
    const eq = query.field.indexOf("=");
    const key = (eq > 0 ? query.field.slice(0, eq) : query.field).trim();
    // Arrays flatten per element to mirror matchesFilter's per-element coercion — the hint must
    // teach values in the exact shape a retry filter matches on.
    const observed = [
      ...new Set(
        evidence
          .flatMap((row) => {
            const raw = row.frontmatter[key];
            return Array.isArray(raw) ? raw : [raw];
          })
          .filter((value) => value !== undefined && value !== null)
          .map((value) => String(value)),
      ),
    ].sort((a, b) => a.localeCompare(b));
    const { text, shownCount } = advertise(observed, MAX_LISTED_VALUES);
    if (observed.length === 0) {
      parts.push(`field '${key}' is absent from the first ${evidence.length} matched document(s)`);
    } else if (shownCount === 0) {
      parts.push(
        `field '${key}' is present in the first ${evidence.length} matched document(s), but no observed value can be expressed as a filter value`,
      );
    } else {
      parts.push(
        `field '${key}' values in the first ${evidence.length} matched document(s): ${text}`,
      );
    }
  }
  if (query.open) parts.push("open: true excludes documents in a declared terminal state");
  return parts;
}

export function describeEmptySelection({
  query,
  typeMatched,
  bundleTypes,
  limit,
}: EmptySelectionContext): string {
  const parts = ["query matched no AgentState documents"];
  parts.push(
    ...(typeMatched.length === 0
      ? describeSelectionMiss(query, bundleTypes)
      : describeFilterMiss(query, typeMatched, limit)),
  );
  return parts.join("; ");
}
