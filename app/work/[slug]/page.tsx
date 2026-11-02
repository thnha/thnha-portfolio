import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ProjectMedia } from "@/components/ProjectMedia";
import { StatList } from "@/components/StatList";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { cssVars, cx } from "@/lib/css";
import styles from "./page.module.css";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${profile.displayName}`,
    description: project.problem,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <div className={styles.page} style={cssVars({ "--accent": project.accent, "--c": project.accent })}>
      <Nav />
      <main className={cx("shell", styles.main)}>
        <Link className={styles.back} href={`/#work-${project.slug}`}>
          ← All work
        </Link>
        <header className={styles.header}>
          <span className="eyebrow">{project.period}</span>
          <h1 className={styles.title}>{project.title}</h1>
          <StatList metrics={project.metrics} tone="accent" />
        </header>
        <ProjectMedia media={project.media} preload />
        <dl className={styles.body}>
          <div>
            <dt>Context</dt>
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
          <div>
            <dt>Stack</dt>
            <dd>
              <ul className={styles.stack}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        {project.links.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link) => (
              <a key={link.href} className="btn btn-ghost" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
