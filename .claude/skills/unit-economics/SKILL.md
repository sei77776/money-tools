---
name: unit-economics
description: Compute and stress-test per-unit or per-customer economics — CAC, LTV, payback period, contribution margin, churn impact. Use when the user asks "are we profitable per customer", "CAC", "LTV", "LTV:CAC", "payback period", "contribution margin", "ユニットエコノミクス", "顧客獲得単価", or wants to know whether growth is worth funding. For pricing changes, see pricing (marketing) or pricing-and-margin (small business).
metadata:
  department: finance
  version: 1.0.0
---

# Unit Economics

Determine whether one more customer makes the business better or worse off.

> **Not financial advice.** Every ratio here depends on definitions; state yours.

## Step 1 — Define the unit, explicitly

A "unit" may be a customer, an account, an order, a subscription seat, or a
delivered job. Ambiguity here invalidates everything downstream. Write the
chosen definition at the top of the output and get agreement before computing.

## Step 2 — Build contribution margin bottom-up

```
Revenue per unit
  − direct COGS (hosting, materials, fulfillment, payment fees)
  − variable support/service cost
  = Contribution margin per unit   (and as % of revenue)
```

Payment processing fees and refunds/chargebacks are routinely omitted — include
them and say so. Do **not** allocate fixed overhead here; that belongs in the P&L,
not in unit economics.

## Step 3 — CAC, honestly

```
CAC = (all sales + marketing spend in period) / (new customers acquired in period)
```

Two common distortions to check and disclose:
- **Blended vs paid CAC** — blended includes organic customers, flattering the number. Report both.
- **Lag** — spend in month N acquires customers in month N+1. If the sales cycle exceeds ~30 days, offset the periods and say you did.

Salaries of sales and marketing staff belong in CAC. If you excluded them, flag it.

## Step 4 — LTV, with the model stated

Subscription:  `LTV = contribution_margin_per_period / churn_rate_per_period`
Transactional: `LTV = avg_margin_per_order × orders_per_year × expected_years`

Rules:
- Use **margin**, never revenue. Revenue-based LTV is the most common error in this analysis.
- If churn is below ~2%/month on under 12 months of data, the LTV is unstable — cap the horizon at 36 months and say why.
- Report the churn definition (logo churn vs revenue churn) — they differ, often materially.

## Step 5 — The verdicts

| Metric | Compute | Rough read |
|--------|---------|-----------|
| LTV:CAC | LTV / CAC | <1 destroys value; ~3 is a common healthy target |
| CAC payback | CAC / monthly contribution margin | months until the customer repays acquisition |
| Contribution margin % | CM / revenue | must be positive before scale helps anything |

State plainly: **does growth currently create or destroy cash?** If contribution
margin is negative, say that scaling makes things worse — do not soften it.

## Step 6 — Sensitivity

Recompute LTV:CAC and payback at: churn ±50%, CAC ±30%, contribution margin ±20%.
Show which single input the conclusion is most fragile to. If the verdict flips
inside a plausible input range, the honest answer is "not yet determinable" —
say that.
