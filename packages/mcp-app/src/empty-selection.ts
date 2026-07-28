/**
 * Self-describing empty-selection errors for generated show_view queries.
 *
 * Field evidence (tasks/mcp-generated-view-type-discovery): a Desktop model queried type "task",
 * got the bare "matched no documents" error, and dead-ended on a capitalization difference — it
 * has no other way to discover a bundle's types or field values (chat hosts carry no CLI/skill).
 * The error is the one surface guaranteed to reach the model at exactly the right moment, so it
 * names what DOES exist: on a type/prefix miss, the bundle's actual types with a nearest-match
 * hint; on a filter miss, how many documents the type matched and the observed values of the
 * filtered field. Bounded throughout — this is a hint, not a dump.
 */
import type { Frontmatter } from "@agentstate-lite/core";

const MAX_LISTED_TYPES = 12;
const MAX_LISTED_VALUES = 8;
const MAX_VALUE_CHARS = 80;

function clip(value: string): string {
  return value.length > MAX_VALUE_CHARS ? `${value.slice(0, MAX_VALUE_CHARS)}…` : value;
}

function bounded(values: readonly string[], cap: number): string {
  const shown = values.slice(0, cap).map((value) => `'${clip(value)}'`);
  const more = values.length - shown.length;
  return shown.join(", ") + (more > 0 ? ` (and ${more} more)` : "");
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
  /** Distinct bundle types — only consulted (and only needs computing) when typeMatched is empty. */
  bundleTypes: ReadonlyArray<string>;
}

export function describeEmptySelection({ query, typeMatched, bundleTypes }: EmptySelectionContext): string {
  const parts: string[] = ["query matched no AgentState documents"];
  if (typeMatched.length === 0) {
    if (query.type) {
      const suggestion = suggestType(query.type, bundleTypes);
      parts.push(
        `no documents of type '${query.type}'${suggestion ? ` — did you mean '${suggestion}'?` : ""}`,
      );
    }
    if (query.prefix) parts.push(`no documents under prefix '${query.prefix}'`);
    if (bundleTypes.length > 0) {
      parts.push(`this bundle's types: ${bounded(bundleTypes, MAX_LISTED_TYPES)}`);
    }
    return parts.join("; ");
  }
  parts.push(
    `${typeMatched.length} document(s) matched ${query.type ? `type '${query.type}'` : "the type/prefix selection"} before filters`,
  );
  if (query.field) {
    const eq = query.field.indexOf("=");
    const key = (eq > 0 ? query.field.slice(0, eq) : query.field).trim();
    // Arrays flatten per element to mirror matchesFilter's per-element coercion — the hint must
    // teach values in the exact shape a retry filter matches on.
    const observed = [
      ...new Set(
        typeMatched
          .flatMap((row) => {
            const raw = row.frontmatter[key];
            return Array.isArray(raw) ? raw : [raw];
          })
          .filter((value) => value !== undefined && value !== null)
          .map((value) => String(value)),
      ),
    ].sort((a, b) => a.localeCompare(b));
    parts.push(
      observed.length > 0
        ? `field '${key}' observed values: ${bounded(observed, MAX_LISTED_VALUES)}`
        : `field '${key}' is absent on every matched document`,
    );
  }
  if (query.open) parts.push("open: true excludes documents in a declared terminal state");
  return parts.join("; ");
}
