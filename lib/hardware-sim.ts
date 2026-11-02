export type Platform = "ios" | "android";
export type Transport = "BLE" | "USB" | "Wi-Fi";
export type LayerId = "js" | "turbo" | "native" | "sdk" | "io";
export type LogKind = "info" | "ok" | "error";
export type ScreenTone = "idle" | "ok" | "warn";
export type LayerTone = "active" | "warn";

export type LogLine = { tag: string; text: string; kind: LogKind };

export type SimStep = {
  /** Milliseconds to wait after this step before the next one. */
  delayMs: number;
  /** `null` clears the highlight; omitted keeps the current one. */
  layer?: { id: LayerId; tone: LayerTone } | null;
  log?: LogLine;
  screen?: { text: string; tone: ScreenTone };
  card?: boolean;
  completeLayers?: boolean;
  printing?: boolean;
};

export type SimState = {
  activeLayer: { id: LayerId; tone: LayerTone } | null;
  completed: boolean;
  logs: LogLine[];
  screen: { text: string; tone: ScreenTone };
  cardOnTerminal: boolean;
  printing: boolean;
};

export const TRANSACTION_ID = "7F3A";
export const AMOUNT_LABEL = "$45.00";
const AMOUNT_CENTS = 4500;
export const REDUCED_STEP_MS = 120;

export const TRANSPORTS: readonly Transport[] = ["BLE", "USB", "Wi-Fi"];
export const LAYER_ORDER: readonly LayerId[] = ["js", "turbo", "native", "sdk", "io"];
export const LAYER_DETAIL: Record<LayerId, string> = {
  js: "payments.charge({ amount })",
  turbo: "typed bridge, no JSON hop",
  native: "one interface per vendor",
  sdk: "Dejavoo · Star Micronics · Sunmi",
  io: "connect · retry · resume",
};

export const initialSimState: SimState = {
  activeLayer: null,
  completed: false,
  logs: [],
  screen: { text: "Ready", tone: "idle" },
  cardOnTerminal: false,
  printing: false,
};

export function nativeLanguage(platform: Platform): "Swift" | "Kotlin" {
  return platform === "ios" ? "Swift" : "Kotlin";
}

export function layerTitle(id: LayerId, platform: Platform, transport: Transport): string {
  switch (id) {
    case "js":
      return "React Native · JS API";
    case "turbo":
      return "Turbo Native Module";
    case "native":
      return `${nativeLanguage(platform)} module`;
    case "sdk":
      return "Vendor SDK";
    case "io":
      return `Transport · ${transport}`;
  }
}

const transportSlug = (transport: Transport) => transport.toLowerCase().replace("-", "");

export function buildChargeScript({
  platform,
  transport,
  dropConnection,
}: {
  platform: Platform;
  transport: Transport;
  dropConnection: boolean;
}): SimStep[] {
  const lang = nativeLanguage(platform);
  const steps: SimStep[] = [
    { layer: { id: "js", tone: "active" }, log: { tag: "JS", text: `await payments.charge({ amount: ${AMOUNT_CENTS} })`, kind: "info" }, delayMs: 600 },
    { layer: { id: "turbo", tone: "active" }, log: { tag: "Turbo", text: `PaymentModule.sale(${AMOUNT_CENTS}) → native`, kind: "info" }, delayMs: 600 },
    { layer: { id: "native", tone: "active" }, log: { tag: lang, text: `DejavooClient.connect(.${transportSlug(transport)})`, kind: "info" }, delayMs: 600 },
    { layer: { id: "io", tone: "active" }, log: { tag: transport, text: "connecting to terminal…", kind: "info" }, screen: { text: "Connecting…", tone: "idle" }, delayMs: 900 },
  ];

  if (dropConnection) {
    steps.push(
      {
        layer: { id: "io", tone: "warn" },
        log: { tag: transport, text: `connection lost — retry 1/3, same txn id ${TRANSACTION_ID}`, kind: "error" },
        screen: { text: "Reconnecting…", tone: "warn" },
        delayMs: 1300,
      },
      {
        layer: { id: "io", tone: "active" },
        log: { tag: transport, text: `reconnected · resuming txn ${TRANSACTION_ID} (no double charge)`, kind: "info" },
        delayMs: 500,
      },
    );
  }

  steps.push(
    { log: { tag: transport, text: "connected", kind: "ok" }, delayMs: 0 },
    {
      layer: { id: "sdk", tone: "active" },
      log: { tag: "SDK", text: `sale(txn: ${TRANSACTION_ID}, amount: ${AMOUNT_LABEL})`, kind: "info" },
      screen: { text: `Tap card\n${AMOUNT_LABEL}`, tone: "idle" },
      delayMs: 700,
    },
    { card: true, delayMs: 1100 },
    { log: { tag: "Terminal", text: "card read · contactless", kind: "info" }, screen: { text: "Processing…", tone: "idle" }, delayMs: 900 },
    { card: false, log: { tag: "SDK", text: "APPROVED", kind: "ok" }, screen: { text: "APPROVED ✓", tone: "ok" }, completeLayers: true, delayMs: 500 },
    { layer: { id: "js", tone: "active" }, log: { tag: "JS", text: `← { status: "approved", txn: "${TRANSACTION_ID}" }`, kind: "info" }, delayMs: 600 },
    { layer: { id: "native", tone: "active" }, log: { tag: lang, text: `PrinterModule.print(receipt) via ${transport}`, kind: "info" }, printing: true, delayMs: 1500 },
    { layer: null, log: { tag: "Printer", text: "receipt printed ✓", kind: "ok" }, delayMs: 0 },
  );

  return steps;
}

export function applyStep(state: SimState, step: SimStep): SimState {
  return {
    activeLayer: step.layer === undefined ? state.activeLayer : step.layer,
    completed: state.completed || step.completeLayers === true,
    logs: step.log ? [...state.logs, step.log] : state.logs,
    screen: step.screen ?? state.screen,
    cardOnTerminal: step.card ?? state.cardOnTerminal,
    printing: state.printing || step.printing === true,
  };
}

export function scriptDuration(steps: readonly SimStep[], maxStepMs = Number.POSITIVE_INFINITY): number {
  return steps.reduce((total, step) => total + Math.min(step.delayMs, maxStepMs), 0);
}
