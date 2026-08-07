/**
 * 年収の壁の判定と手取りカーブ（概算）。
 *
 * 社会保険の加入判定（2026年10月以降のルール・年金制度改正法）:
 *   - 年収130万円以上: 被扶養者から外れるため加入（勤務先によらず）
 *   - 適用対象の勤務先（従業員51人以上）＋週20時間以上: 年収によらず加入
 *     ※ 賃金要件（月8.8万円≒年106万円）は2026年10月に撤廃済み
 *   - 企業規模要件は2027年10月から段階的撤廃（2029年10月に5人以上へ）
 *   ※ 雇用見込み期間・学生除外等の実際の要件は勤務先に確認が必要
 */
import { PARAMS } from "./params2026.js";
import { netIncome } from "./income.js";

export function isInsured(income, { companySize, weekly20h }) {
  if (income >= PARAMS.socialInsurance.dependentLimit) return true;
  return companySize === "large" && weekly20h === true;
}

/** 各壁について、現在年収が越えているか・あといくらかを返す */
export function detectWalls(income, opts) {
  return PARAMS.walls.map((w) => ({
    ...w,
    crossed: income >= w.amount,
    marginToWall: Math.max(0, w.amount - income),
  }));
}

/** 年収を動かしたときの手取り推移（壁による逆転の可視化用） */
export function netIncomeCurve(from, to, step, opts) {
  const points = [];
  for (let income = from; income <= to; income += step) {
    points.push({
      income,
      net: netIncome(income, { insured: isInsured(income, opts) }),
    });
  }
  return points;
}
