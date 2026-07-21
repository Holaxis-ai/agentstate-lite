/**
 * Token-contract gate (designs/home-surface, Styling architecture): color literals live ONLY in
 * custom-property declarations (the token blocks — `:root` light, the dark-scheme override, any
 * future `data-theme` override). Components style through `var(--…)` tokens, so a rebrand is a
 * one-block edit and no surface can quietly invent an off-token color. Red-on-old: the pre-gate
 * stylesheet carried a raw `color: #fff` on `.action-apply`.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// vitest runs with cwd = this package's root; import.meta.url is a vite URL here, not file:.
const stylesPath = path.resolve(process.cwd(), "src/styles.css");

/** A line that DEFINES a token (`--name: value;`) — the only place a color literal may appear. */
const TOKEN_DECLARATION = /^\s*--[\w-]+\s*:/;
const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|hsl)a?\(/;

describe("styles.css token contract", () => {
  it("keeps color literals inside token declarations only", () => {
    const lines = readFileSync(stylesPath, "utf8").split("\n");
    const offenders = lines
      .map((line, index) => ({ line, number: index + 1 }))
      .filter(({ line }) => !TOKEN_DECLARATION.test(line) && COLOR_LITERAL.test(line));
    expect(
      offenders,
      `color literals outside token declarations:\n${offenders.map((o) => `  ${o.number}: ${o.line.trim()}`).join("\n")}`,
    ).toEqual([]);
  });
});
