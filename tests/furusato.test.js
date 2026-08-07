import { describe, it, expect } from "vitest";
import { furusatoLimit } from "../public/lib/furusato.js";

describe("ふるさと納税 控除上限額（概算）", () => {
  it("年収500万円・独身・社保加入で5〜6万円台の上限額になる", () => {
    const r = furusatoLimit(5_000_000, { dependents: 0 });
    // 住民税所得割238,000×20% ÷ (90% − 5%×1.021) ＋ 2,000 ≒ 58,000円
    expect(r.limit).toBeGreaterThan(57_000);
    expect(r.limit).toBeLessThan(59_000);
    expect(r.safeLimit).toBe(58_000);
  });

  it("safeLimitは1,000円単位の切り捨て（安全側）", () => {
    const r = furusatoLimit(6_543_210, { dependents: 1 });
    expect(r.safeLimit % 1000).toBe(0);
    expect(r.safeLimit).toBeLessThanOrEqual(r.limit);
  });

  it("扶養が増えると上限額は下がる", () => {
    const single = furusatoLimit(6_000_000, { dependents: 0 });
    const withDeps = furusatoLimit(6_000_000, { dependents: 2 });
    expect(withDeps.limit).toBeLessThan(single.limit);
  });

  it("年収が上がると上限額は上がる（単調性）", () => {
    let prev = 0;
    for (const income of [3_000_000, 5_000_000, 8_000_000, 12_000_000]) {
      const r = furusatoLimit(income, { dependents: 0 });
      expect(r.limit).toBeGreaterThan(prev);
      prev = r.limit;
    }
  });

  it("住民税所得割が発生しない低収入では上限0円", () => {
    const r = furusatoLimit(900_000, { dependents: 0 });
    expect(r.limit).toBe(0);
    expect(r.safeLimit).toBe(0);
  });

  it("超高所得では特例控除の定額上限193万円で上限額が頭打ちになる（令和8年度改正）", () => {
    const at200m = furusatoLimit(200_000_000, { dependents: 0 });
    const at300m = furusatoLimit(300_000_000, { dependents: 0 });
    expect(at300m.limit).toBe(at200m.limit);
  });

  it("計算内訳（所得割・限界税率）を返す", () => {
    const r = furusatoLimit(5_000_000, { dependents: 0 });
    expect(r.breakdown.residentTaxIncomePortion).toBe(238_000);
    expect(r.breakdown.marginalRate).toBe(0.05);
  });
});
