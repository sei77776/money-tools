import { describe, it, expect } from "vitest";
import { AFFILIATE, activeOffers, isEnabled } from "../public/lib/affiliate.js";

describe("アフィリエイト設定", () => {
  it("各オファーは名前・説明・urlの枠を持つ", () => {
    for (const list of [AFFILIATE.furusato, AFFILIATE.kabe]) {
      for (const o of list) {
        expect(typeof o.name).toBe("string");
        expect(o.name.length).toBeGreaterThan(0);
        expect(typeof o.desc).toBe("string");
        expect(o).toHaveProperty("url");
      }
    }
  });

  it("広告であることの表示文言が定義されている（ステマ規制対応）", () => {
    expect(AFFILIATE.label).toBe("広告");
    expect(AFFILIATE.disclosure).toMatch(/広告|アフィリエイト/);
  });
});

describe("activeOffers: URL未設定のものは出さない", () => {
  it("urlが空文字のオファーは除外される", () => {
    const offers = [
      { name: "A", desc: "a", url: "" },
      { name: "B", desc: "b", url: "https://example.com/b" },
    ];
    expect(activeOffers(offers)).toHaveLength(1);
    expect(activeOffers(offers)[0].name).toBe("B");
  });

  it("urlが未定義・空白のみのオファーも除外される", () => {
    const offers = [
      { name: "A", desc: "a" },
      { name: "B", desc: "b", url: "   " },
    ];
    expect(activeOffers(offers)).toHaveLength(0);
  });

  it("全て未設定なら空配列（＝提携前は何も表示しない）", () => {
    expect(activeOffers(AFFILIATE.furusato.map((o) => ({ ...o, url: "" })))).toEqual([]);
  });
});

describe("isEnabled: 表示可否の判定", () => {
  it("有効なオファーが1つ以上あればtrue", () => {
    expect(isEnabled([{ name: "A", desc: "a", url: "https://example.com" }])).toBe(true);
  });
  it("有効なオファーが無ければfalse", () => {
    expect(isEnabled([{ name: "A", desc: "a", url: "" }])).toBe(false);
    expect(isEnabled([])).toBe(false);
  });
});

describe("提携前の初期状態", () => {
  it("初期状態では全オファーのurlが空（偽リンクを公開しない）", () => {
    const all = [...AFFILIATE.furusato, ...AFFILIATE.kabe];
    const configured = all.filter((o) => (o.url ?? "").trim());
    // 提携後にこのテストが落ちたら、URLを設定した証拠なので期待値を更新する
    expect(configured.length).toBe(0);
  });
});
