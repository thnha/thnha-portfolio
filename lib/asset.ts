const REMOTE = /^(https?:)?\/\//;

/**
 * Next.js adds the GitHub Pages base path to <Link> and static imports,
 * but not to plain string paths used in <a href>, <img src> or <video src>.
 */
export function assetPath(src: string, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): string {
  if (REMOTE.test(src) || !src.startsWith("/")) return src;
  return `${basePath}${src}`;
}
