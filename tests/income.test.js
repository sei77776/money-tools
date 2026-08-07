import { describe, it, expect } from "vitest";
import {
  salaryIncomeDeduction,
  employmentIncome,
  socialInsurance,
  incomeTaxBasicDeduction,
  taxableIncomeForIncomeTax,
  incomeTax,
  incomeTaxWithSurtax,
  residentTaxIncomePortion,
  residentTax,
  netIncome,
} from "../public/lib/income.js";

describe("給与所得控除（2026年モデル・最低保障74万円）", () => {
  it("低収入では最低保障額74万円が適用される", () => {
    expect(salaryIncomeDeduction(1_000_000)).toBe(740_000);
  });
  it("年収500万円では 500万×20%＋44万 = 144万円", () => {
    expect(salaryIncomeDeduction(5_000_000)).toBe(1_440_000);
  });
  it("高収入では上限195万円で頭打ち", () => {
    expect(salaryIncomeDeduction(20_000_000)).toBe(1_950_000);
  });
  it("給与所得 = 収入 − 控除", () => {
    expect(employmentIncome(1_000_000)).toBe(260_000);
    expect(employmentIncome(5_000_000)).toBe(3_560_000);
  });
});

describe("社会保険料（概算）", () => {
  it("加入していれば概算率で計算される", () => {
    expect(socialInsurance(5_000_000, { insured: true })).toBe(750_000);
  });
  it("未加入なら0円", () => {
    expect(socialInsurance(1_000_000, { insured: false })).toBe(0);
  });
});

describe("所得税の基礎控除（令和8年度大綱: 104万/67万/62万）", () => {
  it("合計所得489万円以下は104万円", () => {
    expect(incomeTaxBasicDeduction(3_560_000)).toBe(1_040_000);
    expect(incomeTaxBasicDeduction(4_890_000)).toBe(1_040_000);
  });
  it("合計所得489万円超〜655万円以下は67万円", () => {
    expect(incomeTaxBasicDeduction(5_000_000)).toBe(670_000);
  });
  it("合計所得655万円超〜2,350万円以下は62万円（恒久分58万→62万）", () => {
    expect(incomeTaxBasicDeduction(10_000_000)).toBe(620_000);
  });
});

describe("課税所得と所得税（178万円の壁 = 74万＋104万）", () => {
  it("年収178万円までは課税所得0（未加入パート）", () => {
    expect(taxableIncomeForIncomeTax(1_690_000, 0)).toBe(0);
    expect(taxableIncomeForIncomeTax(1_780_000, 0)).toBe(0);
  });
  it("年収179万円でわずかに課税が発生する（1000円未満切り捨て）", () => {
    // 給与所得 105万 − 基礎控除 104万 = 1万円
    expect(taxableIncomeForIncomeTax(1_790_000, 0)).toBe(10_000);
    expect(incomeTax(10_000)).toBe(500);
  });
  it("課税所得186万円 → 5%区分で93,000円", () => {
    expect(incomeTax(1_860_000)).toBe(93_000);
  });
  it("課税所得300万円 → 10%区分・速算控除で202,500円", () => {
    expect(incomeTax(3_000_000)).toBe(202_500);
  });
  it("復興特別所得税2.1%を上乗せする", () => {
    expect(incomeTaxWithSurtax(1_860_000)).toBe(94_953);
  });
  it("課税所得0なら税額0", () => {
    expect(incomeTax(0)).toBe(0);
    expect(incomeTaxWithSurtax(0)).toBe(0);
  });
});

describe("住民税（概算）", () => {
  it("所得割 = (給与所得 − 社保 − 基礎控除43万) × 10%", () => {
    // 年収500万・社保75万: (356万 − 75万 − 43万) = 238万 → 238,000円
    expect(residentTaxIncomePortion(5_000_000, 750_000)).toBe(238_000);
  });
  it("課税所得がなければ所得割も均等割も0（概算モデル）", () => {
    expect(residentTax(1_000_000, 0)).toBe(0);
  });
  it("所得割がある場合は均等割（概算5,000円）を加える", () => {
    expect(residentTax(5_000_000, 750_000)).toBe(243_000);
  });
});

describe("手取り（概算）", () => {
  it("年収500万円・社保加入・独身の手取り", () => {
    // 給与所得356万・社保75万 → 課税所得177万 → 所得税88,500×1.021=90,358
    // 500万 − 社保75万 − 所得税90,358 − 住民税243,000 = 3,916,642
    expect(netIncome(5_000_000, { insured: true })).toBe(3_916_642);
  });
  it("非課税・未加入なら手取り＝額面", () => {
    expect(netIncome(900_000, { insured: false })).toBe(900_000 - residentTax(900_000, 0));
  });
});
