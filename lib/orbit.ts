/** Degrees, 0 = right of the phone, clockwise: three icons on the left, two on the right. */
export const ORBIT_ANGLES: readonly number[] = [-148, 180, 148, -32, 32];

export type OrbitSize = { stageWidth: number; phoneWidth: number; phoneHeight: number };
export type OrbitPoint = { x: number; y: number; scale: number };

const ICON_CLEARANCE = 44;
const SELECTED_PULL = 0.8;
const SELECTED_SCALE = 1.22;

const radians = (index: number) => (ORBIT_ANGLES[index % ORBIT_ANGLES.length] * Math.PI) / 180;
const round = (n: number) => Math.round(n * 100) / 100;

export function orbitPoint(index: number, selected: boolean, { stageWidth, phoneWidth, phoneHeight }: OrbitSize): OrbitPoint {
  const minX = phoneWidth / 2 + ICON_CLEARANCE;
  const rx = Math.max(minX + 40, Math.min(280, stageWidth / 2 - 36));
  const ry = Math.min(230, phoneHeight / 2 - 20);
  const angle = radians(index);
  let x = Math.cos(angle) * rx;
  let y = Math.sin(angle) * ry;
  if (selected) {
    x = Math.sign(x) * Math.max(Math.abs(x) * SELECTED_PULL, minX);
    y *= SELECTED_PULL;
  }
  return { x: round(x), y: round(y), scale: selected ? SELECTED_SCALE : 1 };
}

export function orbitSide(index: number): "left" | "right" {
  return Math.cos(radians(index)) > 0 ? "right" : "left";
}
