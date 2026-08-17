import { describe, it, expect } from "vitest";
import { nextOneStopDeadline, donationYearEnd, daysUntil } from "../public/lib/deadline.js";

describe("nextOneStopDeadline", () => {
  it("年の途中なら翌年1月10日を返す", () => {
    const d = nextOneStopDeadline(new Date(2026, 7, 17)); // 2026-08-17
    expect(d.getFullYear()).toBe(2027);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(10);
  });

  it("1月10日より前なら当年の1月10日を返す", () => {
    const d = nextOneStopDeadline(new Date(2027, 0, 5)); // 2027-01-05
    expect(d.getFullYear()).toBe(2027);
    expect(d.getDate()).toBe(10);
  });

  it("1月10日当日はまだ当年の期限", () => {
    const d = nextOneStopDeadline(new Date(2027, 0, 10));
    expect(d.getFullYear()).toBe(2027);
  });

  it("1月11日以降は翌年の1月10日", () => {
    const d = nextOneStopDeadline(new Date(2027, 0, 11));
    expect(d.getFullYear()).toBe(2028);
  });
});

describe("donationYearEnd", () => {
  it("当年の12月31日を返す", () => {
    const d = donationYearEnd(new Date(2026, 7, 17));
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(31);
  });

  it("12月31日当日も当年", () => {
    const d = donationYearEnd(new Date(2026, 11, 31));
    expect(d.getFullYear()).toBe(2026);
  });
});

describe("daysUntil", () => {
  it("同日は0日", () => {
    expect(daysUntil(new Date(2026, 11, 31, 9), new Date(2026, 11, 31))).toBe(0);
  });

  it("前日は1日", () => {
    expect(daysUntil(new Date(2026, 11, 30), new Date(2026, 11, 31))).toBe(1);
  });

  it("2026-08-17から2026-12-31は136日", () => {
    expect(daysUntil(new Date(2026, 7, 17), new Date(2026, 11, 31))).toBe(136);
  });
});
