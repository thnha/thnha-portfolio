"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import type { SectionCopy } from "@/content/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cx } from "@/lib/css";
import {
  AMOUNT_LABEL,
  LAYER_DETAIL,
  LAYER_ORDER,
  REDUCED_STEP_MS,
  TRANSACTION_ID,
  TRANSPORTS,
  applyStep,
  buildChargeScript,
  initialSimState,
  layerTitle,
  type Platform,
  type SimState,
  type SimStep,
  type Transport,
} from "@/lib/hardware-sim";
import styles from "./HardwareLab.module.css";

type Action = { type: "reset" } | { type: "step"; step: SimStep };

function reducer(state: SimState, action: Action): SimState {
  return action.type === "reset" ? initialSimState : applyStep(state, action.step);
}

const PLATFORMS: readonly { value: Platform; label: string }[] = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
];

const RECEIPT_LINES = [
  "GLOW NAILS & SPA",
  `Ticket #2048 · ${TRANSACTION_ID}`,
  "--------------------",
  "Gel manicure    35.00",
  "Nail art x2     10.00",
  "--------------------",
  "TOTAL           45.00",
  "CONTACTLESS · APPROVED",
  "Thank you!",
];

type SegmentedProps<T extends string> = {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  disabled: boolean;
  onChange: (value: T) => void;
};

function Segmented<T extends string>({ label, options, value, disabled, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** `copy` is passed from the server page so the client bundle never imports profile data. */
export function HardwareLab({ copy }: { copy: SectionCopy }) {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [transport, setTransport] = useState<Transport>("BLE");
  const [dropConnection, setDropConnection] = useState(false);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialSimState);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [state.logs.length]);

  function run() {
    if (running) return;
    // Empty the same array in place: the unmount cleanup holds a reference to it.
    timers.current.splice(0).forEach((id) => window.clearTimeout(id));
    dispatch({ type: "reset" });
    setRunning(true);

    let at = 0;
    for (const step of buildChargeScript({ platform, transport, dropConnection })) {
      timers.current.push(window.setTimeout(() => dispatch({ type: "step", step }), at));
      at += reduceMotion ? Math.min(step.delayMs, REDUCED_STEP_MS) : step.delayMs;
    }
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        setHasRun(true);
      }, at),
    );
  }

  const transportOptions = TRANSPORTS.map((value) => ({ value, label: value }));

  return (
    <section id="hardware-lab" className={cx("section", styles.section)}>
      <div className="shell">
        <SectionHeader {...copy} />

        <div className={styles.lab}>
          <div className={styles.devices}>
            <div className={styles.pos}>
              <div className={styles.row}>
                <small>Ticket #2048 · Station 3</small>
                <span className={styles.pill}>Open</span>
              </div>
              <div className={styles.items}>
                <div className={styles.row}>
                  <span>Gel manicure</span>
                  <b>$35.00</b>
                </div>
                <div className={styles.row}>
                  <span>Nail art ×2</span>
                  <b>$10.00</b>
                </div>
                <div className={cx(styles.row, styles.total)}>
                  <span>Total</span>
                  <b>{AMOUNT_LABEL}</b>
                </div>
              </div>
              <div className={styles.controls}>
                <Segmented label="Platform" options={PLATFORMS} value={platform} disabled={running} onChange={setPlatform} />
                <Segmented label="Connection" options={transportOptions} value={transport} disabled={running} onChange={setTransport} />
              </div>
              <label className={styles.drop}>
                <input
                  type="checkbox"
                  checked={dropConnection}
                  disabled={running}
                  onChange={(event) => setDropConnection(event.target.checked)}
                />
                Drop the connection once
              </label>
              <button className={cx("btn", styles.charge)} type="button" onClick={run} aria-disabled={running}>
                {running ? "Processing…" : hasRun ? "Run again" : `Charge ${AMOUNT_LABEL}`}
              </button>
            </div>

            <div className={styles.hardware}>
              <div className={styles.terminal}>
                <div className={cx(styles.terminalScreen, styles[state.screen.tone])}>{state.screen.text}</div>
                <div className={styles.keys} aria-hidden>
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <span className={styles.deviceLabel}>Payment terminal</span>
                <div className={cx(styles.card, state.cardOnTerminal && styles.cardTap)} aria-hidden />
              </div>

              <div className={styles.printer}>
                <div className={styles.printerBody}>
                  <span className={cx(styles.led, state.printing && styles.ledOn)} aria-hidden />
                  <div className={styles.slot} />
                </div>
                <div className={cx(styles.receipt, state.printing && styles.receiptOut)} aria-hidden={!state.printing}>
                  <pre>{RECEIPT_LINES.join("\n")}</pre>
                </div>
                <span className={styles.deviceLabel}>Receipt printer</span>
              </div>
            </div>
          </div>

          <div className={styles.side}>
            <ol className={styles.layers}>
              {LAYER_ORDER.map((id) => (
                <li
                  key={id}
                  className={cx(
                    state.activeLayer?.id === id && styles[state.activeLayer.tone],
                    state.completed && styles.done,
                  )}
                >
                  <b>{layerTitle(id, platform, transport)}</b>
                  <small>{LAYER_DETAIL[id]}</small>
                </li>
              ))}
            </ol>
            <pre ref={logRef} className={styles.log} role="log">
              {state.logs.length === 0 ? (
                <span className={styles.muted}>{`// press “Charge ${AMOUNT_LABEL}”`}</span>
              ) : (
                <>
                  <span className={styles.muted}>{`// txn ${TRANSACTION_ID} · ${AMOUNT_LABEL}`}</span>
                  {state.logs.map((line, i) => (
                    <span key={i} className={styles[line.kind]}>
                      {"\n"}[{line.tag}] {line.text}
                    </span>
                  ))}
                </>
              )}
            </pre>
            <p className={styles.note}>Simulation for illustration — no real payment, no real device.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
