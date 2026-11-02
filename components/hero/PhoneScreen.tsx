"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { HeroApp } from "@/content/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { assetPath } from "@/lib/asset";
import { cssVars, cx } from "@/lib/css";
import styles from "./hero.module.css";
import { MOCK_SCREENS } from "./mockScreens";

type Props = { app: HeroApp; active: boolean };

/** Video, then screenshot, then mock UI. Video loads lazily and plays only while active. */
export function PhoneScreen({ app, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !reduceMotion) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, reduceMotion]);

  const Mock = MOCK_SCREENS[app.id];
  const hasMedia = Boolean(app.video || app.screenshot);

  return (
    <div
      className={cx(styles.app, active && styles.appActive, hasMedia && styles.appMedia)}
      style={cssVars({ "--c": app.accent })}
      aria-hidden={hasMedia ? !active : true}
    >
      {app.video ? (
        <video
          ref={videoRef}
          className={styles.media}
          src={assetPath(app.video)}
          poster={app.screenshot ? assetPath(app.screenshot.src) : undefined}
          muted
          loop
          playsInline
          preload="none"
        />
      ) : app.screenshot ? (
        <Image
          className={styles.media}
          src={assetPath(app.screenshot.src)}
          alt={app.screenshot.alt}
          width={app.screenshot.width}
          height={app.screenshot.height}
          sizes="270px"
        />
      ) : (
        <Mock />
      )}
      {app.screenshot?.credit && <span className={styles.credit}>{app.screenshot.credit}</span>}
    </div>
  );
}
