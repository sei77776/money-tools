/**
 * 手取りpSEO（年収別の手取り・壁判定ページ）のデータ生成。
 *
 * 設計方針:
 *   - 「年収N万円 手取り」の検索意図に、答え（手取り額）をタイトルで直接返す
 *   - 壁ゾーン（130万円未満）は社保未加入（被扶養）を主シナリオとし、
 *     加入した場合との比較を必ず併記する（このサイトの差別化ポイント）
 *   - 130万円以上は被扶養者から外れるため加入が前提
 *   - kabeページの文脈適合ルールに従い、広告枠は置かない
 */
import { PARAMS } from "./params2026.js";
import { netIncome, socialInsurance, incomeTaxWithSurtax, taxableIncomeForIncomeTax, residentTax } from "./income.js";
import { detectWalls } from "./kabe.js";
import { SALARY_STEPS, FAMILY_PATTERNS, pageSlug, buildPageData } from "./pseo.js";

/** 壁ゾーン（100万円台）＋一般帯（ふるさと納税側と同じ代表値） */
export const TEDORI_SALARY_STEPS = [
  1_000_000, 1_100_000, 1_200_000, 1_300_000, 1_400_000, 1_500_000, 1_600_000, 1_780_000,
  ...SALARY_STEPS.filter((s) => s >= 2_000_000),
];

const man = (income) => Math.round(income / 10_000);

/** URLスラッグ: nenshu-400man（178万円は nenshu-178man） */
export function tedoriSlug(income) {
  return `nenshu-${man(income)}man`;
}

/** 同じ年収のふるさと納税ページ（独身）が存在すればそのスラッグを返す */
function furusatoSlugFor(income) {
  if (!SALARY_STEPS.includes(income)) return null;
  const page = buildPageData(income, FAMILY_PATTERNS[0]);
  return page.safeLimit > 0 ? pageSlug(income, FAMILY_PATTERNS[0]) : null;
}

/** 1ページ分のデータを組み立てる */
export function buildTedoriPageData(income) {
  // 130万円以上は被扶養者から外れるため社保加入が前提。未満は未加入（被扶養）を主に
  const insuredScenario = income >= PARAMS.socialInsurance.dependentLimit;
  const net = netIncome(income, { insured: insuredScenario });
  const netIfInsured = insuredScenario ? null : netIncome(income, { insured: true });

  // 内訳（主シナリオ）
  const social = socialInsurance(income, { insured: insuredScenario });
  const it = incomeTaxWithSurtax(taxableIncomeForIncomeTax(income, social));
  const rt = residentTax(income, social);

  const idx = TEDORI_SALARY_STEPS.indexOf(income);
  const neighbors = TEDORI_SALARY_STEPS.slice(Math.max(0, idx - 2), idx + 3).map((i) => ({
    income: i,
    man: man(i),
    net: netIncome(i, { insured: i >= PARAMS.socialInsurance.dependentLimit }),
    slug: tedoriSlug(i),
    current: i === income,
  }));

  const netMan = Math.round(net / 10_000);
  const scenarioNote = insuredScenario ? "" : "（社保未加入時）";

  return {
    income,
    man: man(income),
    slug: tedoriSlug(income),
    insuredScenario,
    net,
    netIfInsured,
    netMonthly: Math.round(net / 12),
    breakdown: { social, incomeTax: it, residentTax: rt },
    walls: detectWalls(income),
    neighbors,
    furusatoSlug: furusatoSlugFor(income),
    title: `年収${man(income)}万円の手取りは約${netMan}万円${scenarioNote}【2026年】`,
    description: `年収${man(income)}万円（額面）の手取りは約${net.toLocaleString("ja-JP")}円、月あたり約${Math.round(net / 12).toLocaleString("ja-JP")}円です${scenarioNote}。2026年（令和8年）の制度に対応した概算の内訳と、130万円・178万円の壁との位置関係を掲載。`,
  };
}

/** 生成対象の全ページ */
export function allTedoriPages() {
  return TEDORI_SALARY_STEPS.map((income) => buildTedoriPageData(income));
}
