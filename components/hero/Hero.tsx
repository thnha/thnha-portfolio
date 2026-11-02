import { heroApps } from "@/content/heroApps";
import { visibleMetrics } from "@/lib/visibility";
import { HeroIntro } from "./HeroIntro";
import { PocketUniverse } from "./PocketUniverse";

/**
 * Server wrapper: the name and role are rendered on the server and passed in.
 * Metrics are filtered here so sample numbers never reach the client payload of a production build.
 */
export function Hero() {
  const apps = heroApps.map((app) => ({ ...app, metrics: visibleMetrics(app.metrics) }));
  return <PocketUniverse apps={apps} intro={<HeroIntro />} />;
}
