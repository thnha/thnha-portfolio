/** A number shown on the page. */
export type Metric = {
  value: string;
  label: string;
  /** Where the number comes from. Never rendered. */
  source?: string;
  /** Placeholder number: SAMPLE badge in development, removed from production builds. */
  sample?: boolean;
};

export type Link = { label: string; href: string };

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Shown over temporary third-party images. */
  credit?: string;
};

export type ProjectMedia =
  | { kind: "image"; image: ImageAsset }
  | { kind: "phones"; images: readonly ImageAsset[] }
  | { kind: "placeholder"; text: string };

export type HeroScreen = "salonsoft" | "bookedby" | "checkin" | "hardware" | "ordering";

export type HeroApp = {
  id: HeroScreen;
  monogram: string;
  name: string;
  accent: string;
  projectSlug: string;
  description: string;
  role?: string;
  hardPart?: string;
  tags: readonly string[];
  metrics: readonly Metric[];
  /** Replaces the mock UI. */
  screenshot?: ImageAsset;
  /** Screen recording; replaces screenshot and mock UI. */
  video?: string;
  /** Overrides the default "Explore project" button. */
  cta?: Link;
};

export type Project = {
  slug: string;
  shortTitle: string;
  title: string;
  period: string;
  accent: string;
  media: ProjectMedia;
  problem: string;
  role?: string;
  hardPart?: string;
  metrics: readonly Metric[];
  stack: readonly string[];
  links: readonly Link[];
};

export type Capability = {
  title: string;
  text: string;
  accent: string;
  projectSlug: string;
  demoHref?: string;
  metrics: readonly Metric[];
};

export type LabStatus = "live" | "ai" | "wip";

export type LabItem = {
  status: LabStatus;
  kind: string;
  title: string;
  description: string;
  builtWith: string;
  accent: string;
  metrics: readonly Metric[];
  image?: ImageAsset;
  links: readonly Link[];
  draft?: boolean;
};

export type Repo = {
  name: string;
  description: string;
  languages: string;
  stars?: Metric;
  href?: string;
  draft?: boolean;
};

export type ExperienceEntry = {
  period: string;
  company: string;
  title: string;
  points: readonly string[];
  tags: readonly string[];
};

export type CareerMilestone = { year: string; label: string };

export type BuildStep = { title: string; text: string };

export type StackRow = { area: string; items: string };

export type Profile = {
  name: string;
  displayName: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  intro: string;
  photo?: ImageAsset;
  facts: readonly { label: string; value: string }[];
  links: { cv?: string; linkedin?: string; github?: string; email: string };
  proof: readonly Metric[];
  lighthouse?: Metric;
};

export type SectionCopy = {
  eyebrow: string;
  /** One string per line; rendered with a line break between lines. */
  title: readonly string[];
  aside?: string;
};

export type HeroCopy = {
  theme: string;
  lede: { before: string; strong: string; after: string };
};

export type ContactCopy = { eyebrow: string; headline: readonly string[] };
