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
