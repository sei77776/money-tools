/**
 * ふるさと納税に関わる期限の純関数群。
 * 制度上の期日は params2026.js（出典つき）から取得する。
 */
import { PARAMS } from "./params2026.js";

/** 次のワンストップ特例申請期限（翌年1月10日必着）。当日中はまだ有効。 */
export function nextOneStopDeadline(now = new Date()) {
  const { month, day } = PARAMS.furusato.oneStopDeadline;
  const thisYear = new Date(now.getFullYear(), month - 1, day, 23, 59, 59);
  return now <= thisYear
    ? new Date(now.getFullYear(), month - 1, day)
    : new Date(now.getFullYear() + 1, month - 1, day);
}

/** 今年の寄付の締切（12月31日）。この日までの寄付が当年分の控除対象。 */
export function donationYearEnd(now = new Date()) {
  return new Date(now.getFullYear(), 11, 31);
}

/** 社会保険の週20時間ルール（賃金要件撤廃）の施行日 */
export function hoursRuleEffectiveDate() {
  const [y, m, d] = PARAMS.socialInsurance.hoursRule.effectiveFrom.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** now から target までの残り日数（日付単位・当日は0） */
export function daysUntil(now, target) {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b - a) / 86_400_000);
}
