import Image from "next/image";
import type { ImageAsset, ProjectMedia as Media } from "@/content/types";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import styles from "./ProjectMedia.module.css";

function Picture({ image, sizes, preload }: { image: ImageAsset; sizes: string; preload?: boolean }) {
  return (
    <Image
      src={assetPath(image.src)}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      preload={preload}
    />
  );
}

export function ProjectMedia({ media, preload }: { media: Media; preload?: boolean }) {
  if (media.kind === "placeholder") {
    return (
      <div className={cx(styles.frame, styles.dark)}>
        <span className={styles.placeholder}>{media.text}</span>
      </div>
    );
  }

  if (media.kind === "phones") {
    const credit = media.images.find((image) => image.credit)?.credit;
    return (
      <div className={cx(styles.frame, styles.dark)}>
        <div className={styles.phones}>
          {media.images.map((image) => (
            <Picture key={image.src} image={image} sizes="(max-width: 820px) 30vw, 200px" preload={preload} />
          ))}
        </div>
        {credit && <span className={styles.credit}>{credit}</span>}
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <Picture image={media.image} sizes="(max-width: 820px) 100vw, 640px" preload={preload} />
      {media.image.credit && <span className={styles.credit}>{media.image.credit}</span>}
    </div>
  );
}
