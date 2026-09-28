import { describe, it, expect } from "vitest";
import { allPages } from "../public/lib/pseo.js";
import { allTedoriPages } from "../public/lib/tedori-pseo.js";
import { buildLlmsFull } from "../tools/llms-full.mjs";

describe("buildLlmsFull", () => {
  const txt = buildLlmsFull(allPages(), allTedoriPages());

  it("検証済みの制度数値を含む（記憶でなくparams由来の要点）", () => {
    expect(txt).toContain("178万円");
    expect(txt).toContain("週20時間");
    expect(txt).toContain("1月10日");
    expect(txt).toContain("43万円");
  });

  it("ふるさと納税の早見表データを全件含む（年収500万・独身=58,000円）", () => {
    expect(txt).toContain("58,000");
    // 全ページ分の行がある
    const rows = txt.match(/^- 年収\d+万円・.+: [\d,]+円$/gm) ?? [];
    expect(rows.length).toBe(allPages().length);
  });

  it("手取り早見表データを全件含む", () => {
    const rows = txt.match(/^- 年収\d+万円: 手取り約[\d,]+円/gm) ?? [];
    expect(rows.length).toBe(allTedoriPages().length);
  });

  it("各ページの正規URLを含む（引用先として示せる）", () => {
    expect(txt).toContain("https://sei77776.github.io/money-tools/furusato.html");
    expect(txt).toContain("https://sei77776.github.io/money-tools/furusato-yarikata.html");
    expect(txt).toContain("https://sei77776.github.io/money-tools/tedori/");
  });

  it("免責を含む", () => {
    expect(txt).toContain("概算");
    expect(txt).toContain("税務");
  });
});
