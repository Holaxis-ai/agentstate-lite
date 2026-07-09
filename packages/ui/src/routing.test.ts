import { describe, expect, it } from "vitest";
import { parseRoute, routeToSearch } from "./routing.js";

describe("parseRoute", () => {
  it("defaults to the launcher view for an empty search string", () => {
    expect(parseRoute("")).toEqual({ view: "launcher" });
  });

  it("defaults to the launcher for an unrecognized view name", () => {
    expect(parseRoute("?view=bogus")).toEqual({ view: "launcher" });
  });

  it("falls back to the launcher for a removed legacy view (e.g. a stale ?view=board deep link)", () => {
    expect(parseRoute("?view=board")).toEqual({ view: "launcher" });
    expect(parseRoute("?view=admin")).toEqual({ view: "launcher" });
  });

  it("parses a page view with its registry-doc id", () => {
    expect(parseRoute("?view=page&id=pages-registry/board")).toEqual({ view: "page", id: "pages-registry/board" });
  });

  it("accepts a search string with or without the leading '?'", () => {
    expect(parseRoute("view=page&id=x")).toEqual({ view: "page", id: "x" });
  });

  it("keeps an id param on the launcher (id is generic, not view-validated)", () => {
    expect(parseRoute("?id=x")).toEqual({ view: "launcher", id: "x" });
  });
});

describe("routeToSearch", () => {
  it("renders the bare launcher route as an empty string (the clean default URL)", () => {
    expect(routeToSearch({ view: "launcher" })).toBe("");
  });

  it("renders a page route with its id", () => {
    expect(routeToSearch({ view: "page", id: "pages-registry/board" })).toBe("?view=page&id=pages-registry%2Fboard");
  });
});

describe("parseRoute / routeToSearch round-trip", () => {
  it("round-trips every route shape", () => {
    const routes: Array<Parameters<typeof routeToSearch>[0]> = [
      { view: "launcher" },
      { view: "page", id: "pages-registry/board" },
    ];
    for (const route of routes) {
      expect(parseRoute(routeToSearch(route))).toEqual(route);
    }
  });
});
