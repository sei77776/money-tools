import { furusatoLimit } from "../lib/furusato.js";
import { PARAMS } from "../lib/params2026.js";

const yen = (n) => n.toLocaleString("ja-JP");
const $ = (id) => document.getElementById(id);

const STORE_KEY = "money-tools.furusato.records.v1";
const LIMIT_KEY = "money-tools.furusato.lastSafeLimit.v1";

// ---- 上限額計算 ----
function runCalc() {
  const income = Number($("income").value) * 10_000;
  const dependents = Number($("dependents").value);
  const insured = $("insured").checked;
  const r = furusatoLimit(income, { dependents, insured });

  $("safe-limit").textContent = yen(r.safeLimit);
  $("raw-limit").textContent = yen(r.limit);
  $("breakdown").innerHTML = [
    ["給与所得（収入 − 給与所得控除）", r.breakdown.employmentIncome],
    ["社会保険料（概算）", r.breakdown.socialInsurance],
    ["所得税の課税所得（概算）", r.breakdown.taxableIncomeTax],
    ["住民税の所得割（概算）", r.breakdown.residentTaxIncomePortion],
  ]
    .map(([k, v]) => `<tr><th>${k}</th><td class="num">${yen(v)} 円</td></tr>`)
    .join("") +
    `<tr><th>所得税の限界税率</th><td class="num">${(r.breakdown.marginalRate * 100).toFixed(0)}%</td></tr>`;
  $("result").hidden = false;
  localStorage.setItem(LIMIT_KEY, String(r.safeLimit));
  renderRecords();
}

$("calc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  runCalc();
});

// ---- 寄付の記録（localStorageのみ・外部送信なし） ----
const loadRecords = () => JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
const saveRecords = (rs) => localStorage.setItem(STORE_KEY, JSON.stringify(rs));

function renderRecords() {
  const records = loadRecords();
  $("record-rows").innerHTML = records
    .map(
      (r, i) => `<tr>
        <td>${r.date}</td><td>${escapeHtml(r.name)}</td>
        <td class="num">${yen(r.amount)} 円</td>
        <td>${r.oneStop ? "申請予定" : "—"}</td>
        <td><button class="ghost" data-del="${i}">削除</button></td>
      </tr>`
    )
    .join("");
  const total = records.reduce((s, r) => s + r.amount, 0);
  $("record-total").textContent = `${yen(total)} 円`;
  const safeLimit = Number(localStorage.getItem(LIMIT_KEY) ?? 0);
  $("record-remaining").textContent = safeLimit
    ? total <= safeLimit
      ? `上限まであと ${yen(safeLimit - total)} 円`
      : `⚠ 上限を ${yen(total - safeLimit)} 円 超えています`
    : "";
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

$("record-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const records = loadRecords();
  records.push({
    date: $("rec-date").value,
    name: $("rec-name").value.trim(),
    amount: Number($("rec-amount").value),
    oneStop: $("rec-onestop").checked,
  });
  saveRecords(records);
  e.target.reset();
  renderRecords();
});

$("record-rows").addEventListener("click", (e) => {
  const idx = e.target?.dataset?.del;
  if (idx === undefined) return;
  const records = loadRecords();
  records.splice(Number(idx), 1);
  saveRecords(records);
  renderRecords();
});

// ---- ワンストップ期限 ----
function nextDeadline(now = new Date()) {
  const { month, day } = PARAMS.furusato.oneStopDeadline;
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  return now <= thisYear ? thisYear : new Date(now.getFullYear() + 1, month - 1, day);
}

function renderDeadline() {
  const now = new Date();
  const dl = nextDeadline(now);
  const days = Math.ceil((dl - now) / 86_400_000);
  $("deadline-text").textContent =
    `次の期限は ${dl.getFullYear()}年${dl.getMonth() + 1}月${dl.getDate()}日（あと${days}日）です。`;
}

$("ics-btn").addEventListener("click", () => {
  const dl = nextDeadline();
  const y = dl.getFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  const d = `${y}${pad(dl.getMonth() + 1)}${pad(dl.getDate())}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//money-tools//furusato//JP",
    "BEGIN:VEVENT",
    `UID:furusato-onestop-${y}@money-tools`,
    `DTSTART;VALUE=DATE:${d}`,
    "SUMMARY:ふるさと納税 ワンストップ特例 申請期限（必着）",
    "DESCRIPTION:寄付した自治体へのワンストップ特例申請書の提出期限です。",
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    "DESCRIPTION:ワンストップ特例の期限まであと1週間",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `furusato-onestop-${y}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
});

renderDeadline();
renderRecords();
runCalc();
