import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && specifier.endsWith(".js")) {
      const tsSpecifier = specifier.slice(0, -3) + ".ts";
      try {
        const url = new URL(tsSpecifier, context.parentURL).href;
        if (existsSync(fileURLToPath(url))) return nextResolve(tsSpecifier, context);
      } catch {
        // Fall through to normal resolution.
      }
    }
    return nextResolve(specifier, context);
  },
});
