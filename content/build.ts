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
