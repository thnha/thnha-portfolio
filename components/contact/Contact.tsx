import { Fragment } from "react";
import { profile } from "@/content/profile";
import { contactCopy } from "@/content/sections";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import { visibleMetrics } from "@/lib/visibility";
import styles from "./Contact.module.css";

export function Contact() {
  const { cv, linkedin, github, email } = profile.links;
  const lighthouse = profile.lighthouse ? visibleMetrics([profile.lighthouse])[0] : undefined;

  return (
    <footer id="contact" className={styles.contact}>
      <div className="shell">
        <span className="eyebrow">{contactCopy.eyebrow}</span>
        <h2 className={styles.title}>
          {contactCopy.headline.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
        <a className={styles.mail} href={`mailto:${email}`}>
          {email} ↗
        </a>
        <div className={styles.actions}>
          {cv && (
            <a className={cx("btn btn-solid", styles.primary)} href={assetPath(cv)} download>
              Download CV (PDF) ↓
            </a>
          )}
          {linkedin && (
            <a className="btn btn-ghost" href={linkedin} target="_blank" rel="noreferrer">
              View LinkedIn ↗
            </a>
          )}
        </div>
        <p className={styles.availability}>
          {profile.location} · {profile.availability}
        </p>
        <div className={styles.foot}>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>
            Built with Next.js · static export
            {lighthouse && (
              <>
                {" "}
                · Lighthouse <b className={cx(lighthouse.sample && styles.sample)}>{lighthouse.value}</b>
              </>
            )}
          </span>
          <div className={styles.footLinks}>
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            )}
            {cv && (
              <a href={assetPath(cv)} download>
                CV ↓
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
