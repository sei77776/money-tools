/**
 * ガイド記事ページ共通スクリプト。
 * - 期限カウントダウン（要素があるものだけ描画）
 * - アフィリエイト枠（広告ラベル＋開示文はaffiliate-ui.jsが担保）
 */
import { nextOneStopDeadline, donationYearEnd, daysUntil } from "../lib/deadline.js";
import { AFFILIATE } from "../lib/affiliate.js";
import { renderOffers } from "./affiliate-ui.js";

const now = new Date();
const fmt = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

const yearEndEl = document.getElementById("yearend-countdown");
if (yearEndEl) {
  const end = donationYearEnd(now);
  yearEndEl.textContent = `${end.getFullYear()}年分の控除にする寄付の締切（${fmt(end)}）まで、あと${daysUntil(now, end)}日です。`;
}

const oneStopEl = document.getElementById("onestop-countdown");
if (oneStopEl) {
  const dl = nextOneStopDeadline(now);
  oneStopEl.textContent = `次のワンストップ特例の申請期限（${fmt(dl)}必着）まで、あと${daysUntil(now, dl)}日です。`;
}

renderOffers("offers", AFFILIATE.furusato, "ふるさと納税をはじめる");
