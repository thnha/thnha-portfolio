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
