import { describe, it, expect } from "vitest";
import { netIncome } from "../public/lib/income.js";
import {
  TEDORI_SALARY_STEPS,
  tedoriSlug,
  buildTedoriPageData,
  allTedoriPages,
} from "../public/lib/tedori-pseo.js";

describe("TEDORI_SALARY_STEPS", () => {
  it("壁ゾーン（100万台）と一般帯（200万〜1500万）をカバーし、昇順・重複なし", () => {
    expect(TEDORI_SALARY_STEPS[0]).toBe(1_000_000);
    expect(TEDORI_SALARY_STEPS).toContain(1_300_000);
    expect(TEDORI_SALARY_STEPS).toContain(5_000_000);
    expect(TEDORI_SALARY_STEPS).toContain(15_000_000);
    const sorted = [...TEDORI_SALARY_STEPS].sort((a, b) => a - b);
    expect(TEDORI_SALARY_STEPS).toEqual(sorted);
    expect(new Set(TEDORI_SALARY_STEPS).size).toBe(TEDORI_SALARY_STEPS.length);
  });
});

describe("buildTedoriPageData", () => {
  const p400 = buildTedoriPageData(4_000_000);

  it("手取りがincome.jsのnetIncome（社保加入）と一致する", () => {
    expect(p400.net).toBe(netIncome(4_000_000, { insured: true }));
    expect(p400.insuredScenario).toBe(true);
  });

  it("タイトルに答え（手取り額・万円）が入り、45文字以内", () => {
    const netMan = Math.round(p400.net / 10_000);
    expect(p400.title).toContain(`約${netMan}万円`);
    expect(p400.title).toContain("400万");
    expect(p400.title.length).toBeLessThanOrEqual(45);
  });

  it("月あたりの手取りを持つ", () => {
    expect(p400.netMonthly).toBe(Math.round(p400.net / 12));
  });

  it("壁ゾーン（130万円未満）は未加入を主シナリオとし、加入時の比較を持つ", () => {
    const p120 = buildTedoriPageData(1_200_000);
    expect(p120.insuredScenario).toBe(false);
    expect(p120.net).toBe(netIncome(1_200_000, { insured: false }));
    expect(p120.netIfInsured).toBe(netIncome(1_200_000, { insured: true }));
    expect(p120.net).toBeGreaterThan(p120.netIfInsured);
  });

  it("130万円以上は加入が前提で、比較シナリオを持たない", () => {
    const p300 = buildTedoriPageData(3_000_000);
    expect(p300.insuredScenario).toBe(true);
    expect(p300.netIfInsured).toBeNull();
  });

  it("壁の判定表を持つ（130万・178万）", () => {
    expect(p400.walls.length).toBeGreaterThanOrEqual(2);
    expect(p400.walls.every((w) => "crossed" in w)).toBe(true);
  });

  it("近隣年収のリンクデータを持つ", () => {
    expect(p400.neighbors.length).toBeGreaterThanOrEqual(3);
    expect(p400.neighbors.some((n) => n.current)).toBe(true);
  });

  it("スラッグ形式", () => {
    expect(tedoriSlug(4_000_000)).toBe("nenshu-400man");
    expect(p400.slug).toBe("nenshu-400man");
  });

  it("同年収のふるさと納税ページへのクロスセルリンク（存在する年収のみ）", () => {
    expect(p400.furusatoSlug).toBe("nenshu-400man-dokushin");
    const p120 = buildTedoriPageData(1_200_000);
    expect(p120.furusatoSlug).toBeNull();
  });
});

describe("allTedoriPages", () => {
  const pages = allTedoriPages();

  it("全年収帯のページを生成し、手取りは正の値", () => {
    expect(pages.length).toBe(TEDORI_SALARY_STEPS.length);
    for (const p of pages) expect(p.net).toBeGreaterThan(0);
  });

  it("タイトルは全ページ一意", () => {
    const titles = pages.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
