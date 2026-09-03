---
name: budget-variance
description: Compare actual results against budget or forecast, quantify each variance, and explain the drivers. Use when the user says "budget vs actual", "variance analysis", "we're over budget", "why did we spend more than planned", "予算実績差異", "予実管理", or asks how performance compared to plan. For building the forward plan, see cash-runway-forecast. For the underlying actuals, see financial-statements.
metadata:
  department: finance
  version: 1.0.0
---

# Budget vs Actual (Variance Analysis)

Explain the gap between plan and reality in terms a decision-maker can act on.

## Step 1 — Align the two datasets

The most common failure in variance analysis is comparing two things that were
never comparable. Before computing anything, confirm:

- Same period boundaries.
- Same accounting basis (cash vs accrual) on both sides.
- Same chart of accounts, or an explicit mapping if the budget used different names.
- Same entity/department scope.

If any of these differ, state the reconciliation you applied.

## Step 2 — Compute variances

For every line:
```
variance      = actual − budget
variance_%    = variance / |budget|
favorable?    revenue: actual > budget → favorable
              expense: actual < budget → favorable
```
Always label direction as **favorable/unfavorable**, never just positive/negative —
a positive expense variance is bad news, and unlabeled signs get misread.

## Step 3 — Filter to what matters

Apply a materiality threshold — the default is: flag a line if it exceeds
**both** 10% and a currency floor the user sets (e.g. ¥100,000 / $1,000). This
keeps the report short enough to be read. State the threshold used.

## Step 4 — Decompose the drivers

For each material variance, split it. A single number is not an explanation.

- **Volume vs rate** — `(actual_qty − budget_qty) × budget_price` is the volume effect; `(actual_price − budget_price) × actual_qty` is the rate effect. Show both.
- **Timing vs permanent** — did the spend shift into another period, or is it genuinely new? Timing variances reverse; permanent ones change the full-year outlook.
- **One-off vs run-rate** — a run-rate miss compounds; a one-off does not.

Only the run-rate, permanent variances should change the forecast. Say which ones do.

## Step 5 — Verify

- Do budget totals sum to the approved budget document? Show both.
- Do actuals tie to the P&L for the same period?
- Do individual line variances sum to the total variance? (Rounding aside — if not, a mapping is wrong.)
- Is each material variance explained by something other than a restatement of the number itself?

## Step 6 — Deliver

Table: line item, budget, actual, variance, variance %, F/U, driver, timing-or-permanent, owner.

Then a short narrative: the three largest variances, what they mean for the
full-year outlook, and the revised full-year estimate if run-rate variances persist.
