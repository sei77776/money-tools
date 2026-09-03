---
name: financial-statements
description: Build, read, or sanity-check the three core financial statements — profit & loss (income statement), balance sheet, and cash flow statement. Use when the user says "P&L", "income statement", "balance sheet", "cash flow statement", "financial statements", "決算書", "損益計算書", "貸借対照表", "キャッシュフロー計算書", or asks what a set of numbers means financially. For reconciling a bank feed to the books, see bank-reconciliation. For forward-looking projections, see cash-runway-forecast.
metadata:
  department: finance
  version: 1.0.0
---

# Financial Statements

Produce or interpret P&L, balance sheet, and cash flow statement from raw data.

> **Not accounting advice.** Output is a working draft for a human bookkeeper,
> accountant, or tax professional to review. Never file, submit, or represent
> generated statements as audited. State this in the deliverable.

## Step 1 — Establish the frame

Ask (or infer from files) before computing anything:

- **Entity and period** — which legal entity, which start/end dates.
- **Basis** — cash or accrual. This changes every number; never guess silently.
- **Currency** and whether any FX translation is involved.
- **Source of truth** — accounting export (CSV/XLSX), bank statements, or manual notes.

If the basis is unknown, assume cash basis, say so explicitly at the top of the output, and flag it.

## Step 2 — Ingest and normalize

1. Read the source with the `xlsx` skill for spreadsheets, `pdf` for scanned statements.
2. Normalize to one tidy table: `date, account, description, debit, credit, amount, category`.
3. Report the row count and date range you actually parsed. If rows were dropped, list them — never silently discard.

## Step 3 — Build the statements

**P&L** (period activity):
```
Revenue
  − Cost of revenue        → Gross profit
  − Operating expenses     → Operating income (EBIT)
  ± Other income/expense
  − Tax                    → Net income
```

**Balance sheet** (point in time): `Assets = Liabilities + Equity`. Compute the
difference explicitly; if it is non-zero, stop and report the imbalance rather
than plugging it.

**Cash flow** (indirect method): start from net income, add back non-cash items
(depreciation, amortization, stock comp), then adjust for working-capital
movements (AR, AP, inventory, deferred revenue), then investing, then financing.
Ending cash must tie to the balance sheet cash line — check this and say whether it ties.

## Step 4 — Verify before presenting

Run all of these and report each as pass/fail with the actual numbers:

- Balance sheet balances (A − L − E = 0).
- Cash flow ending cash == balance sheet cash.
- Gross margin and net margin are within a plausible range for the business type; flag outliers.
- No account appears in the P&L that belongs on the balance sheet (and vice versa).
- Period totals reconcile to the source file's own totals, if it has any.

Do not describe the statements as "done" until every check above has been run.

## Step 5 — Deliver

Output as a spreadsheet via the `xlsx` skill (one tab per statement, plus a
`source-data` tab) unless the user asked for markdown. Always include:

- Basis, period, currency, and source file names.
- A short "what changed and why" narrative — 3–5 bullets, plain language.
- An **open questions** list of every assumption you had to make.
