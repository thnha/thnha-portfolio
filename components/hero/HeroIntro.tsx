import { StatList } from "@/components/StatList";
import { profile } from "@/content/profile";
import { heroCopy } from "@/content/sections";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import styles from "./hero.module.css";

export function HeroIntro() {
  const { cv, linkedin } = profile.links;
  return (
    <div className={styles.intro}>
      <p className={cx("eyebrow", styles.theme)}>{heroCopy.theme}</p>
      <h1 className={styles.title}>
        {profile.displayName}
        <span className={styles.role}>{profile.role}</span>
      </h1>
      <p className={styles.lede}>
        {heroCopy.lede.before}
        <strong>{heroCopy.lede.strong}</strong>
        {heroCopy.lede.after}
      </p>
      <StatList metrics={profile.proof} className={styles.proof} />
      <div className={styles.actions}>
        <a className={cx("btn btn-ghost", styles.workLink)} href="#work">
          Selected work ↓
        </a>
        {cv && (
          <a className="btn btn-ghost" href={assetPath(cv)} download>
            Download CV ↓
          </a>
        )}
        {linkedin && (
          <a className="btn btn-ghost" href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        )}
      </div>
    </div>
  );
}
