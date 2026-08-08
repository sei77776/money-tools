import { describe, it, expect } from "vitest";
import { AFFILIATE, activeOffers, isEnabled, normalizeLink } from "../public/lib/affiliate.js";

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

  it("ふるさと納税の先頭は楽天ふるさと納税（楽天アフィリエイトを利用）", () => {
    expect(AFFILIATE.furusato[0].name).toContain("楽天ふるさと納税");
    expect(AFFILIATE.furusato[0].provider).toBe("rakuten");
  });
});

describe("normalizeLink: 楽天の発行リンクをそのまま貼れるようにする", () => {
  it("素のURLはそのまま返す", () => {
    expect(normalizeLink("https://hb.afl.rakuten.co.jp/hgc/xxxx/")).toBe(
      "https://hb.afl.rakuten.co.jp/hgc/xxxx/"
    );
  });

  it("前後の空白・改行を除去する", () => {
    expect(normalizeLink("  https://example.com/a \n")).toBe("https://example.com/a");
  });

  it("楽天が発行するHTMLスニペットから最初のhrefを抽出する", () => {
    const snippet = `<a href="https://hb.afl.rakuten.co.jp/hgc/AAA/" target="_blank"><img src="https://hbb.afl.rakuten.co.jp/img.gif"></a><a href="https://hb.afl.rakuten.co.jp/hgc/BBB/">楽天ふるさと納税</a>`;
    expect(normalizeLink(snippet)).toBe("https://hb.afl.rakuten.co.jp/hgc/AAA/");
  });

  it("シングルクォートのhrefも抽出できる", () => {
    expect(normalizeLink("<a href='https://example.com/x'>テキスト</a>")).toBe(
      "https://example.com/x"
    );
  });

  it("プロトコル相対リンク（//で始まる）はhttps:を補う", () => {
    expect(normalizeLink('<a href="//hb.afl.rakuten.co.jp/hgc/CCC/">x</a>')).toBe(
      "https://hb.afl.rakuten.co.jp/hgc/CCC/"
    );
  });

  it("空・未定義は空文字を返す", () => {
    expect(normalizeLink("")).toBe("");
    expect(normalizeLink(undefined)).toBe("");
    expect(normalizeLink("   ")).toBe("");
  });

  it("http/https以外のスキームは拒否する（javascript: 等の混入防止）", () => {
    expect(normalizeLink("javascript:alert(1)")).toBe("");
    expect(normalizeLink('<a href="javascript:alert(1)">x</a>')).toBe("");
    expect(normalizeLink("data:text/html,<script>")).toBe("");
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

  it("HTMLスニペットを貼った場合もURLに正規化されて有効になる", () => {
    const offers = [{ name: "楽天", desc: "d", url: '<a href="https://hb.afl.rakuten.co.jp/z">楽天</a>' }];
    const active = activeOffers(offers);
    expect(active).toHaveLength(1);
    expect(active[0].url).toBe("https://hb.afl.rakuten.co.jp/z");
  });

  it("不正なスキームだけのオファーは表示されない", () => {
    expect(activeOffers([{ name: "X", desc: "d", url: "javascript:alert(1)" }])).toEqual([]);
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

describe("設定済みリンクの健全性", () => {
  it("楽天ふるさと納税のリンクが設定済みで、https URLに正規化される", () => {
    const rakuten = AFFILIATE.furusato.find((o) => o.provider === "rakuten");
    const url = normalizeLink(rakuten.url);
    expect(url).toMatch(/^https:\/\//);
  });

  it("ふるさと納税ページに表示されるオファーが1件以上ある", () => {
    expect(isEnabled(AFFILIATE.furusato)).toBe(true);
  });

  it("年収の壁ページは提携案件が無いため非表示のまま", () => {
    expect(isEnabled(AFFILIATE.kabe)).toBe(false);
  });

  it("設定済みの全リンクがhttp/httpsであること（不正スキームの混入防止）", () => {
    for (const o of [...AFFILIATE.furusato, ...AFFILIATE.kabe]) {
      if ((o.url ?? "").trim()) {
        expect(normalizeLink(o.url)).toMatch(/^https?:\/\//);
      }
    }
  });
});
