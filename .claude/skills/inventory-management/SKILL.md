---
name: inventory-management
description: Manage physical stock — reorder points, safety stock, ABC analysis, stock-take reconciliation, and dead inventory. Use when the user says "we ran out of stock", "how much should I order", "在庫管理", "発注点", "棚卸", "too much inventory", "stock count doesn't match", or sells physical goods. For the cash tied up in stock, see cash-flow-management.
metadata:
  department: small-business
  version: 1.0.0
---

# Inventory Management

Inventory is cash in a box. Too little loses sales; too much quietly consumes
runway. This skill sizes the trade-off with numbers.

## Step 1 — Segment with ABC analysis

Rank SKUs by annual consumption value (`unit cost × annual units`) and split:

- **A** — top ~20% of SKUs, typically ~80% of value. Tight control, frequent review, accurate forecasts.
- **B** — middle. Periodic review.
- **C** — long tail, low value. Order in bulk infrequently; the cost of managing them closely exceeds the savings.

Applying the same control to every SKU is the most common inventory error, and
ABC is the fix. State the split you found.

## Step 2 — Compute reorder points

```
lead_time_demand = average_daily_demand × lead_time_days
safety_stock     = Z × σ_demand_during_lead_time
reorder_point    = lead_time_demand + safety_stock
```

`Z` comes from the target service level (90% → 1.28, 95% → 1.65, 99% → 2.33).
Choose the service level per ABC class — 99% on a C item is expensive and rarely
worth it. State the level chosen and its cost in held stock.

Include **lead time variability**, not just demand variability. A supplier whose
lead time swings from 2 to 6 weeks needs far more safety stock than the average
alone implies, and ignoring this is why "we followed the formula and still stocked out".

Order quantity: use EOQ (`√(2DS/H)`) as a starting point, then round to the
supplier's case/pallet quantity and check it against minimum order quantities and
volume price breaks.

## Step 3 — Reconcile the count

When physical count ≠ system count, do not simply adjust the system to match.
Investigate: receiving errors, unrecorded sales or samples, damage, returns not
processed, theft, unit-of-measure mistakes (cases counted as units is a classic).

Report **shrinkage rate** by value and by SKU class, plus the count accuracy
percentage. For A items, cycle count monthly rather than waiting for an annual
stock-take — annual counts find problems too late to act on.

## Step 4 — Find the dead money

- **Slow-moving** — no sale in 90 days. Discount, bundle, or return to supplier.
- **Dead** — no sale in 180+ days. Decide actively: liquidate, write off, or accept the carrying cost with a stated reason.
- **Excess** — on hand exceeds forward demand cover. State how many months of cover each A item currently holds.

Quantify: total cash tied up in stock, and how much sits in slow/dead. That
number usually motivates action better than any recommendation.

## Step 5 — Verify

- Does inventory value in the count reconcile to the balance sheet inventory line? Show both.
- Are lead times from actual purchase history, not the supplier's stated promise?
- Does the demand history exclude stock-out periods? (Stock-outs suppress recorded demand and cause the model to under-order forever — check this explicitly.)
- Are seasonal SKUs modeled seasonally rather than on a flat average?

## Step 6 — Deliver

ABC classification, reorder point and order quantity per A and B SKU, current
stock-out and overstock exceptions, dead-stock list with a recommended action per
item, and the total cash tied up.
