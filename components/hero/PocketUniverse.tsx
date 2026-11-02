"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { StatList } from "@/components/StatList";
import type { HeroApp } from "@/content/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cssVars, cx } from "@/lib/css";
import { orbitPoint, orbitSide, type OrbitSize } from "@/lib/orbit";
import styles from "./hero.module.css";
import { PhoneScreen } from "./PhoneScreen";

const DESKTOP = "(min-width: 821px)";
const CAN_TILT = "(hover: hover) and (prefers-reduced-motion: no-preference)";
const ARROW_STEP: Partial<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { apps: readonly HeroApp[]; intro: ReactNode };

export function PocketUniverse({ apps, intro }: Props) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState<OrbitSize | null>(null);
  const desktop = useMediaQuery(DESKTOP);
  const canTilt = useMediaQuery(CAN_TILT);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const app = apps[index];

  useEffect(() => {
    const stage = stageRef.current;
    const phone = phoneRef.current;
    if (!stage || !phone) return;
    const observer = new ResizeObserver(() => {
      setSize({ stageWidth: stage.clientWidth, phoneWidth: phone.offsetWidth, phoneHeight: phone.offsetHeight });
    });
    observer.observe(stage);
    observer.observe(phone);
    return () => observer.disconnect();
  }, []);

  function onIconsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = apps.length - 1;
    else {
      const step = ARROW_STEP[event.key];
      if (!step) return;
      next = (index + step + apps.length) % apps.length;
    }
    event.preventDefault();
    setIndex(next);
    iconRefs.current[next]?.focus();
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const tilt = tiltRef.current;
    if (!canTilt || !tilt) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 10}deg)`;
  }

  function onPointerLeave() {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  }

  return (
    <section id="top" className={styles.hero} style={cssVars({ "--accent": app.accent })}>
      <div className={cx("shell", styles.grid)}>
        {intro}

        <div ref={stageRef} className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          <div className={cx(styles.orbit, styles.orbitOuter)} aria-hidden />
          <div className={cx(styles.orbit, styles.orbitInner)} aria-hidden />

          <div ref={tiltRef} className={styles.tilt}>
            <div ref={phoneRef} className={styles.phone}>
              <div className={styles.screen}>
                <div className={styles.island} aria-hidden />
                {apps.map((item) => (
                  <PhoneScreen key={item.id} app={item} active={item.id === app.id} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.icons} data-ready={desktop && size ? "" : undefined} role="group" aria-label="Choose an app" onKeyDown={onIconsKeyDown}>
            {apps.map((item, i) => {
              const selected = i === index;
              const point = desktop && size ? orbitPoint(i, selected, size) : null;
              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    iconRefs.current[i] = element;
                  }}
                  type="button"
                  className={cx(styles.icon, styles[orbitSide(i)])}
                  style={{
                    ...cssVars({ "--c": item.accent }),
                    transform: point ? `translate(${point.x}px, ${point.y}px) scale(${point.scale})` : undefined,
                  }}
                  aria-pressed={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-label={item.name}
                  onClick={() => setIndex(i)}
                >
                  {item.monogram}
                  <span className={styles.iconLabel} aria-hidden>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className={styles.panel}>
          <span className="sr-only" role="status">
            {app.name}, {index + 1} of {apps.length}
          </span>
          <div className={styles.kicker}>
            <span>Now exploring</span>
            <span>
              {pad(index + 1)} / {pad(apps.length)}
            </span>
          </div>
          <div key={app.id} className={styles.panelBody}>
            <h2 className={styles.panelTitle}>{app.name}</h2>
            <p className={styles.panelText}>{app.description}</p>
            <StatList metrics={app.metrics} tone="accent" className={styles.panelStats} />
            {(app.role || app.hardPart) && (
              <dl className={styles.facts}>
                {app.role && (
                  <div>
                    <dt>My role</dt>
                    <dd>{app.role}</dd>
                  </div>
                )}
                {app.hardPart && (
                  <div>
                    <dt>Hard part</dt>
                    <dd>{app.hardPart}</dd>
                  </div>
                )}
              </dl>
            )}
            <ul className={styles.tags}>
              {app.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <a className={cx("btn btn-solid", styles.panelCta)} href={app.cta?.href ?? `#work-${app.projectSlug}`}>
            {app.cta?.label ?? "Explore project →"}
          </a>
        </aside>
      </div>
    </section>
  );
}
