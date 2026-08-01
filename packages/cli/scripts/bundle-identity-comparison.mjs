// Marketplace artifacts retain their complete, honest build identity at runtime. Content-drift
// decisions have a different question: did the executable CONTENT change, or only the source
// commit/dirty stamp? Normalize exactly those two fields in the one esbuild-emitted baked identity
// assignment before comparing. Everything else — code, package identity, channel, contracts —
// remains byte-significant.

const BAKED_IDENTITY_MARKER = "define_ASLITE_BUILD_IDENTITY_default";
const BAKED_IDENTITY_ASSIGNMENT_MARKER = new RegExp(
  String.raw`\b${BAKED_IDENTITY_MARKER}\s*=\s*\{`,
  "g",
);
const JSON_STRING = String.raw`"(?:\\.|[^"\\])*"`;
const BAKED_IDENTITY_ASSIGNMENT = new RegExp(
  String.raw`(${BAKED_IDENTITY_MARKER}\s*=\s*\{\s*schema:\s*"aslite\.build-identity\.v1"\s*,\s*package:\s*\{\s*name:\s*${JSON_STRING}\s*,\s*version:\s*${JSON_STRING}\s*\}\s*,\s*source:\s*\{\s*commit:\s*)(?:null|"[a-f0-9]{40}")(\s*,\s*dirty:\s*)(?:null|true|false)(\s*\}\s*,\s*artifact:\s*\{\s*channel:\s*"(?:npm-package|local-dev|marketplace-legacy)"\s*\}\s*,\s*compatibility_contracts:\s*\{\s*skill:\s*[1-9]\d*\s*,\s*hook:\s*[1-9]\d*\s*,\s*mcp:\s*[1-9]\d*\s*\}\s*\};)`,
  "g",
);

function utf8Text(bytes) {
  const input = Buffer.from(bytes);
  const text = input.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(input)) {
    throw new Error("bundle identity comparison requires valid UTF-8 executable bytes");
  }
  return text;
}

/**
 * Return comparison bytes with only baked source.commit/source.dirty canonicalized.
 *
 * A legacy bundle with no identity marker stays raw so the first identity-bearing artifact is a
 * real migration. Once the marker exists, cardinality and shape are strict: duplicates or an
 * unrecognized assignment fail closed instead of silently hiding drift.
 */
export function normalizeBundleBuildSource(bytes) {
  const text = utf8Text(bytes);
  // esbuild legitimately emits the variable name in its declaration and at each runtime read.
  // Count only assignment sites: that is the single build-time literal this comparator owns.
  const markerCount = [...text.matchAll(BAKED_IDENTITY_ASSIGNMENT_MARKER)].length;
  if (markerCount === 0) return Buffer.from(bytes);
  if (markerCount !== 1) {
    throw new Error(`expected exactly one baked build identity marker, found ${markerCount}`);
  }

  let replacements = 0;
  const normalized = text.replace(BAKED_IDENTITY_ASSIGNMENT, (_match, prefix, dirtyPrefix, suffix) => {
    replacements += 1;
    return `${prefix}null${dirtyPrefix}null${suffix}`;
  });
  if (replacements !== 1) {
    throw new Error("baked build identity marker is present but its assignment shape is invalid");
  }
  return Buffer.from(normalized, "utf8");
}

export function bundleContentEqual(left, right) {
  if (left === null || right === null) return left === right;
  return normalizeBundleBuildSource(left).equals(normalizeBundleBuildSource(right));
}
