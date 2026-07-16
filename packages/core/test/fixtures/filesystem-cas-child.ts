import { FilesystemBackend } from "../../src/backend.js";
import { VersionConflict } from "../../src/versioning.js";

const [root, expectedVersion, body] = process.argv.slice(2);

if (!root || !expectedVersion || !body) {
  throw new Error("usage: filesystem-cas-child <root> <expected-version> <body>");
}

process.send?.({ type: "attempting" });

try {
  const backend = new FilesystemBackend(root);
  const version = await backend.write(
    "shared",
    {
      id: "shared",
      frontmatter: { type: "Concept", timestamp: "2026-07-16T00:00:00.000Z" },
      body,
    },
    { expectedVersion },
  );
  process.send?.({ type: "result", status: "fulfilled", version, body });
} catch (err) {
  if (err instanceof VersionConflict) {
    process.send?.({
      type: "result",
      status: "conflict",
      expected: err.expected,
      actual: err.actual,
      body,
    });
  } else {
    process.send?.({
      type: "result",
      status: "error",
      message: err instanceof Error ? err.stack ?? err.message : String(err),
      body,
    });
    process.exitCode = 1;
  }
}
