import { describe, expect, it } from "vitest";
import type { Metric } from "@/content/types";
import { visibleItems, visibleMetrics } from "./visibility";

const real: Metric = { value: "14+", label: "years" };
const sample: Metric = { value: "4.6★", label: "rating", sample: true };
const empty: Metric = { value: "  ", label: "downloads" };

describe("visibleMetrics", () => {
  it("drops empty values", () => {
    expect(visibleMetrics([real, empty], true)).toEqual([real]);
  });

  it("keeps samples when placeholders are shown", () => {
    expect(visibleMetrics([real, sample], true)).toEqual([real, sample]);
  });

  it("drops samples when placeholders are hidden", () => {
    expect(visibleMetrics([real, sample], false)).toEqual([real]);
  });
});

describe("visibleItems", () => {
  const items = [{ id: "a" }, { id: "b", draft: true }];

  it("keeps drafts when placeholders are shown", () => {
    expect(visibleItems(items, true)).toHaveLength(2);
  });

  it("drops drafts when placeholders are hidden", () => {
    expect(visibleItems(items, false)).toEqual([{ id: "a" }]);
  });
});
