/**
 * ふるさと納税の控除上限額（概算）。
 * 上限 ≒ 住民税所得割 × 20% ÷ (90% − 所得税限界税率 × 1.021) ＋ 2,000円
 * 概算・目安であり、正確な額は源泉徴収票・住民税決定通知書に基づく確認が必要。
 */
import { PARAMS } from "./params2026.js";
import {
  employmentIncome,
  socialInsurance,
  taxableIncomeForIncomeTax,
  marginalRate,
  residentTaxIncomePortion,
} from "./income.js";

/**
 * @param {number} annualIncome 給与収入（額面）
 * @param {{dependents?: number, insured?: boolean}} opts
 *   dependents: 扶養親族の人数（配偶者控除相当を含む概算）
 *   insured: 社会保険加入（既定 true = 会社員）
 * @returns {{limit: number, safeLimit: number, breakdown: object}}
 */
export function furusatoLimit(annualIncome, { dependents = 0, insured = true } = {}) {
  const social = socialInsurance(annualIncome, { insured });
  const depIT = dependents * PARAMS.dependentDeduction.incomeTax;
  const depRT = dependents * PARAMS.dependentDeduction.residentTax;

  const taxableIT = taxableIncomeForIncomeTax(annualIncome, social, depIT);
  const rate = marginalRate(taxableIT);
  const portion = residentTaxIncomePortion(annualIncome, social, depRT);

  const { minSelfPay, specialDeductionCap, specialDeductionAbsoluteCap } = PARAMS.furusato;
  const denom = 0.9 - rate * PARAMS.reconstructionSurtax;
  // 特例控除は「所得割×20%」かつ定額上限193万円（令和8年度改正）の小さい方まで
  const specialCap = Math.min(portion * specialDeductionCap, specialDeductionAbsoluteCap);
  const limit = portion <= 0 ? 0 : Math.floor(specialCap / denom + minSelfPay);
  const safeLimit = Math.floor(limit / 1000) * 1000;

  return {
    limit,
    safeLimit,
    breakdown: {
      employmentIncome: employmentIncome(annualIncome),
      socialInsurance: social,
      taxableIncomeTax: taxableIT,
      marginalRate: rate,
      residentTaxIncomePortion: portion,
    },
  };
}
