import { describe, it, expect } from "vitest";
import {
  SALARY_STEPS,
  FAMILY_PATTERNS,
  pageSlug,
  buildPageData,
  allPages,
} from "../public/lib/pseo.js";

describe("マスタデータ", () => {
  it("年収ステップは昇順で重複しない", () => {
    expect(SALARY_STEPS.length).toBeGreaterThan(10);
    for (let i = 1; i < SALARY_STEPS.length; i++) {
      expect(SALARY_STEPS[i]).toBeGreaterThan(SALARY_STEPS[i - 1]);
    }
  });

  it("家族構成パターンはkey/label/dependentsを持つ", () => {
    expect(FAMILY_PATTERNS.length).toBeGreaterThanOrEqual(3);
    for (const f of FAMILY_PATTERNS) {
      expect(typeof f.key).toBe("string");
      expect(typeof f.label).toBe("string");
      expect(Number.isInteger(f.dependents)).toBe(true);
    }
  });
});

describe("pageSlug", () => {
  it("年収と家族構成からURLスラッグを作る", () => {
    expect(pageSlug(5_000_000, FAMILY_PATTERNS[0])).toBe("nenshu-500man-dokushin");
  });
  it("スラッグはURLに使える文字だけ", () => {
    for (const income of SALARY_STEPS) {
      for (const f of FAMILY_PATTERNS) {
        expect(pageSlug(income, f)).toMatch(/^[a-z0-9-]+$/);
      }
    }
  });
  it("全組み合わせでスラッグが一意", () => {
    const slugs = SALARY_STEPS.flatMap((i) => FAMILY_PATTERNS.map((f) => pageSlug(i, f)));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("buildPageData: 各ページ固有のデータを組み立てる", () => {
  const page = buildPageData(5_000_000, FAMILY_PATTERNS[0]);

  it("上限額と内訳を持つ", () => {
    expect(page.safeLimit).toBeGreaterThan(0);
    expect(page.breakdown.residentTaxIncomePortion).toBeGreaterThan(0);
    expect(page.breakdown.marginalRate).toBeGreaterThan(0);
  });

  it("タイトルとディスクリプションに年収と家族構成が入る", () => {
    expect(page.title).toContain("500万");
    expect(page.title).toContain("ふるさと納税");
    expect(page.description).toContain("500万");
    expect(page.description.length).toBeLessThanOrEqual(160);
  });

  it("タイトルに上限額（答えの金額）が入る（CTR対策）", () => {
    expect(page.title).toContain(`${page.safeLimit.toLocaleString("ja-JP")}円`);
    // 検索結果で切れにくい長さに収める
    expect(page.title.length).toBeLessThanOrEqual(45);
  });

  it("近隣年収の早見表を持つ（同じ家族構成で前後を比較）", () => {
    expect(page.neighbors.length).toBeGreaterThanOrEqual(3);
    for (const n of page.neighbors) {
      expect(n).toHaveProperty("income");
      expect(n).toHaveProperty("safeLimit");
      expect(n).toHaveProperty("slug");
    }
    // 自分自身が含まれ、current フラグが立つ
    const self = page.neighbors.find((n) => n.income === 5_000_000);
    expect(self.current).toBe(true);
  });

  it("同じ年収での家族構成比較を持つ", () => {
    expect(page.familyComparison.length).toBe(FAMILY_PATTERNS.length);
    const single = page.familyComparison.find((f) => f.key === "dokushin");
    const many = page.familyComparison.find((f) => f.dependents === 3);
    expect(single.safeLimit).toBeGreaterThan(many.safeLimit);
  });

  it("年収が1段上がったときの増加額を示唆として持つ", () => {
    expect(page.insight.nextIncome).toBeGreaterThan(5_000_000);
    expect(page.insight.diff).toBeGreaterThan(0);
  });

  it("最高年収のページには次段の示唆が無い", () => {
    const top = buildPageData(SALARY_STEPS.at(-1), FAMILY_PATTERNS[0]);
    expect(top.insight).toBeNull();
  });
});

describe("allPages: 薄いページを作らない", () => {
  const pages = allPages();

  it("上限額が0円になる組み合わせは生成しない", () => {
    for (const p of pages) {
      expect(p.safeLimit).toBeGreaterThan(0);
    }
  });

  it("ある程度の枚数が生成される", () => {
    expect(pages.length).toBeGreaterThan(30);
  });

  it("タイトルが全ページで一意（キーワードの共食いを避ける）", () => {
    const titles = pages.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("スラッグが全ページで一意", () => {
    const slugs = pages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("上限額は年収が上がるほど大きい（同じ家族構成内で単調）", () => {
    for (const f of FAMILY_PATTERNS) {
      const rows = pages.filter((p) => p.family.key === f.key).sort((a, b) => a.income - b.income);
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i].safeLimit).toBeGreaterThanOrEqual(rows[i - 1].safeLimit);
      }
    }
  });
});
