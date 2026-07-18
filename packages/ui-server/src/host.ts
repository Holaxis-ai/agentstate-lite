// Host allowlist for the loopback UI server (plans/ui-v1.md rev 3.2, "Host check (exact algorithm,
// review-pinned)"): parse `Host`, strip the port (bracket-aware for IPv6), then EXACT-match
// against a fixed set — never substring (a substring check reopens DNS rebinding: a hostile
// DNS name like "127.0.0.1.evil.example" would pass a naive `.includes("127.0.0.1")`).

const ALLOWED_HOSTS: ReadonlySet<string> = new Set(["localhost", "127.0.0.1", "::1"]);

/** Strip a `Host` header down to just the hostname (drop `:port`, bracket-aware for an IPv6 literal like `[::1]:8080`). */
export function hostnameOf(hostHeader: string): string {
  const h = hostHeader.trim();
  if (h.startsWith("[")) {
    const end = h.indexOf("]");
    return end === -1 ? h : h.slice(1, end);
  }
  const colon = h.lastIndexOf(":");
  return colon === -1 ? h : h.slice(0, colon);
}

/** True iff `hostHeader` (after stripping the port) is EXACTLY one of the loopback names/literals — never a substring match. */
export function isAllowedHost(hostHeader: string | null | undefined): boolean {
  if (!hostHeader) return false;
  return ALLOWED_HOSTS.has(hostnameOf(hostHeader));
}
