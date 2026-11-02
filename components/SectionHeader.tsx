import { Fragment } from "react";
import type { SectionCopy } from "@/content/types";
import styles from "./SectionHeader.module.css";

type Props = SectionCopy;

export function SectionHeader({ eyebrow, title, aside }: Props) {
  return (
    <div className={styles.head}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className={styles.title}>
          {title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
      </div>
      {aside && <p className={styles.aside}>{aside}</p>}
    </div>
  );
}
