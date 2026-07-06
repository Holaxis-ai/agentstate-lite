import { describe, expect, it } from "vitest";
import { ApiError } from "../api/client.js";
import { classifyWriteError } from "./conflict.js";

describe("classifyWriteError", () => {
  it("maps a 412 ApiError to a conflict state carrying expected/actual", () => {
    const err = new ApiError(412, "VERSION_CONFLICT", "stale head", { expected: "v1", actual: "v2" });
    expect(classifyWriteError(err)).toEqual({ kind: "conflict", expected: "v1", actual: "v2", message: "stale head" });
  });

  it("tolerates a 412 with no details", () => {
    const err = new ApiError(412, "VERSION_CONFLICT", "stale head");
    expect(classifyWriteError(err)).toEqual({ kind: "conflict", expected: undefined, actual: undefined, message: "stale head" });
  });

  it("does not classify a non-412 ApiError as a conflict", () => {
    const err = new ApiError(404, "NOT_FOUND", "gone");
    expect(classifyWriteError(err)).toEqual({ kind: "none" });
  });

  it("does not classify a non-ApiError throw as a conflict", () => {
    expect(classifyWriteError(new Error("network down"))).toEqual({ kind: "none" });
  });
});
