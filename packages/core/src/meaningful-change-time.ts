/**
 * Return the raw frontmatter value that represents a document's last meaningful change.
 *
 * This is intentionally only field selection: each consumer keeps its existing parsing,
 * formatting, and missing-value behavior. Backend revision timestamps are a different clock.
 */
export function meaningfulChangeTimeValue(frontmatter: { readonly timestamp?: unknown }): unknown {
  return frontmatter.timestamp;
}
