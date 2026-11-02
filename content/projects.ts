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
      { label: "Google Play · HP Consumer ↗", href: PLAY_STORE.hpconsumer },
      { label: "Google Play · HarmonyPay ↗", href: PLAY_STORE.harmonypay },
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
