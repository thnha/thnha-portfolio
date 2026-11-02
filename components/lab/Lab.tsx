import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { LAB_STATUS_LABEL, labItems, repos } from "@/content/lab";
import { labCopy } from "@/content/sections";
import { assetPath } from "@/lib/asset";
import { cssVars, cx } from "@/lib/css";
import { visibleItems, visibleMetrics } from "@/lib/visibility";
import styles from "./Lab.module.css";

export function Lab() {
  const items = visibleItems(labItems);
  const visibleRepos = visibleItems(repos);
  if (items.length === 0 && visibleRepos.length === 0) return null;

  return (
    <section id="lab" className="section">
      <div className="shell">
        <SectionHeader {...labCopy} />

        {items.length > 0 && (
          <div className={styles.grid}>
            {items.map((item) => {
              const links = item.links.filter((link) => link.href);
              return (
                <article key={item.title} className={styles.card} style={cssVars({ "--c": item.accent })}>
                  <div className={styles.media}>
                    {item.image ? (
                      <Image
                        src={assetPath(item.image.src)}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        sizes="(max-width: 820px) 100vw, 400px"
                      />
                    ) : (
                      <span>Screenshot / video</span>
                    )}
                  </div>
                  <div className={styles.body}>
                    <div className={styles.top}>
                      <span className={styles.badge}>{LAB_STATUS_LABEL[item.status]}</span>
                      <span className={styles.kind}>{item.kind}</span>
                    </div>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.text}>{item.description}</p>
                    <StatList metrics={item.metrics} tone="accent" size="compact" />
                    <p className={styles.built}>{item.builtWith}</p>
                    {links.length > 0 && (
                      <div className={styles.links}>
                        {links.map((link) => (
                          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {visibleRepos.length > 0 && (
          <>
            <h3 className={styles.subheading}>Open source</h3>
            <div className={styles.repos}>
              {visibleRepos.map((repo) => {
                const stars = repo.stars ? visibleMetrics([repo.stars])[0] : undefined;
                const content = (
                  <>
                    <span className={styles.repoName}>{repo.name}</span>
                    <p>{repo.description}</p>
                    <span className={styles.meta}>
                      <span>{repo.languages}</span>
                      {stars && (
                        <span>
                          ★ <b className={cx(stars.sample && styles.sample)}>{stars.value}</b>
                        </span>
                      )}
                    </span>
                  </>
                );
                return repo.href ? (
                  <a key={repo.name} className={styles.repo} href={repo.href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={repo.name} className={styles.repo}>
                    {content}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
