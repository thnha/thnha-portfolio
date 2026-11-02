import type { Metric } from "@/content/types";
import { cx } from "@/lib/css";
import { visibleMetrics } from "@/lib/visibility";
import styles from "./StatList.module.css";

type Props = {
  metrics: readonly Metric[];
  tone?: "plain" | "accent";
  size?: "default" | "compact";
  className?: string;
};

/** Renders visible metrics; renders nothing when none are left. */
export function StatList({ metrics, tone = "plain", size = "default", className }: Props) {
  const items = visibleMetrics(metrics);
  if (items.length === 0) return null;
  return (
    <dl className={cx(styles.list, tone === "accent" && styles.accent, size === "compact" && styles.compact, className)}>
      {items.map((metric) => (
        <div key={`${metric.value}-${metric.label}`} className={styles.item}>
          <dt className={styles.label}>{metric.label}</dt>
          <dd className={cx(styles.value, metric.sample && styles.sample)}>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
