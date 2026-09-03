---
name: cash-runway-forecast
description: Project cash balance forward and compute runway, burn rate, and the date cash runs out. Use when the user asks "how long can we last", "runway", "burn rate", "cash forecast", "13-week cash flow", "資金繰り表", "ランウェイ", "あと何ヶ月もつ", or wants a scenario comparison of hiring/spending decisions. For historical cash flow statements, see financial-statements. For day-to-day collection and payment timing, see cash-flow-management.
metadata:
  department: finance
  version: 1.0.0
---

# Cash Runway Forecast

Forward-looking cash model with explicit assumptions and at least three scenarios.

> **Not financial advice.** A forecast is a set of assumptions, not a prediction.
> Label it as such in the deliverable.

## Step 1 — Gather the inputs

Required:
- Current cash balance and as-of date (all accounts, listed separately).
- Last 3–6 months of actual revenue and actual spend, by month.
- Committed future outflows: payroll, rent, subscriptions, tax payments, loan repayments.
- Contracted future inflows: signed contracts, recurring revenue, receivables with due dates.

If fewer than 3 months of history exist, say so — the forecast is directional only
and you must widen the scenario spread accordingly.

## Step 2 — Separate fixed from variable

Split every outflow into:
- **Fixed / committed** — payroll, rent, insurance, debt service. Happens regardless.
- **Variable** — COGS, ad spend, contractors, usage-based infra. Scales with activity.
- **Discretionary** — the cuttable set. List it separately; it is the lever in the downside scenario.

## Step 3 — Model weekly for 13 weeks, monthly for 12–18 months

The 13-week view catches timing crunches (payroll landing before a big receivable)
that a monthly model hides. Build both.

Core recurrence:
```
closing_cash[t] = opening_cash[t] + inflows[t] − outflows[t]
runway_months   = current_cash / average_net_monthly_burn
```
Use **net** burn (outflows − inflows), not gross spend, and state which you used.

## Step 4 — Three scenarios, minimum

| Scenario | Construction |
|----------|--------------|
| **Base** | Trailing 3-month averages carried forward, plus known committed changes |
| **Downside** | Revenue −30%, collections slip 30 days, no new sales; discretionary spend held flat |
| **Upside** | Pipeline converts at stated rate; note the added variable cost it brings |

For each, report: cash-out date, months of runway, and the lowest weekly balance
(the trough matters more than the endpoint — a company can die at the trough).

## Step 5 — Verify

- Does opening cash in the model equal the actual bank balance today? Show both.
- Do the committed outflows include payroll taxes, not just net wages?
- Is there any month with a negative balance that the summary failed to mention?
- Do scenario deltas actually differ (a common bug is scenarios that produce identical output)?

## Step 6 — Deliver

Spreadsheet: `assumptions` tab first (every number a human can override in one
place), then `weekly-13`, `monthly`, `scenarios`. Chart the three scenario lines
using the `dataviz` skill's guidance.

Close with the decisions this forecast informs: what must be true to extend
runway by 3 months, and which lever is largest.
