/**
 * A fixed-window per-key rate limiter — Stage-2 auth Part A's SETTLED adjudication:
 * "a simple fixed-window in-memory per-isolate limiter on /v0/join and on auth
 * FAILURES... honestly documented in code as per-isolate best-effort (production
 * hardening = Cloudflare WAF rules, one README note); a Durable-Object limiter is
 * deliberate non-scope."
 *
 * PER-ISOLATE, BEST-EFFORT ONLY: state lives in a plain in-memory `Map`, scoped to
 * whichever `FixedWindowLimiter` instance holds it. A Cloudflare Worker may run MANY
 * concurrent isolates (across colos, or spun up fresh after idling) — each gets its
 * OWN counters, so this does not enforce a global cap across the whole deployment, and
 * an isolate recycle silently resets it. `worker.ts` constructs its limiters ONCE at
 * module scope (not per-request) specifically so counts persist across requests within
 * ONE isolate's lifetime — the best this primitive can honestly promise. A determined
 * attacker distributing requests across many isolates/colos is NOT stopped by this
 * alone; real production hardening is Cloudflare's own edge WAF/rate-limiting rules
 * (see the worker package README), not a bigger version of this class.
 */
export class FixedWindowLimiter {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Record one attempt for `key` and report whether it is still within the current
   * window's limit. Always records (even a refused attempt counts), so a caller
   * hammering the endpoint cannot reset its own window by probing.
   */
  check(key: string): boolean {
    const now = Date.now();
    const bucket = this.windows.get(key);
    if (!bucket || now >= bucket.resetAt) {
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (bucket.count >= this.limit) return false;
    bucket.count++;
    return true;
  }
}

/** The two limiters Part A's design calls for, both 10 attempts/minute/key by default. */
export interface RateLimiters {
  /** Guards `POST /v0/join` — invite-token brute-forcing / spam-joining. */
  join: FixedWindowLimiter;
  /** Guards repeated failed-credential attempts across every OTHER route. */
  authFailure: FixedWindowLimiter;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;

export function createRateLimiters(
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimiters {
  return {
    join: new FixedWindowLimiter(limit, windowMs),
    authFailure: new FixedWindowLimiter(limit, windowMs),
  };
}

/** Best-effort caller IP: Cloudflare's own header, falling back to a generic forwarded-for, else a constant bucket. */
export function clientIp(req: Request): string {
  return req.headers.get("CF-Connecting-IP") ?? req.headers.get("X-Forwarded-For") ?? "unknown";
}
