import { describe, expect, it } from "vitest";
import { ORBIT_ANGLES } from "@/lib/orbit";
import { buildSteps, stack } from "./build";
import { capabilities } from "./capabilities";
import { careerArc, experience } from "./experience";
import { heroApps } from "./heroApps";
import { labItems, repos } from "./lab";
import { profile } from "./profile";
import { projects } from "./projects";
import * as sections from "./sections";

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
      sections,
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
