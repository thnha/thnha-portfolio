import { SectionHeader } from "@/components/SectionHeader";
import { buildSteps, stack } from "@/content/build";
import { buildCopy } from "@/content/sections";
import styles from "./HowIBuild.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function HowIBuild() {
  return (
    <section id="build" className="section">
      <div className="shell">
        <SectionHeader {...buildCopy} />
        <ol className={styles.steps}>
          {buildSteps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number}>{pad(i + 1)}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <dl className={styles.stack}>
          {stack.map((row) => (
            <div key={row.area}>
              <dt>{row.area}</dt>
              <dd>{row.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
