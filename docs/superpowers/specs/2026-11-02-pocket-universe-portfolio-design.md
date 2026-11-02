# Pocket Universe Portfolio Design

## Goal

Rebuild the portfolio home page so a recruiter can tell in about 30 seconds
**what Nha can do, where the proof is, and how senior Nha is**, using the
"Pocket Universe" direction approved in the HTML prototype
(`docs/preview/pocket-universe.html`). Add one shareable case-study page per
project.

The prototype is the visual and behavioural reference. This spec defines how it
becomes maintainable Next.js code.

## Audience and success criteria

- Primary reader: recruiters and hiring managers for Senior React Native /
  mobile roles (remote or hybrid).
- Within the first screen: name, role, years of experience, and a way to
  download the CV and open LinkedIn.
- Every capability claim links to a project that proves it.
- No placeholder number or TODO text can reach the production build.
- Works at 375px (phone), 768px (tablet), 1024px and 1440px without horizontal
  scrolling; keyboard and reduced-motion users can use every interaction.

## Page structure (home `/`)

| # | Section (id) | Content |
|---|---|---|
| 1 | Hero (`top`) | Nav, name + role, lede, proof stats, CV/LinkedIn buttons; centre phone with 5 orbiting app icons; right panel for the selected app |
| 2 | For recruiters (`recruiter`) | Avatar/photo, 2-sentence intro, 6 quick facts, Download CV / LinkedIn / Copy email |
| 3 | Capabilities (`capabilities`) | 6 cards: title, text, metrics, "See it in …" link, optional "Try it live" link |
| 4 | Hardware lab (`hardware-lab`) | Interactive payment + printing simulation with the native layer stack and a log |
| 5 | Selected work (`work`) | 5 projects: media, metrics, Problem / My role / Hard part, links (case study, store) |
| 6 | Lab (`lab`) | Side projects (live game, AI-assisted game, unreleased app) + Open source repos |
| 7 | Experience (`experience`) | Career arc 2012 → 2021 and a 5-company timeline from the CV |
| 8 | How I build (`build`) | 4 process steps and a tech-stack table |
| 9 | Contact (`contact`) | Email, Download CV, LinkedIn, availability, footer with "Built with" line |

Case study `/work/[slug]/`: one statically generated page per project with the
same fields as its Selected Work entry (media, metrics, problem, role, hard
part, stack, links) plus a back link.

## Interaction design

**Hero.** Selecting an app (click, tap, or arrow keys inside the icon group)
updates in one motion: the phone screen cross-fades, the `--accent` colour
transitions (registered with `@property` so it animates), the selected icon
grows and moves closer to the phone, and the panel content fades in. On
desktop (≥ 821px) icons sit on an elliptical orbit computed from the measured
stage and phone size; the phone tilts with the pointer only when
`(hover: hover) and (prefers-reduced-motion: no-preference)`. Below 821px the
icons become a row under the phone and the tilt is off.

**Phone screens.** Each app shows, in priority order: a screen-recording video
(muted, looped, `preload="none"`, plays only while active and only without
reduced motion), a screenshot image, or a built-in mock UI.

**Hardware lab.** Pressing "Charge $45.00" runs a scripted sequence: JS call →
Turbo Native Module → Swift or Kotlin module (by selected platform) → vendor
SDK → transport (BLE / USB / Wi-Fi), the terminal asks for a card, the card
animates in, "APPROVED", the result returns to JS, and the printer prints a
receipt. An optional "Drop the connection once" adds a reconnect that resumes
the same transaction id. Each step highlights its layer and appends a log line.
Controls are disabled while running; timers are cleared on unmount; reduced
motion shortens every delay to at most 120 ms. The section states it is a
simulation.

## Content model

All copy and numbers live in typed modules under `content/`; components never
hard-code portfolio facts.

- `Metric { value, label, source?, sample? }`. `source` is never rendered.
  `sample: true` marks a placeholder number.
- Items that are still placeholders (side projects, open-source repos) carry
  `draft: true`.
- **Placeholder rule:** in development (`next dev`) sample metrics render with
  a dashed outline and a "SAMPLE" badge and draft items render normally. In a
  production build (`next build`) sample metrics and draft items are removed.
  Empty values (`""`) are always removed, and a block with nothing left is not
  rendered. A section whose items are all hidden is not rendered and its nav
  link is removed.
- A content test fails if any non-draft item contains the text `TODO`, if any
  `projectSlug` reference is broken, if ids/slugs repeat, if an accent is not a
  6-digit hex colour, or if there are more hero apps than orbit positions.

Initial content is ported from the prototype: CV-backed facts are real;
numbers the prototype marked SAMPLE stay `sample: true`; NailSoft images stay
as temporary remote images from `nailsoft.com` with a visible credit until the
owner supplies their own.

## Architecture

- **Server components by default.** Only `PocketUniverse`, `PhoneScreen`,
  `HardwareLab` and `CopyEmailButton` are client components. Server-rendered
  hero copy is passed into `PocketUniverse` as props so the name and role are
  in the static HTML.
- **Pure logic in `lib/`, unit-tested:** placeholder filtering
  (`lib/visibility.ts`), asset paths with the GitHub Pages base path
  (`lib/asset.ts`), orbit geometry (`lib/orbit.ts`), the hardware-lab script
  and reducer (`lib/hardware-sim.ts`), and class/CSS-variable helpers
  (`lib/css.ts`).
- **Styling:** CSS Modules per component; design tokens, typography, layout
  primitives (`.shell`, `.section`, `.eyebrow`, `.btn*`) and the `@property
  --accent` registration in `app/globals.css`. Fonts via `next/font/google`:
  Space Grotesk (display) and Inter (body). The existing Tailwind import stays
  for its base reset; no utility classes are used.
- **Images:** `next/image` with explicit width/height (the project already
  exports with `images.unoptimized`). Local paths go through `assetPath()`
  because the base path is not added to plain string `src` values.
- **Static export unchanged:** `output: "export"`, `trailingSlash: true`,
  conditional `basePath` for GitHub Pages. Case-study pages use
  `generateStaticParams` with `dynamicParams = false`.

## Quality bar ("code chuẩn")

- TypeScript strict, no `any`, no non-null assertions on DOM refs.
- ESLint (`next/core-web-vitals` + TypeScript) passes with zero warnings.
- Unit tests with Vitest for everything in `lib/` and for content integrity.
  Vitest is the **only** new dependency (dev-only, pinned exact version), added
  because the project has no test runner.
- CI runs lint, typecheck, unit tests and build before deploying.
- Accessibility: semantic landmarks and headings, `aria-pressed` on toggle
  buttons, `aria-live` for the hero panel and the lab log, visible focus,
  decorative elements `aria-hidden`, alt text on content images.

## Assets the owner provides later

Portrait photo, 2-sentence intro in the owner's own voice, per-app screen recordings,
real metrics with sources, side-project details, open-source repos, and a
Lighthouse score from the deployed site. Each one is a content edit only.

## Open decision

The CV PDF contains a phone number. Before deploying, the owner decides
whether to publish it or supply a web version without it. The plan copies
whichever file the owner names to `public/cv/Tran_Hoang_Nha_CV.pdf`.

## Out of scope

WebGL/3D, CMS or MDX, analytics, contact forms, light theme, i18n, and the
testimonials section (dropped by the owner).
