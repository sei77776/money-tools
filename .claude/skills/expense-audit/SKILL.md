---
name: expense-audit
description: Audit spending for waste, duplicates, zombie subscriptions, price creep, and miscategorized costs, then produce a ranked savings list. Use when the user says "where is our money going", "cut costs", "audit our spend", "経費削減", "無駄な支出", "subscription audit", "reduce burn", or hands over a card statement and asks what to cancel. For projecting the effect of cuts on runway, see cash-runway-forecast.
metadata:
  department: finance
  version: 1.0.0
---

# Expense Audit

Find recoverable money in existing spend and rank it by savings-per-unit-of-pain.

## Step 1 — Load a full 12 months

Fewer than 12 months hides annual charges, which are where zombie subscriptions
live. If only a partial period is available, say what you cannot see.

Normalize to `date, vendor, amount, category, recurrence, owner`. Canonicalize
vendor names aggressively — `AWS`, `Amazon Web Services`, and `AMAZON WEB SERV`
are one vendor, and failing to merge them is the most common reason an audit
under-reports concentration.

## Step 2 — Detect patterns

Run each of these and report counts:

| Signal | How to detect |
|--------|---------------|
| **Recurring** | Same vendor, ~same amount, regular interval. Tag monthly/annual. |
| **Duplicate tooling** | Two or more vendors in the same job-to-be-done category |
| **Zombie** | Recurring charge with no owner, no recent usage, or a canceled project |
| **Price creep** | Same vendor, amount rising over the period. Show the % increase. |
| **Seat bloat** | Per-seat tools where seat count exceeds current headcount |
| **Miscategorized** | Charge whose category contradicts the vendor's actual product |
| **One-off large** | Top 20 single charges — confirm each was intended |

## Step 3 — Rank by effort-adjusted savings

For every candidate, estimate:
- **Annual savings** if actioned.
- **Switching cost** — none / low (cancel) / medium (migrate data) / high (rebuild workflow).
- **Risk** — what breaks if this goes away.

Sort by annual savings within each switching-cost tier. Present the
zero-switching-cost tier first; that is the money available this week.

Never recommend cutting something whose risk you have not stated.

## Step 4 — Verify before recommending

- Do the per-category totals sum to the statement total? Show both.
- Is any "zombie" actually load-bearing? Check the codebase, docs, or ask before recommending cancellation of infrastructure, security, insurance, or compliance spend.
- Are annual charges annualized correctly (not counted 12×)?

Flag explicitly: insurance, tax, legal, security, and compliance line items are
**not** candidates for cutting on cost grounds alone.

## Step 5 — Deliver

A ranked table: vendor, annual cost, recommendation (keep / downgrade / consolidate / cancel), annual saving, switching cost, risk, owner to confirm.

Close with three numbers: total annual spend reviewed, total identified savings,
and savings available with zero switching cost.
