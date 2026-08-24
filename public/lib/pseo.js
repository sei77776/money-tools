/**
 * pSEO（年収×家族構成のふるさと納税上限額ページ）のデータ生成。
 *
 * 設計方針:
 *   各ページが「テンプレートの変数を差し替えただけ」にならないよう、
 *   ページごとに固有の計算結果・早見表・比較・示唆を持たせる。
 *   上限額が0円になる組み合わせ（住民税所得割が発生しない低所得帯）は
 *   薄いページになるため生成しない。
 *
 * 注意:
 *   dependents は「扶養控除の対象となる扶養親族の人数」。
 *   16歳未満の子どもは扶養控除の対象外（児童手当の対象）のため人数に含めない。
 *   この注記は生成ページ側にも必ず表示すること。
 */
import { furusatoLimit } from "./furusato.js";

/** ページ化する年収（円）。検索需要のある代表値に絞る */
export const SALARY_STEPS = [
  2_000_000, 2_500_000, 3_000_000, 3_500_000, 4_000_000, 4_500_000, 5_000_000,
  5_500_000, 6_000_000, 6_500_000, 7_000_000, 7_500_000, 8_000_000, 9_000_000,
  10_000_000, 12_000_000, 15_000_000,
];

/** 家族構成パターン */
export const FAMILY_PATTERNS = [
  {
    key: "dokushin",
    slug: "dokushin",
    label: "独身・共働き（扶養親族なし）",
    short: "独身・共働き",
    dependents: 0,
  },
  {
    key: "fuyo1",
    slug: "fuyo1",
    label: "扶養親族1人（配偶者を扶養など）",
    short: "扶養1人",
    dependents: 1,
  },
  {
    key: "fuyo2",
    slug: "fuyo2",
    label: "扶養親族2人",
    short: "扶養2人",
    dependents: 2,
  },
  {
    key: "fuyo3",
    slug: "fuyo3",
    label: "扶養親族3人",
    short: "扶養3人",
    dependents: 3,
  },
];

const man = (income) => Math.round(income / 10_000);

/** URLスラッグ: nenshu-500man-dokushin */
export function pageSlug(income, family) {
  return `nenshu-${man(income)}man-${family.slug}`;
}

const limitOf = (income, family) =>
  furusatoLimit(income, { dependents: family.dependents }).safeLimit;

/** 1ページ分のデータを組み立てる */
export function buildPageData(income, family) {
  const r = furusatoLimit(income, { dependents: family.dependents });
  const idx = SALARY_STEPS.indexOf(income);

  // 近隣年収の早見表（前後2段ずつ・同じ家族構成）
  const neighbors = SALARY_STEPS.slice(Math.max(0, idx - 2), idx + 3).map((i) => ({
    income: i,
    man: man(i),
    safeLimit: limitOf(i, family),
    slug: pageSlug(i, family),
    current: i === income,
  }));

  // 同じ年収での家族構成比較
  const familyComparison = FAMILY_PATTERNS.map((f) => ({
    key: f.key,
    label: f.label,
    short: f.short,
    dependents: f.dependents,
    safeLimit: limitOf(income, f),
    slug: pageSlug(income, f),
    current: f.key === family.key,
  }));

  // 年収が1段上がったときの上限額の増加
  const next = SALARY_STEPS[idx + 1];
  const insight =
    next === undefined
      ? null
      : {
          nextIncome: next,
          nextMan: man(next),
          nextLimit: limitOf(next, family),
          diff: limitOf(next, family) - r.safeLimit,
          slug: pageSlug(next, family),
        };

  return {
    income,
    man: man(income),
    family,
    slug: pageSlug(income, family),
    safeLimit: r.safeLimit,
    rawLimit: r.limit,
    breakdown: r.breakdown,
    neighbors,
    familyComparison,
    insight,
    title: `年収${man(income)}万円・${family.short}のふるさと納税上限額は約${r.safeLimit.toLocaleString("ja-JP")}円【2026年】`,
    description: `年収${man(income)}万円・${family.label}の場合、ふるさと納税で自己負担2,000円に収まる控除上限額の目安は約${r.safeLimit.toLocaleString("ja-JP")}円です。2026年（令和8年）の制度に対応した計算内訳と、年収別・家族構成別の早見表を掲載。`,
  };
}

/** 生成対象の全ページ（上限0円の組み合わせは除外） */
export function allPages() {
  const pages = [];
  for (const income of SALARY_STEPS) {
    for (const family of FAMILY_PATTERNS) {
      const page = buildPageData(income, family);
      if (page.safeLimit > 0) pages.push(page);
    }
  }
  return pages;
}
