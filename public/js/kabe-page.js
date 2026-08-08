import { isInsured, detectWalls, netIncomeCurve } from "../lib/kabe.js";
import { netIncome } from "../lib/income.js";
import { AFFILIATE } from "../lib/affiliate.js";
import { renderOffers } from "./affiliate-ui.js";

const yen = (n) => n.toLocaleString("ja-JP");
const $ = (id) => document.getElementById(id);

function run() {
  const income = Number($("income").value) * 10_000;
  const companySize = $("company-size").value;
  const weekly20h = $("weekly20h").checked;
  const opts = { companySize, weekly20h };

  const insured = isInsured(income, opts);
  $("net").textContent = yen(netIncome(income, { insured }));
  $("insured-note").textContent = insured
    ? "この条件では社会保険に加入する想定です"
    : "この条件では社会保険には加入しない想定です";

  const hoursRule = `<div class="wall">
      <span class="badge ${companySize === "large" && weekly20h ? "crossed" : "safe"}">${
        companySize === "large" && weekly20h ? "加入対象" : "対象外"
      }</span>
      <div><strong>週20時間の壁（社会保険）2026年10月〜</strong><br>
      <span class="note">賃金要件（月8.8万円≒年106万円）は撤廃。従業員51人以上の勤務先で週20時間以上働くと、年収に関わらず加入対象。企業規模要件も2027年10月から段階的に撤廃予定</span></div>
    </div>`;

  const walls = detectWalls(income, opts);
  $("walls").innerHTML =
    `<h2 style="margin-top:0">壁の判定</h2>` +
    hoursRule +
    walls
      .map(
        (w) => `<div class="wall">
          <span class="badge ${w.crossed ? "crossed" : "safe"}">${w.crossed ? "越えています" : `あと ${yen(w.marginToWall)} 円`}</span>
          <div><strong>${w.label}</strong><br><span class="note">${w.note}</span></div>
        </div>`
      )
      .join("");

  renderChart(income, opts);
  renderOffers("offers", AFFILIATE.kabe, "働き方を見直すときの選択肢");
  $("result").hidden = false;
}

function renderChart(currentIncome, opts) {
  // 配色はCSSトークンから取得（ライト/ダーク両対応）
  const css = getComputedStyle(document.documentElement);
  const tok = (name) => css.getPropertyValue(name).trim();
  const cLine = tok("--brand"), cWall = tok("--warn"), cGrid = tok("--line"),
    cSoft = tok("--ink-soft"), cInk = tok("--ink"), cPoint = tok("--accent");
  const from = 800_000;
  const to = 2_200_000;
  const curve = netIncomeCurve(from, to, 10_000, opts);
  const W = 720, H = 320, padL = 70, padR = 16, padT = 14, padB = 40;
  const nets = curve.map((p) => p.net);
  const yMin = Math.min(...nets) * 0.97;
  const yMax = Math.max(...nets) * 1.02;
  const x = (v) => padL + ((v - from) / (to - from)) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);

  const path = curve.map((p, i) => `${i ? "L" : "M"}${x(p.income).toFixed(1)},${y(p.net).toFixed(1)}`).join(" ");
  const wallLines = [1_300_000, 1_780_000]
    .map(
      (w) => `<line x1="${x(w)}" y1="${padT}" x2="${x(w)}" y2="${H - padB}" stroke="${cWall}" stroke-dasharray="4 4" stroke-width="1"/>
        <text x="${x(w)}" y="${H - padB + 16}" font-size="11" text-anchor="middle" fill="${cWall}">${w / 10_000}万</text>`
    )
    .join("");
  const cur = curve.reduce((a, b) =>
    Math.abs(b.income - currentIncome) < Math.abs(a.income - currentIncome) ? b : a
  );
  const yTicks = [0.25, 0.5, 0.75, 1]
    .map((t) => {
      const v = yMin + t * (yMax - yMin);
      return `<text x="${padL - 8}" y="${y(v) + 4}" font-size="11" text-anchor="end" fill="${cSoft}">${Math.round(v / 10_000)}万</text>
        <line x1="${padL}" y1="${y(v)}" x2="${W - padR}" y2="${y(v)}" stroke="${cGrid}" stroke-width="1"/>`;
    })
    .join("");

  $("chart").innerHTML = `<svg class="curve" viewBox="0 0 ${W} ${H}" role="img" aria-label="年収と手取りの関係グラフ">
    ${yTicks}
    ${wallLines}
    <path d="${path}" fill="none" stroke="${cLine}" stroke-width="2.5"/>
    <circle cx="${x(cur.income)}" cy="${y(cur.net)}" r="5" fill="${cPoint}"/>
    <text x="${x(cur.income)}" y="${y(cur.net) - 10}" font-size="12" text-anchor="middle" fill="${cInk}">現在 ${yen(cur.net)}円</text>
    <text x="${(padL + W - padR) / 2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="${cSoft}">年収（額面）</text>
  </svg>`;
}

$("calc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  run();
});
run();
