import { describe, expect, it } from "vitest";
import {
  REDUCED_STEP_MS,
  applyStep,
  buildChargeScript,
  initialSimState,
  layerTitle,
  nativeLanguage,
  scriptDuration,
  type SimStep,
} from "./hardware-sim";

const run = (steps: SimStep[]) => steps.reduce(applyStep, initialSimState);
const logText = (steps: SimStep[]) => steps.flatMap((s) => (s.log ? [`[${s.log.tag}] ${s.log.text}`] : []));

describe("nativeLanguage / layerTitle", () => {
  it("maps platform to the native language", () => {
    expect(nativeLanguage("ios")).toBe("Swift");
    expect(nativeLanguage("android")).toBe("Kotlin");
  });

  it("names the native and transport layers from the current choice", () => {
    expect(layerTitle("native", "android", "USB")).toBe("Kotlin module");
    expect(layerTitle("io", "ios", "Wi-Fi")).toBe("Transport · Wi-Fi");
  });
});

describe("buildChargeScript", () => {
  it("connects through the chosen platform and transport", () => {
    const lines = logText(buildChargeScript({ platform: "android", transport: "Wi-Fi", dropConnection: false }));
    expect(lines).toContain("[Kotlin] DejavooClient.connect(.wifi)");
    expect(lines).toContain("[Kotlin] PrinterModule.print(receipt) via Wi-Fi");
  });

  it("has no error without a dropped connection", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: false });
    expect(steps.some((s) => s.log?.kind === "error")).toBe(false);
  });

  it("reconnects and resumes the same transaction when the connection drops", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: true });
    const error = steps.find((s) => s.log?.kind === "error");
    expect(error?.layer).toEqual({ id: "io", tone: "warn" });
    expect(error?.screen?.tone).toBe("warn");
    expect(logText(steps).some((line) => line.includes("resuming txn 7F3A"))).toBe(true);
  });

  it("ends approved, printed, with every layer complete", () => {
    const final = run(buildChargeScript({ platform: "ios", transport: "USB", dropConnection: true }));
    expect(final.screen).toEqual({ text: "APPROVED ✓", tone: "ok" });
    expect(final.completed).toBe(true);
    expect(final.printing).toBe(true);
    expect(final.cardOnTerminal).toBe(false);
    expect(final.activeLayer).toBeNull();
    expect(final.logs.at(-1)).toEqual({ tag: "Printer", text: "receipt printed ✓", kind: "ok" });
  });
});

describe("applyStep", () => {
  it("keeps the current layer when a step does not set one", () => {
    const withLayer = applyStep(initialSimState, { delayMs: 0, layer: { id: "js", tone: "active" } });
    expect(applyStep(withLayer, { delayMs: 0 }).activeLayer).toEqual({ id: "js", tone: "active" });
  });
});

describe("scriptDuration", () => {
  it("caps each step for reduced motion", () => {
    const steps = buildChargeScript({ platform: "ios", transport: "BLE", dropConnection: true });
    expect(scriptDuration(steps, REDUCED_STEP_MS)).toBeLessThanOrEqual(steps.length * REDUCED_STEP_MS);
    expect(scriptDuration(steps)).toBeGreaterThan(scriptDuration(steps, REDUCED_STEP_MS));
  });
});
