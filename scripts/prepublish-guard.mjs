// `prepublishOnly` guard for @holaxis/aslite. The retained-artifact release model forbids building
// a SECOND candidate at publish time: the tarball that ships must be the exact one the
// release-candidate command built, packed, and the workflow staged and inspected. A direct
// `npm publish` from the package directory would re-pack a fresh tarball whose bytes nobody
// verified or staged — so this guard REFUSES that path outright.
//
// It never builds and never packs. If `ASLITE_RELEASE_TARBALL` points at a retained tarball, it
// re-proves that exact artifact through the no-build/no-pack verifier (optionally cross-checking
// `ASLITE_RELEASE_MANIFEST`); otherwise it fails closed and points at the staged-release path.
import { verifyRetainedTarball } from "./verify-npm-package.mjs";

const tarball = process.env.ASLITE_RELEASE_TARBALL?.trim();
const manifest = process.env.ASLITE_RELEASE_MANIFEST?.trim() || null;

if (!tarball) {
  console.error(
    "prepublishOnly refused: @holaxis/aslite is published through the staged-release workflow, not a\n" +
      "direct `npm publish`. Build the retained candidate with `npm run release:candidate -- --tag <v..>\n" +
      "--commit <sha>`, then stage/approve it. This guard never builds or packs a second candidate.\n" +
      "(To verify an already-retained tarball here, set ASLITE_RELEASE_TARBALL=<path> [and\n" +
      "ASLITE_RELEASE_MANIFEST=<candidate.json>].)",
  );
  process.exit(1);
}

try {
  const result = await verifyRetainedTarball({ tarball, manifest });
  console.log(`prepublish guard: verified retained ${result.package} (${result.tarball.sha256}); no rebuild, no repack`);
} catch (error) {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
}
