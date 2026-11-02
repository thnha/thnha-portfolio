import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { capabilities } from "@/content/capabilities";
import { getProject } from "@/content/projects";
import { capabilitiesCopy } from "@/content/sections";
import { cssVars } from "@/lib/css";
import styles from "./Capabilities.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="shell">
        <SectionHeader {...capabilitiesCopy} />
        <div className={styles.grid}>
          {capabilities.map((capability, i) => {
            const project = getProject(capability.projectSlug);
            return (
              <article key={capability.title} className={styles.card} style={cssVars({ "--c": capability.accent })}>
                <span className={styles.number}>{pad(i + 1)}</span>
                <h3 className={styles.title}>{capability.title}</h3>
                <p className={styles.text}>{capability.text}</p>
                <StatList metrics={capability.metrics} size="compact" className={styles.stats} />
                <div className={styles.links}>
                  {project && <a href={`#work-${project.slug}`}>See it in {project.shortTitle} →</a>}
                  {capability.demoHref && <a href={capability.demoHref}>Try it live ↗</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
