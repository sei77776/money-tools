/**
 * 2026年（令和8年）分の制度パラメータ一元管理。
 *
 * 出典の凡例（照合日: 2026-08-07）:
 *   [大綱]    令和8年度税制改正大綱（令和7年12月26日閣議決定、財務省
 *             https://www.mof.go.jp/tax_policy/tax_reform/outline/fy2026/20251226taikou.pdf ）
 *             および同大綱の解説（SmartHR Mag., マネーフォワード, 山田&パートナーズ等で相互確認）
 *   [年金法]  年金制度改正法（2025年6月成立）: 短時間労働者の賃金要件
 *             （月8.8万円）を2026年10月に撤廃。企業規模要件は2027年10月から段階的撤廃
 *   [general] 従来から安定している税制（所得税速算表・復興特別所得税・住民税10%等）
 *   [approx]  本ツールの概算モデル上の仮定値（自治体・保険者により変動）
 *
 * ⚠ 大綱ベースの数値は施行政省令で細部が変わり得る。改正法成立・施行
 *   （2026年12月1日施行、令和8年分の年末調整から適用）時に再照合すること。
 */
export const PARAMS = {
  year: 2026,

  // 給与所得控除 [大綱] 最低保障 65万→69万円（恒久・物価連動）
  // ＋令和8・9年分は特例で5万円上乗せ = 74万円
  salaryDeduction: {
    min: 740_000,
    max: 1_950_000, // [general]
    brackets: [
      // [general] 上限・率の骨格（令和2年分以降の体系）
      { upTo: 1_800_000, rate: 0.4, add: -100_000 },
      { upTo: 3_600_000, rate: 0.3, add: 80_000 },
      { upTo: 6_600_000, rate: 0.2, add: 440_000 },
      { upTo: 8_500_000, rate: 0.1, add: 1_100_000 },
      { upTo: Infinity, rate: 0, add: 1_950_000 },
    ],
  },

  // 所得税の基礎控除 [大綱] 令和8・9年分。恒久分58万→62万円＋所得階層別の特例上乗せ
  // 74万（給与所得控除）+104万（基礎控除）= 178万円が所得税の非課税ライン
  incomeTaxBasicDeductionBrackets: [
    { totalIncomeUpTo: 4_890_000, amount: 1_040_000 },
    { totalIncomeUpTo: 6_550_000, amount: 670_000 },
    { totalIncomeUpTo: 23_500_000, amount: 620_000 },
    // [general] 2,350万円超の逓減・消失は従来体系ベースの概算（対象ユーザー極少・要確認）
    { totalIncomeUpTo: 24_000_000, amount: 480_000 },
    { totalIncomeUpTo: 24_500_000, amount: 320_000 },
    { totalIncomeUpTo: 25_000_000, amount: 160_000 },
    { totalIncomeUpTo: Infinity, amount: 0 },
  ],

  // 住民税 [大綱で据え置きを確認] 基礎控除は最大43万円のまま変更なし
  residentTax: {
    basicDeduction: 430_000,
    rate: 0.1, // [general]
    perCapita: 5_000, // [approx] 均等割＋森林環境税の概算。自治体により異なる
  },

  // 所得税の速算表 [general]
  incomeTaxBrackets: [
    { upTo: 1_950_000, rate: 0.05, deduct: 0 },
    { upTo: 3_300_000, rate: 0.1, deduct: 97_500 },
    { upTo: 6_950_000, rate: 0.2, deduct: 427_500 },
    { upTo: 9_000_000, rate: 0.23, deduct: 636_000 },
    { upTo: 18_000_000, rate: 0.33, deduct: 1_536_000 },
    { upTo: 40_000_000, rate: 0.4, deduct: 2_796_000 },
    { upTo: Infinity, rate: 0.45, deduct: 4_796_000 },
  ],
  reconstructionSurtax: 1.021, // [general] 復興特別所得税（〜2037年）

  // 社会保険料 [approx] 健康保険＋厚生年金＋雇用保険の本人負担の概算率
  socialInsuranceRate: 0.15,

  // 社会保険の加入ルール [年金法]
  // 2026年10月〜: 賃金要件（月8.8万円≒年106万円）撤廃。
  // 対象事業所（従業員51人以上）では週20時間以上で加入（年収は無関係に）。
  // 2027年10月〜: 企業規模要件を段階的撤廃、2029年10月に5人以上へ。
  socialInsurance: {
    dependentLimit: 1_300_000, // 130万円: 被扶養者認定の年収基準（未加入者の壁）
    hoursRule: {
      effectiveFrom: "2026-10-01",
      weeklyHours: 20,
      companySizeThreshold: 51,
    },
  },

  // 扶養控除の概算 [general] 一般の扶養親族・配偶者控除相当
  dependentDeduction: {
    incomeTax: 380_000,
    residentTax: 330_000,
  },

  // 年収の壁 [大綱/年金法]（金額で表せる壁のみ。週20時間ルールは socialInsurance 参照）
  walls: [
    {
      amount: 1_300_000,
      key: "shakaihoken-130",
      label: "130万円の壁（扶養）",
      note: "配偶者等の社会保険の被扶養者から外れ、自身で保険料を負担（勤務先で加入していない場合）",
    },
    {
      amount: 1_780_000,
      key: "shotokuzei-178",
      label: "178万円の壁（所得税）2026年〜",
      note: "給与所得控除74万円＋基礎控除104万円（令和8年度税制改正大綱）。2026年12月1日施行・令和8年分の年末調整から適用",
    },
  ],

  // ふるさと納税 [general/大綱]
  furusato: {
    minSelfPay: 2_000,
    specialDeductionCap: 0.2, // 住民税所得割の20%
    // [大綱] 令和8年度改正で特例控除額に193万円の定額上限を新設
    // （給与収入約1億円規模から影響。一般的な収入層には影響なし）
    specialDeductionAbsoluteCap: 1_930_000,
    oneStopDeadline: { month: 1, day: 10 }, // [general] 翌年1月10日必着（総務省ポータル）
  },
};
