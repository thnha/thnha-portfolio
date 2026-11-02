import Link from "next/link";
import { hasLabContent } from "@/content/lab";
import { profile } from "@/content/profile";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import styles from "./Nav.module.css";

const NAV_ITEMS = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#hardware-lab", label: "Demo" },
  { href: "/#work", label: "Work" },
  { href: "/#lab", label: "Lab", needsLab: true },
  { href: "/#experience", label: "Experience" },
];

export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { cv, linkedin } = profile.links;
  const showLab = hasLabContent();
  return (
    <header className={cx("shell", styles.nav, overlay && styles.overlay)}>
      <Link className={styles.brand} href="/">
        <i aria-hidden />
        {profile.displayName}
      </Link>
      <nav className={styles.links} aria-label="Main">
        {NAV_ITEMS.filter((item) => showLab || !item.needsLab).map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        {linkedin && (
          <a className={styles.linkedin} href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        )}
        {cv && (
          <a className={styles.cv} href={assetPath(cv)} download>
            CV ↓
          </a>
        )}
      </div>
    </header>
  );
}
