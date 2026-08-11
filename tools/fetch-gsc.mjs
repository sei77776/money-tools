/**
 * Search Console APIから検索パフォーマンスを取得して data/gsc/ に保存する。
 * GitHub Actions（.github/workflows/gsc-fetch.yml）から週次で実行される。
 *
 * 必要な環境変数:
 *   GSC_SA_KEY: サービスアカウントのJSONキー（丸ごと）
 *
 * 認証はサービスアカウントのJWT（RS256）→ OAuthトークン交換。外部依存なし。
 */
import { createSign } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const SITE_URL = "https://sei77776.github.io/money-tools/";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  );
  const input = `${header}.${claims}`;
  const signature = createSign("RSA-SHA256").update(input).sign(sa.private_key);
  const jwt = `${input}.${b64url(signature)}`;

  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${jwt}`,
  });
  if (!resp.ok) throw new Error(`token exchange failed: ${resp.status} ${await resp.text()}`);
  return (await resp.json()).access_token;
}

async function query(token, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`searchAnalytics failed: ${resp.status} ${await resp.text()}`);
  return (await resp.json()).rows ?? [];
}

const sa = JSON.parse(process.env.GSC_SA_KEY ?? "");
const token = await getAccessToken(sa);

// GSCのデータは2日ほど遅れるため、終了日は2日前。過去28日分を取得
const day = (offset) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
const range = { startDate: day(29), endDate: day(2) };

const [topQueries, topPages] = await Promise.all([
  query(token, { ...range, dimensions: ["query"], rowLimit: 100 }),
  query(token, { ...range, dimensions: ["page"], rowLimit: 250 }),
]);

const summary = {
  fetchedAt: new Date().toISOString(),
  site: SITE_URL,
  range,
  totals: {
    clicks: topPages.reduce((s, r) => s + r.clicks, 0),
    impressions: topPages.reduce((s, r) => s + r.impressions, 0),
  },
  topQueries: topQueries.map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number((r.ctr * 100).toFixed(2)),
    position: Number(r.position.toFixed(1)),
  })),
  topPages: topPages.map((r) => ({
    page: r.keys[0].replace(SITE_URL, "/"),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: Number((r.ctr * 100).toFixed(2)),
    position: Number(r.position.toFixed(1)),
  })),
};

await mkdir("data/gsc", { recursive: true });
await writeFile(`data/gsc/${range.endDate}.json`, JSON.stringify(summary, null, 2));
await writeFile("data/gsc/latest.json", JSON.stringify(summary, null, 2));
console.log(
  `GSC ${range.startDate}..${range.endDate}: ${summary.totals.clicks} clicks / ${summary.totals.impressions} impressions, ${topQueries.length} queries, ${topPages.length} pages`
);
