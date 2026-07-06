/**
 * Secret material for Stage-2 auth Part A: API keys and invite tokens. SETTLED design
 * (adversarial best-practices review, see the team-lead brief):
 *
 * - Keys AND invite tokens are 256-bit CSPRNG random values (`crypto.getRandomValues`),
 *   base64url-encoded, shown to the caller exactly ONCE (the mint/join response) and
 *   NEVER stored or logged raw.
 * - At rest they are HMAC-SHA-256(`KEY_PEPPER`, token) — a Worker secret, fail-closed
 *   like `API_KEY` when unset (see `auth.ts`'s gate). Lookup is by an INDEXED equality
 *   query on the resulting digest (`invites.token_hash` / `api_keys.key_hash`, both
 *   `UNIQUE`), not a constant-time compare in application code: the value being looked
 *   up is already the HMAC output, and indexed-hash-then-lookup is the standard
 *   API-key-storage pattern (the same approach Stripe/GitHub use) — there is no
 *   secret-dependent branching in application code for this path to leak timing
 *   through. The ROOT key comparison is different (a fixed, single secret compared on
 *   every request) and DOES use `auth.ts`'s `constantTimeEqual` — see that module.
 * - NO password KDF (argon2/scrypt/bcrypt) anywhere: those exist to slow down guessing
 *   a LOW-entropy human-chosen secret. These are high-entropy (256-bit) random tokens;
 *   a slow KDF would only cost the server CPU on every request for no security benefit.
 *
 * Key format: `aslk_<base64url>` — the prefix aids identification and secret-scanning
 * (e.g. a leaked-credential scanner grepping for `aslk_`). Invite tokens get an
 * analogous `aslinv_` prefix for the same reason (SETTLED design specifies this for
 * API keys; extending the same identification benefit to invite tokens is this
 * module's own additive choice, not a spec requirement).
 */

const textEncoder = new TextEncoder();

const RANDOM_BYTES = 32; // 256 bits

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomTokenBody(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(RANDOM_BYTES)));
}

/** A fresh, high-entropy API key: `aslk_<base64url>`. */
export function mintApiKeyToken(): string {
  return `aslk_${randomTokenBody()}`;
}

/** A fresh, high-entropy invite token: `aslinv_<base64url>`. */
export function mintInviteToken(): string {
  return `aslinv_${randomTokenBody()}`;
}

/** Humane identification fields persisted alongside a key's hash — never the secret itself. */
export interface TokenFingerprint {
  /** First 12 characters of the raw token (includes its type prefix). */
  prefix: string;
  /** Last 4 characters of the raw token. */
  lastFour: string;
}

export function fingerprint(rawToken: string): TokenFingerprint {
  return { prefix: rawToken.slice(0, 12), lastFour: rawToken.slice(-4) };
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * HMAC-SHA-256(`pepper`, `input`), hex-encoded — the at-rest form of every raw secret
 * this module mints (`invites.token_hash` / `api_keys.key_hash`). Uses Web Crypto's
 * `crypto.subtle`, available natively in both Node (>= 15) and the Workers runtime —
 * no `node:crypto` import needed, keeping this module Worker-clean.
 */
export async function hmacSha256Hex(pepper: string, input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(input));
  return toHex(new Uint8Array(signature));
}
