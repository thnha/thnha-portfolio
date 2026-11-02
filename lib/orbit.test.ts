import { describe, expect, it } from "vitest";
import { ORBIT_ANGLES, orbitPoint, orbitSide } from "./orbit";

const size = { stageWidth: 580, phoneWidth: 270, phoneHeight: 579 };
const distance = ({ x, y }: { x: number; y: number }) => Math.hypot(x, y);

describe("orbitPoint", () => {
  it("has a position for five apps", () => {
    expect(ORBIT_ANGLES).toHaveLength(5);
  });

  it("moves the selected icon closer to the phone and enlarges it", () => {
    const idle = orbitPoint(0, false, size);
    const selected = orbitPoint(0, true, size);
    expect(distance(selected)).toBeLessThan(distance(idle));
    expect(selected.scale).toBeGreaterThan(idle.scale);
  });

  it("never places an icon over the phone", () => {
    const minX = size.phoneWidth / 2 + 44;
    for (let i = 0; i < ORBIT_ANGLES.length; i++) {
      expect(Math.abs(orbitPoint(i, true, size).x)).toBeGreaterThanOrEqual(minX);
      expect(Math.abs(orbitPoint(i, false, size).x)).toBeGreaterThanOrEqual(minX);
    }
  });

  it("keeps icons clear of the phone on a narrow stage", () => {
    const narrow = { stageWidth: 420, phoneWidth: 220, phoneHeight: 472 };
    expect(Math.abs(orbitPoint(1, true, narrow).x)).toBeGreaterThanOrEqual(narrow.phoneWidth / 2 + 44);
  });
});

describe("orbitSide", () => {
  it("reports which side of the phone an icon sits on", () => {
    expect(orbitSide(1)).toBe("left");
    expect(orbitSide(3)).toBe("right");
  });
});
