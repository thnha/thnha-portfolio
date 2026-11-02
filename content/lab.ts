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
