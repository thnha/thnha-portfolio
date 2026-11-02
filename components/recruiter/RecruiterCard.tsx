import Image from "next/image";
import { profile } from "@/content/profile";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import { CopyEmailButton } from "./CopyEmailButton";
import styles from "./RecruiterCard.module.css";

export function RecruiterCard() {
  const { cv, linkedin, email } = profile.links;
  return (
    <section id="recruiter" className={styles.section} aria-labelledby="recruiter-title">
      <div className="shell">
        <div className={styles.card}>
          <div className={styles.who}>
            <div className={styles.avatar}>
              {profile.photo ? (
                <Image
                  src={assetPath(profile.photo.src)}
                  alt={profile.photo.alt}
                  width={profile.photo.width}
                  height={profile.photo.height}
                  sizes="84px"
                />
              ) : (
                <span aria-hidden>{profile.initials}</span>
              )}
            </div>
            <div>
              <h2 id="recruiter-title" className="eyebrow">
                For recruiters · 10-second read
              </h2>
              <p className={styles.intro}>{profile.intro}</p>
            </div>
          </div>
          <dl className={styles.facts}>
            {profile.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.actions}>
            {cv && (
              <a className={cx("btn btn-solid", styles.primary)} href={assetPath(cv)} download>
                Download CV ↓
              </a>
            )}
            {linkedin && (
              <a className="btn btn-ghost" href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            )}
            <CopyEmailButton email={email} />
          </div>
        </div>
      </div>
    </section>
  );
}
