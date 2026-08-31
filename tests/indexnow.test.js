import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { INDEXNOW_KEY, urlsFromSitemap } from "../tools/ping-indexnow.mjs";

describe("urlsFromSitemap", () => {
  it("sitemapのXMLから<loc>のURL一覧を抽出する", () => {
    const xml = `<?xml version="1.0"?>
<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/a.html</loc></url></urlset>`;
    expect(urlsFromSitemap(xml)).toEqual(["https://example.com/", "https://example.com/a.html"]);
  });

  it("実際のsitemap.xmlから全URL（73件）を抽出できる", () => {
    const xml = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
    const urls = urlsFromSitemap(xml);
    expect(urls.length).toBe(73);
    expect(urls[0]).toBe("https://sei77776.github.io/money-tools/");
  });
});

describe("IndexNowキー", () => {
  it("キーファイルがサイトルートに置かれ、内容がキーと一致する", () => {
    const content = readFileSync(new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url), "utf8");
    expect(content.trim()).toBe(INDEXNOW_KEY);
    expect(INDEXNOW_KEY).toMatch(/^[0-9a-f]{32}$/);
  });
});
