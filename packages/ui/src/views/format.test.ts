/** formatWhen pins (review follow-up): compact — never seconds; year only when it differs from now; non-dates pass through; absent is null. Locale-agnostic assertions (shape, not exact strings). */
import { describe, expect, it } from "vitest";
import { formatWhen } from "./format.js";

describe("formatWhen", () => {
  it("absent → null; a non-date passes through verbatim", () => {
    expect(formatWhen(undefined)).toBeNull();
    expect(formatWhen("")).toBeNull();
    expect(formatWhen("not-a-date")).toBe("not-a-date");
  });

  it("renders without seconds", () => {
    const out = formatWhen(new Date().toISOString())!;
    expect(out).not.toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  it("omits the year for the current year, includes it for another year", () => {
    const now = new Date();
    const sameYear = formatWhen(now.toISOString())!;
    expect(sameYear).not.toContain(String(now.getFullYear()));
    const old = formatWhen("2001-03-05T10:30:00.000Z")!;
    expect(old).toContain("2001");
  });
});
