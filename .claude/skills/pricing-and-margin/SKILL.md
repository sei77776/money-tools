---
name: pricing-and-margin
description: Set prices for services, products, or jobs from the cost and margin side — cost build-up, target margin, break-even, and raising prices on existing customers. Use when the user says "what should I charge", "am I making money on this job", "raise my prices", "値上げ", "原価計算", "利益率", "hourly rate", "quote a job". For SaaS packaging and tier strategy, see pricing (marketing). For per-customer economics, see unit-economics.
metadata:
  department: small-business
  version: 1.0.0
---

# Pricing & Margin

The operator's side of pricing: does this job or product actually make money, and
what has to change if it doesn't.

## Step 1 — Build true cost from the bottom

**Direct costs** — materials, subcontractors, delivery, payment fees, per-unit
licensing. These vary with volume.

**Labor** — use the **fully loaded** rate, not the wage:
```
loaded_hourly = (salary + employer taxes + benefits + equipment + software)
                / actually_billable_hours_per_year
```
Billable hours are far below paid hours. A 2,080-hour year with holidays, admin,
sales, and rework typically leaves 1,200–1,500 billable. Using 2,080 understates
cost by ~40% and is the single most common cause of unprofitable service pricing.

**Overhead** — rent, insurance, admin, tools, marketing. Allocate on a stated
basis (share of labor hours, share of revenue) and say which you used.

## Step 2 — Set price from margin, not markup

These are different and confusing them costs real money:
```
markup % = (price − cost) / cost
margin % = (price − cost) / price
price at target margin = cost / (1 − target_margin)
```
A 50% markup is a 33% margin. To achieve a 50% margin you need a 100% markup.
State which one you are quoting.

Then sanity-check against: what competitors charge, what the customer is willing
to pay, and the value delivered. Cost sets the **floor**, not the price. If the
cost-based floor exceeds what the market pays, the answer is not a lower margin —
it is a cost change or a different offer. Say that plainly.

## Step 3 — Break-even

```
break_even_units = fixed_costs / contribution_margin_per_unit
```
Report break-even in units **and** in months at current run rate. For a service
business, report the billable-hours-per-week required to break even; it is far
more concrete than a revenue number.

## Step 4 — Find the losing work

Run margin per job, per product, and per customer for the last 12 months. Sort
ascending. There is almost always a tail of work being done at or below cost, and
it is usually not the work people expect.

For each loser, identify the cause: underquoted, scope crept, rework, discount
given, or genuinely uneconomic. The remedy differs entirely by cause.

## Step 5 — Raising prices

- Quantify first: at current volume, a 10% price increase adds ~10% straight to profit. Model how much volume you could lose and still be better off — the answer is usually "a lot", and it changes the risk assessment.
- Give notice — 30–60 days for existing customers.
- Explain the change without over-apologizing. One sentence on why is enough.
- Grandfather selectively, with an end date, rather than permanently.
- Increase new-customer pricing first and observe conversion before touching the existing base.
- Pair the increase with something added where you can.

## Step 6 — Verify

- Is the loaded labor rate based on **billable** hours, and is that number from actual timesheets rather than an estimate?
- Are payment processing fees and refund/rework rates included?
- Is margin (not markup) what you reported? Restate the formula used.
- Does aggregate margin from this model reconcile to gross margin in the P&L? Show both — a large gap means costs are being missed somewhere.

## Step 7 — Deliver

Cost build-up per unit or job type, recommended price at target margin,
break-even, the ranked margin-by-job list with causes, and a phased plan if a
price increase is recommended.
