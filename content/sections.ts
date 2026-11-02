import { profile } from "./profile";
import type { ContactCopy, HeroCopy, SectionCopy } from "./types";

const [yearsBuilding, yearsReactNative] = profile.proof.map((metric) => metric.value);

export const heroCopy: HeroCopy = {
  theme: "Ideas in orbit · Apps in your hand",
  lede: {
    before: "I build mobile apps that run real businesses — ",
    strong: "POS, payments, in-store hardware and offline-first",
    after: " — across iOS and Android.",
  },
};

export const capabilitiesCopy: SectionCopy = {
  eyebrow: "What I can do for your team",
  title: ["Capabilities,", "backed by shipped work."],
  aside: "Each capability links to the project where I did it in production.",
};

export const hardwareLabCopy: SectionCopy = {
  eyebrow: "Hardware lab · try it",
  title: ["Tap Charge. Watch the", "native layer work."],
  aside:
    "A simulation of the payment and printing flow I built in production — from one JavaScript call down to Swift / Kotlin, the vendor SDK and the device.",
};

export const workCopy: SectionCopy = {
  eyebrow: "Selected work",
  title: ["Apps that run", "real businesses."],
  aside: "The problem, what I owned, the hardest part, and the result.",
};

export const labCopy: SectionCopy = {
  eyebrow: "Lab · side projects",
  title: ["Things I build", "on my own time."],
  aside: "Shipped end to end on my own — idea, design, code, store. Some built with an AI-assisted workflow.",
};

export const experienceCopy: SectionCopy = {
  eyebrow: "Experience",
  title: [`${yearsBuilding} years, from native iOS`, "to multi-app React Native."],
  aside: `Native roots, full-stack range, and ${yearsReactNative} years leading React Native delivery.`,
};

export const buildCopy: SectionCopy = {
  eyebrow: "How I build",
  title: ["From spec to store,", "and after."],
};

export const contactCopy: ContactCopy = {
  eyebrow: "Let's build",
  headline: ["Need a mobile engineer", "who owns the outcome?"],
};
