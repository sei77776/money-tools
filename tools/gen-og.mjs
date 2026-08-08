// OGP画像(1200x630)を tools/og-image.html から生成して public/og.png に保存
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(new URL("./og-image.html", import.meta.url).href);
await page.waitForTimeout(300);
await page.screenshot({ path: new URL("../public/og.png", import.meta.url).pathname });
await browser.close();
console.log("og.png generated");
