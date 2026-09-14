/**
 * Search Console URL Inspection APIで主要ページのインデックス状態を診断し、
 * data/gsc/coverage-*.json に保存する。gsc-fetch.yml から週次で実行される。
 *
 * 目的: 「なぜ表示されないか」を推測でなくデータで判断する
 * （インデックス済みか・クロールされたか・除外理由は何か）。
 *
 * 必要な環境変数: GSC_ACCESS_TOKEN（webmasters.readonly スコープで可）
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";

const SITE_URL = "https://sei77776.github.io/money-tools/";

/** sitemapから診断対象の代表URLを選ぶ（静的8＋各pSEOセクション代表1つずつ） */
export function keyUrls(sitemapXml) {
  const all = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const isStatic = (u) => !/\/(furusato|tedori)\/nenshu-/.test(u);
  const statics = all.filter(isStatic);
  const firstFurusato = all.find((u) => /\/furusato\/nenshu-/.test(u));
  const firstTedori = all.find((u) => /\/tedori\/nenshu-/.test(u));
  return [...new Set([...statics, firstFurusato, firstTedori].filter(Boolean))];
}

/** APIレスポンスを保存用の要点に絞る */
export function summarizeInspection(url, apiResult) {
  const r = apiResult?.inspectionResult?.indexStatusResult ?? {};
  return {
    url,
    verdict: r.verdict ?? null,
    coverageState: r.coverageState ?? null,
    robotsTxtState: r.robotsTxtState ?? null,
    indexingState: r.indexingState ?? null,
    lastCrawlTime: r.lastCrawlTime ?? null,
    googleCanonical: r.googleCanonical ?? null,
  };
}

async function inspect(token, inspectionUrl) {
  const resp = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl, siteUrl: SITE_URL }),
  });
  if (!resp.ok) throw new Error(`inspect failed for ${inspectionUrl}: ${resp.status} ${await resp.text()}`);
  return resp.json();
}

async function main() {
  const token = process.env.GSC_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("GSC_ACCESS_TOKEN is required");

  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = keyUrls(xml);

  const results = [];
  for (const url of urls) {
    try {
      results.push(summarizeInspection(url, await inspect(token, url)));
    } catch (e) {
      results.push({ url, error: String(e.message ?? e) });
    }
    // APIに礼儀正しく（QPM制限対策）
    await new Promise((r) => setTimeout(r, 1200));
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    site: SITE_URL,
    indexed: results.filter((r) => r.verdict === "PASS").length,
    total: results.length,
    results,
  };

  const dir = new URL("../data/gsc/", import.meta.url).pathname;
  await mkdir(dir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(`${dir}coverage-${today}.json`, JSON.stringify(out, null, 2), "utf8");
  await writeFile(`${dir}coverage-latest.json`, JSON.stringify(out, null, 2), "utf8");
  console.log(`coverage: ${out.indexed}/${out.total} indexed`);
  for (const r of results) console.log(`  ${r.verdict ?? "ERR"} ${r.coverageState ?? r.error} ${r.url}`);
}

// テストからのimport時は実行しない
if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
