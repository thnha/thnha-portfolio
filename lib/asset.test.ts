import { describe, expect, it } from "vitest";
import { assetPath } from "./asset";

describe("assetPath", () => {
  it("prefixes local paths with the base path", () => {
    expect(assetPath("/cv/cv.pdf", "/thnha-portfolio")).toBe("/thnha-portfolio/cv/cv.pdf");
  });

  it("leaves local paths alone without a base path", () => {
    expect(assetPath("/cv/cv.pdf", "")).toBe("/cv/cv.pdf");
  });

  it("leaves remote URLs unchanged", () => {
    const url = "https://nailsoft.com/wp-content/uploads/2024/01/check-in.png";
    expect(assetPath(url, "/thnha-portfolio")).toBe(url);
  });
});
