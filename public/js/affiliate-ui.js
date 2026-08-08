/**
 * アフィリエイト枠の描画。
 * ステマ規制対応として「広告」ラベルと開示文を必ずセットで出す。
 * 有効なオファーが無ければ何も描画しない（提携前は枠ごと非表示）。
 */
import { AFFILIATE, activeOffers } from "../lib/affiliate.js";

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/**
 * @param {string} containerId 描画先の要素ID
 * @param {Array} offers AFFILIATE.furusato などのオファー配列
 * @param {string} heading 見出し
 */
export function renderOffers(containerId, offers, heading) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = activeOffers(offers);
  if (list.length === 0) {
    el.innerHTML = "";
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = `
    <h2>
      <span class="ad-label">${escapeHtml(AFFILIATE.label)}</span>
      ${escapeHtml(heading)}
    </h2>
    <p class="note ad-disclosure">${escapeHtml(AFFILIATE.disclosure)}</p>
    <div class="grid">
      ${list
        .map(
          (o) => `<a class="offer" href="${escapeHtml(o.url)}" target="_blank" rel="sponsored nofollow noopener">
            <b>${escapeHtml(o.name)}</b>
            <span>${escapeHtml(o.desc)}</span>
            <span class="cta">サイトを見る →</span>
          </a>`
        )
        .join("")}
    </div>`;
}
