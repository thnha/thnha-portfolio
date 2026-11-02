import type { ReactElement } from "react";
import type { HeroScreen } from "@/content/types";
import { cx } from "@/lib/css";
import styles from "./mockScreens.module.css";

/* Illustrative UIs used until a real screenshot or video is supplied. */

function SalonSoftScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <small>Today · Glow Nails</small>
        <span className={styles.pill}>Live</span>
      </div>
      <h4 className={styles.title}>Overview</h4>
      <div className={styles.card}>
        <small>Revenue today</small>
        <div className={styles.row}>
          <b className={styles.big}>$2,480</b>
          <span className={styles.pill}>+12%</span>
        </div>
        <div className={styles.bar}>
          <i style={{ width: "72%" }} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Appointments</span>
          <b>18</b>
        </div>
        <small>4 upcoming in the next hour</small>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Staff clocked in</span>
          <b>7 / 9</b>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Linh · my earnings</span>
          <b>$312</b>
        </div>
        <small>Visible with owner permission</small>
      </div>
      <div className={styles.cta}>View report</div>
    </div>
  );
}

const DAYS = [
  ["Mon", "3"],
  ["Tue", "4"],
  ["Wed", "5"],
  ["Thu", "6"],
  ["Fri", "7"],
];
const SLOTS = ["9:00", "9:30", "10:15", "11:00", "11:30", "12:00"];

function BookedByScreen() {
  return (
    <div className={styles.wrap}>
      <small>Glow Nails & Spa</small>
      <h4 className={styles.title}>Pick a time</h4>
      <div className={styles.days}>
        {DAYS.map(([day, date]) => (
          <span key={day} className={cx(styles.day, day === "Tue" && styles.daySelected)}>
            {day}
            <b>{date}</b>
          </span>
        ))}
      </div>
      <div className={styles.slots}>
        {SLOTS.map((slot) => (
          <span key={slot} className={cx(styles.slot, slot === "10:15" && styles.slotSelected)}>
            {slot}
          </span>
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <span>Gel manicure · Linh</span>
          <b>$45</b>
        </div>
      </div>
      <div className={styles.cta}>Book Tue 10:15</div>
    </div>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

function CheckInScreen() {
  return (
    <div className={styles.wrap}>
      <small>Welcome to Glow Nails</small>
      <h4 className={styles.title}>Check in with your phone</h4>
      <div className={cx(styles.card, styles.phoneNumber)}>(714) 555 – 01__</div>
      <div className={styles.keypad}>
        {KEYS.map((key) => (
          <span key={key}>{key}</span>
        ))}
      </div>
      <div className={styles.row}>
        <small>Queue</small>
        <small>updates live</small>
      </div>
      <div className={styles.cta}>Continue</div>
    </div>
  );
}

const DEVICES = [
  { name: "Dejavoo Z8", link: "Wi-Fi", note: "Payment terminal · ready", ready: true },
  { name: "Star TSP143", link: "USB", note: "Receipt printer · ready", ready: true },
  { name: "Sunmi V2s", link: "BLE", note: "Reconnecting…", ready: false },
];

function HardwareScreen() {
  return (
    <div className={styles.wrap}>
      <small>Merchant · Devices</small>
      <h4 className={styles.title}>Hardware</h4>
      {DEVICES.map((device) => (
        <div key={device.name} className={styles.card}>
          <div className={styles.row}>
            <span>
              <i className={cx(styles.dot, !device.ready && styles.dotWarn)} aria-hidden />
              {device.name}
            </span>
            <span className={styles.pill}>{device.link}</span>
          </div>
          <small>{device.note}</small>
          {!device.ready && (
            <div className={styles.bar}>
              <i style={{ width: "64%" }} />
            </div>
          )}
        </div>
      ))}
      <div className={styles.cta}>Print test receipt</div>
    </div>
  );
}

const DISHES = [
  ["Chickenjoy", "89.000₫"],
  ["Jolly Spaghetti", "45.000₫"],
  ["Burger Steak", "55.000₫"],
  ["Peach Pie", "25.000₫"],
];

function OrderingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <small>Deliver to · District 1</small>
        <span className={styles.pill}>25 min</span>
      </div>
      <h4 className={styles.title}>What are you craving?</h4>
      <div className={styles.menu}>
        {DISHES.map(([name, price]) => (
          <div key={name} className={styles.card}>
            <div className={styles.dishImage} aria-hidden />
            <b>{name}</b>
            <small>{price}</small>
          </div>
        ))}
      </div>
      <div className={styles.cta}>View cart · 2 items</div>
    </div>
  );
}

export const MOCK_SCREENS: Record<HeroScreen, () => ReactElement> = {
  salonsoft: SalonSoftScreen,
  bookedby: BookedByScreen,
  checkin: CheckInScreen,
  hardware: HardwareScreen,
  ordering: OrderingScreen,
};
