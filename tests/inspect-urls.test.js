import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { keyUrls, summarizeInspection } from "../tools/inspect-urls.mjs";

const BASE = "https://sei77776.github.io/money-tools";

describe("keyUrls", () => {
  const xml = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = keyUrls(xml);

  it("静的ページ全部とハブ2つを含む", () => {
    for (const u of [
      `${BASE}/`,
      `${BASE}/furusato.html`,
      `${BASE}/kabe.html`,
      `${BASE}/furusato/`,
      `${BASE}/tedori/`,
      `${BASE}/furusato-itsumade.html`,
      `${BASE}/onestop-guide.html`,
      `${BASE}/kabe-106man.html`,
    ]) {
      expect(urls).toContain(u);
    }
  });

  it("pSEO各セクションの代表ページを1つずつ含む", () => {
    expect(urls.some((u) => /\/furusato\/nenshu-.+\//.test(u))).toBe(true);
    expect(urls.some((u) => /\/tedori\/nenshu-.+\//.test(u))).toBe(true);
  });

  it("API消費を抑えるため12件以下に絞る", () => {
    expect(urls.length).toBeLessThanOrEqual(12);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("summarizeInspection", () => {
  it("APIレスポンスから要点を抽出する", () => {
    const api = {
      inspectionResult: {
        indexStatusResult: {
          verdict: "PASS",
          coverageState: "Submitted and indexed",
          robotsTxtState: "ALLOWED",
          indexingState: "INDEXING_ALLOWED",
          lastCrawlTime: "2026-09-10T01:23:45Z",
          googleCanonical: "https://sei77776.github.io/money-tools/",
        },
      },
    };
    expect(summarizeInspection("https://sei77776.github.io/money-tools/", api)).toEqual({
      url: "https://sei77776.github.io/money-tools/",
      verdict: "PASS",
      coverageState: "Submitted and indexed",
      robotsTxtState: "ALLOWED",
      indexingState: "INDEXING_ALLOWED",
      lastCrawlTime: "2026-09-10T01:23:45Z",
      googleCanonical: "https://sei77776.github.io/money-tools/",
    });
  });

  it("未インデックスなど欠けたフィールドはnullで埋める", () => {
    const api = { inspectionResult: { indexStatusResult: { verdict: "NEUTRAL", coverageState: "URL is unknown to Google" } } };
    const s = summarizeInspection("https://example.com/x", api);
    expect(s.verdict).toBe("NEUTRAL");
    expect(s.coverageState).toBe("URL is unknown to Google");
    expect(s.lastCrawlTime).toBeNull();
    expect(s.googleCanonical).toBeNull();
  });
});
