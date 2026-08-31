/**
 * pSEOページの静的生成。
 *   node tools/build-pseo.mjs
 *
 * 生成物:
 *   public/furusato/index.html            ハブ（全ページの早見表）
 *   public/furusato/<slug>/index.html     年収×家族構成の個別ページ
 *   public/sitemap.xml                    全ページを含めて再生成
 *
 * 生成ファイルは手で編集しない（このスクリプトを直して再生成する）。
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { allPages, FAMILY_PATTERNS, SALARY_STEPS, pageSlug, buildPageData } from "../public/lib/pseo.js";
import { AFFILIATE, activeOffers } from "../public/lib/affiliate.js";

const BASE = "https://sei77776.github.io/money-tools";
const OUT = new URL("../public/furusato/", import.meta.url).pathname;
const TODAY = "2026-08-12";

const yen = (n) => n.toLocaleString("ja-JP");
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const BRAND_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8" y2="11.01"/><line x1="12" y1="11" x2="12" y2="11.01"/><line x1="16" y1="11" x2="16" y2="11.01"/><line x1="8" y1="15" x2="8" y2="15.01"/><line x1="12" y1="15" x2="12" y2="15.01"/><line x1="16" y1="15" x2="16" y2="18.01"/></svg>`;

const header = (depth) => {
  const root = "../".repeat(depth);
  return `<header class="site">
  <a class="brand" href="${root}index.html">${BRAND_SVG}お金の制度計算ツール</a>
  <nav>
    <a href="${root}furusato.html">ふるさと納税</a>
    <a href="${root}kabe.html">年収の壁・手取り</a>
  </nav>
</header>`;
};

const footerNav = (root) => `<nav class="footer-nav">
    <a href="${root}furusato.html">ふるさと納税シミュレーター</a>
    <a href="${root}kabe.html">年収の壁・手取り</a>
    <a href="${root}furusato/">上限額 早見表</a>
    <a href="${root}furusato-itsumade.html">いつまで？期限まとめ</a>
    <a href="${root}onestop-guide.html">ワンストップ特例のやり方</a>
    <a href="${root}kabe-106man.html">106万円の壁の撤廃</a>
  </nav>`;

const footer = (depth, extra = "") => {
  const root = "../".repeat(depth);
  return `<footer class="site">
  ${footerNav(root)}
  <p><strong>免責事項</strong>：本ページの金額はすべて概算・目安であり、税務に関する助言ではありません。実際の控除上限額は収入の内訳・各種控除（住宅ローン控除・医療費控除等）・お住まいの自治体により変わります。正確な金額は源泉徴収票・住民税決定通知書に基づき、自治体・税理士等にご確認ください。制度数値は今後の法令・政省令等により変更される場合があります。${extra}</p>
  <p><a href="${root}legal.html">免責事項・プライバシーポリシー</a></p>
</footer>`;
};

/** アフィリエイト枠（affiliate-ui.js と同じ体裁を静的に出力） */
function adBlock() {
  const offers = activeOffers(AFFILIATE.furusato);
  if (offers.length === 0) return "";
  return `<section class="ad">
  <h2><span class="ad-label">${esc(AFFILIATE.label)}</span> 上限額の範囲で寄付先を探す</h2>
  <p class="note ad-disclosure">${esc(AFFILIATE.disclosure)}</p>
  <div class="grid">
    ${offers
      .map(
        (o) => `<a class="offer" href="${esc(o.url)}" target="_blank" rel="sponsored nofollow noopener">
      <b>${esc(o.name)}</b><span>${esc(o.desc)}</span><span class="cta">サイトを見る →</span>
    </a>`
      )
      .join("\n    ")}
  </div>
</section>`;
}

function pageHtml(p) {
  const url = `${BASE}/furusato/${p.slug}/`;
  const bd = p.breakdown;

  const neighborRows = p.neighbors
    .map(
      (n) => `<tr${n.current ? ' class="is-current"' : ""}>
        <th>${n.current ? `年収${n.man}万円（このページ）` : `<a href="../${n.slug}/">年収${n.man}万円</a>`}</th>
        <td class="num">${yen(n.safeLimit)} 円</td>
      </tr>`
    )
    .join("\n      ");

  const familyRows = p.familyComparison
    .map(
      (f) => `<tr${f.current ? ' class="is-current"' : ""}>
        <th>${f.current ? `${esc(f.label)}（このページ）` : `<a href="../${f.slug}/">${esc(f.label)}</a>`}</th>
        <td class="num">${yen(f.safeLimit)} 円</td>
      </tr>`
    )
    .join("\n      ");

  const insightHtml = p.insight
    ? `<p>年収が <strong>${p.man}万円 → ${p.insight.nextMan}万円</strong> に増えると、上限額の目安は
       <strong>${yen(p.safeLimit)}円 → ${yen(p.insight.nextLimit)}円</strong>（<strong>+${yen(p.insight.diff)}円</strong>）になります。
       <a href="../${p.insight.slug}/">年収${p.insight.nextMan}万円・${esc(p.family.short)}のページ</a></p>`
    : `<p>本サイトで掲載している中で最も高い年収帯のページです。これより高い年収の場合、令和8年度改正で新設された特例控除の定額上限（193万円）の影響を受けることがあります。</p>`;

  const faq = [
    {
      q: `年収${p.man}万円・${p.family.short}のふるさと納税の上限額はいくらですか？`,
      a: `自己負担2,000円に収まる控除上限額の目安は約${yen(p.safeLimit)}円です（社会保険に加入する給与所得者・他の控除なしの概算）。住宅ローン控除や医療費控除がある場合は上限額が下がることがあります。`,
    },
    {
      q: "2026年の税制改正で上限額は変わりますか？",
      a: "上限額は住民税の所得割をもとに計算され、住民税の基礎控除は43万円で据え置きのため、所得税の基礎控除引き上げは一般的な収入層の上限額にはほぼ影響しません。令和8年度改正では特例控除に193万円の定額上限が新設されましたが、影響を受けるのは給与収入で約1億円規模からです。",
    },
    {
      q: "ワンストップ特例の申請期限はいつですか？",
      a: "寄付した翌年の1月10日必着です。6自治体以上に寄付した場合や確定申告をする場合はワンストップ特例が使えないため、確定申告で寄付金控除を申告します。",
    },
  ];

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="お金の制度計算ツール">
<meta property="og:locale" content="ja_JP">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "お金の制度計算ツール", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "ふるさと納税 上限額早見表", item: `${BASE}/furusato/` },
          { "@type": "ListItem", position: 3, name: `年収${p.man}万円・${p.family.short}`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  },
  null,
  2
)}
</script>
<link rel="stylesheet" href="../../style.css">
</head>
<body>
${header(2)}
<main>
  <nav class="crumbs" aria-label="パンくず">
    <a href="../../index.html">ホーム</a> ›
    <a href="../">ふるさと納税 上限額早見表</a> ›
    <span>年収${p.man}万円・${esc(p.family.short)}</span>
  </nav>

  <h1>年収${p.man}万円・${esc(p.family.short)}の<br>ふるさと納税 <span class="accent">上限額の目安</span></h1>
  <p class="lede">${esc(p.family.label)}で年収${p.man}万円（額面）の場合の、自己負担2,000円に収まる控除上限額の目安です。2026年（令和8年）の制度に対応した概算です。</p>

  <div class="result-big">
    <div class="sub">控除上限額の目安（安全側に切り捨て）</div>
    <div class="num">${yen(p.safeLimit)}<span style="font-size:0.45em"> 円</span></div>
    <div class="sub">計算上の上限: ${yen(p.rawLimit)} 円</div>
  </div>

  <p><a class="btn-link" href="../../furusato.html">▶ 自分の年収・家族構成で正確に計算する（無料ツール）</a></p>

  <h2>計算の内訳</h2>
  <div class="card">
    <table class="plain">
      <tr><th>給与収入（額面）</th><td class="num">${yen(p.income)} 円</td></tr>
      <tr><th>給与所得（収入 − 給与所得控除）</th><td class="num">${yen(bd.employmentIncome)} 円</td></tr>
      <tr><th>社会保険料（概算）</th><td class="num">${yen(bd.socialInsurance)} 円</td></tr>
      <tr><th>所得税の課税所得（概算）</th><td class="num">${yen(bd.taxableIncomeTax)} 円</td></tr>
      <tr><th>所得税の限界税率</th><td class="num">${(bd.marginalRate * 100).toFixed(0)}%</td></tr>
      <tr><th>住民税の所得割（概算）</th><td class="num">${yen(bd.residentTaxIncomePortion)} 円</td></tr>
    </table>
    <p class="note">上限額は「住民税の所得割 × 20% ÷（90% − 所得税の限界税率 × 1.021）＋ 2,000円」で概算しています。給与所得控除は2026年の最低保障74万円、所得税の基礎控除は令和8年度税制改正大綱の階層（104万／67万／62万円）を反映しています。</p>
  </div>

  <h2>年収が変わると上限額はどうなる？</h2>
  <div class="card">
    <table class="plain">
      <thead><tr><th>年収（${esc(p.family.short)}の場合）</th><th class="num">上限額の目安</th></tr></thead>
      <tbody>
      ${neighborRows}
      </tbody>
    </table>
    ${insightHtml}
  </div>

  <h2>家族構成が変わると上限額はどうなる？</h2>
  <div class="card">
    <table class="plain">
      <thead><tr><th>家族構成（年収${p.man}万円の場合）</th><th class="num">上限額の目安</th></tr></thead>
      <tbody>
      ${familyRows}
      </tbody>
    </table>
    <p class="note">扶養親族が増えると所得控除が増え、住民税の所得割が下がるため、ふるさと納税の上限額も下がります。<strong>16歳未満の子どもは扶養控除の対象外</strong>（児童手当の対象）のため、人数に含めていません。</p>
  </div>

  ${adBlock()}

  <h2>よくある質問</h2>
  <div class="card">
    ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n    ")}
  </div>

  <h2>関連ページ</h2>
  <div class="card">
    <ul>
      <li><a href="../../furusato.html">ふるさと納税シミュレーター（寄付の記録・ワンストップ期限アラート付き）</a></li>
      <li><a href="../../kabe.html">年収の壁・手取りシミュレーター（178万円の壁・週20時間ルール対応）</a></li>
      <li><a href="../">年収別・家族構成別の上限額 早見表（全ページ一覧）</a></li>
    </ul>
  </div>
</main>
${footer(2)}
</body>
</html>
`;
}

function hubHtml(pages) {
  const url = `${BASE}/furusato/`;
  const byFamily = FAMILY_PATTERNS.map((f) => ({
    family: f,
    rows: pages.filter((p) => p.family.key === f.key).sort((a, b) => a.income - b.income),
  })).filter((g) => g.rows.length > 0);

  const table = `<table class="plain">
    <thead><tr><th>年収</th>${byFamily.map((g) => `<th class="num">${esc(g.family.short)}</th>`).join("")}</tr></thead>
    <tbody>
    ${SALARY_STEPS.map((income) => {
      const cells = byFamily.map((g) => {
        const row = g.rows.find((r) => r.income === income);
        return row
          ? `<td class="num"><a href="${row.slug}/">${yen(row.safeLimit)}円</a></td>`
          : `<td class="num note">対象外</td>`;
      });
      return `<tr><th>年収${Math.round(income / 10_000)}万円</th>${cells.join("")}</tr>`;
    }).join("\n    ")}
    </tbody>
  </table>`;

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ふるさと納税 上限額 早見表｜年収別・家族構成別（2026年対応）</title>
<meta name="description" content="年収200万円〜1500万円 × 家族構成別のふるさと納税 控除上限額の早見表。2026年（令和8年）の制度に対応した概算。各セルから詳しい計算内訳ページに移動できます。">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="お金の制度計算ツール">
<meta property="og:locale" content="ja_JP">
<meta property="og:type" content="website">
<meta property="og:title" content="ふるさと納税 上限額 早見表｜年収別・家族構成別（2026年対応）">
<meta property="og:description" content="年収200万円〜1500万円 × 家族構成別のふるさと納税 控除上限額の早見表。2026年（令和8年）の制度に対応した概算。">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "お金の制度計算ツール", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "ふるさと納税 上限額早見表", item: url },
    ],
  },
  null,
  2
)}
</script>
<link rel="stylesheet" href="../style.css">
</head>
<body>
${header(1)}
<main>
  <nav class="crumbs" aria-label="パンくず">
    <a href="../index.html">ホーム</a> › <span>ふるさと納税 上限額早見表</span>
  </nav>

  <h1>ふるさと納税 上限額 <span class="accent">早見表</span><br>年収別・家族構成別（2026年対応）</h1>
  <p class="lede">自己負担2,000円に収まる控除上限額の目安を、年収と家族構成の組み合わせでまとめました。金額をタップすると、その条件の計算内訳・近隣年収との比較ページに移動します。</p>

  <p><a class="btn-link" href="../furusato.html">▶ 表に無い年収で計算する（無料シミュレーター）</a></p>

  <div class="card" style="overflow-x:auto">
    ${table}
    <p class="note">社会保険に加入する給与所得者で、住宅ローン控除・医療費控除等の他の控除が無い場合の概算です。「対象外」は住民税の所得割が発生せず、ふるさと納税による控除が受けられない目安の帯です。<strong>16歳未満の子どもは扶養控除の対象外</strong>のため扶養親族の人数に含めていません。</p>
  </div>

  ${adBlock()}

  <h2>関連ページ</h2>
  <div class="card">
    <ul>
      <li><a href="../furusato.html">ふるさと納税シミュレーター（寄付の記録・ワンストップ期限アラート付き）</a></li>
      <li><a href="../kabe.html">年収の壁・手取りシミュレーター</a></li>
    </ul>
  </div>
</main>
${footer(1)}
</body>
</html>
`;
}

function sitemapXml(pages) {
  const urls = [
    { loc: `${BASE}/`, priority: "1.0", freq: "monthly" },
    { loc: `${BASE}/furusato.html`, priority: "0.9", freq: "monthly" },
    { loc: `${BASE}/kabe.html`, priority: "0.9", freq: "monthly" },
    { loc: `${BASE}/furusato/`, priority: "0.8", freq: "monthly" },
    { loc: `${BASE}/furusato-itsumade.html`, priority: "0.7", freq: "monthly" },
    { loc: `${BASE}/onestop-guide.html`, priority: "0.7", freq: "monthly" },
    { loc: `${BASE}/kabe-106man.html`, priority: "0.7", freq: "monthly" },
    ...pages.map((p) => ({ loc: `${BASE}/furusato/${p.slug}/`, priority: "0.6", freq: "monthly" })),
    { loc: `${BASE}/legal.html`, priority: "0.3", freq: "yearly" },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

// ---- 実行 ----
const pages = allPages();
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const p of pages) {
  await mkdir(`${OUT}${p.slug}`, { recursive: true });
  await writeFile(`${OUT}${p.slug}/index.html`, pageHtml(p), "utf8");
}
await writeFile(`${OUT}index.html`, hubHtml(pages), "utf8");
await writeFile(new URL("../public/sitemap.xml", import.meta.url).pathname, sitemapXml(pages), "utf8");

const skipped = SALARY_STEPS.length * FAMILY_PATTERNS.length - pages.length;
console.log(`generated ${pages.length} pages + hub (skipped ${skipped} zero-limit combos)`);
console.log(`sitemap: ${pages.length + 8} urls`);
