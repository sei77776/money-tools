import { describe, it, expect } from "vitest";
import { isInsured, detectWalls, netIncomeCurve } from "../public/lib/kabe.js";

describe("社会保険加入の判定（2026年10月以降のモデル）", () => {
  it("130万円以上は勤務先によらず加入（被扶養者から外れる）", () => {
    expect(isInsured(1_300_000, { companySize: "small", weekly20h: false })).toBe(true);
  });
  it("適用対象の勤務先＋週20時間以上なら年収によらず加入（賃金要件は撤廃済み）", () => {
    expect(isInsured(900_000, { companySize: "large", weekly20h: true })).toBe(true);
    expect(isInsured(1_100_000, { companySize: "large", weekly20h: true })).toBe(true);
  });
  it("適用対象の勤務先でも週20時間未満なら未加入（130万円未満）", () => {
    expect(isInsured(1_100_000, { companySize: "large", weekly20h: false })).toBe(false);
  });
  it("対象外の勤務先では130万円未満なら未加入（週20時間以上でも）", () => {
    expect(isInsured(1_100_000, { companySize: "small", weekly20h: true })).toBe(false);
  });
});

describe("壁の判定", () => {
  it("金額ベースの壁は130万・178万（106万の賃金要件は2026年10月撤廃のため無し）", () => {
    const walls = detectWalls(1_200_000, { companySize: "large", weekly20h: true });
    const amounts = walls.map((w) => w.amount);
    expect(amounts).toEqual([1_300_000, 1_780_000]);
    expect(amounts).not.toContain(1_060_000);
  });
  it("現在の年収が各壁の手前か先かを判定する", () => {
    const walls = detectWalls(1_400_000, { companySize: "small", weekly20h: false });
    const w130 = walls.find((w) => w.amount === 1_300_000);
    const w178 = walls.find((w) => w.amount === 1_780_000);
    expect(w130.crossed).toBe(true);
    expect(w178.crossed).toBe(false);
    expect(w178.marginToWall).toBe(380_000);
  });
});

describe("手取りカーブと逆転の可視化", () => {
  it("130万円の壁を越えると手取りが逆転する（未加入だった人）", () => {
    const opts = { companySize: "small", weekly20h: false };
    const below = netIncomeCurve(1_290_000, 1_290_000, 1, opts)[0];
    const above = netIncomeCurve(1_310_000, 1_310_000, 1, opts)[0];
    expect(above.net).toBeLessThan(below.net);
  });
  it("既に加入している人（週20時間・対象勤務先）は130万円で逆転しない", () => {
    const opts = { companySize: "large", weekly20h: true };
    const curve = netIncomeCurve(1_200_000, 1_400_000, 50_000, opts);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].net).toBeGreaterThan(curve[i - 1].net);
    }
  });
  it("カーブは指定範囲を指定刻みで返す", () => {
    const curve = netIncomeCurve(1_000_000, 2_000_000, 100_000, { companySize: "small", weekly20h: false });
    expect(curve).toHaveLength(11);
    expect(curve[0]).toEqual({ income: 1_000_000, net: expect.any(Number) });
    expect(curve.at(-1).income).toBe(2_000_000);
  });
  it("壁がない区間では手取りは単調増加", () => {
    const curve = netIncomeCurve(1_400_000, 1_700_000, 50_000, { companySize: "small", weekly20h: false });
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].net).toBeGreaterThan(curve[i - 1].net);
    }
  });
});
