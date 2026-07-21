/** Shared display formatting for the home surface (launcher + activity feed). */

/** Render an ISO timestamp for card/feed provenance — compact (no seconds; year only when it differs from now). A non-date passes through verbatim, absent is null. */
export function formatWhen(timestamp?: string): string | null {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return timestamp;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
  });
}
