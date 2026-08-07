// 3ページの実描画・計算動作のスモークチェック（npm run serve を起動した状態で実行）
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8931";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

// 環境同梱のChromiumを直接指定（Playwrightバージョンとの不一致を回避）
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));

// index
await page.goto(`${BASE}/index.html`);
check("index: タイトル表示", (await page.title()).includes("お金の制度計算ツール"));
check("index: 2ツールへのリンク", (await page.locator(".tool-link").count()) === 2);

// furusato
await page.goto(`${BASE}/furusato.html`);
await page.fill("#income", "500");
await page.click("#calc-form button.primary");
const safeLimit = await page.textContent("#safe-limit");
check("furusato: 年収500万で上限58,000円", safeLimit.trim() === "58,000", `got ${safeLimit.trim()}`);

await page.fill("#rec-date", "2026-08-07");
await page.fill("#rec-name", "北海道紋別市");
await page.fill("#rec-amount", "10000");
await page.click("#record-form button.primary");
const total = await page.textContent("#record-total");
check("furusato: 寄付記録の合計反映", total.includes("10,000"), `got ${total.trim()}`);
const remaining = await page.textContent("#record-remaining");
check("furusato: 残り枠の表示", remaining.includes("48,000"), `got ${remaining.trim()}`);
await page.reload();
const totalAfterReload = await page.textContent("#record-total");
check("furusato: リロード後も記録が残る(localStorage)", totalAfterReload.includes("10,000"));
const deadline = await page.textContent("#deadline-text");
check("furusato: 期限カウントダウン表示", /1月10日（あと\d+日）/.test(deadline), deadline.trim());
const dl = page.waitForEvent("download");
await page.click("#ics-btn");
check("furusato: ICSダウンロード", (await dl).suggestedFilename().endsWith(".ics"));

// kabe
await page.goto(`${BASE}/kabe.html`);
await page.fill("#income", "140");
await page.selectOption("#company-size", "small");
await page.uncheck("#weekly20h");
await page.click("#calc-form button.primary");
const walls = await page.textContent("#walls");
check("kabe: 140万で130万の壁を越えた判定", walls.includes("130万円の壁") && (await page.locator(".badge.crossed").count()) >= 1);
check("kabe: 週20時間ルールの表示（賃金要件撤廃）", walls.includes("週20時間の壁") && walls.includes("撤廃"));
const insuredNote = await page.textContent("#insured-note");
check("kabe: 社保加入の注記", insuredNote.includes("加入する想定"), insuredNote.trim());
check("kabe: 手取りカーブSVG描画", (await page.locator("#chart svg path").count()) === 1);

// 賃金要件撤廃: 90万円でも 適用勤務先＋週20時間なら加入
await page.fill("#income", "90");
await page.selectOption("#company-size", "large");
await page.check("#weekly20h");
await page.click("#calc-form button.primary");
const note90 = await page.textContent("#insured-note");
check("kabe: 90万・51人以上・週20hで加入（年収非依存）", note90.includes("加入する想定"), note90.trim());

// legal
await page.goto(`${BASE}/legal.html`);
check("legal: タイトル", (await page.title()).includes("免責事項・プライバシーポリシー"));
const legalBody = await page.textContent("main");
check("legal: 外部送信の表示（Google Fonts）", legalBody.includes("Google Fonts") && legalBody.includes("IPアドレス"));
check("legal: localStorageキーの明記と削除手段", legalBody.includes("money-tools.furusato.records.v1") && legalBody.includes("削除"));

const SHOTS = new URL("../../docs/money-tools/", import.meta.url).pathname;
await page.goto(`${BASE}/kabe.html`);
await page.click("#calc-form button.primary");
await page.screenshot({ path: `${SHOTS}screenshot-kabe.png`, fullPage: true });
await page.goto(`${BASE}/legal.html`);
await page.screenshot({ path: `${SHOTS}screenshot-legal.png`, fullPage: true });
await page.goto(`${BASE}/furusato.html`);
await page.screenshot({ path: `${SHOTS}screenshot-furusato.png`, fullPage: true });
await page.goto(`${BASE}/index.html`);
await page.screenshot({ path: `${SHOTS}screenshot-index.png`, fullPage: true });

// ダークモードの実レンダリング確認（ライト/ダーク両対応は部門の必須要件）
await page.emulateMedia({ colorScheme: "dark" });
await page.goto(`${BASE}/kabe.html`);
await page.click("#calc-form button.primary");
check("dark: 壁ページ描画・JSエラーなし", (await page.locator("#chart svg path").count()) === 1);
await page.screenshot({ path: `${SHOTS}screenshot-kabe-dark.png`, fullPage: true });
await page.goto(`${BASE}/index.html`);
await page.screenshot({ path: `${SHOTS}screenshot-index-dark.png`, fullPage: true });
await page.emulateMedia({ colorScheme: "light" });

check("JSエラーなし（全ページ）", pageErrors.length === 0, pageErrors.join("; "));
await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
