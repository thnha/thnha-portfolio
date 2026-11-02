import Link from "next/link";
import { ProjectMedia } from "@/components/ProjectMedia";
import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { projects } from "@/content/projects";
import { workCopy } from "@/content/sections";
import { cssVars } from "@/lib/css";
import styles from "./SelectedWork.module.css";

export function SelectedWork() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHeader {...workCopy} />
        {projects.map((project) => (
          <article key={project.slug} id={`work-${project.slug}`} className={styles.project} style={cssVars({ "--c": project.accent })}>
            <ProjectMedia media={project.media} />
            <div>
              <span className={styles.period}>{project.period}</span>
              <h3 className={styles.title}>{project.title}</h3>
              <StatList metrics={project.metrics} tone="accent" className={styles.stats} />
              <dl className={styles.qa}>
                <div>
                  <dt>Problem</dt>
                  <dd>{project.problem}</dd>
                </div>
                {project.role && (
                  <div>
                    <dt>My role</dt>
                    <dd>{project.role}</dd>
                  </div>
                )}
                {project.hardPart && (
                  <div>
                    <dt>Hard part</dt>
                    <dd>{project.hardPart}</dd>
                  </div>
                )}
              </dl>
              <div className={styles.links}>
                <Link className={styles.primaryLink} href={`/work/${project.slug}/`}>
                  Read case study →
                </Link>
                {project.links.map((link) => (
                  <a key={link.href} className={styles.subtleLink} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
