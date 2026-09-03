---
name: bookkeeping-setup
description: Set up or clean up the bookkeeping foundation — chart of accounts, categorization rules, document retention, and the weekly/monthly routine. Use when the user says "set up my books", "chart of accounts", "記帳ルール", "勘定科目", "帳簿を整理したい", "my bookkeeping is a mess", "how should I categorize this". For producing statements from the books, see financial-statements. For the periodic close, see month-end-close.
metadata:
  department: finance
  version: 1.0.0
---

# Bookkeeping Setup

Get the foundation right once, so every later report is trustworthy without
re-deriving it. Most "the numbers look wrong" problems trace back to this layer.

> **Not accounting advice.** A licensed bookkeeper or accountant should approve
> the chart of accounts and any tax-relevant treatment.

## Step 1 — Establish the ground rules

- **Entity separation.** Business and personal money must not share an account. If they currently do, this is the first fix — everything downstream is unreliable until it is done, and it complicates tax positions. Say so directly.
- **Basis** — cash or accrual. Confirm which the tax filing requires.
- **Fiscal year end.**
- **Tax registrations** in effect (consumption tax / VAT / sales tax, withholding).

## Step 2 — Build a chart of accounts sized to the business

Structure:
```
1000s Assets       2000s Liabilities   3000s Equity
4000s Revenue      5000s COGS          6000s Operating expenses
```

Design rules:
- **Fewer accounts than you think.** 30–60 is plenty for a small business. A hundred-account chart guarantees inconsistent coding, and inconsistent coding is worse than coarse coding.
- Create an account only if you would act on seeing it separately. "Software" is useful; "Software — design tools" usually is not.
- Split **COGS from operating expenses** properly — without this, gross margin cannot be computed, and gross margin is the number most operating decisions need.
- Match the categories the tax return actually asks for; this saves a reclassification exercise every year.

## Step 3 — Write the categorization rules

The chart is only half of it. Write, for each recurring vendor and transaction
type, exactly which account it goes to — including the awkward ones:

- Owner draws vs salary vs loan (three different treatments, routinely confused)
- Equipment purchase: expense or capitalize? State the threshold.
- Mixed-use costs (phone, vehicle, home office): the split basis and how it is documented
- Refunds and chargebacks: against original revenue, not as an expense
- Transfers between own accounts: **never income or expense** — the most common self-service bookkeeping error, and it inflates both revenue and costs
- Payment processor deposits: gross revenue and the fee booked separately, not the net

Set up bank-feed rules for the recurring cases so consistency does not depend on
someone remembering.

## Step 4 — Documents and retention

Receipts and invoices attached to transactions, not in a shoebox. Set the
retention period from local requirements (commonly 5–10 years) and confirm it
rather than assuming. Note which documents must be kept in original form.

## Step 5 — The routine

**Weekly** (~20 min): categorize new transactions, chase missing receipts, review
uncategorized queue.
**Monthly**: reconcile every account (`bank-reconciliation`), then close
(`month-end-close`).
**Quarterly/annually**: tax filings, and a chart-of-accounts review.

The weekly cadence is what makes the monthly close cheap. A year of uncategorized
transactions costs many times more to fix than 52 short sessions.

## Step 6 — Verify

- Is any personal spending sitting in the business accounts? List it.
- Is the uncategorized/suspense account zero? If not, list what remains.
- Do inter-account transfers appear anywhere in revenue or expenses? Check specifically.
- Does every revenue account trace to an actual product or service line?
- Does the opening balance for each account tie to a statement?

## Step 7 — Deliver

The chart of accounts, the categorization rule sheet (the reference a
non-accountant actually uses), the retention policy, the routine as a checklist,
and a list of cleanup items found with the effort each requires.
