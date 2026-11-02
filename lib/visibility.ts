import type { Metric } from "@/content/types";

/** Sample metrics and draft items show in `next dev`, never in a production build. */
export const SHOW_PLACEHOLDERS = process.env.NODE_ENV !== "production";

export function visibleMetrics(metrics: readonly Metric[], includeSamples = SHOW_PLACEHOLDERS): Metric[] {
  return metrics.filter((metric) => metric.value.trim() !== "" && (includeSamples || !metric.sample));
}

export function visibleItems<T extends { draft?: boolean }>(items: readonly T[], includeDrafts = SHOW_PLACEHOLDERS): T[] {
  return items.filter((item) => includeDrafts || !item.draft);
}
