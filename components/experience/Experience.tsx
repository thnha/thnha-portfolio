import { SectionHeader } from "@/components/SectionHeader";
import { careerArc, experience } from "@/content/experience";
import { experienceCopy } from "@/content/sections";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHeader {...experienceCopy} />
        <ol className={styles.arc}>
          {careerArc.map((milestone) => (
            <li key={milestone.year}>
              <b>{milestone.year}</b>
              {milestone.label}
            </li>
          ))}
        </ol>
        <div className={styles.timeline}>
          {experience.map((entry) => (
            <article key={entry.period} className={styles.entry}>
              <span className={styles.period}>{entry.period}</span>
              <div>
                <h3 className={styles.company}>{entry.company}</h3>
                <span className={styles.role}>{entry.title}</span>
              </div>
              <div>
                <ul className={styles.points}>
                  {entry.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className={styles.tags}>
                  {entry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
