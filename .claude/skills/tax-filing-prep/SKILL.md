---
name: tax-filing-prep
description: Assemble and check the document package an accountant needs for a tax filing, and flag items that need a professional decision. Use when the user says "tax time", "確定申告", "決算準備", "prepare for my accountant", "what documents does my accountant need", "year-end tax". This prepares the package; it does not compute or file the return. For the underlying books, see bookkeeping-setup. For the period close, see month-end-close.
metadata:
  department: finance
  version: 1.0.0
---

# Tax Filing Preparation

**Scope: assembling and sanity-checking the package.** This skill does not
compute tax liability, choose treatments, or prepare a return.

> **Not tax advice.** Tax rules are jurisdiction-specific, change annually, and
> carry penalties when wrong. A licensed tax professional must prepare and file.
> Never state a rate, threshold, or deduction eligibility from memory — if a
> figure is needed, look it up and cite the source and date, or leave it as a
> question for the accountant. State this disclaimer in the deliverable.

## Step 1 — Confirm the basics

Entity type, fiscal year, jurisdictions with a filing obligation, filing
deadlines (and any extension already filed), and which registrations are active.
Note the deadline prominently at the top — everything else is scheduling
backwards from it.

## Step 2 — Close the period first

A tax package built on unclosed books produces questions the accountant bills
for. Run `month-end-close` for the final period and `bank-reconciliation` for
every account before assembling anything.

## Step 3 — Assemble the package

**Financial statements** — P&L, balance sheet, cash flow for the year, plus the
trial balance and general ledger export.

**Bank and card** — all statements for all accounts, full year, including
accounts closed mid-year (routinely forgotten).

**Revenue** — sales by month, invoice list, payment processor annual summaries,
any tax-form summaries received from platforms.

**Expenses** — expense detail by category, receipts for large items, and the
documented basis for any mixed personal/business split.

**Payroll** — annual payroll summary, filings made, contractor payments and the
associated information returns.

**Assets** — fixed asset register, purchases and disposals during the year,
depreciation schedule, loan statements with the interest/principal split.

**Other** — prior-year return, correspondence from tax authorities, changes in
ownership or structure, foreign accounts or income.

## Step 4 — Flag what needs a professional decision

Do not resolve these — list them as questions:

- Equipment purchases near the capitalization threshold
- Home office, vehicle, and travel treatment
- Owner compensation: salary vs draw vs dividend
- Bad debts to write off
- Inventory valuation method
- Any new activity, jurisdiction, or entity change during the year
- Anything treated differently from last year, and why

## Step 5 — Verify the package before handing it over

- Do the statements tie to the trial balance?
- Are all twelve months of statements present for every account, including closed ones?
- Do revenue totals agree with the payment processor and platform summaries? List any difference with the amount.
- Are there uncategorized transactions remaining? Count them.
- Does the prior-year closing balance sheet equal this year's opening? Show both.
- Is anything still missing? List it explicitly rather than delivering a package that reads complete.

## Step 6 — Deliver

An indexed document package, the open-questions list for the accountant, the
reconciliation checks with actual figures, and a clear statement of what is still
outstanding. An honestly incomplete package is more useful than one that looks
finished and is not.
