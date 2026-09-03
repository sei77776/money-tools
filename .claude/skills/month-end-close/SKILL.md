---
name: month-end-close
description: Run a structured month-end or quarter-end close checklist — accruals, prepaids, depreciation, cut-off checks, and sign-off. Use when the user says "month-end close", "close the books", "月次決算", "月次締め", "quarter close", "closing checklist", or asks what needs to happen before financials are final. For matching bank lines, see bank-reconciliation. For producing the statements, see financial-statements.
metadata:
  department: finance
  version: 1.0.0
---

# Month-End Close

A repeatable close checklist that produces a signed-off, defensible period.

> **Not accounting advice.** A qualified human must sign off before the period
> is treated as closed.

## Step 1 — Set the period and freeze the scope

Confirm the period end date and state a cut-off rule: transactions dated on or
before period end belong in this period, regardless of when they were entered.
Anything entered after close needs a documented post-close adjustment.

## Step 2 — Work the checklist in order

Each item gets a status of **done / blocked / n-a**, with evidence. Do not mark
an item done without naming the file or figure that proves it.

**Cash**
- [ ] Every bank and card account reconciled (run `bank-reconciliation` per account)
- [ ] Payment processor payouts (Stripe/PayPal/Square) tied to deposits, fees booked separately
- [ ] Petty cash / expense card counts agreed

**Revenue**
- [ ] All invoices for the period issued and posted
- [ ] Deferred revenue rolled — recognize what was delivered, defer what was not
- [ ] Refunds, credits, and chargebacks booked in the correct period

**Expenses**
- [ ] Unbilled vendor costs accrued (services received but no invoice yet)
- [ ] Prepaids amortized (annual insurance, software, rent paid in advance)
- [ ] Payroll accrued through period end, including employer taxes and unused-leave liability
- [ ] Credit card statement expenses coded, not sitting in suspense

**Balance sheet**
- [ ] Fixed asset additions capitalized; depreciation run
- [ ] Loan balances agreed to lender statement; interest split from principal
- [ ] Every balance sheet account has a supporting schedule that ties
- [ ] Suspense/clearing accounts are zero — if not, list what remains

**Tax**
- [ ] Sales tax / VAT / consumption tax liability computed and booked
- [ ] Withholding and payroll tax liabilities agreed to filings

## Step 3 — Review for reasonableness

Produce a month-over-month P&L comparison and investigate any line that moves
more than 20% or ¥/$ threshold agreed with the user. Write one sentence per
flagged line explaining the cause. "Unknown" is an acceptable answer only when
paired with a named follow-up owner.

## Step 4 — Verify before declaring close

- Balance sheet balances.
- Trial balance debits == credits.
- No item on the checklist is silently skipped — count done + blocked + n-a and confirm it equals the total.
- Every blocked item has an owner and a reason.

Report the count of blocked items prominently. **A close with open items is not
a completed close** — say so rather than presenting it as finished.

## Step 5 — Deliver

- Completed checklist with evidence column.
- Journal entries proposed this period, each with a one-line rationale.
- Flux analysis (the reasonableness review).
- Carry-forward list for next month.
