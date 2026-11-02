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
