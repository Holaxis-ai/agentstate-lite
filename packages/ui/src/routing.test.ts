import { describe, expect, it } from "vitest";
import { parseRoute, routeToSearch } from "./routing.js";

describe("parseRoute", () => {
  it("defaults to the board view for an empty search string", () => {
    expect(parseRoute("")).toEqual({ view: "board" });
  });

  it("defaults to the board view for an unrecognized view name", () => {
    expect(parseRoute("?view=bogus")).toEqual({ view: "board" });
  });

  it("parses a known view name", () => {
    expect(parseRoute("?view=admin")).toEqual({ view: "admin" });
  });

  it("parses a doc view with its id", () => {
    expect(parseRoute("?view=doc&id=tasks/foo")).toEqual({ view: "doc", id: "tasks/foo" });
  });

  it("accepts a search string with or without the leading '?'", () => {
    expect(parseRoute("view=graph")).toEqual({ view: "graph" });
  });

  it("drops an id param when the view isn't doc-shaped (still parses it — id is generic, not view-validated)", () => {
    // id is accepted on any view; only `view` itself is validated against the known set.
    expect(parseRoute("?view=board&id=x")).toEqual({ view: "board", id: "x" });
  });
});

describe("routeToSearch", () => {
  it("renders the bare board route as an empty string (the clean default URL)", () => {
    expect(routeToSearch({ view: "board" })).toBe("");
  });

  it("renders a non-board view", () => {
    expect(routeToSearch({ view: "admin" })).toBe("?view=admin");
  });

  it("renders a doc route with its id", () => {
    expect(routeToSearch({ view: "doc", id: "tasks/foo" })).toBe("?view=doc&id=tasks%2Ffoo");
  });
});

describe("parseRoute / routeToSearch round-trip", () => {
  it("round-trips every route shape", () => {
    const routes: Array<Parameters<typeof routeToSearch>[0]> = [
      { view: "board" },
      { view: "admin" },
      { view: "graph" },
      { view: "doc", id: "tasks/foo" },
    ];
    for (const route of routes) {
      expect(parseRoute(routeToSearch(route))).toEqual(route);
    }
  });
});
