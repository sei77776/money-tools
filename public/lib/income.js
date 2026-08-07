/**
 * 給与収入まわりの概算計算。全て概算・目安であり税務助言ではない。
 * 制度数値は params2026.js に一元化されている。
 */
import { PARAMS } from "./params2026.js";

const floor1000 = (n) => Math.floor(n / 1000) * 1000;

/** 給与所得控除（2026年モデル） */
export function salaryIncomeDeduction(income) {
  const { min, max, brackets } = PARAMS.salaryDeduction;
  const b = brackets.find((br) => income <= br.upTo);
  const raw = income * b.rate + b.add;
  return Math.min(Math.max(raw, min), max);
}

/** 給与所得 = 収入 − 給与所得控除 */
export function employmentIncome(income) {
  return Math.max(0, income - salaryIncomeDeduction(income));
}

/** 社会保険料の概算（本人負担） */
export function socialInsurance(income, { insured }) {
  return insured ? Math.round(income * PARAMS.socialInsuranceRate) : 0;
}

/** 所得税の基礎控除（令和8年度大綱: 合計所得の階層別 104万/67万/62万…） */
export function incomeTaxBasicDeduction(totalIncome) {
  return PARAMS.incomeTaxBasicDeductionBrackets.find(
    (b) => totalIncome <= b.totalIncomeUpTo
  ).amount;
}

/** 所得税の課税所得（1,000円未満切り捨て） */
export function taxableIncomeForIncomeTax(income, social, extraDeduction = 0) {
  const emp = employmentIncome(income);
  const basic = incomeTaxBasicDeduction(emp);
  return floor1000(Math.max(0, emp - social - basic - extraDeduction));
}

/** 所得税額（速算表・復興税除く） */
export function incomeTax(taxable) {
  if (taxable <= 0) return 0;
  const b = PARAMS.incomeTaxBrackets.find((br) => taxable <= br.upTo);
  return Math.floor(taxable * b.rate - b.deduct);
}

/** 限界税率（ふるさと納税の特例控除計算に使用） */
export function marginalRate(taxable) {
  if (taxable <= 0) return 0;
  return PARAMS.incomeTaxBrackets.find((br) => taxable <= br.upTo).rate;
}

/** 復興特別所得税込みの所得税額（浮動小数点誤差を避けるため整数演算） */
export function incomeTaxWithSurtax(taxable) {
  const surtaxPerMille = Math.round(PARAMS.reconstructionSurtax * 1000);
  return Math.floor((incomeTax(taxable) * surtaxPerMille) / 1000);
}

/** 住民税の所得割（概算・調整控除は考慮しない） */
export function residentTaxIncomePortion(income, social, extraDeduction = 0) {
  const p = PARAMS.residentTax;
  const taxable = floor1000(
    Math.max(0, employmentIncome(income) - social - p.basicDeduction - extraDeduction)
  );
  return Math.floor(taxable * p.rate);
}

/** 住民税額（所得割＋均等割の概算。所得割0なら非課税とみなし0円） */
export function residentTax(income, social, extraDeduction = 0) {
  const portion = residentTaxIncomePortion(income, social, extraDeduction);
  return portion > 0 ? portion + PARAMS.residentTax.perCapita : 0;
}

/** 手取りの概算 */
export function netIncome(income, { insured }) {
  const social = socialInsurance(income, { insured });
  const it = incomeTaxWithSurtax(taxableIncomeForIncomeTax(income, social));
  const rt = residentTax(income, social);
  return income - social - it - rt;
}
