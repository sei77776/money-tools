/**
 * IndexNow ping（デプロイ後に実行）。
 * sitemap.xml の全URLを api.indexnow.org へ一括通知する。
 * 対応検索エンジン: Bing 等（Googleは非対応。Googleはsitemap経由のクロール待ち）。
 * キーは公開情報（サイト所有権の確認用にサイトルートで配信する仕様）。
 */
import { readFile } from "node:fs/promises";

export const INDEXNOW_KEY = "2821f3f04c015e8efdb21358662e7154";
const HOST = "sei77776.github.io";

/** sitemapのXMLから <loc> のURL一覧を抽出する */
export function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urlList = urlsFromSitemap(xml);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/money-tools/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  console.log(`IndexNow: ${urlList.length} urls submitted, status ${res.status}`);
  // 202 = 受理（キー検証は非同期）。200/202以外は警告として扱うがビルドは落とさない
  if (res.status !== 200 && res.status !== 202) {
    console.warn(`IndexNow: unexpected status ${res.status}: ${await res.text()}`);
  }
}

// テストからのimport時は実行しない
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.warn(`IndexNow ping failed (non-fatal): ${e.message}`);
  });
}
