import { describe, expect, it } from "vitest";
import { cssVars, cx } from "./css";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("cssVars", () => {
  it("returns custom properties as a style object", () => {
    expect(cssVars({ "--accent": "#8b7cff" })).toEqual({ "--accent": "#8b7cff" });
  });
});
