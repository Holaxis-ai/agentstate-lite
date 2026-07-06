/**
 * A minimal ULID (Universally Unique Lexicographically Sortable Identifier) generator —
 * Crockford Base32, 48-bit millisecond timestamp + 80 bits of CSPRNG randomness, 26
 * characters. No dependency: `crypto.getRandomValues` (Web Crypto, available natively in
 * both Node and the Workers runtime) is the only primitive used.
 *
 * This is the app-internal id minted for every `users.id` row and every `auth_events.id`
 * (Stage-2 auth Part A, `migrations/0002_auth.sql`'s header comment) — deliberately NOT an
 * upstream identity. Monotonicity within the same millisecond is NOT implemented (the spec
 * permits but does not require it): two ids minted in the same millisecond sort by their
 * (independent, uniformly random) randomness component, not by mint order. That is
 * immaterial here — these ids are opaque primary keys, never relied on for ordering
 * (`auth_events` orders by its own `at` column, not by id).
 */

// Crockford Base32: excludes I, L, O, U to avoid visual confusion with 1, 1, 0, V.
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(time: number, len: number): string {
  let str = "";
  let t = time;
  for (let i = len - 1; i >= 0; i--) {
    const mod = t % 32;
    str = ENCODING[mod] + str;
    t = (t - mod) / 32;
  }
  return str;
}

function encodeRandom(len: number): string {
  // 256 is exactly divisible by 32, so `byte % 32` on a uniform byte is itself
  // uniform over [0, 32) — no modulo-bias correction needed.
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let str = "";
  for (let i = 0; i < len; i++) {
    str += ENCODING[bytes[i]! % 32];
  }
  return str;
}

/** A fresh ULID: 10 chars of millisecond timestamp + 16 chars of randomness. */
export function ulid(now: number = Date.now()): string {
  return encodeTime(now, 10) + encodeRandom(16);
}
