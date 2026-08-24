// 3ページの実描画・計算動作のスモークチェック（npm run serve を起動した状態で実行）
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8942";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

// 環境同梱のChromiumを直接指定（Playwrightバージョンとの不一致を回避）
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
// 外部リクエスト（Google Fonts等）は中断する。
// 検証対象はサイト自身の挙動であり、外部の到達性でテストが不安定になるのを防ぐ。
await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
page.setDefaultNavigationTimeout(15_000);
page.setDefaultTimeout(15_000);
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));

// index
await page.goto(`${BASE}/index.html`);
check("index: タイトル表示", (await page.title()).includes("お金の制度計算ツール"));
check("index: 3カード（2ツール＋早見表）へのリンク", (await page.locator(".tool-link").count()) === 3);

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

// アフィリエイト枠: kabeは提携案件が無いため非表示のまま
check("ad: 広告枠が非表示（kabe・提携案件なし）", await page.locator("#offers").isHidden());

// クロスセル: 壁判定の結果と一緒に、世帯訴求のふるさと納税導線が見える
check("cross-sell: 世帯訴求カードが表示される", await page.locator("#cross-sell").isVisible());
check("cross-sell: ふるさと納税ツールへのリンク", (await page.getAttribute("#cross-sell a.btn-link", "href")) === "furusato.html");

// llms.txt（AI検索対策）が配信されている
const llmsResp = await page.request.get(`${BASE}/llms.txt`);
check("llms: llms.txtが200で配信される", llmsResp.status() === 200);
check("llms: 検証済みの制度要点を含む", (await llmsResp.text()).includes("178万円"));

// アフィリエイト枠: furusatoは楽天リンク設定済みなので実際に表示される
await page.goto(`${BASE}/furusato.html`);
await page.click("#calc-form button.primary");
check("ad: 広告枠が表示される（furusato）", await page.locator("#offers").isVisible());
check("ad: 「広告」ラベルが見える", (await page.textContent("#offers .ad-label")).trim() === "広告");
check("ad: 開示文が見える", (await page.textContent("#offers")).includes("成果報酬"));
const adLink = page.locator("#offers a.offer").first();
const adHref = await adLink.getAttribute("href");
check("ad: hrefがhttpsの実リンク", /^https:\/\//.test(adHref), adHref);
check("ad: rel属性", (await adLink.getAttribute("rel")) === "sponsored nofollow noopener");
check("ad: 別タブで開く", (await adLink.getAttribute("target")) === "_blank");

// アフィリエイト枠: URLを設定した場合のレンダリング要件を実ブラウザで検証
const adHtml = await page.evaluate(async () => {
  const { renderOffers } = await import("./js/affiliate-ui.js");
  const el = document.createElement("div");
  el.id = "ad-test";
  document.body.appendChild(el);
  renderOffers("ad-test", [{ name: "テスト提携先", desc: "説明", url: "https://example.com/aff" }], "広告見出し");
  return el.innerHTML;
});
check("ad: 「広告」ラベルが表示される（ステマ規制）", /class="ad-label">広告</.test(adHtml));
check("ad: 開示文が表示される", adHtml.includes("成果報酬"));
check("ad: rel=sponsored nofollow noopener が付く", adHtml.includes('rel="sponsored nofollow noopener"'));
check("ad: 別タブで開く", adHtml.includes('target="_blank"'));

// ---- pSEO: 早見表ハブ ----
await page.goto(`${BASE}/furusato/`);
check("pseo: ハブのタイトル", (await page.title()).includes("早見表"));
const hubLinks = await page.locator("main table.plain a").count();
check("pseo: ハブから個別ページへのリンク数", hubLinks >= 50, `${hubLinks} links`);
check("pseo: ハブのcanonical", (await page.getAttribute('link[rel="canonical"]', "href")) === "https://sei77776.github.io/money-tools/furusato/");

// ---- pSEO: 個別ページ ----
await page.goto(`${BASE}/furusato/nenshu-500man-dokushin/`);
check("pseo: 個別ページのタイトル", (await page.title()).includes("年収500万円"));
check("pseo: タイトルに上限額（CTR対策）", (await page.title()).includes("58,000円"));
// ツール側の計算結果（58,000円）と生成ページの数値が一致すること
check("pseo: 上限額がツールの計算と一致", (await page.textContent(".result-big .num")).includes("58,000"));
check("pseo: パンくずが表示される", await page.locator("nav.crumbs").isVisible());
const jsonld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent));
check("pseo: JSON-LDが1件", jsonld.length === 1);
const graph = JSON.parse(jsonld[0])["@graph"];
check("pseo: BreadcrumbList", graph.some((g) => g["@type"] === "BreadcrumbList"));
check("pseo: FAQPage", graph.some((g) => g["@type"] === "FAQPage" && g.mainEntity.length >= 3));
check("pseo: 近隣年収の内部リンク", (await page.locator('main a[href^="../nenshu-"]').count()) >= 5);
check("pseo: 広告枠（広告ラベル付き）", (await page.textContent("section.ad .ad-label")).trim() === "広告");
check("pseo: 16歳未満の注記", (await page.textContent("main")).includes("16歳未満"));
check("pseo: 免責", (await page.textContent("footer")).includes("概算"));

// ---- 記事: ふるさと納税はいつまで？ ----
await page.goto(`${BASE}/furusato-itsumade.html`);
check("記事(いつまで): タイトル", (await page.title()).includes("いつまで"));
check("記事(いつまで): canonical", (await page.getAttribute('link[rel="canonical"]', "href")) === "https://sei77776.github.io/money-tools/furusato-itsumade.html");
const itsumadeJsonld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent)));
check("記事(いつまで): FAQPage構造化データ", itsumadeJsonld.some((j) => (j["@graph"] ?? [j]).some((g) => g["@type"] === "FAQPage")));
const itsumadeBody = await page.textContent("main");
check("記事(いつまで): 12月31日の期限を明記", itsumadeBody.includes("12月31日"));
check("記事(いつまで): 年末のカウントダウン表示", /あと\d+日/.test(await page.textContent("#yearend-countdown")));
check("記事(いつまで): ツールへの内部リンク", (await page.locator('main a[href="furusato.html"]').count()) >= 1);
check("記事(いつまで): 関連記事への内部リンク", (await page.locator('main a[href="onestop-guide.html"]').count()) >= 1);
check("記事(いつまで): 広告枠（ラベル＋開示文）", await page.locator("#offers").isVisible() && (await page.textContent("#offers .ad-label")).trim() === "広告" && (await page.textContent("#offers")).includes("成果報酬"));
check("記事(いつまで): 免責", (await page.textContent("footer")).includes("概算"));

// ---- 記事: ワンストップ特例のやり方 ----
await page.goto(`${BASE}/onestop-guide.html`);
check("記事(ワンストップ): タイトル", (await page.title()).includes("ワンストップ"));
check("記事(ワンストップ): canonical", (await page.getAttribute('link[rel="canonical"]', "href")) === "https://sei77776.github.io/money-tools/onestop-guide.html");
const onestopJsonld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent)));
check("記事(ワンストップ): FAQPage構造化データ", onestopJsonld.some((j) => (j["@graph"] ?? [j]).some((g) => g["@type"] === "FAQPage")));
const onestopBody = await page.textContent("main");
check("記事(ワンストップ): 1月10日必着を明記", onestopBody.includes("1月10日") && onestopBody.includes("必着"));
check("記事(ワンストップ): 期限カウントダウン表示", /あと\d+日/.test(await page.textContent("#onestop-countdown")));
check("記事(ワンストップ): 5自治体の条件を明記", onestopBody.includes("5自治体"));
check("記事(ワンストップ): ツールへの内部リンク", (await page.locator('main a[href="furusato.html"]').count()) >= 1);
check("記事(ワンストップ): 広告枠（ラベル＋開示文）", await page.locator("#offers").isVisible() && (await page.textContent("#offers .ad-label")).trim() === "広告");

// ---- 記事: 106万円の壁の撤廃 ----
await page.goto(`${BASE}/kabe-106man.html`);
check("記事(106万): タイトル", (await page.title()).includes("106万"));
check("記事(106万): canonical", (await page.getAttribute('link[rel="canonical"]', "href")) === "https://sei77776.github.io/money-tools/kabe-106man.html");
const kabe106Jsonld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent)));
check("記事(106万): FAQPage構造化データ", kabe106Jsonld.some((j) => (j["@graph"] ?? [j]).some((g) => g["@type"] === "FAQPage")));
const kabe106Body = await page.textContent("main");
check("記事(106万): 週20時間の新基準を明記", kabe106Body.includes("週20時間") && kabe106Body.includes("撤廃"));
check("記事(106万): 51人以上の企業規模要件を明記", kabe106Body.includes("51人以上"));
check("記事(106万): 施行日カウントダウン", /あと\d+日|施行済み/.test(await page.textContent("#hoursrule-countdown")));
check("記事(106万): ツールへの内部リンク", (await page.locator('main a[href="kabe.html"]').count()) >= 1);
check("記事(106万): 広告枠なし（文脈適合ルール）", (await page.locator("#offers").count()) === 0);

// ---- sitemap に記事が入っている ----
const sitemapXml = await (await page.request.get(`${BASE}/sitemap.xml`)).text();
check("sitemap: 記事3本を含む", sitemapXml.includes("furusato-itsumade.html") && sitemapXml.includes("onestop-guide.html") && sitemapXml.includes("kabe-106man.html"));

// ---- index から記事への導線（孤立ページゼロ） ----
await page.goto(`${BASE}/index.html`);
check("index: 記事への内部リンク", (await page.locator('main a[href="furusato-itsumade.html"]').count()) >= 1 && (await page.locator('main a[href="onestop-guide.html"]').count()) >= 1 && (await page.locator('main a[href="kabe-106man.html"]').count()) >= 1);

// legal
await page.goto(`${BASE}/legal.html`);
check("legal: タイトル", (await page.title()).includes("免責事項・プライバシーポリシー"));
const legalBody = await page.textContent("main");
check("legal: 外部送信の表示（Google Fonts）", legalBody.includes("Google Fonts") && legalBody.includes("IPアドレス"));
check("legal: localStorageキーの明記と削除手段", legalBody.includes("money-tools.furusato.records.v1") && legalBody.includes("削除"));
check("legal: アフィリエイト広告の開示", legalBody.includes("アフィリエイト広告") && legalBody.includes("成果報酬") && legalBody.includes("「広告」と明示"));
check("legal: 入力データが広告先に送信されない旨の明記", legalBody.includes("広告のリンク先に送信されることはありません"));

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
