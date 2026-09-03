---
name: kpi-dashboard
description: Choose the small set of metrics a business should actually watch, define them precisely, and build a recurring dashboard or weekly review. Use when the user says "what metrics should I track", "KPI", "dashboard", "経営指標", "数字を見える化", "weekly business review", or has data but no view of it. For the visual design of the charts, see dataviz. For financial statement detail, see financial-statements.
metadata:
  department: small-business
  version: 1.0.0
---

# KPI Dashboard

Most dashboards fail by showing everything. Pick few, define them exactly, and
tie each to a decision.

## Step 1 — Start from decisions, not from available data

For each candidate metric ask: **what would we do differently if this number
moved?** If there is no answer, it is not a KPI — it is trivia. Cut it.

Aim for 5–9 top-level metrics. Anything more and none of them get attention.

## Step 2 — Cover the value chain, one or two metrics per stage

| Stage | Typical metric |
|-------|----------------|
| Demand | Qualified leads, traffic from intent sources |
| Conversion | Lead→customer rate, sales cycle length |
| Revenue | New revenue, recurring revenue, average order value |
| Retention | Churn, repeat rate, net revenue retention |
| Efficiency | Gross margin, CAC payback |
| Cash | Cash balance, runway months, DSO |
| Delivery | On-time delivery, defect/incident rate |
| People | Headcount, utilization or capacity |

Pair every **volume** metric with a **quality** metric. Leads without lead
quality, or shipped features without defect rate, drives the wrong behavior —
people optimize what is measured.

## Step 3 — Define each metric to the point of being unambiguous

For each: exact formula, data source, who owns it, refresh cadence, segmentation,
and the specific inclusions/exclusions. "Active users" is not a definition;
"distinct accounts with ≥1 session in the trailing 28 days, excluding internal
and test accounts" is.

Write these definitions down once and treat them as fixed. Silently changing a
definition breaks every historical comparison and is the fastest way to lose
trust in a dashboard.

## Step 4 — Show context, never a bare number

Every metric displays: current value, prior period, trend over 8–12 periods, and
target. A number alone cannot be interpreted.

Use the `dataviz` skill for chart construction. Rules that matter here:
- Line charts for trends over time; bars for comparison across categories.
- Show enough history to distinguish signal from noise — 3 points is not a trend.
- Do not truncate a y-axis on a bar chart.
- Segment the top-line metric by the one dimension that actually drives it, rather than adding another top-level tile.

## Step 5 — Run the weekly review

The dashboard is the artifact; the review is the process. 30 minutes, same time
weekly, same agenda: metrics vs target → what moved and why → decisions taken →
owners and dates. Only discuss a metric that is off target or moved
unexpectedly; skip the green ones.

## Step 6 — Verify

- Does each metric trace to a real, queryable source? Build it and confirm the number, rather than describing what it would show.
- Does the dashboard total reconcile to the accounting system where it should (revenue, cash)? Show both figures.
- Is every metric tied to a stated decision?
- Is any metric un-owned? An un-owned metric will not be acted on.

## Step 7 — Deliver

The metric definitions document, the built dashboard (spreadsheet or HTML), the
weekly review agenda, and a note of which metrics could not yet be sourced and
what is needed to source them.
