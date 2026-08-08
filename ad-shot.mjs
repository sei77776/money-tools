import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8931";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
await page.goto(`${BASE}/furusato.html`);
await page.click("#calc-form button.primary");
// 提携後の状態をシミュレート（実データは入れず、レンダリング結果の見た目確認のみ）
await page.evaluate(async () => {
  const { renderOffers } = await import("./js/affiliate-ui.js");
  const { AFFILIATE } = await import("./lib/affiliate.js");
  const withUrls = AFFILIATE.furusato.map((o, i) => ({ ...o, url: `https://example.com/${i}` }));
  renderOffers("offers", withUrls, "この上限額の範囲で寄付先を探す");
});
await page.locator("#offers").scrollIntoViewIfNeeded();
await page.screenshot({ path: "/home/user/claude-code/docs/money-tools/screenshot-affiliate.png", clip: await page.locator("#offers").boundingBox() });
await browser.close();
console.log("shot ok");
