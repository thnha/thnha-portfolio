# Pocket Universe Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current light CV-style home page with the recruiter-focused "Pocket Universe" portfolio (hero with orbiting apps, recruiter card, capabilities, hardware lab demo, selected work, lab, experience, how I build, contact) plus static case-study pages.

**Architecture:** Typed content modules in `content/` feed server components; only the hero, phone screens, hardware lab and copy-email button are client components. All non-trivial logic (placeholder filtering, base-path assets, orbit geometry, hardware simulation) lives in pure `lib/` modules covered by Vitest. Styling uses CSS Modules on top of global design tokens.

**Tech Stack:** Next.js 16.2.6 (App Router, static export), React 19.2.6, TypeScript 5.9 strict, CSS Modules, `next/font/google`, `next/image`, Vitest 4.1.12.

**Spec:** `docs/superpowers/specs/2026-11-02-pocket-universe-portfolio-design.md`
**Visual reference:** `docs/preview/pocket-universe.html` (open it in a browser to compare)

## Global Constraints

- Keep `next.config.ts` unchanged: `output: "export"`, `trailingSlash: true`, `basePath` = `/thnha-portfolio` only when `GITHUB_ACTIONS` is set, `images.unoptimized: true`.
- Only new dependency: `vitest@4.1.12` as an exact-pinned devDependency. No other packages.
- TypeScript strict; no `any`; no `!` non-null assertions; no `// @ts-ignore`; no `eslint-disable`.
- `npm run lint` must report zero problems; `npm run typecheck` must pass.
- Client components only: `components/hero/PocketUniverse.tsx`, `components/hero/PhoneScreen.tsx`, `components/hardware-lab/HardwareLab.tsx`, `components/recruiter/CopyEmailButton.tsx`.
- Placeholder rule: `sample: true` metrics and `draft: true` items render only when `process.env.NODE_ENV !== "production"`; empty `value` strings never render.
- Never put portfolio facts in components — all copy, numbers and links come from `content/`.
- Local asset paths (`/cv/...`, `/images/...`) must go through `assetPath()`; remote URLs pass through unchanged.
- Breakpoints: desktop orbit ≥ 821px; tablet layout ≤ 1200px; mobile layout ≤ 820px.
- Commit only when the owner explicitly asks. Each task ends with a checkpoint (`git status` + diff check), not a commit.

## File Structure

```
app/
  globals.css                     tokens, primitives (.shell .section .eyebrow .btn*), @property --accent
  layout.tsx                      fonts (Space Grotesk, Inter), metadata
  page.tsx                        composes sections
  work/[slug]/page.tsx            case study (static params)
  work/[slug]/page.module.css
components/
  Nav.tsx / Nav.module.css
  SectionHeader.tsx / SectionHeader.module.css
  StatList.tsx / StatList.module.css
  ProjectMedia.tsx / ProjectMedia.module.css
  hero/Hero.tsx                   server: wires Nav + HeroIntro into PocketUniverse
  hero/HeroIntro.tsx              server: name, role, lede, proof, buttons
  hero/PocketUniverse.tsx         client: selection, orbit, tilt, panel
  hero/PhoneScreen.tsx            client: video / screenshot / mock per app
  hero/mockScreens.tsx            mock phone UIs
  hero/hero.module.css
  hero/mockScreens.module.css
  recruiter/RecruiterCard.tsx / RecruiterCard.module.css
  recruiter/CopyEmailButton.tsx
  capabilities/Capabilities.tsx / Capabilities.module.css
  hardware-lab/HardwareLab.tsx / HardwareLab.module.css
  work/SelectedWork.tsx / SelectedWork.module.css
  lab/Lab.tsx / Lab.module.css
  experience/Experience.tsx / Experience.module.css
  build/HowIBuild.tsx / HowIBuild.module.css
  contact/Contact.tsx / Contact.module.css
content/
  types.ts  profile.ts  heroApps.ts  capabilities.ts  projects.ts  lab.ts  experience.ts  build.ts
  content.test.ts
hooks/
  useMediaQuery.ts
lib/
  visibility.ts (+ .test.ts)  asset.ts (+ .test.ts)  orbit.ts (+ .test.ts)
  css.ts (+ .test.ts)  hardware-sim.ts (+ .test.ts)
public/cv/Tran_Hoang_Nha_CV.pdf
vitest.config.ts
```

---

### Task 1: Test tooling and placeholder filtering

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `content/types.ts`
- Create: `lib/visibility.ts`
- Test: `lib/visibility.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `content/types.ts` — all content types (`Metric`, `Link`, `ImageAsset`, `ProjectMedia`, `HeroScreen`, `HeroApp`, `Project`, `Capability`, `LabStatus`, `LabItem`, `Repo`, `ExperienceEntry`, `CareerMilestone`, `BuildStep`, `StackRow`, `Profile`).
  - `lib/visibility.ts` — `SHOW_PLACEHOLDERS: boolean`, `visibleMetrics(metrics: readonly Metric[], includeSamples?: boolean): Metric[]`, `visibleItems<T extends { draft?: boolean }>(items: readonly T[], includeDrafts?: boolean): T[]`.
  - npm scripts `test:unit` and `test`.

- [ ] **Step 1: Install Vitest (exact version, dev only)**

Run:

```bash
npm install --save-dev --save-exact vitest@4.1.12
```

Expected: `package.json` devDependencies gains `"vitest": "4.1.12"` and `package-lock.json` updates.

- [ ] **Step 2: Add scripts**

In `package.json`, replace the `"test"` script and add `"test:unit"` so the `scripts` block reads:

```json
"scripts": {
  "install:ci": "bash scripts/install-ci.sh",
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "npm run test:unit && npm run build",
  "test:unit": "vitest run",
  "lint": "eslint . --max-warnings=0 --ignore-pattern out --ignore-pattern .next",
  "typecheck": "tsc --noEmit"
},
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "out/**"],
  },
});
```

- [ ] **Step 4: Create `content/types.ts`**

```ts
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
```

- [ ] **Step 5: Write the failing test `lib/visibility.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { Metric } from "@/content/types";
import { visibleItems, visibleMetrics } from "./visibility";

const real: Metric = { value: "14+", label: "years" };
const sample: Metric = { value: "4.6★", label: "rating", sample: true };
const empty: Metric = { value: "  ", label: "downloads" };

describe("visibleMetrics", () => {
  it("drops empty values", () => {
    expect(visibleMetrics([real, empty], true)).toEqual([real]);
  });

  it("keeps samples when placeholders are shown", () => {
    expect(visibleMetrics([real, sample], true)).toEqual([real, sample]);
  });

  it("drops samples when placeholders are hidden", () => {
    expect(visibleMetrics([real, sample], false)).toEqual([real]);
  });
});

describe("visibleItems", () => {
  const items = [{ id: "a" }, { id: "b", draft: true }];

  it("keeps drafts when placeholders are shown", () => {
    expect(visibleItems(items, true)).toHaveLength(2);
  });

  it("drops drafts when placeholders are hidden", () => {
    expect(visibleItems(items, false)).toEqual([{ id: "a" }]);
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test:unit -- lib/visibility.test.ts`
Expected: FAIL — `Failed to resolve import "./visibility"`.

- [ ] **Step 7: Implement `lib/visibility.ts`**

```ts
import type { Metric } from "@/content/types";

/** Sample metrics and draft items show in `next dev`, never in a production build. */
export const SHOW_PLACEHOLDERS = process.env.NODE_ENV !== "production";

export function visibleMetrics(metrics: readonly Metric[], includeSamples = SHOW_PLACEHOLDERS): Metric[] {
  return metrics.filter((metric) => metric.value.trim() !== "" && (includeSamples || !metric.sample));
}

export function visibleItems<T extends { draft?: boolean }>(items: readonly T[], includeDrafts = SHOW_PLACEHOLDERS): T[] {
  return items.filter((item) => includeDrafts || !item.draft);
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test:unit -- lib/visibility.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 9: Checkpoint**

Run:

```bash
npm run typecheck && npm run lint
git status --short
```

Expected: both commands succeed; status lists `package.json`, `package-lock.json`, `vitest.config.ts`, `content/types.ts`, `lib/visibility.ts`, `lib/visibility.test.ts`.

---

### Task 2: Asset paths, orbit geometry and CSS helpers

**Files:**
- Create: `lib/asset.ts`, `lib/orbit.ts`, `lib/css.ts`
- Test: `lib/asset.test.ts`, `lib/orbit.test.ts`, `lib/css.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `assetPath(src: string, basePath?: string): string`
  - `ORBIT_ANGLES: readonly number[]` (length 5), `type OrbitSize = { stageWidth: number; phoneWidth: number; phoneHeight: number }`, `type OrbitPoint = { x: number; y: number; scale: number }`, `orbitPoint(index: number, selected: boolean, size: OrbitSize): OrbitPoint`, `orbitSide(index: number): "left" | "right"`
  - `cx(...classes: (string | false | null | undefined)[]): string`, `cssVars(vars: Record<\`--${string}\`, string>): CSSProperties`

- [ ] **Step 1: Write the failing tests**

`lib/asset.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assetPath } from "./asset";

describe("assetPath", () => {
  it("prefixes local paths with the base path", () => {
    expect(assetPath("/cv/cv.pdf", "/thnha-portfolio")).toBe("/thnha-portfolio/cv/cv.pdf");
  });

  it("leaves local paths alone without a base path", () => {
    expect(assetPath("/cv/cv.pdf", "")).toBe("/cv/cv.pdf");
  });

  it("leaves remote URLs unchanged", () => {
    const url = "https://nailsoft.com/wp-content/uploads/2024/01/check-in.png";
    expect(assetPath(url, "/thnha-portfolio")).toBe(url);
  });
});
```

`lib/orbit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ORBIT_ANGLES, orbitPoint, orbitSide } from "./orbit";

const size = { stageWidth: 580, phoneWidth: 270, phoneHeight: 579 };
const distance = ({ x, y }: { x: number; y: number }) => Math.hypot(x, y);

describe("orbitPoint", () => {
  it("has a position for five apps", () => {
    expect(ORBIT_ANGLES).toHaveLength(5);
  });

  it("moves the selected icon closer to the phone and enlarges it", () => {
    const idle = orbitPoint(0, false, size);
    const selected = orbitPoint(0, true, size);
    expect(distance(selected)).toBeLessThan(distance(idle));
    expect(selected.scale).toBeGreaterThan(idle.scale);
  });

  it("never places an icon over the phone", () => {
    const minX = size.phoneWidth / 2 + 44;
    for (let i = 0; i < ORBIT_ANGLES.length; i++) {
      expect(Math.abs(orbitPoint(i, true, size).x)).toBeGreaterThanOrEqual(minX);
      expect(Math.abs(orbitPoint(i, false, size).x)).toBeGreaterThanOrEqual(minX);
    }
  });

  it("keeps icons clear of the phone on a narrow stage", () => {
    const narrow = { stageWidth: 420, phoneWidth: 220, phoneHeight: 472 };
    expect(Math.abs(orbitPoint(1, true, narrow).x)).toBeGreaterThanOrEqual(narrow.phoneWidth / 2 + 44);
  });
});

describe("orbitSide", () => {
  it("reports which side of the phone an icon sits on", () => {
    expect(orbitSide(1)).toBe("left");
    expect(orbitSide(3)).toBe("right");
  });
});
```

`lib/css.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cssVars, cx } from "./css";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("cssVars", () => {
  it("returns custom properties as a style object", () => {
    expect(cssVars({ "--accent": "#8b7cff" })).toEqual({ "--accent": "#8b7cff" });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:unit -- lib/asset.test.ts lib/orbit.test.ts lib/css.test.ts`
Expected: FAIL — unresolved imports `./asset`, `./orbit`, `./css`.

- [ ] **Step 3: Implement `lib/asset.ts`**

```ts
const REMOTE = /^(https?:)?\/\//;

/**
 * Next.js adds the GitHub Pages base path to <Link> and static imports,
 * but not to plain string paths used in <a href>, <img src> or <video src>.
 */
export function assetPath(src: string, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): string {
  if (REMOTE.test(src) || !src.startsWith("/")) return src;
  return `${basePath}${src}`;
}
```

- [ ] **Step 4: Implement `lib/orbit.ts`**

```ts
/** Degrees, 0 = right of the phone, clockwise: three icons on the left, two on the right. */
export const ORBIT_ANGLES: readonly number[] = [-148, 180, 148, -32, 32];

export type OrbitSize = { stageWidth: number; phoneWidth: number; phoneHeight: number };
export type OrbitPoint = { x: number; y: number; scale: number };

const ICON_CLEARANCE = 44;
const SELECTED_PULL = 0.8;
const SELECTED_SCALE = 1.22;

const radians = (index: number) => (ORBIT_ANGLES[index % ORBIT_ANGLES.length] * Math.PI) / 180;
const round = (n: number) => Math.round(n * 100) / 100;

export function orbitPoint(index: number, selected: boolean, { stageWidth, phoneWidth, phoneHeight }: OrbitSize): OrbitPoint {
  const minX = phoneWidth / 2 + ICON_CLEARANCE;
  const rx = Math.max(minX + 40, Math.min(280, stageWidth / 2 - 36));
  const ry = Math.min(230, phoneHeight / 2 - 20);
  const angle = radians(index);
  let x = Math.cos(angle) * rx;
  let y = Math.sin(angle) * ry;
  if (selected) {
    x = Math.sign(x) * Math.max(Math.abs(x) * SELECTED_PULL, minX);
    y *= SELECTED_PULL;
  }
  return { x: round(x), y: round(y), scale: selected ? SELECTED_SCALE : 1 };
}

export function orbitSide(index: number): "left" | "right" {
  return Math.cos(radians(index)) > 0 ? "right" : "left";
}
```

- [ ] **Step 5: Implement `lib/css.ts`**

```ts
import type { CSSProperties } from "react";

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars as CSSProperties;
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm run test:unit`
Expected: PASS — visibility (5), asset (3), orbit (5), css (2).

- [ ] **Step 7: Checkpoint**

Run: `npm run typecheck && npm run lint && git status --short`
Expected: success; new files under `lib/` listed.

---

### Task 3: Hardware lab simulation logic

**Files:**
- Create: `lib/hardware-sim.ts`
- Test: `lib/hardware-sim.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (all exported from `lib/hardware-sim.ts`):
  - Types `Platform = "ios" | "android"`, `Transport = "BLE" | "USB" | "Wi-Fi"`, `LayerId = "js" | "turbo" | "native" | "sdk" | "io"`, `LogKind = "info" | "ok" | "error"`, `ScreenTone = "idle" | "ok" | "warn"`, `LayerTone = "active" | "warn"`, `LogLine = { tag: string; text: string; kind: LogKind }`, `SimStep`, `SimState`.
  - Constants `TRANSACTION_ID = "7F3A"`, `AMOUNT_LABEL = "$45.00"`, `LAYER_ORDER: readonly LayerId[]`, `LAYER_DETAIL: Record<LayerId, string>`, `TRANSPORTS: readonly Transport[]`, `REDUCED_STEP_MS = 120`, `initialSimState: SimState`.
  - Functions `nativeLanguage(platform): "Swift" | "Kotlin"`, `layerTitle(id, platform, transport): string`, `buildChargeScript({ platform, transport, dropConnection }): SimStep[]`, `applyStep(state, step): SimState`, `scriptDuration(steps, maxStepMs?): number`.

- [ ] **Step 1: Write the failing test `lib/hardware-sim.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  REDUCED_STEP_MS,
  applyStep,
  buildChargeScript,
  initialSimState,
  layerTitle,
  nativeLanguage,
  scriptDuration,
  type SimStep,
} from "./hardware-sim";

const run = (steps: SimStep[]) => steps.reduce(applyStep, initialSimState);
const logText = (steps: SimStep[]) => steps.flatMap((s) => (s.log ? [`[${s.log.tag}] ${s.log.text}`] : []));

describe("nativeLanguage / layerTitle", () => {
  it("maps platform to the native language", () => {
    expect(nativeLanguage("ios")).toBe("Swift");
    expect(nativeLanguage("android")).toBe("Kotlin");
  });

  it("names the native and transport layers from the current choice", () => {
    expect(layerTitle("native", "android", "USB")).toBe("Kotlin module");
    expect(layerTitle("io", "ios", "Wi-Fi")).toBe("Transport · Wi-Fi");
  });
});

describe("buildChargeScript", () => {
  it("connects through the chosen platform and transport", () => {
    const lines = logText(buildChargeScript({ platform: "android", transport: "Wi-Fi", dropConnection: false }));
    expect(lines).toContain("[Kotlin] DejavooClient.connect(.wifi)");
    expect(lines).toContain("[Kotlin] PrinterModule.print(receipt) via Wi-Fi");
  });

  it("has no error without a dropped connection", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: false });
    expect(steps.some((s) => s.log?.kind === "error")).toBe(false);
  });

  it("reconnects and resumes the same transaction when the connection drops", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: true });
    const error = steps.find((s) => s.log?.kind === "error");
    expect(error?.layer).toEqual({ id: "io", tone: "warn" });
    expect(error?.screen?.tone).toBe("warn");
    expect(logText(steps).some((line) => line.includes("resuming txn 7F3A"))).toBe(true);
  });

  it("ends approved, printed, with every layer complete", () => {
    const final = run(buildChargeScript({ platform: "ios", transport: "USB", dropConnection: true }));
    expect(final.screen).toEqual({ text: "APPROVED ✓", tone: "ok" });
    expect(final.completed).toBe(true);
    expect(final.printing).toBe(true);
    expect(final.cardOnTerminal).toBe(false);
    expect(final.activeLayer).toBeNull();
    expect(final.logs.at(-1)).toEqual({ tag: "Printer", text: "receipt printed ✓", kind: "ok" });
  });
});

describe("applyStep", () => {
  it("keeps the current layer when a step does not set one", () => {
    const withLayer = applyStep(initialSimState, { delayMs: 0, layer: { id: "js", tone: "active" } });
    expect(applyStep(withLayer, { delayMs: 0 }).activeLayer).toEqual({ id: "js", tone: "active" });
  });
});

describe("scriptDuration", () => {
  it("caps each step for reduced motion", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: true });
    expect(scriptDuration(steps, REDUCED_STEP_MS)).toBeLessThanOrEqual(steps.length * REDUCED_STEP_MS);
    expect(scriptDuration(steps)).toBeGreaterThan(scriptDuration(steps, REDUCED_STEP_MS));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- lib/hardware-sim.test.ts`
Expected: FAIL — unresolved import `./hardware-sim`.

- [ ] **Step 3: Implement `lib/hardware-sim.ts`**

```ts
export type Platform = "ios" | "android";
export type Transport = "BLE" | "USB" | "Wi-Fi";
export type LayerId = "js" | "turbo" | "native" | "sdk" | "io";
export type LogKind = "info" | "ok" | "error";
export type ScreenTone = "idle" | "ok" | "warn";
export type LayerTone = "active" | "warn";

export type LogLine = { tag: string; text: string; kind: LogKind };

export type SimStep = {
  /** Milliseconds to wait after this step before the next one. */
  delayMs: number;
  /** `null` clears the highlight; omitted keeps the current one. */
  layer?: { id: LayerId; tone: LayerTone } | null;
  log?: LogLine;
  screen?: { text: string; tone: ScreenTone };
  card?: boolean;
  completeLayers?: boolean;
  printing?: boolean;
};

export type SimState = {
  activeLayer: { id: LayerId; tone: LayerTone } | null;
  completed: boolean;
  logs: LogLine[];
  screen: { text: string; tone: ScreenTone };
  cardOnTerminal: boolean;
  printing: boolean;
};

export const TRANSACTION_ID = "7F3A";
export const AMOUNT_LABEL = "$45.00";
const AMOUNT_CENTS = 4500;
export const REDUCED_STEP_MS = 120;

export const TRANSPORTS: readonly Transport[] = ["BLE", "USB", "Wi-Fi"];
export const LAYER_ORDER: readonly LayerId[] = ["js", "turbo", "native", "sdk", "io"];
export const LAYER_DETAIL: Record<LayerId, string> = {
  js: "payments.charge({ amount })",
  turbo: "typed bridge, no JSON hop",
  native: "one interface per vendor",
  sdk: "Dejavoo · Star Micronics · Sunmi",
  io: "connect · retry · resume",
};

export const initialSimState: SimState = {
  activeLayer: null,
  completed: false,
  logs: [],
  screen: { text: "Ready", tone: "idle" },
  cardOnTerminal: false,
  printing: false,
};

export function nativeLanguage(platform: Platform): "Swift" | "Kotlin" {
  return platform === "ios" ? "Swift" : "Kotlin";
}

export function layerTitle(id: LayerId, platform: Platform, transport: Transport): string {
  switch (id) {
    case "js":
      return "React Native · JS API";
    case "turbo":
      return "Turbo Native Module";
    case "native":
      return `${nativeLanguage(platform)} module`;
    case "sdk":
      return "Vendor SDK";
    case "io":
      return `Transport · ${transport}`;
  }
}

const transportSlug = (transport: Transport) => transport.toLowerCase().replace("-", "");

export function buildChargeScript({
  platform,
  transport,
  dropConnection,
}: {
  platform: Platform;
  transport: Transport;
  dropConnection: boolean;
}): SimStep[] {
  const lang = nativeLanguage(platform);
  const steps: SimStep[] = [
    { layer: { id: "js", tone: "active" }, log: { tag: "JS", text: `await payments.charge({ amount: ${AMOUNT_CENTS} })`, kind: "info" }, delayMs: 600 },
    { layer: { id: "turbo", tone: "active" }, log: { tag: "Turbo", text: `PaymentModule.sale(${AMOUNT_CENTS}) → native`, kind: "info" }, delayMs: 600 },
    { layer: { id: "native", tone: "active" }, log: { tag: lang, text: `DejavooClient.connect(.${transportSlug(transport)})`, kind: "info" }, delayMs: 600 },
    { layer: { id: "io", tone: "active" }, log: { tag: transport, text: "connecting to terminal…", kind: "info" }, screen: { text: "Connecting…", tone: "idle" }, delayMs: 900 },
  ];

  if (dropConnection) {
    steps.push(
      {
        layer: { id: "io", tone: "warn" },
        log: { tag: transport, text: `connection lost — retry 1/3, same txn id ${TRANSACTION_ID}`, kind: "error" },
        screen: { text: "Reconnecting…", tone: "warn" },
        delayMs: 1300,
      },
      {
        layer: { id: "io", tone: "active" },
        log: { tag: transport, text: `reconnected · resuming txn ${TRANSACTION_ID} (no double charge)`, kind: "info" },
        delayMs: 500,
      },
    );
  }

  steps.push(
    { log: { tag: transport, text: "connected", kind: "ok" }, delayMs: 0 },
    {
      layer: { id: "sdk", tone: "active" },
      log: { tag: "SDK", text: `sale(txn: ${TRANSACTION_ID}, amount: ${AMOUNT_LABEL})`, kind: "info" },
      screen: { text: `Tap card\n${AMOUNT_LABEL}`, tone: "idle" },
      delayMs: 700,
    },
    { card: true, delayMs: 1100 },
    { log: { tag: "Terminal", text: "card read · contactless", kind: "info" }, screen: { text: "Processing…", tone: "idle" }, delayMs: 900 },
    { card: false, log: { tag: "SDK", text: "APPROVED", kind: "ok" }, screen: { text: "APPROVED ✓", tone: "ok" }, completeLayers: true, delayMs: 500 },
    { layer: { id: "js", tone: "active" }, log: { tag: "JS", text: `← { status: "approved", txn: "${TRANSACTION_ID}" }`, kind: "info" }, delayMs: 600 },
    { layer: { id: "native", tone: "active" }, log: { tag: lang, text: `PrinterModule.print(receipt) via ${transport}`, kind: "info" }, printing: true, delayMs: 1500 },
    { layer: null, log: { tag: "Printer", text: "receipt printed ✓", kind: "ok" }, delayMs: 0 },
  );

  return steps;
}

export function applyStep(state: SimState, step: SimStep): SimState {
  return {
    activeLayer: step.layer === undefined ? state.activeLayer : step.layer,
    completed: state.completed || step.completeLayers === true,
    logs: step.log ? [...state.logs, step.log] : state.logs,
    screen: step.screen ?? state.screen,
    cardOnTerminal: step.card ?? state.cardOnTerminal,
    printing: state.printing || step.printing === true,
  };
}

export function scriptDuration(steps: readonly SimStep[], maxStepMs = Number.POSITIVE_INFINITY): number {
  return steps.reduce((total, step) => total + Math.min(step.delayMs, maxStepMs), 0);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- lib/hardware-sim.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Checkpoint**

Run: `npm run typecheck && npm run lint && git status --short`
Expected: success.

---

### Task 4: Content modules and integrity test

**Files:**
- Create: `content/profile.ts`, `content/heroApps.ts`, `content/capabilities.ts`, `content/projects.ts`, `content/lab.ts`, `content/experience.ts`, `content/build.ts`
- Test: `content/content.test.ts`

**Interfaces:**
- Consumes: types from `content/types.ts`; `ORBIT_ANGLES` from `lib/orbit.ts`; `visibleItems` from `lib/visibility.ts`.
- Produces: `profile: Profile`, `heroApps: readonly HeroApp[]`, `capabilities: readonly Capability[]`, `projects: readonly Project[]`, `getProject(slug: string): Project | undefined`, `labItems: readonly LabItem[]`, `repos: readonly Repo[]`, `LAB_STATUS_LABEL: Record<LabStatus, string>`, `hasLabContent(): boolean`, `careerArc: readonly CareerMilestone[]`, `experience: readonly ExperienceEntry[]`, `buildSteps: readonly BuildStep[]`, `stack: readonly StackRow[]`.

- [ ] **Step 1: Write the failing test `content/content.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { ORBIT_ANGLES } from "@/lib/orbit";
import { buildSteps, stack } from "./build";
import { capabilities } from "./capabilities";
import { careerArc, experience } from "./experience";
import { heroApps } from "./heroApps";
import { labItems, repos } from "./lab";
import { profile } from "./profile";
import { projects } from "./projects";

const HEX = /^#[0-9a-f]{6}$/i;

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const unique = (values: string[]) => new Set(values).size === values.length;

describe("content", () => {
  const slugs = projects.map((p) => p.slug);

  it("uses unique project slugs and hero app ids", () => {
    expect(unique(slugs)).toBe(true);
    expect(unique(heroApps.map((a) => a.id))).toBe(true);
  });

  it("only references existing projects", () => {
    for (const ref of [...heroApps, ...capabilities]) expect(slugs).toContain(ref.projectSlug);
  });

  it("uses 6-digit hex accents", () => {
    const accents = [...heroApps, ...capabilities, ...projects, ...labItems].map((i) => i.accent);
    for (const accent of accents) expect(accent).toMatch(HEX);
  });

  it("fits every hero app on the orbit", () => {
    expect(heroApps.length).toBeLessThanOrEqual(ORBIT_ANGLES.length);
  });

  it("keeps TODO text out of published content", () => {
    const published = [
      profile,
      heroApps,
      capabilities,
      projects,
      careerArc,
      experience,
      buildSteps,
      stack,
      labItems.filter((item) => !item.draft),
      repos.filter((repo) => !repo.draft),
    ];
    const leaks = strings(published).filter((text) => text.includes("TODO"));
    expect(leaks).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- content/content.test.ts`
Expected: FAIL — unresolved import `./build`.

- [ ] **Step 3: Create `content/profile.ts`**

```ts
import type { Profile } from "./types";

export const profile: Profile = {
  name: "Tran Hoang Nha",
  displayName: "Nha Tran",
  initials: "TN",
  role: "Senior React Native Engineer",
  location: "Ho Chi Minh City, Vietnam",
  availability: "Open to remote / hybrid · Available immediately",
  // Owner: rewrite in your own voice.
  intro:
    "Hi, I'm Nha — a Senior React Native Engineer in Ho Chi Minh City. I like the messy places where apps meet real businesses: payments, printers, offline sync — and I stay until it works in production.",
  // Owner: add a square portrait (≥ 400px) to public/images/ and set it here, e.g.
  // photo: { src: "/images/nha.jpg", alt: "Tran Hoang Nha", width: 480, height: 480 },
  facts: [
    { label: "Role", value: "Senior React Native Engineer" },
    { label: "Experience", value: "14+ yrs · 6+ yrs React Native" },
    { label: "Strengths", value: "Multi-app architecture · native modules · payments & hardware" },
    { label: "Shipped for", value: "U.S. salons (NailSoft) · Jollibee Vietnam" },
    { label: "Location", value: "Ho Chi Minh City · remote / hybrid" },
    { label: "Availability", value: "Available immediately" },
  ],
  links: {
    cv: "/cv/Tran_Hoang_Nha_CV.pdf",
    linkedin: "https://www.linkedin.com/in/nhatran1990",
    github: "https://github.com/thnha",
    email: "thediffest@gmail.com",
  },
  proof: [
    { value: "14+", label: "years building software", source: "CV" },
    { value: "6+", label: "years React Native in production", source: "CV" },
    { value: "8", label: "production apps shipped", source: "CV: NailSoft 5 + Jollibee 3" },
  ],
  lighthouse: { value: "98", label: "Lighthouse performance", sample: true },
};
```

- [ ] **Step 4: Create `content/projects.ts`**

```ts
import type { ImageAsset, Project } from "./types";

const NAILSOFT = "https://nailsoft.com/wp-content/uploads/";
const CREDIT = "Temporary image · nailsoft.com";
const nailsoft = (path: string, alt: string, width: number, height: number): ImageAsset => ({
  src: NAILSOFT + path,
  alt,
  width,
  height,
  credit: CREDIT,
});

export const PLAY_STORE = {
  hpconsumer: "https://play.google.com/store/apps/details?id=com.hpconsumer",
  harmonypay: "https://play.google.com/store/apps/details?id=com.harmonypay.one",
} as const;

export const projects: readonly Project[] = [
  {
    slug: "nailsoft",
    shortTitle: "Salon POS & booking ecosystem",
    title: "Salon POS & booking ecosystem — 5 apps",
    period: "NailSoft · Levinci Group · 2021—2026",
    accent: "#8b7cff",
    media: { kind: "image", image: nailsoft("2024/03/nailsoft-pos.png", "NailSoft tablet POS showing the appointment book", 1395, 946) },
    problem: "SaaS point-of-sale & booking platform for U.S. nail salons: operations, consumer booking, staff, check-in and retail.",
    role: "Built and shipped Merchant, Booked By, SalonSoft, Check-in and Retailer with a ~20-person team; owned releases.",
    hardPart: "Migrated two production apps to the New Architecture and led performance work across all five.",
    metrics: [
      { value: "1,000+", label: "salons", sample: true },
      { value: "~20", label: "people team", source: "CV" },
      { value: "4.6★", label: "Play rating", sample: true },
    ],
    stack: ["React Native", "TypeScript", "New Architecture", "Swift", "Kotlin"],
    links: [
      { label: "Android app ↗", href: PLAY_STORE.hpconsumer },
      { label: "Android app ↗", href: PLAY_STORE.harmonypay },
    ],
  },
  {
    slug: "hardware",
    shortTitle: "Payments & in-store hardware",
    title: "Payments & in-store hardware",
    period: "NailSoft · Platform",
    accent: "#f5b84b",
    media: { kind: "image", image: nailsoft("2024/10/Smart-pos-white.png", "NailSoft Smart POS hardware: tablet, terminal, printer and kiosk", 1629, 803) },
    problem: "Payment terminals and receipt printers from three vendors, over BLE, USB and Wi-Fi, in busy salons.",
    role: "Wrote reusable native modules in Swift and Kotlin and the React Native layer on top.",
    hardPart: "Exposing different vendor SDKs through one unified JavaScript API shared by every app.",
    metrics: [
      { value: "3", label: "vendors", source: "CV" },
      { value: "3", label: "transports", source: "CV" },
    ],
    stack: ["Swift", "Kotlin", "Turbo Native Modules", "Dejavoo", "Star Micronics", "Sunmi"],
    links: [],
  },
  {
    slug: "checkin",
    shortTitle: "Self check-in kiosk",
    title: "Self check-in kiosk",
    period: "NailSoft · Check-in",
    accent: "#3fd0c9",
    media: { kind: "image", image: nailsoft("2024/01/check-in.png", "NailSoft check-in kiosk on a stand", 883, 611) },
    problem: "Walk-in guests wait without knowing when they'll be served, and the front desk gets overloaded.",
    role: "Built and shipped the Check-in app.",
    metrics: [{ value: "−30%", label: "front-desk wait", sample: true }],
    stack: ["React Native", "Kiosk mode", "Real-time"],
    links: [],
  },
  {
    slug: "bookedby",
    shortTitle: "Booked By",
    title: "Booked By — consumer booking",
    period: "NailSoft · Booked By",
    accent: "#2f6fe4",
    media: {
      kind: "phones",
      images: [
        nailsoft("2024/01/phone-nailsoft-5.png", "Booked By home screen", 220, 466),
        nailsoft("2024/01/phone-nailsoft-main.png", "Booked By salon discovery map", 237, 480),
        nailsoft("2024/01/phone-nailsoft-4.png", "Booked By appointment review", 219, 466),
      ],
    },
    problem: "Customers need to book, pay and buy gift cards without calling the salon.",
    role: "Built and shipped the consumer app.",
    metrics: [{ value: "10K+", label: "downloads", sample: true }],
    stack: ["React Native", "Maps", "Payments", "Push notifications"],
    links: [],
  },
  {
    slug: "jollibee",
    shortTitle: "Digital ordering",
    title: "Digital ordering — consumer, driver, merchant",
    period: "Jollibee Vietnam · Levinci Group · 2020—2021",
    accent: "#ff5a4e",
    media: { kind: "placeholder", text: "Jollibee screenshots coming soon" },
    problem: "Ordering, delivery and merchant workflows had to stay in sync in real time.",
    role: "Built and shipped three React Native apps; owned builds and store releases.",
    hardPart: "Order events and status kept in sync across three apps with GraphQL and cross-app push.",
    metrics: [
      { value: "3", label: "apps", source: "CV" },
      { value: "100K+", label: "downloads", sample: true },
    ],
    stack: ["React Native", "GraphQL", "Google Maps", "Push notifications", "Real-time chat"],
    links: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
```

- [ ] **Step 5: Create `content/heroApps.ts`**

```ts
import type { HeroApp } from "./types";

export const heroApps: readonly HeroApp[] = [
  {
    id: "salonsoft",
    monogram: "S",
    name: "SalonSoft",
    accent: "#8b7cff",
    projectSlug: "nailsoft",
    description:
      "Pocket-sized POS for salon owners: revenue, appointments and staff presence 24/7 from a phone; staff see their own jobs and earnings.",
    role: "Senior React Native Engineer · built & shipped",
    hardPart: "Bringing the core of a full-size POS to a phone without losing speed",
    tags: ["React Native", "New Architecture", "TypeScript"],
    metrics: [
      { value: "5", label: "apps in the NailSoft ecosystem", source: "CV" },
      { value: "4.6★", label: "Google Play rating", sample: true },
    ],
  },
  {
    id: "bookedby",
    monogram: "B",
    name: "Booked By",
    accent: "#2f6fe4",
    projectSlug: "bookedby",
    description: "Customer app: book appointments, pay, buy gift cards, get salon offers and discover local salons.",
    role: "Senior React Native Engineer · built & shipped",
    hardPart: "Booking, payments and gift cards in one consumer flow",
    tags: ["React Native", "Maps", "Payments", "Push"],
    metrics: [
      { value: "10K+", label: "downloads", sample: true },
      { value: "4.7★", label: "store rating", sample: true },
    ],
    screenshot: {
      src: "https://nailsoft.com/wp-content/uploads/2024/01/phone-nailsoft-main.png",
      alt: "Booked By salon discovery map",
      width: 237,
      height: 480,
    },
  },
  {
    id: "checkin",
    monogram: "C",
    name: "Check-in",
    accent: "#3fd0c9",
    projectSlug: "checkin",
    description: "In-salon check-in: guests pick services up front and know when they will be served.",
    role: "Senior React Native Engineer · built & shipped",
    tags: ["React Native", "Kiosk", "Real-time"],
    metrics: [{ value: "1,000+", label: "salons using the platform", sample: true }],
  },
  {
    id: "hardware",
    monogram: "H",
    name: "Payments & Hardware",
    accent: "#f5b84b",
    projectSlug: "hardware",
    description: "Reusable native modules connecting the apps to Dejavoo terminals and Star Micronics / Sunmi printers.",
    role: "Native modules in Swift & Kotlin",
    hardPart: "One unified JavaScript API over different vendor SDKs, shared across the ecosystem",
    tags: ["Swift", "Kotlin", "Dejavoo", "Star Micronics", "Sunmi"],
    metrics: [
      { value: "3", label: "device vendors integrated", source: "CV" },
      { value: "3", label: "transports · BLE · USB · Wi-Fi", source: "CV" },
    ],
    cta: { label: "Try the hardware demo →", href: "#hardware-lab" },
  },
  {
    id: "ordering",
    monogram: "J",
    name: "Jollibee Ordering",
    accent: "#ff5a4e",
    projectSlug: "jollibee",
    description: "Jollibee Vietnam digital ordering — Consumer, Driver and Merchant apps.",
    role: "Senior React Native Engineer · owned builds & releases",
    hardPart: "Syncing order events across three apps with GraphQL and cross-app push",
    tags: ["GraphQL", "Google Maps", "Push", "Real-time chat"],
    metrics: [
      { value: "3", label: "apps · consumer · driver · merchant", source: "CV" },
      { value: "100K+", label: "consumer downloads", sample: true },
    ],
  },
];
```

- [ ] **Step 6: Create `content/capabilities.ts`**

```ts
import type { Capability } from "./types";

export const capabilities: readonly Capability[] = [
  {
    title: "Multi-app ecosystems",
    text: "Architect and ship several apps on one shared codebase — modules, design system and native layer reused across products.",
    accent: "#8b7cff",
    projectSlug: "nailsoft",
    metrics: [
      { value: "5", label: "apps, one ecosystem", source: "CV" },
      { value: "~60%", label: "shared code", sample: true },
    ],
  },
  {
    title: "Native modules & hardware",
    text: "Swift and Kotlin modules for terminals, printers and scanners over BLE, USB and Wi-Fi, exposed as one clean JS API.",
    accent: "#f5b84b",
    projectSlug: "hardware",
    demoHref: "#hardware-lab",
    metrics: [{ value: "3", label: "vendors · 3 transports", source: "CV" }],
  },
  {
    title: "Payments",
    text: "Card-present payments in production POS: terminals, tips, receipts and Tap to Pay.",
    accent: "#4ade80",
    projectSlug: "hardware",
    metrics: [{ value: "5", label: "platforms · Clover, Dejavoo, PAX, Sunmi, Tap to Pay", source: "CV" }],
  },
  {
    title: "New Architecture migration",
    text: "Moved production apps to Fabric and Turbo Native Modules, rewriting bridge modules without breaking releases.",
    accent: "#2f6fe4",
    projectSlug: "nailsoft",
    metrics: [
      { value: "2", label: "production apps migrated", source: "CV" },
      { value: "0.68 → 0.76", label: "React Native version", sample: true },
    ],
  },
  {
    title: "Performance",
    text: "Profile startup, list rendering and re-renders, then fix it once in the shared codebase so every app benefits.",
    accent: "#ff7aa8",
    projectSlug: "nailsoft",
    metrics: [
      { value: "−40%", label: "startup time", sample: true },
      { value: "99.8%", label: "crash-free sessions", sample: true },
    ],
  },
  {
    title: "Real-time & release ownership",
    text: "Order sync across consumer, driver and merchant apps; owning builds, versions and store releases end to end.",
    accent: "#ff5a4e",
    projectSlug: "jollibee",
    metrics: [{ value: "8", label: "apps released to stores", source: "CV" }],
  },
];
```

- [ ] **Step 7: Create `content/lab.ts`**

```ts
import { visibleItems } from "@/lib/visibility";
import type { LabItem, LabStatus, Repo } from "./types";

export const LAB_STATUS_LABEL: Record<LabStatus, string> = {
  live: "Live",
  ai: "AI-assisted",
  wip: "In development",
};

// Owner: replace each TODO, add links/images, then remove `draft: true` to publish.
export const labItems: readonly LabItem[] = [
  {
    status: "live",
    kind: "Mobile game",
    title: "TODO: live game name",
    description: "TODO: what the game is, how it plays, who it is for.",
    builtWith: "TODO: engine / stack",
    accent: "#4ade80",
    metrics: [
      { value: "5K+", label: "downloads", sample: true },
      { value: "4.5★", label: "rating", sample: true },
    ],
    links: [
      { label: "Google Play ↗", href: "" },
      { label: "App Store ↗", href: "" },
    ],
    draft: true,
  },
  {
    status: "ai",
    kind: "Game · AI-assisted",
    title: "TODO: AI-assisted game name",
    description: "TODO: what the game is; which parts AI wrote and which you decided (gameplay, architecture, polish).",
    builtWith: "TODO: stack + AI tools",
    accent: "#c084fc",
    metrics: [{ value: "2 weeks", label: "idea to playable", sample: true }],
    links: [{ label: "Play in browser ↗", href: "" }],
    draft: true,
  },
  {
    status: "wip",
    kind: "Mobile app · AI-assisted",
    title: "TODO: unreleased app name",
    description: "TODO: the problem it solves and for whom.",
    builtWith: "TODO: stack",
    accent: "#f5b84b",
    metrics: [],
    links: [
      { label: "Join TestFlight ↗", href: "" },
      { label: "Watch demo ↗", href: "" },
    ],
    draft: true,
  },
];

export const repos: readonly Repo[] = [
  {
    name: "TODO/react-native-receipt-printer",
    description: "TODO: one API for Star Micronics and Sunmi receipt printers over BLE, USB and Wi-Fi.",
    languages: "TypeScript · Kotlin · Swift",
    stars: { value: "120", label: "stars", sample: true },
    draft: true,
  },
  {
    name: "TODO/side-project",
    description: "TODO: a side-project repository (game or AI-assisted app).",
    languages: "TypeScript",
    draft: true,
  },
];

export function hasLabContent(): boolean {
  return visibleItems(labItems).length > 0 || visibleItems(repos).length > 0;
}
```

- [ ] **Step 8: Create `content/experience.ts`**

```ts
import type { CareerMilestone, ExperienceEntry } from "./types";

export const careerArc: readonly CareerMilestone[] = [
  { year: "2012", label: "Native iOS" },
  { year: "2015", label: "Full-stack + React Native" },
  { year: "2018", label: "Mobile + backend + Unity" },
  { year: "2020", label: "Senior React Native" },
  { year: "2021", label: "Multi-app POS ecosystem" },
];

export const experience: readonly ExperienceEntry[] = [
  {
    period: "03/2021 — 06/2026",
    company: "Levinci Group — NailSoft",
    title: "Senior React Native Engineer",
    points: [
      "Built and shipped a five-app ecosystem with a ~20-person cross-functional team.",
      "Native modules in Swift / Kotlin for Dejavoo, Star Micronics and Sunmi over BLE, USB, Wi-Fi.",
      "Migrated two production apps to the New Architecture; led performance work across five apps.",
      "Owned planning, versioning and App Store / Google Play releases.",
    ],
    tags: ["React Native", "Swift", "Kotlin", "TurboModules"],
  },
  {
    period: "2020 — 2021",
    company: "Levinci Group — Jollibee Vietnam",
    title: "Senior React Native Engineer",
    points: [
      "Built Consumer, Driver and Merchant apps.",
      "GraphQL + cross-app push to sync order status; maps, chat, vouchers, order tracking.",
      "Owned builds and store releases.",
    ],
    tags: ["GraphQL", "Google Maps", "Push"],
  },
  {
    period: "2018 — 2020",
    company: "Southeast Asia Technology Solutions",
    title: "Full-Stack Engineer",
    points: [
      "Spa Diva booking app: React Native client and Node.js services.",
      "Battle for Rolephia MOBA client features in Unity / C#.",
    ],
    tags: ["React Native", "Node.js", "Unity"],
  },
  {
    period: "2015 — 2018",
    company: "Creants Studio",
    title: "Full-Stack Engineer",
    points: ["Cross-platform news reader in React Native.", "Backend services for MU OF HEROES in Java / Spring."],
    tags: ["React Native", "Java", "Spring"],
  },
  {
    period: "2012 — 2015",
    company: "Microgame Corp",
    title: "iOS Engineer",
    points: ["Ola social chat iOS app in Objective-C; REST APIs and web games integration."],
    tags: ["Objective-C", "iOS"],
  },
];
```

- [ ] **Step 9: Create `content/build.ts`**

```ts
import type { BuildStep, StackRow } from "./types";

// Owner: replace with your own process and real examples.
export const buildSteps: readonly BuildStep[] = [
  { title: "Plan the risk first", text: "Prototype the uncertain part — a vendor SDK, a sync edge case — before committing the design." },
  { title: "Share, don't copy", text: "Build once in shared modules so every app in the ecosystem gets the fix." },
  { title: "Measure", text: "Profile startup, lists and re-renders on real low-end devices, not just simulators." },
  { title: "Own the release", text: "Versioning, store submission and watching production after it ships." },
];

export const stack: readonly StackRow[] = [
  { area: "Mobile", items: "React Native (Fabric, TurboModules) · TypeScript · Swift / Objective-C · Kotlin / Java" },
  { area: "Devices & payments", items: "Clover · Dejavoo · PAX · Sunmi · Tap to Pay · Star Micronics · BLE / USB / Wi-Fi · barcode & camera" },
  { area: "State & data", items: "Redux · Zustand · TanStack Query · offline-first sync" },
  { area: "Delivery", items: "Jest · React Native Testing Library · Fastlane · Gradle" },
  { area: "Backend", items: "Node.js · Express · .NET · GraphQL · WebSockets · Socket.IO · SignalR · PostgreSQL · MongoDB · Firebase · GCP" },
];
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm run test:unit`
Expected: PASS — all suites including `content/content.test.ts` (5 tests).

- [ ] **Step 11: Prove the TODO guard works**

Temporarily change `draft: true` to `draft: false` on the first entry of `labItems`, then run `npm run test:unit -- content/content.test.ts`.
Expected: FAIL in "keeps TODO text out of published content" listing the TODO strings. Restore `draft: true` and re-run: PASS.

- [ ] **Step 12: Checkpoint**

Run: `npm run typecheck && npm run lint && git status --short`
Expected: success; `content/*.ts` listed.

---

### Task 5: Design foundation, navigation and hero

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `hooks/useMediaQuery.ts`
- Create: `components/StatList.tsx`, `components/StatList.module.css`
- Create: `components/SectionHeader.tsx`, `components/SectionHeader.module.css`
- Create: `components/Nav.tsx`, `components/Nav.module.css`
- Create: `components/hero/Hero.tsx`, `components/hero/HeroIntro.tsx`, `components/hero/PocketUniverse.tsx`, `components/hero/PhoneScreen.tsx`, `components/hero/mockScreens.tsx`, `components/hero/hero.module.css`, `components/hero/mockScreens.module.css`

**Interfaces:**
- Consumes: `profile`, `heroApps`, `hasLabContent` (content); `visibleMetrics` (lib/visibility); `assetPath` (lib/asset); `orbitPoint`, `orbitSide` (lib/orbit); `cx`, `cssVars` (lib/css).
- Produces:
  - `useMediaQuery(query: string, serverValue?: boolean): boolean`
  - `<StatList metrics tone? size? className? />` (`tone: "plain" | "accent"`, `size: "default" | "compact"`)
  - `<SectionHeader eyebrow title aside? />`
  - `<Nav />`, `<Hero />`
  - Global classes: `.shell`, `.section`, `.eyebrow`, `.btn`, `.btn-solid`, `.btn-ghost`; CSS variables `--bg --bg-2 --card --ivory --muted --dim --line --violet --amber --ease --dur --font-display-stack --font-body-stack --font-mono-stack --accent`.
  - Section ids used by nav: `top`, `capabilities`, `hardware-lab`, `work`, `lab`, `experience`.

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Nha Tran — Senior React Native Engineer",
  description:
    "Senior React Native Engineer with 14+ years of experience: multi-app POS ecosystems, payments, in-store hardware integrations and production releases on iOS and Android.",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.svg`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

/* Registered so the accent colour animates when the selected app changes. */
@property --accent {
  syntax: "<color>";
  inherits: true;
  initial-value: #8b7cff;
}

:root {
  --bg: #0b0912;
  --bg-2: #120f1d;
  --card: #14111d;
  --ivory: #f4efe6;
  --muted: #a39cb3;
  --dim: #6f6880;
  --line: #ffffff14;
  --violet: #8b7cff;
  --amber: #f5b84b;
  --ease: cubic-bezier(0.22, 0.8, 0.24, 1);
  --dur: 650ms;
  --font-display-stack: var(--font-display), system-ui, sans-serif;
  --font-body-stack: var(--font-body), system-ui, sans-serif;
  --font-mono-stack: ui-monospace, "SF Mono", Menlo, monospace;
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ivory);
  font: 15px/1.6 var(--font-body-stack);
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  color: inherit;
}

img,
video {
  display: block;
  max-width: 100%;
}

:focus-visible {
  outline: 2px solid var(--ivory);
  outline-offset: 3px;
}

.shell {
  width: min(1240px, calc(100% - 32px));
  margin-inline: auto;
}

.section {
  padding: 120px 0;
  border-top: 1px solid var(--line);
  scroll-margin-top: 24px;
}

.eyebrow {
  font: 500 11px var(--font-display-stack);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 20px;
  border: 1px solid transparent;
  border-radius: 99px;
  background: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--dur) var(--ease),
    border-color 0.2s,
    transform 0.2s;
}

.btn:active {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.55;
  cursor: progress;
}

.btn-solid {
  background: var(--accent);
  color: var(--bg);
}

.btn-ghost {
  border-color: var(--line);
}

.btn-ghost:hover {
  border-color: #ffffff40;
}

@media (max-width: 820px) {
  .section {
    padding: 80px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

- [ ] **Step 3: Create `hooks/useMediaQuery.ts`**

```ts
"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `serverValue` during SSR and hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
```

- [ ] **Step 4: Create `components/StatList.tsx` and `components/StatList.module.css`**

```tsx
import type { Metric } from "@/content/types";
import { cx } from "@/lib/css";
import { visibleMetrics } from "@/lib/visibility";
import styles from "./StatList.module.css";

type Props = {
  metrics: readonly Metric[];
  tone?: "plain" | "accent";
  size?: "default" | "compact";
  className?: string;
};

/** Renders visible metrics; renders nothing when none are left. */
export function StatList({ metrics, tone = "plain", size = "default", className }: Props) {
  const items = visibleMetrics(metrics);
  if (items.length === 0) return null;
  return (
    <dl className={cx(styles.list, tone === "accent" && styles.accent, size === "compact" && styles.compact, className)}>
      {items.map((metric) => (
        <div key={`${metric.value}-${metric.label}`} className={styles.item}>
          <dt className={styles.label}>{metric.label}</dt>
          <dd className={cx(styles.value, metric.sample && styles.sample)}>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  margin: 0;
}

/* dt comes first for screen readers; the value is shown on top. */
.item {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  max-width: 140px;
}

.value {
  align-self: flex-start;
  margin: 0;
  font: 600 24px/1.1 var(--font-display-stack);
  letter-spacing: -0.02em;
}

.label {
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.35;
  color: var(--muted);
}

.accent .value {
  color: var(--c, var(--accent));
  transition: color var(--dur) var(--ease);
}

.compact .value {
  font-size: 20px;
}

/* Placeholder numbers: only reach the page in development. */
.sample {
  position: relative;
  border-radius: 4px;
  outline: 1px dashed #ffffff40;
  outline-offset: 4px;
}

.sample::after {
  content: "sample";
  position: absolute;
  top: -9px;
  right: -6px;
  padding: 1px 4px;
  border-radius: 3px;
  background: #3a2f12;
  color: #f5c451;
  font: 600 8px var(--font-body-stack);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Create `components/SectionHeader.tsx` and `components/SectionHeader.module.css`**

```tsx
import type { ReactNode } from "react";
import styles from "./SectionHeader.module.css";

type Props = { eyebrow: string; title: ReactNode; aside?: ReactNode };

export function SectionHeader({ eyebrow, title, aside }: Props) {
  return (
    <div className={styles.head}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {aside && <p className={styles.aside}>{aside}</p>}
    </div>
  );
}
```

```css
.head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  margin-bottom: 50px;
}

.title {
  margin: 12px 0 0;
  font: 600 clamp(32px, 4vw, 50px)/1.05 var(--font-display-stack);
  letter-spacing: -0.03em;
}

.aside {
  max-width: 380px;
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 820px) {
  .head {
    flex-direction: column;
    align-items: start;
  }
}
```

- [ ] **Step 6: Create `components/Nav.tsx` and `components/Nav.module.css`**

```tsx
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

export function Nav() {
  const { cv, linkedin } = profile.links;
  const showLab = hasLabContent();
  return (
    <header className={cx("shell", styles.nav)}>
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
```

```css
.nav {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 76px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font: 600 15px var(--font-display-stack);
}

.brand i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px var(--accent);
}

.links {
  display: flex;
  gap: 30px;
  font-size: 13px;
  color: var(--muted);
}

.links a:hover,
.linkedin:hover {
  color: var(--ivory);
}

.right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.linkedin {
  font-size: 13px;
  color: var(--muted);
}

.cv {
  padding: 9px 16px;
  border: 1px solid var(--line);
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 820px) {
  .links,
  .linkedin {
    display: none;
  }
}
```

- [ ] **Step 7: Create `components/hero/mockScreens.tsx` and `components/hero/mockScreens.module.css`**

```tsx
import type { ReactElement } from "react";
import type { HeroScreen } from "@/content/types";
import { cx } from "@/lib/css";
import styles from "./mockScreens.module.css";

/* Illustrative UIs used until a real screenshot or video is supplied. */

function SalonSoftScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <small>Today · Glow Nails</small>
        <span className={styles.pill}>Live</span>
      </div>
      <h4 className={styles.title}>Overview</h4>
      <div className={styles.card}>
        <small>Revenue today</small>
        <div className={styles.row}>
          <b className={styles.big}>$2,480</b>
          <span className={styles.pill}>+12%</span>
        </div>
        <div className={styles.bar}>
          <i style={{ width: "72%" }} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Appointments</span>
          <b>18</b>
        </div>
        <small>4 upcoming in the next hour</small>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Staff clocked in</span>
          <b>7 / 9</b>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Linh · my earnings</span>
          <b>$312</b>
        </div>
        <small>Visible with owner permission</small>
      </div>
      <div className={styles.cta}>View report</div>
    </div>
  );
}

const DAYS = [
  ["Mon", "3"],
  ["Tue", "4"],
  ["Wed", "5"],
  ["Thu", "6"],
  ["Fri", "7"],
];
const SLOTS = ["9:00", "9:30", "10:15", "11:00", "11:30", "12:00"];

function BookedByScreen() {
  return (
    <div className={styles.wrap}>
      <small>Glow Nails & Spa</small>
      <h4 className={styles.title}>Pick a time</h4>
      <div className={styles.days}>
        {DAYS.map(([day, date]) => (
          <span key={day} className={cx(styles.day, day === "Tue" && styles.daySelected)}>
            {day}
            <b>{date}</b>
          </span>
        ))}
      </div>
      <div className={styles.slots}>
        {SLOTS.map((slot) => (
          <span key={slot} className={cx(styles.slot, slot === "10:15" && styles.slotSelected)}>
            {slot}
          </span>
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Gel manicure · Linh</span>
          <b>$45</b>
        </div>
      </div>
      <div className={styles.cta}>Book Tue 10:15</div>
    </div>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

function CheckInScreen() {
  return (
    <div className={styles.wrap}>
      <small>Welcome to Glow Nails</small>
      <h4 className={styles.title}>Check in with your phone</h4>
      <div className={cx(styles.card, styles.phoneNumber)}>(714) 555 – 01__</div>
      <div className={styles.keypad}>
        {KEYS.map((key) => (
          <span key={key}>{key}</span>
        ))}
      </div>
      <div className={styles.row}>
        <small>Queue</small>
        <small>updates live</small>
      </div>
      <div className={styles.cta}>Continue</div>
    </div>
  );
}

const DEVICES = [
  { name: "Dejavoo Z8", link: "Wi-Fi", note: "Payment terminal · ready", ready: true },
  { name: "Star TSP143", link: "USB", note: "Receipt printer · ready", ready: true },
  { name: "Sunmi V2s", link: "BLE", note: "Reconnecting…", ready: false },
];

function HardwareScreen() {
  return (
    <div className={styles.wrap}>
      <small>Merchant · Devices</small>
      <h4 className={styles.title}>Hardware</h4>
      {DEVICES.map((device) => (
        <div key={device.name} className={styles.card}>
          <div className={styles.row}>
            <span>
              <i className={cx(styles.dot, !device.ready && styles.dotWarn)} aria-hidden />
              {device.name}
            </span>
            <span className={styles.pill}>{device.link}</span>
          </div>
          <small>{device.note}</small>
          {!device.ready && (
            <div className={styles.bar}>
              <i style={{ width: "64%" }} />
            </div>
          )}
        </div>
      ))}
      <div className={styles.cta}>Print test receipt</div>
    </div>
  );
}

const DISHES = [
  ["Chickenjoy", "89.000₫"],
  ["Jolly Spaghetti", "45.000₫"],
  ["Burger Steak", "55.000₫"],
  ["Peach Pie", "25.000₫"],
];

function OrderingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <small>Deliver to · District 1</small>
        <span className={styles.pill}>25 min</span>
      </div>
      <h4 className={styles.title}>What are you craving?</h4>
      <div className={styles.menu}>
        {DISHES.map(([name, price]) => (
          <div key={name} className={styles.card}>
            <div className={styles.dishImage} aria-hidden />
            <b>{name}</b>
            <small>{price}</small>
          </div>
        ))}
      </div>
      <div className={styles.cta}>View cart · 2 items</div>
    </div>
  );
}

export const MOCK_SCREENS: Record<HeroScreen, () => ReactElement> = {
  salonsoft: SalonSoftScreen,
  bookedby: BookedByScreen,
  checkin: CheckInScreen,
  hardware: HardwareScreen,
  ordering: OrderingScreen,
};
```

```css
.wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 44px 16px 16px;
  font-size: 11px;
}

.wrap small {
  font-size: 10px;
  color: #8d879c;
}

.title {
  margin: 0;
  font: 600 17px var(--font-display-stack);
  letter-spacing: -0.02em;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid #ffffff0f;
  border-radius: 14px;
  background: #ffffff0b;
}

.big {
  font: 600 22px var(--font-display-stack);
}

.pill {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in oklab, var(--c) 22%, transparent);
  color: var(--c);
  font-size: 9px;
  font-weight: 600;
}

.cta {
  margin-top: auto;
  padding: 12px;
  border-radius: 14px;
  background: var(--c);
  color: var(--bg);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.bar {
  height: 6px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 3px;
  background: #ffffff12;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: var(--c);
}

.days {
  display: flex;
  justify-content: space-between;
}

.day {
  display: grid;
  place-items: center;
  width: 30px;
  height: 40px;
  border-radius: 10px;
  color: #8d879c;
  font-size: 9px;
  line-height: 1.3;
}

.day b {
  color: var(--ivory);
  font-size: 12px;
}

.daySelected {
  background: color-mix(in oklab, var(--c) 25%, transparent);
  outline: 1px solid var(--c);
}

.slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.slot {
  padding: 8px 0;
  border-radius: 10px;
  background: #ffffff0b;
  font-size: 10px;
  text-align: center;
}

.slotSelected {
  background: var(--c);
  color: var(--bg);
  font-weight: 700;
}

.phoneNumber {
  font: 600 18px var(--font-display-stack);
  letter-spacing: 0.08em;
  text-align: center;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.keypad span {
  display: grid;
  place-items: center;
  height: 38px;
  border-radius: 12px;
  background: #ffffff0b;
  font: 500 15px var(--font-display-stack);
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
}

.dotWarn {
  background: var(--amber);
  box-shadow: 0 0 8px var(--amber);
}

.menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.menu .card {
  padding: 8px;
}

.dishImage {
  height: 54px;
  margin-bottom: 6px;
  border-radius: 10px;
  background: radial-gradient(
    circle at 40% 40%,
    color-mix(in oklab, var(--c) 70%, #fff3),
    color-mix(in oklab, var(--c) 25%, #0000)
  );
}

@media (max-width: 820px) {
  .wrap {
    gap: 7px;
    padding: 38px 12px 12px;
    font-size: 10px;
  }

  .title {
    font-size: 15px;
  }
}
```

- [ ] **Step 8: Create `components/hero/PhoneScreen.tsx`**

```tsx
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
      aria-hidden={!active}
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
    </div>
  );
}
```

- [ ] **Step 9: Create `components/hero/PocketUniverse.tsx`**

```tsx
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

type Props = { apps: readonly HeroApp[]; nav: ReactNode; intro: ReactNode };

export function PocketUniverse({ apps, nav, intro }: Props) {
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
    const step = ARROW_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + apps.length) % apps.length;
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
      {nav}
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

          <div className={styles.icons} role="group" aria-label="Choose an app" onKeyDown={onIconsKeyDown}>
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

        <aside className={styles.panel} aria-live="polite">
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
```

- [ ] **Step 10: Create `components/hero/HeroIntro.tsx` and `components/hero/Hero.tsx`**

```tsx
import { StatList } from "@/components/StatList";
import { profile } from "@/content/profile";
import { assetPath } from "@/lib/asset";
import { cx } from "@/lib/css";
import styles from "./hero.module.css";

export function HeroIntro() {
  const { cv, linkedin } = profile.links;
  return (
    <div className={styles.intro}>
      <p className={cx("eyebrow", styles.theme)}>Ideas in orbit · Apps in your hand</p>
      <h1 className={styles.title}>
        {profile.displayName}
        <span className={styles.role}>{profile.role}</span>
      </h1>
      <p className={styles.lede}>
        I build mobile apps that run real businesses — <strong>POS, payments, in-store hardware and offline-first</strong> —
        across iOS and Android.
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
```

```tsx
import { Nav } from "@/components/Nav";
import { heroApps } from "@/content/heroApps";
import { visibleMetrics } from "@/lib/visibility";
import { HeroIntro } from "./HeroIntro";
import { PocketUniverse } from "./PocketUniverse";

/**
 * Server wrapper: the name, role and nav are rendered on the server and passed in.
 * Metrics are filtered here so sample numbers never reach the client payload of a production build.
 */
export function Hero() {
  const apps = heroApps.map((app) => ({ ...app, metrics: visibleMetrics(app.metrics) }));
  return <PocketUniverse apps={apps} nav={<Nav />} intro={<HeroIntro />} />;
}
```

- [ ] **Step 11: Create `components/hero/hero.module.css`**

```css
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: --accent var(--dur) var(--ease);
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(520px 420px at 55% 52%, color-mix(in oklab, var(--accent) 34%, transparent), transparent 70%),
    radial-gradient(900px 600px at 50% 120%, #2a1d4a66, transparent 70%),
    linear-gradient(var(--bg), var(--bg-2));
}

.grid {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(440px, 580px) 290px;
  align-items: center;
  gap: 24px;
  min-height: calc(100svh - 76px);
  max-height: 900px;
  padding-bottom: 40px;
}

/* ---------- intro ---------- */
.theme {
  margin: 0 0 22px;
}

.title {
  margin: 0;
  font: 700 clamp(40px, 4.6vw, 64px)/1 var(--font-display-stack);
  letter-spacing: -0.035em;
}

.role {
  display: block;
  margin-top: 12px;
  color: var(--accent);
  font-size: 0.5em;
  letter-spacing: -0.02em;
}

.lede {
  max-width: 360px;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 16px;
}

.lede strong {
  color: var(--ivory);
  font-weight: 500;
}

.intro .proof {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

/* ---------- stage ---------- */
.stage {
  position: relative;
  display: grid;
  place-items: center;
  height: clamp(540px, calc(100svh - 100px), 640px);
  perspective: 1400px;
}

.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid var(--line);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(68deg);
  pointer-events: none;
}

.orbitOuter {
  width: 560px;
  height: 560px;
}

.orbitInner {
  width: 420px;
  height: 420px;
  border-style: dashed;
  border-color: #ffffff0d;
}

.tilt {
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.5s var(--ease);
}

.phone {
  position: relative;
  width: clamp(220px, calc((100svh - 150px) * 0.466), 270px);
  aspect-ratio: 9 / 19.3;
  padding: 9px;
  border-radius: 46px;
  background: linear-gradient(145deg, #5a5566, #1c1a22 30%, #2c2933 60%, #6b6677);
  box-shadow:
    0 0 0 1px #ffffff1a inset,
    0 40px 80px -20px #000c,
    0 0 90px -10px color-mix(in oklab, var(--accent) 45%, transparent);
}

.screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 38px;
  background: #0f0e14;
}

.island {
  position: absolute;
  top: 9px;
  left: 50%;
  z-index: 5;
  width: 82px;
  height: 24px;
  translate: -50% 0;
  border-radius: 20px;
  background: #000;
}

.app {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateY(14px) scale(0.98);
  transition:
    opacity 0.45s var(--ease),
    transform 0.55s var(--ease);
  pointer-events: none;
}

.appActive {
  opacity: 1;
  transform: none;
}

.appMedia {
  background: #fff;
}

.media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

/* ---------- icons ---------- */
.icons {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.icon {
  --c: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin: -29px 0 0 -29px;
  border: 1px solid #ffffff1f;
  border-radius: 18px;
  background: linear-gradient(150deg, color-mix(in oklab, var(--c) 85%, #fff 15%), color-mix(in oklab, var(--c) 55%, #000));
  box-shadow: 0 12px 30px -8px #000a;
  color: var(--bg);
  font: 700 17px var(--font-display-stack);
  cursor: pointer;
  pointer-events: auto;
  filter: saturate(0.55) brightness(0.8);
  transition:
    transform 0.7s var(--ease),
    box-shadow 0.5s var(--ease),
    filter 0.5s var(--ease);
}

.icon:hover {
  filter: saturate(0.85) brightness(0.95);
}

.icon[aria-pressed="true"] {
  filter: none;
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 5px var(--c),
    0 16px 40px -6px color-mix(in oklab, var(--c) 70%, transparent);
}

.iconLabel {
  position: absolute;
  top: calc(100% + 9px);
  color: var(--muted);
  font: 500 11px var(--font-body-stack);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.right .iconLabel {
  left: 0;
}

.left .iconLabel {
  right: 0;
}

.icon[aria-pressed="true"] .iconLabel,
.icon:hover .iconLabel {
  color: var(--ivory);
  opacity: 1;
}

/* ---------- panel ---------- */
.panel {
  padding-left: 28px;
  border-left: 1px solid var(--line);
}

.kicker {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
  font: 500 11px var(--font-display-stack);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.kicker span:last-child {
  color: var(--muted);
  letter-spacing: 0.08em;
}

.panelBody {
  animation: panel-in 0.45s var(--ease);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

.panelTitle {
  margin: 14px 0 12px;
  font: 600 30px/1.1 var(--font-display-stack);
  letter-spacing: -0.03em;
}

.panelText {
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 14px;
}

.panel .panelStats {
  margin-bottom: 22px;
}

.facts {
  display: grid;
  gap: 12px;
  margin: 0 0 22px;
}

.facts dt {
  color: var(--dim);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.facts dd {
  margin: 3px 0 0;
  font-size: 13px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 99px;
  color: var(--muted);
  font-size: 11px;
}

/* ---------- tablet ---------- */
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: minmax(300px, 1fr) minmax(420px, 1fr);
    max-height: none;
  }

  .panel {
    grid-column: 1 / -1;
    padding: 24px 0 0;
    border-top: 1px solid var(--line);
    border-left: 0;
  }
}

/* ---------- mobile ---------- */
@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 8px;
    min-height: 0;
    padding: 12px 0 60px;
  }

  .intro {
    text-align: center;
  }

  .theme {
    margin-bottom: 14px;
  }

  .title {
    font-size: 40px;
  }

  .role {
    margin-top: 8px;
  }

  .lede {
    margin: 14px auto 0;
    font-size: 14px;
  }

  .intro .proof {
    justify-content: center;
  }

  .intro .proof > div {
    align-items: center;
  }

  .intro .proof dd {
    align-self: center;
  }

  .actions {
    justify-content: center;
  }

  .workLink {
    display: none;
  }

  .stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    height: auto;
    padding-top: 18px;
  }

  .orbit {
    display: none;
  }

  .phone {
    width: min(210px, 56vw);
    padding: 7px;
    border-radius: 38px;
  }

  .screen {
    border-radius: 32px;
  }

  .icons {
    position: static;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding-bottom: 6px;
  }

  .icon {
    position: relative;
    left: auto;
    top: auto;
    width: 50px;
    height: 50px;
    margin: 0;
    border-radius: 15px;
    font-size: 15px;
  }

  .icon[aria-pressed="true"] {
    transform: translateY(-4px);
  }

  .iconLabel {
    display: none;
  }

  .panelTitle {
    font-size: 26px;
  }

  .panelCta {
    width: 100%;
  }
}
```

- [ ] **Step 12: Replace `app/page.tsx`**

```tsx
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 13: Verify statically**

Run:

```bash
npm run typecheck && npm run lint && npm run test:unit && npm run build
```

Expected: all pass; build output lists route `/` as static (○).

- [ ] **Step 14: Verify in the browser**

Run `npm run dev`, open `http://localhost:3000/`, and check:

1. At 1440×900: name "Nha Tran", role, proof stats (14+, 6+, 8) and three buttons are visible; five icons orbit the phone; SalonSoft is selected.
2. Click "B": phone shows the Booked By screenshot, background glow and role colour turn blue, the panel shows Booked By with two SAMPLE-badged numbers.
3. Click "H": the panel button reads "Try the hardware demo →".
4. Tab into the icon group and press → / ←: selection and focus move; the phone tilts with the pointer.
5. At 375×812 (DevTools device mode): icons sit in a row under the phone, no horizontal scrollbar (`document.documentElement.scrollWidth === 375` in the console).
6. With DevTools "Emulate CSS prefers-reduced-motion: reduce": no tilt.

- [ ] **Step 15: Checkpoint**

Run: `git diff --check && git status --short`
Expected: no whitespace errors.

---

### Task 6: Recruiter card and capabilities

**Files:**
- Create: `components/recruiter/RecruiterCard.tsx`, `components/recruiter/RecruiterCard.module.css`, `components/recruiter/CopyEmailButton.tsx`
- Create: `components/capabilities/Capabilities.tsx`, `components/capabilities/Capabilities.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `capabilities`, `getProject` (content); `StatList`, `SectionHeader`; `assetPath`; `cx`, `cssVars`.
- Produces: `<RecruiterCard />` (section id `recruiter`), `<CopyEmailButton email: string />`, `<Capabilities />` (section id `capabilities`). Capability cards link to `#work-<slug>` (anchors created in Task 8).

- [ ] **Step 1: Create `components/recruiter/CopyEmailButton.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

const RESET_MS = 1800;

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button className="btn btn-ghost" type="button" onClick={copy} aria-live="polite">
      {copied ? "Copied ✓" : "Copy email"}
    </button>
  );
}
```

- [ ] **Step 2: Create `components/recruiter/RecruiterCard.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `components/recruiter/RecruiterCard.module.css`**

```css
.section {
  padding: 0 0 100px;
  background: var(--bg-2);
}

.card {
  display: grid;
  grid-template-columns: 1.3fr 1.5fr auto;
  align-items: center;
  gap: 34px;
  padding: 28px 30px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: linear-gradient(135deg, #1a1526, #110e19);
  box-shadow: 0 30px 60px -30px #000;
}

.who {
  display: flex;
  align-items: center;
  gap: 18px;
}

.who h2 {
  margin: 0;
}

.avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(140deg, #c4b8ff, var(--violet) 55%, #4b3fb0);
  box-shadow:
    0 0 0 3px var(--bg-2),
    0 0 0 4px #8b7cff66;
  color: var(--bg);
  font: 700 26px var(--font-display-stack);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro {
  margin: 8px 0 0;
  color: #d8d2e2;
  font-size: 14px;
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  margin: 0;
}

.facts dt {
  color: var(--dim);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.facts dd {
  margin: 2px 0 0;
  font-size: 13px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary {
  --accent: var(--violet);
}

@media (max-width: 1200px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }

  .actions {
    grid-column: 1 / -1;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 820px) {
  .section {
    padding-bottom: 60px;
  }

  .card {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 22px;
  }

  .who {
    flex-direction: column;
    text-align: center;
  }

  .actions {
    flex-direction: column;
  }
}
```

- [ ] **Step 4: Create `components/capabilities/Capabilities.tsx`**

```tsx
import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { capabilities } from "@/content/capabilities";
import { getProject } from "@/content/projects";
import { cssVars } from "@/lib/css";
import styles from "./Capabilities.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="shell">
        <SectionHeader
          eyebrow="What I can do for your team"
          title={
            <>
              Capabilities,
              <br />
              backed by shipped work.
            </>
          }
          aside="Each capability links to the project where I did it in production."
        />
        <div className={styles.grid}>
          {capabilities.map((capability, i) => {
            const project = getProject(capability.projectSlug);
            return (
              <article key={capability.title} className={styles.card} style={cssVars({ "--c": capability.accent })}>
                <span className={styles.number}>{pad(i + 1)}</span>
                <h3 className={styles.title}>{capability.title}</h3>
                <p className={styles.text}>{capability.text}</p>
                <StatList metrics={capability.metrics} size="compact" className={styles.stats} />
                <div className={styles.links}>
                  {project && <a href={`#work-${project.slug}`}>See it in {project.shortTitle} →</a>}
                  {capability.demoHref && <a href={capability.demoHref}>Try it live ↗</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/capabilities/Capabilities.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--card);
  transition:
    border-color 0.3s,
    transform 0.3s var(--ease);
}

.card:hover {
  border-color: color-mix(in oklab, var(--c) 50%, transparent);
  transform: translateY(-3px);
}

.number {
  color: var(--c);
  font: 500 11px var(--font-display-stack);
  letter-spacing: 0.1em;
}

.title {
  margin: 0;
  font: 600 21px/1.2 var(--font-display-stack);
  letter-spacing: -0.02em;
}

.text {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.card .stats {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  color: var(--c);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Update `app/page.tsx`**

```tsx
import { Capabilities } from "@/components/capabilities/Capabilities";
import { Hero } from "@/components/hero/Hero";
import { RecruiterCard } from "@/components/recruiter/RecruiterCard";

export default function Home() {
  return (
    <main>
      <Hero />
      <RecruiterCard />
      <Capabilities />
    </main>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm run lint && npm run test:unit && npm run build`
Expected: all pass.

Then `npm run dev` and check at 1440px and 375px: recruiter card shows "TN" avatar, intro, 6 facts and 3 buttons; "Copy email" changes to "Copied ✓" for ~2s; six capability cards, the "Native modules & hardware" card has both links; SAMPLE badges appear on sample numbers; no horizontal scroll at 375px.

- [ ] **Step 8: Checkpoint**

Run: `git diff --check && git status --short`

---

### Task 7: Hardware lab

**Files:**
- Create: `components/hardware-lab/HardwareLab.tsx`, `components/hardware-lab/HardwareLab.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: everything listed as produced by Task 3 from `lib/hardware-sim.ts`; `SectionHeader`; `useMediaQuery`; `cx`.
- Produces: `<HardwareLab />` (section id `hardware-lab`).

- [ ] **Step 1: Create `components/hardware-lab/HardwareLab.tsx`**

```tsx
"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cx } from "@/lib/css";
import {
  AMOUNT_LABEL,
  LAYER_DETAIL,
  LAYER_ORDER,
  REDUCED_STEP_MS,
  TRANSACTION_ID,
  TRANSPORTS,
  applyStep,
  buildChargeScript,
  initialSimState,
  layerTitle,
  type Platform,
  type SimState,
  type SimStep,
  type Transport,
} from "@/lib/hardware-sim";
import styles from "./HardwareLab.module.css";

type Action = { type: "reset" } | { type: "step"; step: SimStep };

function reducer(state: SimState, action: Action): SimState {
  return action.type === "reset" ? initialSimState : applyStep(state, action.step);
}

const PLATFORMS: readonly { value: Platform; label: string }[] = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
];

const RECEIPT_LINES = [
  "GLOW NAILS & SPA",
  `Ticket #2048 · ${TRANSACTION_ID}`,
  "--------------------",
  "Gel manicure    35.00",
  "Nail art x2     10.00",
  "--------------------",
  "TOTAL           45.00",
  "CONTACTLESS · APPROVED",
  "Thank you!",
];

type SegmentedProps<T extends string> = {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  disabled: boolean;
  onChange: (value: T) => void;
};

function Segmented<T extends string>({ label, options, value, disabled, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function HardwareLab() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [transport, setTransport] = useState<Transport>("BLE");
  const [dropConnection, setDropConnection] = useState(false);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialSimState);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [state.logs.length]);

  function run() {
    if (running) return;
    // Empty the same array in place: the unmount cleanup holds a reference to it.
    timers.current.splice(0).forEach((id) => window.clearTimeout(id));
    dispatch({ type: "reset" });
    setRunning(true);

    let at = 0;
    for (const step of buildChargeScript({ platform, transport, dropConnection })) {
      timers.current.push(window.setTimeout(() => dispatch({ type: "step", step }), at));
      at += reduceMotion ? Math.min(step.delayMs, REDUCED_STEP_MS) : step.delayMs;
    }
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        setHasRun(true);
      }, at),
    );
  }

  const transportOptions = TRANSPORTS.map((value) => ({ value, label: value }));

  return (
    <section id="hardware-lab" className={cx("section", styles.section)}>
      <div className="shell">
        <SectionHeader
          eyebrow="Hardware lab · try it"
          title={
            <>
              Tap Charge. Watch the
              <br />
              native layer work.
            </>
          }
          aside="A simulation of the payment and printing flow I built in production — from one JavaScript call down to Swift / Kotlin, the vendor SDK and the device."
        />

        <div className={styles.lab}>
          <div className={styles.devices}>
            <div className={styles.pos}>
              <div className={styles.row}>
                <small>Ticket #2048 · Station 3</small>
                <span className={styles.pill}>Open</span>
              </div>
              <div className={styles.items}>
                <div className={styles.row}>
                  <span>Gel manicure</span>
                  <b>$35.00</b>
                </div>
                <div className={styles.row}>
                  <span>Nail art ×2</span>
                  <b>$10.00</b>
                </div>
                <div className={cx(styles.row, styles.total)}>
                  <span>Total</span>
                  <b>{AMOUNT_LABEL}</b>
                </div>
              </div>
              <div className={styles.controls}>
                <Segmented label="Platform" options={PLATFORMS} value={platform} disabled={running} onChange={setPlatform} />
                <Segmented label="Connection" options={transportOptions} value={transport} disabled={running} onChange={setTransport} />
              </div>
              <label className={styles.drop}>
                <input
                  type="checkbox"
                  checked={dropConnection}
                  disabled={running}
                  onChange={(event) => setDropConnection(event.target.checked)}
                />
                Drop the connection once
              </label>
              <button className={cx("btn", styles.charge)} type="button" onClick={run} disabled={running}>
                {running ? "Processing…" : hasRun ? "Run again" : `Charge ${AMOUNT_LABEL}`}
              </button>
            </div>

            <div className={styles.hardware}>
              <div className={styles.terminal}>
                <div className={cx(styles.terminalScreen, styles[state.screen.tone])}>{state.screen.text}</div>
                <div className={styles.keys} aria-hidden>
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <span className={styles.deviceLabel}>Payment terminal</span>
                <div className={cx(styles.card, state.cardOnTerminal && styles.cardTap)} aria-hidden />
              </div>

              <div className={styles.printer}>
                <div className={styles.printerBody}>
                  <span className={cx(styles.led, state.printing && styles.ledOn)} aria-hidden />
                  <div className={styles.slot} />
                </div>
                <div className={cx(styles.receipt, state.printing && styles.receiptOut)}>
                  <pre>{RECEIPT_LINES.join("\n")}</pre>
                </div>
                <span className={styles.deviceLabel}>Receipt printer</span>
              </div>
            </div>
          </div>

          <div className={styles.side}>
            <ol className={styles.layers}>
              {LAYER_ORDER.map((id) => (
                <li
                  key={id}
                  className={cx(
                    state.activeLayer?.id === id && styles[state.activeLayer.tone],
                    state.completed && styles.done,
                  )}
                >
                  <b>{layerTitle(id, platform, transport)}</b>
                  <small>{LAYER_DETAIL[id]}</small>
                </li>
              ))}
            </ol>
            <pre ref={logRef} className={styles.log} aria-live="polite">
              {state.logs.length === 0 ? (
                <span className={styles.muted}>{`// press “Charge ${AMOUNT_LABEL}”`}</span>
              ) : (
                <>
                  <span className={styles.muted}>{`// txn ${TRANSACTION_ID} · ${AMOUNT_LABEL}`}</span>
                  {state.logs.map((line, i) => (
                    <span key={i} className={styles[line.kind]}>
                      {"\n"}[{line.tag}] {line.text}
                    </span>
                  ))}
                </>
              )}
            </pre>
            <p className={styles.note}>Simulation for illustration — no real payment, no real device.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/hardware-lab/HardwareLab.module.css`**

```css
.section {
  --accent: var(--amber);
  background: radial-gradient(700px 400px at 20% 30%, #f5b84b12, transparent 70%);
}

.lab {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  align-items: start;
  gap: 28px;
}

.devices {
  display: grid;
  gap: 18px;
}

/* ---------- POS ---------- */
.pos {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--card);
  font-size: 13px;
}

.pos small {
  color: var(--dim);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pill {
  padding: 3px 8px;
  border-radius: 99px;
  background: #f5b84b26;
  color: var(--amber);
  font-size: 10px;
  font-weight: 600;
}

.items {
  display: grid;
  gap: 8px;
  padding: 12px 0;
  border-block: 1px solid var(--line);
}

.total {
  padding-top: 4px;
  font: 600 16px var(--font-display-stack);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.segmented {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 99px;
  background: #ffffff0a;
}

.segmented button {
  padding: 6px 12px;
  border: 0;
  border-radius: 99px;
  background: none;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.segmented button[aria-pressed="true"] {
  background: var(--ivory);
  color: var(--bg);
  font-weight: 600;
}

.segmented button:disabled {
  cursor: default;
}

.drop {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.drop input {
  accent-color: var(--amber);
}

.charge {
  padding: 14px;
  background: var(--amber);
  color: var(--bg);
  font-size: 15px;
}

/* ---------- devices ---------- */
.hardware {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  align-items: start;
  gap: 18px;
}

.terminal {
  position: relative;
  justify-self: center;
  width: 150px;
  padding: 12px 12px 16px;
  border-radius: 24px;
  background: linear-gradient(160deg, #3a3646, #17151d);
  box-shadow:
    0 0 0 1px #ffffff14 inset,
    0 24px 40px -18px #000;
}

.terminalScreen {
  display: grid;
  place-items: center;
  height: 92px;
  padding: 8px;
  border-radius: 12px;
  background: #0d1a12;
  box-shadow: inset 0 0 18px #22c55e22;
  color: #86efac;
  font: 600 13px var(--font-display-stack);
  text-align: center;
  white-space: pre-line;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.terminalScreen.ok {
  background: #14532d;
  color: #dcfce7;
}

.terminalScreen.warn {
  background: #3a2a0a;
  color: #fde68a;
}

.keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
}

.keys i {
  height: 14px;
  border-radius: 5px;
  background: #ffffff14;
}

.deviceLabel {
  display: block;
  margin-top: 10px;
  color: var(--dim);
  font-size: 11px;
  text-align: center;
}

.card {
  position: absolute;
  left: 50%;
  top: 22px;
  width: 84px;
  height: 54px;
  margin-left: -42px;
  border-radius: 9px;
  background: linear-gradient(135deg, #a78bfa, #6d28d9);
  box-shadow: 0 10px 24px -6px #000a;
  opacity: 0;
  transform: translate(90px, -40px) rotate(18deg);
  transition:
    transform 0.7s var(--ease),
    opacity 0.4s;
  pointer-events: none;
}

.card::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 16px;
  width: 16px;
  height: 12px;
  border-radius: 3px;
  background: #fcd34d;
}

.cardTap {
  opacity: 1;
  transform: translate(0, 4px) rotate(-4deg);
}

.printer {
  display: grid;
  justify-items: center;
}

.printerBody {
  position: relative;
  width: 100%;
  max-width: 220px;
  height: 70px;
  border-radius: 16px 16px 10px 10px;
  background: linear-gradient(170deg, #34303f, #1a1821);
  box-shadow: 0 0 0 1px #ffffff14 inset;
}

.led {
  position: absolute;
  right: 14px;
  top: 14px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3f3a4a;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.ledOn {
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
}

.slot {
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: 10px;
  height: 4px;
  border-radius: 2px;
  background: var(--bg);
}

.receipt {
  width: 84%;
  max-width: 170px;
  max-height: 0;
  margin-top: -12px;
  overflow: hidden;
  transition: max-height 1.4s steps(14);
}

.receiptOut {
  max-height: 220px;
}

.receipt pre {
  margin: 0;
  padding: 10px 10px 14px;
  overflow: hidden;
  background: #fbfaf7;
  color: #222;
  font: 9.5px/1.45 var(--font-mono-stack);
  clip-path: polygon(0 0, 100% 0, 100% 96%, 90% 100%, 80% 96%, 70% 100%, 60% 96%, 50% 100%, 40% 96%, 30% 100%, 20% 96%, 10% 100%, 0 96%);
}

/* ---------- layers + log ---------- */
.side {
  display: grid;
  gap: 16px;
}

.layers {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: layer;
}

.layers li {
  position: relative;
  padding: 12px 14px 12px 46px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  counter-increment: layer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s,
    background-color 0.3s;
}

.layers li::before {
  content: counter(layer);
  position: absolute;
  left: 14px;
  top: 50%;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  translate: 0 -50%;
  border-radius: 50%;
  background: #ffffff10;
  color: var(--muted);
  font: 600 10px var(--font-display-stack);
  transition:
    background-color 0.3s,
    color 0.3s;
}

.layers li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 23px;
  bottom: -9px;
  width: 2px;
  height: 9px;
  background: var(--line);
}

.layers b {
  display: block;
  font: 600 14px var(--font-display-stack);
}

.layers small {
  color: var(--dim);
  font: 12px var(--font-mono-stack);
}

.layers li.done::before {
  background: #4ade8033;
  color: #4ade80;
}

.layers li.active {
  border-color: var(--amber);
  background: #1d1810;
  box-shadow: 0 0 0 3px #f5b84b1f;
}

.layers li.active::before {
  background: var(--amber);
  color: var(--bg);
}

.layers li.warn {
  border-color: #fb923c;
  background: #22140c;
}

.log {
  height: 196px;
  margin: 0;
  padding: 14px;
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #07060b;
  color: #cfc8da;
  font: 11.5px/1.7 var(--font-mono-stack);
  white-space: pre-wrap;
}

.muted {
  color: var(--dim);
}

.info {
  color: #cfc8da;
}

.ok {
  color: #4ade80;
}

.error {
  color: #fb923c;
}

.note {
  margin: 0;
  color: var(--dim);
  font-size: 11px;
}

@media (max-width: 1200px) {
  .lab {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .hardware {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .terminal {
    width: 132px;
  }
}
```

Note: `.ok` is used for both the terminal screen tone and log lines. That is intentional: the terminal rule is scoped as `.terminalScreen.ok`, so the bare `.ok` only sets the text colour, and the terminal rule wins.

- [ ] **Step 3: Update `app/page.tsx`**

```tsx
import { Capabilities } from "@/components/capabilities/Capabilities";
import { HardwareLab } from "@/components/hardware-lab/HardwareLab";
import { Hero } from "@/components/hero/Hero";
import { RecruiterCard } from "@/components/recruiter/RecruiterCard";

export default function Home() {
  return (
    <main>
      <Hero />
      <RecruiterCard />
      <Capabilities />
      <HardwareLab />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm run test:unit && npm run build`
Expected: all pass.

Then `npm run dev`, open `http://localhost:3000/#hardware-lab`:

1. Press "Charge $45.00": layers light up 1 → 2 → 3 → 5 → 4, the terminal shows "Connecting…", "Tap card $45.00", the card slides in, "Processing…", "APPROVED ✓"; the printer LED turns green and the receipt prints; the log ends with `[Printer] receipt printed ✓`; the button reads "Run again".
2. Choose Android + Wi-Fi, tick "Drop the connection once", run: layer 3 reads "Kotlin module", layer 5 turns orange with "Reconnecting…", and the log shows `resuming txn 7F3A (no double charge)`.
3. While running, the segmented controls, checkbox and button are disabled.
4. Navigate away mid-run (click the "Work" nav link and come back): no console errors.
5. With reduced motion emulated, a full run finishes in about 2 seconds.

- [ ] **Step 5: Checkpoint**

Run: `git diff --check && git status --short`

---

### Task 8: Selected work and case-study pages

**Files:**
- Create: `components/ProjectMedia.tsx`, `components/ProjectMedia.module.css`
- Create: `components/work/SelectedWork.tsx`, `components/work/SelectedWork.module.css`
- Create: `app/work/[slug]/page.tsx`, `app/work/[slug]/page.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `projects`, `getProject` (content); `StatList`, `SectionHeader`, `Nav`; `assetPath`; `cx`, `cssVars`.
- Produces: `<ProjectMedia media: ProjectMedia preload?: boolean />` (`preload` replaces the `priority` prop deprecated in Next.js 16), `<SelectedWork />` (section id `work`, each project `id="work-<slug>"`), static route `/work/<slug>/` for every project.

- [ ] **Step 1: Create `components/ProjectMedia.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/ProjectMedia.module.css`**

```css
.frame {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 11;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #f3f1f6;
}

.frame > img {
  width: auto;
  max-height: 100%;
  object-fit: contain;
}

.dark {
  background:
    radial-gradient(70% 80% at 50% 100%, color-mix(in oklab, var(--c, var(--violet)) 22%, transparent), transparent),
    #15121f;
}

.phones {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 100%;
}

.phones img {
  width: 30%;
  height: auto;
  max-height: 92%;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 20px 40px -12px #0006;
}

.phones img:nth-child(2) {
  width: 32%;
  max-height: 100%;
}

.credit {
  position: absolute;
  left: 12px;
  bottom: 10px;
  padding: 2px 7px;
  border-radius: 99px;
  background: #fff9;
  color: #0008;
  font-size: 10px;
}

.dark .credit {
  background: #0006;
  color: var(--dim);
}

.placeholder {
  color: var(--dim);
  font-size: 13px;
  text-align: center;
}
```

- [ ] **Step 3: Create `components/work/SelectedWork.tsx`**

```tsx
import Link from "next/link";
import { ProjectMedia } from "@/components/ProjectMedia";
import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { projects } from "@/content/projects";
import { cssVars } from "@/lib/css";
import styles from "./SelectedWork.module.css";

export function SelectedWork() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Apps that run
              <br />
              real businesses.
            </>
          }
          aside="The problem, what I owned, the hardest part, and the result."
        />
        {projects.map((project) => (
          <article key={project.slug} id={`work-${project.slug}`} className={styles.project} style={cssVars({ "--c": project.accent })}>
            <ProjectMedia media={project.media} />
            <div>
              <span className={styles.period}>{project.period}</span>
              <h3 className={styles.title}>{project.title}</h3>
              <StatList metrics={project.metrics} tone="accent" className={styles.stats} />
              <dl className={styles.qa}>
                <div>
                  <dt>Problem</dt>
                  <dd>{project.problem}</dd>
                </div>
                {project.role && (
                  <div>
                    <dt>My role</dt>
                    <dd>{project.role}</dd>
                  </div>
                )}
                {project.hardPart && (
                  <div>
                    <dt>Hard part</dt>
                    <dd>{project.hardPart}</dd>
                  </div>
                )}
              </dl>
              <div className={styles.links}>
                <Link className={styles.primaryLink} href={`/work/${project.slug}/`}>
                  Read case study →
                </Link>
                {project.links.map((link) => (
                  <a key={link.href} className={styles.subtleLink} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/work/SelectedWork.module.css`**

```css
.project {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 56px;
  padding: 56px 0;
  border-top: 1px solid var(--line);
  scroll-margin-top: 24px;
}

.project:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.period {
  color: var(--c);
  font: 500 11px var(--font-display-stack);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.title {
  margin: 10px 0 22px;
  font: 600 30px/1.1 var(--font-display-stack);
  letter-spacing: -0.02em;
}

.project .stats {
  margin-bottom: 24px;
}

.qa {
  display: grid;
  gap: 16px;
  margin: 0 0 24px;
}

.qa > div {
  padding-left: 14px;
  border-left: 2px solid var(--c);
}

.qa dt {
  margin-bottom: 3px;
  color: var(--dim);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.qa dd {
  margin: 0;
  color: #d8d2e2;
  font-size: 14px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}

.primaryLink {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--c);
  font-size: 14px;
  font-weight: 600;
}

.subtleLink {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 820px) {
  .project {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0;
  }
}
```

- [ ] **Step 5: Create `app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ProjectMedia } from "@/components/ProjectMedia";
import { StatList } from "@/components/StatList";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { cssVars, cx } from "@/lib/css";
import styles from "./page.module.css";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${profile.displayName}`,
    description: project.problem,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <div className={styles.page} style={cssVars({ "--accent": project.accent, "--c": project.accent })}>
      <Nav />
      <main className={cx("shell", styles.main)}>
        <Link className={styles.back} href={`/#work-${project.slug}`}>
          ← All work
        </Link>
        <header className={styles.header}>
          <span className="eyebrow">{project.period}</span>
          <h1 className={styles.title}>{project.title}</h1>
          <StatList metrics={project.metrics} tone="accent" />
        </header>
        <ProjectMedia media={project.media} preload />
        <dl className={styles.body}>
          <div>
            <dt>Context</dt>
            <dd>{project.problem}</dd>
          </div>
          {project.role && (
            <div>
              <dt>My role</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {project.hardPart && (
            <div>
              <dt>Hard part</dt>
              <dd>{project.hardPart}</dd>
            </div>
          )}
          <div>
            <dt>Stack</dt>
            <dd>
              <ul className={styles.stack}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        {project.links.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link) => (
              <a key={link.href} className="btn btn-ghost" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Create `app/work/[slug]/page.module.css`**

```css
.page {
  min-height: 100svh;
  background: radial-gradient(700px 420px at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%);
}

.main {
  display: grid;
  gap: 40px;
  max-width: 920px;
  padding: 40px 0 120px;
}

.back {
  color: var(--muted);
  font-size: 13px;
}

.back:hover {
  color: var(--ivory);
}

.header {
  display: grid;
  gap: 18px;
}

.title {
  margin: 0;
  font: 700 clamp(34px, 5vw, 56px)/1.05 var(--font-display-stack);
  letter-spacing: -0.03em;
}

.body {
  display: grid;
  gap: 28px;
  margin: 0;
}

.body > div {
  padding-left: 16px;
  border-left: 2px solid var(--accent);
}

.body dt {
  margin-bottom: 6px;
  color: var(--dim);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.body dd {
  margin: 0;
  color: #d8d2e2;
  font-size: 16px;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack li {
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: 99px;
  color: var(--muted);
  font-size: 12px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
```

- [ ] **Step 7: Update `app/page.tsx`**

```tsx
import { Capabilities } from "@/components/capabilities/Capabilities";
import { HardwareLab } from "@/components/hardware-lab/HardwareLab";
import { Hero } from "@/components/hero/Hero";
import { RecruiterCard } from "@/components/recruiter/RecruiterCard";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function Home() {
  return (
    <main>
      <Hero />
      <RecruiterCard />
      <Capabilities />
      <HardwareLab />
      <SelectedWork />
    </main>
  );
}
```

- [ ] **Step 8: Verify**

Run: `npm run typecheck && npm run lint && npm run test:unit && npm run build`
Expected: all pass; build output lists `/work/[slug]` with 5 generated paths (`/work/nailsoft`, `/work/hardware`, `/work/checkin`, `/work/bookedby`, `/work/jollibee`).

Run: `ls out/work`
Expected: `bookedby  checkin  hardware  jollibee  nailsoft`.

Then `npm run dev` and check: five projects with images (credit badge on NailSoft images), "Read case study →" opens `/work/<slug>/`, "← All work" returns to the project; capability "See it in …" links scroll to the right project; hero "Explore project →" scrolls to the selected app's project.

- [ ] **Step 9: Checkpoint**

Run: `git diff --check && git status --short`

---

### Task 9: Lab, experience, how I build and contact

**Files:**
- Create: `components/lab/Lab.tsx`, `components/lab/Lab.module.css`
- Create: `components/experience/Experience.tsx`, `components/experience/Experience.module.css`
- Create: `components/build/HowIBuild.tsx`, `components/build/HowIBuild.module.css`
- Create: `components/contact/Contact.tsx`, `components/contact/Contact.module.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `labItems`, `repos`, `LAB_STATUS_LABEL`, `careerArc`, `experience`, `buildSteps`, `stack`, `profile` (content); `visibleItems`, `visibleMetrics`; `StatList`, `SectionHeader`; `assetPath`; `cx`, `cssVars`.
- Produces: `<Lab />` (section id `lab`, renders `null` when nothing is visible), `<Experience />` (`experience`), `<HowIBuild />` (`build`), `<Contact />` (`contact`, a `<footer>`).

- [ ] **Step 1: Create `components/lab/Lab.tsx`**

```tsx
import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { StatList } from "@/components/StatList";
import { LAB_STATUS_LABEL, labItems, repos } from "@/content/lab";
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
        <SectionHeader
          eyebrow="Lab · side projects"
          title={
            <>
              Things I build
              <br />
              on my own time.
            </>
          }
          aside="Shipped end to end on my own — idea, design, code, store. Some built with an AI-assisted workflow."
        />

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
```

- [ ] **Step 2: Create `components/lab/Lab.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--card);
  transition:
    border-color 0.3s,
    transform 0.3s var(--ease);
}

.card:hover {
  border-color: color-mix(in oklab, var(--c) 50%, transparent);
  transform: translateY(-3px);
}

.media {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(70% 80% at 50% 100%, color-mix(in oklab, var(--c) 20%, transparent), transparent),
    #100d18;
  color: var(--dim);
  font-size: 12px;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 99px;
  background: color-mix(in oklab, var(--c) 16%, transparent);
  color: var(--c);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.badge::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c);
}

.kind {
  color: var(--dim);
  font-size: 11px;
}

.title {
  margin: 0;
  font: 600 21px/1.2 var(--font-display-stack);
  letter-spacing: -0.02em;
}

.text {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.built {
  margin: auto 0 0;
  color: var(--dim);
  font-size: 12px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.links a {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--c);
  font-size: 13px;
  font-weight: 600;
}

.subheading {
  margin: 56px 0 18px;
  font: 600 20px var(--font-display-stack);
}

.repos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.repo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 22px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
}

a.repo:hover {
  border-color: #ffffff30;
}

.repo p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.repoName {
  font: 600 16px var(--font-mono-stack);
}

.meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 4px;
  color: var(--dim);
  font-size: 12px;
}

.meta b {
  color: var(--ivory);
  font-weight: 600;
}

.sample {
  outline: 1px dashed #ffffff40;
  outline-offset: 3px;
  border-radius: 3px;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 820px) {
  .grid,
  .repos {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Create `components/experience/Experience.tsx`**

```tsx
import { SectionHeader } from "@/components/SectionHeader";
import { careerArc, experience } from "@/content/experience";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHeader
          eyebrow="Experience"
          title={
            <>
              14 years, from native iOS
              <br />
              to multi-app React Native.
            </>
          }
          aside="Native roots, full-stack range, and six years leading React Native delivery."
        />
        <ol className={styles.arc}>
          {careerArc.map((milestone) => (
            <li key={milestone.year}>
              <b>{milestone.year}</b>
              {milestone.label}
            </li>
          ))}
        </ol>
        <div className={styles.timeline}>
          {experience.map((entry) => (
            <article key={entry.period} className={styles.entry}>
              <span className={styles.period}>{entry.period}</span>
              <div>
                <h3 className={styles.company}>{entry.company}</h3>
                <span className={styles.role}>{entry.title}</span>
              </div>
              <div>
                <ul className={styles.points}>
                  {entry.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className={styles.tags}>
                  {entry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/experience/Experience.module.css`**

```css
.arc {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 40px;
  padding: 0;
  list-style: none;
}

.arc li {
  flex: 1;
  min-width: 120px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--card);
  color: var(--muted);
  font-size: 12px;
}

.arc b {
  display: block;
  color: var(--ivory);
  font: 600 14px var(--font-display-stack);
}

.entry {
  display: grid;
  grid-template-columns: 150px 1fr 1.4fr;
  gap: 30px;
  padding: 28px 0;
  border-top: 1px solid var(--line);
}

.period {
  padding-top: 4px;
  color: var(--dim);
  font: 500 12px var(--font-display-stack);
  letter-spacing: 0.06em;
}

.company {
  margin: 0 0 4px;
  font: 600 19px var(--font-display-stack);
  letter-spacing: -0.01em;
}

.role {
  color: var(--muted);
  font-size: 13px;
}

.points {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 18px;
  color: #cfc8da;
  font-size: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 99px;
  color: var(--muted);
  font-size: 11px;
}

@media (max-width: 820px) {
  .entry {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
```

- [ ] **Step 5: Create `components/build/HowIBuild.tsx`**

```tsx
import { SectionHeader } from "@/components/SectionHeader";
import { buildSteps, stack } from "@/content/build";
import styles from "./HowIBuild.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function HowIBuild() {
  return (
    <section id="build" className="section">
      <div className="shell">
        <SectionHeader
          eyebrow="How I build"
          title={
            <>
              From spec to store,
              <br />
              and after.
            </>
          }
        />
        <ol className={styles.steps}>
          {buildSteps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number}>{pad(i + 1)}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <dl className={styles.stack}>
          {stack.map((row) => (
            <div key={row.area}>
              <dt>{row.area}</dt>
              <dd>{row.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create `components/build/HowIBuild.module.css`**

```css
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 18px;
}

.number {
  color: var(--dim);
  font: 500 12px var(--font-display-stack);
}

.step h3 {
  margin: 12px 0 8px;
  font: 600 18px var(--font-display-stack);
}

.step p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.stack {
  display: grid;
  gap: 14px;
  margin: 40px 0 0;
  font-size: 14px;
}

.stack > div {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 30px;
}

.stack dt {
  padding-top: 3px;
  color: var(--dim);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stack dd {
  margin: 0;
  color: #d8d2e2;
}

@media (max-width: 1200px) {
  .steps {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 820px) {
  .steps {
    grid-template-columns: 1fr;
  }

  .stack > div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
```

- [ ] **Step 7: Create `components/contact/Contact.tsx`**

```tsx
import { profile } from "@/content/profile";
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
        <span className="eyebrow">Let&apos;s build</span>
        <h2 className={styles.title}>
          Need a mobile engineer
          <br />
          who owns the outcome?
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
```

- [ ] **Step 8: Create `components/contact/Contact.module.css`**

```css
.contact {
  padding: 140px 0 40px;
  border-top: 1px solid var(--line);
  background: radial-gradient(600px 300px at 50% 0%, #2a1d4a55, transparent 70%);
  text-align: center;
}

.title {
  margin: 16px 0 26px;
  font: 700 clamp(40px, 6vw, 76px)/1 var(--font-display-stack);
  letter-spacing: -0.04em;
}

.mail {
  padding-bottom: 4px;
  border-bottom: 1px solid var(--violet);
  font: 600 20px var(--font-display-stack);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.primary {
  --accent: var(--violet);
}

.availability {
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  margin-top: 110px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  color: var(--dim);
  font-size: 12px;
}

.foot b {
  color: var(--ivory);
  font-weight: 600;
}

.footLinks {
  display: flex;
  gap: 22px;
}

.footLinks a {
  color: var(--ivory);
}

.sample {
  outline: 1px dashed #ffffff40;
  outline-offset: 3px;
  border-radius: 3px;
}

@media (max-width: 820px) {
  .contact {
    padding-top: 100px;
  }

  .foot {
    flex-direction: column;
    align-items: center;
  }
}
```

- [ ] **Step 9: Replace `app/page.tsx` with the full composition**

```tsx
import { HowIBuild } from "@/components/build/HowIBuild";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { Contact } from "@/components/contact/Contact";
import { Experience } from "@/components/experience/Experience";
import { HardwareLab } from "@/components/hardware-lab/HardwareLab";
import { Hero } from "@/components/hero/Hero";
import { Lab } from "@/components/lab/Lab";
import { RecruiterCard } from "@/components/recruiter/RecruiterCard";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <RecruiterCard />
        <Capabilities />
        <HardwareLab />
        <SelectedWork />
        <Lab />
        <Experience />
        <HowIBuild />
      </main>
      <Contact />
    </>
  );
}
```

- [ ] **Step 10: Verify**

Run: `npm run typecheck && npm run lint && npm run test:unit && npm run build`
Expected: all pass.

Check the placeholder rule in the production output:

```bash
grep -c "TODO" out/index.html; grep -c "4.6★" out/index.html; grep -c 'id="lab"' out/index.html
```

Expected: `0`, `0`, `0` — draft text, sample numbers (`4.6★` is one; it is also absent from the inline RSC payload because `Hero` filters metrics on the server) and the empty Lab section are absent from the production build, and the nav has no "Lab" link.

Then `npm run dev`: Lab shows three draft cards and two repo cards with SAMPLE badges; Experience shows the 5-step arc and 5 entries; How I build shows 4 steps and 5 stack rows; footer shows "Built with Next.js · static export · Lighthouse 98" with a dashed 98. Check 375px for horizontal scroll.

- [ ] **Step 11: Checkpoint**

Run: `git diff --check && git status --short`

---

### Task 10: CV asset, docs, CI and final verification

**Files:**
- Create: `public/cv/Tran_Hoang_Nha_CV.pdf`
- Modify: `.gitignore`, `README.md`, `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: `profile.links.cv` = `/cv/Tran_Hoang_Nha_CV.pdf`.
- Produces: downloadable CV at `<basePath>/cv/Tran_Hoang_Nha_CV.pdf`; CI gate (lint, typecheck, unit tests, build).

- [ ] **Step 1: Add the CV the owner approved**

Ask the owner which file to publish (the CV contains a phone number; see the spec's open decision). Then copy it, replacing the source path with the one the owner names:

```bash
mkdir -p public/cv
cp "/Users/nha-tran/Desktop/Tran_Hoang_Nha_CV.pdf" public/cv/Tran_Hoang_Nha_CV.pdf
```

Expected: `ls -l public/cv` shows the PDF.

- [ ] **Step 2: Keep the prototype's CV copy out of git**

Append to `.gitignore`:

```gitignore

# prototype-only copy of the CV
/docs/preview/*.pdf
```

Run: `git status --short docs/preview`
Expected: `docs/preview/Tran_Hoang_Nha_CV.pdf` is not listed.

- [ ] **Step 3: Run checks in CI before deploying**

In `.github/workflows/deploy-pages.yml`, replace the build job's `- run: npm run build` line with:

```yaml
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run build
```

- [ ] **Step 4: Update the README's "Main content files" section**

Replace the section that starts `## Main content files` (and its three bullet points) with:

```markdown
## Editing content

All copy, numbers and links live in `content/`:

- `content/profile.ts` — name, intro, quick facts, links (CV, LinkedIn, GitHub, email), hero proof numbers
- `content/heroApps.ts` — the five apps orbiting the phone (screenshot / video per app)
- `content/capabilities.ts`, `content/projects.ts` — capability cards and selected work / case studies
- `content/lab.ts` — side projects and open-source repos
- `content/experience.ts`, `content/build.ts` — timeline, process and tech stack

Placeholders: a metric with `sample: true` and an item with `draft: true` show (with a SAMPLE
badge) in `npm run dev` and are removed from `npm run build`. Set real values and delete those
flags to publish them.

## Checks

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run build
```
```

- [ ] **Step 5: Full verification**

Run:

```bash
npm run lint && npm run typecheck && npm run test:unit && npm run build
ls out/cv out/work
```

Expected: every command passes; `out/cv/Tran_Hoang_Nha_CV.pdf` exists; `out/work` lists five project folders.

Then check the GitHub Pages base path build locally:

```bash
GITHUB_ACTIONS=true npm run build
grep -o '/thnha-portfolio/cv/Tran_Hoang_Nha_CV.pdf' out/index.html | head -1
grep -o '/thnha-portfolio/work/nailsoft/' out/index.html | head -1
```

Expected: both paths are printed. Rebuild without the variable afterwards (`npm run build`) so local `out/` matches local dev.

- [ ] **Step 6: Final browser pass**

Run `npm run dev` and check at 375×812, 768×1024, 1024×768 and 1440×900:

1. No horizontal scrollbar (`document.documentElement.scrollWidth === innerWidth` minus scrollbar width).
2. Nav links scroll to Capabilities, Demo, Work, Lab, Experience; CV ↓ downloads the PDF.
3. Hero selection, keyboard arrows, hardware lab run (with and without dropped connection), case study round trip.
4. Keyboard only: Tab reaches every button and link with a visible focus ring.
5. Console has no errors or hydration warnings.

- [ ] **Step 7: Checkpoint**

Run: `git diff --check && git status --short`
Expected: no whitespace errors. Report the file list to the owner and commit only if asked.
